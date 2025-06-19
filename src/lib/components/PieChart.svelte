<script>
	import '@carbon/charts-svelte/styles.css';
	import { onMount } from 'svelte';

	let Chart = $state();
	let { data = [], title = 'Pie' } = $props();

	let options = {
		theme: 'white',
		title,
		height: '250px',
		axes: {
			left: { mapsTo: 'value' },
			bottom: { mapsTo: 'group', scaleType: 'labels' }
		},
		legend: {
			alignment: 'center'
		},
		toolbar: {
			enabled: false
		}
	};

	onMount(async () => {
		console.log('Inside onMount function in PieChart.svelte, data =', data);
		const charts = await import('@carbon/charts-svelte');
		Chart = charts.PieChart;
	});
</script>

<div class="w-[250px]">
	{#if Chart}
		<Chart {data} {options} />
	{:else}
		<div>Loading chart...</div>
	{/if}
</div>
