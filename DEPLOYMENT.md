# Deployment Guide - AI Study Assistant

## Prerequisites

Before deploying, ensure you have:
- MongoDB database (MongoDB Atlas recommended)
- DigitalOcean account with AI API access
- Hosting platform account (Vercel, DigitalOcean App Platform, etc.)

---

## Environment Setup

### 1. MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user with password
4. Whitelist your IP address (or `0.0.0.0/0` for all IPs in production)
5. Get your connection string:
   ```
   mongodb+srv://<username>:<password>@cluster.mongodb.net/<database>?retryWrites=true&w=majority
   ```

### 2. DigitalOcean AI API

1. Sign up for [DigitalOcean](https://www.digitalocean.com/)
2. Navigate to API section
3. Generate an AI API key
4. Note your API endpoint (usually `https://api.digitalocean.com/v2/ai/inference`)

### 3. JWT Secret

Generate a secure random string (minimum 32 characters):

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or using OpenSSL
openssl rand -base64 32
```

---

## Deployment Platforms

### Option 1: Vercel (Recommended for Next.js)

#### Step 1: Prepare Your Repository
```bash
git add .
git commit -m "Ready for deployment"
git push origin master
```

#### Step 2: Deploy to Vercel
1. Go to [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Configure environment variables:
   - `MONGODB_URI`
   - `DO_API_KEY`
   - `DO_API_URL`
   - `JWT_SECRET`
   - `NODE_ENV=production`
   - `NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app`

#### Step 3: Deploy
- Click "Deploy"
- Vercel will automatically build and deploy your app
- Your app will be live at `https://your-project.vercel.app`

#### Vercel CLI Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

---

### Option 2: DigitalOcean App Platform

#### Step 1: Create App
1. Go to [DigitalOcean Apps](https://cloud.digitalocean.com/apps)
2. Click "Create App"
3. Connect your GitHub repository
4. Select the repository and branch

#### Step 2: Configure Build Settings
- **Build Command:** `npm run build`
- **Run Command:** `npm start`
- **Environment:** Node.js
- **HTTP Port:** 3000

#### Step 3: Environment Variables
Add the following environment variables:
```
MONGODB_URI=mongodb+srv://...
DO_API_KEY=sk-do-...
DO_API_URL=https://api.digitalocean.com/v2/ai/inference
JWT_SECRET=your-secret-key
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-app.ondigitalocean.app
```

#### Step 4: Deploy
- Click "Create Resources"
- DigitalOcean will build and deploy your app
- Access your app at the provided URL

---

### Option 3: Netlify

#### Step 1: Configure for Netlify
Create `netlify.toml` in root:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

#### Step 2: Deploy
1. Push code to GitHub
2. Go to [Netlify](https://www.netlify.com)
3. Import repository
4. Add environment variables (same as above)
5. Deploy

---

### Option 4: Self-Hosted (VPS/Docker)

#### Using PM2
```bash
# Install PM2
npm install -g pm2

# Build the application
npm run build

# Start with PM2
pm2 start npm --name "study-assistant" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

#### Using Docker
Create `Dockerfile`:
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t study-assistant .
docker run -p 3000:3000 --env-file .env.local study-assistant
```

---

## Post-Deployment Checklist

### 1. Test API Endpoints
```bash
# Test signup
curl -X POST https://your-domain.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'

# Test login
curl -X POST https://your-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### 2. Verify Database Connection
- Check MongoDB Atlas dashboard for connections
- Verify collections are being created

### 3. Test AI Integration
- Try generating a summary
- Create a quiz
- Use the chat feature

### 4. Monitor Performance
- Set up error monitoring (Sentry, LogRocket)
- Monitor API response times
- Check database query performance

---

## Troubleshooting

### Issue: MongoDB Connection Failed
**Solution:**
- Verify connection string is correct
- Check IP whitelist in MongoDB Atlas
- Ensure network connectivity

### Issue: AI API Errors
**Solution:**
- Verify DO_API_KEY is correct
- Check API quota/limits
- Verify API endpoint URL

### Issue: JWT Errors
**Solution:**
- Ensure JWT_SECRET is set
- Verify token is being sent in Authorization header
- Check token expiration (default: 7 days)

### Issue: Build Failures
**Solution:**
- Run `npm run build` locally first
- Check for TypeScript errors
- Verify all environment variables are set

---

## Scaling Considerations

### Database
- Use MongoDB Atlas auto-scaling
- Enable connection pooling
- Add indexes for frequently queried fields

### API Rate Limiting
Consider adding rate limiting:
```typescript
// lib/rateLimit.ts
import rateLimit from 'express-rate-limit'

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})
```

### Caching
- Implement Redis for session caching
- Cache AI responses for common queries
- Use CDN for static assets

### Load Balancing
- Use platform-provided load balancing
- Deploy to multiple regions
- Implement health checks

---

## Security Best Practices

1. **Environment Variables:**
   - Never commit `.env.local` to Git
   - Use platform secret management
   - Rotate keys regularly

2. **HTTPS:**
   - Always use HTTPS in production
   - Enable HSTS headers
   - Configure secure cookies

3. **CORS:**
   ```typescript
   // Configure CORS in next.config.js
   module.exports = {
     async headers() {
       return [
         {
           source: '/api/:path*',
           headers: [
             { key: 'Access-Control-Allow-Origin', value: 'https://your-domain.com' }
           ]
         }
       ]
     }
   }
   ```

4. **Rate Limiting:**
   - Implement API rate limiting
   - Use DDoS protection
   - Monitor for abuse

---

## Monitoring & Logging

### Recommended Tools
- **Error Tracking:** Sentry
- **Performance:** Vercel Analytics, New Relic
- **Logs:** LogRocket, Papertrail
- **Uptime:** UptimeRobot, Pingdom

### Setup Sentry (Example)
```bash
npm install @sentry/nextjs

# Initialize
npx @sentry/wizard -i nextjs
```

---

## Backup & Recovery

### Database Backups
- Enable automated backups in MongoDB Atlas
- Schedule regular snapshots
- Test restore procedures

### Code Backups
- Use Git for version control
- Tag releases
- Maintain changelog

---

## Support

For issues or questions:
- Check [API Documentation](./API_DOCUMENTATION.md)
- Review [README](./README.md)
- Open GitHub issue
- Contact support team

---

**Deployment Status:** ✅ Ready for Production

Your AI Study Assistant is now deployed and ready to help students learn smarter!
