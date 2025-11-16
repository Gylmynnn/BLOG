<script lang="ts">
   import { formatDate } from "$lib/utils";
   import type { PageProps } from "./$types";

   let { data }: PageProps = $props();
</script>

<svelte:head>
   <title>{data.meta.title}</title>
   <meta name="description" content={data.meta.description} />
   <meta property="og:type" content="article" />
   <meta property="og:title" content={data.meta.title} />
</svelte:head>

<article class="pt-12 lg:pt-24">
   <hgroup class="hidden lg:block">
      <h1>{data.meta.title}</h1>
      <h5>{data.meta.description}</h5>
      <p class="pt-4">Published at {formatDate(data.meta.date)}</p>
   </hgroup>
   <hgroup class="lg:hidden">
      <h2>{data.meta.title}</h2>
      <h5 class="w-1/2">{data.meta.description}</h5>
      <p class="pt-4">Published at {formatDate(data.meta.date)}</p>
   </hgroup>

   <div class="tags">
      {#each data.meta.categoris as category}
         <span class="surface-4">&num;{category}</span>
      {/each}
   </div>

   <br />
   <div class="prose">
      <data.content />
   </div>
</article>

<style>
   article {
      max-inline-size: var(--size-content-3);
      margin-inline: auto;

      h1 {
         text-transform: capitalize;
      }

      .tags {
         display: flex;
         gap: var(--size-3);
         margin-top: var(--size-7);

         > * {
            padding: var(--size-2) var(--size-3);
            border-radius: var(--radius-round);
         }
      }
   }
</style>
