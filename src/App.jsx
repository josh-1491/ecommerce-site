import { Routes, Route } from 'react-router';
import { HomePage } from './pages/HomePage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrdersPage } from './pages/OrdersPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { CartProvider } from './cart/CartContext';
import './App.css'

function App() {
  return (
    <CartProvider>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="products/:productId" element={<ProductDetailsPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="orders" element={<OrdersPage />} />
      </Routes>
    </CartProvider>
  )
}

export default App
