# Project TODOs

## Styling Conventions

- Investigate using CSS Modules as an alternative to the current pure utility-first Tailwind approach.
  - **Context:** Explore options for better separation of concerns between component structure (JSX) and styling rules, potentially making it easier to trace styles and data flow compared to long utility class strings.
  - **Approach:** Create `.module.css` files alongside components, define locally scoped classes (potentially using Tailwind's `@apply` for base styles), and import/use these classes in the component JSX.
  - **Decision:** Evaluate if the benefits of separation outweigh the drawbacks (managing extra files, potential bundle size increase with `@apply`, loss of immediate style visibility in JSX).

## Features

- Implement a contact form modal triggered by the email icon in the sidebar.
  - **Components:** Create a Contact Form component (Name, Email, Message) and wrap it in a Modal/Dialog (e.g., Shadcn UI Dialog).
  - **State:** Decide on state management for modal visibility (Layout, Context, or Sidebar state).
  - **Trigger:** Modify the email icon click handler in the sidebar to open the modal.
  - **Submission:** Determine submission method (API Route, Server Action, Third-Party Service) and implement email sending logic or integration.

- Implement gated content for Case Studies using Clerk and Sanity.
 - **Goal:** Allow select users (authenticated via Clerk) to view full case studies while keeping the current preview public. Continue using Sanity as the CMS.
 - **Sanity Strategy (Choose one):**
   - Option A: Add a new `gatedContent` field (Portable Text or array of section objects) to the `caseStudy` schema.
   - Option B: Add an `isGated: boolean` flag to the existing `sections` schema array items.
 - **Clerk Integration:**
   - Install/configure `@clerk/nextjs`.
   - Add `<ClerkProvider>` to `src/app/layout.tsx`.
   - Use `auth()` helper in `src/app/case-studies/[slug]/page.tsx` to get user status.
 - **Frontend Logic (`src/app/case-studies/[slug]/page.tsx`):**
   - Fetch both public and gated content data.
   - Use `auth()` result (`userId`) to conditionally render:
     - Logged-out: Public preview + Sign-in prompt/button.
     - Logged-in: Full case study content (based on chosen Sanity strategy).