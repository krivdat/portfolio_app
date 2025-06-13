<script>
	import AssetForm from '$lib/components/AssetForm.svelte';
	import AssetList from '$lib/components/AssetList.svelte';

	let { data } = $props();
	let assets = $derived(data.assets);
	let user = $derived(data.user);
</script>

<div class="container my-4 max-w-4xl rounded bg-white p-2 shadow-sm sm:mx-auto sm:p-4 sm:px-6">
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
</div>
