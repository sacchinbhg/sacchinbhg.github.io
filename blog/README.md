# Blog Section

This directory contains individual blog post pages for your academic portfolio.

## 📁 Structure

```
blog/
├── template.html          # Template for new blog posts
├── README.md             # This file
└── [individual posts]    # Individual blog post HTML files
```

## ✍️ Creating New Blog Posts

### Using the Template

1. **Copy the template:**
   ```bash
   cp template.html your-post-slug.html
   ```

2. **Replace placeholders:**
   - `BLOG_POST_TITLE` → Your post title
   - `BLOG_POST_DESCRIPTION` → Meta description
   - `BLOG_POST_SLUG` → URL slug (filename without .html)
   - `BLOG_POST_DATE` → Publication date
   - `BLOG_POST_CONTENT_START` to `BLOG_POST_CONTENT_END` → Your content

3. **Update the main blog page:**
   - Add your new post to `../blog.html`
   - Include title, date, excerpt, and link

### Example Blog Post

```html
<!-- Replace this section in template.html -->
<h1>My New Research Insight</h1>
<p><em>December 2024</em></p>

<p>
  This is where I share my latest research findings and insights...
</p>

<h2>Key Findings</h2>
<p>
  The main results of my research...
</p>
```

## 🎨 Styling

The blog uses the same CSS as the main site. Key classes:

- `h1` - Main post title
- `h2` - Section headings  
- `h3` - Subsection headings
- `p` - Paragraphs
- `ul`, `ol` - Lists
- `em` - Italics for dates/emphasis
- `strong` - Bold text

## 🔗 Linking

- **Internal links:** Use relative paths like `../index.html`
- **External links:** Use full URLs
- **Images:** Store in `../images/` and use `../images/filename.jpg`

## 📝 Content Guidelines

- **Keep it academic:** Focus on research insights and technical content
- **Be personal:** Share your perspective and experiences
- **Include examples:** Use code snippets, figures, and real examples
- **Update regularly:** Aim for 1-2 posts per month
- **Cross-link:** Link between related posts and your research projects

## 🚀 Publishing

1. Create your blog post HTML file
2. Update `../blog.html` with the new post
3. Commit and push to GitHub
4. Your post will be live at `https://sacchinbhg.github.io/blog/your-post-slug.html`

Happy blogging! 📝
