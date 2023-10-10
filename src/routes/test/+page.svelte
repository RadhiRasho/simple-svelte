<script lang="ts">
	import { onMount } from 'svelte';

	let colors: string[] = ['red', 'green', 'blue', 'yellow', 'violet', 'orange'];
	let images: string[] = [];

	let color: string = 'red';
	let size: number = 50;

	let canvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D | null;
	let previous: { x: any; y: any } | null;

	onMount(() => {
		context = canvas.getContext('2d');

		function resize() {
			canvas.width = canvas.clientWidth;
			canvas.height = canvas.clientHeight;
		}

		window.addEventListener('resize', resize);
		resize();

		return () => {
			window.removeEventListener('resize', resize);
		};
	});

	function get_coords(e: { clientX: any; clientY: any }) {
		const { clientX, clientY } = e;
		const { left, top } = canvas.getBoundingClientRect();
		const x = clientX - left;
		const y = clientY - top;
		return { x, y };
	}

	function capture_state() {
		const state = canvas.toDataURL();
		images = [state, ...images];
	}
</script>

<div class="Images">
	{#each colors as selectable}
		<button
			class="color"
			style="background: {selectable}"
			class:active={color === selectable}
			on:click={() => (color = selectable)}
		/>
	{/each}

	{#each images as src, key}
		<img alt={key.toString()} {src} />
	{/each}
</div>

<canvas
	bind:this={canvas}
	on:pointerdown={(e) => {
		const coords = get_coords(e);
		if (context === null) throw new Error('context is null');

		context.fillStyle = color;
		context?.beginPath();
		context?.arc(coords.x, coords.y, size / 2, 0, 2 * Math.PI);
		context?.fill();

		previous = coords;
	}}
	on:pointerup={capture_state}
	on:pointerleave={() => (previous = null)}
	on:pointermove={(e) => {
		const coords = get_coords(e);

		if (e.buttons === 1) {
			e.preventDefault();

			if (context === null) throw new Error('context is null');
			context.strokeStyle = color;
			context.lineWidth = size;
			context.lineCap = 'round';
			context?.beginPath();
			context?.moveTo(previous?.x, previous?.y);
			context?.lineTo(coords.x, coords.y);
			context?.stroke();
		}

		previous = coords;
	}}
/>

<style>
	:global(body) {
		background: black;
	}

	canvas {
		background: #eee;
		border: 1px solid #ccc;
		height: 80vh;
		width: 80vw;
	}

	.color {
		border: 1px solid #ccc;
		border-radius: 50%;
		height: 50px;
		margin: 0 5px;
		width: 50px;
	}

	.Images {
		max-height: 20vh;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: start;
		border: 1px solid #ccc;
		margin-bottom: 10px;

		& > img {
			height: 50px;
		}
	}
</style>
