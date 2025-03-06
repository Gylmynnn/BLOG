<script lang="ts">
   import { formatDate } from "$lib/utils";
   import * as config from "$lib/config";
   import type { PageProps } from "./$types";
   let { data }: PageProps = $props();
</script>

<svelte:head>
   <title>{config.title}</title>
   <meta name="description" content={config.description} />
</svelte:head>

<section class="posts-container">
   <ul class="posts">
      {#each data.posts as post}
         <li class="post">
            <a href={post.slug} class="post-title">{post.title}</a>
            <p class="post-date">{formatDate(post.date)}</p>
            <p class="post-description">{post.description}</p>
         </li>
      {/each}
   </ul>
</section>

<style>
   .posts {
      display: grid;
      gap: var(--size-7);
      .post {
         max-inline-size: var(--size-content-3);
         &:not(:last-child) {
            border-bottom: 1px solid var(--border);
            padding-bottom: var(--size-7);
         }
         .post-title {
            font-size: var(--font-size-fluid-3);
         }
         .post-date {
            color: var(--text-2);
         }
         .post-description {
            margin-top: var(--size-3);
         }
      }
   }
</style>
