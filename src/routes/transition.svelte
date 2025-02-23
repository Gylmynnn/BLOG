<script lang="ts">
   import type { Snippet } from "svelte";
   import { blur } from "svelte/transition";

   interface Props {
      children: Snippet;
      url: string;
   }

   let { children, url }: Props = $props();
</script>

{#key url}
   <div class="transition" in:blur>
      {@render children?.()}
   </div>
{/key}

<style>
   .transition {
      height: 100%;
   }
</style>
