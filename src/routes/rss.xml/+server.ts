export const prerender = true;
import * as config from "$lib/config";
import type { Post } from "$lib/types";
import type { RequestEvent } from "@sveltejs/kit";

function escapeXml(str: string) {
   return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
}

export async function GET({ fetch }: RequestEvent) {
   const response: Response = await fetch("api/posts");
   const headers: Record<string, string> = { "Content-Type": "application/xml" };

   if (!response.ok) {
      return new Response("<error>Failed to fetch posts</error>", {
         status: 500,
         headers,
      });
   }

   const posts: Post[] = await response.json();

   const xml = `
		<rss xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
			<channel>
				<title>${escapeXml(config.title)}</title>
				<description>${escapeXml(config.description)}</description>
				<link>${config.url}</link>
				<atom:link href="${config.url}/rss.xml" rel="self" type="application/rss+xml"/>
				${posts
         .map(
            (post) => `
						<item>
							<title>${escapeXml(post.title)}</title>
							<description>${escapeXml(post.description)}</description>
							<link>${config.url}/${post.slug}</link>
							<guid isPermaLink="true">${config.url}/${post.slug}</guid>
							<pubDate>${new Date(post.date).toUTCString()}</pubDate>
						</item>
					`,
         )
         .join("")}
			</channel>
		</rss>
	`.trim();

   return new Response(xml, { headers });
}
