<script lang="ts">
    import { page } from "$app/stores";

    /** Add shop Id to "anchor" element "href" attribute */
    function setShopId(node: HTMLAnchorElement) {
        const shopId = $page.url.searchParams.get("s");

        node.href += shopId;

        return {

        }
    }
</script>

<div class="w-screen h-screen flex justify-center items-center">
    <div class="card variant-ghost-success p-4">
        <h2 class="h2 font-bold mb-2">Congratulations, you finish!</h2>
        <p> Your shop is ready! Nevertheless don't forget about your shop preparation</p>
        <a class="anchor" href="/your-shop-panel/" use:setShopId>
            Let visit your shop panel
        </a>
    </div>
</div>