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

<div class="layout">
   <span class="header">
      <Header />
   </span>
   <main class="root-layout">
      <PageTransition url={data.url}>
         {@render children?.()}
      </PageTransition>
   </main>
   <span class="footer">
      <Footer />
   </span>
</div>

<style>
   .layout {
      height: 100%;
      display: grid;
      grid-template-rows: auto 1fr auto;
      margin-inline: var(--size-7);

      @media (min-width: 1440px) {
         padding-inline: 0;
      }

      main {
         padding-block: var(--size-9);
      }
   }
</style>
