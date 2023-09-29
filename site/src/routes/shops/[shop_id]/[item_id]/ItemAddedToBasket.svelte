<script lang="ts">
    import { onDestroy, onMount } from "svelte";

    const e = document.getElementsByClassName("backgr")[0] as HTMLDivElement;
    onMount(() => {
        e.style.overflow = "hidden !important";
        document.body.style.overflow = "hidden";
    });

    onDestroy(() => {
        (e.style.overflow as any) = null;
        (document.body.style.overflow as any)= null;
    });

    // TODO:
    function toItemsOfShop() {

    }

    function toOrderBasket() {

    }
</script>

<div class="w-screen h-screen bg-black bg-opacity-70 flex items-center justify-center absolute top-0 right-0 z-20 p-2">
    <div class="w-full h 2/4 bg-white p-2 rounded flex flex-col gap-y-4 border-2 border-black">
        <h3 class="h3 text-black text-center font-semibold">Well done! You add new item to your order basket</h3>
        <div class="flex flex-col gap-2">
            <button class="p-2 bg-rose-400 rounded text-center" on:click={toItemsOfShop}>
                Continue
            </button>
            <button class="p-2 text-center border-2 border-black text-black rounded" on:click={toOrderBasket}>
                Go to order basket
            </button>
        </div>
    </div>
</div>