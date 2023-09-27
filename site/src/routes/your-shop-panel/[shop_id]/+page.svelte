<script lang="ts">
    import { ListBox, ListBoxItem, ProgressRadial } from "@skeletonlabs/skeleton";
    import { Table, tableMapperValues } from '@skeletonlabs/skeleton';
    import type { TableSource } from '@skeletonlabs/skeleton';
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import AddNewItemMenu from "./AddNewItemMenu.svelte";
    let valueSingle: string;
    let appState: "main" | "manage items" | "manage shop" = "manage items"
    
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

    async function getShopItems(): Promise<TableSource> {
        return new Promise((res, rej) => {
           /*  setTimeout(() => {
                res([{}] as any)
            }, 3_000) */
            /* rej() */
            /* res({
                head: ["name", "id", "sizes", "amount", "price"]
            } satisfies TableSource) */
        });
    }

    async function addNewItemMenu(ev: Event) {
        const m = new AddNewItemMenu({
            target: document.body
        });

        // To close items menu
        m.$on("close", () => {
            m.$destroy();
        });

        // To create new item throught server
        m.$on("complete", ({ detail }: CustomEvent<{ [id: string]: unknown }>) => {
            console.log(detail)
        });
    }

    let refresh = 1;
    async function addNewItemAction(obj: { name: string, sizes: string[], amount: { [id: string]: number }, price: { [id: string]: number }, shop_id: string }) {
        const f = await fetch("http://localhost:8100/shop-items/create-item", {
            method: "post",
            headers: { 'content-type': "application/json" },
            body: JSON.stringify({
                ...obj
            })
        });

        if (f.status == 200) {
            refresh++;
        }
        else alert("cannot add new item!");
    }
</script>

{#key refresh}
    <div class="enclose">
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
                        <h3 class="h3 font-semibold mb-2 text-primary-400">List of actions</h3>
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
            <div class="p-5 select-none w-full h-4/5 pb-5">
                <p class="badge variant-soft-tertiary w-fit mb-2">Manage items</p>
                <div class="card variant-soft-secondary p-2 w-full h-full">
                    <div class="flex justify-between items-end">
                        <h3 class="h3 font-semibold mb-2 text-secondary-400">Manage shop items</h3>
                        <button class="btn variant-ghost-secondary" on:click={addNewItemMenu}>Add new</button>
                    </div>
                    {#await getShopItems()}
                        <div class="w-full h-full flex justify-center items-center">
                            <ProgressRadial stroke={120} width="w-10" meter="stroke-primary-500" track="stroke-primary-500/30"/>
                        </div>
                    {:then items}
                        <div class="w-full h-full overflow-auto">
                            <!-- <Table source={items}/> -->
                        </div>
                    {:catch}
                        <div class="w-full h-full flex justify-center items-center">
                            <p class="font-bold text-lg text-error-50">❌Your items list is empty❌</p>
                        </div>
                    {/await}
                </div>
            </div>
        {:else if appState == "manage shop"}
            <!--  -->
        {/if}
    </div>
{/key}

<svelte:body style="overflow: hidden !important;"></svelte:body>

<style>
    .enclose {
        width: 100vw;
        height: 100vh;
    }
    
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
