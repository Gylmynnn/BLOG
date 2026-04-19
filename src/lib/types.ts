export type Categoris = "sveltekit" | "svelte";

export interface Post {
  title: string;
  slug: string;
  description: string;
  date: string;
  categoris: Array<Categoris>;
  published: boolean;
  image?: string;
}
