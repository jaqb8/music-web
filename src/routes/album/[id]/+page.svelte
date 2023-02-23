<script lang="ts">
	import type { PageData } from './$types';
	import { fly } from 'svelte/transition';

	export let data: PageData;

	const ratings = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
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
		<div class="my-6 text-white flex flex-col">
			<span class="badge badge-info badge-lg mb-2">{album.album_type.toUpperCase()}</span>
			<h1 class="font-bold text-3xl">{album.name}</h1>
			<p>{album.artists.map((artist) => artist.name).join(', ')}</p>
			{#if !isRatingSelected}
				<div
					class="rating rating-md lg:rating-lg my-5"
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
							class="{rating === 0 ? 'rating-hidden' : ''} bg-error mask mask-star-2 mx-1"
						/>
					{/each}
				</div>
			{:else}
				<div class="grid grid-rows-4 bg-secondary rounded-sm m-2 p-4">
					<div class="row-span-2 flex gap-4">
						<div class="avatar">
							<div class="w-16 rounded-full">
								<img
									src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
									alt="avatar"
								/>
							</div>
						</div>
						<div class="flex-col">
							<div class="opacity-70">Your rating is</div>
							<div class="font-extrabold text-4xl">{currentRating}</div>
						</div>
					</div>
					<div class="">bb</div>
				</div>

				<div in:fly={{ y: 150 }} class="stats shadow bg-secondary text-white">
					<div class="stat">
						<div class="flex">
							<div class="stat-title">Your rating is</div>
							<div class="stat-value">{currentRating}</div>
						</div>
						<div class="stat-actions">
							<input type="text" placeholder="Share your opinion..." class="input input-sm" />
							<button class="btn btn-sm mx-2 btn-success">Comment</button>
							<button class="btn btn-sm btn-warning">Remove</button>
						</div>
					</div>
				</div>
			{/if}
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
