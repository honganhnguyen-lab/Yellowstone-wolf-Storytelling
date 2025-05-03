// Global variables 
let svg_eco, sankey, Sankey_Data, tooltip_eco;
let flowAnimation;
let currentStep = 1;
let animationEnabled = true;
// Define the natural color palette
const brand_colors = {
    beige: "#B9A38F",
    sage: "#A7A58E",
    lightGreen: "#A0AA91",
    forestGreen: "#3B6D3A",
    olive: "#676437",
    brown: "#916937",
    darkBrown: "#5F3820",
    copper: "#AA6C49",
    rust: "#CB7D47"
};

// Economic data
const Economic_Data = [
    { sector: "Lodging", jobs: 89200, laborIncome: 4, valueAdded: 6.78, output: 9.9 },
    { sector: "Restaurants", jobs: 68600, laborIncome: 1.74, valueAdded: 2.68, output: 5.15 },
    { sector: "Recreation Industries", jobs: 34400, laborIncome: 1.09, valueAdded: 1.26, output: 2.22 },
    { sector: "Transportation", jobs: 15500, laborIncome: 0.6, valueAdded: 1.33, output: 1.9 },
    { sector: "Retail", jobs: 21300, laborIncome: 0.61, valueAdded: 0.75, output: 1.19 },
    { sector: "Gas", jobs: 5200, laborIncome: 0.22, valueAdded: 0.35, output: 0.61 },
    { sector: "Camping", jobs: 6100, laborIncome: 0.32, valueAdded: 0.44, output: 0.56 },
    { sector: "Groceries", jobs: 7000, laborIncome: 0.26, valueAdded: 0.35, output: 0.56 }
];

// Calculate totals

let Total_Jobs = 0;
let Total_Output = 0;
let Total_Labor_Income = 0; 
let Total_Value_Added = 0;


for (const sector of Economic_Data) {

    Total_Jobs += sector.jobs;
    Total_Output += sector.output;
    Total_Labor_Income += sector.laborIncome;
    Total_Value_Added += sector.valueAdded;
}

// logged the results to check it is being calculated properly
console.log("Total Jobs Created:", Total_Jobs.toLocaleString());
console.log("Total Economic Output: $" + Total_Output.toFixed(2) + " Billion");
console.log("Total Labor Income: $" + Total_Labor_Income.toFixed(2) + " Billion");
console.log("Total Value Added: $" + Total_Value_Added.toFixed(2) + " Billion");

const formatNumber = d3.format(",.1f");
const formatCurrency = d => `$${formatNumber(d)}B`;
const formatJobs = d3.format(",.0f");

//assign brand colors to each sector
const Sector_Colors = {
    "Visitor Spending": brand_colors.beige,
    "Lodging": brand_colors.rust,
    "Restaurants": brand_colors.copper,
    "Recreation Industries": brand_colors.lightGreen,
    "Transportation": brand_colors.sage,
    "Retail": brand_colors.olive,
    "Gas": brand_colors.brown,
    "Camping": brand_colors.darkBrown,
    "Groceries": brand_colors.forestGreen,
    "Economic Output": brand_colors.beige
};

// Sankey Diagram
function create_Sankey_Diagram() {
    // Set up dimensions
    const container = document.getElementById('sankey-container');
    const margin = {top: 30, right: 30, bottom: 50, left: 10};
  //  const width = container.clientWidth - margin.left - margin.right;
   // const height = container.clientHeight - margin.top - margin.bottom - 70; 
  const width = 500; // Set your desired width
const height = 400
    
    
    d3.select("#sankey-container").html("");
    
  
    svg_eco = d3.select("#sankey-container")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    

    const defs = svg_eco.append("defs");
    
    
    const flowGradient = defs.append("linearGradient")
        .attr("id", "flow-gradient")
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "0%");
        
    flowGradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "white")
        .attr("stop-opacity", 0);
        
    flowGradient.append("stop")
        .attr("offset", "50%")
        .attr("stop-color", "white")
        .attr("stop-opacity", 0.7);
        
    flowGradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "white")
        .attr("stop-opacity", 0);
    
    //Sankey generator
    sankey = d3.sankey()
        .nodeWidth(25)
        .nodePadding(15)
        .extent([[0, 0], [width, height]]);
    

    // Progressive revel
    const nodes = [
        { name: "Visitor Spending" }  
    ];
    
    // Add sector nodes
    Economic_Data.forEach(sector => {
        nodes.push({ 
            name: sector.sector,
            jobs: sector.jobs,
            laborIncome: sector.laborIncome,
            valueAdded: sector.valueAdded,
            output: sector.output
        });
    });
    
    // Add output node
    nodes.push({ name: "Economic Output" });
    
    // Create links
    const links = [];
    const outputNodeIndex = nodes.length - 1;
    
    // links from visitor spending to all other sectors
    Economic_Data.forEach((sector, i) => {
        links.push({
            source: 0,
            target: i + 1,
            value: sector.output
        });
    });
    
    // links from sectors to economic output
    Economic_Data.forEach((sector, i) => {
        links.push({
            source: i + 1,
            target: outputNodeIndex,
            value: sector.output
        });
    });
    
    // prrocess the data with sankey layout
    Sankey_Data = sankey({
        nodes: nodes.map(d => Object.assign({}, d)),
        links: links.map(d => Object.assign({}, d))
    });
    
    // Create tooltip or find existing one
    tooltip_eco = d3.select("#tooltip-eco");
    if (tooltip_eco.empty()) {
        tooltip_eco = d3.select("body").append("div")
            .attr("id", "tooltip-eco")
            .attr("class", "sankey-tooltip")
            .style("position", "fixed") // Use fixed position for viewport relative positioning
            .style("opacity", 0)
            .style("z-index", "1000"); // Ensure it appears above all other elements
    }

    // container for flow particles
    const flowLayer = svg_eco.append("g")
        .attr("class", "flow-particles");
    
    // Draw the links with zero opacity initially to achieve progressive reveal
    const link = svg_eco.append("g")
        .attr("class", "links")
        .attr("fill", "none")
        .selectAll(".link")
        .data(Sankey_Data.links)
        .enter()
        .append("path")
        .attr("class", "link")
        .attr("d", d3.sankeyLinkHorizontal())
        .attr("stroke", d => Sector_Colors[d.source.name] || brand_colors.beige)
        .attr("stroke-width", d => Math.max(1, d.width))
        .style("stroke-opacity", 0) // Start with 0 opacity
        .attr("id", (d, i) => `link-${i}`)
        .on("mouseover", function(event, d) {
            d3.select(this).style("stroke-opacity", 0.5);
            //code broke after merge added some part of the code while debugging
            // calculate proper position using clientX/Y 
            const tooltipX = event.clientX + 10;
            const tooltipY = event.clientY - 30;
            
            tooltip_eco.html(`
                <div class="sankey-tooltip-title">${d.source.name} → ${d.target.name}</div>
                <div>Economic Impact: ${formatCurrency(d.value)}</div>
            `)
            .style("left", `${tooltipX}px`)
            .style("top", `${tooltipY}px`)
            .style("position", "fixed") 
            .style("opacity", 1);
        })
        .on("mousemove", function(event, d) {
            // update position on mouse move with client coordinates
            tooltip_eco
                .style("left", `${event.clientX + 10}px`)
                .style("top", `${event.clientY - 30}px`);
        })
        .on("mouseout", function() {
            const step_num = parseInt(currentStep);
            const revealedSectors = getRevealedSectors(step_num);
            
       
            d3.select(this).style("stroke-opacity", function(d) {
                if (revealedSectors.includes(d.source.name) || 
                    (d.source.name === "Visitor Spending" && revealedSectors.includes(d.target.name)) ||
                    (d.target.name === "Economic Output" && revealedSectors.includes(d.source.name))) {
                    return 0.2;
                }
                return 0;
            });
            
            tooltip_eco.style("opacity", 0);
        });
    
    // Progressive reveal
    const node = svg_eco.append("g")
        .attr("class", "nodes")
        .selectAll(".node")
        .data(Sankey_Data.nodes)
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", d => `translate(${d.x0},${d.y0})`);
    
    // Add node rectangles
    node.append("rect")
        .attr("height", d => d.y1 - d.y0)
        .attr("width", d => d.x1 - d.x0)
        .attr("fill", d => Sector_Colors[d.name] || brand_colors.beige)
        .attr("stroke", d => d3.rgb(Sector_Colors[d.name] || brand_colors.beige).darker(0.3))
        .style("opacity", 0) // Start with 0 opacity
        .on("mouseover", function(event, d) {
            // highlighting the connected links
            svg_eco.selectAll(".link")
                .filter(l => l.source.index === d.index || l.target.index === d.index)
                .style("stroke-opacity", 0.5);
            
 
            let tooltipContent = `<div class="sankey-tooltip-title">${d.name}</div>`;
            
            // add data for the nodes
            if (d.jobs) {
                tooltipContent += `
                    <div>Economic Output: ${formatCurrency(d.output)}</div>
                    <div>Jobs: ${formatJobs(d.jobs)}</div>
                    <div>Labor Income: ${formatCurrency(d.laborIncome)}</div>
                `;
            } 
            // for the output node
            else {
                const value = d.name === "Economic Output" ? Total_Output : Total_Output;
                tooltipContent += `<div>Total: ${formatCurrency(value)}</div>`;
            }
            
           
            const tooltipX = event.clientX + 10;
            const tooltipY = event.clientY - 30;
            
            tooltip_eco.html(tooltipContent)
                .style("left", `${tooltipX}px`)
                .style("top", `${tooltipY}px`)
                .style("position", "fixed") 
                .style("opacity", 1);
        })
        .on("mousemove", function(event, d) {
            
            tooltip_eco
                .style("left", `${event.clientX + 10}px`)
                .style("top", `${event.clientY - 30}px`);
        })
        .on("mouseout", function() {
            const step_num = parseInt(currentStep);
            const revealedSectors = getRevealedSectors(step_num);
            
            
            svg_eco.selectAll(".link").style("stroke-opacity", function(d) {
                if (revealedSectors.includes(d.source.name) || 
                    (d.source.name === "Visitor Spending" && revealedSectors.includes(d.target.name)) ||
                    (d.target.name === "Economic Output" && revealedSectors.includes(d.source.name))) {
                    return 0.2;
                }
                return 0;
            });
            
            tooltip_eco.style("opacity", 0);
        });
    
    //  node labels
    node.append("text")
        .attr("x", d => d.x0 < width / 2 ? d.x1 - d.x0 + 6 : -6)
        .attr("y", d => (d.y1 - d.y0) / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
        .text(d => d.name)
        .style("fill", "#333")
        .style("opacity", 0); // Start with 0 opacity
    
    // legend
    const legend = svg_eco.append("g")
        .attr("transform", `translate(0, ${height + 40})`);
    
    // Title
    legend.append("text")
        .attr("x", width / 2)
        .attr("y", 0)
        .attr("text-anchor", "middle")
        //.style("font-weight", "bold")
        .text("Economic Sectors");
    
    // Legend items
    const legendItems = Object.keys(Sector_Colors).filter(k => k !== "Visitor Spending" && k !== "Economic Output");
    const itemWidth = width / legendItems.length;
    
    legendItems.forEach((item, i) => {
        const g = legend.append("g")
            .attr("transform", `translate(${i * itemWidth}, 10)`);
        
        g.append("rect")
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", Sector_Colors[item]);
        
        g.append("text")
            .attr("x", 15)
            .attr("y", 9)
            .style("font-size", "5px")
            .text(item);
    });
    
    // status indicator
    d3.select(".viz-status")
        .html("Scroll to reveal the economic flow");
        
    // Initialise with the first step
    update_Visualisation("step-1");
}

// helper function to reveal sectors based on the step number
function getRevealedSectors(step_num) {
    let revealedSectors = [];
    
    if (step_num >= 1) {
        // Step 1:show everything
        revealedSectors = Economic_Data.map(d => d.sector);
    }
    
    if (step_num >= 2) {
        // Step 2: focus on lodging
        revealedSectors = ["Lodging"];
    }
    
    if (step_num >= 3) {
        // Step 3: then add Restaurants and Recreation
        revealedSectors = ["Lodging", "Restaurants", "Recreation Industries"];
    }
    
    if (step_num >= 4) {
        // Step 4: and lastly add supporting sectors
        revealedSectors = ["Lodging", "Restaurants", "Recreation Industries", 
                          "Transportation", "Retail", "Gas", "Camping", "Groceries"];
    }
    
    if (step_num >= 5) {
        // Step 5: All sectors for labor focus
        revealedSectors = Economic_Data.map(d => d.sector);
    }
    
    return revealedSectors;
}


function update_Visualisation(stepId) {
    if (!svg_eco) return;
    
    // update current step tracking
    currentStep = stepId.split('-')[1];
    
    //fetcg the step number
    const step_num = parseInt(currentStep);
    
    // fetch sectors to reveal
    const revealedSectors = getRevealedSectors(step_num);
    
    // update the status indicator
    let statusText = "";
    switch(step_num) {
        case 1:
            statusText = "The Big Picture: All sectors overview";
            break;
        case 2:
            statusText = "Focus: Lodging sector impact";
            break;
        case 3:
            statusText = "Focus: Restaurants & Recreation sectors";
            break;
        case 4:
            statusText = "Focus: Supporting sectors";
            break;
        case 5:
            statusText = "Focus: Labor impact across sectors";
            break;
    }
    
    d3.select(".viz-status").html(statusText);
    
    // Update nodes
    svg_eco.selectAll(".node rect")
        .transition()
        .duration(800)
        .style("opacity", function(d) {
            if (d.name === "Visitor Spending" || d.name === "Economic Output") {
                return step_num === 1 ? 0.3 : 0.7; // Always show endpoints
            }
            
            if (revealedSectors.includes(d.name)) {
                return 0.9; // Highlighted sectors
            }
            
            return step_num === 1 ? 0.2 : 0; // Hide non-relevant sectors after step 1
        });
        
    // Update node labels
    svg_eco.selectAll(".node text")
        .transition()
        .duration(800)
        .style("opacity", function(d) {
            if (d.name === "Visitor Spending" || d.name === "Economic Output") {
                return 1; // Always show endpoint labels
            }
            
            if (revealedSectors.includes(d.name)) {
                return 1; // Show labels for revealed sectors
            }
            
            return step_num === 1 ? 0.3 : 0; // Hide non-relevant labels after step 1
        });
    
    // Update links
    svg_eco.selectAll(".link")
        .transition()
        .duration(800)
        .style("stroke-opacity", function(d) {
            // Links from Visitor Spending to revealed sectors
            if (d.source.name === "Visitor Spending" && revealedSectors.includes(d.target.name)) {
                return 0.2;
            }
            
            // Links from revealed sectors to Economic Output
            if (d.target.name === "Economic Output" && revealedSectors.includes(d.source.name)) {
                return 0.2;
            }
            
            // Show all links at low opacity in step 1
            if (step_num === 1) {
                return 0.05;
            }
            
            return 0; // Hide the other links
        });
    

    if (animationEnabled) {
        startFlowAnimation(revealedSectors);
    }
}


function startFlowAnimation(revealedSectors) {
    // Clear any existing animation
    clearFlowAnimation();
    
    // Select all visible links
    const visibleLinks = Sankey_Data.links.filter(link => 
        (link.source.name === "Visitor Spending" && revealedSectors.includes(link.target.name)) ||
        (link.target.name === "Economic Output" && revealedSectors.includes(link.source.name))
    );
    
    if (visibleLinks.length === 0) return;
    
  
    let flowLayer = svg_eco.select(".flow-particles");
    if (flowLayer.empty()) {
        flowLayer = svg_eco.append("g").attr("class", "flow-particles");
    }
    

    flowAnimation = setInterval(() => {
        
        visibleLinks.forEach(link => {
          
            const linkPath = svg_eco.select(`#link-${Sankey_Data.links.indexOf(link)}`);
            
    
            if (!linkPath.empty()) {
                const pathNode = linkPath.node();
                const pathLength = pathNode.getTotalLength();
           
                if (Math.random() < 0.05) {
                 
                    const randomPosition = Math.random() * 0.9; 
                    const point = pathNode.getPointAtLength(randomPosition * pathLength);
                    
                    // Create particle
                    const part = flowLayer.append("circle")
                        .attr("cx", point.x)
                        .attr("cy", point.y)
                        .attr("r", 0)
                        .attr("fill", "white")
                        .attr("fill-opacity", 0.7);
                        
        
                    part.transition()
                        .duration(2000)
                        .attr("r", 1.5 + Math.random() * 1.5)
                        .attr("fill-opacity", 0.9)
                        .transition()
                        .duration(1500)
                        .attr("r", 0)
                        .attr("fill-opacity", 0)
                        .remove();
                        
        
                    const startPosition = randomPosition;
                    const endPosition = Math.min(startPosition + 0.2, 0.98);
                    
                    part.transition()
                        .duration(2000)
                        .tween("pathTween", () => {
                            return (t) => {
                                const pos = startPosition + (endPosition - startPosition) * t;
                                const p = pathNode.getPointAtLength(pos * pathLength);
                            part.attr("cx", p.x).attr("cy", p.y);
                            };
                        });
                }
            }
        });
    }, 100); 
}


function clearFlowAnimation() {
    if (flowAnimation) {
        clearInterval(flowAnimation);
        flowAnimation = null;
    }
    
    svg_eco.select(".flow-particles").selectAll("*").remove();
}

// Set up Intersection Observer to track which section is in view, link below for ref
function setup_Tracker() {
    const steps = document.querySelectorAll('.scrolly-step');
    
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.6 // Trigger when atleast the threshold is visible
    };
    
    const tracker = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                steps.forEach(step => step.classList.remove('active'));
                
               
                entry.target.classList.add('active');
            
                const step_Id = entry.target.id;
                
         
                update_Visualisation(step_Id);
            }
        });
    }, options);
    
    // Observe all steps
    steps.forEach(step => {
        tracker.observe(step);
    });
}
/*
// Toggle for flow animation
function toggleFlowAnimation() {
    animationEnabled = !animationEnabled;
    
    if (animationEnabled) {
        const step_num = parseInt(currentStep);
        const revealedSectors = getRevealedSectors(step_num);
        startFlowAnimation(revealedSectors);
        d3.select("#flow-toggle").text("Pause Flow Animation");
    } else {
        clearFlowAnimation();
        d3.select("#flow-toggle").text("Start Flow Animation");
    }
}
*/
// Add animation toggle control
/*
function addAnimationControls() {
    const controls = d3.select("#sankey-container")
        .append("div")
        .attr("class", "animation-controls")
        .style("position", "absolute")
        .style("bottom", "20px")
        .style("right", "20px");
        
    controls.append("button")
        .attr("id", "flow-toggle")
        .text("Pause Flow Animation")
        .style("padding", "5px 10px")
        .style("background-color", "white")
        .style("border", "1px solid #A0AA91")
        .style("border-radius", "4px")
        .style("cursor", "pointer")
        .on("click", toggleFlowAnimation);
}
*/
// progressive animation 
function initialAnimation() {
    
    svg_eco.selectAll(".node rect")
        .filter(d => d.name === "Visitor Spending" || d.name === "Economic Output")
        .style("opacity", 0.7);
        
    svg_eco.selectAll(".node text")
        .filter(d => d.name === "Visitor Spending" || d.name === "Economic Output")
        .style("opacity", 1);
    

    setTimeout(() => {
        update_Visualisation("step-1");
    }, 1000);
}

// Dom load
document.addEventListener("DOMContentLoaded", function() {
    create_Sankey_Diagram();
    setup_Tracker();
   // addAnimationControls();
    

    window.addEventListener("resize", function() {
  
        clearFlowAnimation();
        create_Sankey_Diagram();
        update_Visualisation(`step-${currentStep}`);
    });
    

    document.getElementById('step-1').classList.add('active');
    initialAnimation();
});




//references
//1.https://medium.com/coding-beauty/javascript-intersection-observer-cded4e80a377 intersectionobserver
//2.https://d3-graph-gallery.com/sankey.html
