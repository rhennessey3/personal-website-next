# Sanity CMS Schema (Based on Supabase SQL)

This document outlines the proposed Sanity CMS schema structure derived from the `supabase/init.sql` file.

**Note:** This is a structural representation in Markdown. The actual implementation would involve creating JavaScript/TypeScript files defining these schemas using Sanity's schema definition syntax. Timestamps (`_createdAt`, `_updatedAt`) and unique IDs (`_id`) are automatically handled by Sanity. References link documents together.

---

## Document Types

### 1. Profile (`profile`)

Represents the main user profile information.

```js
{
  name: 'profile',
  title: 'Profile',
  type: 'document',
  fields: [
    { name: 'firstName', title: 'First Name', type: 'string', validation: Rule => Rule.required() },
    { name: 'lastName', title: 'Last Name', type: 'string', validation: Rule => Rule.required() },
    { name: 'title', title: 'Title', type: 'string', validation: Rule => Rule.required() },
    { name: 'bio', title: 'Bio', type: 'text', validation: Rule => Rule.required() },
    { name: 'profileImage', title: 'Profile Image', type: 'image', options: { hotspot: true } },
    { name: 'contactEmail', title: 'Contact Email', type: 'string', validation: Rule => Rule.required().email() },
    // References to other documents linked to this profile
    { name: 'workExperiences', title: 'Work Experiences', type: 'array', of: [{ type: 'reference', to: { type: 'workExperience' } }] },
    { name: 'educationHistory', title: 'Education History', type: 'array', of: [{ type: 'reference', to: { type: 'education' } }] },
    { name: 'skills', title: 'Skills', type: 'array', of: [{ type: 'reference', to: { type: 'skill' } }] },
  ]
}
```

### 2. Work Experience (`workExperience`)

Represents individual work experiences, linked to a profile.

```js
{
  name: 'workExperience',
  title: 'Work Experience',
  type: 'document',
  fields: [
    { name: 'profile', title: 'Profile', type: 'reference', to: { type: 'profile' }, validation: Rule => Rule.required() },
    { name: 'company', title: 'Company', type: 'string', validation: Rule => Rule.required() },
    { name: 'position', title: 'Position', type: 'string', validation: Rule => Rule.required() },
    { name: 'location', title: 'Location', type: 'string', validation: Rule => Rule.required() },
    { name: 'startDate', title: 'Start Date', type: 'datetime', validation: Rule => Rule.required() },
    { name: 'endDate', title: 'End Date', type: 'datetime' }, // Optional
    { name: 'description', title: 'Description', type: 'text', validation: Rule => Rule.required() },
    { name: 'keyAchievements', title: 'Key Achievements', type: 'array', of: [{ type: 'string' }], validation: Rule => Rule.required() },
  ]
}
```

### 3. Education (`education`)

Represents educational background, linked to a profile.

```js
{
  name: 'education',
  title: 'Education',
  type: 'document',
  fields: [
    { name: 'profile', title: 'Profile', type: 'reference', to: { type: 'profile' }, validation: Rule => Rule.required() },
    { name: 'institution', title: 'Institution', type: 'string', validation: Rule => Rule.required() },
    { name: 'degree', title: 'Degree', type: 'string', validation: Rule => Rule.required() },
    { name: 'startDate', title: 'Start Date', type: 'datetime', validation: Rule => Rule.required() },
    { name: 'endDate', title: 'End Date', type: 'datetime' }, // Optional
    { name: 'description', title: 'Description', type: 'text' }, // Optional
  ]
}
```

### 4. Skill (`skill`)

Represents individual skills, linked to a profile.

```js
{
  name: 'skill',
  title: 'Skill',
  type: 'document',
  fields: [
    { name: 'profile', title: 'Profile', type: 'reference', to: { type: 'profile' }, validation: Rule => Rule.required() },
    { name: 'category', title: 'Category', type: 'string', validation: Rule => Rule.required() }, // Consider making this a reference to a 'skillCategory' document or a list
    { name: 'name', title: 'Name', type: 'string', validation: Rule => Rule.required() },
    { name: 'proficiency', title: 'Proficiency (1-5)', type: 'number', validation: Rule => Rule.required().min(1).max(5).integer() },
  ]
}
```

### 5. Case Study (`caseStudy`)

Represents a project case study.

```js
{
  name: 'caseStudy',
  title: 'Case Study',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string', validation: Rule => Rule.required() },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title', maxLength: 100 }, validation: Rule => Rule.required() },
    { name: 'summary', title: 'Summary', type: 'text', validation: Rule => Rule.required() },
    { name: 'featuredImage', title: 'Featured Image', type: 'image', options: { hotspot: true } },
    { name: 'published', title: 'Published', type: 'boolean', initialValue: false },
    { name: 'publishedDate', title: 'Published Date', type: 'datetime' }, // Optional
    { name: 'sections', title: 'Sections', type: 'array', of: [{ type: 'caseStudySection' }] }, // Array of objects
    { name: 'metrics', title: 'Metrics', type: 'array', of: [{ type: 'caseStudyMetric' }] }, // Array of objects
    { name: 'tags', title: 'Tags', type: 'array', of: [{ type: 'reference', to: { type: 'tag' } }] },
  ]
}
```

### 6. Blog Post (`blogPost`)

Represents a blog article.

```js
{
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string', validation: Rule => Rule.required() },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title', maxLength: 100 }, validation: Rule => Rule.required() },
    { name: 'summary', title: 'Summary', type: 'text', validation: Rule => Rule.required() },
    { name: 'content', title: 'Content', type: 'blockContent', validation: Rule => Rule.required() }, // Rich text
    { name: 'featuredImage', title: 'Featured Image', type: 'image', options: { hotspot: true } },
    { name: 'published', title: 'Published', type: 'boolean', initialValue: false },
    { name: 'publishedDate', title: 'Published Date', type: 'datetime' }, // Optional
    { name: 'tags', title: 'Tags', type: 'array', of: [{ type: 'reference', to: { type: 'tag' } }] },
  ]
}
```

### 7. Tag (`tag`)

Represents a tag that can be applied to Case Studies or Blog Posts.

```js
{
  name: 'tag',
  title: 'Tag',
  type: 'document',
  fields: [
    { name: 'name', title: 'Name', type: 'string', validation: Rule => Rule.required() },
    // Consider adding a slug field if needed for URLs
    // { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name', maxLength: 50 }, validation: Rule => Rule.required() },
  ]
}
```

### 8. Contact Submission (`contactSubmission`)

Represents a submission from the contact form.

```js
{
  name: 'contactSubmission',
  title: 'Contact Submission',
  type: 'document',
  fields: [
    { name: 'name', title: 'Name', type: 'string', validation: Rule => Rule.required(), readOnly: true },
    { name: 'email', title: 'Email', type: 'string', validation: Rule => Rule.required().email(), readOnly: true },
    { name: 'message', title: 'Message', type: 'text', validation: Rule => Rule.required(), readOnly: true },
    { name: 'read', title: 'Read', type: 'boolean', initialValue: false },
  ],
  // Optional: Customize the preview
  preview: {
    select: {
      title: 'name',
      subtitle: 'email',
      read: 'read'
    },
    prepare({ title, subtitle, read }) {
      return {
        title: title,
        subtitle: subtitle,
        media: read ? /* Icon for read */ : /* Icon for unread */
      }
    }
  }
}
```

---

## Object Types

These are used within arrays in the document types above.

### 1. Case Study Section (`caseStudySection`)

An object type for defining sections within a Case Study.

```js
{
  name: 'caseStudySection',
  title: 'Case Study Section',
  type: 'object',
  fields: [
    { name: 'title', title: 'Title', type: 'string', validation: Rule => Rule.required() },
    { name: 'sectionType', title: 'Section Type', type: 'string', options: { list: ['Introduction', 'Challenge', 'Solution', 'Result', 'Custom'] }, validation: Rule => Rule.required() }, // Example types
    { name: 'content', title: 'Content', type: 'blockContent', validation: Rule => Rule.required() }, // Rich text
  ]
}
```

### 2. Case Study Metric (`caseStudyMetric`)

An object type for defining key metrics for a Case Study.

```js
{
  name: 'caseStudyMetric',
  title: 'Case Study Metric',
  type: 'object',
  fields: [
    { name: 'label', title: 'Label', type: 'string', validation: Rule => Rule.required() }, // e.g., "Conversion Rate Increase"
    { name: 'value', title: 'Value', type: 'string', validation: Rule => Rule.required() }, // e.g., "25%"
  ]
}
```

### 3. Block Content (`blockContent`)

A standard Sanity object type for rich text editing. Needs to be defined once globally.

```js
{
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',
  of: [
    {
      title: 'Block',
      type: 'block',
      // Styles, lists, marks, decorators as needed
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'H1', value: 'h1'},
        {title: 'H2', value: 'h2'},
        {title: 'H3', value: 'h3'},
        {title: 'Quote', value: 'blockquote'},
      ],
      lists: [{title: 'Bullet', value: 'bullet'}],
      marks: {
        decorators: [{title: 'Strong', value: 'strong'}, {title: 'Emphasis', value: 'em'}],
        annotations: [
          {
            title: 'URL',
            name: 'link',
            type: 'object',
            fields: [
              {
                title: 'URL',
                name: 'href',
                type: 'url',
              },
            ],
          },
        ],
      },
    },
    // Allow images directly in rich text
    {
      type: 'image',
      options: {hotspot: true},
    },
    // Allow code blocks if needed
    // {
    //   type: 'code'
    // }
  ],
}

```

---