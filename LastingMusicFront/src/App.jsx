import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CDList from './components/CDList';
import ProfileDashboard from './components/ProfileDashboard';
import OrdersHistory from './components/OrdersHistory';
import CartDrawer from './components/CartDrawer';
import CDPlayerModal from './components/CDPlayerModal';
import ToastNotification from './components/ToastNotification';
import AdminPanel from './components/AdminPanel';
import LoginModal from './components/LoginModal';
import Footer from './components/Footer';

import { mockCDs, mockOrders } from './data/cds';

function App() {
  // Navigation State
  const [activeSection, setActiveSection] = useState('store'); // 'store' | 'profile' | 'orders' | 'admin'
  

  // User Session State (null = Guest, object = logged-in user)
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('lasting_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Todos');
  const [onlyObi, setOnlyObi] = useState(false);
  const [activeTab, setActiveTab] = useState('disponible'); // 'disponible' | 'transito' | 'encargo'

  // Cart State
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Custom CDs added by Admin (persisted in LocalStorage)
  const [customCDs, setCustomCDs] = useState(() => {
    const saved = localStorage.getItem('lasting_custom_cds');
    return saved ? JSON.parse(saved) : [];
  });

  // Combined CD Catalog
  const catalog = [...mockCDs, ...customCDs];

  // User Profile State (persisted in LocalStorage)
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('lasting_user_profile');
    return saved ? JSON.parse(saved) : {
      name: 'Álvaro Guerrero',
      email: 'alvaro.g@lastingmusic.com',
      phone: '+56 9 6123 4567',
      address: 'Av. Providencia 1240, Depto 402',
      city: 'Santiago',
      zipCode: '7500000',
      country: 'Chile',
      favoriteGenre: 'Hip-Hop',
      notifyRestocks: true
    };
  });

  // Orders State (persisted in LocalStorage)
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('lasting_orders');
    return saved ? JSON.parse(saved) : mockOrders;
  });

  // Selected CD Modal State
  const [selectedCD, setSelectedCD] = useState(null);


  // Toast / Notification State
  const [toast, setToast] = useState(null);

  // Sync catalog whenever customCDs changes
  useEffect(() => {
    localStorage.setItem('lasting_custom_cds', JSON.stringify(customCDs));
  }, [customCDs]);

  // LocalStorage sync effects for session & data
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('lasting_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('lasting_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('lasting_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('lasting_orders', JSON.stringify(orders));
  }, [orders]);


  // Guard routes if user drops their admin role
  useEffect(() => {
    if (activeSection === 'admin' && currentUser?.role !== 'admin') {
      setActiveSection('store');
    }
    if ((activeSection === 'profile' || activeSection === 'orders') && !currentUser) {
      setActiveSection('store');
    }
  }, [activeSection, currentUser]);

  // Toast Helper
  const showNotification = (message) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // Filtered CDs computation using dynamic catalog
  const filteredCDs = catalog.filter(cd => {
    const matchesStatus = cd.status === activeTab;
    const matchesGenre = selectedGenre === 'Todos' || cd.genre === selectedGenre;
    const matchesObi = !onlyObi || cd.hasObi;
    const matchesSearch = cd.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          cd.artist.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesGenre && matchesObi && matchesSearch;
  });

  // Count per tab using dynamic catalog
  const allCDsCount = {
    disponible: catalog.filter(c => c.status === 'disponible').length,
    transito: catalog.filter(c => c.status === 'transito').length,
    encargo: catalog.filter(c => c.status === 'encargo').length,
  };

  // Cart operations
  const addToCart = (cd) => {
    setCart((prevCart) => {
      const existing = prevCart.find(item => item.cd.id === cd.id);
      if (existing) {
        return prevCart.map(item => 
          item.cd.id === cd.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { cd, quantity: 1 }];
    });
    showNotification(`Añadido al pedido: ${cd.title}`);
  };

  const updateQuantity = (cdId, delta) => {
    setCart((prevCart) => {
      return prevCart.map(item => {
        if (item.cd.id === cdId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const removeFromCart = (cdId) => {
    setCart((prevCart) => prevCart.filter(item => item.cd.id !== cdId));
  };

  // Checkout with registration validations
  const handleCheckout = () => {
    if (cart.length === 0) return;

    // 1. Guard check: Guest users cannot order!
    if (!currentUser) {
      setIsCartOpen(false);
      setIsLoginModalOpen(true);
      showNotification('Debes registrarte o iniciar sesión para completar tu pedido.');
      return;
    }

    const cartSubtotal = cart.reduce((sum, item) => sum + (item.cd.price * item.quantity), 0);
    const shippingCost = cartSubtotal >= 50000 ? 0 : 3990;
    const cartTotal = cartSubtotal + shippingCost;

    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}-${cart[0].cd.status === 'encargo' ? 'JP' : 'CL'}`,
      date: new Date().toISOString().split('T')[0],
      total: cartTotal,
      status: cart[0].cd.status === 'encargo' ? 'placed' : 'shipped',
      statusLabel: cart[0].cd.status === 'encargo' ? 'Pedido Recibido (Importación Japón)' : 'Enviado desde Almacén',
      statusPercent: cart[0].cd.status === 'encargo' ? 20 : 50,
      items: cart.map(item => ({
        id: item.cd.id,
        title: item.cd.title,
        artist: item.cd.artist,
        price: item.cd.price,
        quantity: item.quantity,
        hasObi: item.cd.hasObi
      })),
      trackingNumber: `TRACK-${Math.floor(100000000 + Math.random() * 900000000)}`,
      carrier: cart[0].cd.status === 'encargo' ? 'Japan Post / CorreosChile' : 'Chilexpress Express',
      estimatedDelivery: cart[0].cd.status === 'encargo' ? '1-2 meses' : '2-4 días'
    };

    setOrders([newOrder, ...orders]);
    setCart([]);
    setIsCartOpen(false);
    setActiveSection('orders');
    showNotification('¡Pedido completado con éxito! Revisa su estado en la pestaña de Pedidos.');
  };

  // Custom Admin Handlers
  const handleAddCD = (newCD) => {
    setCustomCDs((prev) => [newCD, ...prev]);
  };

  const handleDeleteCD = (id) => {
    setCustomCDs((prev) => prev.filter(c => c.id !== id));
  };

  const handleUpdateCD = (updatedCD) => {
    setCustomCDs((prev) => prev.map(c => c.id === updatedCD.id ? updatedCD : c));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveSection('store');
    showNotification('Sesión cerrada.');
  };

  const dynamicGenres = ['Todos', ...new Set(catalog.map(cd => cd.genre))];
  const totalCartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <div className="min-h-screen dark bg-neutral-950 text-neutral-100 font-sans antialiased">
      
      {/* Toast Notification */}
      <ToastNotification message={toast} />

      {/* Top Navigation */}
      <Navbar 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        cartCount={totalCartCount}
        setIsCartOpen={setIsCartOpen}
        currentUser={currentUser}
        onLoginClick={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* VIEW 1: STORE */}
        {activeSection === 'store' && (
          <div>
            <Hero setActiveTab={setActiveTab} />
            <div id="tienda-cds" className="scroll-mt-24"></div>
            <CDList
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              selectedGenre={selectedGenre}
              setSelectedGenre={setSelectedGenre}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onlyObi={onlyObi}
              setOnlyObi={setOnlyObi}
              cds={filteredCDs}
              onSelectCD={setSelectedCD}
              onAddToCart={addToCart}
              allCDsCount={allCDsCount}
              genres={dynamicGenres}
            />
          </div>
        )}

        {/* VIEW 2: PROFILE DETAILS & CREDENTIALS (Protected) */}
        {activeSection === 'profile' && currentUser && (
          <ProfileDashboard
            userProfile={userProfile}
            setUserProfile={setUserProfile}
            ordersCount={orders.length}
            setActiveSection={setActiveSection}
          />
        )}

        {/* VIEW 3: ORDER LIST & HISTORY (Protected) */}
        {activeSection === 'orders' && currentUser && (
          <OrdersHistory
            orders={orders}
            setActiveSection={setActiveSection}
            showNotification={showNotification}
          />
        )}

        {/* VIEW 4: ADMIN PANEL (Protected & Guarded) */}
        {activeSection === 'admin' && currentUser?.role === 'admin' && (
          <AdminPanel
            onAddCD={handleAddCD}
            customCDs={customCDs}
            onDeleteCD={handleDeleteCD}
            onUpdateCD={handleUpdateCD}
            setActiveSection={setActiveSection}
          />
        )}

      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        onCheckout={handleCheckout}
      />

      {/* CD Detailed Preview Modal */}
      <CDPlayerModal
        cd={selectedCD}
        onClose={() => {
          setSelectedCD(null);
        }}
        onAddToCart={addToCart}
      />

      {/* Login & Registration Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setUserProfile((prev) => ({
            ...prev,
            name: user.name,
            email: user.email,
            phone: user.phone || prev.phone,
            address: user.address || prev.address,
            city: user.city || prev.city,
            zipCode: user.zipCode || prev.zipCode,
            country: user.country || prev.country
          }));
          showNotification(`¡Bienvenido de vuelta, ${user.name}!`);
        }}
      />

      {/* Footer */}
      <Footer 
        currentUser={currentUser} 
        setActiveSection={setActiveSection} 
      />

    </div>
  );
}

export default App;
