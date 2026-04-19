<script lang="ts">
   import { afterNavigate } from "$app/navigation";
   import * as config from "$lib/config";
   import Toggle from "./toggle.svelte";
   let isOpen = $state<boolean>(false);
   let navRef: HTMLElement;

   $effect((): (() => void) => {
      const handleClickOutside = (event: MouseEvent): void => {
         if (isOpen && navRef && !navRef.contains(event.target as Node)) {
            isOpen = false;
         }
      };

      document.addEventListener("click", handleClickOutside);

      afterNavigate((): void => {
         isOpen = false;
      });

      return (): void => {
         document.removeEventListener("click", handleClickOutside);
      };
   });
</script>

<aside class="sidebar" bind:this={navRef}>
   <div class="sidebar-header">
      <a href="/" class="site-title">
         <h4>{config.title}</h4>
      </a>
      <div class="mobile-controls">
         <span class="mobile-toggle">
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
   </div>

   <!-- Content (Desktop fixed, Mobile dropdown) -->
   <div class="sidebar-content" class:open={isOpen}>
      <nav class="nav-links">
         <p class="nav-heading">Directory</p>
         <ul>
            <li><a href="/">Archive</a></li>
            <li><a href="/rss.xml" target="_blank">RSS Feed</a></li>
         </ul>
      </nav>

      <div class="sidebar-footer">
         <div class="desktop-toggle">
            <Toggle />
         </div>
         <p class="copyright">&copy; {new Date().getFullYear()} {config.title}.</p>
      </div>
   </div>
</aside>

<style>
   .sidebar {
      position: fixed;
      z-index: 999;
      top: 0;
      left: 0;
      right: 0;
      background: color-mix(in oklab, var(--background), transparent 5%);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid color-mix(in oklab, var(--border), transparent 50%);
   }

   .sidebar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 4rem;
      padding: 0 1.5rem;
   }

   .site-title {
      text-decoration: none;
   }

   .site-title h4 {
      font-family: var(--font-monospace-code);
      font-weight: 600;
      letter-spacing: -0.02em;
      font-size: 1.15rem;
      color: var(--text-1);
   }

   .mobile-controls {
      display: flex;
      align-items: center;
      gap: 1rem;
   }

   .mobile-toggle {
      display: block;
      padding-top: 0.2rem;
   }

   .hamburger {
      cursor: pointer;
      background: none;
      border: none;
      padding: 0.5rem;
      box-shadow: none;
   }

   .hamburger div {
      width: 20px;
      height: 1.5px;
      background: var(--text-1);
      border-radius: 2px;
      position: relative;
      transition: background 0.3s ease;
   }

   .hamburger div::before,
   .hamburger div::after {
      content: "";
      position: absolute;
      width: 100%;
      height: 1.5px;
      background: var(--text-1);
      right: 0;
      border-radius: 2px;
      transition: transform 0.3s ease, width 0.3s ease;
   }

   .hamburger div::before {
      top: -6px;
   }
   .hamburger div::after {
      bottom: -6px;
      width: 14px;
   }

   .hamburger div.open {
      background: transparent;
   }

   .hamburger div.open::before {
      transform: rotate(45deg) translateY(8px);
      width: 20px;
   }

   .hamburger div.open::after {
      transform: rotate(-45deg) translateY(-8px);
      width: 20px;
   }

   .sidebar-content {
      display: none;
      padding: 1.5rem;
      background: var(--background);
      border-bottom: 1px solid color-mix(in oklab, var(--border), transparent 50%);
   }

   .sidebar-content.open {
      display: flex;
      flex-direction: column;
      position: absolute;
      top: 4rem;
      left: 0;
      right: 0;
      box-shadow: 0 20px 40px -20px color-mix(in oklab, var(--surface-4), transparent 10%);
   }

   .nav-heading {
      font-size: 0.65rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--text-2);
      margin-bottom: 1.2rem;
      font-weight: 600;
   }

   .nav-links ul {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
   }

   .nav-links a {
      display: block;
      font-size: 1.25rem;
      color: var(--text-1);
      text-decoration: none;
      padding: 0.5rem 0;
      font-weight: 400;
      transition: color 0.2s ease, opacity 0.2s ease;
   }

   .nav-links a:hover {
      opacity: 0.7;
   }

   .sidebar-footer {
      margin-top: 3rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
   }

   .desktop-toggle {
      display: none;
   }

   .copyright {
      font-size: 0.75rem;
      color: var(--text-2);
      font-family: var(--font-monospace-code);
   }

   @media (min-width: 1024px) {
      .sidebar {
         right: auto;
         bottom: 0;
         width: 18rem;
         border-bottom: none;
         border-right: 1px solid color-mix(in oklab, var(--border), transparent 60%);
         display: flex;
         flex-direction: column;
         background: var(--background); /* Solid background for desktop */
      }

      .sidebar-header {
         height: auto;
         padding: 3rem 2rem 2rem 2rem;
      }

      .mobile-controls {
         display: none;
      }

      .sidebar-content {
         display: flex;
         flex-direction: column;
         flex-grow: 1;
         position: static;
         padding: 0 2rem 3rem 2rem;
         border-bottom: none;
         box-shadow: none;
         background: transparent;
      }

      .nav-links {
         margin-top: 1rem;
      }

      .nav-links a {
         font-size: 1.05rem;
      }

      .sidebar-footer {
         margin-top: auto;
      }
      
      .desktop-toggle {
         display: block;
      }
   }
</style>
