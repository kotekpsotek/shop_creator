<script lang="ts"> 
    import { FavoriteFilled } from "carbon-icons-svelte";
    import { lovedItemsStore } from "$lib/inter_stores";
    import type { EventHandler } from "svelte/elements";

    function removeFavorite(id: number) {
        return ((e) => {
            lovedItemsStore.removeFavoriteItem(id)
        }) satisfies EventHandler
    }
</script>

<div>
    <h3 class="h3">My wish list</h3>
    {#if $lovedItemsStore.length}
        {#each $lovedItemsStore as lv, i}
            <div>
                <button>
                    <!-- svelte-ignore a11y-img-redundant-alt -->
                    <img src="{lovedItemsStore.createImageUrlFromBytesBuffer(lv.image_buf)}" alt="No valid image">
                    <div class="pl-2 flex flex-col w-3/5 font-ftl text-lg">
                        <p id="name">{lv.name}</p>
                        <p id="price">&euro;{lv.price.toFixed(2)}</p>
                        <p id="size" class="text-base">Size {lv.size}</p>
                    </div>
                    <div class="actions w-1/4 flex flex-col justify-center items-end gap-5">
                        <button id="favorite" class="w-7 h-4 flex justify-center items-center" on:click={removeFavorite(i)}>
                            <FavoriteFilled size={20}/>
                        </button>
                    </div>
                </button>
            </div>
        {/each}
    {:else}
        <div class="w-screen h-14">
            <p class="font-frl">You haven't got any. But for sure you will find something for you ❤️</p>
        </div>
    {/if}
</div>