import { checkShopExists } from '$lib/api.js';
import { error } from '@sveltejs/kit';

export const load = async ({ params }) => {
    await checkShopExists(params);
    const dt = await fetch("http://localhost:8100/shop-frontend-info/"+params.shop_id);

    if (dt.status == 200) {
        return {
            ...await dt.json()
        }
    }
    else throw error(dt.status);
}