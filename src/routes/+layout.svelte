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
  <main class="root-layout-container h-[90vh]">
    <PageTransition url={data.url}>
      {@render children?.()}
    </PageTransition>
    <!-- <span class="footer-layout-container lg:px-80"> -->
    <!--   <Footer /> -->
    <!-- </span> -->
  </main>
</div>

<style>
  .main-layout-container {
    height: 100vh;
    display: grid;
    grid-template-rows: auto 1fr auto;
    margin-inline: var(--size-7);
    padding-top: var(--size-7);
    @media (min-width: 1440px) {
      padding-inline: 0;
    }
  }
</style>
