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

## Technology Stack

### Frontend (Static React Application)
- **React 18** - Modern React with hooks and functional components
- **React Router Dom** - Client-side routing
- **Mapbox GL** - Interactive maps
- **Framer Motion** - Smooth animations and transitions
- **Styled Components** - Component-based styling
- **Axios** - HTTP client for API requests

### Data Source
- **Baserow API** - Direct API integration for petrol station data
- **622 petrol stations** - Live data from Baserow database
- **Real-time updates** - Data refreshed from Baserow

### Deployment
- **Vercel** - Static site hosting with automatic deployments
- **GoDaddy** - Domain management
- **GitHub** - Version control and CI/CD integration

### Styling
- **CSS3** with modern features (Grid, Flexbox, CSS Variables)
- **Inter Font** - Clean, modern typography
- **Responsive Design** - Mobile-first approach
- **CSS Animations** - Smooth transitions and effects

## Installation & Setup

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn package manager
- Baserow API token (for data access)

### Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/melbourne-petrol-stations.git
   cd melbourne-petrol-stations
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local and add your Baserow API token
   ```

4. **Start the development server:**
   ```bash
   npm start
   ```

5. **Access the application:**
   - Open http://localhost:3000 in your browser
   - The app will automatically reload when you make changes

### Environment Variables

Create a `.env.local` file in the root directory:
```env
REACT_APP_BASEROW_TOKEN=your_baserow_token_here
REACT_APP_BASEROW_API_URL=https://api.baserow.io/api
```

**Note:** This is a static React application. There is no backend server - data is fetched directly from Baserow API.

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

### Alternative: Netlify

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
├── public/              # Static assets
│   ├── images/
│   ├── favicon.ico
│   ├── manifest.json
│   └── sitemap.xml
├── src/                 # React application source
│   ├── components/      # React components
│   ├── config/          # Configuration files
│   ├── hooks/           # Custom React hooks
│   ├── services/        # API services
│   ├── styles/          # Global styles
│   ├── utils/           # Utility functions
│   ├── App.js
│   ├── index.js
│   └── config.js        # Baserow API configuration
├── docs/                # Documentation
│   ├── setup/
│   ├── development/
│   └── architecture/
├── package.json         # Dependencies and scripts
├── vercel.json          # Vercel deployment config
├── .env.example         # Environment variables template
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