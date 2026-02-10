# Portfolio Website - Setup Guide

## 🎉 Welcome!

Your modern, fully responsive portfolio website is ready! Follow these steps to customize it and set up the email functionality.

---

## 📝 Step 1: Customize Your Content

### In `Main.html`, replace these placeholders:

1. **Your Name** (appears in title and hero section):
   - Line 5: Change `<title>My Portfolio</title>` to your name
   - Line 38: Change `Hi, I'm <span class="highlight">Your Name</span>`
   - Line 163: Change `<div class="logo">Portfolio</div>` to your name

2. **Your Picture** (in hero section):
   - Line 48: Replace the placeholder image URL with your actual image URL
   ```html
   <img src="YOUR_IMAGE_URL_HERE" alt="Profile Picture" class="profile-img">
   ```
   You can use:
   - Direct image URL from Google Drive, Imgur, or any hosting service
   - Local file: `<img src="images/your-photo.jpg" alt="Profile Picture">`

3. **Project Details**:
   - Lines 89-136: Replace project names, descriptions, and images
   - Update project links in the "View Project" buttons

4. **Skills**:
   - Lines 154-176: Update your actual skills and expertise

5. **About Section**:
   - Lines 77-80: Update your personal bio and description

6. **Footer Links**:
   - Line 218: Update LinkedIn URL
   - Line 221: Update GitHub URL
   - Line 224: Update your email address

---

## 📧 Step 2: Set Up Email (EmailJS)

### Option A: FREE - Using EmailJS (Recommended)

1. **Create EmailJS Account**:
   - Go to https://www.emailjs.com
   - Click "Sign Up Free"
   - Complete registration

2. **Add Email Service**:
   - In dashboard, click "Add Service"
   - Select "Gmail" (or your email provider)
   - Follow the steps to connect your email

3. **Create Email Template**:
   - Click "Email Templates"
   - Create new template with this structure:
   ```
   From: {{from_email}}
   Subject: {{subject}}
   Message from {{from_name}}:
   {{message}}
   ```

4. **Get Your Credentials**:
   - Service ID: Found in "Services" section
   - Template ID: Found in "Email Templates" section
   - Public Key: Found in "Account" > "API Keys"

5. **Update in `script.js`**:
   ```javascript
   const EMAIL_PUBLIC_KEY = "YOUR_PUBLIC_KEY"; // Paste here
   const EMAIL_SERVICE_ID = "YOUR_SERVICE_ID"; // Paste here
   const EMAIL_TEMPLATE_ID = "YOUR_TEMPLATE_ID"; // Paste here
   ```

6. **Update Your Email**:
   - In `script.js` line ~81: Change `"your.email@gmail.com"` to your actual email

### Option B: Manual Email Setup (Alternative)

If you prefer a backend solution, you can integrate with:
- Formspree (https://formspree.io)
- Basin (https://usebasin.com)
- Or your own backend API

---

## 🎨 Color Scheme

Your portfolio uses these colors (already applied):
- **Primary Dark**: `#3d405b` - Dark blue-gray (navigation, footer)
- **Primary Teal**: `#005f73` - Deep teal (accents, links)
- **Primary Cyan**: `#00b4d8` - Bright cyan (highlights, buttons)
- **Light Background**: `#f8f9fa` - Off-white
- **White**: `#ffffff` - Pure white

To customize colors, edit the `:root` variables in `style.css` (lines 1-13).

---

## 📱 Features Included

✅ **Fully Responsive Design**
- Works perfectly on desktop, tablet, and mobile
- Hamburger menu for mobile navigation

✅ **Modern Animations**
- Smooth scroll behavior
- Hover effects on projects and buttons
- Fade-in animations for sections

✅ **Functional Components**
- Mobile-friendly navigation toggle
- Smooth scrolling to sections
- Back-to-top button
- Active navigation highlighting
- Email form with validation

✅ **Accessibility**
- Semantic HTML structure
- Proper contrast ratios
- Keyboard navigation support

✅ **Performance**
- Optimized CSS and JavaScript
- Lazy loading ready
- Fast load times

---

## 🚀 How to Use

1. **Open in Browser**:
   - Double-click `Main.html` or right-click → "Open with" → Your browser

2. **Edit Files**:
   - Use VS Code to edit `Main.html`, `style.css`, and `script.js`
   - Save and refresh the browser to see changes

3. **Add Your Own Images**:
   - Create an `images/` folder in your portfolio directory
   - Add your images there
   - Reference them: `src="images/my-photo.jpg"`

---

## 🔧 Additional Customization

### Change Color Scheme
Edit `style.css` root variables:
```css
:root {
    --primary-dark: #3d405b;      /* Change these values */
    --primary-teal: #005f73;
    --primary-cyan: #00b4d8;
}
```

### Add More Sections
Copy any section block and paste below, updating the ID and content.

### Add More Projects
Duplicate a `.project-card` div and update the content.

### Change Font
In `style.css`, update the font-family:
```css
body {
    font-family: 'Your Font', sans-serif;
}
```

---

## 🐛 Troubleshooting

### Email Not Sending?
1. Check that EmailJS credentials are correctly entered
2. Verify your email is connected in EmailJS dashboard
3. Check browser console for errors (F12)
4. Ensure the contact form values are filled correctly

### Images Not Showing?
1. Verify image URL is correct and accessible
2. For local images, use relative paths: `images/photo.jpg`
3. Check file extensions match (.jpg, .png, .gif)

### Mobile Menu Not Working?
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh the page (Ctrl+F5)
3. Check that `script.js` is linked in HTML

### Styling Looks Off?
1. Hard refresh the page (Ctrl+F5)
2. Clear browser cache
3. Check that `style.css` is linked correctly

---

## 📞 Support Resources

- **EmailJS Docs**: https://www.emailjs.com/docs/
- **Font Awesome Icons**: https://fontawesome.com/icons
- **Color Palettes**: https://coolors.co
- **Image Hosting**: Imgur, Cloudinary, or Google Drive
- **Free Stock Photos**: Unsplash, Pexels, Pixabay

---

## 💡 Tips

1. **Profile Picture**: Use a high-quality, professional photo
2. **Project Images**: Use screenshots or mockups of your best work
3. **Descriptions**: Keep project descriptions concise and impactful
4. **Links**: Make sure all external links open in new tabs (`target="_blank"`)
5. **Mobile Testing**: Test on your phone before sharing
6. **Deployment**: Use GitHub Pages, Vercel, Netlify for free hosting

---

## 📤 Deployment Options (FREE)

1. **GitHub Pages** (Best for beginners)
   - Push to GitHub repository
   - Enable Pages in repository settings
   - Your site is live at `username.github.io`

2. **Netlify** (Easy & Free)
   - Drag and drop your folder
   - Automatic HTTPS
   - Custom domain support

3. **Vercel** (Simple & Fast)
   - Connect GitHub repository
   - Auto-deploys on push
   - Instant hosting

---

## ✨ Final Checklist

Before sharing your portfolio:

- [ ] Update all placeholder text with your information
- [ ] Add your profile picture
- [ ] Update project details and images
- [ ] Test email form (if using EmailJS)
- [ ] Test on mobile device
- [ ] Check all external links work
- [ ] Update social media links
- [ ] Test navigation on mobile (hamburger menu)
- [ ] Check form validation works

---

**Congratulations!** Your portfolio is ready. Good luck with your job search! 🚀