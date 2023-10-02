<script lang="ts">
    import { Menu, Favorite, Search, ShoppingBag, ChartBullet } from "carbon-icons-svelte";
    import prv1 from "$lib/images/layouts/remarkable-black-white/products-ex/mini-blue/p1.jpg"
    import prv2 from "$lib/images/layouts/remarkable-black-white/products-ex/black-semiblue/p1.jpg"
    import prv3 from "$lib/images/layouts/remarkable-black-white/products-ex/black-semi-mid-blue/p1.jpg"
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import Error from "../../routes/+error.svelte";
    import { goto } from "$app/navigation";
    import RemarkableWhiteBlackLayoutUpbar from "./remarkableWhiteBlackLayoutUpbar.svelte";
    
    export let previewMode: boolean = false;
    const maximumItemsPerPage = 25; // How much items can occur on one page
    
    let pageNumber = 1; // Actual page number

    async function loadItems() {
        const f = await fetch("http://localhost:8100/shop-items/get-all", {
            method: "POST",
            headers: { 'content-type': 'application/json' },
            credentials: "include",
            body: JSON.stringify({ shop_id: $page.params.shop_id, items_images: true })
        });

        if (f.status == 200) {
            const { imgs, results }: { imgs: { item_id: string, b: { type: "Buffer", data: number[] } }[], results: any[] } = await f.json();
            return {results, imgs};
        }
        else {
            alert("Failure occur")
            throw "No content anything isn't avaiable to display";
        }
    }

    /** Add content to image element */
    function preperObjectUrl(node: HTMLImageElement, b?: { data: number[] }) {
        if (b) {
            const uu = new Uint8Array(b.data);
            const blb = new Blob([uu]);
            node.src = URL.createObjectURL(blb);
        }
    }

    /** Get the smallest and the greates price to compose .prc-range html element content */
    function prcRangeCompose(node: HTMLDivElement, prices: { [price: string]: number }) {
        // Prices elements
        const prcS = node.querySelectorAll(".prc");
        const prc1 = prcS[0];
        const prc2 = prcS[1];

        // Get the smallest and the greates price
        const prMin = Math.min(...Object.values(prices));
        const prMax = Math.max(...Object.values(prices));

        // Assign prices to correct fields
        prc1.textContent = String(prMin);
        prc2.textContent = String(prMax);
    }

    // Redirect user to specific shop
    function goToShop(itemId: string) {
        return async (e: any) => {
            console.log("c")
            await goto(`/shops/${$page.params.shop_id}/${itemId}`);
        }; 
    }
</script>

<div class="app" class:preview-mode={previewMode}>
    <RemarkableWhiteBlackLayoutUpbar/>
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
            {#if previewMode}
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
            {:else}
                {#await loadItems()}
                    <p>Loading items...</p>
                {:then {imgs, results}}
                    {#each results as { item_id, name, amount, prices_eur, sizes, description }}
                        <button class="card-offer" data-itid={item_id} on:click={goToShop(item_id)}>
                            <img src="" alt="Lack of img" use:preperObjectUrl={imgs.find(v => v.item_id == item_id)?.b}>
                            <p class="font-bold text-base" id="name">{name}</p>
                            <p id="desc">{description || "From some reason description don't occur"}</p>
                            {#if Object.entries(prices_eur).length == 1}
                                <p class="price">
                                    <span class="sgn">&#36</span>
                                    <span class="prc">{Object.values(prices_eur)[0]}</span>
                                </p>
                            {:else}
                                <div class="prc-range" use:prcRangeCompose={prices_eur}>
                                    <p class="price">
                                        <span class="sgn">&#36</span>
                                        <span class="prc">-</span>
                                    </p>
                                    <p class="sep">-</p>
                                    <p class="price">
                                        <span class="sgn">&#36</span>
                                        <span class="prc">-</span>
                                    </p>
                                </div>
                            {/if}
                        </button>
                    {/each}
                {/await}
            {/if}
        </div>
    </div>
</div>

<style>
    * {
        margin: 0;
        padding: 0;
        color: black;
    }

    .app {
        height: 100vh;
        font-family: futura-pt,sans-serif;
        font-size: 14px;
        overflow-y: auto;
        padding-left: 35px;
        padding-right: 15px;
        background-color: white;
    }

    .app.preview-mode {
        height: 100%;
        overflow-y: auto;
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
