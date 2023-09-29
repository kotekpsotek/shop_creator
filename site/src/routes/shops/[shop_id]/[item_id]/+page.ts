import { error } from '@sveltejs/kit';

export const load = async ({ params: { item_id, shop_id } }) => {
    const f = await fetch(`http://localhost:8100/shop-item-details/${shop_id}/${item_id}`);

    if (f.status == 200) {
        const { images, text } = await f.json();
        return {
            images,
            text
        }
    }
    else error(404, { message: "Shop or item in shop doesn't exist!" });
}
