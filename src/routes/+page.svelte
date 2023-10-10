<script>
	import { count } from '$lib';

	$: arr = new Array($count).fill(0);
</script>

<h1>The count is {$count}</h1>

<button on:click={count.increment}>+</button>
<button on:click={count.decrement}>-</button>
<button on:click={count.reset}>reset</button>
<br />
<br />

{#each arr as i, index}
	<span>{i + index + 1}&nbsp;</span>
{/each}

{#if $count > 10}
	<p>That's a lot of clicks!</p>
{/if}

<style>
	h1 {
		color: red;
	}

	span,
	p {
		color: violet;
	}

	button {
		color: green;
	}

	:global(body) {
		background: black;
	}
</style>
