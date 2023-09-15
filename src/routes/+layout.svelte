<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import '../app.css';
	import type { LayoutServerData } from './$types';

	export let data: LayoutServerData;
</script>

<div class="container flex flex-col">
	<nav class="flex items-center justify-between bg-zinc-800 p-3 my-3 rounded">
		<div>
			<Button variant="ghost" class="rounded font-semibold text-sm hover:bg-zinc-700" href="/"
				>Home
			</Button>
		</div>
		<div class="flex gap-4">
			{#if !data.isLoggedIn}
				<Button class="rounded hover:bg-zinc-700" variant="ghost" href="/api/auth/login/discord"
					>Login with Discord</Button
				>
			{:else}
				<Button class="rounded hover:bg-zinc-700" variant="ghost" href="/profile">Profile</Button>
				<Button class="rounded text-red-500" variant="link" href="/api/auth/logout">Log out</Button>
			{/if}
		</div>
	</nav>
	<slot />
</div>
