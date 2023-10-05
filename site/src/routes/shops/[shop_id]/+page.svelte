<script lang="ts">
    import { page } from "$app/stores";
    import { selectedShopId } from "$lib/inter_stores";
    import RemarkableWhiteBlackLayout from "$lib/layouts/remarkableWhiteBlack_layout.svelte";
    import { onDestroy, onMount } from "svelte";

    const pd = $page.data;

    onMount(() => {
        // Save shop id e.g: for search usage
        $selectedShopId = $page.params.shop_id;
        console.log($selectedShopId)
    });

    onDestroy(() => {
        // Save id in localStorage when component was unmounted
        selectedShopId.save();
    });
</script>

{#if pd.shop_type == "fashion" && pd.layout_selected == "remarkable-blackwhite"}
    <RemarkableWhiteBlackLayout/>
{/if}
