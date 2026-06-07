<script lang="ts">
    import { page } from "$app/state";
    interface ErrorMessageType {
        title: string;
        description: string;
    }
    type ErrorStatusNumber = 400 | 401 | 403 | 404 | 500;
    const errorMessages: Record<ErrorStatusNumber, ErrorMessageType> = {
        400: {
            title: "Bad Request",
            description: "The request could not be processed. Please check the URL and try again.",
        },
        401: {
            title: "Unauthorized",
            description: "You need to sign in before accessing this page.",
        },
        403: {
            title: "Access Denied",
            description: "You do not have permission to view this page.",
        },
        404: {
            title: "Page Not Found",
            description: "The page you are looking for does not exist or may have been moved.",
        },
        500: {
            title: "Something Went Wrong",
            description: "An unexpected error occurred on our side. Please try again later.",
        },
    };

    const getError = (status: number): ErrorMessageType => {
        return (
            errorMessages[status as ErrorStatusNumber] ?? {
                title: "Unexpected Error",
                description: "Something went wrong while loading this page.",
            }
        );
    };

    const error = getError(page.status);
</script>

<svelte:head>
    <title>{page.status} | Error</title>
</svelte:head>

<section class="error-page">
    <div class="error-card">
        <span class="error-label">Error</span>
        <h1>{page.status}</h1>
        <h2>{error.title}</h2>
        <p>
            {page.error?.message || error.description}
        </p>
        <div class="actions">
            <a href="/" class="primary-button"> Back to Home </a>
            <button onclick={() => history.back()} class="secondary-button"> Go Back </button>
        </div>
    </div>
</section>

<style>
    .error-page {
        min-height: 75vh;
        display: grid;
        place-items: center;
        padding: 2rem;
        color: var(--text-1);
        background: var(--background);
    }

    .error-card {
        width: min(100%, 520px);
        padding: 2.5rem;
        text-align: center;
        border: 1px solid var(--border);
        border-radius: 24px;
        background: linear-gradient(
            180deg,
            color-mix(in srgb, var(--surface-2) 88%, transparent),
            color-mix(in srgb, var(--surface-1) 96%, transparent)
        );
        box-shadow: 0 24px 80px rgb(0 0 0 / 0.18);
    }

    .error-label {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 1rem;
        padding: 0.35rem 0.75rem;
        border-radius: 999px;
        color: var(--brand);
        background: color-mix(in srgb, var(--brand) 14%, transparent);
        font-size: 0.8rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
    }

    h1 {
        margin: 0;
        color: var(--brand);
        font-size: clamp(4rem, 14vw, 8rem);
        line-height: 1;
        letter-spacing: -0.08em;
    }

    h2 {
        margin: 1rem 0 0.75rem;
        color: var(--text-1);
        font-size: clamp(1.5rem, 4vw, 2rem);
        line-height: 1.2;
    }

    p {
        margin: 0 auto;
        max-width: 38rem;
        color: var(--text-2);
        font-size: 1rem;
        line-height: 1.7;
    }

    .actions {
        display: flex;
        justify-content: center;
        gap: 0.75rem;
        margin-top: 2rem;
        flex-wrap: wrap;
    }

    .primary-button,
    .secondary-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 2.75rem;
        padding: 0 1.15rem;
        border-radius: 999px;
        font: inherit;
        font-weight: 700;
        text-decoration: none;
        cursor: pointer;
        transition:
            transform 160ms ease,
            border-color 160ms ease,
            background-color 160ms ease,
            color 160ms ease;
    }

    .primary-button {
        border: 1px solid var(--brand);
        color: var(--background);
        background: var(--brand);
    }

    .secondary-button {
        border: 1px solid var(--border);
        color: var(--text-1);
        background: var(--surface-2);
    }

    .primary-button:hover,
    .secondary-button:hover {
        transform: translateY(-2px);
    }

    .secondary-button:hover {
        border-color: var(--brand);
        color: var(--brand);
    }

    @media (max-width: 520px) {
        .error-card {
            padding: 2rem 1.25rem;
            border-radius: 18px;
        }

        .actions {
            flex-direction: column;
        }

        .primary-button,
        .secondary-button {
            width: 100%;
        }
    }
</style>
