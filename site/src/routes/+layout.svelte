<script lang="ts">
    import "../app.postcss";
    import { UserAvatarFilled, OverflowMenuHorizontal, UserProfile, Login } from "carbon-icons-svelte";
    import { AppBar } from "@skeletonlabs/skeleton";
    import { navigating } from "$app/stores";
    import { goto } from "$app/navigation"
    import { orderBasket, saveOrderBasketState } from "$lib/inter_stores";
    import { onDestroy, onMount } from "svelte";

    const url = new URL(document.URL);

    let accountBilboardRendered = false;
    let accountBiblord = false;

    function acB(node: HTMLDivElement) {
        accountBilboardRendered = true;
        return {
            destroy() {
                accountBilboardRendered = false;
            }
        }
    }

    $: if ($navigating) {
        // Save order basket state
        saveOrderBasketState();
    }

    onDestroy(async () => {
        // Save order baseket content
        saveOrderBasketState();
    })

    onMount(async () => {
        // Load order basket content if exists
        const i = localStorage.getItem("order-basket");
        if (i) {
            const pI = JSON.parse(i);
            orderBasket.set(pI.v);
        }
    });
</script>

{#key $navigating}
    {#if !new URL(document.URL).pathname.includes("layouts_preview") && !new URL(document.URL).pathname.includes("shops/") && !new URL(document.URL).pathname.includes("order/")}
        <div class="w-full sticky top-0 right-0 z-10">
            <AppBar gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end">
                <svelte:fragment slot="lead">(icon)</svelte:fragment>
                <h1>My Shop Creator</h1>
                <svelte:fragment slot="trail">
                    <div class="trail-ac">
                        <button class="account p-1 rounded" class:variant-ghost-tertiary={accountBiblord} on:click={_ => accountBiblord = !accountBiblord}>
                            <UserAvatarFilled size={32}/>
                        </button>
                        <button class="menu p-1 rounded">
                            <OverflowMenuHorizontal size={32}/>
                        </button>
                    </div>
                </svelte:fragment>
            </AppBar>
        </div>
        {#if accountBiblord}
            <div class="card p-2 w-fit shadow-xl absolute top-50 right-0">
                <nav class="list-nav">
                    <ul class="w-50">
                        <li>
                            <button class="w-full cursor-pointer" on:click={_ => goto("/account/login")}>
                                <span class="badge bg-tertiary-700 py-1">
                                    <Login/>
                                </span>
                                <span class="flex-auto">Login</span>
                            </button>
                        </li>
                        <li>
                            <button class="w-full cursor-pointer" on:click={_ => goto("/account/create")}>
                                <span class="badge bg-tertiary-700">
                                    <UserProfile/>
                                </span>
                                <span class="flex-auto">Create account</span>
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        {/if}
    {/if}
{/key}
<slot></slot>

<style>
    /* .top-most-worth {
        display: flex;
        justify-content: space-between;
    } */

    .trail-ac {
        display: flex;
        column-gap: 10px;
    }
</style>