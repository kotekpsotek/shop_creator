<script lang="ts">
    import { goto } from "$app/navigation";
    import loveImg from "$lib/images/love-image.jpg"

    async function goToLogin() {
        await goto("/account/login")
    }
</script>

<div class="w-full h-screen flex flex-col justify-center items-center">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div  on:click={goToLogin} class="card-hover cursor-pointer rounded p-4 w-4/5 variant-ghost-success md:w-2/5 h-fit flex flex-col gap-5 md:flex-row">
        <div>
            <h3 class="h3 font-semibold">You created account, Congratulations!❤️</h3>
            <p class="font-normal text-base">You can can access to our full set of utilities! Let's go...</p>
        </div>
        <img src="{loveImg}" alt="" class="w-full h-48  object-fill md:h-80">
    </div>
</div>

<style>
    
</style>