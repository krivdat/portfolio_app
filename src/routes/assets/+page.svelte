<script>
	import AssetForm from '$lib/components/AssetForm.svelte';
	import AssetList from '$lib/components/AssetList.svelte';

	let { data } = $props();
	let openAssets = $derived(data.assets.filter((asset) => asset.status === 'open'));
	let user = $derived(data.user);
</script>

<div class="px-4 py-4 md:p-8 md:px-0 md:pb-4">
	{#if user}
		<AssetForm />
	{/if}

	{#if openAssets && openAssets.length > 0}
		<AssetList {openAssets} />
	{:else}
		<p>No assets found.</p>
	{/if}
</div>
