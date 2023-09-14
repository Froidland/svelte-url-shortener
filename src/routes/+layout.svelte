<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import '../app.css';
	import type { LayoutServerData } from './$types';

	export let data: LayoutServerData;
</script>

<div class="container flex flex-col">
	<nav class="flex justify-between bg-zinc-800 p-3 my-3 rounded-xl">
		<div>
			<Button class="rounded" href="/">Home</Button>
		</div>
		<div class="flex gap-4">
			{#if !data.isLoggedIn}
				<Button class="rounded" href="/api/auth/login/discord">Login with Discord</Button>
			{:else}
				<Button class="rounded" href="/profile">Profile</Button>
				<Button class="rounded" href="/api/auth/logout" variant="destructive">Log out</Button>
			{/if}
		</div>
	</nav>
	<slot />
</div>
