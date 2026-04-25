<script lang="ts">
    import Header from "$lib/components/header.svelte";
    import PageTransition from "./transition.svelte";
    import "open-props/style";
    import "open-props/normalize";
    import "open-props/buttons";
    import "../app.css";
    let { children, data } = $props();
</script>

<Header />
<div class="layout-shell">
    <div class="layout-glow layout-glow-left" aria-hidden="true"></div>
    <div class="layout-glow layout-glow-right" aria-hidden="true"></div>
    <div class="main-layout-container">
        <main class="root-layout-container">
            <PageTransition url={data.url}>
                {@render children?.()}
            </PageTransition>
        </main>
    </div>
</div>

<style>
    .layout-shell {
        position: relative;
        min-height: 100vh;
        background:
            radial-gradient(circle at 0% 0%, color-mix(in oklab, var(--surface-2), transparent 84%) 0, transparent 45%),
            radial-gradient(
                circle at 100% 8%,
                color-mix(in oklab, var(--surface-3), transparent 86%) 0,
                transparent 40%
            ),
            var(--background);
    }

    .layout-glow {
        position: fixed;
        width: 24rem;
        height: 24rem;
        border-radius: 999px;
        pointer-events: none;
        filter: blur(80px);
        opacity: 0.15;
        z-index: 0;
        background: color-mix(in oklab, var(--brand), transparent 60%);
    }

    .layout-glow-left {
        top: -5rem;
        left: -10rem;
    }

    .layout-glow-right {
        right: -10rem;
        bottom: -5rem;
    }

    .main-layout-container {
        position: relative;
        z-index: 1;
        min-height: 100vh;
        width: 100%;
        max-width: 100vw;
        padding: 5rem 1rem 2rem 1rem;
        display: flex;
        justify-content: center;
    }

    .root-layout-container {
        width: min(90rem, 100%);
        min-height: calc(100vh - 7rem);
        display: flex;
        flex-direction: column;
    }

    @media (min-width: 1024px) {
        .main-layout-container {
            padding-top: 4rem;
            padding-bottom: 3rem;
            padding-left: calc(18rem + 3rem);
            padding-right: 3rem;
            justify-content: flex-start;
        }

        .root-layout-container {
            width: 100%; /* ubah ini — biar penuh sisa ruang */
            max-width: 90rem; /* opsional, biar tidak terlalu lebar di layar besar */
            margin-inline: auto;
        }
    }
</style>
