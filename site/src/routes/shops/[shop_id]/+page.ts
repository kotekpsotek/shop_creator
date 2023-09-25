import { checkShopExists } from '$lib/api.js';

export const load = async ({ params }) => {
    await checkShopExists(params);

    return {}
}