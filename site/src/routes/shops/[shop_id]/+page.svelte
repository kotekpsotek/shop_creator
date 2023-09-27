<script lang="ts">
    import { page } from "$app/stores";
    import RemarkableWhiteBlackLayout from "$lib/layouts/remarkableWhiteBlack_layout.svelte";

    const pd = $page.data;
</script>

{#if pd.shop_type == "fashion" && pd.layout_selected == "remarkable-blackwhite"}
    <RemarkableWhiteBlackLayout/>
{/if}
