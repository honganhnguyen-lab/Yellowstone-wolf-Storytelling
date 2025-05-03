const startYear = 1914;
const endYear = 1928;
const vis2 = document.getElementById('visualization-2');
let attackData = [];
let wolfMessages = [];

//Adding wolf messages
d3.csv("wolf-extinction/data/YellowstoneWolfExtinction-Reasons.csv").then(data => {
    wolfMessages = data.map(d => ({
        year: +d.Year,
        message: d.Message,
        source: d.Source
    }));
});

window.addEventListener('scroll', () => {
    if (!vis2) return;

    const yearMessage = document.getElementById("year-message");
    const rect = vis2.getBoundingClientRect();
    const elementTop = rect.top + window.scrollY;
    const elementHeight = vis2.offsetHeight - 1000;
    const scrollY = window.scrollY;

    let scrolledThrough = scrollY - elementTop;
    scrolledThrough = Math.max(0, Math.min(scrolledThrough, elementHeight));

    const scrollPercent = scrolledThrough / elementHeight;
    const totalYears = endYear - startYear;
    const exactYear = startYear + scrollPercent * totalYears;
    const currentYear = Math.floor(exactYear);
    const yearProgress = exactYear - currentYear;

    if (window.drawStage) {
        window.drawStage(currentYear, yearProgress);
    }
});


function visualization_2(){
    //INFO: ABOUT EXTINCTION OF WOLVES AT YELLOWSTONE
    d3.csv("wolf-extinction/data/YellowstoneWolfExtinction-Positioning.csv").then(
    function(data) {
        attackData = data.map(row => ({
          wolfID: row["wolfID"],
          yearDied: +row["YearDied"],
          xPosition: +row["xPosition"],
          yPosition: +row["yPosition"]
        }));

        displayExtinction();

        console.log("GOT POSITION DATA")
  
      });
    
}

function displayExtinction() {
    const height = 591;
    const width = 610;

    const svg = d3.select("#vis-2")
        .attr("width", width)
        .attr("height", height);

    const dotRadius = 5;

    svg.selectAll("*").remove(); // remove old dots

    const dotsGroup = svg.append("g");

    // RED OVERLAY 
    const redOverlay = svg.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", width)
    .attr("height", height)
    .attr("fill", "red")
    .attr("opacity", 0);

    // store for drawStage 
    window.redOverlay = redOverlay;

    const extinctionText = svg.append("text")
    .attr("x", width / 2)
    .attr("y", height / 2)
    .attr("text-anchor", "middle")
    .attr("font-size", "36px")
    .attr("fill", "white")
    .attr("opacity", 0)
    .text("Wolf Extinction");
    

    // Save for drawStage
    window.extinctionText = extinctionText;

    const wolfData = attackData.map(d => ({
        wolfID: d.wolfID,
        yearDied: +d.yearDied,
        x: +d.xPosition,
        y: +d.yPosition
    }));

    // store wolf data for drawStage
    window.wolfData = wolfData;

    // all data in the beggining
    dotsGroup.selectAll("circle")
        .data(wolfData, d => d.wolfID)
        .join("circle")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", dotRadius)
        .attr("fill", "#AA6C49")
        .attr("stroke", "#333")
        .attr("stroke-width", 0.5)
        .attr("opacity", 1);

    // so drawStage can acsess
    window.dotsGroup = dotsGroup;

    function drawStage(currentYear, yearProgress) {
        const wolvesThisYear = window.wolfData
            .filter(d => d.yearDied === currentYear)
            .sort((a, b) => a.wolfID - b.wolfID); // Optional: consistent order
    
        const numToHide = Math.floor(yearProgress * wolvesThisYear.length);
    
        dotsGroup.selectAll("circle")
            .data(window.wolfData, d => d.wolfID)
            .attr("opacity", d => {
                if (d.yearDied < currentYear) {
                    return 0; // already dead
                } else if (d.yearDied > currentYear) {
                    return 1; // still alive
                } else {
                    // current year: fade some out
                    const index = wolvesThisYear.findIndex(w => w.wolfID === d.wolfID);
                    return index < numToHide ? 0 : 1;
                }
            });
       
        if(currentYear < 1927){
            d3.select("#year-label").text(`Year: ${currentYear}`);
            window.redOverlay.attr("opacity", 0);
            const messageForYear = wolfMessages.find(d => d.year === currentYear);
            if (messageForYear) {
                d3.select("#message-text").text(`${messageForYear.message}`);
                d3.select("#message-source").text(messageForYear.source);
            } else {
                d3.select("#message-text").text("");
                d3.select("#message-source").text("");
            }    
        }else{

            if (currentYear === 1927) {
                d3.select("#year-label").text(`Year: 1926`);
                // fade red in
                window.redOverlay.attr("opacity", (yearProgress * .8));
                window.extinctionText.attr("opacity", 0);
            } else if (currentYear >= 1928) {
                d3.select("#year-label").text(`Year: 1927`);
                window.redOverlay.attr("opacity", .8);
                window.extinctionText.attr("opacity", 1);
                d3.select("#message-text").text(`Complete extinction of wolves.`);
                d3.select("#message-source").text('Phelps, Christina L., "The Policy Behind the Reintroduction of Gray Wolves into Yellowstone" (1995). Honors Theses. Paper 43.');

            } else {
                window.redOverlay.attr("opacity", 0);
                window.extinctionText.attr("opacity", 0);
            }
            
        }

    }
    
    window.drawStage = drawStage;
    drawStage(startYear, 0);

}