import { error } from "@sveltejs/kit";

export async function checkShopExists({ shop_id }: any) {
    const f = await fetch("http://localhost:8100/shop-exists-check", {
        method: "POST",
        credentials: "include",
        headers: { 'content-type': "application/json" },
        body: JSON.stringify({ shop_id })
    });

    if (f.status != 200) throw error(404, { message: "Page hasn't been not found!" });
}