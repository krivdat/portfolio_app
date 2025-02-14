<script>
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { formatDate, parseDate } from '$lib/utils/date';
	import { formatCurrency, parseCurrency } from '$lib/utils/currency';

	export let data;
	let asset = data.asset;

	$: asset = {
		...asset,
		purchase_date: formatDate(asset.purchase_date, 'en-CA', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit'
		}) // Format for input type="date"
	};

	async function handleDelete() {
		const confirmed = confirm('Are you sure you want to delete this asset?');
		if (confirmed) {
			try {
				await $page.data.delete(); // Trigger the delete action
				await invalidateAll();
				window.location.href = '/assets'; // Redirect after successful deletion
			} catch (error) {
				console.error('Error deleting asset:', error);
				// Handle error appropriately (e.g., display an error message)
			}
		}
	}
</script>

<h1>Edit Asset</h1>

<form method="POST" action="?/update" use:enhance>
	<label for="category">Category:</label>
	<input type="text" id="category" name="category" value={asset.category} required />

	<label for="name">Name:</label>
	<input type="text" id="name" name="name" value={asset.name} required />

	<label for="purchasePrice">Purchase Price:</label>
	<input
		type="number"
		id="purchasePrice"
		name="purchasePrice"
		value={asset.purchase_price}
		required
	/>

	<label for="purchaseDate">Purchase Date:</label>
	<input type="date" id="purchaseDate" name="purchaseDate" value={asset.purchase_date} required />

	<label for="quantity">Quantity:</label>
	<input type="number" id="quantity" name="quantity" value={asset.quantity} required />

	<label for="currency">Currency:</label>
	<input type="text" id="currency" name="currency" value={asset.currency} required />

	<label for="ticker">Ticker:</label>
	<input type="text" id="ticker" name="ticker" value={asset.ticker || ''} />

	<button type="submit">Update Asset</button>
</form>

<button on:click={handleDelete}>Delete Asset</button>
