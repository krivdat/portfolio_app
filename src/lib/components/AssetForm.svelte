<script>
	import { enhance } from '$app/forms';

	export let asset = {
		// Default values
		category: '',
		name: '',
		purchase_price: 0.0,
		purchase_date: '',
		quantity: 0,
		currency: '',
		ticker: ''
	};
	export let isUpdate = false; // Flag to indicate create or update mode
</script>

<form method="POST" action={isUpdate ? '?/update' : '?/create'} use:enhance>
	<label for="category">Category:</label>
	<input type="text" id="category" name="category" bind:value={asset.category} required />

	<label for="name">Name:</label>
	<input type="text" id="name" name="name" bind:value={asset.name} required />
	<label for="purchasePrice">Purchase Price:</label>
	<input
		type="number"
		id="purchasePrice"
		name="purchasePrice"
		bind:value={asset.purchase_price}
		step="0.01"
		min="0"
		required
	/>

	<label for="purchaseDate">Purchase Date:</label>
	<input
		type="date"
		id="purchaseDate"
		name="purchaseDate"
		bind:value={asset.purchase_date}
		required
	/>
	<label for="quantity">Quantity:</label>
	<input type="number" id="quantity" name="quantity" bind:value={asset.quantity} required />

	<label for="currency">Currency:</label>
	<input type="text" id="currency" name="currency" bind:value={asset.currency} required />

	<label for="ticker">Ticker:</label>
	<input type="text" id="ticker" name="ticker" bind:value={asset.ticker} />

	<button type="submit">{isUpdate ? 'Update Asset' : 'Add Asset'}</button>
</form>
