<script>
    import { Search, Button } from "flowbite-svelte";
    import { createEventDispatcher } from "svelte";
    const dsp = createEventDispatcher();
</script>

<div id="s" class="w-screen p-4 bg-gray-300 z-20">
   <Search>
        <Button color="dark">Search</Button>
   </Search>
</div>
<button on:click={_ => dsp("close")} class="absolute top-0 right-0 w-screen h-screen"></button>

<style>
    #s {
        position: fixed;
        top: 50px;
        right: 0px;
    }
</style>

