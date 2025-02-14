<script>
    import { onMount } from 'svelte';
    import { PUBLIC_APP_NAME } from '$env/static/public';

    onMount(() => {
        console.log("Client-side process.env:", PUBLIC_APP_NAME);
    });
</script>

    
<h1>Welcome to the Portfolio Tracker</h1>

<p>This is a simple portfolio tracking application built with SvelteKit.</p>