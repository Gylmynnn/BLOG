import type { Post } from "$lib/types";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ fetch }) => {
    async function getPosts(): Promise<Array<Post>> {
        const response = await fetch("api/posts");
        return await response.json() as Array<Post>;
    }
    return { posts: await getPosts() };
};
