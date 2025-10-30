# 🐛 Debugging Guide

## Common Issues and Solutions

### Backend Issues

#### Issue: "Cannot find module" errors
**Cause**: Missing dependencies after switching to TypeScript backend
**Solution**:
```bash
cd backend
npm install
```

#### Issue: "BASEROW_TOKEN is undefined"
**Cause**: Missing or incorrect environment variable
**Solution**:
```bash
# Copy environment template
cp env.example .env
# Edit .env and add your actual Baserow token
```

#### Issue: Server fails to start with TypeScript errors
**Cause**: TypeScript compilation issues
**Solution**:
```bash
# Check for type errors
npm run type-check
# Install missing @types packages if needed
npm install @types/node @types/express --save-dev
```

### Frontend Issues

#### Issue: API connection failed
**Cause**: Backend not running or wrong URL
**Solution**:
1. Ensure backend is running on port 3001
2. Check CORS configuration in backend config

#### Issue: Map not loading
**Cause**: Missing map dependencies or API keys
**Solution**:
```bash
# Check if mapbox-gl is installed
npm list mapbox-gl
```

### Environment Variables

Required environment variables:
- `BASEROW_TOKEN` - Your Baserow API token (required)
- `PORT` - Backend port (default: 3001)
- `NODE_ENV` - Environment (development/production)

### Logging and Monitoring

The TypeScript backend includes comprehensive logging:
- Request/response logging with Morgan
- Error tracking with Sentry (if configured)
- Console logs with emojis for easy identification

### Development vs Production

- **Development**: Use `npm run dev` (uses ts-node)
- **Production**: Use `npm run build && npm start` (compiled JS)

### Performance Issues

1. **Slow API responses**: Check Baserow API rate limits
2. **Memory leaks**: Monitor with `process.memoryUsage()`
3. **High CPU**: Check for infinite loops in data processing
