<script lang="ts">
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import Checkout from "$lib/layouts/RemarkableBlackWhite/Checkout.svelte";

    let pd: { [i: string]: any } | undefined = undefined;
    onMount(async () => {
        const con = await fetch("http://localhost:8100/shop-frontend-info/"+$page.params.shop_id);
        pd = await con.json();
    })
</script>

{#if pd?.shop_type == "fashion" && pd.layout_selected == "remarkable-blackwhite"}
    <Checkout/>
{/if}
