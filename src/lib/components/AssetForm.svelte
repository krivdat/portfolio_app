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
	class="mx-auto mt-8 flex w-full max-w-md flex-col gap-4 rounded-xl border border-gray-200 bg-gray-50 p-6 shadow-lg"
>
	<h2 class="mb-2 text-2xl font-bold text-gray-800">
		{isUpdate ? 'Update Asset' : 'Add Asset'}
	</h2>

	<div class="flex flex-col gap-1">
		<label for="category" class="font-medium text-gray-600">Category</label>
		<input
			type="text"
			id="category"
			name="category"
			bind:value={asset.category}
			required
			class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 transition-colors duration-150 focus:border-blue-300 focus:ring-2 focus:ring-blue-200 focus:outline-none"
			placeholder="e.g. ETF, STOCK, CRYPTO, ..."
		/>
	</div>

	<div class="flex flex-col gap-1">
		<label for="name" class="font-medium text-gray-600">Name</label>
		<input
			type="text"
			id="name"
			name="name"
			bind:value={asset.name}
			required
			class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 transition-colors duration-150 focus:border-blue-300 focus:ring-2 focus:ring-blue-200 focus:outline-none"
			placeholder="Asset name"
		/>
	</div>

	<div class="flex flex-col gap-1">
		<label for="purchasePrice" class="font-medium text-gray-600">Purchase Price</label>
		<input
			type="number"
			id="purchasePrice"
			name="purchasePrice"
			bind:value={asset.purchase_price}
			step="0.01"
			min="0"
			required
			class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 transition-colors duration-150 focus:border-blue-300 focus:ring-2 focus:ring-blue-200 focus:outline-none"
			placeholder="0.00"
		/>
	</div>

	<div class="flex flex-col gap-1">
		<label for="purchaseDate" class="font-medium text-gray-600">Purchase Date</label>
		<input
			type="date"
			id="purchaseDate"
			name="purchaseDate"
			bind:value={asset.purchase_date}
			required
			class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 transition-colors duration-150 focus:border-blue-300 focus:ring-2 focus:ring-blue-200 focus:outline-none"
		/>
	</div>

	<div class="flex flex-col gap-1">
		<label for="quantity" class="font-medium text-gray-600">Quantity</label>
		<input
			type="number"
			id="quantity"
			name="quantity"
			bind:value={asset.quantity}
			required
			min="0"
			placeholder="0"
			class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 transition-colors duration-150 focus:border-blue-300 focus:ring-2 focus:ring-blue-200 focus:outline-none"
		/>
	</div>

	<div class="flex flex-col gap-1">
		<label for="currency" class="font-medium text-gray-600">Currency</label>
		<input
			type="text"
			id="currency"
			name="currency"
			bind:value={asset.currency}
			required
			placeholder="e.g. USD, EUR, BTC"
			class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 transition-colors duration-150 focus:border-blue-300 focus:ring-2 focus:ring-blue-200 focus:outline-none"
		/>
	</div>

	<div class="flex flex-col gap-1">
		<label for="ticker" class="font-medium text-gray-600">Ticker</label>
		<input
			type="text"
			id="ticker"
			name="ticker"
			bind:value={asset.ticker}
			placeholder="e.g. AAPL, BTC"
			class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 transition-colors duration-150 focus:border-blue-300 focus:ring-2 focus:ring-blue-200 focus:outline-none"
		/>
	</div>

	<button
		type="submit"
		class="mt-4 w-full rounded-lg bg-blue-200 px-4 py-2 text-lg font-semibold text-blue-900 shadow transition-colors duration-150 hover:bg-blue-300 focus:ring-2 focus:ring-blue-200 focus:outline-none"
	>
		{isUpdate ? 'Update Asset' : 'Add Asset'}
	</button>
</form>

<style>
	/* Removed .input class and @apply usage, as Tailwind utility classes are now used inline. */
</style>
