// Year summaries for the right panel
const yearSummaries = {
    1995: {
        title: "1995",
        subtitle: "The Return of Wolves",
        desc: "After nearly 70 years, 41 wolves were reintroduced to Yellowstone. Elk populations, unchecked for decades, had soared to over 16,000 and were drastically altering the landscape."
    },
    2003: {
        title: "2003",
        subtitle: "Wolf population peaks, elk declining",
        desc: "Wolf numbers reached 174, their highest since reintroduction. Elk populations began to drop, and the first signs of ecological recovery appeared along Yellowstone's streams."
    },
    2013: {
        title: "2013",
        subtitle: "Ecosystem Recovery",
        desc: "Elk hit a historic low of 3,915. Willows and aspens rebounded, beavers returned, and a richer diversity of birds and fish was observed."
    },
    2023: {
        title: "2023",
        subtitle: "Balance Restored",
        desc: "Today, both wolf (124) and elk (6,651) populations have stabilized. Yellowstone's ecosystem is more balanced and diverse than it has been in a century."
    }
};

// Loading and processing data
d3.csv("population-shift/elk_wolf_population_filled.csv").then(rawData => {
    // Parsing numeric data
    rawData.forEach(d => {
        d.year = +d.Year;
        d.wolves = +d['Total numbers of Wolves'];
        d.elk = +d['Elk Population'];
    });
    
    // Filtering out rows with missing data
    const data = rawData.filter(d => !isNaN(d.year) && !isNaN(d.wolves) && !isNaN(d.elk));

    // Chart dimensions
    const margin = {top: 30, right: 70, bottom: 50, left: 70};
    const chartWidth = 480, chartHeight = 255;

    // Creating SVG
    const svg = d3.select("#population-chart")
        .append("svg")
        .attr("width", chartWidth + margin.left + margin.right)
        .attr("height", chartHeight + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Creating scales
    const x = d3.scaleLinear()
        .domain(d3.extent(data, d => d.year))
        .range([0, chartWidth]);

    const yElk = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.elk) * 1.1])
        .range([chartHeight, 0]);

    const yWolf = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.wolves) * 1.4])
        .range([chartHeight, 0]);

    // Creating line and area generators
    const areaElk = d3.area()
        .x(d => x(d.year))
        .y0(chartHeight)
        .y1(d => yElk(d.elk))
        .curve(d3.curveMonotoneX);

    const areaWolf = d3.area()
        .x(d => x(d.year))
        .y0(chartHeight)
        .y1(d => yWolf(d.wolves))
        .curve(d3.curveMonotoneX);

    const lineElk = d3.line()
        .x(d => x(d.year))
        .y(d => yElk(d.elk))
        .curve(d3.curveMonotoneX);

    const lineWolf = d3.line()
        .x(d => x(d.year))
        .y(d => yWolf(d.wolves))
        .curve(d3.curveMonotoneX);

    // Drawing areas and lines
    svg.append("path")
        .attr("class", "area-elk")
        .attr("d", areaElk(data));

    svg.append("path")
        .attr("class", "area-wolf")
        .attr("d", areaWolf(data));

    svg.append("path")
        .attr("class", "line-elk")
        .attr("d", lineElk(data));

    svg.append("path")
        .attr("class", "line-wolf")
        .attr("d", lineWolf(data));

    // Adding axes
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0,${chartHeight})`)
        .call(d3.axisBottom(x).tickFormat(d3.format("d")));

    svg.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(yElk));

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(${chartWidth},0)`)
        .call(d3.axisRight(yWolf));

    // Adding axis labels
    svg.append("text")
        .attr("class", "axis-label")
        .attr("x", chartWidth / 2)
        .attr("y", chartHeight + 40)
        .style("text-anchor", "middle")
        .text("Year");

    svg.append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("y", -60)
        .attr("x", -chartHeight / 2)
        .style("text-anchor", "middle")
        .text("Elk Population");

    svg.append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(90)")
        .attr("y", -chartWidth - 55)
        .attr("x", chartHeight / 2)
        .style("text-anchor", "middle")
        .text("Wolf Population");

    // Adding legend
    const legend = svg.append("g")
        .attr("transform", `translate(${chartWidth - 100}, 10)`);

    legend.append("rect")
        .attr("width", 18)
        .attr("height", 18)
        .attr("fill", "#7aa0c0");
    legend.append("text")
        .attr("x", 24)
        .attr("y", 13)
        .text("Elk");

    legend.append("rect")
        .attr("width", 18)
        .attr("height", 18)
        .attr("y", 28)
        .attr("fill", "#6a8e5a");
    legend.append("text")
        .attr("x", 24)
        .attr("y", 41)
        .text("Wolves");

    // Vertical lines for key years
    const keyYears = [1995, 2003, 2013, 2023];
    svg.selectAll(".vline")
        .data(keyYears)
        .enter()
        .append("line")
        .attr("class", "vline")
        .attr("x1", d => x(d))
        .attr("x2", d => x(d))
        .attr("y1", 0)
        .attr("y2", chartHeight)
        .attr("stroke", "#ccc")
        .attr("stroke-width", 1.5)
        .attr("stroke-dasharray", "5,5");

    // Annotation group
    const annotationGroup = svg.append("g");

    // Updating visualization for a given year
    function updateVisualization(year) {
        // Updating year card
        const summary = yearSummaries[year];
        document.getElementById('year-card').innerHTML = `
            <h2>${summary.title}</h2>
            <h3>${summary.subtitle}</h3>
            <p>${summary.desc}</p>
        `;

        // Highlighting vertical line
        svg.selectAll(".vline")
            .attr("stroke", d => d === year ? "#4a6741" : "#ccc")
            .attr("stroke-width", d => d === year ? 3 : 1.5);

        // Removing old annotations
        annotationGroup.selectAll("*").remove();

        // Get data for the selected year
        const d = data.find(d => d.year === year);
        if (!d) return;

        // Calculating positions
        const elkY = yElk(d.elk);
        const wolfY = yWolf(d.wolves);
        // Calculating y position for the year label (above the higher of elk/wolf points)
        const yearLabelY = -12; 

        const isOverlap = Math.abs(elkY - wolfY) < 30;

        // Drawing annotation circles
        annotationGroup.append("circle")
            .attr("cx", x(d.year))
            .attr("cy", elkY)
            .attr("r", 8)
            .attr("fill", "#3a6ea5")
            .attr("stroke", "#fff")
            .attr("stroke-width", 2);

        annotationGroup.append("circle")
            .attr("cx", x(d.year))
            .attr("cy", wolfY)
            .attr("r", 8)
            .attr("fill", "#4a6741")
            .attr("stroke", "#fff")
            .attr("stroke-width", 2);

        // Adding annotation labels
        if (isOverlap) {
            // Positioning labels to avoid overlap
            annotationGroup.append("text")
                .attr("class", "annotation")
                .attr("x", x(d.year) - 70)
                .attr("y", elkY - 10)
                .text(`Elk: ${d.elk}`);

            annotationGroup.append("text")
                .attr("class", "annotation")
                .attr("x", x(d.year) + 15)
                .attr("y", wolfY - 10)
                .text(`Wolves: ${d.wolves}`);
        } else {
            annotationGroup.append("text")
                .attr("class", "annotation")
                .attr("x", x(d.year) - 25)
                .attr("y", elkY + 20)
                .text(`Elk: ${d.elk}`);

            annotationGroup.append("text")
                .attr("class", "annotation")
                .attr("x", x(d.year) - 25)
                .attr("y", wolfY - 10)
                .text(`Wolves: ${d.wolves}`);
        }

        // Displaying the year number above the vertical line
        annotationGroup.append("text")
            .attr("class", "year-label")
            .attr("x", x(d.year))
            .attr("y", yearLabelY)
            .attr("text-anchor", "middle")
            .attr("font-size", "1.2rem")
            .attr("font-weight", "bold")
            .attr("fill", "#4a6741")
            .text(year);
    }

    // Setting up intersection observer for scrollytelling
    const markers = document.querySelectorAll('.year-marker');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const year = entry.target.dataset.year;
            if (entry.isIntersecting) {
                if (year === "end") {
                    // Hide year card and chart
                    document.getElementById("year-card").style.opacity = 0;
                    document.getElementById("population-chart").style.opacity = 0;
                } else {
                    // Show and update year card and chart
                    document.getElementById("year-card").style.opacity = 1;
                    document.getElementById("population-chart").style.opacity = 1;
                    updateVisualization(Number(year));
                }
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '-25% 0px -25% 0px'
    });
    

    // Observing year markers
    markers.forEach(marker => observer.observe(marker));

    updateVisualization(1995);
});
