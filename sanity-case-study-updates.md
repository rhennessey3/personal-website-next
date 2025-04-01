# Sanity Schema Updates for Case Study Page

Based on frontend changes in `src/app/case-studies/[slug]/page.tsx`, the following updates are needed for the `caseStudy` document type in your Sanity schema:

1.  **Add `subtitle` field:**
    *   **Purpose:** To display a shorter descriptive text below the title in the header overlay, replacing the longer `summary`.
    *   **Field Definition (Example):**
        ```javascript
        {
          name: 'subtitle',
          title: 'Subtitle',
          type: 'string',
          description: 'A short, descriptive subtitle displayed below the title in the header.',
          // Add validation if needed, e.g., validation: Rule => Rule.max(150)
        }
        ```
    *   **Action:** Add this field definition to the `fields` array within your `caseStudy` schema definition file.

2.  **Update `sections` array items:**
    *   **Purpose:** To allow an optional image alongside text content for each section and control the layout (image left/right).
    *   **Action:** Modify the schema definition for the object type used within the `sections` array. Add the following fields to that object type's `fields` array:
    *   **Field Definition (Image):**
        ```javascript
        {
          name: 'image',
          title: 'Section Image',
          type: 'image',
          description: 'Optional image to display alongside the text content for this section.',
          options: {
            hotspot: true // Recommended for images
          }
        }
        ```
    *   **Field Definition (Layout):**
        ```javascript
        {
          name: 'layout',
          title: 'Image Layout',
          type: 'string',
          description: 'Choose the position of the image relative to the text (only applies if an image is added).',
          options: {
            list: [
              { title: 'Text Left / Image Right', value: 'textLeft' },
              { title: 'Image Left / Text Right', value: 'imageLeft' }
            ],
            layout: 'radio', // or 'dropdown'
          },
          // Optionally hide this field if no image is present using 'hidden' callback
          // hidden: ({ parent }) => !parent?.image
        }
        ```

*(Note: The `category` field was previously considered but then removed from the frontend, so no schema change is needed for it.)*