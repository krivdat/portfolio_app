<script>
	import '@carbon/charts-svelte/styles.css';
	import { onMount } from 'svelte';

	let Chart = $state();
	let { data = [], title = 'Bar Chart' } = $props();

	let options = {
		theme: 'white',
		title,
		height: '400px',
		axes: {
			left: { mapsTo: 'value' },
			bottom: { mapsTo: 'group', scaleType: 'labels' }
		}
	};

	onMount(async () => {
		console.log('Inside onMount function in BarChart.svelte, data =', data);
		const charts = await import('@carbon/charts-svelte');
		Chart = charts.BarChartSimple;
	});
</script>

<div>
	<Chart {data} {options} />
</div>
