# Deployment Guide

This guide covers deploying the NotebookLM Clone to various cloud platforms for free or low cost.

## Table of Contents
- [Netlify + Render (Recommended)](#netlify--render-recommended)
- [Vercel + Railway](#vercel--railway)
- [Heroku (Full Stack)](#heroku-full-stack)
- [AWS (Advanced)](#aws-advanced)
- [Environment Variables](#environment-variables)

## Netlify + Render (Recommended)

### Frontend on Netlify (Free)

1. **Build the frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Sign up/login
   - Drag the `build` folder to Netlify's deploy area
   - Or connect your Git repository for auto-deployment

3. **Configure redirects** (create `frontend/public/_redirects`)
   ```
   /*    /index.html   200
   ```

### Backend on Render (Free)

1. **Prepare for deployment**
   - Create a Git repository and push your code
   - Ensure `package.json` has start script: `"start": "node server.js"`

2. **Deploy to Render**
   - Go to [render.com](https://render.com)
   - Sign up/login
   - Create new "Web Service"
   - Connect your Git repository
   - Configure:
     - Build Command: `npm install`
     - Start Command: `npm start`
     - Environment: Node

3. **Set environment variables**
   - `PORT`: (Render sets this automatically)
   - Add any custom variables

4. **Update frontend API URLs**
   ```javascript
   // In frontend components, replace localhost:5000 with your Render URL
   const API_BASE_URL = 'https://your-app-name.onrender.com';
   ```

## Vercel + Railway

### Frontend on Vercel

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   cd frontend
   vercel --prod
   ```

3. **Or use Vercel dashboard**
   - Connect Git repository
   - Auto-deployment on push

### Backend on Railway

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Deploy**
   ```bash
   cd backend
   railway login
   railway init
   railway up
   ```

## Heroku (Full Stack)

### Prepare the application

1. **Create root-level scripts** (in root `package.json`)
   ```json
   {
     "scripts": {
       "build": "cd frontend && npm install && npm run build",
       "start": "cd backend && npm start",
       "heroku-postbuild": "npm run build"
     }
   }
   ```

2. **Update backend to serve frontend**
   ```javascript
   // Add to backend/server.js
   const path = require('path');
   
   // Serve static files from the React app
   app.use(express.static(path.join(__dirname, '../frontend/build')));
   
   // Catch all handler: send back React's index.html file
   app.get('*', (req, res) => {
     res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
   });
   ```

3. **Deploy to Heroku**
   ```bash
   heroku create your-app-name
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

## AWS (Advanced)

### S3 + CloudFront (Frontend)

1. **Build and upload to S3**
   ```bash
   cd frontend
   npm run build
   aws s3 sync build/ s3://your-bucket-name --delete
   ```

2. **Configure CloudFront distribution**

### EC2 or Lambda (Backend)

1. **EC2 Instance**
   - Launch Ubuntu instance
   - Install Node.js and PM2
   - Clone repository and run

2. **Lambda + API Gateway**
   - Use serverless framework
   - Deploy functions for each endpoint

## Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-url.netlify.app
MAX_FILE_SIZE=52428800
```

### Frontend
```env
REACT_APP_API_URL=https://your-backend-url.onrender.com
REACT_APP_MAX_FILE_SIZE=50
```

## Production Optimizations

### Backend Optimizations

1. **Add compression**
   ```bash
   npm install compression
   ```
   ```javascript
   const compression = require('compression');
   app.use(compression());
   ```

2. **Add security headers**
   ```bash
   npm install helmet
   ```
   ```javascript
   const helmet = require('helmet');
   app.use(helmet());
   ```

3. **Add rate limiting**
   ```javascript
   const rateLimit = require('express-rate-limit');
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // limit each IP to 100 requests per windowMs
   });
   app.use('/api/', limiter);
   ```

### Frontend Optimizations

1. **Code splitting**
   ```javascript
   const PDFViewer = lazy(() => import('./components/PDFViewer'));
   ```

2. **Service worker for caching**
   - Enable in `index.js`
   - Cache static assets

## Domain Setup

### Custom Domain

1. **Purchase domain** (Namecheap, GoDaddy, etc.)

2. **Configure DNS**
   - Frontend: Point to Netlify/Vercel
   - Backend: Point to Render/Railway

3. **SSL Certificate**
   - Automatically provided by most platforms

## Monitoring & Analytics

### Error Tracking
```bash
npm install @sentry/node @sentry/react
```

### Analytics
- Google Analytics
- Mixpanel
- Plausible

## Backup Strategy

### Database
- Use cloud database (MongoDB Atlas, PostgreSQL on Railway)
- Regular backups

### File Storage
- Use cloud storage (AWS S3, Google Cloud Storage)
- CDN for file delivery

## Performance Monitoring

### Tools
- Google PageSpeed Insights
- GTmetrix
- Lighthouse

### Metrics to Track
- Time to First Byte (TTFB)
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)

## Security Checklist

- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] File upload validation
- [ ] Rate limiting implemented
- [ ] Security headers added
- [ ] Environment variables secured
- [ ] Dependencies updated

## Cost Estimation

### Free Tier
- **Netlify**: 100GB bandwidth/month
- **Render**: 750 hours/month
- **Total**: $0/month for small usage

### Paid Tiers
- **Netlify Pro**: $19/month
- **Render Starter**: $7/month
- **Total**: ~$26/month for production use

## Troubleshooting

### Common Issues

**Build Failures**
- Check Node.js version compatibility
- Clear npm cache
- Update dependencies

**CORS Errors**
- Update backend CORS configuration
- Check frontend API URLs

**File Upload Issues**
- Verify file size limits
- Check storage permissions
- Monitor disk space

**Performance Issues**
- Enable compression
- Optimize images
- Use CDN for static assets

---

This deployment guide should help you get your NotebookLM Clone running in production. Choose the platform combination that best fits your needs and budget.