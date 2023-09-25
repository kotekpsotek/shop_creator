<script>

    import { page } from "$app/stores";

</script>

<div class="absolute top-0 right-0 w-screen h-screen flex items-center justify-center">
    <div class="card variant-soft-error p-4">
        <h1 class="h1 mb-2">Error captured in aim of operation</h1>
        <p class="text-lg">{@html $page.error?.message || "Cannot find error message"}</p>
    </div>
</div>
