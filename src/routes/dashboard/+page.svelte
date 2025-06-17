<script>
	import BarChart from '$lib/components/BarChart.svelte';
	import PieChart from '$lib/components/PieChart.svelte';
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
				current_price: currentPriceData?.price || asset.purchase_price
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

	// Group assets by ticker
	function groupAssetsByTicker(assets) {
		const groups = {};
		for (const asset of assets) {
			const key = asset.ticker || asset.name;
			if (!groups[key]) groups[key] = [];
			groups[key].push(asset);
		}
		return groups;
	}

	let groupedAssets = $derived(groupAssetsByTicker(assetsWithCurrentPrice));
	let expandedTickers = $state({});

	function toggleTicker(ticker) {
		expandedTickers = { ...expandedTickers, [ticker]: !expandedTickers[ticker] };
	}

	function getSummary(assets) {
		const first = assets[0];
		const totalQty = assets.reduce((sum, a) => sum + a.quantity, 0);
		const purchaseTotal = assets.reduce((sum, a) => sum + a.purchase_price * a.quantity, 0);
		const marketValue = assets.reduce((sum, a) => sum + a.current_price * a.quantity, 0);
		const profitLoss = marketValue - purchaseTotal;
		const profitLossPct = purchaseTotal ? (profitLoss / purchaseTotal) * 100 : 0;
		// Weighted average purchase price
		const weightedPurchasePrice = totalQty ? purchaseTotal / totalQty : 0;
		// Weighted average current price
		const weightedCurrentPrice = totalQty ? marketValue / totalQty : 0;
		// Oldest purchase date
		const oldestPurchaseDate = assets.reduce((oldest, a) => {
			if (!oldest) return a.purchase_date;
			// Compare as Date objects
			const aDate = new Date(a.purchase_date);
			const oldestDate = new Date(oldest);
			return aDate < oldestDate ? a.purchase_date : oldest;
		}, null);
		return {
			name: first.name,
			category: first.category,
			currency: first.currency,
			ticker: first.ticker,
			totalQty,
			purchaseTotal,
			marketValue,
			profitLoss,
			profitLossPct,
			weightedPurchasePrice,
			weightedCurrentPrice,
			oldestPurchaseDate
		};
	}

	function getCategoryData() {
		const categoryCounts = {};
		assetsWithCurrentPrice.forEach((asset) => {
			categoryCounts[asset.category] =
				(categoryCounts[asset.category] || 0) + asset.current_price * asset.quantity;
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

	let performanceData = $derived(
		Object.entries(groupedAssets).map(([ticker, assets]) => {
			const summary = getSummary(assets);
			return {
				group: ticker,
				value: summary.profitLoss
			};
		})
	);
</script>

<div class="container my-4 max-w-4xl rounded bg-white p-2 shadow-sm sm:mx-auto sm:p-4 sm:px-6">
	<h1 class="mb-2 text-xl font-bold">Dashboard</h1>

	{#if user}
		<p>Welcome, {user.username} ({user.email})</p>
		{#if user.profile_picture}
			<img src={user.profile_picture} alt="Profile" width="50" class="rounded-full" />
		{/if}
	{/if}

	<form method="POST" action="?/logout" use:enhance>
		<button
			type="submit"
			onclick={logout}
			class="mt-2 mb-4 rounded bg-gray-200 px-3 py-1 hover:bg-gray-300">Logout</button
		>
	</form>
	{#if assetsWithCurrentPrice && assetsWithCurrentPrice.length > 0}
		<div>
			<div>
				<h2 class="mb-4 font-semibold">Portfolio Allocation</h2>
			</div>
			<div class="flex flex-col items-center justify-between gap-4 md:flex-row">
				<PieChart data={categoryData} title="Categories" />
				<BarChart data={performanceData} title="Performance by Ticker (%)" />
			</div>
			<div>
				<h2 class="mb-2 font-semibold">Asset List</h2>
				<div class="w-full">
					<table class="w-full border-collapse text-xs">
						<thead>
							<tr>
								<th class="px-2 py-1 text-left">Name</th>
								<th class="px-2 py-1 text-left">Cat.</th>
								<th class="px-2 py-1 text-right">Qty</th>
								<th class="hidden px-2 py-1 text-right md:table-cell">Purchase <br />Date</th>
								<th class="hidden px-2 py-1 text-right md:table-cell">Purchase<br />Price</th>
								<th class="px-2 py-1 text-right">Current <br />Price</th>
								<th class="hidden px-2 py-1 text-right md:table-cell">Purchase<br />Total</th>
								<th class="px-2 py-1 text-right">Market<br />Value</th>
								<th class="px-2 py-1 text-right">P/L</th>
								<th class="px-2 py-1 text-right">P/L %</th>
							</tr>
						</thead>
						<tbody>
							{#each Object.entries(groupedAssets) as [ticker, assets]}
								{@const summary = getSummary(assets)}
								<tr
									class="cursor-pointer bg-blue-50 transition hover:bg-blue-100"
									tabindex="0"
									aria-expanded={!!expandedTickers[ticker]}
									onclick={() => toggleTicker(ticker)}
									onkeydown={(e) => e.key === 'Enter' && toggleTicker(ticker)}
								>
									<td class="px-2 py-1 font-semibold">
										{summary.name}
										<span class="ml-1 hidden text-xs text-gray-400 md:inline">[{ticker}]</span>
									</td>
									<td class="px-2 py-1">{summary.category}</td>
									<td class="px-2 py-1 text-right">
										{Number.isInteger(summary.totalQty)
											? summary.totalQty
											: summary.totalQty.toFixed(4)}
									</td>
									<td class="hidden px-2 py-1 text-right md:table-cell">
										{summary.oldestPurchaseDate ? formatDate(summary.oldestPurchaseDate) : ''}
									</td>
									<td class="hidden px-2 py-1 text-right md:table-cell">
										{formatCurrency(summary.weightedPurchasePrice, 'en-US', summary.currency)}
									</td>
									<td class="px-2 py-1 text-right">
										{formatCurrency(summary.weightedCurrentPrice, 'en-US', summary.currency)}
									</td>
									<td class="hidden px-2 py-1 text-right md:table-cell"
										>{formatCurrency(summary.purchaseTotal, 'en-US', summary.currency, 0)}</td
									>
									<td class="px-2 py-1 text-right"
										>{formatCurrency(summary.marketValue, 'en-US', summary.currency, 0)}</td
									>
									<td class="px-2 py-1 text-right {summary.profitLoss < 0 ? 'text-red-600' : ''}"
										>{formatCurrency(summary.profitLoss, 'en-US', summary.currency, 0)}</td
									>
									<td class="px-2 py-1 text-right {summary.profitLossPct < 0 ? 'text-red-600' : ''}"
										>{summary.profitLossPct.toFixed(1)}%</td
									>
								</tr>
								{#if expandedTickers[ticker]}
									{#each [...assets].sort((a, b) => new Date(a.purchase_date) - new Date(b.purchase_date)) as asset, j}
										<tr class={j % 2 === 1 ? 'bg-gray-50' : ''}>
											<td class="px-2 py-1 pl-6">{asset.name}</td>
											<td class="px-2 py-1">{asset.category}</td>
											<td class="px-2 py-1 text-right {asset.quantity < 0 ? 'text-red-600' : ''}">
												{Number.isInteger(asset.quantity)
													? asset.quantity
													: asset.quantity.toFixed(4)}
											</td>
											<td class="hidden px-2 py-1 text-right md:table-cell"
												>{formatDate(asset.purchase_date)}</td
											>
											<td class="hidden px-2 py-1 text-right md:table-cell"
												>{formatCurrency(asset.purchase_price, 'en-US', asset.currency)}</td
											>
											<td class="px-2 py-1 text-right"
												>{formatCurrency(asset.current_price, 'en-US', asset.currency)}</td
											>
											<td
												class="hidden px-2 py-1 text-right md:table-cell {calculatePurchaseTotal(
													asset
												) < 0
													? 'text-red-600'
													: ''}"
												>{formatCurrency(
													calculatePurchaseTotal(asset),
													'en-US',
													asset.currency,
													0
												)}</td
											>
											<td class="px-2 py-1 text-right"
												>{formatCurrency(
													calculateMarketValueTotal(asset),
													'en-US',
													asset.currency,
													0
												)}</td
											>
											<td
												class="px-2 py-1 text-right {calculateProfitLoss(asset) < 0
													? 'text-red-600'
													: ''}"
												>{formatCurrency(
													calculateProfitLoss(asset),
													'en-US',
													asset.currency,
													0
												)}</td
											>
											<td
												class="px-2 py-1 text-right {calculateProfitLossPct(asset) < 0
													? 'text-red-600'
													: ''}">{(calculateProfitLossPct(asset) * 100).toFixed(1)}%</td
											>
										</tr>
									{/each}
								{/if}
							{/each}
						</tbody>
						<tfoot>
							<tr class="font-bold">
								<td class="px-2 py-1">Total:</td>
								<td></td>
								<td></td>
								<td class="hidden md:table-cell"></td>
								<td class="hidden md:table-cell"></td>
								<td></td>
								<td
									class="hidden px-2 py-1 text-right md:table-cell {purchaseTotal < 0
										? 'text-red-600'
										: ''}">{formatCurrency(purchaseTotal, 'en-US', 'EUR', 0)}</td
								>
								<td class="px-2 py-1 text-right {marketValueTotal < 0 ? 'text-red-600' : ''}"
									>{formatCurrency(marketValueTotal, 'en-US', 'EUR', 0)}</td
								>
								<td class="px-2 py-1 text-right {profitLossTotal < 0 ? 'text-red-600' : ''}"
									>{formatCurrency(profitLossTotal, 'en-US', 'EUR', 0)}</td
								>
								<td class="px-2 py-1 text-right {profitLossPctTotal < 0 ? 'text-red-600' : ''}"
									>{profitLossPctTotal.toFixed(1)}%</td
								>
							</tr>
						</tfoot>
					</table>
				</div>
			</div>
		</div>
	{:else}
		<p>No assets found.</p>
	{/if}
</div>
