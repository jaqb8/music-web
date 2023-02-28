<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import MdDelete from 'svelte-icons/md/MdDelete.svelte';
	import MdSend from 'svelte-icons/md/MdSend.svelte';
	import { clickOutside } from '$lib/shared';
	import type { RatingValue } from '$lib/types';
	import { onMount } from 'svelte';
	import { enhance, type SubmitFunction } from '$app/forms';
	import Spinner from '$lib/components/Spinner.svelte';
	import { supabaseClient } from '$lib/supabase';

	export let data: PageData;
	export let form: ActionData;
	$: ({ album, session, userRating } = data);

	let formRef: HTMLFormElement;
	const ratings: RatingValue[] = [null, '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
	let currentRating: RatingValue = null;
	let isRatingSelected = false;
	let isModalOpen = false;
	let loading = false;

	onMount(() => {
		if (form?.error) {
			isModalOpen = true;
		}

		if (userRating && userRating.length > 0) {
			currentRating = userRating.at(0)?.rating;
			isRatingSelected = true;
		}
	});

	const onSubmit: SubmitFunction = async ({ cancel, data }) => {
		console.log('onSubmit');
		if (!session) {
			isModalOpen = true;
			cancel();
			return;
		}

		const rating = data.get('rating') as RatingValue;
		try {
			const { error: supabaseError } = await supabaseClient.from('ratings').insert({
				album_id: album.id,
				user_id: session.user.id,
				rating: rating
			});

			if (supabaseError) {
				throw supabaseError;
			}

			cancel();
		} catch (error) {
			console.error(error);
		}
	};
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
			{#if !isRatingSelected && !loading}
				<form method="post" action="?/addRating" use:enhance={onSubmit} bind:this={formRef}>
					<div class="rating rating-md lg:rating-lg mt-10">
						{#each ratings as rating}
							<input
								type="radio"
								bind:group={currentRating}
								value={rating}
								name="rating"
								class="{rating === null ? 'rating-hidden' : ''} bg-error mask mask-star-2 mx-1"
							/>
						{/each}
					</div>
					<button>Rate</button>
				</form>
			{:else if isRatingSelected && !loading}
				<div class="grid grid-rows-2 bg-secondary rounded-sm my-6 p-4 gap-5">
					<div class="flex justify-between gap-4">
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
						<button
							class="w-8 ml-auto mr-2 text-info hover:text-error cursor-pointer"
							on:click={() => {
								isRatingSelected = false;
								currentRating = null;
							}}
						>
							<MdDelete />
						</button>
					</div>
					<div class="flex gap-2 justify-between items-center">
						<div class="form-control">
							<label class="input-group">
								<input
									type="text"
									placeholder="Share your opinion..."
									class="input text-secondary w-64"
								/>
								<span
									class="w-12 text-success-content bg-info hover:cursor-pointer hover:bg-success"
									><MdSend /></span
								>
							</label>
						</div>
					</div>
				</div>
			{:else}
				<div class="mt-10 flex justify-end">
					<Spinner />
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

<input type="checkbox" id="my-modal" class="modal-toggle" checked={isModalOpen} />
<div class="modal">
	<div class="modal-box" use:clickOutside on:outclick={() => (isModalOpen = false)}>
		<h3 class="font-bold text-lg">Login or create new account first!</h3>
		<p class="py-4">You have to be signed in to rate albums.</p>
		<div class="modal-action justify-center sm:justify-end">
			<a href="/login" class="btn">login</a>
			<a href="/register" class="btn">register</a>
		</div>
	</div>
</div>
