1. **Remove Nested Boxes & Excess Padding**: The current `+layout.svelte` has a `.root-layout-container` which adds an unnecessary border and padding that stacks with the padding inside `+page.svelte`. Removing this inner box makes the layout "breathable" and modern.
2. **Clean up Layout Shell**: Keep the beautiful glows, but simplify `+layout.svelte` to just serve as a flexible wrapper.
3. **Refine Home Page (`+page.svelte`)**: Make the blog cards cleaner. Instead of heavy borders and multiple gradients, give them subtle hovers that align with the color scheme. Adjust padding to remove the double-whitespace issue.
4. **Refine Article Page (`[slug]/+page.svelte`)**: The `.post-hero` has another heavy box/border. Remove the box around the header and just let the title breathe cleanly at the top of the post, integrating the tags and date natively.
5. **Responsive Fixes**: Keep the navigation logic intact but ensure mobile view spacing is flush and tight.
