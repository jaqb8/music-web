<script lang="ts">
	import type { PageData } from './$types';
	import MdDelete from 'svelte-icons/md/MdDelete.svelte';
	import MdSend from 'svelte-icons/md/MdSend.svelte';
	import MdRemove from 'svelte-icons/md/MdRemove.svelte';
	import { clickOutside } from '$lib/shared';
	import type { RatingObject } from '$lib/types';
	import { enhance, type SubmitFunction } from '$app/forms';
	import Spinner from '$lib/components/Spinner.svelte';
	import { supabaseClient } from '$lib/supabase';
	import { useMachine } from '@xstate/svelte';
	import { ratingCommentStates, ratingMachine, ratingStates } from '$lib/state';
	import { page } from '$app/stores';
	import { error } from '@sveltejs/kit';
	import toast from 'svelte-french-toast';

	export let data: PageData;
	$: ({ album } = data);

	const { state, send } = useMachine(
		ratingMachine.withContext({
			session: $page.data.session,
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
				},
				addComment: async ({ session, userRating }, { data }) => {
					console.log('Adding comment');
					const comment = data.get('comment') as RatingObject['comment'];

					const { error: supabaseError } = await supabaseClient
						.from('ratings')
						.update({
							comment
						})
						.eq('user_id', session?.user.id)
						.eq('album_id', album.id);

					if (supabaseError) {
						console.error('albumView addComment', supabaseError);
						send('ADD_COMMENT_ERROR');
						throw error(500, {
							message: 'Internal server error'
						});
					}

					const userRatingUpdated = userRating.map((rating) => ({
						...rating,
						comment
					}));
					send('ADD_COMMENT_SUCCESS', { userRating: userRatingUpdated });
				}
			}
		}
	);

	$: {
		if (!$page.data.session) {
			send('LOGOUT');
		}
		console.log($state);
	}

	const ratings: RatingObject['rating'][] = ['10', '9', '8', '7', '6', '5', '4', '3', '2', '1'];
	let commentValue: string = '';

	const onAddRating: SubmitFunction = async ({ cancel, data }) => {
		send('ADD_RATING', { data });
		cancel();
	};

	const onUpdateRating: SubmitFunction = async ({ cancel, action, data }) => {
		if (action.search.includes('addComment')) {
			if (data.get('comment')?.length === 0) {
				toast('Please enter a comment');
			} else {
				send('ADD_COMMENT', { data });
			}
		}

		if (action.search.includes('deleteRating')) {
			send('DELETE_RATING');
		}

		cancel();
	};
</script>

<header class="bg-base-300">
	<div
		class="container p-12 mx-auto flex flex-col items-center md:items-start gap-y-10 justify-between md:flex-row-reverse"
	>
		<figure>
			<img src={album.images.at(0)?.url} class="w-72 shadow-2xl rounded-box" alt="" />
		</figure>
		<div class=" flex flex-col min-w-[50%]">
			<section>
				<span class="badge badge-info badge-lg mb-2">{album.album_type.toUpperCase()}</span>
				<h1 class="font-bold text-3xl">{album.name}</h1>
				<p>{album.artists.map((artist) => artist.name).join(', ')}</p>
			</section>
			{#if [ratingStates.noRate, ratingStates.hasModalOpen].some($state.matches)}
				<div id="no_rate" class="mt-6">
					<form action="?/addRating" method="POST" use:enhance={onAddRating}>
						<div class="rate {!$state.context.session ? 'rate-disabled' : ''}">
							{#each ratings as rating}
								<input type="submit" id="star{rating}" value={rating} name="rating" />
								<label for="star{rating}">{rating} stars</label>
							{/each}
						</div>
					</form>
				</div>
			{/if}

			{#if [ratingStates.loading, { [ratingStates.rated]: ratingCommentStates.loading }].some($state.matches)}
				<div id="loading" class="flex justify-center">
					<Spinner />
				</div>
			{/if}

			{#if [{ [ratingStates.rated]: ratingCommentStates.noComment }, { [ratingStates.rated]: ratingCommentStates.commented }].some($state.matches)}
				<div id="rated" class="text-white mt-6">
					<form method="post" action="?/addComment" use:enhance={onUpdateRating}>
						<div class="max-w-sm grid bg-secondary rounded-sm p-4 gap-5 items-center">
							<div class="flex justify-between gap-4">
								<div class="avatar">
									<div class="w-16 h-16 rounded-full">
										<img
											src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
											alt="avatar"
										/>
									</div>
								</div>
								<div class="flex-col">
									<div class="opacity-70">Your rating is</div>
									<div class="font-extrabold text-4xl">
										{$state.context.userRating.at(0)?.rating}
									</div>
								</div>
								<button
									formaction="?/deleteRating"
									class="w-8 ml-auto mr-2 text-info hover:text-error cursor-pointer"
								>
									<MdDelete />
								</button>
							</div>
							{#if $state.matches({ [ratingStates.rated]: ratingCommentStates.noComment })}
								<div class="form-control">
									<div class="input-group">
										<input
											type="text"
											name="comment"
											bind:value={commentValue}
											placeholder="Share your opinion..."
											class="input input-bordered text-primary w-full"
										/>
										<button type="submit" class="btn btn-square btn-info hover:btn-success">
											<div class="w-6">
												<MdSend />
											</div>
										</button>
									</div>
								</div>
							{/if}

							{#if $state.matches({ [ratingStates.rated]: ratingCommentStates.commented })}
								<div class="stats shadow">
									<div class="stat">
										<div class="stat-title truncate">
											{$state.context.userRating.at(0)?.comment}
										</div>
										<div class="stat-desc">
											{new Date($state.context.userRating.at(0)?.created_at ?? '').toLocaleString(
												'pl-PL'
											)}
										</div>
									</div>
								</div>
							{/if}
						</div>
					</form>
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
