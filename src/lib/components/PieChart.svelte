<script>
	import ApexCharts from 'svelte-apexcharts';

	export let data; // Expected format: [{ label: "Category", value: 100 }, ...]

	$: series = data ? data.map((item) => item.value) : [];
	$: labels = data ? data.map((item) => item.label) : [];

	$: options = {
		chart: {
			type: 'donut', // Use 'donut' for a doughnut chart
			width: '100%' // Make the chart responsive
		},
		series: series,
		labels: labels,
		responsive: [
			{
				breakpoint: 480, // Adjust as needed for your layout
				options: {
					chart: {
						width: '100%' // Adjust as needed
					},
					legend: {
						position: 'bottom'
					}
				}
			}
		],
		tooltip: {
			// Customize tooltips for percentages
			y: {
				formatter: function (val, { series, seriesIndex, dataPointIndex, w }) {
					const total = series.reduce((a, b) => a + b, 0);
					const percentage = ((val / total) * 100).toFixed(1);
					return `${percentage}%`;
				}
			}
		},
		plotOptions: {
			// More options to customize the look
			pie: {
				donut: {
					labels: {
						show: true, // Show labels inside the donut segments
						total: {
							show: true, // Show total in the center
							label: 'Total',
							formatter: function (w) {
								return w.globals.seriesTotals.reduce((a, b) => a + b, 0); // Calculate and show the sum of all values
							}
						}
					}
				}
			}
		}
	};
</script>

<div class="chart-container">
	<ApexCharts type="donut" {options} {series} />
</div>

<style>
	.chart-container {
		width: 100%;
		max-width: 500px; /* Or any desired max width */
		margin: 0 auto; /* Center the chart */
	}
</style>
