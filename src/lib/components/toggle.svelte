<script lang="ts">
   import { fly } from "svelte/transition";
   import { Moon, Sun } from "lucide-svelte";
   import { theme } from "$lib/theme.svelte";
</script>

<button onclick={theme.toggle} aria-label="Toggle theme">
   {#if theme.currentTheme === "dark"}
      <div in:fly={{ y: 10 }}>
         <Sun size={30} />
      </div>
   {:else}
      <div in:fly={{ y: -10 }}>
         <Moon size={30}/>
      </div>
   {/if}
</button>

<style>
   button {
      padding : 0;
      font-weight: inherit;
      background: none;
      border: none; 
      box-shadow: none;
      overflow: hidden;

      > * {
         display: inline-flex;
         gap: var(--size-2);
      }
   } 
</style>
