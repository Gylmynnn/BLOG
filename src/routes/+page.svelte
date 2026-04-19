<script lang="ts">
    import { formatDate } from "$lib/utils";
    import * as config from "$lib/config";
    import type { PageProps } from "./$types";
    let { data }: PageProps = $props();

    let featuredPosts = $derived(data.posts.slice(0, 2));
    let regularPosts = $derived(data.posts.slice(2));
</script>

<svelte:head>
    <title>{config.title}</title>
    <meta name="description" content={config.description} />
</svelte:head>

<section class="posts-page">
    <header class="editorial-header">
        <div class="header-main">
            <p class="eyebrow">Archive / Journal</p>
            <h1>Code & <br /> <em>Development</em></h1>
        </div>
        <div class="header-meta">
            <p class="subtitle">
                Exploring the intersection of clean architecture and practical web engineering in modern applications.
            </p>
            <p class="article-count">SHOWING 1-{data.posts.length} OF {data.posts.length} ARTICLES</p>
        </div>
    </header>

    {#if featuredPosts.length > 0}
        <div class="featured-section">
            {#each featuredPosts as post, i}
                <article class="post-card {i === 0 ? 'is-featured' : 'is-secondary'}">
                    <a href={post.slug} class="image-link" aria-label="Read {post.title}">
                        {#if post.image}
                            <img src={post.image} alt={post.title} class="image-placeholder" />
                        {:else}
                            <div class="image-placeholder" aria-hidden="true"></div>
                        {/if}
                    </a>
                    <div class="card-content">
                        <div class="card-meta">
                            {#if i === 0}
                                <span class="badge">Featured</span>
                            {/if}
                            <p class="post-date">{formatDate(post.date)}</p>
                        </div>
                        <a href={post.slug} class="post-title">{post.title}</a>
                        <p class="post-description">{post.description}</p>
                        {#if i === 0}
                            <a class="read-story" href={post.slug}>Read Story &rarr;</a>
                        {:else}
                            <a class="read-story" href={post.slug}>Explore</a>
                        {/if}
                    </div>
                </article>
            {/each}
        </div>
    {/if}

    {#if regularPosts.length > 0}
        <hr class="section-divider" />

        <ul class="posts-grid">
            {#each regularPosts as post}
                <li>
                    <article class="post-card is-regular">
                        <a href={post.slug} class="image-link" aria-label="Read {post.title}">
                            {#if post.image}
                                <img src={post.image} alt={post.title} class="image-placeholder" />
                            {:else}
                                <div class="image-placeholder" aria-hidden="true"></div>
                            {/if}
                        </a>
                        <div class="card-content">
                            <p class="post-date">{formatDate(post.date)}</p>
                            <a href={post.slug} class="post-title">{post.title}</a>
                            <p class="post-description">{post.description}</p>
                        </div>
                    </article>
                </li>
            {/each}
        </ul>
    {/if}
</section>

<style>
    .posts-page {
        width: min(72rem, 100%);
        margin-inline: auto;
        padding-bottom: 4rem;
    }

    .editorial-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin-bottom: 3rem;
        padding-bottom: 2rem;
        border-bottom: 1px solid color-mix(in oklab, var(--border), transparent 60%);
        flex-wrap: wrap;
        gap: 2rem;
    }

    .eyebrow {
        font-size: 0.75rem;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--text-2);
        margin-bottom: 1rem;
        font-weight: 600;
    }

    h1 {
        font-size: clamp(2.5rem, 5vw, 4rem);
        line-height: 1.05;
        color: var(--text-1);
        font-weight: 400;
        letter-spacing: -0.02em;
    }

    h1 em {
        font-style: italic;
        color: var(--text-2);
    }

    .header-meta {
        max-width: 300px;
        text-align: right;
    }

    .subtitle {
        color: var(--text-2);
        line-height: 1.5;
        font-size: 0.9rem;
        margin-bottom: 1rem;
    }

    .article-count {
        font-size: 0.65rem;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--text-2);
        opacity: 0.7;
    }

    .featured-section {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 2rem;
        margin-bottom: 4rem;
    }

    .post-card {
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .image-link {
        display: block;
        overflow: hidden;
        border-radius: 0.5rem;
        margin-bottom: 1.25rem;
    }

    .image-placeholder {
        width: 100%;
        background: color-mix(in oklab, var(--surface-2), var(--surface-1) 50%);
        aspect-ratio: 16/9;
        transition: transform 0.4s ease;
        object-fit: cover;
    }

    .is-featured .image-placeholder {
        aspect-ratio: 16/10;
    }

    .is-secondary .image-placeholder {
        aspect-ratio: 4/3;
    }

    .is-regular .image-placeholder {
        aspect-ratio: 3/2;
    }

    .post-card:hover .image-placeholder {
        transform: scale(1.03);
    }

    /* Card Content */
    .card-meta {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 0.75rem;
    }

    .badge {
        font-size: 0.65rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        padding: 0.2rem 0.6rem;
        border-radius: 999px;
        background: color-mix(in oklab, var(--text-1), transparent 90%);
        color: var(--text-1);
        border: 1px solid color-mix(in oklab, var(--border), transparent 50%);
    }

    .post-date {
        color: var(--text-2);
        font-size: 0.75rem;
        letter-spacing: 0.05em;
        text-transform: uppercase;
    }

    .is-regular .post-date {
        margin-bottom: 0.5rem;
    }

    .post-title {
        font-size: clamp(1.2rem, 2vw, 1.5rem);
        line-height: 1.3;
        color: var(--text-1);
        font-weight: 500;
        margin-bottom: 0.75rem;
        display: block;
    }

    .is-featured .post-title {
        font-size: clamp(1.8rem, 3vw, 2.5rem);
        line-height: 1.2;
    }

    .post-description {
        color: var(--text-2);
        line-height: 1.6;
        font-size: 0.95rem;
        flex-grow: 1;
        margin-bottom: 1.5rem;
    }

    .read-story {
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--text-1);
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        transition: opacity 0.2s ease;
    }

    .read-story:hover {
        opacity: 0.7;
    }

    /* Grid Section (Regular posts) */
    .section-divider {
        border: none;
        border-top: 1px solid color-mix(in oklab, var(--border), transparent 60%);
        margin: 4rem 0;
    }

    .posts-grid {
        display: grid;
        gap: 2rem;
        grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
    }

    @media (max-width: 1024px) {
        .featured-section {
            grid-template-columns: 1fr;
        }
    }

    @media (max-width: 768px) {
        .editorial-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1.5rem;
        }

        .header-meta {
            text-align: left;
            max-width: 100%;
        }
    }

    @media (max-width: 640px) {
        .posts-page {
            padding-top: 0.5rem;
        }

        .is-featured .post-title {
            font-size: 1.8rem;
        }
    }
</style>
