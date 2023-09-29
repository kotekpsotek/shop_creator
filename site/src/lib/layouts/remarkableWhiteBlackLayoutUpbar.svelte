<script lang="ts">
    import { Favorite, Menu, Search, ShoppingBag } from "carbon-icons-svelte";
    let upBarIconHeight = 30 as 32;
    import logo from "$lib/images/layouts/remarkable-black-white/Your Shop Logo.png"
</script>
<div class="upbar lg:px-10">
    <button id="Menu">
        <Menu size={upBarIconHeight} fill="black"/>
    </button>
    <img src="{logo}" alt="" title="logo">
    <button id="wish-list">
        <Favorite size={upBarIconHeight} fill="black"/>
    </button>
    <button id="search">
        <Search size={upBarIconHeight} fill="black"/>
    </button>
    <button id="bag">
        <ShoppingBag size={upBarIconHeight} fill="black"/>
    </button>
</div>

<style>
    .upbar {
        position: sticky;
        top: 0;
        right: 0;
        width: 100vw;
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
