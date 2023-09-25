import { error } from "@sveltejs/kit"

export const load = ({ url }) => {
    if (url.searchParams.get("s") == null) {
        throw error(400, { message: "To see this page you must be redirected with attached 'your shop id' to url</br><p>In this way: <span class='font-bold underline'>"+url.toString() + "?s=[your_shop_id]" +"</span></p>" })
    }
};