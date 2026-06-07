export type Categoris = "sveltekit" | "svelte";
export type Visibility = "public" | "private";

export interface Post {
  title: string;
  slug: string;
  description: string;
  date: string;
  categoris: Array<Categoris>;
  published: boolean;
  visibility?: Visibility;
  password?: string;
  image?: string;
}
