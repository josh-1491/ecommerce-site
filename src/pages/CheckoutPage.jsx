import { Link, useNavigate } from 'react-router';
import { useCart } from '../cart/useCart';
import { CartIcon } from '../components/CartIcon';
import { formatPrice, products } from '../data/products';
import '../components/header.css';
import './checkout-header.css';
import './CheckoutPage.css';

const shippingCost = 4.99;

export function CheckoutPage() {
  const { cart, itemCount, updateQuantity, removeFromCart, placeOrder } = useCart();
  const navigate = useNavigate();
  const cartProducts = cart
    .map((cartItem) => ({
      ...cartItem,
      product: products.find((product) => product.id === cartItem.productId),
    }))
    .filter((cartItem) => cartItem.product);

  const subtotal = cartProducts.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );
  const shipping = itemCount > 0 ? shippingCost : 0;
  const beforeTax = subtotal + shipping;
  const tax = beforeTax * 0.1;
  const total = beforeTax + tax;

  const handlePlaceOrder = () => {
    if (placeOrder(total)) {
      navigate('/orders');
    }
  };

  return (
    <>
      <title>Checkout</title>

      <header className="checkout-header">
        <div className="header-content">
          <div className="checkout-header-left-section">
            <Link to="/" aria-label="Return to home">
              <span className="checkout-brand">Ecommerce Project</span>
            </Link>
          </div>

          <div className="checkout-header-middle-section">
            Checkout ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </div>

          <div className="checkout-header-right-section">
            <Link className="checkout-cart-link" to="/checkout" aria-label={`Cart, ${itemCount} items`}>
              <CartIcon itemCount={itemCount} />
            </Link>
          </div>
        </div>
      </header>

      <main className="checkout-page">
        <div className="page-title">Review your order</div>

        <div className="checkout-grid">
          <div className="order-summary">
            {cartProducts.length === 0 ? (
              <div className="empty-cart">
                <p>Your cart is empty.</p>
                <Link className="link-primary" to="/">Continue shopping</Link>
              </div>
            ) : cartProducts.map(({ product, quantity, size }) => (
              <article className="cart-item-container" key={`${product.id}-${size ?? 'One size'}`}>
                <div className="delivery-date">Delivery date: Tuesday, June 21</div>
                <div className="cart-item-details-grid">
                  <img className="product-image" src={product.image} alt={product.alt} />

                  <div className="cart-item-details">
                    <div className="product-name">{product.name}</div>
                    <div className="product-price">{formatPrice(product.price)}</div>
                    <div className="product-size">Size: {size ?? product.sizes[0]}</div>
                    <div className="product-quantity">
                      <label htmlFor={`cart-quantity-${product.id}`}>Quantity:</label>
                      {' '}
                      <select
                        id={`cart-quantity-${product.id}`}
                        className="cart-quantity-select"
                        value={quantity}
                        onChange={(event) => updateQuantity(product.id, Number(event.target.value), size)}
                      >
                        {Array.from({ length: 10 }, (_, index) => index + 1).map((value) => (
                          <option key={value} value={value}>{value}</option>
                        ))}
                      </select>
                      <button
                        className="link-primary remove-cart-item"
                        onClick={() => removeFromCart(product.id, size)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="payment-summary">
            <div className="payment-summary-title">Payment Summary</div>
            <div className="payment-summary-row">
              <div>Items ({itemCount}):</div>
              <div className="payment-summary-money">{formatPrice(subtotal)}</div>
            </div>
            <div className="payment-summary-row">
              <div>Shipping &amp; handling:</div>
              <div className="payment-summary-money">{formatPrice(shipping)}</div>
            </div>
            <div className="payment-summary-row subtotal-row">
              <div>Total before tax:</div>
              <div className="payment-summary-money">{formatPrice(beforeTax)}</div>
            </div>
            <div className="payment-summary-row">
              <div>Estimated tax (10%):</div>
              <div className="payment-summary-money">{formatPrice(tax)}</div>
            </div>
            <div className="payment-summary-row total-row">
              <div>Order total:</div>
              <div className="payment-summary-money">{formatPrice(total)}</div>
            </div>
            <button
              className="place-order-button button-primary"
              disabled={itemCount === 0}
              onClick={handlePlaceOrder}
            >
              Place your order
            </button>
          </aside>
        </div>
      </main>
    </>
  );
}
