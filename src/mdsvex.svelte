<script lang="ts">
   import type { Snippet } from "svelte";
   import { img } from "$lib/components/index";
   export { img };

   interface Prop {
      children: Snippet;
   }
   let props: Prop = $props();
</script>

{@render props.children?.()}
