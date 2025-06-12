<script>
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { goto } from '$app/navigation';
	import { formatDate } from '$lib/utils/date';
	import AssetForm from '$lib/components/AssetForm.svelte';

	let { data } = $props();
	let asset = $state(data.asset);
	let user = $derived(data.user);

	let formattedAsset = $derived({
		...asset,
		purchase_date: formatDate(asset.purchase_date, 'en-CA', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit'
		})
	});
</script>

<h1>Edit Asset</h1>

<AssetForm asset={formattedAsset} isUpdate={true} onSuccess={() => goto('/assets')} />

<form
	action="?/delete"
	method="POST"
	use:enhance={() => {
		return async ({ result }) => {
			if (result.type === 'success') {
				if (confirm('Are you sure you want to delete this asset?')) {
					goto('/assets');
				}
				return false;
			}
		};
	}}
>
	<button type="submit" class="delete-button">Delete Asset</button>
</form>
