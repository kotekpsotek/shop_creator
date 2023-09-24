import { error } from '@sveltejs/kit';

export const load = async ({ params }) => {
    const { shop_id } = params;

    const f = await fetch("http://localhost:8100/shop-exists-check", {
        method: "POST",
        credentials: "include",
        headers: { 'content-type': "application/json" },
        body: JSON.stringify({ shop_id })
    });

    if (f.status == 404) throw error(404);

    return {}
}