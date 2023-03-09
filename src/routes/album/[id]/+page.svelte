<script lang="ts">
	import type { PageData } from './$types';
	import MdDelete from 'svelte-icons/md/MdDelete.svelte';
	import MdSend from 'svelte-icons/md/MdSend.svelte';
	import { clickOutside } from '$lib/shared';
	import type { RatingObject } from '$lib/types';
	import { enhance, type SubmitFunction } from '$app/forms';
	import Spinner from '$lib/components/Spinner.svelte';
	import { supabaseClient } from '$lib/supabase';
	import { useMachine } from '@xstate/svelte';
	import { ratingMachine, ratingStates } from '$lib/state';
	import { page } from '$app/stores';
	import { error } from '@sveltejs/kit';

	export let data: PageData;
	$: ({ album } = data);

	const { state, send } = useMachine(
		ratingMachine.withContext({
			session: data.session,
			userRating: data.userRating
		}),
		{
			actions: {
				addRating: async ({ session }, { data }) => {
					const rating = data.get('rating') as RatingObject['rating'];
					const { data: userRating, error: supabaseError } = await supabaseClient
						.from('ratings')
						.insert({
							user_id: session?.user.id,
							comment: null,
							album_id: album.id,
							rating
						})
						.select();

					if (supabaseError) {
						console.error('albumView addRating', supabaseError);
						send('ADD_RATING_ERROR');
						throw error(500, {
							message: 'Internal server error'
						});
					}
					send('ADD_RATING_SUCCESS', { userRating });
				},
				deleteRating: async ({ userRating }) => {
					const { error: supabaseError } = await supabaseClient
						.from('ratings')
						.delete()
						.eq('user_id', userRating.at(0)?.user_id)
						.eq('album_id', userRating.at(0)?.album_id);

					if (supabaseError) {
						console.error('albumView deleteRating', supabaseError);
						send('DELETE_RATING_ERROR');
						throw error(500, {
							message: 'Internal server error'
						});
					}
					send('DELETE_RATING_SUCCESS');
				}
			}
		}
	);

	$: {
		if (!$page.data.session) {
			send('LOGOUT');
		}
		// console.log($state);
	}

	const ratings: RatingObject['rating'][] = ['10', '9', '8', '7', '6', '5', '4', '3', '2', '1'];

	const onAddRating: SubmitFunction = async ({ cancel, data }) => {
		send('ADD_RATING', { data });
		cancel();
	};

	const onUpdateRating: SubmitFunction = async ({ cancel, action }) => {
		if (action.search.includes('addComment')) {
			send('ADD_COMMENT');
		}

		if (action.search.includes('deleteRating')) {
			send('DELETE_RATING');
		}

		cancel();
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

			{#if [ratingStates.noRate, ratingStates.hasModalOpen].some($state.matches)}
				<form action="?/addRating" method="POST" use:enhance={onAddRating}>
					<div class="rate {!$state.context.session && 'rate-disabled'}">
						{#each ratings as rating}
							<input type="submit" id="star{rating}" value={rating} name="rating" />
							<label for="star{rating}">{rating} stars</label>
						{/each}
					</div>
				</form>
			{/if}

			{#if $state.matches(ratingStates.loading)}
				<div class="mt-10 flex justify-end">
					<Spinner />
				</div>
			{/if}

			{#if $state.matches(ratingStates.rated)}
				<form method="post" action="?/addComment" use:enhance={onUpdateRating}>
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
								<div class="font-extrabold text-4xl">{$state.context.userRating.at(0)?.rating}</div>
							</div>
							<button
								formaction="?/deleteRating"
								class="w-8 ml-auto mr-2 text-info hover:text-error cursor-pointer"
							>
								<MdDelete />
							</button>
						</div>
						<div class="form-control">
							<div class="input-group">
								<input
									type="text"
									placeholder="Share your opinion..."
									class="input input-bordered"
								/>
								<button type="submit" class="btn btn-square btn-info hover:btn-success">
									<div class="w-6">
										<MdSend />
									</div>
								</button>
							</div>
						</div>
					</div>
				</form>
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

{#if $state.matches(ratingStates.hasModalOpen)}
	<input type="checkbox" id="my-modal-4" class="modal-toggle" checked />
{/if}
<label
	for="my-modal-4"
	class="modal cursor-pointer"
	use:clickOutside
	on:outclick={() => send('HIDE_MODAL')}
>
	<label class="modal-box relative" for="">
		<h3 class="text-lg font-bold">Login or create an account first!</h3>
		<p class="py-4">You have to be signed in to rate albums.</p>
		<div class="modal-action justify-center md:justify-end">
			<a href="/login?redirectTo={$page.url.pathname}" class="btn">Login</a>
			<a href="/register?redirectTo={$page.url.pathname}" class="btn">Register</a>
		</div>
	</label>
</label>
