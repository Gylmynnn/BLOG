<script lang="ts">
   import * as config from "$lib/config";
   import Toggle from "./toggle.svelte";
</script>

<nav class="nav-bar-container">
   <a href="/" class="nav-bar-title">
      <b>{config.title}</b>
   </a>

   <ul class="nav-bar-links">
      <li><a href="/about">ABOUT</a></li>
      <li><a href="/contact">CONTACT</a></li>
      <li><a href="/rss.xml" target="_blank">RSS</a></li>
   </ul>

   <Toggle />
</nav>

<style>
   nav {
      padding-block: var(--size-7);

      @media (min-width: 768px) {
         display: flex;
         justify-content: space-between;
         align-items: center;
      }

      .nav-bar-links {
         margin-block: var(--size-7);

         @media (min-width: 768px) {
            display: flex;
            gap: var(--size-7);
            margin-block: 0;
         }
      }

      a {
         color: inherit;
         text-decoration: none;
      }
   }
</style>
