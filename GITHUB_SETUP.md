# GitHub Setup Instructions

## 🚀 Create GitHub Repository

1. **Go to GitHub** and create a new repository:
   - Repository name: `maria-havens-pos`
   - Description: `Django POS System for Hotels and Restaurants with Room Service`
   - Make it Public (or Private as needed)
   - Don't initialize with README (we already have one)

2. **Connect local repository to GitHub:**
   ```bash
   git remote add origin https://github.com/YOUR-USERNAME/maria-havens-pos.git
   git branch -M main
   git push -u origin main
   ```

## 📡 Deploy to Render

### Option 1: One-Click Deploy (Recommended)
1. Fork the repository on GitHub
2. Go to [Render.com](https://render.com)
3. Click "New +" → "Web Service"
4. Connect your GitHub account
5. Select the `maria-havens-pos` repository
6. Use these settings:
   - **Name**: `maria-havens-pos`
   - **Environment**: `Python 3`
   - **Build Command**: `./build.sh`
   - **Start Command**: `gunicorn backend.wsgi:application`
   - **Plan**: Free (or upgrade as needed)

### Option 2: Using render.yaml
1. In Render dashboard, click "New +" → "Blueprint"
2. Connect repository and deploy using `render.yaml`

### Environment Variables (Auto-configured)
- `SECRET_KEY` - Automatically generated
- `DATABASE_URL` - Automatically configured with PostgreSQL
- `WEB_CONCURRENCY` - Set to 4

## 🌟 Post-Deployment

1. **Access your deployed app**:
   - Your app will be available at: `https://maria-havens-pos.onrender.com`
   - Admin panel: `https://maria-havens-pos.onrender.com/admin/`

2. **Test the deployment**:
   ```bash
   curl -X POST https://maria-havens-pos.onrender.com/api/auth/login/ \
        -d "username=jabezmageto78@gmail.com&password=lokeshen@58"
   ```

## 🔧 Alternative Deployment Options

### Railway
1. Go to [Railway.app](https://railway.app)
2. Connect GitHub repository
3. Deploy with zero configuration

### Heroku
1. Install Heroku CLI
2. ```bash
   heroku create maria-havens-pos
   heroku addons:create heroku-postgresql:hobby-dev
   git push heroku main
   ```

## 📋 Deployment Checklist

- ✅ Git repository initialized
- ✅ All files committed
- ✅ GitHub repository ready
- ✅ Render configuration (`render.yaml`) included
- ✅ Build script (`build.sh`) configured
- ✅ Requirements.txt with all dependencies
- ✅ PostgreSQL support added
- ✅ Static files configuration
- ✅ Environment variables configured
- ✅ CORS settings for production

Your backend is now ready for deployment! 🚀