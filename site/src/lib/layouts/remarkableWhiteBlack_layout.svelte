<script lang="ts">
    import { Menu, Favorite, Search, ShoppingBag, ChartBullet } from "carbon-icons-svelte";
    import logo from "$lib/images/layouts/remarkable-black-white/Your Shop Logo.png"
    import prv1 from "$lib/images/layouts/remarkable-black-white/products-ex/mini-blue/p1.jpg"
    import prv2 from "$lib/images/layouts/remarkable-black-white/products-ex/black-semiblue/p1.jpg"
    import prv3 from "$lib/images/layouts/remarkable-black-white/products-ex/black-semi-mid-blue/p1.jpg"
    
    export let previewMode: boolean = false;
</script>

<div class="app">
    <div class="upbar">
        <button id="Menu">
            <Menu/>
        </button>
        <img src="{logo}" alt="" title="logo">
        <button id="wish-list">
            <Favorite/>
        </button>
        <button id="search">
            <Search/>
        </button>
        <button id="bag">
            <ShoppingBag/>
        </button>
    </div>
    <div class="category">
        <div class="cat-header">
            <div class="td">
                <h3>Mini Dresses</h3>
                <p>Show others your remarkable legs with our best minis. The best shape and quality in best prices. Choose your new apperance now</p>
            </div>
            <button class="fl">
                <p>Add filters</p>
                <ChartBullet/>
            </button>
        </div>
        <div class="offer">
            <button class="card-offer">
                <img src="{prv1}" alt="">
                <p>Decs</p>
                <p class="price">
                    <span class="sgn">&#36</span>
                    <span class="prc">55</span>
                </p>
            </button>
            <button class="card-offer">
                <img src="{prv2}" alt="">
                <p>Decs</p>
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
                <p>Decs</p>
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
