# Sanity Schema Update: Add Resume File Upload

Please update the Sanity schema to include a field for uploading the resume file, preferably within a "Site Settings" singleton document.

## Required Changes

1.  **Ensure a "Site Settings" Singleton Document Exists:**
    *   If you don't have a singleton document for general site settings, create one. This is useful for managing global content like social links, contact info, and potentially the resume.
    *   Example Singleton Structure (in `sanity.config.ts` or similar):
        ```javascript
        // ... other imports
        import { CogIcon } from '@sanity/icons';

        export default defineConfig({
          // ... other config
          plugins: [
            deskTool({
              structure: (S) =>
                S.list()
                  .title('Content')
                  .items([
                    S.listItem()
                      .title('Site Settings')
                      .icon(CogIcon)
                      .child(
                        S.document()
                          .schemaType('siteSettings')
                          .documentId('siteSettings') // Fixed document ID for singleton
                      ),
                    S.divider(),
                    // ... other list items like posts, projects etc.
                    ...S.documentTypeListItems().filter(
                      listItem => !['siteSettings'].includes(listItem.getId())
                    )
                  ]),
            }),
            // ... other plugins
          ],
          schema: {
            types: [
              // ... other schemas
              {
                name: 'siteSettings',
                title: 'Site Settings',
                type: 'document',
                icon: CogIcon,
                // Prevent users from creating new Site Settings documents
                __experimental_actions: [/*'create',*/ 'update', /*'delete',*/ 'publish'],
                fields: [
                  {
                    name: 'title', // Example field
                    title: 'Site Title',
                    type: 'string',
                  },
                  // Add the resume field here (see step 2)
                ],
              },
            ],
          },
        })
        ```

2.  **Add a `file` field to the `siteSettings` schema:**
    *   **Name:** `resumeFile`
    *   **Title:** `Resume File`
    *   **Description:** "Upload the latest resume file (PDF recommended)."
    *   **Type:** `file`
    *   **Options:**
        *   `accept`: `.pdf` (Recommended to restrict to PDF)

## Example Implementation (within the `siteSettings` schema definition):

```javascript
// Inside schemas/singletons/siteSettings.ts or similar

export default {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  // ... other settings like icon, actions
  fields: [
    // ... other settings fields (e.g., site title, social links)
    {
      name: 'resumeFile',
      title: 'Resume File',
      description: 'Upload the latest resume file (PDF recommended).',
      type: 'file',
      options: {
        accept: '.pdf', // Only allow PDF uploads
      },
      validation: Rule => Rule.required(), // Make it required if desired
    },
    // ... other settings fields
  ],
};
```

## Usage Notes

*   After updating the schema, deploy the changes to your Sanity Studio.
*   Navigate to "Site Settings" in the Studio and upload the resume PDF to the new "Resume File" field.
*   Publish the changes.
*   The frontend code will query this `siteSettings` document to get the URL of the uploaded `resumeFile`.