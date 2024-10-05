<script lang="ts">
	import { DropdownMenu } from 'bits-ui';
	import { LogOut, UserCircle } from './icons';
	import FormatListBulletedIcon from './icons/FormatListBulletedIcon.svelte';
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		<button class="btn btn-secondary gap-2">
			<UserCircle size="18" /> <span class="hidden sm:inline">Profile</span>
		</button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content
		class="mt-2 w-full max-w-[230px] items-center rounded-xl bg-zinc-700 p-2 shadow-xl"
	>
		<DropdownMenu.Item
			class="mb-2 flex items-center gap-2 rounded-[6px] bg-zinc-800 px-4 py-3 transition-colors hover:bg-zinc-900"
			href="/profile"
			><FormatListBulletedIcon /> <span class="font-bold">My URLs</span></DropdownMenu.Item
		>
		<DropdownMenu.Item
			class="flex items-center gap-2 rounded-[6px] bg-zinc-800 px-4 py-3 transition-colors hover:bg-zinc-900"
			href="/api/auth/logout"
			><LogOut size="18" /> <span class="font-bold">Log out</span></DropdownMenu.Item
		>
	</DropdownMenu.Content>
</DropdownMenu.Root>
