<script lang="ts">
    import RemarkableWhiteBlackLayoutUpbar from "$lib/layouts/remarkableWhiteBlackLayoutUpbar.svelte";
    import { TrashCan, Favorite } from "carbon-icons-svelte";
    import { Hr } from 'flowbite-svelte';
</script>

<RemarkableWhiteBlackLayoutUpbar/>
<section class="w-screen h-screen bg-white text-black">
    <section id="my-order" class="w-full">
        <main>
            <h2 class="h2">My order</h2>
            <p>{1} item - &euro;{49.90}</p>
        </main>
        <div id="items-list">
            <div class="item">
                <div class="text">
                    <p id="name">{"name"}</p>
                    <p id="price">{49.90}</p>
                    <p id="size">{"l"}</p>
                </div>
                <div class="actions">
                    <button id="undo-item">
                        <TrashCan/>
                    </button>
                    <button id="favorite">
                        <Favorite/>
                    </button>
                </div>
            </div>
        </div>
    </section>
    <section id="order-summary">
        <h3 class="h3">Order Summary</h3>
        <main>
            <div id="sub-t">
                <p>Subbtotal</p>
                <p>&euro;{49.90}</p> 
            </div>
            <div id="shipping-tax-duty">
                <p>Shipping with boxpowder supplier</p>
                <p>&euro;6.00</p>
            </div>
           <Hr/>
           <div id="total">
                <p>Total</p>
                <p>&euro;{49.90 + 6.00}</p>
           </div>
        </main>
        <button id="checkout">Checkout</button>
    </section>
</section>
