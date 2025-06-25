<script>
	import { formatCurrency } from '$lib/utils/currency';
	import { formatDate } from '$lib/utils/date';

	let { data } = $props();

	let closedAssets = $derived(data.assets.filter((asset) => asset.status === 'closed'));

	let totalProfitLoss = $derived(
		closedAssets.reduce((sum, asset) => {
			const profitLoss = (asset.closing_price - asset.purchase_price) * asset.quantity;
			return sum + profitLoss;
		}, 0)
	);

	function calculateProfitLoss(asset) {
		return (asset.closing_price - asset.purchase_price) * asset.quantity;
	}

	function calculateTotalValue(asset) {
		return asset.closing_price * asset.quantity;
	}
</script>

<div class="px-4 py-4 md:px-0 md:py-8">
	<div class="mx-auto w-full max-w-screen-xl">
		<h1 class="mb-4 text-2xl font-bold text-white drop-shadow-lg">Closed Positions</h1>
	</div>
	<div class="mx-auto w-full max-w-screen-xl rounded-md bg-white/90 p-4 shadow">
		<div class="mx-4 mb-6 rounded bg-gray-50 p-4 shadow-sm">
			<h3 class="mb-2 font-bold text-gray-800">Summary</h3>
			<p>
				Total Profit/Loss:
				<span
					class="font-bold"
					class:text-green-600={totalProfitLoss >= 0}
					class:text-red-600={totalProfitLoss < 0}
				>
					{formatCurrency(totalProfitLoss)}
				</span>
			</p>
		</div>

		<!-- Mobile-first card list -->
		<div class="block md:hidden">
			{#if closedAssets && closedAssets.length > 0}
				{#each closedAssets as asset (asset.id)}
					<div class="mb-2 rounded bg-blue-50 p-3 text-sm shadow-sm">
						<div class="flex w-full items-center">
							<div>
								<a href={`/assets/${asset.id}`} class="text-blue-700 hover:underline"
									>{asset.name}</a
								>
							</div>
							<div class="ml-2">
								<span class="text-xs font-semibold text-gray-500">[{asset.ticker}]</span>
							</div>
							<div class="ml-2">
								<span class="text-xs text-gray-500">{asset.category}</span>
							</div>
							<div class="flex-grow"></div>
							<div>
								<span class="text-xs text-gray-400">Qty:</span>
								<span class="ml-0.5 text-xs">{asset.quantity}</span>
							</div>
						</div>
						<div class="grid grid-cols-3 gap-x-2 gap-y-1 text-xs">
							<div>
								<div>
									<span class="text-gray-400">Buy @</span>
									{formatCurrency(asset.purchase_price)}
								</div>
								<div><span class="text-gray-400">Buy:</span> {formatDate(asset.purchase_date)}</div>
							</div>
							<div>
								<div>
									<span class="text-gray-400">Sell @</span>
									{formatCurrency(asset.closing_price)}
								</div>
								<div>
									<span class="text-gray-400">Sell:</span>
									{asset.closing_date ? formatDate(asset.closing_date) : ''}
								</div>
							</div>
							<div class="text-right">
								<div>
									<span class="text-gray-400">Value:</span>
									{formatCurrency(calculateTotalValue(asset))}
								</div>
								<div>
									<span class="text-gray-400">P/L:</span>
									<span
										class="font-semibold"
										class:text-green-600={calculateProfitLoss(asset) >= 0}
										class:text-red-600={calculateProfitLoss(asset) < 0}
										>{formatCurrency(calculateProfitLoss(asset))}</span
									>
									<span
										class="text-xs"
										class:text-green-600={calculateProfitLoss(asset) >= 0}
										class:text-red-600={calculateProfitLoss(asset) < 0}
									>
										({asset.purchase_price
											? (
													(calculateProfitLoss(asset) / (asset.purchase_price * asset.quantity)) *
													100
												).toFixed(1)
											: '0.0'}%)
									</span>
								</div>
							</div>
						</div>
					</div>
				{/each}
			{:else}
				<p class="mx-4 text-gray-500 italic">No closed positions found.</p>
			{/if}
		</div>

		<!-- Desktop table -->
		<table class="hidden w-full border-collapse text-xs md:table">
			<thead>
				<tr class="bg-gray-100">
					<th class="px-2 py-1 text-left">Name</th>
					<th class="px-2 py-1 text-left">Category</th>
					<th class="px-2 py-1 text-left">Ticker</th>
					<th class="px-2 py-1 text-right">Qty</th>
					<th class="px-2 py-1 text-right">Buy Date</th>
					<th class="px-2 py-1 text-right">Buy Price</th>
					<th class="px-2 py-1 text-right">Sell Price</th>
					<th class="px-2 py-1 text-right">Sell Date</th>
					<th class="px-2 py-1 text-right">Total Value</th>
					<th class="px-2 py-1 text-right">P/L</th>
				</tr>
			</thead>
			<tbody>
				{#each closedAssets as asset (asset.id)}
					<tr class="bg-white transition hover:bg-blue-50">
						<td class="px-2 py-1 font-semibold">
							<a href={`/assets/${asset.id}`} class="text-blue-700 hover:underline">{asset.name}</a>
						</td>
						<td class="px-2 py-1">{asset.category}</td>
						<td class="px-2 py-1">{asset.ticker}</td>
						<td class="px-2 py-1 text-right">{asset.quantity}</td>
						<td class="px-2 py-1 text-right">{formatDate(asset.purchase_date)}</td>
						<td class="px-2 py-1 text-right">{formatCurrency(asset.purchase_price)}</td>
						<td class="px-2 py-1 text-right">{formatCurrency(asset.closing_price)}</td>
						<td class="px-2 py-1 text-right"
							>{asset.closing_date ? formatDate(asset.closing_date) : ''}</td
						>
						<td class="px-2 py-1 text-right">{formatCurrency(calculateTotalValue(asset))}</td>
						<td
							class="px-2 py-1 text-right font-semibold"
							class:text-green-600={calculateProfitLoss(asset) >= 0}
							class:text-red-600={calculateProfitLoss(asset) < 0}
						>
							{formatCurrency(calculateProfitLoss(asset))}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
