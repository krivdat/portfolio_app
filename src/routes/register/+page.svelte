<script>
	import { enhance } from '$app/forms';
	export let form;
</script>

<h1>Register</h1>

{#if form?.error}
	<p style="color: red">{form.error}</p>
{/if}

<form method="POST" use:enhance>
	<label for="username">Username:</label>
	<input type="text" id="username" name="username" required />

	<label for="password">Password:</label>
	<input type="password" id="password" name="password" required />

	<label for="confirmPassword">Confirm Password:</label>
	<input type="password" id="confirmPassword" name="confirmPassword" required />

	<label for="email">Email:</label>
	<input type="email" id="email" name="email" required />

	<label for="profile_picture">Profile Picture URL:</label>
	<input type="url" id="profile_picture" name="profile_picture" />

	<label for="first_name">First Name:</label>
	<input type="text" id="first_name" name="first_name" />

	<label for="last_name">Last Name:</label>
	<input type="text" id="last_name" name="last_name" />

	<button type="submit">Register</button>
</form>
