<script>
	import '@carbon/charts-svelte/styles.css';
	import { onMount } from 'svelte';

	let Chart = $state();
	let { data = [], title = 'Bar Chart' } = $props();

	let options = {
		theme: 'white',
		title,
		height: '250px',
		axes: {
			left: { mapsTo: 'value' },
			bottom: { mapsTo: 'group', scaleType: 'labels' }
		},
		legend: {
			enabled: false
		},
		toolbar: {
			enabled: false
		}
	};

	onMount(async () => {
		console.log('Inside onMount function in BarChart.svelte, data =', data);
		const charts = await import('@carbon/charts-svelte');
		Chart = charts.BarChartSimple;
	});
</script>

<div class="w-[250px]">
	{#if Chart}
		<Chart {data} {options} />
	{:else}
		<div>Loading chart...</div>
	{/if}
</div>
