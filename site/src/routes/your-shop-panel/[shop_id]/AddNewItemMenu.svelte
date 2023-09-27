<script lang="ts">
    import { Close, CurrencyEuro, WatsonHealthHangingProtocol, CloudUpload } from "carbon-icons-svelte";
    import { FileDropzone, InputChip, Table, tableMapperValues } from "@skeletonlabs/skeleton";
    import type { TableSource } from '@skeletonlabs/skeleton';
    import { createEventDispatcher } from "svelte";
    import type { EventHandler } from "svelte/elements";

    const dsp = createEventDispatcher();
    
    let name: string = "";
    let sizesList: string[] = [];
    let actualSelectdSizeAmount: string = "";
    let actualSelectdSizePrice: string = "";
    let sizesAmount: { [index: string]: number } = {};
    let prices: { [index: string]: number } = {};
    let files: File[] = [];

    let sizeAmount: number = 1;
    function acceptSizeAmount() {
        if (sizeAmount % 1 === 0) {
            sizesAmount[actualSelectdSizeAmount] = sizeAmount;
            actualSelectdSizeAmount = "";
            alert("New size amount enrolled");
        }
        else {
            alert("Amount of size must be intiger. You gave float number");
        }
    }

    let price: number = 10;
    function acceptSizePrice() {
        prices[actualSelectdSizePrice] = price;
    }

    function getSizesWhoseArentOnSizesAmount() {
        const k = Object.keys(sizesAmount);

        return sizesList.filter(v => !k.includes(v));
    }

    function getSizesWhoseArentOnPricesList() {
        const k = Object.keys(prices);
        return sizesList.filter(v => !k.includes(v));
    }

    let bodyTableSizes: string[][] = []
    let tableSizesSimple: TableSource = {
        head: ["Size", "Amount"],
        body: bodyTableSizes
    };

    /** Prepare 'sizesAmount' to type required by 'tableSizesSimple.body' */
    function prepareBodySizes(nd: HTMLDivElement) {
        // Get entries of sizes
        const ent = Object.entries(sizesAmount);
        
        // List of rows with it's values
        const mapped1: any[] = [];

        // Map each entry to object
        ent.forEach(v => {
            const mp = Object.fromEntries([v]);
            mapped1.push(mp);
        });

        // Map to final required shape by 'tableMapperValues'
        let mapped2: { size: string, amount: number }[] = [];
        mapped1.forEach(v => {
            const vO = Object.entries(v)[0];
            const ob: typeof mapped2[0] = { size: "", amount: 0 };
            ob.size = vO[0] as string;
            ob.amount = vO[1] as number;
            mapped2.push(ob);
        });

        // Create rows
        bodyTableSizes = tableMapperValues(mapped2, ["size", "amount"])
        tableSizesSimple.body = bodyTableSizes;
    }

    let bodyTableSizesPrices = [];
    let tablePricesSimple: TableSource = {
        head: ["Size", "Price"],
        body: bodyTableSizes
    };

    function prepareSizePrices(nd: HTMLDivElement) {
        // Get entries of sizes
        const ent = Object.entries(prices);
        
        // List of rows with it's values
        const mapped1: any[] = [];

        // Map each entry to object
        ent.forEach(v => {
            const mp = Object.fromEntries([v]);
            mapped1.push(mp);
        });

        // Map to final required shape by 'tableMapperValues'
        let mapped2: { size: string, price: number }[] = [];
        mapped1.forEach(v => {
            const vO = Object.entries(v)[0];
            const ob: typeof mapped2[0] = { size: "", price: 0 };
            ob.size = vO[0] as string;
            ob.price = vO[1] as number;
            mapped2.push(ob);
        });

        // Create rows
        bodyTableSizesPrices = tableMapperValues(mapped2, ["size", "price"])
        tablePricesSimple.body = bodyTableSizesPrices;
    }

    let updM: boolean = false;
    let updV: [string, number] | undefined; 
    /** Allow user to edit sizes amount */
    function clickOnRowSizesAmount({ detail }: CustomEvent<[string, number]>) {
        updM = true;
        updV = detail;
    }

    let updPM: boolean = false;
    let updPV: [string, number] | undefined;
    /** Allow user to edit prices */
    function clickOnRowPrices(ev: any) {
       const { detail }: CustomEvent<[string, number]> = ev;
       updPM = true;
       updPV = detail;
    }

    /** Allow user to delete sizes amount item */
    function deleteSizesAmountItem() {
        delete sizesAmount[updV![0]];
        sizesAmount = sizesAmount;
        alert(`Item ${updV![0]} sizes amount annotation has been deletd`);
        
        updM = false;
        updV = void updV;
    }

    /** Allow user to delete sizes prices */
    function deleteSizesPriceItem() {
        delete prices[updPV![0]];
        prices = prices;
        
        updPM = false;
        updPV = void updPV;
    }

    /** When user remove added size */
    function removeSize(e: any) {
        const { detail: { chipValue } }: CustomEvent<{ event: Event, chipIndex: number, chipValue: string }> = e;
        
        delete prices[chipValue];
        actualSelectdSizePrice = "";
        prices = prices;

        delete sizesAmount[chipValue];
        actualSelectdSizeAmount = "";
        sizesAmount = sizesAmount;
    }

    /** Add image to file list */
    function changeDropZone(ev: any) {
        const { currentTarget }: InputEvent = ev;
        const gt = currentTarget as HTMLInputElement;
        
        if (gt.files?.length) {
            files = [...files, ...gt.files];
        }
    }

    /** Mouse On image interaction */
    let onImageInteraction: number | undefined;
    function onImage(iid: number) {
        return ((ev) => {
            onImageInteraction = iid;
        }) satisfies EventHandler;
    }

    function offImage(iid: number) {
        return ((ev) => {
            onImageInteraction = void onImageInteraction;
        }) satisfies EventHandler
    };

    /** Remove image which was selected by user */
    function removeSelectedImage(iid: number) {
        return (ev => {
            files.splice(iid, 1);
            files = files;
        }) satisfies EventHandler;
    }

    /** Emit complete event */
    function addItem() {
        dsp("complete", { name, sizes: sizesList, amount: sizesAmount, price: prices });
    }

    /** Close GUI menu */
    function close() {
        dsp("close");
    }
</script>

{#if updM}
    <!-- Update sizes amount record -->
    <div class="w-screen h-screen absolute top-0 right-0 z-30 bg-black bg-opacity-90 flex justify-center items-center">
        <button class="absolute right-5 top-5 btn-icon variant-filled" on:click={_ => updM = false}>
            <Close size={24}/>
        </button>
        <div class="card bg-initial p-3 flex flex-col gap-y-5">
            <h3 class="h3 font-bold">Actions for added size <span class="text-success-200">{updV?.[0]}</span> amount</h3>
            <button class="btn bg-red-700" on:click={deleteSizesAmountItem}>Delete</button>
        </div>
    </div>
{:else if updPM}
    <div class="w-screen h-screen absolute top-0 right-0 z-30 bg-black bg-opacity-90 flex justify-center items-center">
        <button class="absolute right-5 top-5 btn-icon variant-filled" on:click={_ => updPM = false}>
            <Close size={24}/>
        </button>
        <div class="card bg-initial p-3 flex flex-col gap-y-5">
            <h3 class="h3 font-bold">Actions for added size <span class="text-success-200">{updPV?.[0]}</span> price</h3>
            <button class="btn bg-red-700" on:click={deleteSizesPriceItem}>Delete</button>
        </div>
    </div>
{/if}

<div class="w-screen h-screen absolute top-0 right-0 bg-black bg-opacity-60 z-20 flex items-center justify-center">
    <button class="absolute right-5 top-5 btn-icon variant-filled" on:click={close}>
        <Close size={24}/>
    </button>
    <div class="card p-5 flex flex-col gap-y-5 m-5 w-full h-3/4 lg:w-2/4 lg:m-0 overflow-auto">
        <h2 class="h2 capitalize font-bold">Add item</h2>
        <div class="card variant-ringed p-2 flex flex-col gap-y-2">
            <h3 class="h3 font-semibold capitalize">1st: Common</h3>
            <input class="input" type="text" placeholder="Item name..." bind:value={name}>
            <InputChip bind:value={sizesList} name="chips" placeholder="Enter avaiable sizes here..." on:remove={removeSize}/>
        </div>
        <div class="card variant-ringed p-2 flex flex-col gap-y-2">
            <h3 class="h3 font-semibold capitalize">2nd: Amount</h3>
            <label class="label">
                <span>Size (from selected)</span>
                <select class="select" bind:value={actualSelectdSizeAmount}>
                    {#key sizesList && sizesAmount}
                        <option value="" selected></option>
                        {#each getSizesWhoseArentOnSizesAmount() as size}
                            <option value="{size}">{size}</option>
                        {/each}
                    {/key}
                </select>
            </label>
            {#if actualSelectdSizeAmount.length}
                <label class="label">
                    <span>Avaiable in size amount</span>
                    <div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
                        <div class="input-group-shim"><WatsonHealthHangingProtocol size={24}/></div>
                        <input type="number" step="1" min="0" placeholder="Amount size x{actualSelectdSizeAmount}..." bind:value={sizeAmount}/>
                        <button class="variant-filled-secondary" on:click={acceptSizeAmount}>Submit</button>
                    </div>
                </label>
            {/if}
            {#key sizesAmount}
                <!-- Table with passed sizes amount -->
                {#if Object.keys(sizesAmount).length}
                    <div class="w-full h-full" use:prepareBodySizes>
                        <h4 class="h4 mb-2">Sizes Amount Table</h4>
                        <Table source={tableSizesSimple} interactive={true} on:selected={clickOnRowSizesAmount}/>
                    </div>
                {/if}
            {/key}
        </div>
        <div class="card variant-ringed p-2 flex flex-col gap-y-2">
            <h3 class="h3 font-semibold capitalize">3rd: Prices</h3>
            <label class="label">
                <span>Size (from selected)</span>
                <select class="select" bind:value={actualSelectdSizePrice}>
                    {#key sizesList && prices}
                        <option value="" selected></option>
                        {#each getSizesWhoseArentOnPricesList() as size}
                            <option value="{size}">{size}</option>
                        {/each}
                    {/key}
                </select>
            </label>
            {#if actualSelectdSizePrice.length}
                <label class="label">
                    <span>Price (EUR)</span>
                    <div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
                        <div class="input-group-shim"><CurrencyEuro size={24}/></div>
                        <input type="number" placeholder="Price for size {actualSelectdSizePrice}..." bind:value={price}/>
                        <button class="variant-filled-secondary" on:click={acceptSizePrice}>Submit</button>
                    </div>
                </label>
            {/if}
            {#key prices}
                <!-- Table with passed prieces for item sizes -->
                {#if Object.keys(prices).length}
                    <div class="w-full h-full" use:prepareSizePrices>
                        <h4 class="h4 mb-2">Prices Table</h4>
                        <Table source={tablePricesSimple} interactive={true} on:selected={clickOnRowPrices}/>
                    </div>
                {/if}
            {/key}
        </div>
        <div class="card variant-ringed p-2 flex flex-col gap-y-2">
            <h3 class="h3 font-semibold capitalize">4th: Images</h3>
            <FileDropzone name="files" accept="image/png, image/jpeg, image/webp" on:change={changeDropZone}>
                <svelte:fragment slot="lead">
                    <div class="w-full flex justify-center">
                        <CloudUpload size={32}/>
                    </div>
                </svelte:fragment>
                <svelte:fragment slot="message">
                    <span class="font-bold">Upload a file</span> 
                    or 
                    <span class="font-bold">drag and drop</span>
                </svelte:fragment>
                <svelte:fragment slot="meta">PNG, JPEG and WEBP images are allowed</svelte:fragment>
            </FileDropzone>
            {#if files.length}
                <div id="images-list">
                    <h4 class="h4 font-semibold mb-2">Images list</h4>
                    <div class="grid grid-cols-2 gap-2">
                        {#each files as image, i}
                            <button class="w-fit h-fit relative" on:mouseenter={onImage(i)} on:mouseleave={offImage(i)} on:click={removeSelectedImage(i)}>
                                {#if onImageInteraction == i}
                                    <div class="absolute w-full h-full flex justify-center items-center bg-black bg-opacity-70">
                                        <p class="text-red-600 font-bold font-sans  ">Click to delete image</p>
                                    </div>
                                {/if}
                                <img src="{URL.createObjectURL(image)}" alt="">
                            </button>
                        {/each}
                    </div>
                </div>
            {/if}
        </div>
        <button class="accept btn capitalize variant-filled-primary" on:click={addItem}>Add item</button>
    </div>
</div>

<style>
    .accept {
        color: white;
    }
</style>
