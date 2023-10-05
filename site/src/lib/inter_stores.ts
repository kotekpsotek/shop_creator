import { writable } from "svelte/store";
import { createImageUrlFromBytesBuffer } from "./api";

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

// Place where are store all orders
export const orderBasket = writable<{ image_url: string, name: string, description: string, size: string, price: number }[]>([]);

// Store shop Id
export const selectedShopId = (() => {
    const s = writable<string | undefined>();

    // When was saved before
    const shopId = localStorage.getItem("shop-id");
    if (shopId) {
        s.update(v => {
            v = shopId;
            
            return v;
        }) 
    }

    return {
        ...s,
        save() {
            s.update(v => {
                if (v) {
                    localStorage.setItem("shop-id", v);
                }
                
                return v;
            })
        }
    }
})();

export function saveOrderBasketState() {
    orderBasket.subscribe(v => {
        const obP = JSON.stringify({ v });
        localStorage.setItem("order-basket", obP);
    })
}

export const lovedItemsStore = (() => {
    const w = writable<{ image_buf: number[], name: string, description: string, price: number }[]>([]);

    return {
        ...w,
        createImageUrlFromBytesBuffer,
        removeFavoriteItem(name: string) {
            w.update(v => {
                const id = v.findIndex(vv => vv.name == name);
                v.splice(id, 1);
                v = v;
                return v;
            })
        },
        load() {
            w.update(v => {
                v = JSON.parse(localStorage.getItem("loved-items") || "[]");
                return v;
            })
        },
        save() {
            w.update(v => {
                localStorage.setItem("loved-items", JSON.stringify(v));
                return v;
            })
        }
    }
})();
