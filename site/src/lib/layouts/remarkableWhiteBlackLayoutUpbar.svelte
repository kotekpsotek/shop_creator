<script lang="ts">
    import { Favorite, Menu, Search, ShoppingBag } from "carbon-icons-svelte";
    import { Indicator } from "flowbite-svelte";
    import { orderBasket } from "$lib/inter_stores";
    import { goto } from "$app/navigation";
    let upBarIconHeight = 30 as 32;
    import logo from "$lib/images/layouts/remarkable-black-white/Your Shop Logo.png";
    import RemarkableBlackWhiteSearch from "./remarkableBlackWhiteSearch.svelte";
    import RemarkableBlackWhiteWishList from "./remarkableBlackWhiteWishList.svelte";

    export let classes = "";

    async function goToBasket() {
       await goto("/order/basket") ;
    }

    let s: RemarkableBlackWhiteSearch | undefined;
    function search() {
        if (!s) {
            s = new RemarkableBlackWhiteSearch({
                target: document.body
            });

            s.$on("close", _ => {
                s?.$destroy();
                s = undefined;
            })
        }
        else {s.$destroy(); s = undefined};
    }

    let w: RemarkableBlackWhiteWishList | undefined;
    function wishList() {
        if (!w) {
            w = new RemarkableBlackWhiteWishList({
                target: document.body
            })

            w.$on("close", () => {
                w?.$destroy();
                w = undefined;
            });
        }
        else {
            w.$destroy();
            w = undefined;
        }
    }
</script>
<div class="upbar z-30 {classes}">
    <button id="Menu">
        <Menu size={upBarIconHeight} fill="black"/>
    </button>
    <img src="{logo}" alt="" title="logo">
    <button id="wish-list" on:click={wishList}>
        <Favorite size={upBarIconHeight} fill="black"/>
    </button>
    <button id="search" on:click={search} class:bg-gray-300={s}>
        <Search size={upBarIconHeight} fill="black"/>
    </button>
    <button id="bag" class="relative" on:click={goToBasket}>
        <ShoppingBag size={upBarIconHeight} fill="black"/>
        {#if $orderBasket.length}
            <Indicator color="dark" border size="xl" placement="bottom-right" class="text-xs font-ftl font-bold">{$orderBasket.length}</Indicator>
        {/if}
    </button>
</div>

<style>
    .upbar {
        position: sticky;
        top: 0;
        right: 0;
        width: 100%;
        height: 55px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        z-index: 10;
        background-color: white;
    }

    button {
        outline: none;
        border: none;
        background-color: transparent;
    }

    .upbar img {
        height: 100%;
        width: calc(100% - 4 * 25px - 50px);
        object-fit: contain;
    }

    .upbar button {
        width: 35px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .upbar button:not(#Menu, .bag) {
        margin-right: 10px;
    }

</style>
