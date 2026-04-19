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

<article class="post-page">
    <header class="editorial-hero">
        <div class="tags">
            {#each data.meta.categoris as category}
                <span class="tag">{category}</span>
            {/each}
        </div>

        <h1>{data.meta.title}</h1>
        <p class="post-description">{data.meta.description}</p>

        <div class="author-block">
            <div class="author-avatar"></div>
            <div class="author-info">
                <span class="author-name">ligichi</span>
                <span class="post-meta">{formatDate(data.meta.date)} &middot; 5 min read</span>
            </div>
        </div>
    </header>

    {#if data.meta.image}
        <figure class="hero-image">
            <img src={data.meta.image} alt={data.meta.title} class="image-placeholder" />
            <figcaption>Illustration or preview related to {data.meta.title}</figcaption>
        </figure>
    {:else}
        <figure class="hero-image">
            <div class="image-placeholder" aria-hidden="true"></div>
            <figcaption>Illustration or preview related to {data.meta.title}</figcaption>
        </figure>
    {/if}

    <div class="post-body prose">
        <data.content />
    </div>
</article>

<style>
    .post-page {
        width: min(80rem, 100%);
        margin-inline: auto;
        padding-top: 2rem;
        padding-bottom: 4rem;
    }

    /* Hero Section */
    .editorial-hero {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        margin-bottom: 3rem;
    }

    .tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        justify-content: center;
        margin-bottom: 1.5rem;
    }

    .tag {
        font-size: 0.65rem;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        padding: 0.3rem 0.8rem;
        border-radius: 999px;
        background: color-mix(in oklab, var(--surface-2), transparent 40%);
        border: 1px solid color-mix(in oklab, var(--border), transparent 60%);
        color: var(--text-2);
    }

    h1 {
        font-size: clamp(2rem, 5vw, 3.5rem);
        line-height: 1.15;
        color: var(--text-1);
        font-weight: 500;
        max-width: 80ch;
        text-transform: capitalize;
        margin-bottom: 1rem;
        letter-spacing: -0.01em;
    }

    .post-description {
        color: var(--text-2);
        font-size: clamp(1rem, 2vw, 1.1rem);
        line-height: 1.6;
        max-width: 80ch;
        margin-bottom: 2.5rem;
    }

    /* Author Block */
    .author-block {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .author-avatar {
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        background: var(--brand);
        background-image: linear-gradient(135deg, color-mix(in oklab, var(--brand), transparent 20%), var(--surface-1));
    }

    .author-info {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    .author-name {
        font-weight: 600;
        color: var(--text-1);
        font-size: 0.95rem;
    }

    .post-meta {
        color: var(--text-2);
        font-size: 0.8rem;
    }

    /* Hero Image */
    .hero-image {
        width: 100%;
        margin-bottom: 4rem;
    }

    .hero-image .image-placeholder {
        width: 100%;
        aspect-ratio: 16/9;
        background: color-mix(in oklab, var(--surface-2), var(--surface-1) 50%);
        border-radius: 0.75rem;
        object-fit: cover;
    }

    .hero-image figcaption {
        text-align: center;
        font-size: 0.8rem;
        color: var(--text-2);
        margin-top: 1rem;
        font-style: italic;
    }

    /* Prose modifications for editorial feel */
    .post-body {
        max-width: 100%;
        margin-inline: auto;
        font-size: 1.1rem;
        line-height: 1.7;
        color: var(--text-1);
    }

    /* Hide the first picture/image in the prose since it's already shown as the hero */
    .post-body > :global(picture:first-of-type),
    .post-body > :global(img:first-of-type),
    .post-body > :global(p:first-of-type:has(img)),
    .post-body > :global(p:first-of-type:has(picture)) {
        display: none;
    }

    @media (max-width: 640px) {
        .post-page {
            padding-top: 1rem;
        }
    }
</style>
