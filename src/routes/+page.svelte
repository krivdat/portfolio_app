<script>
  import { formatCurrency } from '$lib/utils/currency';

  let { data } = $props();
  console.log('In file routes/+page.svelte.');

  let user = $derived(data.user);
  let assets = $derived(data.assets || []);
  let currentPrices = $derived(data.currentPrices || {});

  let assetsWithCurrentPrice = $derived(
    assets.map((asset) => {
      const currentPriceData = asset.ticker ? currentPrices[asset.ticker] : null;
      return {
        ...asset,
        current_price: currentPriceData?.price || asset.purchase_price
      };
    })
  );

  let assetsMarketValueTotal = $derived(
    assetsWithCurrentPrice.reduce((total, asset) => total + asset.current_price * asset.quantity, 0)
  );

  let assetsQuantityTotal = $derived(
    assetsWithCurrentPrice.reduce((total, asset) => total + asset.quantity, 0)
  );
</script>

<!-- <div class="fixed inset-0 -z-10 h-full w-full">
	<img
		src="/stock-chart.png"
		alt="Stock chart background"
		class="h-full w-full object-cover object-center"
		aria-hidden="true"
	/>
	<div class="absolute inset-0 bg-gradient-to-b from-blue-900/30 to-blue-700/20"></div>
</div> -->

<div class="mx-auto mt-10 flex w-full max-w-xs flex-col items-center">
  <h1 class="mt-8 mb-8 text-3xl font-bold text-white drop-shadow-lg">Portfolio Tracker</h1>

  {#if user}
    <p class="text-white/90 drop-shadow">Hello, {user.first_name}!</p>
    <p class="text-center text-white/90 drop-shadow">
      You own <span class="font-semibold text-yellow-200">{assetsQuantityTotal.toFixed(0)}</span>
      assets with a total market value of
      <span class="font-semibold text-yellow-200">
        {formatCurrency(assetsMarketValueTotal, 'en-US', 'EUR', 0)}
      </span>
    </p>
  {:else}
    <p class="text-white/90 drop-shadow">You are not logged in.</p>
  {/if}
</div>
