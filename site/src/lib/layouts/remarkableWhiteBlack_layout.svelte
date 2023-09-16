<script lang="ts">
    import { Menu, Favorite, Search, ShoppingBag, ChartBullet } from "carbon-icons-svelte";
    import logo from "$lib/images/layouts/remarkable-black-white/Your Shop Logo.png"
    import prv1 from "$lib/images/layouts/remarkable-black-white/products-ex/mini-blue/p1.jpg"
    import prv2 from "$lib/images/layouts/remarkable-black-white/products-ex/black-semiblue/p1.jpg"
    import prv3 from "$lib/images/layouts/remarkable-black-white/products-ex/black-semi-mid-blue/p1.jpg"
    
    let upBarIconHeight = 30 as 32;
</script>

<div class="app">
    <div class="upbar">
        <button id="Menu">
            <Menu size={upBarIconHeight}/>
        </button>
        <img src="{logo}" alt="" title="logo">
        <button id="wish-list">
            <Favorite size={upBarIconHeight}/>
        </button>
        <button id="search">
            <Search size={upBarIconHeight}/>
        </button>
        <button id="bag">
            <ShoppingBag size={upBarIconHeight}/>
        </button>
    </div>
    <div class="category">
        <div class="cat-header">
            <div class="t-fl">
                <h1>Mini Dresses</h1>
                <button class="fl">
                    <p>Add filters</p>
                    <ChartBullet/>
                </button>
            </div>
            <p class="desc">
                <span>Show others your remarkable legs with our best minis. The best shape and quality in best prices. Choose your new apperance now</span>
            </p>
        </div>
        <div class="offer">
            <button class="card-offer">
                <img src="{prv1}" alt="">
                <p id="desc">Decs</p>
                <p class="price">
                    <span class="sgn">&#36</span>
                    <span class="prc">55</span>
                </p>
            </button>
            <button class="card-offer">
                <img src="{prv2}" alt="">
                <p id="desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                <div class="prc-range">
                    <p class="price">
                        <span class="sgn">&#36</span>
                        <span class="prc">45</span>
                    </p>
                    <p class="sep">-</p>
                    <p class="price">
                        <span class="sgn">&#36</span>
                        <span class="prc">55</span>
                    </p>
                </div>
            </button>
            <button class="card-offer">
                <img src="{prv3}" alt="">
                <p id="desc">Decs</p>
                <p class="price">
                    <span class="sgn">&#36</span>
                    <span class="prc">55</span>
                </p>
            </button>
        </div>
    </div>

    <!-- svelte-ignore a11y-media-has-caption -->
    <video src="https://www.lucyinthesky.com/0d1dc97c-b515-43c2-b3c7-6edff885d720"></video>
</div>

<style>
    * {
        margin: 0;
        padding: 0;
    }

    .app {
        height: 100vh;
        font-family: futura-pt,sans-serif;
        font-size: 14px;
        overflow-y: auto;
        padding-left: 35px;
        padding-right: 15px;
    }

    .upbar {
        height: 55px;
        display: flex;
        align-items: center;
        justify-content: space-between;
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

    .category {
        width: 100%;
        min-height: 100%;
        overflow-x: hidden;
        margin-top: 20px;
        display: flex;
        flex-direction: column;
        row-gap: 25px;
    }

    .cat-header {
        width: 100%;
        height: fit-content; 
    }

    .cat-header .t-fl {
        display: flex;
        justify-content: space-between;
    }

    .t-fl h1 {
        font-size: 27px;
    }

    button.fl {
        display: flex;
        align-items: center;
        column-gap: 4px;
    }

    p.desc {
        margin-top: 5px;
        font-family: 'futura-pt-light';
        font-size: 12px;
    }

    div.offer {
        width: 100%;
        height: fit-content;
        display: grid;
        gap: 20px;
        grid-template-columns: repeat(auto-fit, minmax(250px, 300px));
        grid-auto-rows: auto;
    }

    button.card-offer {
        display: flex;
        flex-direction: column;
        row-gap: 7px;
        position: relative;
        background-color: whitesmoke;
        padding-left: 5px;
        padding-right: 5px;
        border-radius: 2px;
        font-family: 'futura-pt-light';
    }

    button.card-offer img {
        width: 100%;
        height: 400px;
        object-fit: scale-down;
        background-color: transparent;
    }

    button.card-offer p#desc {
        width: 100%;
        text-align: start;
        font-size: 15px;
        text-wrap: balance;
    }

    button.card-offer .price {
        display: flex;
        column-gap: 1px;
        font-family: 'futura-pt';
        margin-bottom: 2px;
    }

    button.card-offer .prc-range {
        display: flex;
        column-gap: 10px;
    }

    @media only screen and (min-width: 600px) {
        p.desc {
            font-size: 16px;
        }
    }
</style>
