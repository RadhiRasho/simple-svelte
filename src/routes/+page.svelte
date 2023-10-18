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

<div class="colors">
	{#each colors as selectable}
		<button
			class="color"
			style="background: {selectable}"
			class:active={color === selectable}
			on:click={() => (color = selectable)}
		/>
	{/each}
	<div class="range">
		small
		<input type="range" min="1" max="100" bind:value={size} />
		large
	</div>
</div>

<div class="main-section">
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
	<div class="images">
		{#each images as src, key}
			<img alt={key.toString()} {src} />
		{/each}
	</div>
</div>

<style>
	:global(body) {
		background: black;
	}

	canvas {
		background: #eee;
		border: 1px solid #ccc;
		width: 75vw;
		height: 90vh;
	}

	.color {
		border-radius: 100%;
		height: 50px;
		margin: 0 5px;
		width: 50px;

		&:active {
			border: 1px solid white;
		}
	}

	.colors {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		border: 1px solid red;
		margin-bottom: 10px;
		gap: 15px;
	}

	.main-section {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.images {
		border: white 1px solid;
		display: flex;
		flex-direction: column;
		height: 90vh;
		width: 25vw;
		overflow-y: auto;
		gap: 10px;

		& > img {
			width: 100%;
			background-color: transparent;
			border: 1px solid white;
		}
	}

	.range {
		color: white;
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 10px;
	}
</style>
