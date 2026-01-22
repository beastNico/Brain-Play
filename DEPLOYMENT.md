# Brain Play - Deployment Guide

Deploy your Brain Play app to the world in minutes!

## 🚀 Option 1: Vercel (Recommended - 2 minutes)

Vercel is the easiest way to deploy React apps.

### Steps:

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/brain-play.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Select your GitHub repo
   - Click "Import"

3. **Configure**
   - Environment Variables: No changes needed (optional for Supabase)
   - Click "Deploy"

4. **Done!**
   - Vercel gives you a URL like `brain-play-xyz.vercel.app`
   - Your app is live! Share the link

### Auto-Deployments
- Every time you push to GitHub, Vercel auto-deploys
- No manual steps needed

---

## 🚀 Option 2: Netlify (2 minutes)

Another excellent deployment platform.

### Steps:

1. **Push to GitHub** (same as Vercel above)

2. **Connect to Netlify**
   - Go to [netlify.com](https://www.netlify.com)
   - Click "Add new site"
   - Select "Import an existing project"
   - Choose GitHub
   - Select your repo

3. **Configure Build**
   - Build Command: `npm run build`
   - Publish Directory: `dist`
   - Click "Deploy"

4. **Done!**
   - Netlify gives you a URL
   - App is live!

---

## 🚀 Option 3: GitHub Pages (Free)

Deploy directly from GitHub (no Vercel/Netlify needed).

### Steps:

1. **Update vite.config.ts**
   ```ts
   export default defineConfig({
     plugins: [react()],
     base: '/brain-play/',  // Add this line
   })
   ```

2. **Update package.json**
   ```json
   "scripts": {
     "deploy": "npm run build && gh-pages -d dist"
   }
   ```

3. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

5. **Enable GitHub Pages**
   - Go to repo Settings → Pages
   - Source: `gh-pages` branch
   - Visit: `https://YOUR_USERNAME.github.io/brain-play`

---

## 🚀 Option 4: Traditional Hosting (Any Host)

Deploy to any web hosting provider (GoDaddy, Bluehost, etc.).

### Steps:

1. **Build locally**
   ```bash
   npm run build
   ```

2. **Upload dist folder**
   - FTP or hosting control panel
   - Upload all files from `dist/` to public_html or www folder

3. **Done!**
   - Access via your domain

### Example: Hosting on Bluehost
1. Login to Bluehost Control Panel
2. File Manager → public_html
3. Upload `dist` folder contents
4. Visit your domain

---

## 🔐 Environment Variables (Optional - For Supabase)

If you want real multiplayer sync across devices:

### Vercel
1. Project Settings → Environment Variables
2. Add:
   ```
   VITE_SUPABASE_URL = your_supabase_url
   VITE_SUPABASE_ANON_KEY = your_anon_key
   ```
3. Redeploy

### Netlify
1. Site Settings → Build & Deploy → Environment
2. Edit variables
3. Add same variables as above
4. Trigger redeploy

### GitHub Pages
(Not recommended for Supabase keys - GitHub Pages can't hide .env)

---

## 🌍 Domain Names

### Buy a Domain
1. Go to [Namecheap](https://www.namecheap.com) or [GoDaddy](https://www.godaddy.com)
2. Search for a domain like `brainplay-quiz.com`
3. Buy for ~$10/year

### Connect to Vercel
1. Domain Settings in Vercel
2. Add your custom domain
3. Update DNS records (Vercel provides instructions)
4. Visit `brainplay-quiz.com` ✓

---

## 📊 Performance Tips

### Before Deploying

1. **Build locally and check size**
   ```bash
   npm run build
   # Check dist folder size - should be ~300KB
   ```

2. **Test on mobile**
   - Use phone to test responsiveness
   - Check button sizes
   - Test on slow 4G connection

3. **Lighthouse Score**
   - Chrome DevTools → Lighthouse
   - Aim for 90+ scores

### After Deploying

1. **Monitor Analytics**
   - Vercel/Netlify dashboard shows visits
   - Check performance metrics

2. **Update Regularly**
   - Just push to GitHub
   - Auto-deploys happen instantly

---

## 🚨 Troubleshooting Deployments

### Build Fails
```bash
# Test locally first
npm run build
npm run preview

# If it works locally, it'll work on the host
```

### App is Blank/404
- Check `dist/index.html` exists
- Verify build output
- Clear browser cache (Ctrl+Shift+Delete)

### Supabase Variables Not Working
- Verify `.env.local` has correct format
- Check variable names match (prefix with VITE_)
- Redeploy after adding env vars

### Styling Broken
- Usually means CSS didn't bundle correctly
- Try `npm run build` again
- Clear browser cache

---

## 🎯 Recommended Setup

For best experience:

1. **Use Vercel** (easiest)
2. **Use GitHub** for code storage
3. **Use Namecheap** for domain (~$10/year)
4. **Skip Supabase** initially (client-side works fine for 1 device)

### Typical Flow
1. Write code locally (`npm run dev`)
2. Test everything
3. Push to GitHub
4. Vercel auto-deploys
5. Visit your custom domain
6. Share with friends!

---

## 📱 Share with Others

Once deployed:

1. **Get your URL**
   - Vercel: `brain-play-xyz.vercel.app`
   - Custom domain: `brainplay-quiz.com`

2. **Create a shortlink** (optional)
   - Use [bit.ly](https://bitly.com) or [short.link](https://short.link)
   - More shareable: `bit.ly/brain-play`

3. **Share instructions**
   ```
   👋 Play Brain Play!
   🔗 Visit: https://brain-play-xyz.vercel.app
   🎮 Click "Host Game" or "Join Game"
   📝 CSV format: Question, Option A, B, C, D, Answer
   ```

---

## 💰 Costs

| Service | Cost | Notes |
|---------|------|-------|
| Vercel | FREE | Up to 3 deployments/day free |
| Netlify | FREE | Unlimited deployments |
| GitHub Pages | FREE | For .github.io domain |
| Domain Name | ~$10/year | Namecheap, GoDaddy |
| Supabase | FREE | For basic features |
| **Total** | **~$10/year** | Just the domain |

---

## 🎉 You're Live!

Your app is now accessible worldwide. Students from any device can:
1. Visit your URL
2. Click "Join Game"
3. Enter the PIN
4. Start playing!

### Next Steps
1. Test with friends
2. Collect feedback
3. Add more questions
4. Optimize based on usage
5. Deploy improvements

---

**Congratulations on deploying Brain Play!** 🚀

Questions? Check the README.md or review the deployment provider's docs (Vercel/Netlify).
