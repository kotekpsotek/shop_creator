<script lang="ts">
    import { ListBox, ListBoxItem } from "@skeletonlabs/skeleton";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    let valueSingle: string;
    let appState: "main" | "manage items" | "manage shop" = "main"
    
    document.body.style.overflow = "hidden";

    async function toShop() {
        await goto("/shops/" + $page.params.shop_id);
    }

    async function manageItems() {
        appState = "manage items"
    }

    async function manageShop() {
        appState = "manage shop"
    }
</script>

{#if appState != "main"}
    <div class="p-4">
        <ol class="breadcrumb">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
            <li class="crumb anchor" on:click={_ => appState = "main"}>Main Menu</li>
            <li class="crumb-separator" aria-hidden>&rsaquo;</li>
            <li class="crumb">{appState == "manage items" ? "Manage items" : "Manage shop"}</li>
        </ol>
    </div>
{/if}

{#if appState == "main"}
    <div class="bcg p-5 select-none">
        <p class="badge variant-soft-tertiary w-fit mb-1">Shop Panel</p>
        <h1 class="h1 font-bold mb-5 text-primary-100">What you would like to do?</h1>
        <div class="card variant-soft-ringed">
            <div class="p-2">
                <h3 class="h3 font-semibold mb-2 text-primary-400"> List of actions</h3>
                <ListBox>
                    <ListBoxItem bind:group={valueSingle} on:click={manageItems} name="medium" value="books">Manage items</ListBoxItem>
                    <ListBoxItem bind:group={valueSingle} on:click={manageShop} name="medium" value="movies">Manage shop</ListBoxItem>
                    <!-- <ListBoxItem bind:group={valueSingle} name="medium" value="tv">TV</ListBoxItem> -->
                </ListBox>
            </div>
            <div class="p-4 w-full h-full">
                <button class="btn variant-filled-primary w-full font-bold" on:click={toShop}>Your shop</button>
            </div>
        </div>
    </div>
{:else if appState  == "manage items"}
    <!--  -->
{:else if appState == "manage shop"}
    <!--  -->
{/if}

<svelte:body style="overflow: hidden !important;"></svelte:body>

<style>
    .bcg {
        width: 100vw;
        height: 100vh;
        display: flex;
        flex-direction: column;
    }

    button {
        color: white !important;
    }

    .crumb.anchor {
        cursor: pointer;
    }
</style>
