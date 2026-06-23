# 🚀 Deploy HealthBlog for FREE (Single URL)

## Option 1: EASIEST - Railway.app (Recommended) ⭐

Railway.app is the simplest - deploy both backend and frontend with **one URL**.

### Prerequisites
- GitHub account (to connect your repo)
- Railway.app account (free signup at https://railway.app)

---

### STEP 1: Push Code to GitHub

```bash
# Initialize git in your project folder
cd healthblog
git init
git add .
git commit -m "Initial commit"

# Create a GitHub repository at https://github.com/new
# Then push your code:
git remote add origin https://github.com/YOUR_USERNAME/healthblog.git
git branch -M main
git push -u origin main
```

---

### STEP 2: Deploy Backend on Railway

1. Go to **https://railway.app**
2. Click **"Create New Project"**
3. Click **"Deploy from GitHub Repo"**
4. Select your **healthblog** repository
5. Select **"Backend"** folder (the Spring Boot app)
6. Railway automatically detects it's a Java project
7. Wait for deployment (3-5 minutes)
8. Copy the deployed URL (e.g., `https://your-app-xxx.railway.app`)

---

### STEP 3: Update Frontend API URL

Before deploying frontend, update the API URL:

**File: `frontend/src/api/axios.js`**

```javascript
const API_BASE_URL = 'https://your-app-xxx.railway.app/api'; // ← Change this!
```

---

### STEP 4: Deploy Frontend on Railway

1. Go back to Railway dashboard
2. Click **"Create New Project"**  
3. Click **"Deploy from GitHub Repo"**
4. Select your **healthblog** repo
5. Select **"Frontend"** folder (the React app)
6. Add build command: `npm run build`
7. Add start command: `npm install && npm run dev`
8. Railway deploys it automatically
9. Copy the frontend URL (e.g., `https://frontend-xxx.railway.app`)

---

### ✅ **DONE! Your app is live!**

- **Frontend**: https://frontend-xxx.railway.app
- **Backend**: https://backend-xxx.railway.app/api

Just use the **frontend URL** and you're good to go! 🎉

---

---

## Option 2: Render.com + Vercel (More Control)

If Railway gives issues, use this approach:

### Deploy Backend on Render.com

1. **Build and push to GitHub** (same as above)

2. **Create a `Procfile` in backend folder**:

```
web: java -Dserver.port=${PORT} -jar target/healthblog-0.0.1-SNAPSHOT.jar
```

3. **Create `system.properties` in backend folder**:

```
java.runtime.version=17
```

4. **Go to Render.com** → Sign up → New Web Service
5. **Connect GitHub repository**
6. **Settings**:
   - **Name**: healthblog-backend
   - **Environment**: Docker
   - **Build Command**: `./mvnw clean package`
   - **Start Command**: `java -jar target/healthblog-0.0.1-SNAPSHOT.jar`
7. **Wait for deployment** (5-10 minutes)
8. **Copy the deployed URL** (e.g., `https://healthblog-backend.onrender.com`)

---

### Deploy Frontend on Vercel

1. **Update API URL in frontend**:

**File: `frontend/src/api/axios.js`**

```javascript
const API_BASE_URL = 'https://healthblog-backend.onrender.com/api';
```

2. **Go to Vercel.com** → Sign up → Import Project
3. **Connect GitHub**
4. **Select your repository**
5. **Settings**:
   - **Root Directory**: `frontend`
   - **Framework**: React
   - **Build Command**: `npm run build`
6. **Deploy**!
7. **Copy the Vercel URL** (e.g., `https://healthblog-frontend.vercel.app`)

---

### ✅ **DONE! Your app is live!**

- **Frontend**: https://healthblog-frontend.vercel.app
- **Backend**: https://healthblog-backend.onrender.com

---

---

## Option 3: Docker Deployment (Advanced)

If you want a single container:

### Create `docker-compose.yml` in root:

```yaml
version: '3.8'
services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8080:8080"
    environment:
      - SPRING_DATASOURCE_URL=jdbc:mysql://db:3306/healthblog
      - SPRING_DATASOURCE_USERNAME=root
      - SPRING_DATASOURCE_PASSWORD=password
    depends_on:
      - db
  
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://localhost:8080/api
  
  db:
    image: mysql:8
    environment:
      - MYSQL_ROOT_PASSWORD=password
      - MYSQL_DATABASE=healthblog
    volumes:
      - mysql-data:/var/lib/mysql

volumes:
  mysql-data:
```

Deploy on Heroku (has free tier):
```bash
heroku container:login
heroku container:push web
heroku container:release web
```

---

---

## 🌐 **RECOMMENDED: Use Railway.app**

**Why Railway?**
✅ Free tier (500 hours/month)
✅ One-click GitHub deployment
✅ Auto-scaling
✅ Simple environment variables
✅ Both backend and frontend supported
✅ One dashboard for everything

---

## ⚠️ **Important Notes**

### Database for Production
- H2 (current) works for **testing only**
- For **production**, use PostgreSQL or MySQL
- **Railway** provides FREE PostgreSQL 👍

### Environment Variables

Create `.env` files for sensitive data:

**Backend `application.properties`**:
```properties
app.jwt.secret=${JWT_SECRET}
app.jwt.expiration=${JWT_EXPIRATION}
spring.datasource.url=${DATABASE_URL}
spring.datasource.username=${DATABASE_USERNAME}
spring.datasource.password=${DATABASE_PASSWORD}
```

**Frontend `.env`**:
```
REACT_APP_API_URL=https://your-backend-url/api
```

### Custom Domain

To use your own domain (optional):

1. Register domain on **Namecheap** or **GoDaddy**
2. Point DNS to Railway/Render/Vercel
3. Add custom domain in dashboard

---

## 📱 Test Your Deployment

1. **Visit frontend URL**
2. **Sign up** (creates account)
3. **Create a post** (if doctor)
4. **View posts** (if patient)
5. **Check profile picture upload**
6. **Verify everything works!**

---

## 🐛 Troubleshooting

### Backend won't start
- Check logs: `railway logs` or dashboard
- Ensure Java 17+
- Check database connection

### Frontend shows blank page
- Check browser console for errors
- Verify API URL is correct
- Clear cache: `Ctrl+Shift+Delete`

### Can't login
- Check backend is running
- Verify email/password
- Check browser console for 404 errors

### Slow performance
- H2 database is slow (switch to PostgreSQL)
- Cold start on Render (sleeps after 15 min)
- Use Railway for no cold starts

---

## 💰 Pricing Summary

| Platform | Free Tier | Limit |
|----------|-----------|-------|
| Railway | YES | 500 hours/month |
| Render | YES | 750 hours/month |
| Vercel | YES | Unlimited |
| Heroku | NO | $7/month minimum |

---

## 🎓 Step-by-Step Video Summary

1. **Create GitHub repo** → Push code
2. **Sign up Railway** → Connect GitHub
3. **Deploy backend** → Copy URL
4. **Update frontend API** → Push changes
5. **Deploy frontend** → Copy URL
6. **Test in browser** → Done! 🎉

---

## 📞 Support

Issues?

1. **Check Railway/Render logs**
2. **Check browser console** (F12)
3. **Verify API URL** in frontend
4. **Check GitHub** actions (deployment status)

---

**Congratulations! 🎉 Your app is now live on the internet!**

Share the frontend URL with friends and they can use it without installing anything! 🚀
