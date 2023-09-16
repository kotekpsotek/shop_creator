<script lang="ts">
    import { Home } from "carbon-icons-svelte";
    import { navigating } from "$app/stores";
    import { goto, afterNavigate } from "$app/navigation";

    
    /** Go to the previous page which is the most cases initializer of this action */
    let fromPage: string;
    function goToPreviousPage() {
        if (fromPage) {
            goto(fromPage);
        }
        else window.history.back();
    }

    afterNavigate(({ from }) => {
        fromPage = from?.route.id as string;
    });
</script>

<div class="preview">
    <div class="upper-preview-addnotation">
        <h4>Preview mode</h4>
        <button id="go-home" on:click={goToPreviousPage} title="Go back to previous page (initialization relay)">
            <Home/>
            <p>Go Back</p>
        </button>
    </div>
    <slot></slot>
</div>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@600;700&family=Roboto&display=swap');

    * {
        margin: 0;
        padding: 0x;
    }
    
    .preview {
        margin: 5px;
        margin-top: 45px;
        border: solid 1px black;
        position: relative;
        font-family: 'Roboto', sans-serif;
    }

    .upper-preview-addnotation {
        height: 35px;
        position: absolute;
        top: -37px;
        left: 0px;
        display: flex;
        align-items: center;
        justify-content: center;
        column-gap: 10px;
        border: solid 1px black;
        background-color: white;
    }

    .upper-preview-addnotation h4 {
        padding-left: 10px;
    }

    button#go-home {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        column-gap: 5px;
        color: yellow;
        background-color: black;
        border: solid 1px yellow;
    }
</style>
