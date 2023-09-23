import { writable } from "svelte/store";
import { onDestroy, onMount } from "svelte";

// Store session id
export const sessionID = writable<string>();

// Save datas durning creation new shop
export const shopCreationStore = (function() {
    interface Shop {
        name?: string,
        shop_type?: string,
        logo?: {
            cnt: Uint8Array,
            mime: string,
            name: string
        },
        layout?: string
    }
    const st = writable<Shop>({
        name: undefined,
        shop_type: undefined,
        logo: undefined,
        layout: undefined
    });

    return {
        ...st,
        load() {
            st.update(v => {
                const fR = localStorage.getItem("shop-creation") || "{}";
                const fRp = JSON.parse(fR) as Shop;
                v = { ...v, ...fRp };
                return v;
            })
        },
        save() {
            st.update(v => {
                localStorage.setItem(
                    "shop-creation",
                    JSON.stringify(v)
                );
                return v;
            });
        }
    }
})()
