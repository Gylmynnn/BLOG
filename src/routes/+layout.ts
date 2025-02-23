export const prerender = true;
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = ({ url }) => {
   return {
      url: url.pathname,
   };
};
