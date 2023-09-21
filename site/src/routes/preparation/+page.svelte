<script lang="ts">
    import { onMount } from "svelte";
    import { Image } from "carbon-icons-svelte";
    import { goto } from "$app/navigation";
    import RemarkableWhiteBlackLayout from "$lib/layouts/remarkableWhiteBlack_layout.svelte";
    import { Stepper, Step } from '@skeletonlabs/skeleton';
    import stripeLogo from "$lib/stripe-logo.svg"
    
    type FashionLayouts = "remarkable-blackwhite";
    
    let stepNumber = 2;
    $: stepName = stepNumber == 0 ? "Prepare Foundaments" : (stepNumber == 1 ? "Prepare Layout" : (stepNumber == 2 ? "Billing preparation" : "Preparation Finalization"));

    let alertDisp = false;
    onMount(() => {
        const u = new URL(document.URL);
        if (u.searchParams.has("return")) {
            // TODO: Check
        }
    });
    
    let shopTypeIsInSelecting = false;
    let shopType: undefined | string;
    let shopTitle: string | undefined;
    let showUnselectCapability = false;
    let files: FileList | undefined;
    let pickupLayout: FashionLayouts | undefined = undefined;

    // Lock state whether is activated
    let locked: boolean = true;
    $: {
        shopTypeIsInSelecting;
        shopType;
        shopTitle;
        showUnselectCapability;
        files;
        pickupLayout;
        locked = !allowGoAhead();
    }

    // Functions
    function allowGoAhead() {
        if (stepNumber == 0) {
            const stL = (shopTitle?.trim() || "").length || 0;
            return (shopType?.length || 0) != 0 && (stL >= 5 && stL <= 30) && (files || []).length != 0;
        } else if (stepNumber == 1) {
            console.log("al", typeof pickupLayout != "undefined")
            return typeof pickupLayout != "undefined";
        }

        return false;
    }

    function selectLogo(ev: Event) {
        const ec = ev.currentTarget! as HTMLElement;
        const inpF = ec.getElementsByTagName("input")[0];
        inpF.click()
    }

    function unselectLogo() {
        files = undefined
    }

    function loadLogoPreview(node: HTMLImageElement) {
        const file = files![0];
        const reader = new FileReader();

        reader.onload = (e) => {
            const res = e.target?.result as string | undefined;
            if (res) {
                node.src = res;
            }
        }

        reader.readAsDataURL(file);
    }

    function goToNextStep() {
        locked = true;
        stepNumber += 1;
    }

    function goToPreviousStep() {
        locked = false;
        stepNumber -= 1;
    }

    function pickLayout(choosen: FashionLayouts) {
        return (ev: Event) => {
            // Change background fole selected element
            const tg = ev.currentTarget! as HTMLButtonElement;
            const cls = tg.classList;
            
            if (pickupLayout != choosen) { // When user don't select this layout prior
                // Unselect other layouts types
                const layoutBtns = document.getElementsByClassName("layout-btn");
                for (const btn of layoutBtns) {
                    if (btn.classList.contains("variant-soft-primary")) {
                        btn.classList.replace("variant-soft-primary", "variant-ringed")
                    }
                }
            
                // Assign selected layout
                pickupLayout = choosen;
                cls.replace("variant-ringed", "variant-soft-primary");
            }
            else { // When user select this layout prior
                pickupLayout = void pickLayout;
                cls.replace("variant-soft-primary", "variant-ringed");
            };
        };
    }

    async function connectWithStripe() {
        const bck = await fetch("http://localhost:8100/payments/connect-shop", {
            method: "post",
            credentials: "include",
        });

        if (bck.status == 200) {
            const { r_url } = await bck.json();
            window.location.assign(r_url);
        }
        else alert("Cannot perform 'connect account action' via Stripe")
    }
</script>

<div class="bckg p-5">
    <Stepper start={2} on:next={goToNextStep} on:back={goToPreviousStep}>
        <Step {locked}>
            <svelte:fragment slot="header">
                <h2 class="badge variant-soft-secondary font-normal w-fit gap-y-5">{stepName}</h2>
            </svelte:fragment>
            <div class="form-asif card p-2 flex flex-col gap-y-5">
                <h3 class="h3 font-bold">Common Shop Presetups</h3>
                <div class="slel">
                    {#if !shopTypeIsInSelecting && !shopType}
                        <button class="btn text-color-blue variant-ringed-primary text-primary-400 w-full text-start" on:click={_ => {
                            shopTypeIsInSelecting = true;
                        }}>
                            Add Shop Type
                        </button>
                    {:else}
                        <select class="select" name="sl-type" on:blur={_ => shopTypeIsInSelecting = false} bind:value={shopType}>
                            <option value="fashion">Fashion Store</option>
                            <option value="supplements">Supplements Store</option>
                        </select>
                    {/if}
                </div>
                <input class="input" type="text" placeholder="Add Shop Title" minlength="5" maxlength="30" bind:value={shopTitle}>
                <div class="w-full">
                    {#if !files || files.length == 0}
                        <button class="btn variant-ringed-primary w-full" on:click={selectLogo}>
                            <p class="text-primary-400">Select Shop Logo</p>
                            <Image size={24} fill="rgb(56, 139, 255)"/>
                            <input type="file" accept="image/png, image/jpeg, image/svg+xml, image/webp, image/gif" multiple={false} hidden bind:files/>
                        </button>
                    {:else}
                        <button class="card-hover rounded p-1 w-52 h-52 variant-soft-primary relative" on:click={unselectLogo} on:mouseenter={_ => showUnselectCapability = true} on:mouseleave={_ => showUnselectCapability = false}>
                            {#if showUnselectCapability}
                                <div class="unselect-cap absolute top-0 right-0 w-full h-full rounded bg-primary-400 bg-opacity-50 flex justify-center items-center">
                                    <p class="text-slate-100">Click to unselect image</p>
                                </div>
                            {/if}
                            <img class="h-full w-full bg-cover rounded" src="" alt="" use:loadLogoPreview>
                        </button>
                    {/if}
                </div>
            </div>
        </Step>
        <Step {locked}>
            <svelte:fragment slot="header">
                <h2 class="badge variant-soft-secondary font-normal w-fit">{stepName}</h2>
            </svelte:fragment>
            <h1 class="h1 font-bold">Layouts showcase</h1>
            <div class="ls mt-5">
                <button class="layout-btn p-2 card-hover variant-ringed rounded cursor-pointer flex flex-col gap-y-2 h-fit hover:variant-soft-primary" on:click={pickLayout("remarkable-blackwhite")} on:dblclick={_ => goto("/layouts_preview/remarkable-whiteblack")}>
                    <p class="p text-xl font-serif font-normal">Remarkable White Black</p>
                    <div class="preview flex flex-col gap-y-2">
                        <div class="w-full">
                            <p class="text-start text-base font-normal bg-gradient-to-br from-blue-500 to-cyan-300 bg-clip-text text-transparent box-decoration-clone capitalize">Short preview:</p>
                        </div>
                        <div class="p h-96">
                            <RemarkableWhiteBlackLayout previewMode={true}/>
                        </div>
                    </div>
                </button>
                <button class="layout-btn p-2 card-hover variant-ringed rounded cursor-pointer flex flex-col gap-y-2 h-fit hover:variant-soft-primary" on:click={pickLayout("ot")} on:dblclick={_ => goto("/layouts_preview/remarkable-whiteblack")}>
                    <p class="p text-xl font-serif font-normal">Remarkable White Black</p>
                    <div class="preview flex flex-col gap-y-2">
                        <div class="w-full">
                            <p class="text-start text-base font-normal bg-gradient-to-br from-blue-500 to-cyan-300 bg-clip-text text-transparent box-decoration-clone capitalize">Short preview:</p>
                        </div>
                        <div class="p h-96">
                            <RemarkableWhiteBlackLayout previewMode={true}/>
                        </div>
                    </div>
                </button>
            </div>
        </Step>
        <Step {locked}>
            <svelte:fragment slot="header">
                <h2 class="badge variant-soft-secondary font-normal w-fit">{stepName}</h2>
            </svelte:fragment>
            <div class="card variant-soft p-2 flex flex-col gap-y-5">
                <div class="head">
                    <h3 class="h3 font-bold">Connect with 
                        <span class="text-success-200">Stripe</span> 
                        account
                    </h3>
                    <p class="font-serif">
                        <span class="text-success-100">Stripe</span> 
                        is platform by which we make all payments and payouts
                    </p>
                </div>
                <button class="btn variant-soft-tertiary w-60" on:click={connectWithStripe}>
                    <p>Connect with</p>
                    <img src="{stripeLogo}" alt="" class="w-14 h-8">
                    <p>now</p>
                </button>
            </div>
            {#if alertDisp}
                <aside class="alert variant-filled-secondary">
                    <!-- Icon -->
                    <div>
                        🔎
                    </div>
                    <!-- Message -->
                    <div class="alert-message">
                        
                    </div>
                </aside>
            {/if}
        </Step>
        <!-- ... -->
    </Stepper>
    <div class="setps flex flex-col mt-5" style="display: none;">
        <h2 class="badge variant-soft-secondary font-normal w-fit gap-y-5">{stepName}</h2>
        <div class="cmn-ac">
            {#if stepNumber == 1}
                <div class="slel">
                    {#if !shopTypeIsInSelecting && !shopType}
                        <button on:click={_ => {
                            shopTypeIsInSelecting = true;
                        }}>
                            Add Shop Type
                        </button>
                    {:else}
                        <select name="sl-type" on:blur={_ => shopTypeIsInSelecting = false} bind:value={shopType}>
                            <option value="fashion">Fashion Store</option>
                            <option value="supplements">Supplements Store</option>
                        </select>
                    {/if}
                </div>
                <input type="text" placeholder="Add Shop Title" minlength="5" maxlength="30" bind:value={shopTitle}>
                <div class="lgl">
                    {#if !files || files.length == 0}
                        <button class="logo" on:click={selectLogo}>
                            <Image size={32}/>
                            <input type="file" accept="image/png, image/jpeg, image/svg+xml, image/webp, image/gif" multiple={false} hidden bind:files/>
                        </button>
                    {:else}
                        <button on:click={unselectLogo} on:mouseenter={_ => showUnselectCapability = true} on:mouseleave={_ => showUnselectCapability = false}>
                            {#if showUnselectCapability}
                                <div class="unselect-cap">
                                    <p>Click to unselect image</p>
                                </div>
                            {/if}
                            <img src="" alt="" use:loadLogoPreview>
                        </button>
                    {/if}
                </div>
            {:else if stepNumber == 2}
                <h1 class="h1 font-bold">Layouts showcase</h1>
                <div class="ls mt-5">
                    <button class="p-2 card-hover variant-ringed rounded cursor-pointer flex flex-col gap-y-2 h-fit hover:variant-soft-primary" on:click={pickLayout("remarkable-blackwhite")} on:dblclick={_ => goto("/layouts_preview/remarkable-whiteblack")}>
                        <p class="p text-xl font-serif font-normal">Remarkable White Black</p>
                        <div class="preview flex flex-col gap-y-2">
                            <div class="w-full">
                                <p class="text-start text-base font-normal bg-gradient-to-br from-blue-500 to-cyan-300 bg-clip-text text-transparent box-decoration-clone capitalize">Short preview:</p>
                            </div>
                            <div class="p h-96">
                                <RemarkableWhiteBlackLayout previewMode={true}/>
                            </div>
                        </div>
                    </button>
                    <button class="p-2 card-hover variant-ringed rounded cursor-pointer flex flex-col gap-y-2 h-fit hover:variant-soft-primary" on:click={pickLayout("remarkable-blackwhite")} on:dblclick={_ => goto("/layouts_preview/remarkable-whiteblack")}>
                        <p class="p text-xl font-serif font-normal">Remarkable White Black</p>
                        <div class="preview flex flex-col gap-y-2">
                            <div class="w-full">
                                <p class="text-start text-base font-normal bg-gradient-to-br from-blue-500 to-cyan-300 bg-clip-text text-transparent box-decoration-clone capitalize">Short preview:</p>
                            </div>
                            <div class="p h-96">
                                <RemarkableWhiteBlackLayout previewMode={true}/>
                            </div>
                        </div>
                    </button>
                    <button class="p-2 card-hover variant-ringed rounded cursor-pointer flex flex-col gap-y-2 h-fit hover:variant-soft-primary" on:click={pickLayout("remarkable-blackwhite")} on:dblclick={_ => goto("/layouts_preview/remarkable-whiteblack")}>
                        <p class="p text-xl font-serif font-normal">Remarkable White Black</p>
                        <div class="preview flex flex-col gap-y-2">
                            <div class="w-full">
                                <p class="text-start text-base font-normal bg-gradient-to-br from-blue-500 to-cyan-300 bg-clip-text text-transparent box-decoration-clone capitalize">Short preview:</p>
                            </div>
                            <div class="p h-96">
                                <RemarkableWhiteBlackLayout previewMode={true}/>
                            </div>
                        </div>
                    </button>
                    <button class="p-2 card-hover variant-ringed rounded cursor-pointer flex flex-col gap-y-2 h-fit hover:variant-soft-primary" on:click={pickLayout("remarkable-blackwhite")} on:dblclick={_ => goto("/layouts_preview/remarkable-whiteblack")}>
                        <p class="p text-xl font-serif font-normal">Remarkable White Black</p>
                        <div class="preview flex flex-col gap-y-2">
                            <div class="w-full">
                                <p class="text-start text-base font-normal bg-gradient-to-br from-blue-500 to-cyan-300 bg-clip-text text-transparent box-decoration-clone capitalize">Short preview:</p>
                            </div>
                            <div class="p h-96">
                                <RemarkableWhiteBlackLayout previewMode={true}/>
                            </div>
                        </div>
                    </button>
                </div>
            {:else if stepNumber == 3}
                <!-- Payments support bank card code needed -->
                
            {/if}
        </div>
        <!-- <div class="an-ac">
            <p>{stepNumber}/3</p>
            {#key (shopType && shopTitle && files) || pickupLayout}
                {#if stepNumber != 3}
                    <button disabled={!allowGoAhead()} on:click={goToNextStep}>Next</button>
                {/if}
            {/key}
            {#if stepNumber != 1}
                <button on:click={goToPreviousStep}>Previous</button>
            {/if}
        </div> -->
    </div>
</div>

<style>
    .ls {
        display: grid;
        grid-template-columns: minmax(100px, 500px);
        gap: 10px;
    }

    @media only screen and (min-width: 500px) {
        .ls {
            grid-template-columns: repeat(auto-fit, minmax(250px, 500px));
        }
    }
</style>
