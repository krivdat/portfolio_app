<script>
	import { enhance } from '$app/forms';
	let { data, form } = $props();
	let user = $derived(data.user);
	let first_name = $state('');
	let last_name = $state('');
	let email = $state('');
	let profile_picture = $state('');
	let old_password = $state('');
	let new_password = $state('');
	let new_password2 = $state('');
	let passwordError = $state('');

	$effect(() => {
		first_name = user.first_name || '';
		last_name = user.last_name || '';
		email = user.email || '';
		profile_picture = user.profile_picture || '';
	});

	function validatePasswords() {
		if (new_password && new_password2 && new_password !== new_password2) {
			passwordError = 'New passwords do not match.';
			return false;
		}
		passwordError = '';
		return true;
	}

	// Handler for password form submit
	function handlePasswordSubmit(event) {
		event.preventDefault();
		if (validatePasswords()) {
			event.target.submit();
		}
	}
</script>

<div class="px-4 py-4 md:p-8 md:px-0">
	<div class="mx-auto w-full max-w-screen-md rounded-md bg-white/90 p-4 shadow">
		<h2 class="mb-4 text-xl font-bold text-gray-800">Update Profile</h2>

		{#if form?.error}
			<p class="mb-2 text-sm text-red-600">{form.error}</p>
		{/if}
		{#if form?.success}
			<p class="mb-2 text-sm text-green-600">{form.success}</p>
		{/if}

		<!-- Profile update form -->
		<form method="POST" use:enhance action="?/update-profile">
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

		<!-- Password change form -->
		<form method="POST" use:enhance action="?/change-password" onsubmit={handlePasswordSubmit}>
			<div class="mt-8 flex flex-col gap-0.5 border-t pt-4 md:col-span-2">
				<h3 class="mb-2 text-base font-semibold text-gray-700">Change Password</h3>
				<label for="old_password" class="text-sm font-medium text-gray-600">Old Password</label>
				<input
					type="password"
					id="old_password"
					name="old_password"
					bind:value={old_password}
					class="rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 focus:border-blue-300 focus:ring-1 focus:ring-blue-200 focus:outline-none"
					autocomplete="current-password"
				/>
				<label for="new_password" class="mt-2 text-sm font-medium text-gray-600">New Password</label
				>
				<input
					type="password"
					id="new_password"
					name="new_password"
					bind:value={new_password}
					class="rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 focus:border-blue-300 focus:ring-1 focus:ring-blue-200 focus:outline-none"
					autocomplete="new-password"
				/>
				<label for="new_password2" class="mt-2 text-sm font-medium text-gray-600"
					>Repeat New Password</label
				>
				<input
					type="password"
					id="new_password2"
					name="new_password2"
					bind:value={new_password2}
					class="rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 focus:border-blue-300 focus:ring-1 focus:ring-blue-200 focus:outline-none"
					autocomplete="new-password"
				/>
				{#if passwordError}
					<p class="mt-1 text-xs text-red-600">{passwordError}</p>
				{/if}
			</div>
			<button
				type="submit"
				class="mt-4 w-full rounded bg-blue-200 px-3 py-1.5 text-base font-semibold text-blue-900 shadow transition-colors duration-150 hover:bg-blue-300 focus:ring-1 focus:ring-blue-200 focus:outline-none"
				>Change Password</button
			>
		</form>
	</div>
</div>
