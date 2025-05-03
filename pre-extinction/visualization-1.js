let animalFoundData = [];

// the original data only had quanitiy categoris, these are associated values for visualization
function quantityToNumber(category) {
    if (category === "1") return 1;
    if (category === "2") return 2;
    if (category === "3 to 5") return 3;
    if (category === "6 to 10") return 6;
    if (category === "10 to 30") return 10;
    if (category === "30 to 100") return 30;
    if (category === "100 to 500") return 100;
    if (category === "Less than 10") return 5;
    if (category === "More than 500") return 200;
    return 0;
}


function visualization_1(){

    console.log("visualization_1 running")

    d3.csv("pre-extinction/data/HistoricWildlifeObservationsFlatFile.csv").then(data => {
        animalFoundData = data.map(row => ({
            animal: row["Sighting Animal"],
            sightingEvidence: row["Sighting Evidence"],
            sightingQuantStr: row["Sighting Quantity"],
            sightingQuantity: quantityToNumber(row["Sighting Quantity"]),
        })).filter(row => (row.animal !== "Unknown" && row.animal !== "") &&
            (row.sightingQuantity != 0));

        displayDiversityPre()

    });
}

function displayDiversityPre() {
    const height = 500;
    const width = 600;
    const padding = 50;

    const svg = d3.select("#vis-1")
        .attr("width", width)
        .attr("height", height);

    const bubbleData = animalFoundData.map(d => ({
        animal: d.animal,
        quantity: d.sightingQuantity,
        x: padding + Math.random() * (width - 2 * padding),
        y: padding + Math.random() * (height - 2 * padding)
    }));

    //DEFINING COLORS FOR ANIMAL
        const colorPalette = [
            "#6E944B", "#AA6C49", "#CED2B9", "#FFA552", "#66c2a5",
            "#D19B63", "#2E5939", "#B9A38F", "#FF7F00", "#9FCB9D",
            "#82755B", "#4F6D55", "#CB7D47", "#3B6D3A", "#F19A3E",
            "#A3A97E", "#D7C49B", "#4A7C59", "#A98D60", "#E6B97B",
            "#916937", "#B0BA94", "#A89F87", "#FFB347", "#D37400",
            "#A3C586", "#94805E", "#E87C30", "#A7A58E", "#C7A27C",
            "#B46B3A", "#839B57", "#DFAF6F", "#C58C48", "#AA8F66",
            "#9A947B", "#A47738", "#6B4F1F", "#B3936C", "#8AAE3D"
        ];
      
        const animalNames = [...new Set(bubbleData.map(d => d.animal))];
        
        console.log("animalNames = " + animalNames.length);

        // assn animals colors
        const animalColorMap = {};
        animalNames.forEach((animal, i) => {
            animalColorMap[animal] = colorPalette[i % colorPalette.length];
        });
    //DEFINING COLORS FOR ANIMAL - END

    const bubbles = svg.selectAll("circle")
        .data(bubbleData)
        .join("circle")
        .attr("r", d => Math.sqrt(d.quantity))
        .attr("fill", d => animalColorMap[d.animal])
        .attr("stroke", "#333")
        .attr("stroke-width", 0.5)
        .attr("opacity", 0.8);

    let moveMult = 1.5;

    // moves slowly to show liveliness
    d3.interval(() => {
        bubbleData.forEach(d => {
            const r = Math.sqrt(d.quantity);
            const move = r * moveMult;

            d.x += (Math.random() - 0.5) * move;
            d.y += (Math.random() - 0.5) * move;

            // makde sure within the bound
            d.x = Math.min((width - padding - r), Math.max((padding + r), d.x));
            d.y = Math.min((height - padding - r), Math.max((padding + r), d.y));
        });

        // updating the bubbles
        bubbles
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
    }, 60);

    //UDPATING KEY (w button for reset)
    const keyContainer = d3.select("#vis-1-key");
    const keyGrid = keyContainer.append("div").attr("class", "legend-grid");
    
    //animals are clickable and highlight those animals
    animalNames.forEach(animal => {
        const item = keyGrid.append("div")
            .attr("class", "legend-item")
            .style("cursor", "pointer")
            .on("click", () => {
                bubbles
                    .attr("visibility", d => d.animal === animal ? "visible" : "hidden")
                moveMult = .25;
            });            
    
        item.append("div")
            .attr("class", "legend-color")
            .style("background-color", animalColorMap[animal]);
    
        item.append("div")
            .attr("class", "legend-label")
            .text(animal);
    });

    //reset the bubbles
    d3.select("#reset-bubbles").on("click", () => {
        bubbles
            .attr("visibility", "visible")
            .attr("stroke", "#333")
            .attr("stroke-width", 0.5);

        moveMult = 1.5;
    });
        
}
