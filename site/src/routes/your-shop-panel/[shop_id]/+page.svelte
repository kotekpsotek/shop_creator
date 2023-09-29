<script lang="ts">
    import { ListBox, ListBoxItem, ProgressRadial } from "@skeletonlabs/skeleton";
    import { Table, tableMapperValues } from '@skeletonlabs/skeleton';
    import type { TableSource } from '@skeletonlabs/skeleton';
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import AddNewItemMenu from "./AddNewItemMenu.svelte";
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

    /** Load user shop items from fregin server */
    function getShopItems(): Promise<TableSource> {
        return new Promise(async (res, rej) => {
            const g = await fetch("http://localhost:8100/shop-items/get-all", {
                method: "POST",
                headers: {
                    'content-type': "Application/Json"
                },
                credentials: "include",
                body: JSON.stringify({ shop_id: $page.params.shop_id })
            });

            if (g.status == 200) {
                // Get values
                const { results }: { results: { item_id: string, name: string, amount: { [size: string]: number }, prices_eur: { [size: string]: number }, sizes: string[] }[] } = await g.json();

                // Format some fields
                const formated = [];
                results.forEach(v => {
                    (v.amount as any) = JSON.stringify(v.amount);
                    (v.prices_eur as any) = JSON.stringify(v.prices_eur);
                    formated.push(v);
                })

                // Prepare table layout
                const src: TableSource = {
                    head: ["id", "name", "sizes", "amount", "prices (eur)"],
                    body: tableMapperValues(results, ["item_id", "name", "sizes", "amount", "prices_eur"])
                }

                // Return results
                res(src);
            }
            else rej("Cannot obtain items")
        });
    }

    let refresh = 1;
    async function addNewItemMenu(ev: Event) {
        const m = new AddNewItemMenu({
            target: document.body
        });

        // To close items menu
        m.$on("close", () => {
            m.$destroy();
        });

        // To create new item throught server
        m.$on("complete", async ({ detail }: CustomEvent<{ [id: string]: unknown }>) => {
            const f = await fetch("http://localhost:8100/shop-items/create-item", {
                method: "POST",
                headers: {
                    'content-type': "application/json"
                },
                credentials: "include",
                body: JSON.stringify({...detail, shop_id: $page.params.shop_id })
            });

            if (f.status == 200) {
                alert("Item is from now in your shop");
                m.$destroy();  
                refresh++;       
            }
            else alert("Cannot add item to your shop");
        });
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
                <div class="card variant-soft-secondary p-2 w-full h-full flex flex-col gap-y-2">
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
                            <Table source={items} interactive={true}/>
                        </div>
                    {:catch e}
                        <div class="w-full h-full flex justify-center items-center">
                            <p class="font-bold text-lg text-error-50">❌{!e.message ? "Your items list is empty" : e.message}❌</p>
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
