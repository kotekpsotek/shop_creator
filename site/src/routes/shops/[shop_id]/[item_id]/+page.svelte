<script lang="ts">
    import { Favorite, FavoriteFilled } from "carbon-icons-svelte";
    import type { PageData } from "./$types";
    import { Gallery } from "flowbite-svelte";
    import RemarkableWhiteBlackLayoutUpbar from "$lib/layouts/remarkableWhiteBlackLayoutUpbar.svelte";
    import { lovedItemsStore, orderBasket } from "$lib/inter_stores";
    import ItemAddedToBasket from "./ItemAddedToBasket.svelte";
    import { onMount } from "svelte";
    const images2 = [
        { alt: 'shoes', src: 'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-1.jpg' },
        { alt: 'small bag', src: 'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-2.jpg' },
        { alt: 'plants', src: 'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-3.jpg' },
        { alt: 'watch', src: 'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-4.jpg' },
        { alt: 'shoe', src: 'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-5.jpg' }
    ];
    export let data: PageData;

    interface OneImg {
        alt: string,
        src: string
    }
    class Images {
        /** First image */
        first?: OneImg;
        /** Next images others then first */
        nextsUlrs?: OneImg[]
        
        constructor() {
            // Get first and next images
            const f = this.getFirst();
            const o =  this.getOthers(f || Object.create(null));

            if (f) {
                this.first = this.mapToOneImg(f, "No img") as OneImg;
            }

            if (o) {
                this.nextsUlrs = this.mapToOneImg(o, "No img") as OneImg[];
            }
        }

        /** Obtian first image */
        getFirst() {
            const smallest = data.images?.reduce((p, c) => {
                return p.number < c.number ? p : c;
            });
            return smallest;
        }

        /** Get other images then first one */
        private getOthers(f: NonNullable<typeof data.images>[0]) {
            return data.images?.filter(v => {
                return v.number != f.number;
            })
        }

        /** Map object to input required by flowbite galery component 
         * It's suitable for both first and other obtained images in preceding steps
        */
        private mapToOneImg(nm: NonNullable<typeof data.images>[0] | NonNullable<typeof data.images>, alt: string): OneImg | OneImg[] {
            const mapWorthSrc = (cnt: NonNullable<typeof data.images>[0]) => {
                const bf = cnt.data.data;
                const ab = new Uint8Array(bf);
                const blb = new Blob([ab]);
                const oUrl = URL.createObjectURL(blb);
                const newObject = {
                    alt,
                    src: oUrl
                } satisfies OneImg;

                return newObject;
            }
            if (nm instanceof Array) {
                const rs = [] as OneImg[];
                for (const object of nm) {
                    const mappedO = mapWorthSrc(object);
                    rs.push(mappedO)
                };
                return rs;
            }
            else {
                return mapWorthSrc(nm);
            }
        }
    }
    
    const imgs = new Images();
    class Prices {
        prices: { [size: string]: number }
        
        constructor(prices: { [size: string]: number }) {
            this.prices = prices
        }

        getTheSmallest() {
            const pA  = Object.values(this.prices);
            return Math.min(...pA);
        }

        getPriceForSize(size: string) {
            return this.prices[size];
        }
    }
    const pI = new Prices(data.text[0].prices_eur);

    let selectedSize: string | undefined;
    let actualPriceG: number | undefined;
    $: if (selectedSize) {
        const actualPrice = pI.getPriceForSize(selectedSize);
        actualPriceG = actualPrice;
    } else {
        actualPriceG = undefined;
    }

    function pickUpSize(size: string) {
        return (ev: Event) => {
            selectSizeRequired = false;
            if (selectedSize == size) {
                selectedSize = undefined
            }
            else selectedSize = size;
        }
    }

    let selectSizeRequired: boolean = false;
    function addToOrder() {
        if (selectedSize) {
            selectSizeRequired = false;
            $orderBasket = [...$orderBasket, { image_url: imgs.first?.src || "", size: selectedSize, price: pI.getPriceForSize(selectedSize), name: data.text[0].name, description: data.text[0].description }]
            const nItem = new ItemAddedToBasket({
                target: document.body
            });

            nItem.$on("close", () => nItem.$destroy())
        }
        else selectSizeRequired = true;
    }

    /** Add/Remove item to/from vaforite ony when isn't on favorite list already */
    function intoFavorite() {
        const ob = { image_buf: imgs.getFirst()!.data.data, name: data.text[0].name, description: data.text[0].description, price: pI.getTheSmallest() };

        if (!$lovedItemsStore.some(v => v.name == ob.name)) {
            // Add
            $lovedItemsStore = [...$lovedItemsStore, ob];
        } else {
            // Remove
            lovedItemsStore.removeFavoriteItem(ob.name)
        }
    }

    onMount(() => {
        document.body.style.overflowX = "hidden";
    });
</script>

<RemarkableWhiteBlackLayoutUpbar/>
<div class="backgr w-screen h-screen flex flex-col bg-white text-black lg:flex-row lg:gap-x-2 lg:px-10 overflow-x-hidden overflow-y-auto">
    <div class="images w-screen h-fit bg-slate-100 lg:h-fit lg:w-3/5">
        <img src={imgs.first?.src} alt={imgs.first?.alt || "No img"} class="h-1/5 object-contain rounded-lg" style:height={!imgs.nextsUlrs?.length ? "100%" : null}/>
        {#if imgs.nextsUlrs?.length}
            <Gallery class="h-1/5 grid-cols-5 items-center" items={imgs.nextsUlrs}/>
        {/if}
    </div>
    <div class="w-full h-1/5 w-2/4 pt-7 px-2 lg:h-full lg:w-2/5">
        <p class="text-2xl font-bold">{data.text[0].name}</p>
        {#if data.text[0].description}
            <p class="text-base">{data.text[0].description}</p>
        {:else}
            <p class="text-base" style="font-family: futura-pt-light;">Lorem ipsum dolor set</p>
        {/if}
        <p id="price" class="text-xl mt-2" style="font-family: futura-pt-light;">{!actualPriceG ? "From:" : ""} &euro;{actualPriceG || pI.getTheSmallest()}</p>
        <div class="w-full h-fit flex flex-col gap-y-2 mt-2">
            <p class="text-sm">Sizes</p>
            <div class="flex flex-col gap-2">
                <div class="flex flex-wrap gap-2">
                    {#key selectedSize}
                        {#each data.text[0].sizes as size}
                            <button class:selected-size={selectedSize == size} class="border-2 rounded border-gray-300 text-sm w-12 h-12 uppercase hover:bg-black hover:text-white hover:border-black transition-all transition-75" style="font-family: futura-pt-light;" on:click={pickUpSize(size)}>
                                {size}
                            </button>
                        {/each}
                    {/key}
                </div>
                <div class="w-full flex">
                    {#if selectSizeRequired}
                        <p class="text-red-500 text-bold">Size selection is required to go further</p>
                    {/if}
                </div>
            </div>
        </div>
        <div class="flex gap-5 items-center mt-5">
            <button class="h-12 w-full text-white bg-black rounded hover:bg-rose-400 transition-all duration-75" on:click={addToOrder}>Add to order</button>
            <button class="h-12 w-20 border-2 rounded border-black flex justify-center items-center" class:is-favorite={$lovedItemsStore.some(v => v.name == data.text[0].name)} on:click={intoFavorite}>
                {#if $lovedItemsStore.some(v => v.name == data.text[0].name)}
                    <FavoriteFilled size={24}/>
                {:else}
                    <Favorite size={24}/>
                {/if}
            </button>
        </div>
    </div>
</div>

<style>
    .backgr {
        width: 100vw;
        height: calc(100vh - 50px); /* Heigth - upper bar heigth */
    }
    
    .backgr * {
        font-family: futura-pt,sans-serif;
    }

    .backgr::-webkit-scrollbar {
        background-color: white !important;
    }

    button.selected-size {
        background-color: black !important;
        color: white !important;
        border-color: black;
    }
</style>
