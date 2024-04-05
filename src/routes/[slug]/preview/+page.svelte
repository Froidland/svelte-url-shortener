<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="flex flex-col items-center gap-4 rounded bg-zinc-800 p-6">
	<p>This URL redirects to the following website:</p>
	<a
		href={data.url.destination}
		target="_blank"
		class="text-blue-400 underline transition-colors hover:text-blue-300"
	>
		{data.url.destination}
	</a>
</div>
