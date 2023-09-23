<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { Image } from "carbon-icons-svelte";
    import { goto } from "$app/navigation";
    import RemarkableWhiteBlackLayout from "$lib/layouts/remarkableWhiteBlack_layout.svelte";
    import { Stepper, Step } from '@skeletonlabs/skeleton';
    import stripeLogo from "$lib/stripe-logo.svg";
    import { Spinner } from "flowbite-svelte";
    import { shopCreationStore } from "$lib/inter_stores";
    
    type FashionLayouts = "remarkable-blackwhite";

    let stepNumber = 0;
    $: stepName = stepNumber == 0 ? "Prepare Foundaments" : (stepNumber == 1 ? "Prepare Layout" : (stepNumber == 2 ? "Billing preparation" : "Preparation Finalization"));

    let stripeConnectSate: { notAllow: boolean, m: string } | undefined;
    let loading: { s: true, message: string } | undefined;
    /** Handle redirection from stripe */
    async function redirectFromStripeHandle() {
        const u = new URL(document.URL);
        if (u.search == "?return") { // Verify link which suggest that user ends account connection (whether data was harvested in whole span of 'KYC' term)
            loading = { s: true, message: "Checking whether you enclose Stripe Connect to your account" };
            const f = await fetch("http://localhost:8100/payments/connect-shop", {
                method: "POST",
                credentials: "include",
                headers: {
                    'content-type': "application/json"
                },
                body: JSON.stringify({ verify: true })
            });

            loading = undefined;
            if (f.status != 200) {
                stripeConnectSate = { notAllow: true, m: "Stripe and we couldn't collect all required informations to perform payouts for you" };
            }
            else stripeConnectSate = { notAllow: false, m: "" };
        } 
        else if (u.search == "?refresh") { // Refresh link which e.g: expired
            // Same function for both action is more simple
            await connectWithStripe();
        }
    }
    // onMount(redirectFromStripeHandle);
    
    let shopTypeIsInSelecting = false;
    let showUnselectCapability = false;
    let files: FileList | undefined;
    
    $: if (stepNumber == 2) {
        redirectFromStripeHandle();
    } /* else if (stepNumber == 0) {
        if ((!files || !files.length)) {
            loadLogoPreviewImageFromStore();
        }
    }; */

    // Lock state whether is activated
    let locked: boolean = true;
    $: {
        $shopCreationStore;
        stripeConnectSate;
        locked = !allowGoAhead();
    }

    // All things connected with shop state storage
    onMount(() => {
        window.addEventListener("pageshow", shopCreationStore.load);
        window.addEventListener("reset", shopCreationStore.save);
        window.addEventListener("pagehide", shopCreationStore.save);
        shopCreationStore.load();
    });

    onDestroy(() => {
        shopCreationStore.save();
    });

        // Create array buffer from image logo
    $: if (files && files.length) {
        const reader = new FileReader();

        reader.onload = () => {
            $shopCreationStore.logo = { cnt: new Uint8Array(reader.result as ArrayBuffer), mime: files![0].type, name: files![0].name };
        }

        reader.readAsArrayBuffer(files[0]);
    }

    // Functions
    /** Load image from localStorage saved durning last shop creation (only when data wasn't deletd after successfull creation) */
    function loadLogoPreviewImageFromStore() {
        if ($shopCreationStore.logo) {
            const img = document.getElementById("preview-logo")! as HTMLImageElement;
            // TODO: Action of 'Repair invalid parsed from JSON bytes list' shold happed in place where is loaded so in file './src/lib/inter_stores.ts' within its 'shopCreationStore' 'load' method
            const cnt = new Uint8Array(Object.values($shopCreationStore.logo.cnt)); // After save into localStorage as JSON Uint8Array as default type of saved data is converted to Object with key-value pairs like: { 0: 123, 1: 255, etc... }
            $shopCreationStore.logo = { ...$shopCreationStore.logo, cnt }; // Resave repaired Uint8Array content
            
            const newFile = new File([cnt.buffer], $shopCreationStore.logo.name, { // Create file instance for re-created bytes storage which consist from numbers writed under unsiged 8 bits Base-2 numbers range
                type: $shopCreationStore.logo.mime
            });
            
            img.src = URL.createObjectURL(newFile); // Create preview using url which reference to blob in browswer memory
        }
    }

    /** Emphesize selected layout when was selected about which testifies occurance in $shopCreationStore latout name */
    function loadSelectedLayout(node: HTMLDivElement) {
        const shopLayouts = node.getElementsByTagName("button");

        for (const layout of shopLayouts) {
            const lName = layout.getAttribute("data-layout-name");
            if (lName == $shopCreationStore.layout) {
                // Assign selection style
                layout.classList.remove("variant-ringed");
                layout.classList.add("variant-soft-primary");

                // Allow user go to next stage by execute using Svelte reactivity allowGoAhead function from Svelte Reactive Code block. This Svelte Reactive block listen for changes in $shopCreationStore
                $shopCreationStore = $shopCreationStore;
            }
        }
    }

    function allowGoAhead() {
        if (stepNumber == 0) {
            const stL = ($shopCreationStore.name?.trim() || "").length || 0;
            return ($shopCreationStore.shop_type?.length || 0) != 0 && (stL >= 5 && stL <= 30) && ((files || []).length != 0 || $shopCreationStore.logo != undefined);
        } else if (stepNumber == 1) {
            return typeof $shopCreationStore.layout != "undefined";
        } else if (stepNumber == 2) {
            return (stripeConnectSate && !stripeConnectSate.notAllow) ? true : false;
        }

        return false;
    }

    function selectLogo(ev: Event) {
        const ec = ev.currentTarget! as HTMLElement;
        const inpF = ec.getElementsByTagName("input")[0];
        inpF.click()
    }

    function unselectLogo() {
        files = undefined;
        $shopCreationStore.logo = undefined;
        showUnselectCapability = false;
    }

    function loadLogoPreview(node: HTMLImageElement) {
        if (!$shopCreationStore.logo) {
            const file = files![0];
            const reader = new FileReader();
    
            reader.onload = (e) => {
                const res = e.target?.result as string | undefined;
                if (res) {
                    node.src = res;
                }
            }
    
            reader.readAsDataURL(file);
        } else {
            loadLogoPreviewImageFromStore()
        }
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
            
            if ($shopCreationStore.shop_type != choosen) { // When user don't select this layout prior
                // Unselect other layouts types
                const layoutBtns = document.getElementsByClassName("layout-btn");
                for (const btn of layoutBtns) {
                    if (btn.classList.contains("variant-soft-primary")) {
                        btn.classList.replace("variant-soft-primary", "variant-ringed")
                    }
                }
            
                // Assign selected layout
                $shopCreationStore.layout = choosen;
                cls.replace("variant-ringed", "variant-soft-primary");
            }
            else { // When user select this layout prior
                $shopCreationStore.layout = undefined;
                cls.replace("variant-soft-primary", "variant-ringed");
            };
        };
    }

    /** Connect user with stripe by govern it's datas */
    async function connectWithStripe() {
        // Reset likely filled 'stripeConnectSate' datas
        stripeConnectSate = undefined;
        loading = { s: true, message: "Redirecting to Stripe Connect Service" };
        
        // Src action
        const bck = await fetch("http://localhost:8100/payments/connect-shop", {
            method: "post",
            credentials: "include",
        });

        if (bck.status == 200) {
            const { r_url } = await bck.json();
            window.location.assign(r_url);
            loading = undefined;
        }
        else alert("Cannot perform 'connect account action' via Stripe")
    }

    function completeShopCreation() {
        // TODO: Save shop datas, Redirect to final page
    }
</script>

{#if loading?.s}
    <!-- Display loading element -->
    <div class="absolute top-0 right-0 w-full h-full bg-sky-950 flex items-center justify-center">
        <div class="card variant-soft-surface p-4 h-1/5 w-2/4 flex flex-col gap-y-5 justify-center items-center">
            <Spinner/>
            <p class="font-bold text-lg">{loading.message}</p>
        </div>
    </div>
{/if}
{#if stripeConnectSate  && stripeConnectSate.notAllow}
    <!-- When user must again attach all datas to his Stripe Connect account -->
    <aside class="alert variant-filled-secondary">
        <!-- Icon -->
        <div>
            🔎
        </div>
        <!-- Message -->
        <div class="alert-message">
            {stripeConnectSate.m}
        </div>
    </aside>
{/if}
<div class="bckg p-5">
    <Stepper on:next={goToNextStep} on:back={goToPreviousStep} on:complete={completeShopCreation}>
        <Step {locked}>
            <svelte:fragment slot="header">
                <h2 class="badge variant-soft-secondary font-normal w-fit gap-y-5">{stepName}</h2>
            </svelte:fragment>
            <div class="form-asif card p-2 flex flex-col gap-y-5">
                <h3 class="h3 font-bold">Common Shop Presetups</h3>
                <div class="slel">
                    {#if !shopTypeIsInSelecting && !$shopCreationStore.shop_type}
                        <button class="btn text-color-blue variant-ringed-primary text-primary-400 w-full text-start" on:click={_ => {
                            shopTypeIsInSelecting = true;
                        }}>
                            Add Shop Type
                        </button>
                    {:else}
                        <select class="select" name="sl-type" on:blur={_ => shopTypeIsInSelecting = false} bind:value={$shopCreationStore.shop_type}>
                            <option value="fashion">Fashion Store</option>
                            <option value="supplements">Supplements Store</option>
                        </select>
                    {/if}
                </div>
                <input class="input" type="text" placeholder="Add Shop Title" minlength="5" maxlength="30" bind:value={$shopCreationStore.name}>
                <div class="w-full">
                    {#if (!files || files.length == 0) && !$shopCreationStore.logo}
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
                            <img id="preview-logo" class="h-full w-full bg-cover rounded" src="" alt="" use:loadLogoPreview>
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
            <div class="ls mt-5" use:loadSelectedLayout>
                <button class="layout-btn p-2 card-hover variant-ringed rounded cursor-pointer flex flex-col gap-y-2 h-fit hover:variant-soft-primary" data-layout-name="remarkable-blackwhite" on:click={pickLayout("remarkable-blackwhite")} on:dblclick={_ => goto("/layouts_preview/remarkable-whiteblack")}>
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
                <button class="layout-btn p-2 card-hover variant-ringed rounded cursor-pointer flex flex-col gap-y-2 h-fit hover:variant-soft-primary" data-layout-name="ot" on:click={pickLayout("ot")} on:dblclick={_ => goto("/layouts_preview/remarkable-whiteblack")}>
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
                {#key stripeConnectSate}
                    <button class="btn variant-soft-tertiary w-60" disabled={allowGoAhead()} on:click={connectWithStripe}>
                        {#if allowGoAhead()}
                            <p>You're connected with</p>
                            <img src="{stripeLogo}" alt="" class="w-14 h-8">
                        {:else}
                            <p>Connect with</p>
                            <img src="{stripeLogo}" alt="" class="w-14 h-8">
                            <p>now</p>
                        {/if}
                    </button>
                {/key}
            </div>
        </Step>
        <!-- ... -->
    </Stepper>
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
