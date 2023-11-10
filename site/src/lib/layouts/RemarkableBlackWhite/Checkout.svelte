<script lang="ts">
    import { goto } from "$app/navigation";
    import card_img from "$lib/images/credit-card.png" 

    let payment: "card" | "blik";
    let address: { voivideship_city: string, address: string } = { voivideship_city: "", address: "" };

    async function pay() {
        const call = await fetch("http://localhost:8100/payments-api/pay-basket", {
            method: "POST",
            body: JSON.stringify({ payment, address })
        });

        alert("Payment finalized!");
        goto("/order/porgress");
    }
</script>

<section class="sc">
        <div class="main">
            <h1>Order payment</h1>
            <div id="address">
                <h3>Address</h3>
                <div>
                    <input type="text" placeholder="voivoideship, City" bind:value={address.voivideship_city}>
                    <input type="text" placeholder="Address" bind:value={address.address}>
                </div>
            </div>
            {#key payment && address}
                <div id="methods">
                    <h3>Methods</h3>
                    <div>
                        <button class:selected={payment == "blik"} on:click={_ => payment = "blik"}>
                            <img src="https://www.blik.com//layout/default/dist/gfx/logo/logo-mobile.svg" alt="">
                        </button>
                        <button class:selected={payment == "card"} on:click={_ => payment = "card"}>
                            <img src="{card_img}" alt="">
                        </button>
                    </div>
                </div>
                <button id="pay" disabled="{(payment && (address?.voivideship_city && address?.address) ? false : true)}" on:click={pay}>Pay</button>
            {/key}
        </div>
</section>

<style>
    .sc {
        width: 100vw;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: whitesmoke;
    }

    .main {
        width: 90%;
        padding: 15px;
        border: solid 1px black;
        border-radius: 4px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        row-gap: 5px;
        color: black;
    }

    h1 {
        font-size: 24px;
        font-weight: 700;
    }

    #address, #methods {
        width: 100%;
        display: flex;
        flex-direction: column;
        row-gap: 2px;
    }

    h3 {
        font-weight: 600;
    }

    :is(#address) > div {
        width: 100%;
        display: flex;
        column-gap: 3px;
    }

    :is(#methods) > div {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        column-gap: 3px;
    }

    :is(#address, #methods) input {
        width: 50%;
    }

    #methods button {
        padding: 10px;
        padding-left: 15px;
        padding-right: 15px;
        display: flex;
        align-items: center;
        background-color: black;
        border-radius: 3px;
        column-gap: 5px;
        color: white;
    }

    #methods button img {
        width: 35px;
        height: 35px;
    }

    #methods button.selected {
        background-color: orangered;
        border: solid 1px black;
    }

    button#pay {
        width: 100%;
        height: 50px;
        background-color: black;
        border-radius: 5px;
        color: white;
        text-transform: uppercase;
        font-weight: 600;
    }

    button#pay[disabled] {
        opacity: 0.5;
    }

    @media only screen and (min-width: 966px) {
        .main {
            width: 70%;
        }
    }
</style>
