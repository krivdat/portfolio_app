<script>
	import { onMount, onDestroy } from 'svelte';
	import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js';

	// Register the necessary components for a doughnut chart
	Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

	export let data; // Expected format: [{ label: "Category", value: 100 }, ...]

	console.log('Inside PieChart.svelte, data =', data);

	let chart;
	let canvas;

	onMount(() => {
		if (data && data.length > 0) {
			createChart();
		}
	});

	onDestroy(() => {
		if (chart) {
			chart.destroy(); // Clean up the chart instance
		}
	});

	$: if (data && data.length > 0) {
		// Check for existing chart instance.  Important!
		if (chart) {
			chart.destroy();
		}
		createChart();
	}
	function createChart() {
		const labels = data.map((item) => item.label);
		const values = data.map((item) => item.value);

		const chartData = {
			labels: labels,
			datasets: [
				{
					data: values
					//backgroundColor and hoverBackgroundColor removed
				}
			]
		};

		const options = {
			responsive: true,
			plugins: {
				legend: {
					position: 'top' // You can change the legend position
				},
				tooltip: {
					// Configure tooltips to show percentages
					callbacks: {
						label: function (context) {
							let label = context.label || '';
							if (label) {
								label += ': ';
							}
							const value = context.parsed;
							const total = context.dataset.data.reduce((acc, curr) => acc + curr, 0);
							const percentage = ((value / total) * 100).toFixed(1);
							return label + percentage + '%';
						}
					}
				}
			}
		};

		chart = new Chart(canvas, {
			type: 'doughnut',
			data: chartData,
			options: options
		});
	}
</script>

<canvas bind:this={canvas}></canvas>

<style>
	/* Add any custom styles for your chart here */
</style>
