//loaded the data from the csv here manually
const Stakeholder_Data = [
    { name: "Environmental Groups", category: "Positive", value: 69 },
    { name: "Environmental Groups", category: "Negative", value: 12 },
    { name: "Environmental Groups", category: "Neutral", value: 19 },
    { name: "Urban Residents", category: "Positive", value: 67 },
    { name: "Urban Residents", category: "Negative", value: 15 },
    { name: "Urban Residents", category: "Neutral", value: 18 },
    { name: "General Public", category: "Positive", value: 61 },
    { name: "General Public", category: "Negative", value: 22 },
    { name: "General Public", category: "Neutral", value: 17 },
    { name: "Hunters", category: "Positive", value: 43 },
    { name: "Hunters", category: "Negative", value: 45 },
    { name: "Hunters", category: "Neutral", value: 12 },
    { name: "Rural Residents", category: "Positive", value: 41 },
    { name: "Rural Residents", category: "Negative", value: 43 },
    { name: "Rural Residents", category: "Neutral", value: 16 },
    { name: "Farmers/Ranchers", category: "Positive", value: 35 },
    { name: "Farmers/Ranchers", category: "Negative", value: 55 },
    { name: "Farmers/Ranchers", category: "Neutral", value: 10 }
];

const Region_Data = [
    { name: "No Wolves Present", category: "Positive", value: 65 },
    { name: "No Wolves Present", category: "Negative", value: 18 },
    { name: "No Wolves Present", category: "Neutral", value: 17 },
    { name: "Rest of the U.S.", category: "Positive", value: 67 },
    { name: "Rest of the U.S.", category: "Negative", value: 18 },
    { name: "Rest of the U.S.", category: "Neutral", value: 15 },
    { name: "Western Great Lakes", category: "Positive", value: 64 },
    { name: "Western Great Lakes", category: "Negative", value: 21 },
    { name: "Western Great Lakes", category: "Neutral", value: 15 },
    { name: "Returned Wolf Areas", category: "Positive", value: 58 },
    { name: "Returned Wolf Areas", category: "Negative", value: 25 },
    { name: "Returned Wolf Areas", category: "Neutral", value: 17 },
    { name: "Northern Rocky Mountains", category: "Positive", value: 58 },
    { name: "Northern Rocky Mountains", category: "Negative", value: 25 },
    { name: "Northern Rocky Mountains", category: "Neutral", value: 17 },
    { name: "Persisting Wolf Areas", category: "Positive", value: 45 },
    { name: "Persisting Wolf Areas", category: "Negative", value: 33 },
    { name: "Persisting Wolf Areas", category: "Neutral", value: 22 }
];

const Demographic_Data = [
    { name: "Higher Education", category: "Positive", value: 65 },
    { name: "Higher Education", category: "Negative", value: 19 },
    { name: "Higher Education", category: "Neutral", value: 16 },
    { name: "Younger Age", category: "Positive", value: 63 },
    { name: "Younger Age", category: "Negative", value: 23 },
    { name: "Younger Age", category: "Neutral", value: 14 },
    { name: "Urban with Nature Exp.", category: "Positive", value: 67 },
    { name: "Urban with Nature Exp.", category: "Negative", value: 15 },
    { name: "Urban with Nature Exp.", category: "Neutral", value: 18 },
    { name: "Lower Education", category: "Positive", value: 45 },
    { name: "Lower Education", category: "Negative", value: 42 },
    { name: "Lower Education", category: "Neutral", value: 13 },
    { name: "Older Age", category: "Positive", value: 40 },
    { name: "Older Age", category: "Negative", value: 47 },
    { name: "Older Age", category: "Neutral", value: 13 },
    { name: "Direct Wolf Experience", category: "Positive", value: 38 },
    { name: "Direct Wolf Experience", category: "Negative", value: 48 },
    { name: "Direct Wolf Experience", category: "Neutral", value: 14 }
];


const tooltip = d3.select('.tooltip');

// Dimensions
const margin = { top: 40, right: 20, bottom: 60, left: 160 };
const width = 600 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// SVG
const svg = d3.select('#chart')
    .append('svg')
    .attr('width', '100%')
    .attr('height', height + margin.top + margin.bottom)
    .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);


let Current_Data = Stakeholder_Data;
let Highlight_Group = null;

function Create_Chart(data, Highlight_Group = null) {

    svg.selectAll('*').remove();


    const categories = Array.from(new Set(data.map(d => d.category)));
    const stakeholders = Array.from(new Set(data.map(d => d.name)));


    stakeholders.sort((a, b) => {
        const aPositive = data.find(d => d.name === a && d.category === "Positive").value;
        const bPositive = data.find(d => d.name === b && d.category === "Positive").value;
        return bPositive - aPositive;
    });

    const x = d3.scaleBand()
        .domain(categories)
        .range([0, width])
        .padding(0.1);

    const y = d3.scaleBand()
        .domain(stakeholders)
        .range([0, height])
        .padding(0.1);


    const colorScale = d3.scaleOrdinal()
        .domain(["Positive", "Negative", "Neutral"])
        .range(["#3B6D3A", "#916937", "#A7A58E"]);

    // value intensity
    function getGradientColor(category, value) {
        const baseColor = colorScale(category);
        return d3.interpolateRgb("#ffffff", baseColor)(value / 100);
    }

    // axes
    svg.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .style('font-weight', 'bold');

    svg.append('g')
        .call(d3.axisLeft(y))
        .selectAll('text')
        .style('font-weight', 'bold');

    //  cells
    svg.selectAll('.cell')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'cell')
        .attr('x', d => x(d.category))
        .attr('y', d => y(d.name))
        .attr('width', x.bandwidth())
        .attr('height', y.bandwidth())
        .attr('fill', d => getGradientColor(d.category, d.value))
        .attr('opacity', d => Highlight_Group === null || d.name === Highlight_Group ? 1 : 0.3)
        .on('mouseover', function(event, d) {
            //  tooltip
            tooltip.style('opacity', 1)
                .html(`
                    <div class="tooltip-title">${d.name}</div>
                    <div>${d.category}: <strong>${d.value}%</strong></div>
                `)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 28) + 'px');

            // Highlight cell
            d3.select(this)
                .attr('stroke', '#5F3820')
                .attr('stroke-width', 2);
        })
        .on('mouseout', function() {
            // Hide tooltip
            tooltip.style('opacity', 0);

            // Remove highlight
            d3.select(this)
                .attr('stroke', 'white')
                .attr('stroke-width', 1);
        });


    svg.selectAll('.cell-label')
        .data(data)
        .enter()
        .append('text')
        .attr('class', 'cell-label')
        .attr('x', d => x(d.category) + x.bandwidth() / 2)
        .attr('y', d => y(d.name) + y.bandwidth() / 2)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .style('fill', d => d.value > 40 ? 'white' : '#333')
        .style('font-weight', 'bold')
        .style('font-size', '12px')
        .text(d => d.value + '%');

    // title
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', -20)
        .attr('text-anchor', 'middle')
        .style('font-size', '16px')
        .style('font-weight', 'bold')
        .style('fill', '#3B6D3A')
        .text('Attitudes Toward Wolves (%)');

    // Legend
    const legendX =100; 
    const legendY = height + margin.bottom - 20;
    const legendRectSize = 18;
    const legendSpacing = 4;

    const legendData = [
        { label: 'Positive', color: colorScale('Positive') },
        { label: 'Negative', color: colorScale('Negative') },
        { label: 'Neutral', color: colorScale('Neutral') }
    ];

    const legend = svg.selectAll('.legend')
        .data(legendData)
        .enter().append('g')
        .attr('class', 'legend')
        .attr('transform', (d, i) => `translate(${legendX + i * (legendRectSize + legendSpacing + 60)}, ${legendY})`); 

    legend.append('rect')
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)
        .style('fill', d => d.color);

    legend.append('text')
        .attr('x', legendRectSize + legendSpacing)
        .attr('y', legendRectSize - legendSpacing)
        .style('font-size', '12px')
        .style('fill', '#333')
        .text(d => d.label)
        .attr('alignment-baseline', 'middle');
}

// Initialise chart
Create_Chart(Stakeholder_Data);


function checkScroll() {
    const steps = document.querySelectorAll('.step');

    steps.forEach((step, index) => {
        const stepContent = step.querySelector('.step-content');
        const rect = step.getBoundingClientRect();
        const isInView = (
            rect.top <= window.innerHeight / 2 &&
            rect.bottom >= window.innerHeight / 2
        );

        if (isInView) {

            document.querySelectorAll('.step-content').forEach(el => {
                el.classList.remove('active');
            });


            stepContent.classList.add('active');
            //implemnented switch case
            switch(index) {
                case 0: // intro
                    Create_Chart(Stakeholder_Data);
                    break;
                case 1: // environmental
                    Create_Chart(Stakeholder_Data, "Environmental Groups");
                    break;
                case 2: // urban
                    Create_Chart(Stakeholder_Data, "Urban Residents");
                    break;
                case 3: // public
                    Create_Chart(Stakeholder_Data, "General Public");
                    break;
                case 4: // hunters
                    Create_Chart(Stakeholder_Data, "Hunters");
                    break;
                case 5: // rural
                    Create_Chart(Stakeholder_Data, "Rural Residents");
                    break;
                case 6: // farmers
                    Create_Chart(Stakeholder_Data, "Farmers/Ranchers");
                    break;
                case 7: // regions
                    Create_Chart(Region_Data);
                    break;
                case 8: // demographic
                    Create_Chart(Demographic_Data);
                    break;
                case 9: // conclusion
                    Create_Chart(Stakeholder_Data);
                    break;
            }
        }
    });
}

// scroll listener
window.addEventListener('scroll', checkScroll);
window.addEventListener('resize', checkScroll);

// initial call 
checkScroll();



//references:
//1.https://d3-graph-gallery.com/graph/heatmap_basic.html
