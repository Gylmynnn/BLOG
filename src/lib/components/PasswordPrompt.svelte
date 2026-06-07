<script lang="ts">
    import type { Snippet } from "svelte";

    interface Props {
        requiredPassword: string;
        onUnlock?: (isCorrect: boolean) => void;
        children?: Snippet;
    }

    let { requiredPassword, onUnlock , children }: Props = $props();

    let password = $state("");
    let error = $state("");
    let isUnlocked = $state(false);

    function handleSubmit() {
        if (password === requiredPassword) {
            isUnlocked = true;
            error = "";
            onUnlock?.(true);
        } else {
            error = "Password salah!";
            password = "";
            onUnlock?.(false);
        }
    }

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === "Enter") {
            handleSubmit();
        }
    }
</script>

{#if !isUnlocked}
    <div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <div class="w-full max-w-md">
            <div class="bg-white rounded-lg shadow-xl p-8">
                <div class="mb-6 text-center">
                    <div class="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                        <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                        </svg>
                    </div>
                    <h1 class="text-2xl font-bold text-gray-900">Post Private</h1>
                    <p class="text-gray-600 mt-2">Post ini dilindungi dengan password</p>
                </div>

                <form onsubmit={handleSubmit} class="space-y-4">
                    <div>
                        <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                            Masukkan Password:
                        </label>
                        <input
                            id="password"
                            type="password"
                            bind:value={password}
                            onkeydown={handleKeydown}
                            placeholder="Masukkan password..."
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        />
                    </div>

                    {#if error}
                        <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    {/if}

                    <button
                        type="submit"
                        disabled={!password.trim()}
                        class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition"
                    >
                        Buka Post
                    </button>
                </form>

                <p class="text-center text-gray-500 text-xs mt-6">
                    Post ini adalah konten eksklusif yang memerlukan password untuk diakses.
                </p>
            </div>
        </div>
    </div>
{:else}
    {@render children?.()}
{/if}
