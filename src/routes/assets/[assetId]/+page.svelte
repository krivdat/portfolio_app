<script>
	import { formatDate } from '$lib/utils/date';
	import AssetForm from '$lib/components/AssetForm.svelte';

	let { data } = $props();

	let formattedAsset = $derived({
		...data.asset,
		purchase_date: formatDate(data.asset.purchase_date, 'en-CA', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit'
		})
	});
</script>

<AssetForm asset={formattedAsset} isUpdate={true} />
