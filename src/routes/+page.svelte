<script lang="ts">
	import { onMount } from 'svelte';

	let colors: string[] = ['red', 'green', 'blue', 'yellow', 'violet', 'orange'];
	let images: string[] = [];

	let color: string = 'red';
	let size: number = 50;

	let showMenu = false;

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

	function closeMenu(e: any) {
		if (e.key === 'Escape') showMenu = false;
	}
</script>


<div class="main-section">
	<button
		class="menu-btn"
		on:click={() => showMenu = !showMenu}
		on:keydown={closeMenu}>
		{showMenu ? 'Close' : 'Open'}
	</button>
	{#if showMenu }
	<div role="button" tabindex="0" class="model-background"
		on:click|self={() => showMenu = false}
		on:keydown={closeMenu}>
		<div class="menu">
			<div>
				{#each colors as selectable}
				<button
				class="color"
				style="background: {selectable}"
				class:active={color === selectable}
				on:click={() => (color = selectable)}
				/>
				{/each}
			</div>
			<div class="range">
			small
			<input type="range" min="1" max="100" bind:value={size} />
			large
		</div>
	</div>
	</div>
	{/if}
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
</div>

<style>
	:global(body) {
		background: black;
		margin: 0;
	}

	.menu-btn {
		position: absolute;
		top: 1rem;
		left: 1rem;
		padding: 10px;
		z-index: 9999999;
		background-color: cyan;
		color: black;
		border-radius: 50px;
		scale: 1.2;
	}

	canvas {
		background: black;
		width: 100vw;
		height: 100vh;
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

	.model-background {
		height: 100vh;
		width: 100vw;
		backdrop-filter: blur(20px);

		z-index: 99999;
		position: absolute;
	}

	.menu {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
		border: 1px solid red;
		margin-bottom: 10px;
		gap: 15px;
		padding: 20px;
		border-radius: 30px;
		background-color: black;
		backdrop-filter: blur(20px);

		position: absolute;
		top: 25rem;
		left: 40rem;

		z-index: 99999;
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
