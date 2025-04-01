# Project TODOs

## Styling Conventions

- Investigate using CSS Modules as an alternative to the current pure utility-first Tailwind approach.
  - **Context:** Explore options for better separation of concerns between component structure (JSX) and styling rules, potentially making it easier to trace styles and data flow compared to long utility class strings.
  - **Approach:** Create `.module.css` files alongside components, define locally scoped classes (potentially using Tailwind's `@apply` for base styles), and import/use these classes in the component JSX.
  - **Decision:** Evaluate if the benefits of separation outweigh the drawbacks (managing extra files, potential bundle size increase with `@apply`, loss of immediate style visibility in JSX).