<script>
	import AssetForm from '$lib/components/AssetForm.svelte';
	import AssetList from '$lib/components/AssetList.svelte';

	let { data } = $props();
	let assets = $derived(data.assets);
	let user = $derived(data.user);
</script>

{#if user}
	<AssetForm />

	{#if assets && assets.length > 0}
		<AssetList {assets} />
	{:else}
		<p>No assets found.</p>
	{/if}
{:else}
	<p>Please <a href="/login">login</a> to manage your assets.</p>
{/if}
