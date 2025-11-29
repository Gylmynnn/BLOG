<script lang="ts">
   import { afterNavigate } from "$app/navigation";
   import * as config from "$lib/config";
   import { slide } from "svelte/transition";
   import Toggle from "./toggle.svelte";
   let isOpen = $state<boolean>(false);
   let navRef: HTMLElement;
   let scrolled = $state<boolean>(false);

   $effect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (isOpen && navRef && !navRef.contains(event.target as Node)) {
            isOpen = false;
         }
      };

      const handleScroll = () => {
         scrolled = window.scrollY > 0;
      };

      window.addEventListener("scroll", handleScroll);
      document.addEventListener("click", handleClickOutside);

      afterNavigate(() => {
         isOpen = false;
      });

      return () => {
         window.removeEventListener("scroll", handleScroll);
         document.removeEventListener("click", handleClickOutside);
      };
   });
</script>

<nav
   class="nav-bar-container p-4"
   class:scrolled
   bind:this={navRef}
   class:open={isOpen}
>
   <div class="nav-content">
      <a href="/" class="nav-bar-title">
         <h4>{config.title}</h4>
      </a>

      <div class="flex gap-2">
         <span class="lg:hidden pt-2">
            <Toggle />
         </span>
         <button
            class="hamburger"
            onclick={() => (isOpen = !isOpen)}
            aria-label="Toggle Menu"
         >
            <div class:open={isOpen}></div>
         </button>
      </div>

      <!-- Mobile dropdown menu -->
      {#if isOpen}
         <ul class="nav-bar-links" transition:slide>
            <div class="flex justify-between items-start">
               <span class="flex flex-col gap-4">
                  <li><a href="/about">ABOUT</a></li>
                  <li><a href="/projects">PROJECTS</a></li>
                  <li><a href="/contact">CONTACT</a></li>
                  <li><a href="/rss.xml" target="_blank">RSS</a></li>
               </span>
            </div>
         </ul>
      {/if}

      <!-- Desktop menu (always visible on lg screens) -->
      <ul class="nav-bar-links-desktop">
         <li><a href="/about">ABOUT</a></li>
         <li><a href="/projects">PROJECTS</a></li>
         <li><a href="/contact">CONTACT</a></li>
         <li><a href="/rss.xml" target="_blank">RSS</a></li>
         <Toggle />
      </ul>
   </div>
</nav>

<style>
   .nav-bar-container {
      margin: 8px 10px;
      position: fixed;
      border-radius: 12px;
      top: 0;
      left: 0;
      right: 0;
      z-index: 999;
      pointer-events: none;
      transition:
         background-color 0.3s ease,
         border-color 0.3s ease;
   }

   .nav-content {
      pointer-events: auto;
   }

   .nav-bar-container a,
   .nav-bar-container a:visited {
      color: var(--text-2);
   }

   .nav-bar-container.scrolled a,
   .nav-bar-container.scrolled a:visited {
      color: var(--text-2);
   }

   .nav-bar-container.scrolled {
      border-color: var(--surface-1);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      color: var(--text-2);
   }

   .nav-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
   }

   .nav-bar-links {
      color: var(--text-2);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      list-style: none;
      width: 350px;
      font-weight: 700;
      display: flex;
      border-color: var(--navbar-text);
      flex-direction: column;
      gap: 1rem;
      background: var(--background);
      padding: 2rem;
      position: absolute;
      right: 1rem;
      top: calc(100% + 10px);
      border-radius: 12px;
      box-shadow: var(--shadow-4);
      z-index: 10;
      pointer-events: auto;
   }

   .nav-bar-container.scrolled .nav-bar-links {
      color: var(--text-2);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
   }

   .hamburger {
      gap: 5px;
      cursor: pointer;
      background: none;
      border: none;
      padding: 0.5rem;
      box-shadow: none;
      z-index: 20;
   }

   .hamburger div {
      width: 25px;
      height: 3px;
      background: var(--text-2);
      border-radius: 3px;
      transition:
         transform 0.3s ease,
         opacity 0.3s ease,
         background 0.3s ease;
      position: relative;
   }

   .hamburger div::before,
   .hamburger div::after {
      content: "";
      position: absolute;
      width: 18px;
      height: 3px;
      background: var(--text-2);
      border-radius: 3px;
      transition:
         transform 0.3s ease,
         background 0.3s ease;
   }

   .hamburger div::before {
      top: -8px;
   }
   .hamburger div::after {
      bottom: -8px;
   }

   .hamburger div.open {
      background: transparent;
   }

   .hamburger div.open::before {
      transform: rotate(45deg) translateY(11px);
   }

   .hamburger div.open::after {
      transform: rotate(-45deg) translateY(-11px);
   }

   .nav-bar-links-desktop {
      display: none;
      color: var(--text-2);
      list-style: none;
      font-weight: 700;
      flex-direction: row;
      align-items: center;
      gap: var(--size-7);
      pointer-events: auto;
   }

   @media (min-width: 768px) {
      .nav-bar-container {
         margin: 16px 400px;
      }

      .hamburger {
         display: none;
      }

      .nav-bar-links-desktop {
         display: flex;
      }
   }
</style>
