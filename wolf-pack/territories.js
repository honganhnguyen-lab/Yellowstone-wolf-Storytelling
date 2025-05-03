const mapPack = L.map("map-pack").setView([44.6, -110.5], 8);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors"
}).addTo(mapPack);

let wolfLayer;
let activeFilter = null;
const color = d3.scaleOrdinal(d3.schemeTableau10);

Promise.all([
  fetch("wolf-reintroduction/yellowstone.geojson").then((res) => res.json()),
  fetch("wolf-pack/wolf_pack_territories_latlng.geojson").then((res) =>
    res.json()
  )
]).then(([parkData, wolfData]) => {
  L.geoJSON(parkData, {
    style: {
      color: "#3388ff",
      weight: 2,
      fillOpacity: 0.1
    }
  }).addTo(mapPack);

  const packNames = new Set();

  const originalWolfData = JSON.parse(JSON.stringify(wolfData));

  wolfLayer = L.geoJSON(wolfData, {
    style: (feature) => ({
      fillColor: color(feature.properties.pack),
      color: "#333",
      weight: 1,
      fillOpacity: 0.5
    }),
    onEachFeature: (feature, layer) => {
      layer.bindPopup(`<strong>${feature.properties.pack}</strong>`);
      packNames.add(feature.properties.pack);
    }
  }).addTo(mapPack);

  createLegend(Array.from(packNames), color, originalWolfData);
});

function filterWolfPacks(packName, originalWolfData) {
  if (activeFilter === packName) {
    resetFilter(originalWolfData);
    return;
  }

  activeFilter = packName;

  mapPack.removeLayer(wolfLayer);

  const filteredData = {
    type: "FeatureCollection",
    features: originalWolfData.features.filter(
      (feature) => feature.properties.pack === packName
    )
  };

  wolfLayer = L.geoJSON(filteredData, {
    style: (feature) => ({
      fillColor: color(feature.properties.pack),
      color: "#333",
      weight: 1,
      fillOpacity: 0.7
    }),
    onEachFeature: (feature, layer) => {
      layer.bindPopup(`<strong>${feature.properties.pack}</strong>`);
    }
  }).addTo(mapPack);

  updateLegendStyles(packName);
}

function resetFilter(originalWolfData) {
  activeFilter = null;

  mapPack.removeLayer(wolfLayer);

  wolfLayer = L.geoJSON(originalWolfData, {
    style: (feature) => ({
      fillColor: color(feature.properties.pack),
      color: "#333",
      weight: 1,
      fillOpacity: 0.5
    }),
    onEachFeature: (feature, layer) => {
      layer.bindPopup(`<strong>${feature.properties.pack}</strong>`);
    }
  }).addTo(mapPack);

  updateLegendStyles(null);
}

function updateLegendStyles(activePack) {
  document.querySelectorAll(".legend-item").forEach((item) => {
    const packName = item.getAttribute("data-pack");
    if (activePack === null) {
      item.classList.remove("legend-item-active");
      item.classList.remove("legend-item-inactive");
    } else if (packName === activePack) {
      item.classList.add("legend-item-active");
      item.classList.remove("legend-item-inactive");
    } else {
      item.classList.add("legend-item-inactive");
      item.classList.remove("legend-item-active");
    }
  });
}

function createLegend(packNames, colorScale, originalWolfData) {
  const legendContent = document.getElementById("legend-content");
  packNames.sort();

  packNames.forEach((packName) => {
    const item = document.createElement("div");
    item.className = "legend-item";
    item.setAttribute("data-pack", packName);

    const colorBox = document.createElement("div");
    colorBox.className = "color-box";
    colorBox.style.backgroundColor = colorScale(packName);

    const nameSpan = document.createElement("span");
    nameSpan.className = "pack-name";
    nameSpan.textContent = packName;

    item.appendChild(colorBox);
    item.appendChild(nameSpan);
    legendContent.appendChild(item);

    item.addEventListener("click", () =>
      filterWolfPacks(packName, originalWolfData)
    );
  });
}
