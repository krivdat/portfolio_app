<script>
	import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';

	const today = new Date().toISOString().split('T')[0];

	const defaultAsset = {
		category: '',
		name: '',
		purchase_price: 0.0,
		purchase_date: today,
		quantity: 0,
		currency: 'EUR',
		ticker: '',
		status: 'open',
		closing_price: '',
		closing_date: '',
		closing_note: ''
	};

	let { asset = defaultAsset, isUpdate = false, form } = $props();

	let showTickerInfo = $state(false);
	let showPurchasePriceInfo = $state(false);
	let showDeleteConfirm = $state(false);

	function handleStatusChange(e) {
		asset.status = e.target.value;
		if (asset.status === 'open') {
			asset.closing_price = '';
			asset.closing_date = '';
			asset.closing_note = '';
		} else if (asset.status === 'closed' && !asset.closing_date) {
			asset.closing_date = today;
		}
	}
</script>

<div class="mx-auto mb-4 w-full max-w-screen-xl rounded-md bg-white/90 p-4 shadow">
	<form
		method="POST"
		action={isUpdate ? '?/update' : '?/create'}
		use:enhance={() => {
			return async ({ result }) => {
				if (result.type === 'success') {
					await invalidateAll();
					goto('/assets');
					// asset = { ...defaultAsset };
				}
			};
		}}
	>
		<h2 class="mb-2 font-bold text-gray-800">
			{isUpdate ? 'Update Asset' : 'Add Asset'}
		</h2>

		{#if form?.error}
			<p style="color: red">{form.error}</p>
		{/if}

		<div class="grid grid-cols-1 gap-2 md:grid-cols-6">
			<div class="flex flex-col gap-0.5 md:col-span-3">
				<label for="name" class="text-sm font-medium text-gray-600">Name</label>
				<input
					type="text"
					id="name"
					name="name"
					bind:value={asset.name}
					required
					placeholder="Asset name"
					class="rounded border border-gray-300 px-2 py-1 text-sm text-gray-900 transition-colors duration-150 focus:border-blue-300 focus:ring-1 focus:ring-blue-200 focus:outline-none disabled:bg-gray-100 disabled:text-gray-400"
					disabled={asset.status === 'closed'}
				/>
			</div>
			<!-- Ticker & Category: now in a flex row for all screens -->
			<div class="flex flex-row gap-2 md:col-span-3">
				<div class="flex flex-1 flex-col gap-0.5">
					<label for="ticker" class="flex items-center gap-1 text-sm font-medium text-gray-600">
						Ticker
						<button
							type="button"
							tabindex="0"
							aria-label="Ticker info"
							class="ml-1 text-blue-500 hover:text-blue-700 focus:outline-none"
							onclick={() => (showTickerInfo = !showTickerInfo)}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="inline h-4 w-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								><circle cx="12" cy="12" r="10" stroke-width="2" /><path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 16v-4m0-4h.01"
								/></svg
							>
						</button>
					</label>
					{#if showTickerInfo}
						<div class="mb-1 max-w-xs rounded bg-blue-50 p-2 text-xs text-gray-700 shadow">
							<p class="mb-1 font-semibold">Ticker info:</p>
							<ul class="list-disc pl-4">
								<li>
									The ticker must exist on <a
										href="https://finance.yahoo.com/"
										target="_blank"
										rel="noopener"
										class="text-blue-600 underline">Yahoo Finance</a
									>.
								</li>
								<li>For Bitcoin use <span class="font-mono">BTC-USD</span>.</li>
								<li>
									If the ticker does not exist on Yahoo, the purchase price will be shown instead of
									market price in asset lists and charts.
								</li>
							</ul>
						</div>
					{/if}
					<input
						type="text"
						id="ticker"
						name="ticker"
						required
						placeholder="e.g. AAPL, BTC-USD"
						bind:value={asset.ticker}
						class="rounded border border-gray-300 px-2 py-1 text-sm text-gray-900 transition-colors duration-150 focus:border-blue-300 focus:ring-1 focus:ring-blue-200 focus:outline-none disabled:bg-gray-100 disabled:text-gray-400"
						disabled={asset.status === 'closed'}
					/>
				</div>
				<div class="flex w-32 flex-col gap-0.5">
					<label for="category" class="text-sm font-medium text-gray-600">Category</label>
					<select
						id="category"
						name="category"
						bind:value={asset.category}
						required
						class="rounded border border-gray-300 px-2 py-1 text-sm text-gray-900 transition-colors
						duration-150 focus:border-blue-300 focus:ring-1 focus:ring-blue-200 focus:outline-none disabled:bg-gray-100
						disabled:text-gray-400"
						disabled={asset.status === 'closed'}
					>
						<option value="" disabled selected>Select</option>
						<option value="STOCK">Stock</option>
						<option value="ETF">ETF</option>
						<option value="CRYPTO">Crypto</option>
						<option value="COMMODITY">Commodities</option>
					</select>
				</div>
			</div>
			<!-- Purchase Price & Currency: now in a flex row for all screens -->
			<div class="flex flex-row gap-2 md:col-span-3">
				<div class="flex flex-1 flex-col gap-0.5">
					<label for="purchasePrice" class="text-sm font-medium text-gray-600"
						>Purchase Price
						<button
							type="button"
							tabindex="0"
							aria-label="Ticker info"
							class="ml-1 text-blue-500 hover:text-blue-700 focus:outline-none"
							onclick={() => (showPurchasePriceInfo = !showPurchasePriceInfo)}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="inline h-4 w-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<circle cx="12" cy="12" r="10" stroke-width="2" />
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 16v-4m0-4h.01"
								/>
							</svg>
						</button>
					</label>
					{#if showPurchasePriceInfo}
						<div class="mb-1 max-w-xs rounded bg-blue-50 p-2 text-xs text-gray-700 shadow">
							<p class="mb-1 font-semibold">
								Currently the portfolio account's currency can only be EUR. When adding / updating
								asset in different currency please provide its EUR price equivalent (use exchange
								rate at the time of buying).
							</p>
						</div>
					{/if}
					<input
						type="number"
						id="purchasePrice"
						name="purchasePrice"
						bind:value={asset.purchase_price}
						step="0.01"
						min="0"
						required
						placeholder="0.00"
						class="rounded border border-gray-300 px-2 py-1 text-sm text-gray-900 transition-colors duration-150 focus:border-blue-300 focus:ring-1 focus:ring-blue-200 focus:outline-none disabled:bg-gray-100 disabled:text-gray-400"
						disabled={asset.status === 'closed'}
					/>
				</div>
				<div class="flex w-32 flex-col gap-0.5">
					<label for="currency" class="text-sm font-medium text-gray-600">Currency</label>
					<select
						id="currency"
						name="currency"
						bind:value={asset.currency}
						required
						class="rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 transition-colors duration-150 focus:border-blue-300 focus:ring-1 focus:ring-blue-200 focus:outline-none disabled:bg-gray-100 disabled:text-gray-400"
						disabled={asset.status === 'closed'}
					>
						<option value="EUR">EUR - Euro</option>
					</select>
				</div>
			</div>
			<!-- Purchase Date & Quantity: now in a flex row for all screens -->
			<div class="flex flex-row gap-2 md:col-span-3">
				<div class="flex flex-1 flex-col gap-0.5">
					<label for="purchaseDate" class="text-sm font-medium text-gray-600">Purchase Date</label>
					<input
						type="date"
						id="purchaseDate"
						name="purchaseDate"
						bind:value={asset.purchase_date}
						required
						class="rounded border border-gray-300 px-2 py-1 text-sm text-gray-900 transition-colors duration-150 focus:border-blue-300 focus:ring-1 focus:ring-blue-200 focus:outline-none disabled:bg-gray-100 disabled:text-gray-400"
						disabled={asset.status === 'closed'}
					/>
				</div>
				<div class="flex w-32 flex-col gap-0.5">
					<label for="quantity" class="text-sm font-medium text-gray-600">Quantity</label>
					<input
						type="number"
						id="quantity"
						name="quantity"
						bind:value={asset.quantity}
						required
						step="0.00000001"
						placeholder="0"
						class="rounded border border-gray-300 px-2 py-1 text-sm text-gray-900 transition-colors duration-150 focus:border-blue-300 focus:ring-1 focus:ring-blue-200 focus:outline-none disabled:bg-gray-100 disabled:text-gray-400"
						disabled={asset.status === 'closed'}
					/>
				</div>
			</div>

			<div class="flex flex-col gap-0.5 md:col-span-1">
				<label for="status" class="text-sm font-medium text-gray-600">Status</label>
				<select
					id="status"
					name="status"
					bind:value={asset.status}
					onchange={handleStatusChange}
					class="rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 transition-colors duration-150 focus:border-blue-300 focus:ring-1 focus:ring-blue-200 focus:outline-none"
				>
					<option value="open">Open</option>
					<option value="closed">Closed</option>
				</select>
			</div>
			{#if asset.status === 'closed'}
				<div class="flex flex-col gap-0.5 md:col-span-2">
					<label for="closing_price" class="text-sm font-medium text-gray-600">Closing Price</label>
					<input
						type="number"
						id="closing_price"
						name="closing_price"
						bind:value={asset.closing_price}
						step="0.01"
						min="0"
						required
						placeholder="0.00"
						class="rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 transition-colors duration-150 focus:border-blue-300 focus:ring-1 focus:ring-blue-200 focus:outline-none"
					/>
				</div>
				<div class="flex flex-col gap-0.5 md:col-span-2">
					<label for="closing_date" class="text-sm font-medium text-gray-600">Closing Date</label>
					<input
						type="date"
						id="closing_date"
						name="closing_date"
						bind:value={asset.closing_date}
						required
						class="rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 transition-colors duration-150 focus:border-blue-300 focus:ring-1 focus:ring-blue-200 focus:outline-none"
					/>
				</div>
				<div class="flex flex-col gap-0.5 md:col-span-6">
					<label for="closing_note" class="text-sm font-medium text-gray-600">Closing Note</label>
					<input
						type="text"
						id="closing_note"
						name="closing_note"
						bind:value={asset.closing_note}
						class="rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900"
					/>
				</div>
			{/if}
		</div>

		<div class="mt-4 flex gap-4">
			<button
				type="submit"
				class="flex-1 rounded bg-blue-300 px-3 py-1.5 text-base font-semibold text-blue-900 shadow transition-colors duration-150 hover:bg-blue-400 focus:ring-1 focus:ring-blue-200 focus:outline-none"
			>
				{isUpdate ? 'Update Asset' : 'Add Asset'}
			</button>
			{#if isUpdate}
				<button
					type="button"
					class="flex-1 rounded bg-red-500 px-3 py-1.5 text-base font-semibold text-white shadow transition-colors duration-150 hover:bg-red-600 focus:ring-1 focus:ring-red-300 focus:outline-none"
					onclick={() => (showDeleteConfirm = true)}
				>
					Delete Asset
				</button>
			{/if}
		</div>
	</form>

	{#if showDeleteConfirm}
		<form
			method="POST"
			action="?/delete"
			class="mt-4"
			use:enhance={() => {
				return async ({ result }) => {
					if (result.type === 'success') {
						await invalidateAll();
						goto('/assets');
					}
				};
			}}
		>
			<div class="mb-2 text-base font-semibold text-gray-800">
				Are you sure you want to delete this asset? This action cannot be undone!
			</div>
			<div class="flex justify-center gap-2">
				<button
					type="submit"
					class="rounded bg-red-500 px-3 py-1.5 font-semibold text-white hover:bg-red-600 focus:ring-1 focus:ring-red-300 focus:outline-none"
					>Yes, Delete</button
				>
				<button
					type="button"
					class="rounded bg-gray-200 px-3 py-1.5 font-semibold text-gray-800 hover:bg-gray-300 focus:ring-1 focus:ring-gray-300 focus:outline-none"
					onclick={() => (showDeleteConfirm = false)}>Cancel</button
				>
			</div>
		</form>
	{/if}
</div>
