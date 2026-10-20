import { Link } from 'react-router';
import { useCart } from '../cart/useCart';
import { Header } from '../components/Header';
import { formatPrice, products } from '../data/products';
import './OrdersPage.css';

function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

export function OrdersPage() {
  const { orders, addToCart } = useCart();

  return (
    <>
      <title>Orders</title>
      <Header />

      <main className="orders-page">
        <div className="page-title">Your Orders</div>

        {orders.length === 0 ? (
          <div className="orders-empty-state">
            <p>You haven’t placed any orders yet.</p>
            <Link className="link-primary" to="/">Start shopping</Link>
          </div>
        ) : (
          <div className="orders-grid">
            {orders.map((order) => (
              <article className="order-container" key={order.id}>
                <header className="order-header">
                  <div className="order-header-left-section">
                    <div className="order-date">
                      <div className="order-header-label">Order Placed:</div>
                      <div>{formatDate(order.placedAt)}</div>
                    </div>
                    <div className="order-total">
                      <div className="order-header-label">Total:</div>
                      <div>{formatPrice(order.total)}</div>
                    </div>
                  </div>
                  <div className="order-header-right-section">
                    <div className="order-header-label">Order ID:</div>
                    <div>{order.id}</div>
                  </div>
                </header>

                <div className="order-details-grid">
                  {order.items.map((item) => {
                    const product = products.find(({ id }) => id === item.productId);
                    if (!product) {
                      return null;
                    }
                    const size = item.size ?? product.sizes[0];

                    return (
                      <div className="order-product" key={`${item.productId}-${size}`}>
                        <div className="product-image-container">
                          <img src={product.image} alt={product.alt} />
                        </div>
                        <div className="product-details">
                          <div className="product-name">{product.name}</div>
                          <div className="product-size">Size: {size}</div>
                          <div className="product-quantity">Quantity: {item.quantity}</div>
                          <button
                            className="buy-again-button button-primary"
                            onClick={() => addToCart(product.id, item.quantity, size)}
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
