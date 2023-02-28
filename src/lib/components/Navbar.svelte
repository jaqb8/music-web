<script lang="ts">
	import { enhance, type SubmitFunction } from '$app/forms';
	import { page } from '$app/stores';
	import toast from 'svelte-french-toast';
	import { supabaseClient } from '$lib/supabase';

	const submitLogout: SubmitFunction = async ({ cancel }) => {
		const { error } = await supabaseClient.auth.signOut();

		if (error) {
			console.error(error);
		} else {
			toast('You have been logged out');
			cancel();
		}

		return async ({ update }) => {
			await update();
		};
	};
</script>

<nav class="navbar bg-base-300 text-primary">
	<div class="flex-1">
		<a href="/" class="btn btn-ghost normal-case text-xl">Music Web</a>
	</div>
	{#if $page.data.session}
		<div class="flex-none gap-2">
			<div class="form-control">
				<input type="text" placeholder="Search" class="input input-bordered" />
			</div>
			<div class="dropdown dropdown-end text-primary">
				<label for="navmenu" tabindex="-1" class="btn btn-ghost btn-circle avatar">
					<div class="w-10 rounded-full">
						<img
							src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
							alt=""
						/>
					</div>
				</label>
				<form action="/logout" method="post" use:enhance={submitLogout}>
					<ul
						id="navmenu"
						tabindex="-1"
						class="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
					>
						<li>
							<a href="#!" class="justify-between">
								Profile
								<span class="badge">34</span>
							</a>
						</li>
						<li><a href="#!">Settings</a></li>
						<li>
							<button type="submit">Logout</button>
						</li>
					</ul>
				</form>
			</div>
		</div>
	{:else}
		<div class="flex-none">
			<ul class="menu menu-horizontal">
				<li><a href="/login">Login</a></li>
				<li><a href="/register">Register</a></li>
			</ul>
		</div>
	{/if}
</nav>
