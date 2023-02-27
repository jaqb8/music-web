<script lang="ts">
	export let albums: SpotifyApi.AlbumObjectSimplified[];
</script>

<swiper-container navigation={true} loop={true} pagination={true}>
	{#each albums as album}
		<swiper-slide class="px-10 pb-10 lg:px-48 2xl:px-96">
			<div class="card sm:card-side bg-base-100 shadow-xl">
				<figure>
					<img src={album.images.at(0)?.url} alt={album.id} />
				</figure>
				<div class="card-body">
					<h2 class="card-title">{album.name}</h2>
					<p>{album.artists.map((artist) => artist.name).join(', ')}</p>
					<div class="card-actions justify-end">
						<a href="/album/{album.id}" class="btn btn-primary">Listen</a>
					</div>
				</div>
			</div></swiper-slide
		>
	{/each}
</swiper-container>
