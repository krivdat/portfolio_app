<script>
	import { onMount } from 'svelte';
	import PieChart from '$lib/components/PieChart.svelte'; // Import the chart component
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { formatDate } from '$lib/utils/date';
	import { formatCurrency } from '$lib/utils/currency';
	import { page } from '$app/state';

	export let data;
	let assets = data.assets;
	let categoryData = [];

	const categoryCounts = {};
	assets.forEach((asset) => {
		categoryCounts[asset.category] =
			(categoryCounts[asset.category] || 0) + asset.purchase_price * asset.quantity;
	});

	categoryData = Object.entries(categoryCounts).map(([category, value]) => ({
		group: category,
		value
	}));

	function calculateProfitLoss(asset) {
		// TODO: implement getting current price
		const currentPrice = asset.purchase_price; // Replace with real price API call
		return (currentPrice - asset.purchase_price) * asset.quantity;
	}

	function logout() {
		localStorage.clear();
		invalidateAll();
	}
</script>

<h1>Dashboard</h1>

{#if page.data.user}
	<p>Welcome, {page.data.user.username} ({page.data.user.email})</p>
	{#if page.data.user.profile_picture}
		<img src={page.data.user.profile_picture} alt="Profile" width="50" />
	{/if}
{/if}

<form method="POST" action="?/logout" use:enhance>
	<button type="submit" on:click={logout}>Logout</button>
</form>

{#if assets && assets.length > 0}
	<div>
		<div>
			<h2>Asset Allocation</h2>
			<PieChart data={categoryData} />
		</div>
		<div>
			<h2>Asset List</h2>
			<table>
				<thead>
					<tr>
						<th>Name</th>
						<th>Category</th>
						<th>Quantity</th>
						<th>Purchase Price</th>
						<th>Purchase Date</th>
						<th>Profit/Loss</th>
					</tr>
				</thead>
				<tbody>
					{#each assets as asset}
						<tr>
							<td>{asset.name}</td>
							<td>{asset.category}</td>
							<td>{asset.quantity}</td>
							<td>{formatCurrency(asset.purchase_price, 'en-US', asset.currency)}</td>
							<td>{formatDate(asset.purchase_date)}</td>
							<td>{formatCurrency(calculateProfitLoss(asset), 'en-US', asset.currency)}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
{:else}
	<p>No assets found.</p>
{/if}
