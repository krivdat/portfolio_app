<script>
	import { enhance } from '$app/forms';
	let { data, form } = $props();
	let user = $derived(data.user);
	let first_name = $state('');
	let last_name = $state('');
	let email = $state('');
	let profile_picture = $state('');

	$effect(() => {
		first_name = user.first_name || '';
		last_name = user.last_name || '';
		email = user.email || '';
		profile_picture = user.profile_picture || '';
	});
</script>

<div
	class="mx-auto mt-6 flex w-full max-w-2xl flex-col gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 shadow"
>
	<h2 class="mb-1 text-xl font-bold text-gray-800">Update Profile</h2>

	{#if form?.error}
		<p class="mb-2 text-sm text-red-600">{form.error}</p>
	{/if}
	{#if form?.success}
		<p class="mb-2 text-sm text-green-600">{form.success}</p>
	{/if}

	<form method="POST" use:enhance>
		<div class="grid grid-cols-1 gap-3 md:grid-cols-2">
			<div class="flex flex-col gap-0.5">
				<label for="first_name" class="text-sm font-medium text-gray-600">First Name</label>
				<input
					type="text"
					id="first_name"
					name="first_name"
					bind:value={first_name}
					class="rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 focus:border-blue-300 focus:ring-1 focus:ring-blue-200 focus:outline-none"
				/>
			</div>
			<div class="flex flex-col gap-0.5">
				<label for="last_name" class="text-sm font-medium text-gray-600">Last Name</label>
				<input
					type="text"
					id="last_name"
					name="last_name"
					bind:value={last_name}
					class="rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 focus:border-blue-300 focus:ring-1 focus:ring-blue-200 focus:outline-none"
				/>
			</div>
			<div class="flex flex-col gap-0.5 md:col-span-2">
				<label for="email" class="text-sm font-medium text-gray-600">Email</label>
				<input
					type="email"
					id="email"
					name="email"
					bind:value={email}
					class="rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 focus:border-blue-300 focus:ring-1 focus:ring-blue-200 focus:outline-none"
				/>
			</div>
			<div class="flex flex-col gap-0.5 md:col-span-2">
				<label for="profile_picture" class="text-sm font-medium text-gray-600"
					>Profile Picture URL</label
				>
				<input
					type="url"
					id="profile_picture"
					name="profile_picture"
					bind:value={profile_picture}
					class="rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 focus:border-blue-300 focus:ring-1 focus:ring-blue-200 focus:outline-none"
				/>
			</div>
			<div class="flex flex-col gap-0.5 md:col-span-2">
				<label for="username" class="text-sm font-medium text-gray-600">Username</label>
				<input
					type="text"
					id="username"
					name="username"
					value={user.username}
					readonly
					disabled
					class="cursor-not-allowed rounded border border-gray-200 bg-gray-100 px-2 py-1 text-sm text-gray-400"
				/>
			</div>
		</div>
		<button
			type="submit"
			class="mt-4 w-full rounded bg-blue-200 px-3 py-1.5 text-base font-semibold text-blue-900 shadow transition-colors duration-150 hover:bg-blue-300 focus:ring-1 focus:ring-blue-200 focus:outline-none"
			>Update</button
		>
	</form>
</div>
