<script lang="ts">
	import { copy } from 'svelte-copy';
	import * as Table from '$lib/components/ui/table';
	import type { PageServerData } from './$types';
	import { page } from '$app/stores';
	import dayJs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	dayJs.extend(relativeTime);

	const host = $page.url.origin;

	export let data: PageServerData;
</script>

<svelte:head>
	<title>My profile</title>
</svelte:head>

<!-- TODO: Add pagination and the ability to view more than just the last 25 URLs -->
<div class="bg-zinc-800 rounded p-3">
	<h1 class="text-center font-bold text-xl mb-4">Created URLs</h1>
	<Table.Root class="w-full">
		<Table.Header class="bg-zinc-700">
			<Table.Row>
				<Table.Head
					class="w-[250px] py-2 px-4 rounded-tl border-r-[1px] border-zinc-500 border-dotted"
					><span>Slug</span></Table.Head
				>
				<Table.Head class="border-r-[1px] py-2 px-4 border-zinc-500 border-dotted"
					><span>URL</span></Table.Head
				>
				<Table.Head class="w-[200px] py-2 px-4 rounded-tr"><span>When</span></Table.Head>
			</Table.Row>
		</Table.Header>
		{#await data.streamed.urls}
			<Table.Body class="bg-zinc-900">
				<Table.Row>
					<Table.Cell></Table.Cell>
					<Table.Cell class="text-center">
						<p>Loading...</p>
					</Table.Cell>
					<Table.Cell></Table.Cell>
				</Table.Row>
			</Table.Body>
		{:then urls}
			{#if urls.length === 0}
				<Table.Body class="bg-zinc-900">
					<Table.Row>
						<Table.Cell></Table.Cell>
						<Table.Cell class="text-center font-medium">
							<p>You haven't created any short URLs yet.</p>
						</Table.Cell>
						<Table.Cell></Table.Cell>
					</Table.Row>
				</Table.Body>
			{:else}
				<Table.Body class="bg-zinc-900">
					{#each urls as url, i}
						<Table.Row>
							<Table.Cell
								class="font-medium py-2 px-4 border-r-[1px] border-zinc-500 border-dotted {i ===
								urls.length - 1
									? 'rounded-bl'
									: ''}"
								><span
									use:copy={`${host}/${url.slug}`}
									class="hover:text-blue-400 active:text-green-400 cursor-pointer select-none transition-colors"
								>
									{url.slug}
								</span></Table.Cell
							>
							<Table.Cell class="font-medium py-2 px-4 border-r-[1px] border-zinc-500 border-dotted"
								><a
									href={url.location}
									target="_blank"
									class="hover:text-blue-400 transition-colors">{url.location}</a
								></Table.Cell
							>
							<Table.Cell class="py-2 px-4 {i === urls.length - 1 ? 'rounded-br' : ''}"
								><span class="font-medium">
									{dayJs(url.created_at).fromNow()}
								</span></Table.Cell
							>
						</Table.Row>
					{/each}
				</Table.Body>
			{/if}
		{/await}
	</Table.Root>
</div>
