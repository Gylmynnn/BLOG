<script lang="ts">
    import type { Snippet } from "svelte";
    import { onMount } from "svelte";

    interface Prop {
        children: Snippet;
    }
    let props: Prop = $props();

    let mounted = $state(false);

    onMount(() => {
        mounted = true;
        enhanceCodeBlocks();
    });

    function enhanceCodeBlocks() {
        const codeBlocks = document.querySelectorAll<HTMLElement>(".code-block-wrapper");
        codeBlocks.forEach((wrapper) => {
            if (wrapper.querySelector(".code-header")) return;
            const code = wrapper.getAttribute("data-code");
            const lang = wrapper.getAttribute("data-lang") || "text";
            if (!code) return;
            const decodedCode = atob(code);
            const header = document.createElement("div");
            header.className = "code-header";
            header.innerHTML = `
                <span class="lang-badge">${lang}</span>
                <button class="copy-button" data-code-to-copy="">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                        <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                    </svg>
                    <span>Copy</span>
                </button>
            `;
            const copyButton = header.querySelector(".copy-button") as HTMLButtonElement;
            copyButton.setAttribute("data-code-to-copy", decodedCode);
            const preTag = wrapper.querySelector("pre");
            if (preTag) {
                wrapper.insertBefore(header, preTag);
            }
            copyButton.addEventListener("click", async () => {
                const codeText = copyButton.getAttribute("data-code-to-copy") || "";
                try {
                    await navigator.clipboard.writeText(codeText);
                    const originalHTML = copyButton.innerHTML;
                    copyButton.classList.add("copied");
                    copyButton.innerHTML = `
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 6L9 17l-5-5"></path>
                        </svg>
                        <span>Copied</span>
                    `;

                    setTimeout(() => {
                        copyButton.classList.remove("copied");
                        copyButton.innerHTML = originalHTML;
                    }, 2000);
                } catch (err) {
                    console.error("Failed to copy:", err);
                }
            });
        });
    }
</script>

<div class="mdsvex-layout">
    {@render props.children?.()}
</div>

<style>
    :global(.code-block-wrapper) {
        position: relative;
        margin: 1.5rem 0;
        border-radius: 0.5rem;
        overflow: hidden;
        border: 1px solid color-mix(in oklab, var(--border), transparent 60%);
        background: var(--surface-1);
    }

    :global(.code-header) {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem 1rem;
        background: color-mix(in oklab, var(--surface-2), transparent 40%);
        border-bottom: 1px solid color-mix(in oklab, var(--border), transparent 60%);
    }

    :global(.lang-badge) {
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--text-2);
        font-family: "Iosevka", monospace;
    }

    :global(.copy-button) {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.375rem 0.75rem;
        background: color-mix(in oklab, var(--surface-1), transparent 20%);
        border: 1px solid color-mix(in oklab, var(--border), transparent 60%);
        border-radius: 0.375rem;
        color: var(--text-2);
        cursor: pointer;
        font-size: 0.75rem;
        font-weight: 500;
        transition: all 0.2s ease;
        font-family: inherit;
    }

    :global(.copy-button:hover) {
        background: color-mix(in oklab, var(--brand), transparent 80%);
        color: var(--brand);
        border-color: color-mix(in oklab, var(--brand), transparent 60%);
    }

    :global(.copy-button.copied) {
        background: color-mix(in oklab, var(--brand), transparent 70%);
        color: var(--brand);
        border-color: color-mix(in oklab, var(--brand), transparent 50%);
    }

    :global(.code-block-wrapper > pre) {
        margin: 0;
        padding: 1.5rem;
        overflow-x: auto;
        background: var(--surface-1);
        font-family: "Iosevka", monospace;
        font-size: 0.9rem;
        line-height: 1.75;
        border-radius: 0;
    }

    :global(.code-block-wrapper > pre code) {
        background: none;
        padding: 0;
        border-radius: 0;
        color: var(--text-1);
        display: block;
        word-spacing: 0.2em;
    }

    :global(.code-block-wrapper::-webkit-scrollbar) {
        height: 0.5rem;
    }

    :global(.code-block-wrapper::-webkit-scrollbar-track) {
        background: color-mix(in oklab, var(--surface-2), transparent 40%);
    }

    :global(.code-block-wrapper::-webkit-scrollbar-thumb) {
        background: color-mix(in oklab, var(--border), transparent 40%);
        border-radius: 0.25rem;
    }

    :global(.code-block-wrapper::-webkit-scrollbar-thumb:hover) {
        background: color-mix(in oklab, var(--border), transparent 20%);
    }

    /* Light mode styling */
    @media (prefers-color-scheme: light) {
        :global(.code-block-wrapper) {
            background: #ffffff;
            border: 1px solid #e5e7eb;
        }

        :global(.code-header) {
            background: #f9fafb;
            border-bottom-color: #e5e7eb;
        }

        :global(.code-block-wrapper > pre) {
            background: #ffffff !important;
        }

        :global(.code-block-wrapper > pre code) {
            background: #ffffff !important;
            color: #1f2937 !important;
        }

        /* Override all Shiki span colors for light mode */
        :global(.code-block-wrapper span) {
            background: transparent !important;
        }

        /* Override specific inline styles */
        :global(.code-block-wrapper [style*="color:"]) {
            color: inherit !important;
        }

        /* Map dark theme colors to light theme */
        :global(.code-block-wrapper [style*="#e57474"]) {
            color: #dc2626 !important;
        }

        :global(.code-block-wrapper [style*="#93cfa1"]) {
            color: #059669 !important;
        }

        :global(.code-block-wrapper [style*="#67b0e8"]) {
            color: #2563eb !important;
        }

        :global(.code-block-wrapper [style*="#8ccf7e"]) {
            color: #16a34a !important;
        }

        :global(.code-block-wrapper [style*="#c47fd5"]) {
            color: #9333ea !important;
        }

        :global(.code-block-wrapper [style*="#6c7d8c"]) {
            color: #6b7280 !important;
        }

        :global(.code-block-wrapper [style*="#dadada"]) {
            color: #1f2937 !important;
        }

        :global(.copy-button) {
            background: #f3f4f6;
            border-color: #d1d5db;
            color: #4b5563;
        }

        :global(.copy-button:hover) {
            background: #fee2e2;
            color: #dc2626;
            border-color: #fca5a5;
        }

        :global(.copy-button.copied) {
            background: #fee2e2;
            color: #dc2626;
            border-color: #fca5a5;
        }
    }

    @media (prefers-color-scheme: dark) {
        :global(.code-block-wrapper) {
            background: var(--surface-1);
            border: 1px solid color-mix(in oklab, var(--border), transparent 60%);
        }

        :global(.code-header) {
            background: color-mix(in oklab, var(--surface-2), transparent 40%);
            border-bottom-color: color-mix(in oklab, var(--border), transparent 60%);
        }

        :global(.code-block-wrapper > pre) {
            background: var(--surface-1);
        }
    }
</style>
