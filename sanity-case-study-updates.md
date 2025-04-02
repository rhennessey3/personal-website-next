# Sanity Schema Updates for Case Study Sections

To support the new "Two Column Text" layout option in the frontend (`src/app/case-studies/[slug]/page.tsx`), the following changes are required in your Sanity schema definition for the `caseStudy` document type, specifically within the `sections` array field:

1.  **Modify the `layout` Field:**
    *   Locate the `layout` field within the `sections` array definition.
    *   Ensure the existing options (`'textLeft'`, `'imageLeft'`) are retained.
    *   Add a new option with the value `'twoColumnText'` to the list of allowed string values. This option represents the layout with two text columns and no image.

    *Example Schema Snippet (Conceptual):*
    ```javascript
    defineField({
      name: 'layout',
      title: 'Section Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Text Left / Image Right', value: 'textLeft' }, // Keep existing
          { title: 'Image Left / Text Right', value: 'imageLeft' }, // Keep existing
          { title: 'Two Column Text (No Image)', value: 'twoColumnText' } // Add this option
        ],
        // Consider making this conditional based on whether 'image' field has a value,
        // or rely on frontend logic (as currently implemented).
      },
      // ... other field properties
    }),
    ```

2.  **Add the `contentRight` Field:**
    *   Add a new field named `contentRight` to the `sections` array definition.
    *   This field should be of type `array` (Portable Text), similar to the existing `content` field.
    *   This field will hold the content for the right-hand text column when the `'twoColumnText'` layout is selected.

    *Example Schema Snippet (Conceptual):*
    ```javascript
    defineField({
      name: 'contentRight',
      title: 'Content (Right Column)',
      type: 'array', // Portable Text
      of: [{ type: 'block' /* ... other block types ... */ }],
      // Optionally, make this field conditional and only show it in the Studio
      // when layout === 'twoColumnText' using the 'hidden' property.
      // hidden: ({ parent }) => parent?.layout !== 'twoColumnText',
    }),
    ```

**Summary:**

These changes add the necessary structure in Sanity to allow content editors to choose the "Two Column Text" layout for a section and provide content for both the left (`content`) and right (`contentRight`) columns. The frontend component has already been updated to render this layout correctly.