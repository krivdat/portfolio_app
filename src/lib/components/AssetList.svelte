<script>
	import { formatDate } from '$lib/utils/date';
	let { openAssets = [] } = $props();
</script>

<div class="mx-auto mb-8 w-full max-w-screen-xl rounded-md bg-white/90 p-4 shadow">
	<h2 class="mx-4 my-4 font-bold text-gray-800">Assets List</h2>
	{#if openAssets && openAssets.length > 0}
		<div class="overflow-x-auto">
			<table class="border-separate border-spacing-y-1">
				<thead class="text-sm">
					<tr class="bg-gray-100">
						<th class="px-4 py-2 text-left font-semibold text-gray-700">Name</th>
						<th class="px-4 py-2 text-left font-semibold text-gray-700">Category</th>
						<th class="px-4 py-2 text-left font-semibold text-gray-700">Ticker</th>
						<th class="px-4 py-2 text-left font-semibold text-gray-700">Purchase Date</th>
						<th class="px-4 py-2 text-left font-semibold text-gray-700">Quantity</th>
					</tr>
				</thead>
				<tbody class="text-xs">
					{#each openAssets as asset (asset.id)}
						<tr class="bg-white transition-colors hover:bg-blue-50">
							<td class="px-4 py-1">
								<a
									href={`/assets/${asset.id}`}
									class="cursor-pointer font-medium text-blue-700 hover:underline"
								>
									{asset.name}
								</a>
							</td>
							<td class="px-4 py-1 text-gray-600">{asset.category}</td>
							<td class="px-4 py-1 text-gray-600">{asset.ticker}</td>
							<td class="px-4 py-1 text-gray-600">{formatDate(asset.purchase_date)}</td>
							<td class="px-4 py-1 text-gray-600">{asset.quantity}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{:else}
		<p class="text-gray-500 italic">No assets found.</p>
	{/if}
</div>
