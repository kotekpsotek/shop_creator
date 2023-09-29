<script lang="ts">
    import { Favorite } from "carbon-icons-svelte";
    import type { PageData } from "./$types";
    import { Gallery } from "flowbite-svelte";
    import RemarkableWhiteBlackLayout from "$lib/layouts/remarkableWhiteBlack_layout.svelte";
    import RemarkableWhiteBlackLayoutUpbar from "$lib/layouts/remarkableWhiteBlackLayoutUpbar.svelte";
    const image1 = {
        alt: 'erbology',
        src: 'https://flowbite.s3.amazonaws.com/docs/gallery/featured/image.jpg'
    };
    const images2 = [
        { alt: 'shoes', src: 'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-1.jpg' },
        { alt: 'small bag', src: 'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-2.jpg' },
        { alt: 'plants', src: 'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-3.jpg' },
        { alt: 'watch', src: 'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-4.jpg' },
        { alt: 'shoe', src: 'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-5.jpg' }
    ];
    export let data: PageData;

    class Prices {
        prices: { [size: string]: number }
        
        constructor(prices: { [size: string]: number }) {
            this.prices = prices
        }

        getTheSmallest() {
            const pA  = Object.values(this.prices);
            return Math.min(...pA);
        }
    }
    const pI = new Prices(data.text[0].prices_eur);
</script>

<RemarkableWhiteBlackLayoutUpbar/>
<div class="backgr w-screen h-screen flex flex-col bg-white text-black lg:flex-row lg:gap-x-2 lg:px-10 overflow-x-hidden overflow-y-auto">
    <div class="images w-screen h-4/5 bg-slate-100 lg:h-full lg:w-3/5">
        <img src={image1.src} alt={image1.alt} class="h-4/5 object-contain max-w-full rounded-lg"/>
        <Gallery class="h-1/5 grid-cols-5 items-center" items={images2}/>
    </div>
    <div class="w-full h-1/5 w-2/4 pt-7 px-2 lg:h-full lg:w-2/5">
        <p class="text-2xl font-bold">{data.text[0].name}</p>
        {#if data.text[0].description}
            <p class="text-base">{data.text[0].description}</p>
        {:else}
            <p class="text-base" style="font-family: futura-pt-light;">Lorem ipsum dolor set</p>
        {/if}
        <p class="text-xl mt-2" style="font-family: futura-pt-light;">From: &euro;{pI.getTheSmallest()}</p>
        <div class="w-full h-fit flex flex-col gap-y-2 mt-2">
            <p class="text-sm">Sizes</p>
            <div class="flex flex-wrap gap-2">
                {#each data.text[0].sizes as size}
                    <button class="border-2 rounded border-gray-300 text-sm w-12 h-12 uppercase hover:bg-black hover:text-white hover:border-black transition-all transition-75" style="font-family: futura-pt-light;">
                        {size}
                    </button>
                {/each}
            </div>
        </div>
        <div class="flex gap-5 items-center mt-5">
            <button class="h-12 w-full text-white bg-black rounded hover:bg-rose-400 transition-all duration-75">Add to order</button>
            <button class="h-12 w-20 border-2 rounded border-black flex justify-center items-center">
                <Favorite size={24}/>
            </button>
        </div>
    </div>
</div>

<style>
    .backgr * {
        font-family: futura-pt,sans-serif;
    }

    .backgr::-webkit-scrollbar {
        background-color: white !important;
    }
</style>
