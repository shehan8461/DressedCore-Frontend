import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';
import DesignerDashboard from './Pages/Designer/Dashboard';
import NewDesign from './Pages/Designer/NewDesign';
import MyDesigns from './Pages/Designer/MyDesigns';
import DesignQuotes from './Pages/Designer/DesignQuotes';
import SupplierDashboard from './Pages/Supplier/Dashboard';
import BrowseDesigns from './Pages/Supplier/BrowseDesigns';
import DesignDetails from './Pages/Supplier/DesignDetails';
import MyQuotes from './Pages/Supplier/MyQuotes';
import Messages from './Pages/Messages';
import PaymentHistory from './Pages/PaymentHistory';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Designer Routes */}
              <Route
                path="/designer/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['Designer']}>
                    <DesignerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/designer/new-design"
                element={
                  <ProtectedRoute allowedRoles={['Designer']}>
                    <NewDesign />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/designer/designs"
                element={
                  <ProtectedRoute allowedRoles={['Designer']}>
                    <MyDesigns />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/designer/designs/:id/quotes"
                element={
                  <ProtectedRoute allowedRoles={['Designer']}>
                    <DesignQuotes />
                  </ProtectedRoute>
                }
              />

              {/* Supplier Routes */}
              <Route
                path="/supplier/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['Supplier']}>
                    <SupplierDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/supplier/designs"
                element={
                  <ProtectedRoute allowedRoles={['Supplier']}>
                    <BrowseDesigns />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/supplier/designs/:id"
                element={
                  <ProtectedRoute allowedRoles={['Supplier']}>
                    <DesignDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/supplier/quotes"
                element={
                  <ProtectedRoute allowedRoles={['Supplier']}>
                    <MyQuotes />
                  </ProtectedRoute>
                }
              />

              {/* Shared Routes - Messages and Payments */}
              <Route
                path="/messages"
                element={
                  <ProtectedRoute allowedRoles={['Designer', 'Supplier']}>
                    <Messages />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payments"
                element={
                  <ProtectedRoute allowedRoles={['Designer', 'Supplier']}>
                    <PaymentHistory />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
