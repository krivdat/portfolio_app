<script>
	import AssetForm from '$lib/components/AssetForm.svelte';
	import AssetList from '$lib/components/AssetList.svelte';

	let { data } = $props();
	let assets = $derived(data.assets);
	let user = $derived(data.user);
</script>

{#if user}
	<div class="px-4 py-4 md:p-8 md:px-0">
		<AssetForm />
	</div>
{/if}

<div class="px-4 py-4 md:p-8 md:px-0">
	{#if assets && assets.length > 0}
		<AssetList {assets} />
	{:else}
		<p>No assets found.</p>
	{/if}
</div>
