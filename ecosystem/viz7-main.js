// Initialize scrollama
const scroller = scrollama();

// Set up visualization space
const margin1 = { top: 50, right: 40, bottom: 50, left: 60 };
const width1 = 600 - margin1.left - margin1.right;
const height1 = 480 - margin1.top - margin1.bottom;

// Color palette from the Yellowstone/nature theme
const colors = {
    elk: "#916937",
    wolf: "#3B6D3A",
    aspen: "#A0AA91",
    cottonwood: "#B9A38F",
    willow: "#A7A58E",
    beaver: "#CB7D47",
    songbird: "#5F3820",
    stream: "#676437"
};

// Create main svg container
const svg1 = d3.select("#chart1")
    .append("svg")
    .attr("width", width1 + margin1.left + margin1.right)
    .attr("height", height1 + margin1.top + margin1.bottom)
    .append("g")
    .attr("transform", `translate(${margin1.left},${margin1.top})`);

// Function to clear previous charts
function clearChart() {
    svg1.selectAll("*").remove();
}

// Add chart title
function addTitle(title) {
    svg1.append("text")
        .attr("x", width1 / 2)
        .attr("y", -25)
        .attr("text-anchor", "middle")
        .attr("class", "chart-title")
        .text(title);
}

// Step 1: Ecosystem in Crisis (1995)
function drawEcosystemCrisis() {
    clearChart();
    addTitle("Yellowstone Ecosystem in Crisis (1995)");
    
    // Set up scales for bar chart
    const x = d3.scaleBand()
        .domain(["Elk", "Aspen", "Cottonwood"])
        .range([0, width1])
        .padding(0.3);
    
    // Use different scales for large elk numbers and small plant measures
    const yElk = d3.scaleLinear()
        .domain([0, 18000])
        .range([height1, 0]);
    
    const yPlants = d3.scaleLinear()
        .domain([0, 100])
        .range([height1, 0]);
    
    // Add X axis
    svg1.append("g")
        .attr("transform", `translate(0,${height1})`)
        .call(d3.axisBottom(x));
    
    // Add Y axis for elk
    svg1.append("g")
        .call(d3.axisLeft(yElk));
    
    // Add Y axis for plants (right side)
    svg1.append("g")
        .attr("transform", `translate(${width1},0)`)
        .call(d3.axisRight(yPlants));
    
    // Bars for each element
    // Elk bar
    svg1.append("rect")
        .attr("x", x("Elk"))
        .attr("y", yElk(16791))
        .attr("width", x.bandwidth())
        .attr("height", height1 - yElk(16791))
        .attr("fill", colors.elk)
        .attr("opacity", 0)
        .transition()
        .duration(800)
        .attr("opacity", 0.8);
    
    // Aspen bar
    svg1.append("rect")
        .attr("x", x("Aspen"))
        .attr("y", yPlants(50))
        .attr("width", x.bandwidth())
        .attr("height", height1 - yPlants(50))
        .attr("fill", colors.aspen)
        .attr("opacity", 0)
        .transition()
        .delay(300)
        .duration(800)
        .attr("opacity", 0.8);
    
    // Cottonwood bar
    svg1.append("rect")
        .attr("x", x("Cottonwood"))
        .attr("y", yPlants(1))
        .attr("width", x.bandwidth())
        .attr("height", height1 - yPlants(1))
        .attr("fill", colors.cottonwood)
        .attr("opacity", 0)
        .transition()
        .delay(600)
        .duration(800)
        .attr("opacity", 0.8);
    
    // Add value labels
    svg1.append("text")
        .attr("x", x("Elk") + x.bandwidth()/2)
        .attr("y", yElk(16791) - 15)
        .attr("text-anchor", "middle")
        .attr("opacity", 0)
        .text("16,791")
        .transition()
        .delay(800)
        .duration(500)
        .attr("opacity", 1);
    
    svg1.append("text")
        .attr("x", x("Aspen") + x.bandwidth()/2)
        .attr("y", yPlants(50) - 15)
        .attr("text-anchor", "middle")
        .attr("opacity", 0)
        .text("50cm")
        .transition()
        .delay(1000)
        .duration(500)
        .attr("opacity", 1);
    
    svg1.append("text")
        .attr("x", x("Cottonwood") + x.bandwidth()/2)
        .attr("y", yPlants(1) - 15)
        .attr("text-anchor", "middle")
        .attr("opacity", 0)
        .text("0 trees")
        .transition()
        .delay(1200)
        .duration(500)
        .attr("opacity", 1);
    
    // Add axis labels
    svg1.append("text")
        .attr("class", "y axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -height1 / 2)
        .attr("y", -margin1.left + 15) // to the left of the axis
        .style("text-anchor", "middle")
        .text("Elk Population")
        .attr("fill", colors.elk);
    
    svg1.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height1/ 2)
        .attr("y", width1 + margin1.right - 1)
        .style("text-anchor", "middle")
        .text("Plant Height (cm) / Count")
        .attr("fill", colors.aspen);
}

// Step 2: Wolves Return (1995-2003)
function drawWolvesReturn() {
    clearChart();
    addTitle("Wolves Return & Elk Decline (1995-2023)");
    
    // Create scales
    const x = d3.scaleLinear()
        .domain([1995, 2023])
        .range([0, width1]);
    
    const yElk = d3.scaleLinear()
        .domain([0, 18000])
        .range([height1, 0]);
    
    const yWolf = d3.scaleLinear()
        .domain([0, 200])
        .range([height1, 0]);
    
    // Add X axis
    svg1.append("g")
        .attr("transform", `translate(0,${height1})`)
        .call(d3.axisBottom(x).tickFormat(d3.format("d")));
    
    // Add Y axis for elk (left)
    svg1.append("g")
        .call(d3.axisLeft(yElk));
    
    // Add Y axis for wolves (right)
    svg1.append("g")
        .attr("transform", `translate(${width1},0)`)
        .call(d3.axisRight(yWolf));
    
    // Add axis labels
    svg1.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height1 / 2)
        .attr("y", -margin1.left + 15)
        .style("text-anchor", "middle")
        .attr("fill", "#916937")
        .text("Elk Population")
        .attr("fill", colors.elk);
    
    svg1.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height1 / 2)
        .attr("y", width1 + margin1.right - 4)
        .style("text-anchor", "middle")
        .attr("fill", "#3B6D3A")
        .text("Wolf Population")
        .attr("fill", colors.wolf);
    
    // Draw elk line
    const elkLine = d3.line()
        .x(d => x(d.year))
        .y(d => yElk(d.value));
    
    const elkData = [
        {year: 1995, value: 16791},
        {year: 2003, value: 10000},
        {year: 2010, value: 6070},
        {year: 2023, value: 6651}
    ];
    
    svg1.append("path")
        .datum(elkData)
        .attr("fill", "none")
        .attr("stroke", colors.elk)
        .attr("stroke-width", 3)
        .attr("d", elkLine)
        .attr("opacity", 0)
        .transition()
        .duration(1000)
        .attr("opacity", 1);
    
    // Draw wolf line
    const wolfLine = d3.line()
        .x(d => x(d.year))
        .y(d => yWolf(d.value));
    
    const wolfData = [
        {year: 1995, value: 21},
        {year: 2003, value: 174},
        {year: 2010, value: 97},
        {year: 2023, value: 124}
    ];
    
    svg1.append("path")
        .datum(wolfData)
        .attr("fill", "none")
        .attr("stroke", colors.wolf)
        .attr("stroke-width", 3)
        .attr("d", wolfLine)
        .attr("opacity", 0)
        .transition()
        .delay(1000)
        .duration(1000)
        .attr("opacity", 1);
    
    // Add data points with values
    elkData.forEach((d, i) => {
        // Circles for elk data points
        svg1.append("circle")
            .attr("cx", x(d.year))
            .attr("cy", yElk(d.value))
            .attr("r", 6)
            .attr("fill", colors.elk)
            .attr("opacity", 0)
            .transition()
            .delay(1200 + i * 200)
            .duration(500)
            .attr("opacity", 1);
        
        // Labels for elk values
        svg1.append("text")
            .attr("x", x(d.year))
            .attr("y", yElk(d.value) - 15)
            .attr("text-anchor", "middle")
            .text(d.value)
            .attr("opacity", 0)
            .transition()
            .delay(1400 + i * 200)
            .duration(500)
            .attr("opacity", 1);
    });
    
    wolfData.forEach((d, i) => {
        // Circles for wolf data points
        svg1.append("circle")
            .attr("cx", x(d.year))
            .attr("cy", yWolf(d.value))
            .attr("r", 6)
            .attr("fill", colors.wolf)
            .attr("opacity", 0)
            .transition()
            .delay(1600 + i * 200)
            .duration(500)
            .attr("opacity", 1);
        
        // Labels for wolf values
        svg1.append("text")
            .attr("x", x(d.year))
            .attr("y", yWolf(d.value) - 15)
            .attr("text-anchor", "middle")
            .text(d.value)
            .attr("opacity", 0)
            .transition()
            .delay(1800 + i * 200)
            .duration(500)
            .attr("opacity", 1);
    });
}

// Step 3: Vegetation Recovery (2010)
function drawVegetationRecovery() {
    clearChart();
    addTitle("Forest Recovery (2010-2020)");
    
    // Set up scales
    const x = d3.scaleBand()
        .domain(["Aspen", "Cottonwood", "Willow"])
        .range([0, width1])
        .padding(0.3);
    
    const y = d3.scaleLinear()
        .domain([0, 400])
        .range([height1, 0]);
    
    // Add X axis
    svg1.append("g")
        .attr("transform", `translate(0,${height1})`)
        .call(d3.axisBottom(x));
    
    // Add Y axis
    svg1.append("g")
        .call(d3.axisLeft(y));
    
    // Add axis labels
    svg1.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("x", -height1/2)
        .attr("text-anchor", "middle")
        .text("Height (cm) / Count");
    
    // Grouped bar chart - before and after for each species
    // Aspen bars
    svg1.append("rect") // 1998 (before)
        .attr("x", x("Aspen"))
        .attr("y", y(50))
        .attr("width", x.bandwidth() / 2 - 5)
        .attr("height", height1 - y(50))
        .attr("fill", "#e0e0d1")
        .attr("opacity", 0.3);
    
    svg1.append("rect") // 2020 (after)
        .attr("x", x("Aspen") + x.bandwidth() / 2 + 5)
        .attr("y", y(350))
        .attr("width", x.bandwidth() / 2 - 5)
        .attr("height", height1 - y(350))
        .attr("fill", "#A0AA91")
        .attr("opacity", 0)
        .transition()
        .duration(1000)
        .attr("opacity", 0.9);
    
    // Cottonwood bars
    svg1.append("rect") // 2001 (before)
        .attr("x", x("Cottonwood"))
        .attr("y", y(1))
        .attr("width", x.bandwidth() / 2 - 5)
        .attr("height", height1 - y(1))
        .attr("fill", "#e0e0d1")
        .attr("opacity", 0.3);
    
    svg1.append("rect") // 2010 (after)
        .attr("x", x("Cottonwood") + x.bandwidth() / 2 + 5)
        .attr("y", y(156))
        .attr("width", x.bandwidth() / 2 - 5)
        .attr("height", height1 - y(156))
        .attr("fill", "#A0AA91")
        .attr("opacity", 0)
        .transition()
        .delay(300)
        .duration(1000)
        .attr("opacity", 0.9);
    
    // Willow bars
    svg1.append("rect") // 1995 (before)
        .attr("x", x("Willow"))
        .attr("y", y(50))
        .attr("width", x.bandwidth() / 2 - 5)
        .attr("height", height1 - y(50))
        .attr("fill", "#e0e0d1")
        .attr("opacity", 0.3);
    
    svg1.append("rect") // 2020 (after)
        .attr("x", x("Willow") + x.bandwidth() / 2 + 5)
        .attr("y", y(350))
        .attr("width", x.bandwidth() / 2 - 5)
        .attr("height", height1 - y(350))
        .attr("fill", "#A0AA91")
        .attr("opacity", 0)
        .transition()
        .delay(600)
        .duration(1000)
        .attr("opacity", 0.9);
    
    // Add labels
    // Aspen labels
    svg1.append("text")
        .attr("x", x("Aspen") + x.bandwidth() / 4)
        .attr("y", y(50) - 10)
        .attr("text-anchor", "middle")
        .text("50cm")
        .attr("opacity", 0.6);
    
    svg1.append("text")
        .attr("x", x("Aspen") + 3 * x.bandwidth() / 4 + 5)
        .attr("y", y(350) - 10)
        .attr("text-anchor", "middle")
        .text("350cm")
        .attr("opacity", 0)
        .transition()
        .delay(1000)
        .duration(500)
        .attr("opacity", 1);
    
    // Cottonwood labels
    svg1.append("text")
        .attr("x", x("Cottonwood") + x.bandwidth() / 4)
        .attr("y", y(1) - 10)
        .attr("text-anchor", "middle")
        .text("0")
        .attr("opacity", 0.6);
    
    svg1.append("text")
        .attr("x", x("Cottonwood") + 3 * x.bandwidth() / 4 + 5)
        .attr("y", y(156) - 10)
        .attr("text-anchor", "middle")
        .text("156")
        .attr("opacity", 0)
        .transition()
        .delay(1300)
        .duration(500)
        .attr("opacity", 1);
    
    // Willow labels
    svg1.append("text")
        .attr("x", x("Willow") + x.bandwidth() / 4)
        .attr("y", y(50) - 10)
        .attr("text-anchor", "middle")
        .text("50cm")
        .attr("opacity", 0.6);
    
    svg1.append("text")
        .attr("x", x("Willow") + 3 * x.bandwidth() / 4 + 5)
        .attr("y", y(350) - 10)
        .attr("text-anchor", "middle")
        .text("350cm")
        .attr("opacity", 0)
        .transition()
        .delay(1600)
        .duration(500)
        .attr("opacity", 1);

    // Legend data
    const legendData = [
        { label: "Early After Wolves (1995-1998)", color: "#e0e0d1" },
        { label: "After Wolves (2010-2020)", color: "#A0AA91" }
    ];
    
    const legendItemHeight = 25;
    const legendItemWidth = 215;
    const legendPadding = 7;
    const legendWidth = legendItemWidth + legendPadding * 2;
    const legendHeight = legendData.length * legendItemHeight + legendPadding * 1.5;
    
    // Center the legend group
    const legendGroup = svg1.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${(width1 - legendWidth) / 2 + 35}, -15)`);
    
    // Draw the border/background
    legendGroup.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .attr("fill", "#faf9f6")
        .attr("stroke", "#ccc")
        .attr("stroke-width", 2)
        .attr("rx", 10)
        .attr("ry", 10);
    
    // Add each legend item as a group, vertically stacked
    const legendItems = legendGroup.selectAll(".legend-item")
        .data(legendData)
        .enter()
        .append("g")
        .attr("class", "legend-item")
        .attr("transform", (d, i) => `translate(${legendPadding}, ${legendPadding + i * legendItemHeight})`);
    
    legendItems.append("rect")
        .attr("width", 12)
        .attr("height", 12)
        .attr("fill", d => d.color)
        .attr("stroke", "#bbb")
        .attr("stroke-width", 1);
    
    legendItems.append("text")
        .attr("x", 20)
        .attr("y", 10)
        .attr("font-size", "1.8em")
        .attr("fill", "#333")
        .text(d => d.label);  

}

// Step 4: Complete Ecosystem Recovery
function drawEcosystemRecovery() {
    clearChart();
    addTitle("Ecosystem Balance Restored (2020)");
    
    // Set up scales
    const x = d3.scaleBand()
        .domain(["Beaver", "Songbird", "Stream", "Bison"])
        .range([0, width1])
        .padding(0.3);
    
    const y = d3.scaleLinear()
        .domain([0, 30])
        .range([height1, 0]);
    
    // Add X axis
    svg1.append("g")
        .attr("transform", `translate(0,${height1})`)
        .call(d3.axisBottom(x));

    // Change font size of x-axis tick labels
    svg1.selectAll(".tick text")
        .style("font-family", "'Inter', Arial, sans-serif")
        .style("font-size", "12px");
    
    // Add Y axis
    svg1.append("g")
        .call(d3.axisLeft(y));
    
    // Grouped bar chart - before and after
    // Beaver bars
    svg1.append("rect") // 1995 (before)
        .attr("x", x("Beaver"))
        .attr("y", y(1))
        .attr("width", x.bandwidth() / 2 - 5)
        .attr("height", height1 - y(1))
        .attr("fill", "#aaa")
        .attr("opacity", 0.3);
    
    svg1.append("rect") // 2020 (after)
        .attr("x", x("Beaver") + x.bandwidth() / 2 + 5)
        .attr("y", y(25))
        .attr("width", x.bandwidth() / 2 - 5)
        .attr("height", height1 - y(25))
        .attr("fill", colors.beaver)
        .attr("opacity", 0)
        .transition()
        .duration(1000)
        .attr("opacity", 0.9);
    
    // Songbird bars
    svg1.append("rect") // 1995 (before)
        .attr("x", x("Songbird"))
        .attr("y", y(2))
        .attr("width", x.bandwidth() / 2 - 5)
        .attr("height", height1 - y(2))
        .attr("fill", "#aaa")
        .attr("opacity", 0.3);
    
    svg1.append("rect") // 2020 (after)
        .attr("x", x("Songbird") + x.bandwidth() / 2 + 5)
        .attr("y", y(8))
        .attr("width", x.bandwidth() / 2 - 5)
        .attr("height", height1 - y(8))
        .attr("fill", colors.beaver)
        .attr("opacity", 0)
        .transition()
        .delay(300)
        .duration(1000)
        .attr("opacity", 0.9);
    
    // Stream bars (erosion - lower is better)
    svg1.append("rect") // 1995 (before)
        .attr("x", x("Stream"))
        .attr("y", y(8))
        .attr("width", x.bandwidth() / 2 - 5)
        .attr("height", height1 - y(8))
        .attr("fill", "#aaa")
        .attr("opacity", 0.3);
    
    svg1.append("rect") // 2020 (after)
        .attr("x", x("Stream") + x.bandwidth() / 2 + 5)
        .attr("y", y(2))
        .attr("width", x.bandwidth() / 2 - 5)
        .attr("height", height1 - y(2))
        .attr("fill", colors.beaver)
        .attr("opacity", 0)
        .transition()
        .delay(600)
        .duration(1000)
        .attr("opacity", 0.9);
    
    // Bison bars
    svg1.append("rect") // 1995 (before)
        .attr("x", x("Bison"))
        .attr("y", y(7))
        .attr("width", x.bandwidth() / 2 - 5)
        .attr("height", height1 - y(7))
        .attr("fill", "#aaa")
        .attr("opacity", 0.3);
    
    svg1.append("rect") // 2010 (after)
        .attr("x", x("Bison") + x.bandwidth() / 2 + 5)
        .attr("y", y(14))
        .attr("width", x.bandwidth() / 2 - 5)
        .attr("height", height1 - y(14))
        .attr("fill", colors.beaver)
        .attr("opacity", 0)
        .transition()
        .delay(900)
        .duration(1000)
        .attr("opacity", 0.9);
    
    // Add labels
    // Beaver labels
    svg1.append("text")
        .attr("x", x("Beaver") + x.bandwidth() / 4)
        .attr("y", y(1) - 10)
        .attr("text-anchor", "middle")
        .text("1")
        .attr("opacity", 0.6);
    
    svg1.append("text")
        .attr("x", x("Beaver") + 3 * x.bandwidth() / 4 + 5)
        .attr("y", y(25) - 10)
        .attr("text-anchor", "middle")
        .text("25")
        .attr("opacity", 0)
        .transition()
        .delay(1000)
        .duration(500)
        .attr("opacity", 1);
    
    // Songbird labels
    svg1.append("text")
        .attr("x", x("Songbird") + x.bandwidth() / 4)
        .attr("y", y(2) - 10)
        .attr("text-anchor", "middle")
        .text("2")
        .attr("opacity", 0.6);
    
    svg1.append("text")
        .attr("x", x("Songbird") + 3 * x.bandwidth() / 4 + 5)
        .attr("y", y(8) - 10)
        .attr("text-anchor", "middle")
        .text("8")
        .attr("opacity", 0)
        .transition()
        .delay(1300)
        .duration(500)
        .attr("opacity", 1);
    
    // Stream labels
    svg1.append("text")
        .attr("x", x("Stream") + x.bandwidth() / 4)
        .attr("y", y(8) - 10)
        .attr("text-anchor", "middle")
        .text("8")
        .attr("opacity", 0.6);
    
    svg1.append("text")
        .attr("x", x("Stream") + 3 * x.bandwidth() / 4 + 5)
        .attr("y", y(2) - 10)
        .attr("text-anchor", "middle")
        .text("2")
        .attr("opacity", 0)
        .transition()
        .delay(1600)
        .duration(500)
        .attr("opacity", 1);
    
    // Bison labels
    svg1.append("text")
        .attr("x", x("Bison") + x.bandwidth() / 4)
        .attr("y", y(7) - 10)
        .attr("text-anchor", "middle")
        .text("708")
        .attr("opacity", 0.6);
    
    svg1.append("text")
        .attr("x", x("Bison") + 3 * x.bandwidth() / 4 + 5)
        .attr("y", y(14) - 10)
        .attr("text-anchor", "middle")
        .text("1,385")
        .attr("opacity", 0)
        .transition()
        .delay(1900)
        .duration(500)
        .attr("opacity", 1);
    
    // Add descriptions for context
    svg1.append("text")
        .attr("x", x("Beaver") + x.bandwidth() / 2)
        .attr("y", height1 + 30)
        .attr("text-anchor", "middle")
        .text("Colonies")
        .style("font-size", "12px");
    
    svg1.append("text")
        .attr("x", x("Songbird") + x.bandwidth() / 2)
        .attr("y", height1 + 30)
        .attr("text-anchor", "middle")
        .text("Diversity (index)")
        .style("font-size", "12px");
    
    svg1.append("text")
        .attr("x", x("Stream") + x.bandwidth() / 2)
        .attr("y", height1 + 30)
        .attr("text-anchor", "middle")
        .text("Erosion (rating)")
        .style("font-size", "12px");
    
    svg1.append("text")
        .attr("x", x("Bison") + x.bandwidth() / 2)
        .attr("y", height1 + 30)
        .attr("text-anchor", "middle")
        .text("Population")
        .style("font-size", "12px");

      
    // Legend data
    const legendData = [
        { label: "Before Wolves (1995)", color: "#aaa", opacity: 0.3 },
        { label: "After Wolves (2020)", color: colors.beaver, opacity: 0.9 }
    ];
    
    const legendItemHeight = 20;
    const legendPadding = 6;
    const legendWidth = 160;
    const legendHeight = legendData.length * legendItemHeight + legendPadding * 2;
    
    // Position legend in top right (adjust as needed)
    const legendGroup = svg1.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${width1 - legendWidth - 10}, 10)`);
    
    // Box
    legendGroup.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .attr("fill", "#faf9f6")
        .attr("stroke", "#ccc")
        .attr("stroke-width", 1.5)
        .attr("rx", 8)
        .attr("ry", 8);

    
    // Items
    const legendItems = legendGroup.selectAll(".legend-item")
        .data(legendData)
        .enter()
        .append("g")
        .attr("class", "legend-item")
        .attr("transform", (d, i) => `translate(${legendPadding}, ${legendPadding + 6 + i * legendItemHeight})`);
    
    legendItems.append("rect")
        .attr("width", 12)
        .attr("height", 12)
        .attr("fill", d => d.color)
        .attr("opacity", d => d.opacity)
        .attr("stroke", "#bbb")
        .attr("stroke-width", 1);
    
    legendItems.append("text")
        .attr("x", 18)
        .attr("y", 10)
        .attr("font-size", "12px")
        .attr("fill", "#333")
        .text(d => d.label);
  
}

// Set up scrollama instance
function initScrollama() {
    scroller
        .setup({
            step: ".step1",
            offset: 0.6,
            debug: false
        })
        .onStepEnter(handleStepEnter);
    
    // Handle window resize
    window.addEventListener("resize", scroller.resize);
}

// Handle step transitions
function handleStepEnter(response) {
    // Update the active step
    d3.selectAll(".step1").classed("is-active", false);
    d3.select(response.element).classed("is-active", true);
    
    // Update chart based on step
    const step = response.element.dataset.step;
    switch(step) {
        case "elk":
            drawEcosystemCrisis();
            break;
        case "wolves":
            drawWolvesReturn();
            break;
        case "vegetation":
            drawVegetationRecovery();
            break;
        case "beaver":
            drawEcosystemRecovery();
            break;
    }
}

// Load data and initialize visualization
d3.csv("ecosystem/yellowstone_ecology.csv").then(function(data) {
    // Initialize visualization with first step
    initScrollama();
    drawEcosystemCrisis();
}).catch(function(error) {
    console.error("Error loading the CSV file:", error);
});
