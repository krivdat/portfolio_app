<script>
  import BarChart from '$lib/components/BarChart.svelte';
  import PieChart from '$lib/components/PieChart.svelte';
  import { formatDate } from '$lib/utils/date';
  import { formatCurrency } from '$lib/utils/currency';

  let { data } = $props();
  let openAssets = $derived(data.assets.filter((asset) => asset.status === 'open'));
  let currentPrices = $derived(data.currentPrices);
  let pricesStatus = $derived(data.pricesStatus);
  let assetsWithCurrentPrice = $derived(
    openAssets.map((asset) => {
      const currentPriceData = asset.ticker ? currentPrices[asset.ticker] : null;
      return {
        ...asset,
        current_price: currentPriceData?.price || asset.purchase_price
      };
    })
  );

  let categoryDataCurrent = $derived(getCategoryDataCurrent());
  let categoryDataPurchase = $derived(getCategoryDataPurchase());

  let purchaseTotal = $derived(
    assetsWithCurrentPrice.reduce(
      (total, asset) => total + asset.purchase_price * asset.quantity,
      0
    )
  );
  let marketValueTotal = $derived(
    assetsWithCurrentPrice.reduce((total, asset) => total + asset.current_price * asset.quantity, 0)
  );

  let profitLossTotal = $derived(
    assetsWithCurrentPrice.reduce((total, asset) => total + calculateProfitLoss(asset), 0)
  );

  let profitLossPctTotal = $derived(
    (assetsWithCurrentPrice.reduce((total, asset) => total + calculateProfitLoss(asset), 0) /
      assetsWithCurrentPrice.reduce(
        (total, asset) => total + asset.purchase_price * asset.quantity,
        0
      )) *
      100
  );

  // Group assets by ticker
  function groupAssetsByTicker(assets) {
    const groups = {};
    for (const asset of assets) {
      const key = asset.ticker || asset.name;
      if (!groups[key]) groups[key] = [];
      groups[key].push(asset);
    }
    return groups;
  }

  let groupedAssets = $derived(groupAssetsByTicker(assetsWithCurrentPrice));
  let expandedTickers = $state({});

  function toggleTicker(ticker) {
    expandedTickers = {
      ...expandedTickers,
      [ticker]: !expandedTickers[ticker]
    };
  }

  function getSummary(assets) {
    const first = assets[0];
    const totalQty = assets.reduce((sum, a) => sum + a.quantity, 0);
    const purchaseTotal = assets.reduce((sum, a) => sum + a.purchase_price * a.quantity, 0);
    const marketValue = assets.reduce((sum, a) => sum + a.current_price * a.quantity, 0);
    const profitLoss = marketValue - purchaseTotal;
    const profitLossPct = purchaseTotal ? (profitLoss / purchaseTotal) * 100 : 0;
    // Weighted average purchase price
    const weightedPurchasePrice = totalQty ? purchaseTotal / totalQty : 0;
    // Weighted average current price
    const weightedCurrentPrice = totalQty ? marketValue / totalQty : 0;
    // Oldest purchase date
    const oldestPurchaseDate = assets.reduce((oldest, a) => {
      if (!oldest) return a.purchase_date;
      // Compare as Date objects
      const aDate = new Date(a.purchase_date);
      const oldestDate = new Date(oldest);
      return aDate < oldestDate ? a.purchase_date : oldest;
    }, null);
    return {
      name: first.name,
      category: first.category,
      currency: first.currency,
      ticker: first.ticker,
      totalQty,
      purchaseTotal,
      marketValue,
      profitLoss,
      profitLossPct,
      weightedPurchasePrice,
      weightedCurrentPrice,
      oldestPurchaseDate
    };
  }

  function getCategoryDataCurrent() {
    const categoryCounts = {};
    assetsWithCurrentPrice.forEach((asset) => {
      categoryCounts[asset.category] =
        (categoryCounts[asset.category] || 0) + asset.current_price * asset.quantity;
    });

    let result = Object.entries(categoryCounts).map(([category, value]) => ({
      group: category,
      value
    }));
    console.log('Category Data:', result);

    return result;
  }

  function getCategoryDataPurchase() {
    const categoryCounts = {};
    assetsWithCurrentPrice.forEach((asset) => {
      categoryCounts[asset.category] =
        (categoryCounts[asset.category] || 0) + asset.purchase_price * asset.quantity;
    });

    let result = Object.entries(categoryCounts).map(([category, value]) => ({
      group: category,
      value
    }));
    console.log('Category Data:', result);

    return result;
  }

  function calculateProfitLoss(asset) {
    return (asset.current_price - asset.purchase_price) * asset.quantity;
  }

  function calculateProfitLossPct(asset) {
    return (asset.current_price - asset.purchase_price) / asset.purchase_price;
  }

  function calculatePurchaseTotal(asset) {
    return asset.purchase_price * asset.quantity;
  }

  function calculateMarketValueTotal(asset) {
    return asset.current_price * asset.quantity;
  }

  let performanceDataSum = $derived(
    Object.entries(groupedAssets).map(([ticker, assets]) => {
      const summary = getSummary(assets);
      return {
        group: ticker,
        value: summary.profitLoss
      };
    })
  );

  let performanceDataPct = $derived(
    Object.entries(groupedAssets).map(([ticker, assets]) => {
      const summary = getSummary(assets);
      return {
        group: ticker,
        value: summary.profitLossPct
      };
    })
  );

  let assetsMarketValueData = $derived(
    Object.entries(groupedAssets).map(([ticker, assets]) => {
      const summary = getSummary(assets);
      return {
        group: ticker,
        value: summary.marketValue
      };
    })
  );

  let investmentsMonthly = $derived.by(() => {
    const monthsNum = 13;
    const today = new Date();
    const lastMonths = [];
    for (let i = 0; i < monthsNum; i++) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      lastMonths.unshift(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
    }

    const monthlyDataMap = lastMonths.reduce((acc, monthKey) => {
      acc[monthKey] = 0;
      return acc;
    }, {});

    assetsWithCurrentPrice.forEach((asset) => {
      const date = new Date(asset.purchase_date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (monthlyDataMap.hasOwnProperty(monthKey)) {
        monthlyDataMap[monthKey] += asset.purchase_price * asset.quantity;
      }
    });

    const sortedMonthlyData = Object.entries(monthlyDataMap)
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .map(([month, value]) => ({
        group: month,
        value
      }));

    console.log('Monthly Data:', sortedMonthlyData);
    return sortedMonthlyData;
  });

  // Track which assets have missing Yahoo prices
  let assetsWithMissingYahooPrice = $derived(
    assetsWithCurrentPrice.filter(
      (asset) =>
        asset.ticker && (!currentPrices[asset.ticker] || currentPrices[asset.ticker]?.price == null)
    )
  );

  // Best/Worst by EUR
  let bestAssetEur = $derived(
    [...assetsWithCurrentPrice].sort((a, b) => calculateProfitLoss(b) - calculateProfitLoss(a))[0]
  );
  let worstAssetEur = $derived(
    [...assetsWithCurrentPrice].sort((a, b) => calculateProfitLoss(a) - calculateProfitLoss(b))[0]
  );
  // Best/Worst by %
  let bestAssetPct = $derived(
    [...assetsWithCurrentPrice].sort(
      (a, b) => calculateProfitLossPct(b) - calculateProfitLossPct(a)
    )[0]
  );
  let worstAssetPct = $derived(
    [...assetsWithCurrentPrice].sort(
      (a, b) => calculateProfitLossPct(a) - calculateProfitLossPct(b)
    )[0]
  );
</script>

<div class="px-4 py-4 md:px-4 md:py-8">
  <div class="mx-auto w-full max-w-screen-xl">
    <h1 class="mb-4 text-2xl font-bold text-white drop-shadow-lg">Portfolio Overview</h1>
  </div>

  {#if pricesStatus === 'stale'}
    <div class="mx-auto mb-4 w-full max-w-screen-xl">
      <div
        class="w-full rounded bg-yellow-100/90 p-2 text-sm text-yellow-800 shadow ring-1 ring-yellow-200/40"
      >
        <p>
          <b>Warning:</b> The current market prices could not be refreshed. The data shown may be outdated.
        </p>
      </div>
    </div>
  {/if}

  {#if !assetsWithCurrentPrice || assetsWithCurrentPrice.length <= 0}
    <p>No assets found.</p>
  {:else}
    <div class="mx-auto mb-4 w-full max-w-screen-xl">
      <div
        class="w-full rounded bg-gradient-to-br from-blue-100/90 via-white/80 to-blue-50/80 p-2 shadow ring-1 ring-blue-200/40 md:max-w-md"
      >
        <h2 class="mb-1 flex items-center gap-1 text-lg font-bold text-blue-900">
          <span
            class="inline-flex h-4 w-4 items-center justify-center rounded-full bg-blue-200 text-blue-700"
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-2.5 w-2.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M12 20c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z"
              /></svg
            ></span
          >
          Summary
        </h2>
        <div class="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
          <div class="text-sm font-medium text-gray-700">Total Market Value</div>
          <div class="text-right text-sm font-bold text-blue-900">
            {formatCurrency(marketValueTotal, 'en-US', 'EUR', 0)}
          </div>
          <div class="font-medium text-gray-700">Total P/L (EUR)</div>
          <div
            class="text-right font-bold {profitLossTotal < 0 ? 'text-red-600' : 'text-green-700'}"
          >
            {formatCurrency(profitLossTotal, 'en-US', 'EUR', 0)}
          </div>
          <div class="font-medium text-gray-700">Total P/L (%)</div>
          <div
            class="text-right font-bold {profitLossPctTotal < 0
              ? 'text-red-600'
              : 'text-green-700'}"
          >
            {profitLossPctTotal.toFixed(1)}%
          </div>
          <div class="col-span-2 my-0.5 border-t border-blue-200"></div>
          <!-- Best/Worst by EUR -->
          <div class="flex items-center gap-0.5 font-medium text-gray-700">
            <span
              class="inline-flex h-3 w-3 items-center justify-center rounded-full bg-green-100 text-green-700"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-1.5 w-1.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                ><path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                /></svg
              ></span
            >
            Best Position (EUR)
          </div>
          <div class="text-right">
            <span class="font-semibold">{bestAssetEur.name}</span>
            <span class="ml-1 text-[10px] text-gray-500">[{bestAssetEur.ticker}]</span>
            <div class="font-bold text-green-700">
              {formatCurrency(calculateProfitLoss(bestAssetEur), 'en-US', bestAssetEur.currency, 0)}
            </div>
          </div>
          <div class="flex items-center gap-0.5 font-medium text-gray-700">
            <span
              class="inline-flex h-3 w-3 items-center justify-center rounded-full bg-red-100 text-red-700"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-1.5 w-1.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                ><path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 13l-4 4-4-4"
                /></svg
              ></span
            >
            Worst Position (EUR)
          </div>
          <div class="text-right">
            <span class="font-semibold">{worstAssetEur.name}</span>
            <span class="ml-1 text-[10px] text-gray-500">[{worstAssetEur.ticker}]</span>
            <div class="font-bold text-red-600">
              {formatCurrency(
                calculateProfitLoss(worstAssetEur),
                'en-US',
                worstAssetEur.currency,
                0
              )}
            </div>
          </div>
          <!-- Best/Worst by % -->
          <div class="flex items-center gap-0.5 font-medium text-gray-700">
            <span
              class="inline-flex h-3 w-3 items-center justify-center rounded-full bg-green-100 text-green-700"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-1.5 w-1.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                ><path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                /></svg
              ></span
            >
            Best Position (%)
          </div>
          <div class="text-right">
            <span class="font-semibold">{bestAssetPct.name}</span>
            <span class="ml-1 text-[10px] text-gray-500">[{bestAssetPct.ticker}]</span>
            <div class="font-bold text-green-700">
              {(calculateProfitLossPct(bestAssetPct) * 100).toFixed(1)}%
            </div>
          </div>
          <div class="flex items-center gap-0.5 font-medium text-gray-700">
            <span
              class="inline-flex h-3 w-3 items-center justify-center rounded-full bg-red-100 text-red-700"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-1.5 w-1.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                ><path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 13l-4 4-4-4"
                /></svg
              ></span
            >
            Worst Position (%)
          </div>
          <div class="text-right">
            <span class="font-semibold">{worstAssetPct.name}</span>
            <span class="ml-1 text-[10px] text-gray-500">[{worstAssetPct.ticker}]</span>
            <div class="font-bold text-red-600">
              {(calculateProfitLossPct(worstAssetPct) * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mx-auto mb-4 w-full max-w-screen-xl rounded-md bg-white/90 p-4 shadow">
      <div class="flex flex-col items-center justify-around md:flex-row md:flex-wrap">
        <PieChart data={categoryDataCurrent} title="Categories - market value (EUR)" />
        <PieChart data={assetsMarketValueData} title="Assets - market value (EUR)" />
        <!-- <PieChart data={categoryDataPurchase} title="Categories - purchase cost" /> -->
        <BarChart data={performanceDataSum} title="Performance by Ticker (EUR)" />
        <BarChart data={performanceDataPct} title="Performance by Ticker (%)" />
        <BarChart data={investmentsMonthly} title="Monthly Investments (EUR)" />
      </div>
    </div>
    <div class="mx-auto mb-8 w-full max-w-screen-xl rounded-md bg-white/90 p-4 shadow">
      <div>
        <div class="w-full">
          <!-- Mobile-first asset list -->
          <div class="block md:hidden">
            <div class="mb-2 flex items-center justify-between">
              <h2 class="mb-2 font-bold text-gray-800">Assets List</h2>
              <div class="text-right">
                <div class="text-sm font-bold">
                  {formatCurrency(marketValueTotal, 'en-US', 'EUR', 0)}
                </div>
                <div
                  class={profitLossTotal < 0
                    ? 'text-xs font-semibold text-red-600'
                    : 'text-xs font-semibold text-green-700'}
                >
                  {formatCurrency(profitLossTotal, 'en-US', 'EUR', 0)}
                  <span>
                    ({profitLossPctTotal.toFixed(1)}%)
                  </span>
                </div>
              </div>
            </div>
            {#each Object.entries(groupedAssets) as [ticker, assets]}
              {@const summary = getSummary(assets)}
              <div
                class="relative mb-2 cursor-pointer rounded bg-blue-50 p-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                role="button"
                tabindex="0"
                onclick={() => toggleTicker(ticker)}
                onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleTicker(ticker)}
                aria-expanded={!!expandedTickers[ticker]}
              >
                {#if assets.length > 1}
                  <span
                    class="absolute top-0.5 left-0.5 z-10 flex h-4 w-4 items-center justify-center transition-transform duration-200 {expandedTickers[
                      ticker
                    ]
                      ? 'rotate-90'
                      : ''}"
                  >
                    <svg
                      class="h-3 w-3 text-blue-500"
                      fill="none"
                      viewBox="0 0 20 20"
                      stroke="currentColor"
                      ><path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 8l4 4 4-4"
                      /></svg
                    >
                  </span>
                {/if}
                <div class="flex w-full items-center justify-between">
                  <div class="mt-2 w-36 max-w-36 min-w-36 font-semibold break-words">
                    {summary.name}
                    <div>
                      <span class="text-xs font-normal">[{summary.ticker}]</span>
                    </div>
                  </div>
                  <div class="text-right">
                    <span class="text-xs text-gray-400">Qty</span>
                    <div>
                      {Number.isInteger(summary.totalQty)
                        ? summary.totalQty
                        : summary.totalQty.toFixed(4)}
                    </div>
                  </div>
                  <div class="text-right">
                    <span class="text-xs text-gray-400">Current</span>
                    <div
                      class={assetsWithMissingYahooPrice.find((a) => a.ticker === ticker)
                        ? 'font-semibold text-yellow-600'
                        : ''}
                    >
                      {formatCurrency(summary.weightedCurrentPrice, 'en-US', summary.currency)}
                    </div>
                  </div>
                  <div class="text-right">
                    <span class="text-xs text-gray-400">Market Value</span>
                    <div>
                      {formatCurrency(summary.marketValue, 'en-US', summary.currency, 0)}
                    </div>
                  </div>
                </div>
                <div class="mt-1 flex items-end justify-between text-xs">
                  <div class="pl-1 text-gray-500">
                    <span class="text-[10px] text-gray-400">Purchase @</span>
                    <div>
                      {formatCurrency(summary.weightedPurchasePrice, 'en-US', summary.currency)}
                    </div>
                  </div>
                  <div class="text-right">
                    <span class="text-[10px] text-gray-400">P/L</span>
                    <div
                      class={summary.profitLoss < 0
                        ? 'font-semibold text-red-600'
                        : 'font-semibold text-green-700'}
                    >
                      {formatCurrency(summary.profitLoss, 'en-US', summary.currency, 0)}
                    </div>
                    <div
                      class={summary.profitLossPct < 0
                        ? 'font-semibold text-red-600'
                        : 'font-semibold text-green-700'}
                    >
                      {summary.profitLossPct.toFixed(1)}%
                    </div>
                  </div>
                </div>
                {#if expandedTickers[ticker]}
                  <div class="mt-2 space-y-1">
                    {#each [...assets].sort((a, b) => new Date(a.purchase_date) - new Date(b.purchase_date)) as asset}
                      <div class="rounded bg-gray-50 p-2 text-xs">
                        <div class="flex items-center justify-between">
                          <div class="w-32 max-w-32 min-w-32 font-medium break-words">
                            {asset.name}
                          </div>
                          <div class="text-right">
                            <span class="text-[10px] text-gray-400">Qty</span>
                            <div>
                              {Number.isInteger(asset.quantity)
                                ? asset.quantity
                                : asset.quantity.toFixed(4)}
                            </div>
                          </div>
                          <div class="text-right">
                            <span class="text-[10px] text-gray-400">Current</span>
                            <div>
                              {formatCurrency(asset.current_price, 'en-US', asset.currency)}
                            </div>
                          </div>
                          <div class="text-right">
                            <span class="text-[10px] text-gray-400">Market Value</span>
                            <div>
                              {formatCurrency(
                                calculateMarketValueTotal(asset),
                                'en-US',
                                asset.currency,
                                0
                              )}
                            </div>
                          </div>
                        </div>
                        <div class="mt-1 flex items-end justify-between text-[10px]">
                          <div class="pl-1 text-gray-500">
                            <span class="text-[10px] text-gray-400">Purchase @</span>
                            <div>
                              {formatCurrency(asset.purchase_price, 'en-US', asset.currency)}
                            </div>
                          </div>
                          <div class="text-right">
                            <span class="text-[10px] text-gray-400">P/L</span>
                            <div
                              class={calculateProfitLoss(asset) < 0
                                ? 'text-red-600'
                                : 'text-green-700'}
                            >
                              {formatCurrency(
                                calculateProfitLoss(asset),
                                'en-US',
                                asset.currency,
                                0
                              )}
                            </div>
                            <div
                              class={calculateProfitLossPct(asset) < 0
                                ? 'text-red-600'
                                : 'text-green-700'}
                            >
                              {(calculateProfitLossPct(asset) * 100).toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      </div>
                    {/each}
                  </div>
                {/if}
              </div>
            {/each}
            {#if assetsWithMissingYahooPrice.length > 0}
              <div
                class="mt-4 rounded border border-yellow-200 bg-yellow-50 p-2 text-xs text-yellow-800"
              >
                <b>Note:</b> Current price could not be fetched for: {assetsWithMissingYahooPrice
                  .map((a) => a.name)
                  .join(', ')}. Purchase price is shown instead.
              </div>
            {/if}
          </div>
          <!-- Desktop table -->
          <h2 class="mb-2 hidden font-semibold md:block">Assets List</h2>
          <table class="hidden w-full border-collapse text-xs md:table">
            <thead>
              <tr>
                <th class="px-2 py-1 text-left">Name</th>
                <th class="px-2 py-1 text-left">Cat.</th>
                <th class="px-2 py-1 text-right">Qty</th>
                <th class="px-2 py-1 text-right">Purchase <br />Date</th>
                <th class="px-2 py-1 text-right">Purchase<br />Price</th>
                <th class="px-2 py-1 text-right">Current <br />Price</th>
                <th class="px-2 py-1 text-right">Purchase<br />Total</th>
                <th class="px-2 py-1 text-right">Market<br />Value</th>
                <th class="px-2 py-1 text-right">P/L</th>
                <th class="px-2 py-1 text-right">P/L %</th>
              </tr>
            </thead>
            <tbody>
              {#each Object.entries(groupedAssets) as [ticker, assets]}
                {@const summary = getSummary(assets)}
                <tr
                  class="cursor-pointer bg-blue-50 transition hover:bg-blue-100"
                  tabindex="0"
                  aria-expanded={!!expandedTickers[ticker]}
                  onclick={() => toggleTicker(ticker)}
                  onkeydown={(e) => e.key === 'Enter' && toggleTicker(ticker)}
                >
                  <td class="flex items-center px-2 py-1 font-semibold">
                    {#if assets.length > 1}
                      <span
                        class="mr-1 flex h-4 w-4 items-center justify-center transition-transform duration-200 {expandedTickers[
                          ticker
                        ]
                          ? 'rotate-90'
                          : ''}"
                      >
                        <svg
                          class="h-3 w-3 text-blue-500"
                          fill="none"
                          viewBox="0 0 20 20"
                          stroke="currentColor"
                          ><path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 8l4 4 4-4"
                          /></svg
                        >
                      </span>
                    {/if}
                    {summary.name}
                    <span class="ml-1 hidden text-xs text-gray-400 md:inline">[{ticker}]</span>
                  </td>
                  <td class="px-2 py-1">{summary.category}</td>
                  <td class="px-2 py-1 text-right">
                    {Number.isInteger(summary.totalQty)
                      ? summary.totalQty
                      : summary.totalQty.toFixed(4)}
                  </td>
                  <td class="px-2 py-1 text-right">
                    {summary.oldestPurchaseDate ? formatDate(summary.oldestPurchaseDate) : ''}
                  </td>
                  <td class="px-2 py-1 text-right">
                    {formatCurrency(summary.weightedPurchasePrice, 'en-US', summary.currency)}
                  </td>
                  <td
                    class="px-2 py-1 text-right {assetsWithMissingYahooPrice.find(
                      (a) => a.ticker === ticker
                    )
                      ? 'font-semibold text-yellow-600'
                      : ''}"
                  >
                    {formatCurrency(summary.weightedCurrentPrice, 'en-US', summary.currency)}
                  </td>
                  <td class="px-2 py-1 text-right"
                    >{formatCurrency(summary.purchaseTotal, 'en-US', summary.currency, 0)}</td
                  >
                  <td class="px-2 py-1 text-right"
                    >{formatCurrency(summary.marketValue, 'en-US', summary.currency, 0)}</td
                  >
                  <td
                    class="px-2 py-1 text-right {summary.profitLoss < 0
                      ? 'text-red-600'
                      : 'text-green-700'}"
                    >{formatCurrency(summary.profitLoss, 'en-US', summary.currency, 0)}</td
                  >
                  <td
                    class="px-2 py-1 text-right {summary.profitLossPct < 0
                      ? 'text-red-600'
                      : 'text-green-700'}">{summary.profitLossPct.toFixed(1)}%</td
                  >
                </tr>
                {#if expandedTickers[ticker]}
                  {#each [...assets].sort((a, b) => new Date(a.purchase_date) - new Date(b.purchase_date)) as asset, j}
                    <tr class={j % 2 === 1 ? 'bg-gray-50' : ''}>
                      <td class="px-2 py-1 pl-6">{asset.name}</td>
                      <td class="px-2 py-1">{asset.category}</td>
                      <td class="px-2 py-1 text-right {asset.quantity < 0 ? 'text-red-600' : ''}">
                        {Number.isInteger(asset.quantity)
                          ? asset.quantity
                          : asset.quantity.toFixed(4)}
                      </td>
                      <td class="px-2 py-1 text-right">{formatDate(asset.purchase_date)}</td>
                      <td class="px-2 py-1 text-right"
                        >{formatCurrency(asset.purchase_price, 'en-US', asset.currency)}</td
                      >
                      <td class="px-2 py-1 text-right"
                        >{formatCurrency(asset.current_price, 'en-US', asset.currency)}</td
                      >
                      <td class="px-2 py-1 text-right"
                        >{formatCurrency(
                          calculatePurchaseTotal(asset),
                          'en-US',
                          asset.currency,
                          0
                        )}</td
                      >
                      <td class="px-2 py-1 text-right"
                        >{formatCurrency(
                          calculateMarketValueTotal(asset),
                          'en-US',
                          asset.currency,
                          0
                        )}</td
                      >
                      <td
                        class="px-2 py-1 text-right {calculateProfitLoss(asset) < 0
                          ? 'text-red-600'
                          : 'text-green-700'}"
                        >{formatCurrency(
                          calculateProfitLoss(asset),
                          'en-US',
                          asset.currency,
                          0
                        )}</td
                      >
                      <td
                        class="px-2 py-1 text-right {calculateProfitLossPct(asset) < 0
                          ? 'text-red-600'
                          : 'text-green-700'}"
                        >{(calculateProfitLossPct(asset) * 100).toFixed(1)}%</td
                      >
                    </tr>
                  {/each}
                {/if}
              {/each}
            </tbody>
            <tfoot>
              <tr class="font-bold">
                <td class="px-2 py-1">Total:</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td class="px-2 py-1 text-right"
                  >{formatCurrency(purchaseTotal, 'en-US', 'EUR', 0)}</td
                >
                <td class="px-2 py-1 text-right {marketValueTotal < 0 ? 'text-red-600' : ''}"
                  >{formatCurrency(marketValueTotal, 'en-US', 'EUR', 0)}</td
                >
                <td
                  class="px-2 py-1 text-right {profitLossTotal < 0
                    ? 'text-red-600'
                    : 'text-green-700'}">{formatCurrency(profitLossTotal, 'en-US', 'EUR', 0)}</td
                >
                <td
                  class="px-2 py-1 text-right {profitLossPctTotal < 0
                    ? 'text-red-600'
                    : 'text-green-700'}">{profitLossPctTotal.toFixed(1)}%</td
                >
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  {/if}
</div>
