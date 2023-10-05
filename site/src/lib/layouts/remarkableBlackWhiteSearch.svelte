<script lang="ts">
    import { goto } from "$app/navigation";
    import { ProgressRadial } from "@skeletonlabs/skeleton";
    import { Search, Button } from "flowbite-svelte";
    import { createEventDispatcher } from "svelte";
    import { createImageUrlFromBytesBuffer } from "$lib/api";
    import { selectedShopId } from "$lib/inter_stores";
    const dsp = createEventDispatcher();

    interface SeekResult {
        name: string,
        price: string,
        id: string,
        image: {
            data: number[]
        }
    }

    type SeekResults = SeekResult[];
    
    let searchVal: string;
    let currentState: "search" | "results" | "no-results" | null = null;
    let seeked: SeekResults = [];

    const handleInput = ({ currentTarget }: Event) => {
        searchVal = (currentTarget as HTMLInputElement).value;
    }

    const search = async () => {
        currentState = "search";
        const sTry = await fetch(`http://localhost:8100/search_in_shop/${$selectedShopId}?search=${searchVal}`, { // TODO:
            method: "POST",
        });

        setTimeout(async () => {
            if (sTry.status == 200) {
                currentState = "results";

                const { results } = await sTry.json();
                seeked = results;
            }
            else currentState = "no-results";
        }, 500);
    }

    function goToItem(item_id: string) {
        return async () => {
            await goto(`/shops/${$selectedShopId}/${item_id}`);
        }
    }

    function makeImg(node: HTMLImageElement, image: SeekResult['image']) {
        const ab = new Uint8Array(image.data);
        node.src = createImageUrlFromBytesBuffer(ab);
        return {};
    }
</script>

<!-- TODO: Search oppurtunity -->
<div id="s" class="w-screen p-4 bg-gray-300 z-20" lang="ts">
   <Search on:input={handleInput}>
        <Button color="dark" on:click={search}>Search</Button>
   </Search>
   <div id="results" class="pt-2">
        {#if currentState == "search"}
            <div id="prg"class="w-full h-full flex items-center justify-center">
                <div class="flex gap-x-2 text-black font-semibold items-center">
                    <ProgressRadial stroke={100} meter="stroke-primary-500" track="stroke-primary-500/30" width="w-10"/>
                    <p>Searching...</p>
                </div>
            </div>
        {:else if currentState == "results"}
            {#each seeked as seek}
                <button on:click={goToItem(seek.id)}>
                    <img src="" alt="" use:makeImg={seek.image}>
                    <div>
                        <p>{seek.name}</p>
                        <p>{@html seek.price}</p>
                    </div>
                </button>
            {/each}
        {:else if currentState == "no-results"}
            <div id="no-res" class="w-full h-full flex items-center justify-center font-semibold text-black">
                <p>No resuls</p>
            </div>
        {/if}
   </div>
</div>
<button on:click={_ => dsp("close")} class="absolute top-0 right-0 w-screen h-screen"></button>

<style>
    #s {
        position: fixed;
        top: 50px;
        right: 0px;
    }
</style>

