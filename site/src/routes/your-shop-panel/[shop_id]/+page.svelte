<script lang="ts">
    import { ListBox, ListBoxItem } from "@skeletonlabs/skeleton";
    let valueSingle: string;

    document.body.style.overflow = "hidden";
</script>

<div class="bcg p-5">
    <p class="badge variant-soft-tertiary w-fit mb-1">Shop Panel</p>
    <h1 class="h1 font-bold mb-5 text-primary-100">What you would like to do?</h1>
    <div class="card variant-soft-ringed">
        <ListBox>
            <ListBoxItem bind:group={valueSingle} name="medium" value="books">Books</ListBoxItem>
            <ListBoxItem bind:group={valueSingle} name="medium" value="movies">Movies</ListBoxItem>
            <ListBoxItem bind:group={valueSingle} name="medium" value="tv">TV</ListBoxItem>
        </ListBox>
    </div>
</div>

<svelte:body style="overflow: hidden !important;"></svelte:body>

<style>
    .bcg {
        width: 100vw;
        height: 100vh;
        display: flex;
        flex-direction: column;
    }
</style>
