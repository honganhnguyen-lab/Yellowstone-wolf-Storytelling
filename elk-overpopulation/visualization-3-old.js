document.addEventListener("DOMContentLoaded", function () {
    
    const viz3 = d3.select("#elk-container");

    const elkViz = viz3.append("div")
        .attr("id", "elk-scroll");

    //hodls image while the scroll is happening
    const stickViz = elkViz.append("div")
        .attr("id", "elk-sticky-wrap");
    const box = stickViz.append("div")
        .attr("id", "elk-sticky")

    const elkColumn = box.append("div")
        .attr("id", "elk-column");
    const elk = elkColumn.append("img")
        .attr("id", "elk-growing")
        .attr("src", "images/elk.png");
    const elkLabel = elkColumn.append("p")
        .attr("id", "elk-label")
        .text("Elk at carrying capacity");

    //Box on right for message
    const messageBox = box.append("div")
        .attr("id", "elk-message-box")
        .attr("class", "viz-text-box");
    const msgTxt = messageBox.append("p")
        .attr("id", "elk-message");

    //Updates elk pos for scroll
    window.addEventListener("scroll", () => {
        const stickVizNode = document.querySelector("#elk-sticky-wrap");
        const scrollTop = window.scrollY;
        const windowHeight = window.innerHeight;

        const start = stickVizNode.offsetTop;
        const end = start + stickVizNode.offsetHeight - windowHeight;
        const scrollFraction = Math.min(Math.max((scrollTop - start) / (end - start), 0), 1);

        //All of these are what's being updated
        const elkEl = d3.select("#elk-growing");
        const elkLabelEl = d3.select("#elk-label");
        const messageEl = d3.select("#elk-message-box");
        const msgTxtEl = d3.select("#elk-message");

        if (scrollFraction < 0.2) {
            elkEl
                .style("height", "100px")
                .style("transform", "translateX(0)");
            elkLabelEl
                .style("opacity", 1)
                .style("transform", "translateX(0)")
                .text("Elk at Carrying Capacity");
            messageEl
                .style("opacity", 1)
                .style("transform", "translateX(0)");
            msgTxtEl.text("Yellowstone’s elk population should have stayed near 6,000, its estimated carrying capacity. But with wolves eliminated, their population grew unchecked.");

        } else if (scrollFraction >= 0.2 && scrollFraction < 0.7) {
            const progress = (scrollFraction - 0.2) / (0.5);
            const elkTranslate = progress * 600;
                
            const elkSize = 100 + progress * (330 - 100);

            elkEl
                .style("height", `${elkSize}px`)
                .style("transform", `translateX(${elkTranslate}px)`);
            elkLabelEl.style("opacity", 0);
            messageEl.style("opacity", 0);
        } else {
            elkEl
                .style("height", "330px")
                .style("transform", "translateX(600px)");
            elkLabelEl
                .style("opacity", 1)
                .style("transform", "translateX(560px)")
                .text("Elk at Overpopulation");
            messageEl
                .style("opacity", 1)
                .style("transform", "translateX(-300px)");
            msgTxtEl.text("By the 1980s, elk numbers grew to over 20,000 — more than 3.3× their sustainable limit. This unchecked overpopulation triggered ripple effects across Yellowstone’s ecosystem.");
        }
    });
});