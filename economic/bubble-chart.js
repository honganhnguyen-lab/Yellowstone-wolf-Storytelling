// Bubble chart to visualize economic components
// Make sure this script is loaded after the main script.js

// Global reference to the bubble chart SVG
let bubbleSvg;

// Function to create the bubble chart
function createBubbleChart() {
    // Select the container
    const bubbleContainer = document.getElementById('bubble-container');
    if (!bubbleContainer) {
        console.error("Bubble container not found!");
        return;
    }
    
    // Clear previous content
    d3.select("#bubble-container").html("");
    
    // Set up dimensions
    const margin = {top: 60, right: 20, bottom: 40, left: 40};
    const width = bubbleContainer.clientWidth - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
    
    // Create SVG
    bubbleSvg = d3.select("#bubble-container")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // Make sure global variables from main script are available
    if (typeof economicData === 'undefined' || typeof totalOutput === 'undefined') {
        console.error("Required data not available. Make sure script.js is loaded first.");
        return;
    }
    
    // Prepare data for bubble chart
    // We'll create three categories: Input (Visitor Spending), Components (Sectors), and Output
    const bubbleData = [];
    
    // Add visitor spending as input
    bubbleData.push({
        name: "Visitor Spending",
        category: "Input",
        value: totalOutput, // Equal to total output in the system
        jobs: totalJobs,
        laborIncome: totalLaborIncome,
        valueAdded: totalValueAdded
    });
    
    // Add all sectors as components
    economicData.forEach(sector => {
        bubbleData.push({
            name: sector.sector,
            category: "Components",
            value: sector.output,
            jobs: sector.jobs,
            laborIncome: sector.laborIncome,
            valueAdded: sector.valueAdded,
            percentage: (sector.output / totalOutput * 100).toFixed(1)
        });
    });
    
    // Add total economic output
    bubbleData.push({
        name: "Economic Output",
        category: "Output",
        value: totalOutput,
        jobs: totalJobs,
        laborIncome: totalLaborIncome,
        valueAdded: totalValueAdded
    });
    
    // Set up color scale based on the existing sector colors
    const categoryColors = {
        "Input": COLORS.beige,
        "Components": COLORS.lightGreen,
        "Output": COLORS.beige
    };
    
    // Use existing sector colors for components
    const bubbleColorScale = d => {
        if (d.category === "Components") {
            return sectorColors[d.name] || COLORS.lightGreen;
        }
        return categoryColors[d.category];
    };
    
    // Set up x scale (categorical, with Input, Components, Output)
    const x = d3.scalePoint()
        .domain(["Input", "Components", "Output"])
        .range([0, width])
        .padding(0.5);
    
    // Create Y scale for visual distribution within each category
    const y = d3.scalePoint()
        .domain(bubbleData.map(d => d.name))
        .range([50, height - 50]);
    
    // Scale for bubble size
    const sizeScale = d3.scaleSqrt()
        .domain([0, d3.max(bubbleData, d => d.value)])
        .range([10, 80]);
    
    // Add x axis
    bubbleSvg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("font-size", "14px")
        .style("font-weight", "bold");
    
    // Add title
    bubbleSvg.append("text")
        .attr("x", width / 2)
        .attr("y", -30)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("font-weight", "bold")
        .style("fill", COLORS.darkBrown)
        .text("Economic Flow: Visitor Spending to Economic Output");
        
    // Add subtitle
    bubbleSvg.append("text")
        .attr("x", width / 2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("fill", COLORS.brown)
        .text("Bubble size represents economic value (in billions)");
    
    // Create a group for bubbles to enable better interaction
    const bubbleGroups = bubbleSvg.selectAll(".bubble-group")
        .data(bubbleData)
        .enter()
        .append("g")
        .attr("class", "bubble-group")
        .attr("transform", d => {
            // Position bubbles along the x-axis by category
            // For components, add some random jitter to avoid overlap
            let xPos = x(d.category);
            if (d.category === "Components") {
                // Add controlled randomness for component bubbles
                xPos += (Math.random() * 0.6 - 0.3) * width * 0.2;
            }
            
            // Position along y-axis with some adjustment for components
            let yPos;
            if (d.category === "Components") {
                // Position components based on their size for better distribution
                const index = economicData.findIndex(item => item.sector === d.name);
                yPos = 80 + (index / economicData.length) * (height - 160);
            } else {
                // Center input and output
                yPos = height / 2;
            }
            
            return `translate(${xPos}, ${yPos})`;
        });
    
    // Add bubbles
    bubbleGroups.append("circle")
        .attr("r", d => sizeScale(d.value))
        .attr("fill", d => bubbleColorScale(d))
        .attr("fill-opacity", 0.7)
        .attr("stroke", d => d3.rgb(bubbleColorScale(d)).darker(0.3))
        .attr("stroke-width", 2)
        .on("mouseover", function(event, d) {
            // Highlight bubble
            d3.select(this)
                .attr("stroke-width", 4)
                .attr("fill-opacity", 0.9);
                
            // Get the tooltip element (which should be global from the main script)
            const tooltip = d3.select(".sankey-tooltip");
            if (!tooltip.empty()) {
                // Show detailed tooltip
                let tooltipContent = `
                    <div class="sankey-tooltip-title">${d.name}</div>
                    <div>Economic Output: ${formatCurrency(d.value)}</div>
                `;
                
                // Add percentage for components
                if (d.category === "Components") {
                    tooltipContent += `<div>Percentage: ${d.percentage}% of total</div>`;
                    tooltipContent += `<div>Jobs: ${formatJobs(d.jobs)}</div>`;
                    tooltipContent += `<div>Labor Income: ${formatCurrency(d.laborIncome)}</div>`;
                }
                
                // Show tooltip
                tooltip.html(tooltipContent)
                    .style("left", `${event.pageX + 10}px`)
                    .style("top", `${event.pageY - 30}px`)
                    .style("opacity", 1);
            }
                
            // If it's a component, highlight corresponding Sankey diagram elements
            if (d.category === "Components") {
                highlightSankeyElement(d.name);
            }
        })
        .on("mouseout", function() {
            // Reset bubble style
            d3.select(this)
                .attr("stroke-width", 2)
                .attr("fill-opacity", 0.7);
                
            // Hide tooltip
            d3.select(".sankey-tooltip").style("opacity", 0);
            
            // Reset Sankey diagram highlights
            resetSankeyHighlights();
        });
    
    // Add labels to bubbles
    bubbleGroups.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", 4)
        .style("font-size", d => {
            // Adjust font size based on bubble size
            const size = sizeScale(d.value);
            if (size < 30) return "0px"; // Hide for small bubbles
            return Math.min(size / 5, 14) + "px";
        })
        .style("fill", d => {
            // Choose text color based on background color brightness
            const color = d3.rgb(bubbleColorScale(d));
            const brightness = (color.r * 299 + color.g * 587 + color.b * 114) / 1000;
            return brightness < 128 ? "white" : "#333";
        })
        .style("pointer-events", "none") // Prevent text from intercepting mouse events
        .text(d => d.name);
        
    // Add value labels for larger bubbles
    bubbleGroups.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", 20)
        .style("font-size", d => {
            const size = sizeScale(d.value);
            if (size < 40) return "0px"; // Hide for smaller bubbles
            return Math.min(size / 6, 12) + "px";
        })
        .style("fill", d => {
            // Choose text color based on background color brightness
            const color = d3.rgb(bubbleColorScale(d));
            const brightness = (color.r * 299 + color.g * 587 + color.b * 114) / 1000;
            return brightness < 128 ? "white" : "#333";
        })
        .style("font-weight", "bold")
        .style("pointer-events", "none")
        .text(d => formatCurrency(d.value));
    
    // Add connecting lines between categories
    if (bubbleData.length > 0) {
        // Get positions for the main categories
        const inputX = x("Input");
        const componentsX = x("Components");
        const outputX = x("Output");
        const centerY = height / 2;
        
        // Draw line from Input to Components
        bubbleSvg.append("path")
            .attr("d", `M ${inputX} ${centerY} L ${componentsX - 100} ${centerY}`)
            .attr("stroke", COLORS.beige)
            .attr("stroke-width", 5)
            .attr("stroke-opacity", 0.4)
            .attr("fill", "none")
            .attr("stroke-dasharray", "10,5");
            
        // Draw line from Components to Output
        bubbleSvg.append("path")
            .attr("d", `M ${componentsX + 100} ${centerY} L ${outputX} ${centerY}`)
            .attr("stroke", COLORS.beige)
            .attr("stroke-width", 5)
            .attr("stroke-opacity", 0.4)
            .attr("fill", "none")
            .attr("stroke-dasharray", "10,5");
    }
    
    // Add flow direction arrows
    // Arrow from Input to Components
    bubbleSvg.append("svg:defs").append("svg:marker")
        .attr("id", "arrow")
        .attr("refX", 6)
        .attr("refY", 6)
        .attr("markerWidth", 30)
        .attr("markerHeight", 30)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M 0 0 12 6 0 12 3 6")
        .style("fill", COLORS.darkBrown);
        
    // Add arrows to the paths
    bubbleSvg.selectAll("path")
        .attr("marker-end", "url(#arrow)");
        
    console.log("Bubble chart created successfully!");
}

// Function to highlight elements in the Sankey diagram
function highlightSankeyElement(sectorName) {
    if (!svg) {
        console.warn("Sankey diagram not available for highlighting");
        return;
    }
    
    // Highlight node
    svg.selectAll(".node rect")
        .filter(d => d.name === sectorName)
        .transition()
        .duration(200)
        .style("opacity", 1)
        .attr("stroke-width", 3);
        
    // Highlight related links
    svg.selectAll(".link")
        .filter(d => d.source.name === sectorName || d.target.name === sectorName)
        .transition()
        .duration(200)
        .style("stroke-opacity", 0.8)
        .attr("stroke-width", d => Math.max(2, d.width * 1.2));
}

// Function to reset highlights in the Sankey diagram
function resetSankeyHighlights() {
    if (!svg) {
        console.warn("Sankey diagram not available for reset");
        return;
    }
    
    // Get current step to properly reset
    const stepNum = parseInt(currentStep || "1");
    const revealedSectors = typeof getRevealedSectors === 'function' ? 
        getRevealedSectors(stepNum) : 
        economicData.map(d => d.sector);
    
    // Reset nodes
    svg.selectAll(".node rect")
        .transition()
        .duration(400)
        .style("opacity", function(d) {
            if (d.name === "Visitor Spending" || d.name === "Economic Output") {
                return stepNum === 1 ? 0.3 : 0.7;
            }
            
            if (revealedSectors.includes(d.name)) {
                return 0.9;
            }
            
            return stepNum === 1 ? 0.2 : 0;
        })
        .attr("stroke-width", 1);
        
    // Reset links
    svg.selectAll(".link")
        .transition()
        .duration(400)
        .style("stroke-opacity", function(d) {
            if (d.source.name === "Visitor Spending" && revealedSectors.includes(d.target.name)) {
                return 0.2;
            }
            
            if (d.target.name === "Economic Output" && revealedSectors.includes(d.source.name)) {
                return 0.2;
            }
            
            if (stepNum === 1) {
                return 0.05;
            }
            
            return 0;
        })
        .attr("stroke-width", d => Math.max(1, d.width));
}

// Better initialization function with more robust checks
function initBubbleChart() {
    // Check if all required global variables are available
    const requiredVars = [
        'economicData', 'totalOutput', 'totalJobs', 
        'totalLaborIncome', 'totalValueAdded', 
        'COLORS', 'sectorColors', 'formatCurrency', 'formatJobs'
    ];
    
    const missingVars = requiredVars.filter(varName => 
        typeof window[varName] === 'undefined'
    );
    
    if (missingVars.length > 0) {
        console.error(`Bubble chart init failed. Missing variables: ${missingVars.join(', ')}`);
        // Try again after a delay
        setTimeout(initBubbleChart, 1000);
        return;
    }
    
    console.log("All required variables found, creating bubble chart...");
    createBubbleChart();
    
    // Add resize listener
    window.addEventListener("resize", function() {
        // Debounce resize event
        if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(createBubbleChart, 300);
    });
}

// Wait for DOM and make sure Sankey diagram is loaded first
document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM loaded, waiting for Sankey diagram to initialize...");
    
    // Check if Sankey is initialized, then create bubble chart
    function checkSankeyAndInit() {
        if (typeof svg !== 'undefined' && svg) {
            console.log("Sankey diagram detected, initializing bubble chart...");
            setTimeout(initBubbleChart, 800); // Give a bit more time after Sankey is detected
        } else {
            console.log("Waiting for Sankey diagram...");
            setTimeout(checkSankeyAndInit, 500);
        }
    }
    
    // Start checking
    checkSankeyAndInit();
});