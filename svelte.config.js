import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { mdsvex, escapeSvelte } from "mdsvex";
import { createHighlighter } from "shiki";
import adapter from "@sveltejs/adapter-vercel";
import fs from "fs";

const everblushDark = JSON.parse(
    fs.readFileSync("./src/lib/shiki.theme.json", "utf8")
);

const everblushLight = JSON.parse(
    fs.readFileSync("./src/lib/shiki.theme.light.json", "utf8")
);

let highlighterInstance = null;

const installedLanguages = [
    "javascript",
    "typescript",
    "json",
    "go",
    "sh",
    "svelte",
    "shell",
    "python",
    "sql"
];

function getHighlighter() {
    if (!highlighterInstance) {
        highlighterInstance = createHighlighter({
            themes: [everblushDark, everblushLight],
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
                    themes: {
                        light: "everblush-light",
                        dark: "everblush",
                    },
                    defaultColor: "light",
                })
            );

            const encodedCode = Buffer.from(code).toString("base64");

            return `<div class="code-block-wrapper" data-code="${encodedCode}" data-lang="${lang}">{@html \`${html}\` }</div>`;
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
