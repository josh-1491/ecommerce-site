import { Link, useNavigate, useSearchParams } from 'react-router';
import { useCart } from '../cart/useCart';
import { CartIcon } from './CartIcon';
import './header.css';

export function Header() {
  const { itemCount } = useCart();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const selectedCategory = searchParams.get('category') ?? '';
  const searchValue = searchParams.get('q') ?? '';

  const updateCatalogParams = (updates) => {
    const nextParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        nextParams.set(key, value);
      } else {
        nextParams.delete(key);
      }
    });

    navigate({ pathname: '/', search: nextParams.toString() });
  };

  const categories = [
    ['clothing', 'Clothing'],
    ['electronics', 'Electronics'],
    ['accessories', 'Accessories'],
  ];

  return (
    <header className="store-header">
      <Link className="store-header-brand" to="/">
        Ecommerce Project
      </Link>

      <div className="catalog-search" role="search">
        <div className="category-toggles" aria-label="Filter by category">
          {categories.map(([category, label]) => (
            <button
              className={`category-toggle${selectedCategory === category ? ' is-selected' : ''}`}
              key={category}
              type="button"
              aria-pressed={selectedCategory === category}
              onClick={() => updateCatalogParams({
                category: selectedCategory === category ? '' : category,
              })}
            >
              {label}
            </button>
          ))}
        </div>
        <label className="visually-hidden" htmlFor="product-search">Search products</label>
        <input
          id="product-search"
          className="product-search-input"
          type="search"
          placeholder="Search products"
          value={searchValue}
          onChange={(event) => updateCatalogParams({ q: event.target.value.trimStart() })}
        />
        <span className="search-icon" aria-hidden="true">⌕</span>
      </div>

      <nav className="store-header-nav" aria-label="Main navigation">
        <Link to="/orders">Orders</Link>
        <Link className="cart-link" to="/checkout" aria-label={`Cart, ${itemCount} items`}>
          <CartIcon itemCount={itemCount} />
          <span>Cart</span>
        </Link>
      </nav>
    </header>
  );
}