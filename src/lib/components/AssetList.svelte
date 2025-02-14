<script>
    import { createEventDispatcher } from 'svelte';

    export let assets;

    const dispatch = createEventDispatcher();

    function handleAssetClick(assetId) {
        dispatch('assetClick', { assetId });
    }
</script>

{#if assets && assets.length > 0}
    <ul>
        {#each assets as asset (asset.id)}
            <li>
                <a href={`/assets/${asset.id}`} on:click|preventDefault={() => handleAssetClick(asset.id)}>
                    {asset.name} ({asset.category}) - {asset.ticker}
                </a>
            </li>
        {/each}
    </ul>
{:else}
    <p>No assets found.</p>
{/if}