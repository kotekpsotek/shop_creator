<script>
    import { page } from "$app/stores";
</script>

<div class="absolute top-0 right-0 w-screen h-screen flex flex-col justify-center items-center">
    <div class="card variant-soft-error p-4">
        <h1 class="h1 mb-2">Error</h1>
        <p class="text-lg">{$page.error?.message}</p>
    </div>
</div>