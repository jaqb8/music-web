<script lang="ts">
	import type { PageData } from './$types';
	import { Slider } from '$lib/components';

	export let data: PageData;
	$: ({ albums } = data);
</script>

<header>
	<div class="flex justify-center">
		<h1 class="text-2xl font-bold mt-8 mb-4">New Releases</h1>
	</div>
</header>

<!-- Section Slider -->
<section id="slider">
	<Slider albums={albums.items} />
</section>
