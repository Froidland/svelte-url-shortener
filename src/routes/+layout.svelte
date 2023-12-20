<script lang="ts">
	import '../app.css';
	import type { LayoutServerData } from './$types';
	import { DiscordIcon, Home, UserCircle, LogOut } from '$lib/components/icons';
	import { Toaster } from 'svelte-french-toast';

	export let data: LayoutServerData;
</script>

<Toaster />
<div class="container">
	<nav class="flex items-center justify-between bg-zinc-800 p-3 my-3 rounded">
		<div class="flex">
			<a class="btn btn-secondary gap-2" href="/">
				<Home size="18" />Home
			</a>
		</div>
		<div class="flex gap-2">
			{#if !data.isLoggedIn}
				<a href="/api/auth/login/discord" class="btn btn-secondary gap-2">
					<DiscordIcon size="24" />
					Sign in with Discord
				</a>
			{:else}
				<a class="btn btn-secondary gap-2" href="/profile"><UserCircle size="18" /> Profile</a>
				<a class="btn btn-destructive gap-2" href="/api/auth/logout"><LogOut size="18" />Log out</a>
			{/if}
		</div>
	</nav>
	<slot />
</div>
