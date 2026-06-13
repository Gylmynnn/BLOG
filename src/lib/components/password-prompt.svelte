<script lang="ts">
    import type { Snippet } from "svelte";
    interface Props {
        requiredPassword: string;
        onUnlock?: (isCorrect: boolean) => void;
        children?: Snippet;
    }


    let { requiredPassword, onUnlock, children }: Props = $props();

    let password = $state<string>("");
    let error = $state<string>("");
    let isUnlocked = $state<boolean>(false);
    let showPassword = $state<boolean>(false);

    function handleSubmit(event: SubmitEvent) {
        event.preventDefault();

        if (!password.trim()) return;

        if (password === requiredPassword) {
            isUnlocked = true;
            error = "";
            onUnlock?.(true);
        } else {
            error = "Incorrect password. Please try again.";
            password = "";
            onUnlock?.(false);
        }
    }
</script>

{#if !isUnlocked}
    <section class="private-page">
        <div class="private-card">
            <div class="header">
                <span class="label">Protected Content</span>

                <h1>Private Post</h1>

                <p>This post is password protected. Enter the correct password to continue reading.</p>
            </div>

            <form class="form" onsubmit={handleSubmit}>
                <div class="field">
                    <label for="password">Password</label>

                    <div class="input-wrapper">
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            bind:value={password}
                            placeholder="Enter password"
                            autocomplete="current-password"
                            aria-invalid={error ? "true" : "false"}
                            aria-describedby={error ? "password-error" : undefined}
                        />

                        <button
                            type="button"
                            class="toggle-password"
                            onclick={() => (showPassword = !showPassword)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {#if showPassword}
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M3 3l18 18M10.6 10.6A2 2 0 0 0 13.4 13.4M9.9 4.2A10.7 10.7 0 0 1 12 4c7 0 10 8 10 8a13.4 13.4 0 0 1-3.1 4.5M6.1 6.1C3.4 7.9 2 12 2 12s3 8 10 8c1.8 0 3.3-.4 4.6-1"
                                    />
                                </svg>
                            {:else}
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M2 12s3-8 10-8 10 8 10 8-3 8-10 8S2 12 2 12Z"
                                    />
                                    <circle cx="12" cy="12" r="3" stroke-width="2" />
                                </svg>
                            {/if}
                        </button>
                    </div>
                </div>

                {#if error}
                    <p id="password-error" class="error-message">
                        {error}
                    </p>
                {/if}

                <button type="submit" class="unlock-button" disabled={!password.trim()}> Unlock Post </button>
            </form>

            <p class="footer-text">Access is restricted to users with the correct password.</p>
        </div>
    </section>
{:else}
    {@render children?.()}
{/if}

<style>
    .private-page {
        min-height: 70dvh;
        display: grid;
        place-items: center;
        padding: 1.25rem;
        color: var(--text-1);
    }

    .label {
        display: inline-flex;
        margin-bottom: 0.75rem;
        color: var(--brand);
        font-size: 0.75rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
    }

    h1 {
        margin: 0;
        color: var(--text-1);
        font-size: clamp(1.75rem, 5vw, 2.4rem);
        line-height: 1.1;
        letter-spacing: -0.04em;
    }

    p {
        margin: 0;
    }

    .header p {
        margin-top: 0.75rem;
        color: var(--text-2);
        font-size: 0.95rem;
        line-height: 1.7;
    }

    .form {
        margin-top: 1.75rem;
        display: grid;
        gap: 1rem;
    }

    .field {
        display: grid;
        gap: 0.5rem;
    }

    label {
        color: var(--text-1);
        font-size: 0.875rem;
        font-weight: 700;
    }

    .input-wrapper {
        position: relative;
    }

    input {
        width: 100%;
        height: 3.15rem;
        padding: 0 3.25rem 0 1rem;
        border-radius: 1rem;
        border: 1px solid var(--border);
        outline: none;
        color: var(--text-1);
        background: var(--surface-1);
        font: inherit;
        transition:
            border-color 160ms ease,
            box-shadow 160ms ease,
            background-color 160ms ease;
    }

    input::placeholder {
        color: color-mix(in srgb, var(--text-2) 70%, transparent);
    }

    input:focus {
        border-color: var(--brand);
        box-shadow: 0 0 0 4px color-mix(in srgb, var(--brand) 18%, transparent);
    }

    input[aria-invalid="true"] {
        border-color: var(--brand);
    }

    .toggle-password {
        position: absolute;
        top: 50%;
        right: 0.8rem;
        width: 2rem;
        height: 2rem;
        display: grid;
        place-items: center;
        transform: translateY(-50%);
        border: 0;
        border-radius: 999px;
        color: var(--text-2);
        background: transparent;
        cursor: pointer;
        transition:
            color 160ms ease,
            background-color 160ms ease;
    }

    .toggle-password:hover {
        color: var(--brand);
        background: color-mix(in srgb, var(--brand) 12%, transparent);
    }

    .toggle-password svg {
        width: 1.15rem;
        height: 1.15rem;
    }

    .error-message {
        padding: 0.85rem 1rem;
        border-radius: 1rem;
        border: 1px solid color-mix(in srgb, var(--brand) 35%, transparent);
        color: var(--brand);
        background: color-mix(in srgb, var(--brand) 10%, transparent);
        font-size: 0.875rem;
        line-height: 1.5;
    }

    .unlock-button {
        height: 3.15rem;
        border: 0;
        border-radius: 1rem;
        color: #141b1e;
        background: var(--brand);
        font: inherit;
        font-weight: 800;
        cursor: pointer;
        transition:
            transform 160ms ease,
            opacity 160ms ease,
            box-shadow 160ms ease;
        box-shadow: 0 16px 34px color-mix(in srgb, var(--brand) 28%, transparent);
    }

    .unlock-button:hover:not(:disabled) {
        transform: translateY(-2px);
    }

    .unlock-button:active:not(:disabled) {
        transform: translateY(0);
    }

    .unlock-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        box-shadow: none;
    }

    .footer-text {
        margin-top: 1.25rem;
        color: var(--text-2);
        text-align: center;
        font-size: 0.78rem;
        line-height: 1.6;
    }

    @media (max-width: 480px) {
        .private-page {
            min-height: 100dvh;
            padding: 1rem;
        }

        .private-card {
            padding: 1.35rem;
            border-radius: 1.25rem;
        }

        .form {
            margin-top: 1.4rem;
        }

        input,
        .unlock-button {
            height: 3rem;
        }
    }
</style>
