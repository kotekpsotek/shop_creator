<script lang="ts">
    import { UserAvatar, OverflowMenuHorizontal } from "carbon-icons-svelte";
    import { navigating } from "$app/stores";
    import { goto } from "$app/navigation"

    const url = new URL(document.URL);

    let accountBiblord = false;
</script>

{#key $navigating}
    <!-- TODO: Styles -->
    {#if !new URL(document.URL).pathname.includes("layouts_preview")}
        <div class="top-most-worth">
            <div class="menu">
                <OverflowMenuHorizontal/>
            </div>
            <p>My shop creator</p>
            <button class="account" on:click={_ => accountBiblord = !accountBiblord}>
                <UserAvatar/>
            </button>
        </div>
        {#if accountBiblord}
            <div class="account-bilboard">
                <button on:click={_ => goto("/account/login")}>Login</button>
                <button on:click={_ => goto("/account/create")}>Create account</button>
            </div>
        {/if}
    {/if}
{/key}
<slot/>

<style>
    .top-most-worth {
        display: flex;
        justify-content: space-between;
    }
</style>