# Dressed™ Frontend

React-based frontend application for the Dressed™ fashion design and manufacturing platform.

## 🚀 Features

### For Designers
- **Design Submission**: Upload design concepts with specifications
- **Quote Management**: Receive and compare quotes from multiple suppliers
- **Dashboard**: Track design submissions and quote status
- **Portfolio**: View all submitted designs and their progress

### For Suppliers
- **Browse Designs**: Discover new design opportunities by category
- **Submit Quotes**: Provide competitive quotations with delivery estimates
- **Quote Tracking**: Monitor submitted quotes and acceptance status
- **Dashboard**: View statistics and recent activities

### Common Features
- **Authentication**: Secure login/registration with JWT
- **Role-Based Access**: Designer and Supplier specific interfaces
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Updates**: Dynamic data fetching and state management

## 🛠️ Technology Stack

- **React 19.2.0**: UI library
- **React Router 7.1.3**: Client-side routing
- **Axios 1.7.9**: HTTP client for API calls
- **Vite 7.2.4**: Build tool and dev server
- **CSS3**: Custom styling with responsive design

## 📋 Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Backend API running on port 5000 (or configured in `.env`)

## 🏗️ Installation

1. **Navigate to frontend directory**:
   ```bash
   cd "DressedCore Frontend"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env`:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

## 🚦 Running the Application

### Development Mode
```bash
npm run dev
```
Access at: http://localhost:3000

### Production Build
```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
DressedCore Frontend/
├── src/
│   ├── components/           # Reusable components
│   │   ├── Navbar.jsx       # Navigation bar
│   │   └── ProtectedRoute.jsx  # Route protection
│   ├── context/             # React Context
│   │   └── AuthContext.jsx  # Authentication state
│   ├── services/            # API services
│   │   └── api.js           # Axios instance & API calls
│   ├── Pages/               # Page components
│   │   ├── Home.jsx         # Landing page
│   │   ├── Login.jsx        # Login page
│   │   ├── Register.jsx     # Registration page
│   │   ├── Designer/        # Designer portal
│   │   │   ├── Dashboard.jsx
│   │   │   ├── NewDesign.jsx
│   │   │   ├── MyDesigns.jsx
│   │   │   └── DesignQuotes.jsx
│   │   └── Supplier/        # Supplier portal
│   │       ├── Dashboard.jsx
│   │       ├── BrowseDesigns.jsx
│   │       ├── DesignDetails.jsx
│   │       └── MyQuotes.jsx
│   ├── styles/              # CSS modules
│   │   ├── auth.css        # Authentication styles
│   │   ├── dashboard.css   # Dashboard styles
│   │   └── details.css     # Detail pages styles
│   ├── App.jsx             # Main app component
│   ├── App.css             # App-level styles
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── public/                  # Static assets
├── .env                     # Environment variables
├── .env.example             # Environment template
├── Dockerfile              # Docker configuration
├── nginx.conf              # Nginx configuration
├── package.json            # Dependencies
├── vite.config.js          # Vite configuration
└── README.md               # This file
```

## 🔐 Authentication Flow

1. **Registration**: Users register as Designer or Supplier
2. **Login**: JWT token issued upon successful authentication
3. **Token Storage**: Token stored in localStorage
4. **API Calls**: Token automatically attached to all API requests
5. **Auto Redirect**: Unauthenticated users redirected to login

## 🎨 Design System

### Color Palette
- **Primary**: #6366f1 (Indigo)
- **Success**: #10b981 (Green)
- **Warning**: #d97706 (Orange)
- **Error**: #dc2626 (Red)
- **Neutral**: Gray scale

### Status Colors
- **Draft**: Gray
- **Published**: Blue
- **Quoting Open**: Yellow
- **Ordered**: Green
- **Completed**: Purple
- **Accepted**: Green
- **Rejected**: Red

## 🔌 API Integration

The frontend connects to the backend API through the configured `VITE_API_URL`.

### API Endpoints Used

**Authentication**:
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/validate` - Token validation

**Designs**:
- `GET /api/designs` - Get all designs (with optional category filter)
- `GET /api/designs/{id}` - Get specific design
- `GET /api/designs/designer/{designerId}` - Get designer's designs
- `POST /api/designs` - Create new design
- `PATCH /api/designs/{id}/status` - Update design status
- `DELETE /api/designs/{id}` - Delete design

**Quotes**:
- `GET /api/quotes/{id}` - Get specific quote
- `GET /api/quotes/design/{designId}` - Get quotes for design
- `GET /api/quotes/supplier/{supplierId}` - Get supplier's quotes
- `POST /api/quotes` - Create new quote
- `PATCH /api/quotes/{id}/status` - Update quote status
- `DELETE /api/quotes/{id}` - Delete quote

## 🧪 Testing

### Manual Testing

**Test Designer Flow**:
1. Register as Designer
2. Create a new design
3. View submitted designs
4. Check quotes received
5. Accept/reject quotes

**Test Supplier Flow**:
1. Register as Supplier
2. Browse available designs
3. View design details
4. Submit a quote
5. Check quote status

### Demo Accounts
- **Designer**: designer@example.com / designer123
- **Supplier**: supplier@example.com / supplier123

## 🐳 Docker Deployment

### Build Image
```bash
docker build -t dressedcore-frontend .
```

### Run Container
```bash
docker run -p 3000:80 -e VITE_API_URL=http://your-api-url dressedcore-frontend
```

### Docker Compose
The frontend is included in the root `docker-compose.yml`:
```bash
cd ../
docker-compose up frontend
```

## 📱 Responsive Design

The application is fully responsive and works on:
- **Desktop**: 1200px+ (Full features)
- **Tablet**: 768px - 1199px (Adapted layout)
- **Mobile**: < 768px (Stacked layout)

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| VITE_API_URL | Backend API base URL | http://localhost:5000 |

### Vite Configuration

The `vite.config.js` includes:
- React plugin
- Port configuration (3000)
- Proxy settings (if needed)

## 🚨 Troubleshooting

### Common Issues

**1. "Cannot connect to API"**
- Check backend is running
- Verify VITE_API_URL in `.env`
- Check CORS configuration on backend

**2. "Module not found"**
- Run `npm install`
- Clear node_modules: `rm -rf node_modules && npm install`

**3. "Token expired"**
- Log out and log in again
- Clear localStorage: `localStorage.clear()`

**4. "Build fails"**
- Check Node.js version (18+)
- Run `npm install` again
- Check for syntax errors

## 📝 Development Guidelines

### Code Style
- Use functional components with hooks
- Keep components small and focused
- Use meaningful variable names
- Comment complex logic

### State Management
- Use Context API for global state (Auth)
- Use local state for component-specific data
- Lift state up when shared between components

### API Calls
- All API calls in `services/api.js`
- Handle errors gracefully
- Show loading states
- Display user-friendly error messages

## 🔄 Future Enhancements

- [ ] File upload to Azure Blob Storage
- [ ] Real-time notifications with SignalR
- [ ] Advanced search and filtering
- [ ] Designer portfolio pages
- [ ] Supplier rating and reviews
- [ ] Order management integration
- [ ] Payment processing
- [ ] Chat between designers and suppliers
- [ ] Design version history
- [ ] Export reports (PDF/Excel)

## 📄 License

This project is part of the Dressed™ platform educational project.

## 👥 Contributors

Built as part of the microservices architecture implementation.

## 📞 Support

For issues or questions, please refer to the main project documentation.

---

**Dressed™** - Connecting Fashion Designers with Quality Manufacturers
