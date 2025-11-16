import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { mdsvex, escapeSvelte } from "mdsvex";
import { createHighlighter } from "shiki";
import adapter from "@sveltejs/adapter-vercel";
import fs from "fs";

const everblush = JSON.parse(
   fs.readFileSync("./src/lib/shiki.theme.json", "utf8")
);

/** Cache highlighter agar tidak membuat instance baru setiap kali */
let highlighterInstance = null;
const installedLanguages = [
   "javascript",
   "typescript",
   "go",
   "sh",
   "svelte",
   "shell",
   "python",
];

function getHighlighter() {
   if (!highlighterInstance) {
      highlighterInstance = createHighlighter({
         themes: [everblush],
         langs: installedLanguages,
      });
   }
   return highlighterInstance;
}

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
   extensions: [".md"],
   layout: {
      _: "./src/mdsvex.svelte",
   },
   highlight: {
      highlighter: async (code, lang = "text") => {
         const highlighter = await getHighlighter();
         const html = escapeSvelte(
            highlighter.codeToHtml(code, {
               lang,
               theme: "everblush",
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
