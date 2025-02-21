<script>
	import { PieChart } from '@carbon/charts-svelte';
	import '@carbon/charts-svelte/styles.css';

	export let data; // Expected format: [{ label: "Category", value: 100 }, ...]
	console.log('Inside PieChart.svelte, data =', data);

	let options = {
		title: 'Portfolio Allocation',
		legend: {
			alignment: 'center'
		},
		pie: {
			alignment: 'center',
			innerRadius: 0.6
		},
		height: '400px'
	};
</script>

<PieChart {data} {options} style="padding:2rem" />
