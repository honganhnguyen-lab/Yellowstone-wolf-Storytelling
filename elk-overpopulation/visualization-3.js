function initializeElkVisualization() {
    window.addEventListener("scroll", () => {
        const stickyBox = document.querySelector("#elk-sticky");
        if (!stickyBox) return;

        const boxTop = stickyBox.getBoundingClientRect().top;
        const boxHeight = stickyBox.getBoundingClientRect().height;

        const scrollFraction = Math.min(Math.max(1 - boxTop / (window.innerHeight / 2), 0), 1);

        const elkEl = d3.select("#elk-growing");
        const elkLabelEl = d3.select("#elk-label");
        const messageEl = d3.select("#elk-message-box");
        const msgTxtEl = d3.select("#elk-message");

        if (scrollFraction < 0.2) {
            elkEl.style("height", "100px").style("transform", "translateX(0)");
            elkLabelEl.style("opacity", 1).style("transform", "translateX(0)").text("Elk at Carrying Capacity");
            messageEl.style("opacity", 1).style("transform", "translateX(0)");
            msgTxtEl.text("Yellowstone’s elk population should have stayed near 6,000, its estimated carrying capacity. But with wolves eliminated, their population grew unchecked.");
        } else if (scrollFraction < 0.7) {
            const progress = (scrollFraction - 0.2) / 0.5;
            elkEl
                .style("height", `${100 + progress * 230}px`)
                .style("transform", `translateX(${progress * 600}px)`);
            elkLabelEl.style("opacity", 0);
            messageEl.style("opacity", 0);
        } else {
            elkEl.style("height", "330px").style("transform", "translateX(480px)");
            elkLabelEl.style("opacity", 1).style("transform", "translateX(440px)").text("Elk at Overpopulation");
            messageEl.style("opacity", 1).style("transform", "translateX(-300px)");
            msgTxtEl.text("By the 1980s, elk numbers grew to over 20,000 — more than 3.3× their sustainable limit. This unchecked overpopulation triggered ripple effects across Yellowstone’s ecosystem.");
        }
    });
}
