import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { CategoryFilter } from './components/CategoryFilter';
import { MenuCard } from './components/MenuCard';
import { ItemDetailModal } from './components/ItemDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutStep2 } from './components/CheckoutStep2';
import { QrisModal } from './components/QrisModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { OrderHistoryModal } from './components/OrderHistoryModal';
import { InfoLocationModal } from './components/InfoLocationModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { StickyBottomBar } from './components/StickyBottomBar';
import { Footer } from './components/Footer';

import {
  CATEGORIES,
  INITIAL_MENU_ITEMS,
  INITIAL_STORE_CONFIG,
  DB_ATTACHMENT_PATH
} from './data/initialData';
import { CartItem, MenuItem, OrderRecord, StoreConfig } from './types';
import { generateWhatsAppLink, sendOrderToGoogleAppsScript } from './utils/formatters';
import { parseDimsumCSV } from './utils/csvParser';

const STORAGE_KEYS = {
  MENU: 'dimsumanyu_menu_v2',
  CONFIG: 'dimsumanyu_config_v1',
  CART: 'dimsumanyu_cart_v1',
  ORDERS: 'dimsumanyu_orders_v1'
};

export default function App() {
  // Store Config
  const [config, setConfig] = useState<StoreConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONFIG);
      return saved ? JSON.parse(saved) : INITIAL_STORE_CONFIG;
    } catch {
      return INITIAL_STORE_CONFIG;
    }
  });

  // Menu Items
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MENU);
      return saved ? JSON.parse(saved) : INITIAL_MENU_ITEMS;
    } catch {
      return INITIAL_MENU_ITEMS;
    }
  });

  // Cart: Record<itemId, CartItem>
  const [cart, setCart] = useState<Record<string, CartItem>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Order History
  const [orders, setOrders] = useState<OrderRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Active view & filtering
  const [step, setStep] = useState<1 | 2>(1);
  const [activeCategory, setActiveCategory] = useState<string>('SEMUA');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyBestSeller, setOnlyBestSeller] = useState<boolean>(false);

  // Modals state
  const [selectedDetailItem, setSelectedDetailItem] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isQrisModalOpen, setIsQrisModalOpen] = useState(false);
  const [isOrderSuccessOpen, setIsOrderSuccessOpen] = useState(false);
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Pending / Active Order
  const [currentOrder, setCurrentOrder] = useState<OrderRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Automatically link and load the database CSV from /assets/aistudio/DB_DIMSUMANYU_32b8c893
  const reloadFromDatabaseFile = async () => {
    try {
      const res = await fetch(DB_ATTACHMENT_PATH);
      if (res.ok) {
        const text = await res.text();
        const parsed = parseDimsumCSV(text);
        if (parsed.length > 0) {
          setMenuItems(parsed);
          localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(parsed));
        }
      }
    } catch (err) {
      console.warn('Could not auto-fetch DB file:', err);
    }
  };

  useEffect(() => {
    // Linked to DB file on mount
    reloadFromDatabaseFile();
  }, []);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
    } catch (e) {
      console.warn('Failed to save config:', e);
    }
  }, [config]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(menuItems));
    } catch (e) {
      console.warn('Failed to save menu:', e);
    }
  }, [menuItems]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (e) {
      console.warn('Failed to save cart:', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.warn('Failed to save orders:', e);
    }
  }, [orders]);

  // Totals calculations
  const cartList = Object.values(cart);
  const cartItemsCount = cartList.reduce((acc, c) => acc + c.qty, 0);
  const cartTotalAmount = cartList.reduce((acc, c) => acc + c.menu.harga * c.qty, 0);

  // Dynamic categories from linked menu items
  const dynamicCategories = useMemo(() => {
    const rawCategories = Array.from(new Set(menuItems.map((m) => m.kategori)));
    return ['SEMUA', ...rawCategories];
  }, [menuItems]);

  // Filtered menu items
  const filteredMenuItems = useMemo(() => {
    return menuItems.filter((item) => {
      // Category filter
      if (activeCategory !== 'SEMUA' && item.kategori !== activeCategory) {
        return false;
      }
      // Best seller filter
      if (onlyBestSeller && !item.keterangan?.includes('BEST SELLER')) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = item.nama.toLowerCase().includes(q);
        const matchDesc = item.deskripsi.toLowerCase().includes(q);
        const matchCat = item.kategori.toLowerCase().includes(q);
        return matchName || matchDesc || matchCat;
      }
      return true;
    });
  }, [menuItems, activeCategory, onlyBestSeller, searchQuery]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      SEMUA: menuItems.length
    };
    menuItems.forEach((item) => {
      counts[item.kategori] = (counts[item.kategori] || 0) + 1;
    });
    return counts;
  }, [menuItems]);

  // Cart operations
  const handleUpdateQty = (item: MenuItem, change: number) => {
    setCart((prev) => {
      const current = prev[item.id]?.qty || 0;
      const next = current + change;
      const copy = { ...prev };

      if (next <= 0) {
        delete copy[item.id];
      } else {
        copy[item.id] = {
          menu: item,
          qty: next,
          catatanItem: copy[item.id]?.catatanItem
        };
      }
      return copy;
    });
  };

  const handleAddToCartWithNote = (item: MenuItem, qty: number, note?: string) => {
    setCart((prev) => {
      const current = prev[item.id]?.qty || 0;
      return {
        ...prev,
        [item.id]: {
          menu: item,
          qty: current + qty,
          catatanItem: note || prev[item.id]?.catatanItem
        }
      };
    });
  };

  const handleClearCart = () => {
    setCart({});
  };

  // Reorder from history
  const handleReorder = (pastOrder: OrderRecord) => {
    const newCart: Record<string, CartItem> = {};
    pastOrder.items.forEach((pastItem) => {
      const found = menuItems.find((m) => m.id === pastItem.id) || {
        id: pastItem.id,
        nama: pastItem.nama,
        kategori: 'Dimsum Kukus',
        harga: pastItem.harga,
        status: 'TERSEDIA',
        keterangan: '',
        deskripsi: '',
        porsi: 'Isi ' + pastItem.qty + ' pcs',
        gambar: ''
      };

      newCart[pastItem.id] = {
        menu: found,
        qty: pastItem.qty
      };
    });

    setCart(newCart);
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step transition
  const handleProceedToStep2 = () => {
    if (cartItemsCount === 0) return;
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToMenu = () => {
    setStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Submit Order from Step 2
  const handleSubmitOrder = async (newOrder: OrderRecord) => {
    setIsSubmitting(true);
    setCurrentOrder(newOrder);

    // 1. Save order to customer history
    setOrders((prev) => [newOrder, ...prev]);

    // 2. Asynchronously notify Google Apps Script Web App (matching the original apps script behavior)
    if (config.appScriptUrl) {
      sendOrderToGoogleAppsScript(config.appScriptUrl, newOrder).catch((err) => {
        console.warn('Apps Script sync background alert:', err);
      });
    }

    // 3. Clear cart
    setCart({});
    setIsSubmitting(false);

    // 4. Handle based on payment method
    if (newOrder.metodeBayar === 'QRIS') {
      setIsQrisModalOpen(true);
    } else {
      // Directly open WhatsApp
      const waUrl = generateWhatsAppLink(config, newOrder);
      window.location.href = waUrl;
      setIsOrderSuccessOpen(true);
    }
  };

  // When QRIS payment is confirmed
  const handleConfirmQrisAndOpenWA = () => {
    setIsQrisModalOpen(false);
    if (currentOrder) {
      const waUrl = generateWhatsAppLink(config, currentOrder);
      window.location.href = waUrl;
      setIsOrderSuccessOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans selection:bg-red-100 selection:text-red-900">
      {/* Top Header conforming to Top Bar Contract */}
      <Header
        config={config}
        step={step}
        setStep={setStep}
        cartCount={cartItemsCount}
        cartTotal={cartTotalAmount}
        openCartDrawer={() => setIsCartOpen(true)}
        openHistoryModal={() => setIsOrderHistoryOpen(true)}
        openInfoModal={() => setIsInfoModalOpen(true)}
        openAdminModal={() => setIsAdminModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {step === 1 ? (
          <div>
            {/* Hero Banner Section */}
            <HeroBanner
              config={config}
              onExploreClick={() => {
                const el = document.getElementById('catalog-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Catalog Section */}
            <section id="catalog-section">
              {/* Category & Search Controls */}
              <CategoryFilter
                categories={dynamicCategories}
                activeCategory={activeCategory}
                onSelectCategory={setActiveCategory}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onlyBestSeller={onlyBestSeller}
                onToggleBestSeller={() => setOnlyBestSeller(!onlyBestSeller)}
                categoryCounts={categoryCounts}
              />

              {/* Menu Grid */}
              {filteredMenuItems.length === 0 ? (
                <div className="py-16 text-center bg-white rounded-3xl border border-stone-200 p-8 my-6">
                  <div className="text-4xl mb-3">🔍</div>
                  <h3 className="font-extrabold text-stone-900 text-base mb-1">
                    Menu Dimsum Tidak Ditemukan
                  </h3>
                  <p className="text-xs text-stone-500 max-w-xs mx-auto mb-4">
                    Tidak ada menu yang sesuai dengan kata kunci atau filter yang Anda pilih.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setActiveCategory('SEMUA');
                      setOnlyBestSeller(false);
                    }}
                    className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition"
                  >
                    Tampilkan Semua Menu
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
                  {filteredMenuItems.map((item) => (
                    <MenuCard
                      key={item.id}
                      item={item}
                      cartQty={cart[item.id]?.qty || 0}
                      onUpdateQty={handleUpdateQty}
                      onOpenDetail={(i) => setSelectedDetailItem(i)}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        ) : (
          /* Step 2: Checkout Form & Payment */
          <CheckoutStep2
            config={config}
            cart={cart}
            onBackToMenu={handleBackToMenu}
            onSubmitOrder={handleSubmitOrder}
            isSubmitting={isSubmitting}
          />
        )}
      </main>

      {/* Sticky Bottom Bar (Active on Step 1) */}
      {step === 1 && (
        <StickyBottomBar
          totalAmount={cartTotalAmount}
          totalItems={cartItemsCount}
          onProceedOrder={handleProceedToStep2}
          onOpenCart={() => setIsCartOpen(true)}
        />
      )}

      {/* Footer */}
      <Footer
        config={config}
        onOpenInfo={() => setIsInfoModalOpen(true)}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
      />

      {/* Modals */}
      <ItemDetailModal
        item={selectedDetailItem}
        isOpen={!!selectedDetailItem}
        onClose={() => setSelectedDetailItem(null)}
        onAddToCart={handleAddToCartWithNote}
        currentCartQty={selectedDetailItem ? cart[selectedDetailItem.id]?.qty || 0 : 0}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQty={handleUpdateQty}
        onClearCart={handleClearCart}
        onProceedCheckout={handleProceedToStep2}
      />

      {currentOrder && (
        <QrisModal
          isOpen={isQrisModalOpen}
          onClose={() => setIsQrisModalOpen(false)}
          totalAmount={currentOrder.totalHarga}
          invoiceNumber={currentOrder.invoiceNumber}
          onConfirmAndOpenWA={handleConfirmQrisAndOpenWA}
        />
      )}

      <OrderSuccessModal
        isOpen={isOrderSuccessOpen}
        onClose={() => setIsOrderSuccessOpen(false)}
        order={currentOrder}
        config={config}
        onStartNewOrder={() => {
          setIsOrderSuccessOpen(false);
          setStep(1);
        }}
      />

      <OrderHistoryModal
        isOpen={isOrderHistoryOpen}
        onClose={() => setIsOrderHistoryOpen(false)}
        orders={orders}
        onReorder={handleReorder}
        onViewOrder={(ord) => {
          setCurrentOrder(ord);
          setIsOrderSuccessOpen(true);
        }}
      />

      <InfoLocationModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        config={config}
      />

      <AdminPanelModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        config={config}
        onUpdateConfig={setConfig}
        menuItems={menuItems}
        onUpdateMenuItems={setMenuItems}
        onResetMenu={() => setMenuItems(INITIAL_MENU_ITEMS)}
        onReloadFromDB={reloadFromDatabaseFile}
        orders={orders}
        onUpdateOrderStatus={(id, newStatus) => {
          setOrders((prev) =>
            prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
          );
        }}
        onClearOrders={() => setOrders([])}
      />
    </div>
  );
}
