<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import '../app.css';
	import type { LayoutServerData } from './$types';
	import { DiscordIcon, Home, UserCircle, LogOut } from '$lib/components/icons';
	import { BootstrapToast, ToastContainer } from 'svelte-toasts';

	export let data: LayoutServerData;
</script>

<ToastContainer placement="top-center" let:data>
	<BootstrapToast {data} />
</ToastContainer>
<div class="container">
	<nav class="flex items-center justify-between bg-zinc-800 p-3 my-3 rounded">
		<div class="flex">
			<Button
				variant="ghost"
				class="flex  gap-2 rounded font-semibold text-sm hover:bg-zinc-700"
				href="/"
			>
				<Home size="18" />Home
			</Button>
		</div>
		<div class="flex gap-2">
			{#if !data.isLoggedIn}
				<a
					href="/api/auth/login/discord"
					class="flex gap-2 hover:bg-blue-900 text-white text-sm font-semibold py-2 px-4 rounded items-center transition-colors"
				>
					<DiscordIcon size="24" />
					Sign in with Discord
				</a>
			{:else}
				<Button class="rounded hover:bg-zinc-700 flex gap-2" variant="ghost" href="/profile"
					><UserCircle size="18" /> Profile</Button
				>
				<Button
					class="rounded text-red-500 hover:bg-red-700 flex gap-2"
					variant="ghost"
					href="/api/auth/logout"><LogOut size="18" />Log out</Button
				>
			{/if}
		</div>
	</nav>
	<slot />
</div>
