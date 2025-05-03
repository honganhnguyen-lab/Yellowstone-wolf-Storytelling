(async function () {
  const map = L.map("map", { minZoom: 7, maxZoom: 14 });
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap"
  }).addTo(map);

  const [parkGeo, wolvesRaw, geoCSV] = await Promise.all([
    d3.json("wolf-reintroduction/yellowstone.geojson"),
    d3.csv("wolf-reintroduction/yellowstone.csv", d3.autoType),
    d3.dsv(";", "wolf-reintroduction/wolf_geo.csv", d3.autoType)
  ]);

  const parkLayer = L.geoJSON(parkGeo, {
    style: { color: "crimson", weight: 2, fill: false }
  }).addTo(map);
  map.fitBounds(parkLayer.getBounds().pad(0.1));

  const locByName = new Map(
    geoCSV
      .filter((d) => d["Birth Location"] && !isNaN(d.Lat) && !isNaN(d.Long))
      .map((d) => [
        d["Birth Location"].trim().toLowerCase(),
        { lat: +d.Lat, lon: +d.Long }
      ])
  );

  const wolves = wolvesRaw.map((w) => {
    const raw = String(w["Birth Location"] || "")
      .trim()
      .toLowerCase();
    let coords = locByName.get(raw);
    if (!coords) {
      for (const [key, c] of locByName) {
        if (key.includes(raw) || raw.includes(key)) {
          coords = c;
          break;
        }
      }
    }
    return { ...w, lat: coords?.lat ?? null, lon: coords?.lon ?? null };
  });

  const rollup = d3.rollups(
    wolves,
    (v) => v.length,
    (d) => d["Birth Year"],
    (d) => d["Birth Pack"],
    (d) => d["Birth Location"] || ""
  );
  const data = [];
  for (const [year, packs] of rollup) {
    for (const [pack, locs] of packs) {
      for (const [loc, count] of locs) {
        const w = wolves.find(
          (w) =>
            w["Birth Year"] === year &&
            w["Birth Pack"] === pack &&
            String(w["Birth Location"] || "").trim() === loc
        );
        if (w && w.lat != null) {
          data.push({
            year,
            pack,
            location: loc,
            count,
            lat: w.lat,
            lon: w.lon
          });
        }
      }
    }
  }

  L.svg().addTo(map);
  const svg = d3.select(map.getPanes().overlayPane).select("svg");
  const g = svg.append("g").attr("class", "wolf-overlay");

  const palette = [
    "#B9A38F",
    "#A7A58E",
    "#A0AA91",
    "#3B6D3A",
    "#676437",
    "#916937",
    "#5F3820",
    "#AA6C49",
    "#CB7D47",
    "#000000",
    "#FFFFFF"
  ];
  const packs = Array.from(new Set(data.map((d) => d.pack)));
  const color = d3.scaleOrdinal().domain(packs).range(palette);

  const years = [
    "1995",
    "1996",
    "1997",
    "1998",
    "1999",
    "2000",
    "2001",
    "2002",
    "2003",
    "2004",
    "2005",
    "2006",
    "2007",
    "2008",
    "2009",
    "2010"
  ];
  let currentYear = "1995";

  function draw(year) {
    const pts = data.filter((d) => d.year.toString() === year.toString());
    const pawPoints = [];

    pts.forEach((d) => {
      const center = map.latLngToLayerPoint([d.lat, d.lon]);
      const spacing = 10;
      for (let i = 0; i < d.count; i++) {
        const angle = i * 137.5 * (Math.PI / 180);
        const radius = spacing * Math.sqrt(i);
        const px = center.x + radius * Math.cos(angle);
        const py = center.y + radius * Math.sin(angle);
        const latlng = map.layerPointToLatLng([px, py]);
        pawPoints.push({
          lat: latlng.lat,
          lon: latlng.lng,
          pack: d.pack,
          id: d.pack + "|" + d.location + "|" + i
        });
      }
    });

    const sel = g.selectAll("use").data(pawPoints, (d) => d.id);
    sel.exit().remove();

    const enter = sel
      .enter()
      .append("use")
      .attr("xlink:href", "#paw-icon")
      .style("fill", (d) => color(d.pack))
      .attr("transform", (d) => {
        const p = map.latLngToLayerPoint([d.lat, d.lon]);
        return `translate(${p.x},${p.y}) scale(0.015) translate(-540,-640)`;
      });

    sel
      .merge(enter)
      .attr("xlink:href", "#paw-icon")
      .style("fill", (d) => color(d.pack))
      .transition()
      .duration(500)
      .attr("transform", (d) => {
        const p = map.latLngToLayerPoint([d.lat, d.lon]);
        return `translate(${p.x},${p.y}) scale(0.015) translate(-540,-640)`;
      });
  }

  map.on("zoom move", () => {
    g.selectAll("use").attr("transform", (d) => {
      const p = map.latLngToLayerPoint([d.lat, d.lon]);
      return `translate(${p.x},${p.y}) scale(0.015) translate(-540,-640)`;
    });
  });

  const rangeInput = document.getElementById("year-slider");
  const yearDisplay = document.getElementById("current-year");
  const legendYear = document.getElementById("legend-year");
  const legendPacks = document.getElementById("legend-packs");
  const legendWolves = document.getElementById("legend-wolves");
  const playBtn = document.getElementById("play-toggle");

  function updateUI(year) {
    const pts = data.filter((d) => d.year.toString() === year.toString());
    const uniquePacks = new Set(pts.map((d) => d.pack));
    const totalWolves = d3.sum(pts, (d) => d.count);
    yearDisplay.textContent = year;
    legendYear.textContent = `Showing data for ${year}`;
    legendPacks.textContent = `Total packs: ${uniquePacks.size}`;
    legendWolves.textContent = `Total wolves: ${totalWolves}`;
  }

  rangeInput.min = 0;
  rangeInput.max = years.length - 1;
  rangeInput.value = 0;

  rangeInput.addEventListener("input", () => {
    const idx = +rangeInput.value;
    currentYear = years[idx];
    draw(currentYear);
    updateUI(currentYear);
  });

  let playing = false;
  let intervalId = null;

  playBtn.addEventListener("click", () => {
    playing = !playing;
    playBtn.textContent = playing ? "Pause" : "Play";
    if (playing) {
      intervalId = setInterval(() => {
        let idx = years.indexOf(currentYear);
        if (idx < years.length - 1) {
          idx++;
          currentYear = years[idx];
          rangeInput.value = idx;
          draw(currentYear);
          updateUI(currentYear);
        } else {
          clearInterval(intervalId);
          playing = false;
          playBtn.textContent = "Play";
        }
      }, 1000);
    } else {
      clearInterval(intervalId);
    }
  });

  draw(currentYear);
  updateUI(currentYear);
})();
