<script lang="ts">
    import RemarkableWhiteBlackLayoutUpbar from "$lib/layouts/remarkableWhiteBlackLayoutUpbar.svelte";
    import { TrashCan, Favorite, FavoriteFilled } from "carbon-icons-svelte";
    import { Hr } from 'flowbite-svelte';
    import { orderBasket, lovedItemsStore, selectedShopId } from "$lib/inter_stores";
    import { goto } from "$app/navigation";
    import { navigating } from "$app/stores";
    import { saveOrderBasketState } from "$lib/inter_stores";
    
    async function goBack() {
        if ($navigating) {
            await goto($navigating?.from?.url.toString() || "")
        }
        else {
            history.back();
        }
    }

    function totalOrderPrice() {
        let price: number = 0;
        for (const p of $orderBasket) {
            price += p.price;
        }
        return price;
    }

    function orderDelete(index: number) {
        return (ev: Event) => {
            $orderBasket.splice(index, 1);
            $orderBasket = $orderBasket;
            saveOrderBasketState(); // Resave state to supress re-call deleted item
        }
    }

    /** Start or end loving this particular item */
    function fallInOrFalloutOfLove(basketItem: typeof $orderBasket[0]) {
        return () => {
            if ($lovedItemsStore.some(v => v.name == basketItem.name)) {
                lovedItemsStore.removeFavoriteItem(basketItem.name)
            }
            else {
                $lovedItemsStore = [...$lovedItemsStore, {
                    image_buf: [], // TODO: After re-write image to not be load from storage as url add here image int buffer, suitable for Uint8Array
                    name: basketItem.name,
                    description: basketItem.description,
                    price: basketItem.price
                }]
            }
        }
    }
</script>

<RemarkableWhiteBlackLayoutUpbar classes="lg:px-10"/>
{#if $orderBasket.length}
    {#key $orderBasket}
        <section class="w-screen h-screen p-2 bg-gray-200 text-black lg:px-10 flex flex-col lg:flex-row lg:gap-x-5 font-ft">
            <section id="my-order" class="w-full p-1 h-2/3 lg:h-full bg-white flex flex-col lg:px-2 lg:w-2/3 pt-5 gap-4 overflow-y-auto">
                <main class="w-full h-fit flex justify-between items-center">
                    <h2 class="h2 font-bold">My order</h2>
                    <p id="price-up" class="!font-ftl">{$orderBasket.length} item - &euro;{totalOrderPrice()}</p>
                </main>
                <div id="items-list" class="flex flex-col gap-y-5 h-fit">            
                    {#each $orderBasket as basket_it, i}
                        <div class="flex justify-between w-full">
                            <img src="{basket_it.image_url}" alt="No img" class="h-36 w-1/5 object-contain">
                            <div class="pl-2 flex flex-col w-3/5 font-ftl text-lg">
                                <p id="name">{basket_it.name}</p>
                                <p id="price">&euro;{basket_it.price.toFixed(2)}</p>
                                <p id="size" class="text-base">Size {basket_it.size}</p>
                            </div>
                            <div class="actions w-1/4 flex flex-col justify-center items-end gap-5">
                                <button id="undo-item" class="w-7 h-4 flex justify-center items-center" on:click={orderDelete(i)}>
                                    <TrashCan size={20}/>
                                </button>
                                <button id="favorite" class="w-7 h-4 flex justify-center items-center" title="{$lovedItemsStore.some(v => v.name == basket_it.name) ? "Terminate your love" : "Start your love"}" on:click={fallInOrFalloutOfLove(basket_it)}>
                                    {#if $lovedItemsStore.some(v => v.name == basket_it.name)}
                                        <FavoriteFilled size={20}/>
                                    {:else}
                                        <Favorite size={20}/>
                                    {/if}
                                </button>
                            </div>
                        </div>
                    {/each}
                </div>
            </section>
            <section id="order-summary" class="p-1 h-1/3 lg:w-1/3 lg:h-full pt-5 flex flex-col gap-y-5">
                <h3 class="h3 font-bold">Order Summary</h3>
                <main class="flex flex-col font-ftl text-sm">
                    <div id="sub-t" class="flex justify-between">
                        <p>Subbtotal</p>
                        <p>&euro;{totalOrderPrice()}</p> 
                    </div>
                    <div id="shipping-tax-duty" class="flex justify-between">
                        <p>Shipping with boxpowder supplier</p>
                        <p>&euro;6.00</p>
                    </div>
                    <Hr hrClass="my-4"/>
                    <div id="total" class="flex justify-between">
                        <p>Total</p>
                        <p>&euro;{(Number(totalOrderPrice()) + 6.00).toFixed(2)}</p>
                    </div>
                </main>
                <button id="checkout" class="w-full h-10 text-white bg-black rounded hover:bg-rose-400 transition-all duration-100" on:click={_ => goto("/order/checkout/"+$selectedShopId)}>Checkout</button>
            </section>
        </section>
    {/key}
{:else}
    <div class="w-screen h-screen bg-gray-200 flex flex-col gap-y-2 justify-center items-center">
        <p class="text-black font-ft text-xl">Your shop basket is empty</p>
        <button class="w-2/4 h-10 bg-black rounded" on:click={goBack}>Go back to shop</button>
    </div>
{/if}
