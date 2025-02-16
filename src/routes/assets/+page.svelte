<script>
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { formatDate } from '$lib/utils/date';
	import { formatCurrency } from '$lib/utils/currency';
	import AssetForm from '$lib/components/AssetForm.svelte'; // Import the form
	import { page } from '$app/state'; // Import the page store

	export let data;
	let assets = data.assets;

	async function handleSubmit() {
		await invalidateAll();
	}
</script>

<h1>Assets</h1>

{#if page.data.session}
	<AssetForm /> <!-- Use the AssetForm component (for adding) -->
{:else}
	<p>Please <a href="/login">login</a> to manage your assets.</p>
{/if}

{#if assets && assets.length > 0}
	<ul>
		{#each assets as asset (asset.id)}
			<li>
				<a href={`/assets/${asset.id}`}>
					{asset.name} ({asset.category}) - {asset.ticker}
				</a>
			</li>
		{/each}
	</ul>
{:else}
	<p>No assets found.</p>
{/if}
