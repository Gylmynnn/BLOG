import { json } from "@sveltejs/kit";
import type { Post } from "$lib/types";

async function getPosts(): Promise<Array<Post>> {
  let posts: Array<Post> = [];

  const paths = import.meta.glob("/src/posts/*.md", { eager: true });
  const rawPaths = import.meta.glob("/src/posts/*.md", { eager: true, query: "?raw", import: "default" });

  for (const path in paths) {
    const file = paths[path] as Record<string, unknown>;
    const slug = path.split("/").at(-1)?.replace(".md", "");

    if (file && typeof file === "object" && "metadata" in file && slug) {
      const metadata = file.metadata as Omit<Post, "slug">;

      const rawContent = rawPaths[path] as string;
      const imageMatch =
        rawContent.match(/<Images[^>]*src=["']([^"']+)["']/i) ||
        rawContent.match(/<img[^>]*src=["']([^"']+)["']/i) ||
        rawContent.match(/!\[.*?\]\(["']?([^"'\)]+)["']?\)/i);

      const extractedImage = imageMatch ? imageMatch[1] : undefined;

      const post = { ...metadata, slug, image: metadata.image || extractedImage } satisfies Post;
      post.published && posts.push(post);
    }
  }

  posts = posts.sort((first, second) => new Date(second.date).getTime() - new Date(first.date).getTime());

  return posts;
}

export async function GET(): Promise<Response> {
  const posts = await getPosts();
  return json(posts);
}
