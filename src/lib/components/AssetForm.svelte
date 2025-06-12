<script>
	import { enhance } from '$app/forms';

	const today = new Date().toISOString().split('T')[0];

	export let asset = {
		// Default values
		category: '',
		name: '',
		purchase_price: 0.0,
		purchase_date: today,
		quantity: 0,
		currency: '',
		ticker: ''
	};
	export let isUpdate = false; // Flag to indicate create or update mode
</script>

<form
	method="POST"
	action={isUpdate ? '?/update' : '?/create'}
	use:enhance
	class="mx-auto mt-6 flex w-full max-w-md flex-col gap-2 rounded-lg border border-gray-200 bg-gray-50 p-4 shadow"
>
	<h2 class="mb-1 text-xl font-bold text-gray-800">
		{isUpdate ? 'Update Asset' : 'Add Asset'}
	</h2>

	<div class="flex flex-col gap-0.5">
		<label for="category" class="text-sm font-medium text-gray-600">Category</label>
		<input
			type="text"
			id="category"
			name="category"
			bind:value={asset.category}
			required
			class="rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 transition-colors duration-150 focus:border-blue-300 focus:ring-1 focus:ring-blue-200 focus:outline-none"
			placeholder="e.g. ETF, STOCK, CRYPTO, ..."
		/>
	</div>

	<div class="flex flex-col gap-0.5">
		<label for="name" class="text-sm font-medium text-gray-600">Name</label>
		<input
			type="text"
			id="name"
			name="name"
			bind:value={asset.name}
			required
			class="rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 transition-colors duration-150 focus:border-blue-300 focus:ring-1 focus:ring-blue-200 focus:outline-none"
			placeholder="Asset name"
		/>
	</div>

	<div class="flex flex-col gap-0.5">
		<label for="purchasePrice" class="text-sm font-medium text-gray-600">Purchase Price</label>
		<input
			type="number"
			id="purchasePrice"
			name="purchasePrice"
			bind:value={asset.purchase_price}
			step="0.01"
			min="0"
			required
			class="rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 transition-colors duration-150 focus:border-blue-300 focus:ring-1 focus:ring-blue-200 focus:outline-none"
			placeholder="0.00"
		/>
	</div>

	<div class="flex flex-col gap-0.5">
		<label for="purchaseDate" class="text-sm font-medium text-gray-600">Purchase Date</label>
		<input
			type="date"
			id="purchaseDate"
			name="purchaseDate"
			bind:value={asset.purchase_date}
			required
			class="rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 transition-colors duration-150 focus:border-blue-300 focus:ring-1 focus:ring-blue-200 focus:outline-none"
		/>
	</div>

	<div class="flex flex-col gap-0.5">
		<label for="quantity" class="text-sm font-medium text-gray-600">Quantity</label>
		<input
			type="number"
			id="quantity"
			name="quantity"
			bind:value={asset.quantity}
			required
			min="0"
			placeholder="0"
			class="rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 transition-colors duration-150 focus:border-blue-300 focus:ring-1 focus:ring-blue-200 focus:outline-none"
		/>
	</div>

	<div class="flex flex-col gap-0.5">
		<label for="currency" class="text-sm font-medium text-gray-600">Currency</label>
		<input
			type="text"
			id="currency"
			name="currency"
			bind:value={asset.currency}
			required
			placeholder="e.g. USD, EUR, BTC"
			class="rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 transition-colors duration-150 focus:border-blue-300 focus:ring-1 focus:ring-blue-200 focus:outline-none"
		/>
	</div>

	<div class="flex flex-col gap-0.5">
		<label for="ticker" class="text-sm font-medium text-gray-600">Ticker</label>
		<input
			type="text"
			id="ticker"
			name="ticker"
			bind:value={asset.ticker}
			placeholder="e.g. AAPL, BTC"
			class="rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 transition-colors duration-150 focus:border-blue-300 focus:ring-1 focus:ring-blue-200 focus:outline-none"
		/>
	</div>

	<button
		type="submit"
		class="mt-2 w-full rounded bg-blue-200 px-3 py-1.5 text-base font-semibold text-blue-900 shadow transition-colors duration-150 hover:bg-blue-300 focus:ring-1 focus:ring-blue-200 focus:outline-none"
	>
		{isUpdate ? 'Update Asset' : 'Add Asset'}
	</button>
</form>

<style>
	/* Removed .input class and @apply usage, as Tailwind utility classes are now used inline. */
</style>
