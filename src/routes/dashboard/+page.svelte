<script>
	import BarChart from '$lib/components/BarChart.svelte';
	import PieChart from '$lib/components/PieChart.svelte';
	import { formatDate } from '$lib/utils/date';
	import { formatCurrency } from '$lib/utils/currency';

	let { data } = $props();
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

	let categoryDataCurrent = $derived(getCategoryDataCurrent());
	let categoryDataPurchase = $derived(getCategoryDataPurchase());

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

	function getCategoryDataCurrent() {
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

	function getCategoryDataPurchase() {
		const categoryCounts = {};
		assetsWithCurrentPrice.forEach((asset) => {
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

	let performanceDataSum = $derived(
		Object.entries(groupedAssets).map(([ticker, assets]) => {
			const summary = getSummary(assets);
			return {
				group: ticker,
				value: summary.profitLoss
			};
		})
	);

	let performanceDataPct = $derived(
		Object.entries(groupedAssets).map(([ticker, assets]) => {
			const summary = getSummary(assets);
			return {
				group: ticker,
				value: summary.profitLossPct
			};
		})
	);

	let assetsMarketValueData = $derived(
		Object.entries(groupedAssets).map(([ticker, assets]) => {
			const summary = getSummary(assets);
			return {
				group: ticker,
				value: summary.marketValue
			};
		})
	);

	// Track which assets have missing Yahoo prices
	let assetsWithMissingYahooPrice = $derived(
		assetsWithCurrentPrice.filter(
			(asset) =>
				asset.ticker && (!currentPrices[asset.ticker] || currentPrices[asset.ticker]?.price == null)
		)
	);
</script>

<div class="px-4 py-4 md:px-0 md:py-8">
	<div class="mx-auto w-full max-w-4xl rounded-md bg-white/90 p-4 shadow">
		{#if assetsWithCurrentPrice && assetsWithCurrentPrice.length > 0}
			<h2 class="mb-8 font-semibold">Portfolio Overview</h2>
			<div class="mb-8 flex flex-col items-center justify-between md:flex-row md:flex-wrap">
				<PieChart data={categoryDataCurrent} title="Categories - current allocation" />
				<PieChart data={assetsMarketValueData} title="Assets - market value" />
				<!-- <PieChart data={categoryDataPurchase} title="Categories - purchase cost" /> -->
				<BarChart data={performanceDataSum} title="Performance by Ticker (EUR)" />
				<BarChart data={performanceDataPct} title="Performance by Ticker (%)" />
			</div>
			<div>
				<div class="w-full">
					<!-- Mobile-first asset list -->
					<div class="block md:hidden">
						<div class="mb-2 flex items-center justify-between">
							<h2 class="mb-2 font-semibold">Asset List</h2>
							<div class="text-right">
								<div class="text-sm font-bold">
									{formatCurrency(marketValueTotal, 'en-US', 'EUR', 0)}
								</div>
								<div class={profitLossTotal < 0 ? 'text-xs text-red-600' : 'text-xs'}>
									{formatCurrency(profitLossTotal, 'en-US', 'EUR', 0)}
									<span class={profitLossPctTotal < 0 ? 'text-red-600' : ''}>
										({profitLossPctTotal.toFixed(1)}%)
									</span>
								</div>
							</div>
						</div>
						{#each Object.entries(groupedAssets) as [ticker, assets]}
							{@const summary = getSummary(assets)}
							<div
								class="mb-2 cursor-pointer rounded bg-blue-50 p-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
								role="button"
								tabindex="0"
								onclick={() => toggleTicker(ticker)}
								onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleTicker(ticker)}
								aria-expanded={!!expandedTickers[ticker]}
							>
								<div class="flex items-center justify-between">
									<div class="w-36 max-w-36 min-w-36 font-semibold break-words">{summary.name}</div>
									<div class="text-right">
										<span class="text-xs text-gray-400">Qty</span>
										<div>
											{Number.isInteger(summary.totalQty)
												? summary.totalQty
												: summary.totalQty.toFixed(4)}
										</div>
									</div>
									<div class="text-right">
										<span class="text-xs text-gray-400">Current</span>
										<div
											class={assetsWithMissingYahooPrice.find((a) => a.ticker === ticker)
												? 'font-semibold text-yellow-600'
												: ''}
										>
											{formatCurrency(summary.weightedCurrentPrice, 'en-US', summary.currency)}
										</div>
									</div>
									<div class="text-right">
										<span class="text-xs text-gray-400">Market Value</span>
										<div>{formatCurrency(summary.marketValue, 'en-US', summary.currency, 0)}</div>
									</div>
								</div>
								<div class="mt-1 flex items-end justify-between text-xs">
									<div class="pl-1 text-gray-500">
										<span class="text-xs text-gray-400">Purchase @</span>
										<div>
											{formatCurrency(summary.weightedPurchasePrice, 'en-US', summary.currency)}
										</div>
									</div>
									<div class="text-right">
										<span class="text-xs text-gray-400">P/L</span>
										<div class={summary.profitLoss < 0 ? 'text-red-600' : ''}>
											{formatCurrency(summary.profitLoss, 'en-US', summary.currency, 0)}
										</div>
										<div class={summary.profitLossPct < 0 ? 'text-red-600' : ''}>
											{summary.profitLossPct.toFixed(1)}%
										</div>
									</div>
								</div>
								{#if expandedTickers[ticker]}
									<div class="mt-2 space-y-1">
										{#each [...assets].sort((a, b) => new Date(a.purchase_date) - new Date(b.purchase_date)) as asset}
											<div class="rounded bg-gray-50 p-2 text-xs">
												<div class="flex items-center justify-between">
													<div class="w-32 max-w-32 min-w-32 font-medium break-words">
														{asset.name}
													</div>
													<div class="text-right">
														<span class="text-[10px] text-gray-400">Qty</span>
														<div>
															{Number.isInteger(asset.quantity)
																? asset.quantity
																: asset.quantity.toFixed(4)}
														</div>
													</div>
													<div class="text-right">
														<span class="text-[10px] text-gray-400">Current</span>
														<div>
															{formatCurrency(asset.current_price, 'en-US', asset.currency)}
														</div>
													</div>
													<div class="text-right">
														<span class="text-[10px] text-gray-400">Market Value</span>
														<div>
															{formatCurrency(
																calculateMarketValueTotal(asset),
																'en-US',
																asset.currency,
																0
															)}
														</div>
													</div>
												</div>
												<div class="mt-1 flex items-end justify-between text-[10px]">
													<div class="pl-1 text-gray-500">
														<span class="text-[10px] text-gray-400">Purchase @</span>
														<div>
															{formatCurrency(asset.purchase_price, 'en-US', asset.currency)}
														</div>
													</div>
													<div class="text-right">
														<span class="text-[10px] text-gray-400">P/L</span>
														<div class={calculateProfitLoss(asset) < 0 ? 'text-red-600' : ''}>
															{formatCurrency(
																calculateProfitLoss(asset),
																'en-US',
																asset.currency,
																0
															)}
														</div>
														<div class={calculateProfitLossPct(asset) < 0 ? 'text-red-600' : ''}>
															{(calculateProfitLossPct(asset) * 100).toFixed(1)}%
														</div>
													</div>
												</div>
											</div>
										{/each}
									</div>
								{/if}
							</div>
						{/each}
						{#if assetsWithMissingYahooPrice.length > 0}
							<div
								class="mt-4 rounded border border-yellow-200 bg-yellow-50 p-2 text-xs text-yellow-800"
							>
								<b>Note:</b> Current price could not be fetched for: {assetsWithMissingYahooPrice
									.map((a) => a.name)
									.join(', ')}. Purchase price is shown instead.
							</div>
						{/if}
					</div>
					<!-- Desktop table -->
					<h2 class="mb-2 hidden font-semibold md:block">Asset List</h2>
					<table class="hidden w-full border-collapse text-xs md:table">
						<thead>
							<tr>
								<th class="px-2 py-1 text-left">Name</th>
								<th class="px-2 py-1 text-left">Cat.</th>
								<th class="px-2 py-1 text-right">Qty</th>
								<th class="px-2 py-1 text-right">Purchase <br />Date</th>
								<th class="px-2 py-1 text-right">Purchase<br />Price</th>
								<th class="px-2 py-1 text-right">Current <br />Price</th>
								<th class="px-2 py-1 text-right">Purchase<br />Total</th>
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
									<td class="px-2 py-1 text-right">
										{summary.oldestPurchaseDate ? formatDate(summary.oldestPurchaseDate) : ''}
									</td>
									<td class="px-2 py-1 text-right">
										{formatCurrency(summary.weightedPurchasePrice, 'en-US', summary.currency)}
									</td>
									<td
										class="px-2 py-1 text-right {assetsWithMissingYahooPrice.find(
											(a) => a.ticker === ticker
										)
											? 'font-semibold text-yellow-600'
											: ''}"
									>
										{formatCurrency(summary.weightedCurrentPrice, 'en-US', summary.currency)}
									</td>
									<td class="px-2 py-1 text-right"
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
											<td class="px-2 py-1 text-right">{formatDate(asset.purchase_date)}</td>
											<td class="px-2 py-1 text-right"
												>{formatCurrency(asset.purchase_price, 'en-US', asset.currency)}</td
											>
											<td class="px-2 py-1 text-right"
												>{formatCurrency(asset.current_price, 'en-US', asset.currency)}</td
											>
											<td
												class="px-2 py-1 text-right {calculatePurchaseTotal(asset) < 0
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
								<td></td>
								<td></td>
								<td></td>
								<td class="px-2 py-1 text-right"
									>{formatCurrency(purchaseTotal, 'en-US', 'EUR', 0)}</td
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
		{:else}
			<p>No assets found.</p>
		{/if}
	</div>
</div>
