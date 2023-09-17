<script lang="ts">
    import { Input, Label, Helper, Button, Checkbox, A } from 'flowbite-svelte';    
    import { Email, View, ViewOff } from 'carbon-icons-svelte';
    import type { FormEventHandler } from 'svelte/elements';

    let form: HTMLFormElement;

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

    function beforeSubmit(ev: Event) {
        ev.preventDefault();
        const p = (document.getElementById("password")! as HTMLInputElement).value;
        const pC = (document.getElementById("confirm_password")! as HTMLInputElement).value;

        if (p == pC) {
            form.submit();
        }
        else alert("Password and password check values aren't the same!");
    }
</script>

<form action="http://localhost:8100/signup" method="post" bind:this={form} on:submit={beforeSubmit}>
    <div class="bilboard">
        <div class="mb-6">
            <Label for="email" class="mb-2">Email</Label>
            <Input type="email" name="em" id="email" placeholder="youremail@email.com" required>
                <Email slot="left"/>
            </Input>
        </div>
        <div class="mb-6">
            <Label for="password" class="mb-2">Password</Label>
            <Input type="{showPass ? "text" : "password"}" name="ps" minlength="10" maxlength="36" id="password" placeholder="•••••••••" required>
                <button slot="left" on:click={showHide("pass")}>
                    {#if showPass}
                        <View/>
                    {:else}
                        <ViewOff/>
                    {/if}
                </button>
            </Input>
        </div>
        <div class="mb-6">
            <Label for="confirm_password" class="mb-2">Confirm password</Label>
            <Input type="{showPassChck ? "text" : "password"}" minlength="10" maxlength="36" id="confirm_password" placeholder="•••••••••" required>
                <button slot="left" on:click={showHide("pass-chck")}>
                    {#if showPassChck}
                        <View/>
                    {:else}
                        <ViewOff/>
                    {/if}
                </button>
            </Input>
        </div>
        <Checkbox class="mb-6 space-x-1" required>
            I agree with the <A href="/" class="text-primary-700 dark:text-primary-600 hover:underline">terms and conditions</A>.
        </Checkbox>
        <Button type="submit">Submit</Button>
    </div>
</form>
