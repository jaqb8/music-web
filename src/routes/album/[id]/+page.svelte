<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	const ratings = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
	let currentRating = 0;
	let isRatingSelected = false;

	$: ({ album } = data);
</script>

<div
	class="w-full h-[480px] md:h-[400px] absolute after:absolute z-0 bg-cover bg-center bg-no-repeat after:backdrop-blur-3xl after:h-full after:w-full"
	style="background-image: url({album.images.at(0)?.url})"
/>

<header class="min-h-[400px] z-10 relative">
	<div
		class="container px-[40px] mx-auto flex flex-col items-center justify-between md:flex-row-reverse"
	>
		<div class="mt-10">
			<figure class="">
				<img src={album.images.at(0)?.url} class="w-72 shadow-2xl rounded-box" alt="" />
			</figure>
		</div>
		<div class="my-6 text-white">
			<span class="badge badge-info badge-lg mb-2">{album.album_type.toUpperCase()}</span>
			<h1 class="font-bold text-3xl">{album.name}</h1>
			<p>{album.artists.map((artist) => artist.name).join(', ')}</p>
			<div
				class="rating rating-lg rating-half my-3"
				on:mouseleave={() => {
					if (!isRatingSelected) {
						currentRating = 0;
					}
				}}
			>
				{#each ratings as rating}
					<input
						type="radio"
						disabled={isRatingSelected}
						on:click={() => (isRatingSelected = true)}
						checked={currentRating === rating}
						on:mouseenter={() => (currentRating = rating)}
						name="rating-10"
						class="{rating === 0
							? 'rating-hidden'
							: ''} bg-primary-content mask mask-star-2 mask-half-{Number.isInteger(rating)
							? '2 mr-2'
							: '1'}"
					/>
				{/each}
			</div>
		</div>
	</div>
</header>

<section class="relative my-8">
	<div class="container px-[40px] mx-auto flex break-all">
		<ul>
			{#each album.tracks.items as track}
				<li>{track.name}</li>
			{/each}
		</ul>
	</div>
</section>
