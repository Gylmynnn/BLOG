import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import type { Post } from "$lib/types";

export const load: PageLoad = async ({ params }) => {
   try {
      const post = await import(`../../posts/${params.slug}.md`);
      const metadata = post.metadata as Post;
      return {
         content: post.default,
         meta: metadata,
      };
   } catch (e: unknown) {
      error(404, `Not found ${params.slug}`);
   }
};
