# Academic Portfolio Website

A clean, professional academic portfolio website template based on Jon Barron's design, rebranded for PhD applications in Robotics/AI/Vision.

## Features

- **Clean Academic Design**: Professional typography with Inter font and academic color palette
- **Research Projects**: Showcase your research with images, videos, and descriptions
- **Publications**: Academic CV-style publications section
- **Teaching**: Highlight your teaching experience and resources
- **Notes/Blog**: Placeholder for research notes and blog posts
- **Responsive**: Works on desktop and mobile devices
- **Accessible**: Good contrast ratios and keyboard navigation

## Personalization Guide

### 1. Basic Information

Update the following in `index.html`:

**Header Section (lines 30-44):**
- Name: Update `Sacchin Sundar` to your name
- Bio: Replace the bio paragraph with your research focus
- Contact links: Update email, CV, Scholar, LinkedIn, GitHub links

**Metadata (lines 6-16):**
- Title: Update page title
- Description: Update meta description
- OpenGraph tags: Update for social media sharing

### 2. Profile Image

Replace `images/SacchinSundar.jpg` with your headshot:
- Recommended size: 400x400px or square aspect ratio
- Format: JPG or PNG
- Professional headshot preferred

### 3. Research Projects

Update the research projects in the Research section (starting around line 64):

**For each project, update:**
- Project title and description
- Author list (highlight your name in `<strong>` tags)
- Publication venue and year
- Project page and paper links
- Images/videos in the `images/` folder
- JavaScript function names (e.g., `neural_bathymetry_start()`)

**Current projects (replace with yours):**
1. Neural Bathymetry: Differentiable Sonar Rendering
2. Underwater SLAM with Dense Correspondence
3. D-HAZ3R: Underwater Dehazing with Vision Transformers

### 4. Publications

The Publications section (formerly Miscellanea) is ready for your academic publications. Add your papers in the same format as the research projects.

### 5. Teaching

Update the Teaching section with your actual teaching experience:
- Course names and semesters
- Links to course pages
- Teaching resources

### 6. Notes/Blog

The Notes section is set up for your research notes and blog posts. Update the links to point to your actual content.

### 7. CV

Place your CV as `data/SacchinSundar-CV.pdf` and update the link in the header.

### 8. Images and Media

Add your project images and videos to the `images/` folder:
- Use descriptive filenames
- Optimize images for web (WebP recommended)
- Keep videos under 10MB for good loading performance

## File Structure

```
website/
├── index.html              # Main website file
├── stylesheet.css          # Styling and fonts
├── images/                 # All images and videos
│   ├── SacchinSundar.jpg   # Your headshot
│   ├── neural_bathymetry.jpg
│   ├── neural_bathymetry.mp4
│   └── ...                 # Other project media
├── data/                   # PDFs and data files
│   └── SacchinSundar-CV.pdf
└── README.md              # This file
```

## Customization

### Colors

Update colors in `stylesheet.css`:
- Primary link color: `#1e3a8a` (line 67)
- Hover color: `#3b82f6` (line 73)
- Highlight background: `#dbeafe` (line 134)

### Fonts

The site uses Inter as the primary font with Lato as fallback. To change fonts:
1. Update the Google Fonts import in `stylesheet.css` (line 2)
2. Update all `font-family` declarations to use your preferred font

### Layout

The site uses a table-based layout for maximum compatibility. Key sections:
- Header: Name, bio, contact links
- Research: Project showcase
- Publications: Academic papers
- Teaching: Teaching experience
- Notes: Blog/research notes

## Deployment

### GitHub Pages

1. Push your repository to GitHub
2. Go to Settings > Pages
3. Select source branch (usually `main` or `master`)
4. Your site will be available at `https://username.github.io/repository-name`

### Custom Domain

1. Add a `CNAME` file with your domain name
2. Update DNS settings to point to GitHub Pages
3. Update the `og:url` meta tag in `index.html`

## TODO List for Personalization

- [ ] Replace `SacchinSundar.jpg` with your headshot
- [ ] Update `SacchinSundar-CV.pdf` with your actual CV
- [ ] Replace research projects with your actual projects
- [ ] Add your publications to the Publications section
- [ ] Update teaching experience
- [ ] Create actual blog posts and update Notes section
- [ ] Add project images and videos
- [ ] Update all placeholder links
- [ ] Test on different devices and browsers
- [ ] Optimize images for web performance

## Technical Notes

- **No JavaScript framework**: Pure HTML/CSS for maximum compatibility
- **Responsive design**: Uses CSS media queries and flexible layouts
- **Accessibility**: Good contrast ratios and semantic HTML
- **Performance**: Optimized font loading and image handling
- **SEO**: Proper meta tags and structured data

## Credits

- Original design: [Jon Barron's academic website](https://github.com/jonbarron/jonbarron_website)
- Font: [Inter](https://fonts.google.com/specimen/Inter) by Rasmus Andersson
- Color palette: Academic blue theme

## License

Feel free to use this template for your own academic portfolio. Please maintain attribution to the original design.