<script>
	import * as d3 from 'd3';
	import { onMount, onDestroy } from 'svelte';

	export let data; // Expected format: [{ label: "Category", value: 100 }, ...]
	console.log('Inside PieChartD3.svelte, data =', data);

	let svgNode;
	let width = 300;
	let height = 300;
	let radius = Math.min(width, height) / 2;
	let svg;

	onMount(() => {
		if (!data || data.length === 0) return;
		drawChart();
	});

	onDestroy(() => {
		if (svg) {
			svg.selectAll('*').remove();
		}
	});

	$: if (data) {
		drawChart();
	}

	function drawChart() {
		if (svg) {
			svg.selectAll('*').remove();
		}

		const total = d3.sum(data, (d) => d.value); // Calculate the total value

		const color = d3
			.scaleOrdinal()
			.domain(data.map((d) => d.label))
			.range(d3.schemeCategory10);

		const arc = d3
			.arc()
			.innerRadius(radius * 0.4)
			.outerRadius(radius);

		const pie = d3
			.pie()
			.value((d) => d.value)
			.sort(null);

		svg = d3
			.select(svgNode)
			.attr('width', width)
			.attr('height', height)
			.append('g')
			.attr('transform', `translate(${width / 2},${height / 2})`);

		const g = svg.selectAll('.arc').data(pie(data)).enter().append('g').attr('class', 'arc');

		g.append('path')
			.attr('d', arc)
			.style('fill', (d) => color(d.data.label));

		g.append('text')
			.attr('transform', (d) => `translate(${arc.centroid(d)})`)
			.attr('dy', '.35em')
			.style('text-anchor', 'middle')
			.text((d) => {
				const percentage = ((d.data.value / total) * 100).toFixed(1); // Calculate and format percentage
				return `${d.data.label} (${percentage}%)`; // Display label and percentage
			});
	}
</script>

<svg bind:this={svgNode}></svg>
