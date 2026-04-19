import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import type { Post } from "$lib/types";

export const load: PageLoad = async ({ params, fetch }): Promise<any> => {
  try {
    const post = await import(`../../posts/${params.slug}.md`);
    const metadata = post.metadata as Post;

    const response = await fetch("/api/posts");
    const posts: Post[] = await response.json();
    const currentPost = posts.find((p) => p.slug === params.slug);

    if (currentPost?.image) {
      metadata.image = currentPost.image;
    }

    return {
      content: post.default,
      meta: metadata,
    };
  } catch (e: unknown) {
    error(404, `Not found ${params.slug}`);
  }
};
