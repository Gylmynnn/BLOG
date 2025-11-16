<script lang="ts">
    import type { Snippet } from "svelte";

    interface Prop {
        children: Snippet;
    }
    let props: Prop = $props();
</script>

{@render props.children?.()}
