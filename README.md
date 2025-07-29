# Melbourne Petrol Stations Directory

A modern, interactive web application that features a directory of petrol stations in Melbourne with real-time fuel prices and an interactive map.

## Features

### 🏠 Home Page
- Full-page header with bold color contrasts
- Hero section with "Petrol Prices Near Me" heading  
- Navigation buttons to live map and fuel prices
- Responsive design with animations and modern aesthetics
- Statistics display and feature cards

### 🗺️ Interactive Live Map Page
- Interactive map showing all petrol stations in Melbourne
- Real-time fuel price updates using WebSockets
- Custom markers with color-coded pricing (green = cheap, yellow = average, red = expensive)
- Fuel type selector (Unleaded 91, Premium 95, Diesel)
- Detailed popup information for each station
- Modern map styling with Leaflet integration

### 📋 Directory Page  
- Grid layout displaying petrol stations (5 per row on desktop)
- Advanced search functionality by name, suburb, or brand
- Filter by fuel brand and sort by various criteria
- Interactive station cards with hover effects
- Complete station information including prices, hours, and contact details
- Responsive design adapting to different screen sizes

### 🚀 Backend API
- RESTful API built with Express.js
- WebSocket integration with Socket.io for real-time updates
- Multiple endpoints for station data and price information
- CORS enabled for frontend integration
- Mock data simulation for Melbourne petrol stations

## Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **React Router Dom** - Client-side routing
- **Leaflet & React-Leaflet** - Interactive maps
- **Framer Motion** - Smooth animations and transitions
- **Socket.io Client** - Real-time WebSocket communication
- **Styled Components** - Component-based styling
- **Axios** - HTTP client for API requests

### Backend
- **Node.js & Express** - Server-side JavaScript runtime and framework
- **Socket.io** - Real-time bidirectional communication
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logging
- **Dotenv** - Environment variable management

### Styling
- **CSS3** with modern features (Grid, Flexbox, CSS Variables)
- **Inter Font** - Clean, modern typography
- **Responsive Design** - Mobile-first approach
- **CSS Animations** - Smooth transitions and effects

## Installation & Setup

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn package manager

### Frontend Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Access the application:**
   - Open http://localhost:3000 in your browser
   - The app will automatically reload when you make changes

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install backend dependencies:**
   ```bash
   npm install
   ```

3. **Start the backend server:**
   ```bash
   npm run dev
   ```
   or for production:
   ```bash
   npm start
   ```

4. **Backend will be available at:**
   - API: http://localhost:3001
   - WebSocket: ws://localhost:3001

### API Endpoints

- `GET /` - API information and available endpoints
- `GET /api/stations` - Get all petrol stations
- `GET /api/stations/:id` - Get specific station by ID
- `GET /api/stations/search?q=query&brand=brand&suburb=suburb` - Search stations
- `GET /api/prices/lowest?fuelType=unleaded&limit=5` - Get lowest prices

### Environment Variables

Create a `.env` file in the backend directory:
```env
PORT=3001
NODE_ENV=development
```

## Deployment

### Frontend Deployment (Vercel)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Build the project:**
   ```bash
   npm run build
   ```

3. **Deploy to Vercel:**
   ```bash
   vercel --prod
   ```

4. **Vercel Configuration:**
   Create `vercel.json` in the root directory:
   ```json
   {
     "builds": [
       {
         "src": "package.json",
         "use": "@vercel/static-build",
         "config": {
           "distDir": "build"
         }
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "/index.html"
       }
     ]
   }
   ```

### Backend Deployment

For production deployment, consider:
- **Heroku** - Easy deployment with Git integration
- **Railway** - Modern platform with WebSocket support
- **DigitalOcean App Platform** - Scalable container-based hosting
- **AWS/Google Cloud** - Full control over infrastructure

### Alternative: Netlify (Frontend Only)

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy build folder to Netlify:**
   - Drag and drop the `build` folder to Netlify dashboard
   - Or connect your Git repository for continuous deployment

## Project Structure

```
melbourne-petrol-stations/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── HomePage.js
│   │   ├── HomePage.css
│   │   ├── MapPage.js
│   │   ├── MapPage.css
│   │   ├── DirectoryPage.js
│   │   ├── DirectoryPage.css
│   │   ├── Navbar.js
│   │   └── Navbar.css
│   ├── App.js
│   ├── index.js
│   └── index.css
├── backend/
│   ├── server.js
│   └── package.json
├── package.json
└── README.md
```

## Features in Detail

### Real-time Updates
- WebSocket connection provides live fuel price updates
- Prices update automatically every 15 seconds
- Visual indicators show recent price changes
- Connection status monitoring

### Interactive Map
- Centered on Melbourne CBD
- Custom fuel station markers
- Color-coded pricing system
- Detailed popups with all station information
- Smooth zoom and pan interactions

### Search & Filtering
- Real-time search across station names, suburbs, and brands
- Brand filtering (Shell, BP, Caltex, 7-Eleven, United, Ampol)
- Multiple sorting options (name, price, suburb)
- Results counter and "no results" handling

### Responsive Design
- Mobile-first approach
- Breakpoints: 480px, 768px, 992px, 1200px
- Adaptive grid layouts (5→4→3→2→1 columns)
- Touch-friendly interface on mobile devices

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Performance Optimizations

- Lazy loading of map components
- Optimized image loading
- CSS animations using transform and opacity
- Efficient re-rendering with React best practices
- WebSocket connection management

## Future Enhancements

- User location detection
- Route planning to cheapest station
- Price history charts
- Push notifications for price drops
- User reviews and ratings
- Fuel type availability tracking
- Station amenities (car wash, shop, etc.)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email [support@melbournefuel.com](mailto:support@melbournefuel.com) or create an issue in the GitHub repository.

---

Made with ❤️ in Melbourne 