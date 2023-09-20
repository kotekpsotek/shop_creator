<script lang="ts">
    import { Email, View, ViewOff } from "carbon-icons-svelte";

    let showPass = false;
    let showPassChck = false;
    function showHide(forc: "pass" | "pass-chck") {
        return () => { 
            switch (forc) {
                case "pass":
                    showPass = !showPass
                break
    
                case "pass-chck":
                    showPassChck = !showPassChck
                break;
            }
        }
    }

    // Determine whether user can submit form
    let canSubmit = false;
    function whetherCanSubmit() {
        type E = HTMLInputElement;
        const email = (document.getElementsByName("email")[0] as E).value;
        const password = (document.getElementsByName("password")[0] as E).value;

        return email.includes("@") && email.trim().split("@").every(v => v.length >= 1) && password.length >= 10 && password.length <= 36;
    }

    fetch("http://localhost:8100", {
        credentials: "include"
    })
    .then(() => void undefined)

    setInterval(() => canSubmit = whetherCanSubmit(), 250);
</script>
<form action="http://localhost:8100/login" class="w-full h-screen flex justify-center items-center" method="post">
    <div class="card p-4 variant-ghost-secondary h-fit w-4/5 lg:w-2/5 flex flex-col gap-y-2">
        <h2 class="h2 font-semibold mb-2">Login</h2>
        <div class="flex flex-col gap-y-1">
            <p class="text-sm pl-2 font-thin">Email</p>
            <div class="input-group input-group-divider grid-cols-[auto_2fr_auto] h-9">
                <div class="input-group-shim"><Email/></div>
                <input class="px-2" type="text" name="email" placeholder="Email"/>
            </div>
        </div>
        <div class="flex flex-col gap-y-1">
            <p class="text-sm pl-2 font-thin">Password</p>
            <div class="input-group input-group-divider grid-cols-[auto_2fr_auto] h-9">
                <button class="input-group-shim" on:click={showHide("pass")}>
                    {#if showPass}
                        <View/>
                    {:else}
                        <ViewOff/>
                    {/if}
                </button>
                <input class="px-2" name="password" minlength="10" maxlength="36" type="{showPass ? "text" : "password"}" placeholder="Password"/>
            </div>
        </div>
        <div class="submit flex justify-end mt-2">
            <button disabled={!canSubmit} type="submit" class="btn bg-gradient-to-br variant-gradient-secondary-primary text-white px-10">Button</button>
        </div>
    </div>
</form>
