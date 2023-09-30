<script lang="ts">
    import RemarkableWhiteBlackLayoutUpbar from "$lib/layouts/remarkableWhiteBlackLayoutUpbar.svelte";
    import { TrashCan, Favorite } from "carbon-icons-svelte";
    import { Hr } from 'flowbite-svelte';
</script>

<RemarkableWhiteBlackLayoutUpbar/>
<section class="w-screen h-screen bg-gray-200 text-black lg:px-10 flex flex-column lg:flex-row lg:gap-x-5 font-ft">
    <section id="my-order" class="w-full lg:h-full bg-white flex flex-col lg:px-2 lg:w-2/3 pt-5 gap-4">
        <main class="w-full h-fit flex justify-between items-center">
            <h2 class="h2 font-bold">My order</h2>
            <p id="price-up" class="!font-ftl">{1} item - &euro;{49.90}</p>
        </main>
        <div id="items-list" class="flex flex-col gap-y-5 overflow-y-auto">
            <div class="flex justify-between w-full">
                <img src="https://media.lucyinthesky.com/data/Sep23/180xAUTO/49139080-f4f0-45e4-ac1b-958d8c1d6b33.jpg" alt="" class="h-36 w-1/5 object-contain">
                <div class="flex flex-col w-3/5 font-ftl text-lg">
                    <p id="name">{"name"}</p>
                    <p id="price">&euro;{49.90}</p>
                    <p id="size" class="text-base">Size {"l"}</p>
                </div>
                <div class="actions w-1/4 flex flex-col justify-center items-end gap-5">
                    <button id="undo-item" class="w-7 h-4 flex justify-center items-center">
                        <TrashCan size={20}/>
                    </button>
                    <button id="favorite" class="w-7 h-4 flex justify-center items-center">
                        <Favorite size={20}/>
                    </button>
                </div>
            </div>
            <div class="flex justify-between w-full">
                <img src="https://media.lucyinthesky.com/data/Sep23/180xAUTO/49139080-f4f0-45e4-ac1b-958d8c1d6b33.jpg" alt="" class="h-36 w-1/5 object-contain">
                <div class="flex flex-col w-3/5 font-ftl text-lg">
                    <p id="name">{"name"}</p>
                    <p id="price">&euro;{49.90}</p>
                    <p id="size" class="text-base">Size {"l"}</p>
                </div>
                <div class="actions w-1/4 flex flex-col items-end gap-5">
                    <button id="undo-item" class="w-7 h-4 flex justify-center items-center">
                        <TrashCan size={20}/>
                    </button>
                    <button id="favorite" class="w-7 h-4 flex justify-center items-center">
                        <Favorite size={20}/>
                    </button>
                </div>
            </div>
        </div>
    </section>
    <section id="order-summary" class="lg:w-1/3 pt-5 flex flex-col gap-y-5">
        <h3 class="h3 font-bold">Order Summary</h3>
        <main class="flex flex-col font-ftl text-sm">
            <div id="sub-t" class="flex justify-between">
                <p>Subbtotal</p>
                <p>&euro;{49.90}</p> 
            </div>
            <div id="shipping-tax-duty" class="flex justify-between">
                <p>Shipping with boxpowder supplier</p>
                <p>&euro;6.00</p>
            </div>
           <Hr hrClass="my-4"/>
           <div id="total" class="flex justify-between">
                <p>Total</p>
                <p>&euro;{49.90 + 6.00}</p>
           </div>
        </main>
        <button id="checkout">Checkout</button>
    </section>
</section>

<style>
/*     * {
        font-family: futura-pt, sans-serif;
    }

    #price-up {
        font-family: futura-pt-light;
    } */
</style>
