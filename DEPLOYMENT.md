# Deployment Guide for HRMS Lite

## Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit - HRMS Lite complete"
git remote add origin https://github.com/YOUR_USERNAME/hrms-lite.git
git push -u origin main
```

## Step 2: Deploy Backend to Render

1. Go to https://render.com and sign up/login
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: hrms-lite-api
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: Free
5. Click "Advanced" and add Environment Variable:
   - **Key**: `DATABASE_URL`
   - **Value**: `mysql+pymysql://username:password@host:3306/hrms_db`
   (Use Railway, PlanetScale, or any MySQL provider)
6. Click "Create Web Service"
7. Wait for deployment (5-10 minutes)
8. Copy the deployed URL (e.g., `https://hrms-lite-api.onrender.com`)

### Free MySQL Options:
- **Railway**: https://railway.app
- **PlanetScale**: https://planetscale.com
- **Aiven**: https://aiven.io

## Step 3: Deploy Frontend to Vercel

1. Go to https://vercel.com and sign up/login
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click "Environment Variables" and add:
   - **Name**: `VITE_API_URL`
   - **Value**: Your backend URL from Step 2
6. Click "Deploy"
7. Wait for deployment (2-3 minutes)
8. Your app is live! 🎉

## Step 4: Update CORS (Important!)

1. Go to your Render dashboard
2. Open your backend service
3. Go to "Environment" tab
4. Add/edit environment variable:
   - **Key**: `ALLOWED_ORIGINS`
   - **Value**: Your Vercel frontend URL (e.g., `https://hrms-lite.vercel.app`)
5. Deploy the change

## Verification Checklist

- [ ] Backend health check: `https://your-backend.com/health`
- [ ] API docs accessible: `https://your-backend.com/docs`
- [ ] Frontend loads without errors
- [ ] Can create employee
- [ ] Can view employees list
- [ ] Can delete employee
- [ ] Can mark attendance
- [ ] Can view attendance records
- [ ] Dashboard shows correct stats

## Troubleshooting

### CORS Errors
Make sure `ALLOWED_ORIGINS` includes your exact frontend URL

### Database Connection Issues
- Check DATABASE_URL format: `mysql+pymysql://user:pass@host:port/db`
- Ensure database exists
- Check firewall rules

### Build Failures
- Backend: Check Python version (3.11+)
- Frontend: Check Node version (18+)

## Live URLs

After deployment, update these:
- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-api.onrender.com
- **GitHub**: https://github.com/your-username/hrms-lite
