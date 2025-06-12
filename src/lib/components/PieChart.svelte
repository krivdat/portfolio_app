<script>
	import { PieChart } from '@carbon/charts-svelte';
	import '@carbon/charts-svelte/styles.css';

	export let data; // Expected format: [{ label: "Category", value: 100 }, ...]
	export let title = 'Portfolio Allocation';
	console.log('Inside PieChart.svelte, data =', data);

	let options = {
		title,
		legend: {
			alignment: 'center'
		},
		pie: {
			alignment: 'center',
			innerRadius: 0.6
		},
		height: '300px',
		width: '300px'
	};
</script>

<PieChart {data} {options} class="rounded-lg bg-gray-100 p-4" />
