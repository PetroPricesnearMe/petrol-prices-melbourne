# 🚀 Melbourne Fuel Website - Setup Instructions

## 📋 Prerequisites

- Node.js 16+ and npm
- Git
- Modern web browser
- Mapbox account (free tier available)

## 🛠️ Installation Steps

### 1. Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd PPNM

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Environment Configuration

Create a `.env` file in the project root:

```bash
# Copy the example file
cp env.example .env

# Edit .env with your actual values
nano .env
```

**Required Environment Variables:**

```env
# Mapbox Configuration (REQUIRED for maps to work)
REACT_APP_MAPBOX_ACCESS_TOKEN=your_actual_mapbox_token_here

# Baserow Configuration
REACT_APP_BASEROW_TOKEN=your_baserow_token_here
REACT_APP_BASEROW_API_URL=https://api.baserow.io/api

# Backend API Configuration
REACT_APP_API_URL=http://localhost:3001

# Application Configuration
REACT_APP_APP_NAME=Petrol Prices Near Me
REACT_APP_APP_DESCRIPTION=Melbourne Petrol Stations - Live Fuel Prices
```

### 3. Get Mapbox Access Token

1. Go to [Mapbox Account](https://account.mapbox.com/access-tokens/)
2. Sign up for a free account
3. Create a new token with these permissions:
   - `styles:read`
   - `styles:tiles`
4. Copy the token to your `.env` file

### 4. Start Development Servers

```bash
# Terminal 1: Start backend server
npm run backend

# Terminal 2: Start frontend server
npm run frontend

# Or use the combined command
npm run dev
```

## 🌐 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/

## 🔧 Troubleshooting

### Map Not Loading
- Check `REACT_APP_MAPBOX_ACCESS_TOKEN` is set correctly
- Verify token has proper permissions
- Check browser console for errors

### Backend Connection Issues
- Ensure backend server is running on port 3001
- Check CORS configuration in backend/config.js
- Verify Baserow API credentials

### Common Issues

#### "Mapbox access token not configured"
- Create `.env` file with valid Mapbox token
- Restart development server after adding token

#### "Failed to fetch stations"
- Check Baserow API credentials
- Verify internet connection
- Check backend server status

#### "CORS errors"
- Ensure backend is running
- Check CORS configuration
- Verify frontend URL in backend config

## 📱 Testing

### Manual Testing Checklist
- [ ] Homepage loads without errors
- [ ] Navigation works on all pages
- [ ] Map loads with stations (if token configured)
- [ ] Directory page shows station data
- [ ] All links work correctly
- [ ] Mobile responsiveness
- [ ] Error boundaries catch errors gracefully

### Browser Testing
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Mobile Testing
- iOS Safari
- Android Chrome
- Responsive design breakpoints

## 🚀 Production Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Manual Deployment
```bash
# Build production version
npm run build

# Serve from build directory
npx serve -s build
```

## 📊 Performance Monitoring

The website includes built-in performance monitoring:
- Core Web Vitals tracking
- Console logging for LCP and FID
- Error boundary logging
- Network request monitoring

## 🔒 Security Notes

- Never commit `.env` files to version control
- Use HTTPS in production
- Validate all user inputs
- Implement rate limiting for API endpoints

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review browser console for errors
3. Check backend server logs
4. Verify environment configuration

## 🎯 Next Steps

After successful setup:
1. Customize station data in Baserow
2. Add real fuel price data
3. Implement user authentication
4. Add more interactive features
5. Optimize for production performance
