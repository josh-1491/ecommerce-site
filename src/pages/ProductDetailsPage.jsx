import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { useCart } from '../cart/useCart';
import { Header } from '../components/Header';
import { formatPrice, products } from '../data/products';
import './ProductDetailsPage.css';

function StarRating({ rating }) {
  return (
    <span className="detail-stars" aria-label={`${rating} out of 5 stars`}>
      {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
    </span>
  );
}

export function ProductDetailsPage() {
  const { productId } = useParams();
  const product = products.find((item) => item.id === productId);
  const { addToCart } = useCart();
  const [size, setSize] = useState(product?.sizes[0] ?? '');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <>
        <Header />
        <main className="product-detail-page product-not-found">
          <h1>Product not found</h1>
          <Link className="link-primary" to="/">Return to the store</Link>
        </main>
      </>
    );
  }

  const handleAddToCart = () => {
    addToCart(product.id, quantity, size);
    setAdded(true);
  };

  return (
    <>
      <title>{product.name}</title>
      <Header />
      <main className="product-detail-page">
        <Link className="back-to-products" to="/">← Continue shopping</Link>

        <section className="product-detail">
          <div className="product-detail-image-wrap">
            <img className="product-detail-image" src={product.image} alt={product.alt} />
          </div>

          <div className="product-detail-info">
            <span className="product-category-label">{product.category}</span>
            <h1>{product.name}</h1>
            <div className="detail-rating-summary">
              <StarRating rating={product.rating} />
              <a href="#customer-reviews">{product.ratingCount} customer ratings</a>
            </div>
            <p className="product-detail-price">{formatPrice(product.price)}</p>
            <p className="product-detail-description">
              A customer favorite, selected for everyday comfort, quality, and dependable use.
            </p>

            <div className="detail-purchase-controls">
              <div>
                <label htmlFor="product-size">Size</label>
                <select
                  id="product-size"
                  value={size}
                  onChange={(event) => setSize(event.target.value)}
                >
                  {product.sizes.map((productSize) => (
                    <option key={productSize} value={productSize}>{productSize}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="product-quantity">Quantity</label>
                <select
                  id="product-quantity"
                  value={quantity}
                  onChange={(event) => setQuantity(Number(event.target.value))}
                >
                  {Array.from({ length: 10 }, (_, index) => index + 1).map((value) => (
                    <option key={value} value={value}>{value}</option>
                  ))}
                </select>
              </div>
              <button className="button-primary detail-add-button" onClick={handleAddToCart}>
                Add to Cart
              </button>
              {added && <p className="detail-added-message" role="status">Added to cart</p>}
            </div>
          </div>
        </section>

        <section className="customer-reviews" id="customer-reviews">
          <h2>Customer reviews</h2>
          <div className="review-summary">
            <StarRating rating={product.rating} />
            <span>{product.rating} out of 5</span>
            <span>{product.ratingCount} ratings</span>
          </div>
          {product.reviews.map((review, index) => (
            <article className="customer-review" key={`${review.name}-${index}`}>
              <div className="reviewer-name">{review.name}</div>
              <div className="review-heading">
                <StarRating rating={review.rating} />
                <strong>{review.title}</strong>
              </div>
              <p>{review.body}</p>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}
