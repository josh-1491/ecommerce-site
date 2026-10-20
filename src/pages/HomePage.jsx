import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { Link } from 'react-router';
import { Header } from '../components/Header';
import { useCart } from '../cart/useCart';
import { formatPrice, products } from '../data/products';
import './HomePage.css';

function ProductCard({ product }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product.id, quantity, product.sizes[0]);
    setAdded(true);
  };

  return (
    <article className="product-container">
      <div className="product-image-container">
        <Link to={`/products/${product.id}`} aria-label={`View ${product.name}`}>
          <img className="product-image" src={product.image} alt={product.alt} />
        </Link>
      </div>

      <Link className="product-name-link" to={`/products/${product.id}`}>
        <div className="product-name limit-text-to-2-lines">{product.name}</div>
      </Link>

      <div className="product-rating-container" aria-label={`${product.rating} out of 5 stars`}>
        <span className="product-rating-stars" aria-hidden="true">
          {'★'.repeat(Math.floor(product.rating))}
          {product.rating % 1 ? '½' : ''}
        </span>
        <span className="product-rating-count link-primary">{product.ratingCount}</span>
      </div>

      <div className="product-price">{formatPrice(product.price)}</div>

      <div className="product-quantity-container">
        <label className="visually-hidden" htmlFor={`quantity-${product.id}`}>
          Quantity for {product.name}
        </label>
        <select
          id={`quantity-${product.id}`}
          value={quantity}
          onChange={(event) => setQuantity(Number(event.target.value))}
        >
          {Array.from({ length: 10 }, (_, index) => index + 1).map((value) => (
            <option key={value} value={value}>{value}</option>
          ))}
        </select>
      </div>

      <div className="product-spacer" />

      <div className={`added-to-cart${added ? ' added-to-cart-visible' : ''}`} aria-live="polite">
        <span aria-hidden="true">✓</span>
        Added
      </div>

      <button className="add-to-cart-button button-primary" onClick={handleAddToCart}>
        Add to Cart
      </button>
    </article>
  );
}

export function HomePage() {
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category') ?? '';
  const searchTerm = (searchParams.get('q') ?? '').trim().toLocaleLowerCase();
  const filteredProducts = products.filter((product) => (
    (!selectedCategory || product.category === selectedCategory)
    && (!searchTerm || product.name.toLocaleLowerCase().includes(searchTerm))
  ));

  return (
    <>
      <title>Ecommerce Project</title>
      <Header />
      <main className="home-page">
        <div className="products-grid">
          {filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
        {filteredProducts.length === 0 && (
          <p className="no-products-message">No products match your search.</p>
        )}
      </main>
    </>
  );
}
