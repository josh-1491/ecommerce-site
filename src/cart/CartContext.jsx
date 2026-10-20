import { useEffect, useState } from 'react';
import { CartContext } from './context';
import { products } from '../data/products';

const storageKey = 'ecommerce-cart';
const ordersStorageKey = 'ecommerce-orders';

function readCart() {
  const savedCart = localStorage.getItem(storageKey);
  if (!savedCart) {
    return [];
  }

  try {
    const parsedCart = JSON.parse(savedCart);
    if (!Array.isArray(parsedCart)) {
      throw new Error('Saved cart must be an array.');
    }

    return parsedCart.filter((item) =>
      products.some((product) => product.id === item.productId)
      && Number.isInteger(item.quantity)
      && item.quantity > 0
      && (item.size === undefined || typeof item.size === 'string'),
    );
  } catch (error) {
    console.error('Unable to read saved cart from local storage.', error);
    return [];
  }
}

function readOrders() {
  const savedOrders = localStorage.getItem(ordersStorageKey);
  if (!savedOrders) {
    return [];
  }

  try {
    const parsedOrders = JSON.parse(savedOrders);
    if (!Array.isArray(parsedOrders)) {
      throw new Error('Saved orders must be an array.');
    }

    return parsedOrders.filter((order) =>
      typeof order.id === 'string'
      && typeof order.placedAt === 'string'
      && Number.isFinite(order.total)
      && Array.isArray(order.items)
      && order.items.every((item) =>
        products.some((product) => product.id === item.productId)
        && Number.isInteger(item.quantity)
        && item.quantity > 0
        && (item.size === undefined || typeof item.size === 'string'),
      ),
    );
  } catch (error) {
    console.error('Unable to read saved orders from local storage.', error);
    return [];
  }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(readCart);
  const [orders, setOrders] = useState(readOrders);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(ordersStorageKey, JSON.stringify(orders));
  }, [orders]);

  const addToCart = (productId, quantity, size) => {
    const selectedSize = size ?? products.find((product) => product.id === productId)?.sizes[0] ?? 'One size';
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) =>
        item.productId === productId && (item.size ?? 'One size') === selectedSize,
      );
      if (existingItem) {
        return currentCart.map((item) =>
          item.productId === productId && (item.size ?? 'One size') === selectedSize
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [...currentCart, { productId, quantity, size: selectedSize }];
    });
  };

  const updateQuantity = (productId, quantity, size = 'One size') => {
    setCart((currentCart) => currentCart.map((item) =>
      item.productId === productId && (item.size ?? 'One size') === size
        ? { ...item, quantity }
        : item,
    ));
  };

  const removeFromCart = (productId, size = 'One size') => {
    setCart((currentCart) => currentCart.filter((item) =>
      item.productId !== productId || (item.size ?? 'One size') !== size,
    ));
  };

  const placeOrder = (total) => {
    if (cart.length === 0) {
      return false;
    }

    const placedAt = new Date().toISOString();
    const order = {
      id: crypto.randomUUID(),
      placedAt,
      total,
      items: cart.map(({ productId, quantity, size }) => ({ productId, quantity, size })),
    };

    setOrders((currentOrders) => [order, ...currentOrders]);
    setCart([]);
    return true;
  };

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const value = {
    cart,
    itemCount,
    orders,
    addToCart,
    updateQuantity,
    removeFromCart,
    placeOrder,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
