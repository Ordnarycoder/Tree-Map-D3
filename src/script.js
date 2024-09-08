const url = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json";

const width = 960;
const height = 570;

const svg = d3.select("#tree-map")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

const tooltip = d3.select("#tooltip");

d3.json(url).then(data => {
  const root = d3.hierarchy(data)
    .sum(d => d.value)
    .sort((a, b) => b.value - a.value);

  d3.treemap()
    .size([width, height])
    .padding(2)
    (root);

  const color = d3.scaleOrdinal()
    .domain(root.leaves().map(d => d.data.category))
    .range(["#ff6f61", "#6b5b95", "#88b04b", "#ffcc5c", "#92a8d1", "#f7cac9", "#034f84", "#f7786b"]);

  const tile = svg.selectAll("g")
    .data(root.leaves())
    .enter().append("g")
    .attr("transform", d => `translate(${d.x0},${d.y0})`);

  tile.append("rect")
    .attr("class", "tile")
    .attr("width", d => d.x1 - d.x0)
    .attr("height", d => d.y1 - d.y0)
    .attr("data-name", d => d.data.name)
    .attr("data-category", d => d.data.category)
    .attr("data-value", d => d.data.value)
    .attr("fill", d => color(d.data.category))
    .on("mouseover", function(event, d) {
      tooltip.style("opacity", 1)
        .html(`Name: ${d.data.name}<br>Category: ${d.data.category}<br>Value: ${d.data.value}`)
        .attr("data-value", d.data.value)
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY - 28}px`);
    })
    .on("mouseout", () => tooltip.style("opacity", 0));

  tile.append("text")
    .selectAll("tspan")
    .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
    .enter().append("tspan")
    .attr("x", 4)
    .attr("y", (d, i) => 15 + i * 12)
    .text(d => d);

  const legend = d3.select("#legend")
    .selectAll(".legend-item")
    .data(color.domain())
    .enter().append("rect")
    .attr("class", "legend-item")
    .attr("fill", d => color(d));

  legend.append("div")
    .style("background-color", d => color(d));

  legend.append("text")
    .text(d => d)
    .style("font-size", "1em");
});
