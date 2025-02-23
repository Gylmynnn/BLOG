import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { mdsvex, escapeSvelte } from "mdsvex";
import { createHighlighter } from "shiki";
import adapter from "@sveltejs/adapter-vercel";

/** Caching highlighter agar tidak membuat instance baru setiap kali */
let highlighterInstance;
const installedLanguages = [
   "javascript",
   "typescript",
   "go",
   "sh",
   "svelte",
   "shell",
   "python",
];

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
   extensions: [".md"],
   layout: {
      _: "./src/mdsvex.svelte",
   },
   highlight: {
      highlighter: async (code, lang = "text") => {
         if (!highlighterInstance) {
            highlighterInstance = await createHighlighter({
               themes: ["catppuccin-mocha"],
               langs: [...installedLanguages],
            });
         }

         const html = escapeSvelte(
            highlighterInstance.codeToHtml(code, {
               lang,
               theme: "catppuccin-mocha",
            }),
         );

         return `{@html \`${html}\` }`;
      },
   },
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
   preprocess: [vitePreprocess(), mdsvex(mdsvexOptions)],
   extensions: [".svelte", ".md"],

   kit: {
      adapter: adapter(),
   },
};

export default config;
