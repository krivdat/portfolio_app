<script>
  import * as d3 from 'd3';
  import { onMount } from 'svelte';

  export let data; // Expected format: [{ label: "Category", value: 100 }, ...]

  let svgNode;
  let width = 300;
  let height = 300;
  let radius = Math.min(width, height) / 2;

  onMount(() => {
    if (!data || data.length === 0) return;

    const color = d3.scaleOrdinal()
      .domain(data.map(d => d.label))
      .range(d3.schemeCategory10);

    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius);

    const pie = d3.pie()
      .value(d => d.value)
      .sort(null);

    const svg = d3.select(svgNode)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const g = svg.selectAll(".arc")
      .data(pie(data))
      .enter().append("g")
      .attr("class", "arc");

    g.append("path")
      .attr("d", arc)
      .style("fill", d => color(d.data.label));

    g.append("text")
      .attr("transform", d => `translate(${arc.centroid(d)})`)
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .text(d => d.data.label);
  });
</script>

<svg bind:this={svgNode}></svg>