# GitHub Pages Deployment Guide

## 🚀 Deploy Your Academic Portfolio

### Step 1: Create GitHub Repository
1. Go to [GitHub](https://github.com) and create a new repository
2. Name it `sacchinbhg.github.io` (this will be your website URL)
3. Make it public (required for free GitHub Pages)

### Step 2: Upload Your Files
1. Clone the repository locally:
   ```bash
   git clone https://github.com/sacchinbhg/sacchinbhg.github.io.git
   cd sacchinbhg.github.io
   ```

2. Copy all files from this website folder to the repository:
   ```bash
   cp -r /home/sacchin/Desktop/website/* .
   ```

3. Commit and push:
   ```bash
   git add .
   git commit -m "Initial commit: Academic portfolio website"
   git push origin main
   ```

### Step 3: Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll down to **Pages** section
4. Under **Source**, select **Deploy from a branch**
5. Select **main** branch and **/ (root)** folder
6. Click **Save**

### Step 4: Access Your Website
- Your website will be available at: **https://sacchinbhg.github.io**
- It may take a few minutes to deploy initially
- Future changes will auto-deploy when you push to the main branch

## 📁 Repository Structure
```
sacchinbhg.github.io/
├── index.html              # Main website
├── stylesheet.css          # Styling
├── CNAME                   # Domain configuration (sacchinbhg.github.io)
├── README.md               # Documentation
├── images/                 # All images and media
│   ├── SacchinSundar.jpg   # Your headshot
│   ├── neural_bathymetry.jpg
│   ├── underwater_slam_before.png
│   ├── underwater_slam_after.png
│   ├── dhaz3r.jpg
│   └── favicon/            # Website favicon
└── data/                   # PDFs and documents
    └── SacchinSundar-CV.pdf
```

## 🔄 Updating Your Website
1. Make changes to your files locally
2. Commit and push:
   ```bash
   git add .
   git commit -m "Update: [describe your changes]"
   git push origin main
   ```
3. Changes will automatically deploy to your website

## 🌐 Custom Domain (Optional)
If you want to use a custom domain like `sacchinsundar.info`:

1. Update the `CNAME` file with your domain
2. Configure DNS settings with your domain provider
3. Add the domain to your GitHub repository settings

## ✅ Verification
After deployment, verify:
- [ ] Website loads at https://sacchinbhg.github.io
- [ ] All images display correctly
- [ ] All links work properly
- [ ] Mobile responsiveness works
- [ ] Contact links are functional

## 🆘 Troubleshooting
- **404 Error**: Check that `index.html` is in the root directory
- **Images not loading**: Verify image paths and file names
- **Styling issues**: Check that `stylesheet.css` is properly linked
- **Slow loading**: Optimize images and check file sizes

Your academic portfolio is now ready for PhD applications! 🎉
