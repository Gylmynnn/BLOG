<script lang="ts">
    import Footer from "$lib/components/footer.svelte";
    import Header from "$lib/components/header.svelte";
    import PageTransition from "./transition.svelte";
    import "open-props/style";
    import "open-props/normalize";
    import "open-props/buttons";
    import "../app.css";
    let { children, data } = $props();
</script>

<Header />
<div class="main-layout-container">
    <main class="root-layout-container">
        <PageTransition url={data.url}>
            {@render children?.()}
        </PageTransition>
    </main>
    <span class="footer-layout-container lg:px-80 lg:py-16">
        <Footer />
    </span>
</div>

<style>
    .main-layout-container {
        height: 100%;
        display: grid;
        grid-template-rows: auto 1fr auto;
        margin-inline: var(--size-7);
        padding-top: var(--size-7);
        @media (min-width: 1440px) {
            padding-inline: 0;
        }
    }
</style>
