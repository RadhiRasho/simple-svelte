<script lang="ts">
	import { afterUpdate, onMount } from 'svelte';

	let socket: WebSocket;
	let image: string;

	onMount(() => {
		socket = new WebSocket('wss://localhost:8080');
		socket.onopen = function (event) {
			console.log('connected');
		};

		socket.onmessage = function (event) {
			console.log('message received');
			image = event.data;
		};
	});
</script>

<div class="main-section">
	<!-- svelte-ignore a11y-missing-attribute -->
	<img src={image} title="image" />
</div>

<style>
	:global(body) {
		background: black;
		margin: 0;
	}

	.main-section {
		display: flex;
		flex-direction: column;
		justify-content: between;
		gap: 2rem;
	}
</style>
