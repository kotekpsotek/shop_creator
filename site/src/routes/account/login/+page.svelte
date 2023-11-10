<script lang="ts">
    import { sessionID } from "$lib/inter_stores";
    import { Email, View, ViewOff } from "carbon-icons-svelte";
    import { onMount } from "svelte";
    import ck from "js-cookie";

    let loggedIn: { state?: "logged-in" | "incorrect-login" } = { state: undefined };
    onMount(() => {
        const url = new URL(document.URL);

        // Save session in Svelte storage
        if (url.searchParams.has("logged")) {
            const sessionId = url.searchParams.get("logged")!;
            sessionID.update(v => {
                v = sessionId;
                return v;
            });

            // Setup cookie
            ck.set("session-app-frontend", btoa(sessionId), {
                expires: 1, // 24h
            }); // encoded as base64 value

            // Delete url from history
            window.history.pushState(null, "", location.href.split("?")[0]);

            // Display logged in alert
            loggedIn.state = "logged-in";
        }
        else if (url.searchParams.get("status") == "401") {
            loggedIn.state = "incorrect-login";
        }
    });

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

    $: if (loggedIn.state == "logged-in") {
        setTimeout(() => window.location.assign("/"), 2_000)
    }

    setInterval(() => canSubmit = whetherCanSubmit(), 250);
</script>

{#if loggedIn.state}
    <aside class="alert" class:variant-filled-success={loggedIn.state=="logged-in"} class:variant-filled-error={loggedIn.state == "incorrect-login"}>
        <!-- Icon -->
        <div>
            {loggedIn.state == "logged-in" ? "❤️" : "🔎"}
        </div>
        <!-- Message -->
        <div class="alert-message">
            {#if loggedIn.state == "logged-in"}
                <h3 class="h3 font-medium">You're logged-in!</h3>
                <p>Go to other sites and use full power of our platform!</p>
            {:else}
                <h3 class="h3 font-medium">Sometimes we make misteps!</h3>
                <p>In some place you put bad loggin data. Please, Try again</p>
            {/if}
        </div>
    </aside>
{/if}

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
                <button type="button" class="input-group-shim" on:click={showHide("pass")}>
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
