function initializeViz4() {
    const widthViz4 = 700;
    const heightViz4 = 400;

    const clusters = {
        stream: {cx: widthViz4 / 3.5, cy: 3 * heightViz4 / 3.5},
        bird: { cx: 3 * widthViz4 / 3.5, cy: heightViz4 / 3},
        beaver: {cx: widthViz4 / 4, cy: heightViz4 / 3 },
        tree: {cx: 3 * widthViz4 / 3.5, cy: 3 * heightViz4 / 3.7 }
    };

    const viz4 = d3.select("#visualization-4-container");

    const stickyWrap = viz4.append("div")
        .attr("id", "viz4-sticky-wrap")
        .style("height", "300vh")
        .style("position", "relative");

    const stickyInner = stickyWrap.append("div")
        .attr("id", "viz4-sticky")
        .style("position", "sticky")
        .style("top", "10vh")
        .style("height", "80vh")
        .style("display", "flex")
        .style("justify-content", "space-between")
        .style("align-items", "center")
        .style("gap", "40px")
        .style("width", "100vw")
        .style("padding", "20px");

    const iconScene = stickyInner.append("svg")
        .attr("id", "viz4-svg")
        .style("width", "70%")
        .style("height", "100%");

    const messageBox = stickyInner.append("div")
        .attr("id", "viz4-message")
        .style("opacity", 1)
        .style("transition", "opacity 0.5s ease");

    const messages = [
        "In a <b>balanced</b> Yellowstone, elk populations would have been held in check, and the ecosystem could have thrived.",
        "But, with wolves eliminated, <b>overgrazing</b> became consistent with the overpopulation of elk.",
        "The result? A fractured and fading Yellowstone. Aspen tree coverage dropped by <b>70%</b>. Beaver colonies plummeted by <b>96%</b>. Stream health declined by <b>80%</b>. Songbird species were reduced by <b>65.7%</b>."
    ];

    messageBox.html(messages[0]);

    d3.csv("unbalanced-ecosystem/data/yellowstone_ecosystem_impact.csv").then(data => {
        const imageMap = {
            "Aspen Coverage (%)": "tree",
            "Beaver Colonies (#)": "beaver",
            "Stream Health": "stream",
            "Songbird Species (#)": "bird"
        };

        const stateCounts = { Healthy: {}, Overgrazed: {} };
        data.forEach(d => {
            const val = Math.floor(+d.Value);
            const key = imageMap[d.Factor];
            const state = d.State;
            stateCounts[state][key] = (stateCounts[state][key] || 0) + val;
        });

        const allIcons = new Set(Object.keys(stateCounts.Healthy).concat(Object.keys(stateCounts.Overgrazed)));
        const allImageElements = [];

        for (const icon of allIcons) {
            const region = clusters[icon];
            const total = Math.max(stateCounts.Healthy[icon] || 0, stateCounts.Overgrazed[icon] || 0);

            let iconSize = icon === "tree" || icon === "stream" ? 100 : icon === "bird" ? 35 : 50;
            const spacing = iconSize + 4;
            let placed = 0;

            const centerX = region.cx - iconSize / 2;
            const centerY = region.cy - iconSize / 2;

            const imgCenter = iconScene.append("image")
                .attr("href", `unbalanced-ecosystem/images/${icon}.png`)
                .attr("x", centerX)
                .attr("y", centerY)
                .attr("width", iconSize)
                .attr("height", iconSize)
                .style("opacity", placed < (stateCounts.Healthy[icon] || 0) ? 1 : 0);
            allImageElements.push({ icon, index: placed, element: imgCenter });
            placed++;

            let radius = spacing;
            while (placed < total) {
                const circumference = 2 * Math.PI * radius;
                const iconsThisLayer = Math.floor(circumference / spacing);
                for (let i = 0; i < iconsThisLayer && placed < total; i++) {
                    const angle = (i / iconsThisLayer) * 2 * Math.PI;
                    const x = region.cx + radius * Math.cos(angle) - iconSize / 2;
                    const y = region.cy + radius * Math.sin(angle) - iconSize / 2;

                    const img = iconScene.append("image")
                        .attr("href", `unbalanced-ecosystem/images/${icon}.png`)
                        .attr("x", x)
                        .attr("y", y)
                        .attr("width", iconSize)
                        .attr("height", iconSize)
                        .style("opacity", placed < (stateCounts.Healthy[icon] || 0) ? 1 : 0);

                    allImageElements.push({ icon, index: placed, element: img });
                    placed++;
                }
                radius += spacing;
            }
        }

        function updateIcons(state) {
            allImageElements.forEach(({ icon, index, element }) => {
                const show = index < (state[icon] || 0);
                element.transition().duration(500).style("opacity", show ? 1 : 0);
            });
        }

        let currentStage = 0;
        const stages = messages.length + 2;
        const stageHeight = 1000;
        const elkAnimated = { done: false };
        let scrollLocked = false;

        window.addEventListener("scroll", () => {
            const container = document.getElementById("viz4-sticky-wrap");
            const rect = container.getBoundingClientRect();
            const scrollY = window.scrollY + window.innerHeight / 0.7;
            const scrollTrigger = rect.top + window.scrollY;
            const distance = scrollY - scrollTrigger;

            const newStage = Math.min(stages - 1, Math.max(0, Math.floor(distance / stageHeight)));

            if (newStage !== currentStage && !scrollLocked) {
                scrollLocked = true;
                handleStageChange(currentStage, newStage, () => {
                    currentStage = newStage;
                    scrollLocked = false;
                });
            }
        });

        function handleStageChange(oldStage, newStage, doneCallback) {
            const msgIndex = newStage < messages.length ? newStage : messages.length - 1;

            messageBox.transition()
                .duration(400)
                .style("opacity", 0)
                .on("end", () => {
                    messageBox
                        .attr("class", "")
                        .classed("stage-" + msgIndex, true)
                        .html(messages[msgIndex])
                        .style("opacity", 0)
                        .transition()
                        .duration(400)
                        .style("opacity", 1)
                        .on("end", () => {
                            if (newStage === 0) {
                                updateIcons(stateCounts.Healthy);
                                elkAnimated.done = false;
                                doneCallback();
                            } else if (newStage === 1) {
                                if (!elkAnimated.done) {
                                    setTimeout(() => {
                                        const elk = iconScene.append("image")
                                            .attr("href", "unbalanced-ecosystem/images/elk.png")
                                            .attr("x", -100)
                                            .attr("y", 150)
                                            .attr("width", 80)
                                            .attr("height", 80);
                                        elk.transition()
                                            .duration(2000)
                                            .ease(d3.easeLinear)
                                            .attr("x", widthViz4 + 100)
                                            .on("end", () => {
                                                elk.remove();
                                                elkAnimated.done = true;
                                                doneCallback();
                                            });
                                    }, 2000);
                                } else {
                                    doneCallback();
                                }
                            } else if (newStage === 2) {
                                updateIcons(stateCounts.Overgrazed);
                                setTimeout(doneCallback, 500);
                            } else {
                                setTimeout(doneCallback, 1000);
                            }
                        });
                });
        }
    });
}
