<script lang="ts">
	import { page } from '$app/stores';

	$: console.log($page);
</script>

<h1>{$page}</h1>
<div class="hero min-h-screen bg-base-200">
	<div class="hero-content text-center">
		<div class="max-w-md">
			<h1 class="text-5xl font-bold">🔧 Something went wrong...</h1>
			<p class="py-6">Error occurred. Please try again later.</p>
			<a href="/" class="btn btn-primary">Go to Home Page</a>
		</div>
	</div>
</div>
