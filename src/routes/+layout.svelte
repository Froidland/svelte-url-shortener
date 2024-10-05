<script lang="ts">
	import '../app.css';
	import type { LayoutServerData } from './$types';
	import { DiscordIcon, Home, UserCircle, LogOut } from '$lib/components/icons';
	import { Toaster } from 'svelte-french-toast';
	import ProfileDropdown from '$lib/components/ProfileDropdown.svelte';

	export let data: LayoutServerData;
</script>

<Toaster />
<div class="container">
	<nav class="my-3 flex items-center justify-between rounded bg-zinc-800 p-3">
		<div class="flex">
			<a class="btn btn-secondary gap-2" href="/">
				<Home size="18" /> <span class="hidden sm:inline">Home</span>
			</a>
		</div>
		<div class="flex gap-2">
			{#if !data.user.isLoggedIn}
				<a href="/api/oauth/discord" class="btn btn-secondary gap-2">
					<DiscordIcon size="24" />
					Sign in with Discord
				</a>
			{:else}
				<ProfileDropdown />
			{/if}
		</div>
	</nav>
	<slot />
</div>
