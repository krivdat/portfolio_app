<script>
	import PieChart from '$lib/components/PieChart.svelte'; // Import the chart component
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { formatDate } from '$lib/utils/date';
	import { formatCurrency } from '$lib/utils/currency';
	let { data } = $props();
	let user = $derived(data.user);
	let currentPrices = $derived(data.currentPrices);
	let assetsWithCurrentPrice = $derived(
		data.assets.map((asset) => {
			const currentPriceData = asset.ticker ? currentPrices[asset.ticker] : null;
			return {
				...asset,
				current_price: currentPriceData?.price || asset.purchase_price,
				current_currency: currentPriceData?.currency || asset.currency
			};
		})
	);

	let categoryData = $derived(getCategoryData());

	let purchaseTotal = $derived(
		assetsWithCurrentPrice.reduce(
			(total, asset) => total + asset.purchase_price * asset.quantity,
			0
		)
	);
	let marketValueTotal = $derived(
		assetsWithCurrentPrice.reduce((total, asset) => total + asset.current_price * asset.quantity, 0)
	);

	let profitLossTotal = $derived(
		assetsWithCurrentPrice.reduce((total, asset) => total + calculateProfitLoss(asset), 0)
	);

	let profitLossPctTotal = $derived(
		(assetsWithCurrentPrice.reduce((total, asset) => total + calculateProfitLoss(asset), 0) /
			assetsWithCurrentPrice.reduce(
				(total, asset) => total + asset.purchase_price * asset.quantity,
				0
			)) *
			100
	);

	function getCategoryData() {
		const categoryCounts = {};
		data.assets.forEach((asset) => {
			categoryCounts[asset.category] =
				(categoryCounts[asset.category] || 0) + asset.purchase_price * asset.quantity;
		});

		let result = Object.entries(categoryCounts).map(([category, value]) => ({
			group: category,
			value
		}));
		console.log('Category Data:', result);

		return result;
	}

	function calculateProfitLoss(asset) {
		return (asset.current_price - asset.purchase_price) * asset.quantity;
	}

	function calculateProfitLossPct(asset) {
		return (asset.current_price - asset.purchase_price) / asset.purchase_price;
	}

	function calculatePurchaseTotal(asset) {
		return asset.purchase_price * asset.quantity;
	}

	function calculateMarketValueTotal(asset) {
		return asset.current_price * asset.quantity;
	}

	function logout() {
		localStorage.clear();
		invalidateAll();
	}
</script>

<div class="container">
	<h1>Dashboard</h1>

	{#if user}
		<p>Welcome, {user.username} ({user.email})</p>
		{#if user.profile_picture}
			<img src={user.profile_picture} alt="Profile" width="50" />
		{/if}
	{/if}

	<form method="POST" action="?/logout" use:enhance>
		<button type="submit" onclick={logout}>Logout</button>
	</form>
	{#if assetsWithCurrentPrice && assetsWithCurrentPrice.length > 0}
		<div>
			<div>
				<h2>Asset Allocation</h2>
				<PieChart data={categoryData} />
			</div>
			<div>
				<h2>Asset List</h2>
				<table>
					<thead>
						<tr>
							<th>Name</th>
							<th>Category</th>
							<th class="text-right">Qty</th>
							<th class="text-right">Purchase <br />Date</th>
							<th class="text-right">Purchase<br />Price</th>
							<th class="text-right">Current <br />Price</th>
							<th class="text-right">
								Purchase<br />
								Total</th
							>
							<th class="text-right">Market<br />Value</th>
							<th class="text-right">P/L %</th>
							<th class="text-right">P/L</th>
						</tr>
					</thead>
					<tbody>
						{#each assetsWithCurrentPrice as asset, i}
							<tr class:zebra={i % 2 === 1}>
								<td>{asset.name}</td>
								<td>{asset.category}</td>
								<td class="text-right" class:negative={asset.quantity < 0}>{asset.quantity}</td>
								<td class="text-right">{formatDate(asset.purchase_date)}</td>
								<td class="text-right"
									>{formatCurrency(asset.purchase_price, 'en-US', asset.currency)}</td
								>
								<td class="text-right"
									>{formatCurrency(asset.current_price, 'en-US', asset.currency)}</td
								>
								<td class="text-right" class:negative={calculatePurchaseTotal(asset) < 0}
									>{formatCurrency(calculatePurchaseTotal(asset), 'en-US', asset.currency)}</td
								>
								<td class="text-right" class:negative={calculateMarketValueTotal(asset) < 0}
									>{formatCurrency(calculateMarketValueTotal(asset), 'en-US', asset.currency)}</td
								>
								<td class="text-right" class:negative={calculateProfitLossPct(asset) < 0}
									>{(calculateProfitLossPct(asset) * 100).toFixed(2)}%</td
								>
								<td class="text-right" class:negative={calculateProfitLoss(asset) < 0}
									>{formatCurrency(calculateProfitLoss(asset), 'en-US', asset.currency)}</td
								>
							</tr>
						{/each}
					</tbody>
					<tfoot>
						<tr>
							<td colspan="6" class="text-right">Total:</td>
							<td class="text-right" class:negative={purchaseTotal < 0}
								>{formatCurrency(purchaseTotal, 'en-US', 'EUR')}</td
							><td class="text-right" class:negative={marketValueTotal < 0}
								>{formatCurrency(marketValueTotal, 'en-US', 'EUR')}</td
							>
							<td class="text-right" class:negative={profitLossPctTotal < 0}
								>{profitLossPctTotal.toFixed(2)}%</td
							>
							<td class="text-right" class:negative={profitLossTotal < 0}
								>{formatCurrency(profitLossTotal, 'en-US', 'EUR')}</td
							>
						</tr></tfoot
					>
				</table>
			</div>
		</div>
	{:else}
		<p>No assets found.</p>
	{/if}
</div>

<style>
	.container {
		background-color: #fefefe;
		border-radius: 5px;
		margin: 0.5rem;
		padding: 1rem;
	}

	.text-right {
		text-align: right;
	}

	table {
		border-collapse: collapse;
		width: 100%;
		font-size: 0.8rem;
	}

	th,
	td {
		padding: 0.1rem 0.1rem;
		text-align: left;
	}

	thead > tr {
		background-color: #f0f0f0;
	}

	tfoot > tr {
		border-top: 1px solid #000;
		border-bottom: 1px solid #000;
		font-weight: bold;
	}

	.negative {
		color: red;
	}

	.zebra {
		background-color: #f5f5f5;
	}
</style>
