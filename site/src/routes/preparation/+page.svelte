<script lang="ts">
    import { Image } from "carbon-icons-svelte";
    import { goto } from "$app/navigation";
    import RemarkableWhiteBlackLayout from "$lib/layouts/remarkableWhiteBlack_layout.svelte";
    
    let stepNumber = 2;
    $: stepName = stepNumber == 1 ? "Prepare Foundaments" : (stepNumber == 2 ? "Prepare Layout" : "Preparation Finalization") 

    let shopTypeIsInSelecting = false;
    let shopType: undefined | string;
    let shopTitle: string | undefined;
    let showUnselectCapability = false;
    let files: FileList | undefined;
    function allowGoAhead() {
        if (stepNumber == 1) {
            const stL = (shopTitle?.trim() || "").length || 0;
            return (shopType?.length || 0) != 0 && (stL >= 5 && stL <= 30) && (files || []).length != 0;
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
        stepNumber += 1;
    }

    function goToPreviousStep() {
        stepNumber -= 1;
    }
</script>

<div class="bckg">
    <div class="setps">
        <h2>{stepName}</h2>
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
                <h3>Layouts showcase</h3>
                <div class="ls">
                    <button class="shc-item" on:click={_ => goto("/layouts_preview/remarkable-whiteblack")}>
                        <p>Remarkable White Black</p>
                        <div class="preview">
                            <div class="t">
                                <p>Short preview</p>
                            </div>
                            <div class="p">
                                <RemarkableWhiteBlackLayout previewMode={true}/>
                            </div>
                        </div>
                    </button>
                </div>
            {/if}
        </div>
        <div class="an-ac">
            <p>{stepNumber}/3</p>
            {#key shopType && shopTitle && files}
                {#if stepNumber != 3}
                    <button disabled={!allowGoAhead()} on:click={goToNextStep}>Next</button>
                {/if}
            {/key}
            {#if stepNumber != 1}
                <button on:click={goToPreviousStep}>Previous</button>
            {/if}
        </div>
    </div>
</div>

<style>
    .ls {
        display: grid;
        grid-template-columns: repeat(2, minmax(500px, 750px));
    }
</style>
