# Deploying Tunr to Render.com

This guide walks you through deploying your Django backend, React frontend, and PostgreSQL database to Render's free tier.

---

## Prerequisites

1. **GitHub Account**: Your code must be in a GitHub repository (public or private)
2. **Render Account**: Sign up at [render.com](https://render.com)
3. **Spotify Developer Account**: Register your app at [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
4. **OMDB API Key**: Get one at [omdbapi.com](http://www.omdbapi.com/apikey.aspx)

---

## Step 1: Push Your Code to GitHub

Make sure all your changes are committed and pushed:

```bash
# Check what files are staged
git status

# Add all changes (if needed)
git add .

# Commit with a message
git commit -m "Add Render deployment configuration"

# Push to GitHub
git push origin main
```

**Important**: Verify that your `.env` files are NOT pushed (they should be gitignored).

---

## Step 2: Create a New Project on Render

1. Go to [render.com](https://render.com) and log in
2. Click **New** → **Blueprint**
3. Connect your GitHub repository
4. Render will automatically detect your `render.yaml` file
5. Click **Apply** to create all services (backend, frontend, database)

---

## Step 3: Configure Environment Variables

After the blueprint is applied, you'll need to set environment variables for each service.

### Backend Environment Variables

Go to your **tunr-backend** service → **Environment** tab and add:

| Key | Value | Notes |
|-----|-------|-------|
| `DEBUG` | `False` | Production mode |
| `ALLOWED_HOSTS` | `tunr-backend.onrender.com` | Replace with your actual backend URL |
| `OMDB_API_KEY` | Your OMDB API key | Get from omdbapi.com |
| `SPOTIFY_CLIENT_ID` | Your Spotify Client ID | From Spotify Developer Dashboard |
| `SPOTIFY_CLIENT_SECRET` | Your Spotify Client Secret | From Spotify Developer Dashboard |
| `CORS_ALLOWED_ORIGINS` | `https://tunr-frontend.onrender.com` | Replace with your frontend URL |
| `CSRF_TRUSTED_ORIGINS` | `https://tunr-backend.onrender.com` | Your backend URL |

**Note**: `DATABASE_URL` and `SECRET_KEY` are automatically set by Render.

### Frontend Environment Variables

Go to your **tunr-frontend** service → **Environment** tab and add:

| Key | Value |
|-----|-------|
| `REACT_APP_API_URL` | `https://tunr-backend.onrender.com` |
| `REACT_APP_OMDB_API_KEY` | Your OMDB API key (same as backend) |

---

## Step 4: Update Spotify Redirect URI

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Select your Tunr app
3. Click **Edit Settings**
4. Under **Redirect URIs**, add:
   ```
   https://tunr-backend.onrender.com/music/spotify/callback/
   ```
5. Click **Save**

---

## Step 5: Deploy and Monitor

1. Render will automatically build and deploy all services
2. Monitor the logs for each service:
   - **Backend logs**: Watch for migration and server startup messages
   - **Frontend logs**: Watch for build completion
   - **Database logs**: Should show PostgreSQL ready

### Common Issues:

- **Backend won't start**: Check that all environment variables are set
- **Database connection error**: Verify `DATABASE_URL` is auto-populated
- **Static files not loading**: Run `python manage.py collectstatic` (should happen automatically in build)
- **CORS errors**: Double-check `CORS_ALLOWED_ORIGINS` matches your frontend URL

---

## Step 6: Create a Superuser (Django Admin)

Once your backend is deployed, you need to create an admin user:

1. Go to your **tunr-backend** service on Render
2. Click the **Shell** tab
3. Run:
   ```bash
   python manage.py createsuperuser
   ```
4. Follow the prompts to set username, email, and password
5. Access Django admin at: `https://tunr-backend.onrender.com/admin/`

---

## Step 7: Test Your Deployment

1. Visit your frontend: `https://tunr-frontend.onrender.com`
2. Sign up for a new account
3. Log in with Spotify to link your account
4. Check Django admin to verify Spotify data is saved

---

## Troubleshooting

### Backend Issues

```bash
# Check logs on Render dashboard → tunr-backend → Logs

# Common fixes:
# - Missing environment variables: Add them in Environment tab
# - Migration errors: Render runs migrations automatically, check logs
# - Import errors: Verify requirements.txt has all dependencies
```

### Frontend Issues

```bash
# Check logs on Render dashboard → tunr-frontend → Logs

# Common fixes:
# - Build errors: Check package.json and node version
# - API connection: Verify REACT_APP_API_URL is correct
# - Environment variables: Must start with REACT_APP_
```

### Database Issues

```bash
# Database is auto-created by Render
# Check connection string in tunr-backend → Environment → DATABASE_URL

# To reset database (WARNING: deletes all data):
# 1. Go to tunr-db → Settings
# 2. Suspend and resume the database
```

---

## Free Tier Limitations

- **Web services**: Spin down after 15 minutes of inactivity (cold starts take 30-60 seconds)
- **Database**: 90 days of data retention, then deleted if inactive
- **Build minutes**: 500 minutes/month

---

## Updating Your Deployment

Render automatically redeploys when you push to GitHub:

```bash
# Make changes locally
git add .
git commit -m "Update feature"
git push origin main

# Render will automatically:
# 1. Pull latest code
# 2. Run build commands
# 3. Restart services
```

---

## Local Development vs Production

Your app automatically detects the environment:

- **Local**: Uses SQLite database (`db.sqlite3`), reads `.env` file
- **Production**: Uses PostgreSQL (`DATABASE_URL`), reads Render environment variables

No code changes needed to switch between environments!

---

## Need Help?

- **Render Docs**: [render.com/docs](https://render.com/docs)
- **Django Deployment**: [docs.djangoproject.com/en/stable/howto/deployment/](https://docs.djangoproject.com/en/stable/howto/deployment/)
- **Spotify OAuth**: [developer.spotify.com/documentation/web-api/tutorials/code-flow](https://developer.spotify.com/documentation/web-api/tutorials/code-flow)
