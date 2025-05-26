<script>
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import { formatDate, parseDate } from '$lib/utils/date';
	import { formatCurrency, parseCurrency } from '$lib/utils/currency';

	let { data } = $props();
	let asset = $state(data.asset);

	let formattedAsset = $derived({
		...asset,
		purchase_date: formatDate(asset.purchase_date, 'en-CA', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit'
		})
	});

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
	<input type="text" id="category" name="category" value={formattedAsset.category} required />

	<label for="name">Name:</label>
	<input type="text" id="name" name="name" value={formattedAsset.name} required />

	<label for="purchasePrice">Purchase Price:</label>
	<input
		type="number"
		id="purchasePrice"
		name="purchasePrice"
		value={formattedAsset.purchase_price}
		required
	/>

	<label for="purchaseDate">Purchase Date:</label>
	<input
		type="date"
		id="purchaseDate"
		name="purchaseDate"
		value={formattedAsset.purchase_date}
		required
	/>

	<label for="quantity">Quantity:</label>
	<input type="number" id="quantity" name="quantity" value={formattedAsset.quantity} required />

	<label for="currency">Currency:</label>
	<input type="text" id="currency" name="currency" value={formattedAsset.currency} required />

	<label for="ticker">Ticker:</label>
	<input type="text" id="ticker" name="ticker" value={formattedAsset.ticker || ''} />

	<button type="submit">Update Asset</button>
</form>

<button onclick={handleDelete}>Delete Asset</button>
