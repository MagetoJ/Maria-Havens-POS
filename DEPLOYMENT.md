# Deployment Guide for Maria Havens POS

## Vercel Deployment (Recommended)

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/MagetoJ/mariahavenspos)

### Manual Deployment

1. **Prerequisites**
   - GitHub account
   - Vercel account (free)

2. **Steps**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with your GitHub account
   - Click "New Project"
   - Import the `mariahavenspos` repository
   - Configure build settings (auto-detected):
     - **Framework Preset**: Vite
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
     - **Install Command**: `npm install`

3. **Environment Variables** (if needed)
   - Add any required environment variables in Vercel dashboard
   - Reference `.env.example` for available options

4. **Custom Domain** (optional)
   - Add your custom domain in Vercel dashboard
   - Follow Vercel's DNS configuration guide

## Alternative Deployment Options

### Netlify
1. Connect your GitHub repository to Netlify
2. Set build command to `npm run build`
3. Set publish directory to `dist`

### Cloudflare Pages
1. Connect repository to Cloudflare Pages
2. Use the same build settings as Vercel

### Self-Hosted
1. Build the project: `npm run build`
2. Upload the `dist` folder to your web server
3. Configure server to serve `index.html` for all routes (SPA)

## Build Configuration

The project is pre-configured with:
- ✅ Vite for fast builds
- ✅ TypeScript compilation
- ✅ Tailwind CSS processing
- ✅ React optimization
- ✅ Code splitting
- ✅ Asset optimization

## Performance Optimizations

- Code splitting for vendors and router
- Terser minification
- Tree shaking
- Asset optimization
- Chunk size warnings at 5MB

## Troubleshooting

### Build Issues
- Ensure Node.js version 18 or higher
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check for TypeScript errors: `npx tsc --noEmit`

### Runtime Issues
- Check browser console for errors
- Verify all API endpoints are accessible
- Ensure environment variables are properly set

## Support

For deployment issues:
1. Check the [GitHub Issues](https://github.com/MagetoJ/mariahavenspos/issues)
2. Join our [Discord community](https://discord.gg/shDEGBSe2d)
3. Review Vercel's documentation for platform-specific issues