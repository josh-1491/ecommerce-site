export function CartIcon({ itemCount }) {
  return (
    <span className="cart-icon-wrap" aria-hidden="true">
      <svg className="cart-icon" viewBox="0 0 32 32" focusable="false">
        <path d="M2 4h4l3.2 16.1a3 3 0 0 0 3 2.4h13.5a3 3 0 0 0 2.9-2.2L31 10H8" />
        <circle cx="13" cy="27" r="2" />
        <circle cx="25" cy="27" r="2" />
      </svg>
      {itemCount > 0 && <span className="cart-count-badge">{itemCount}</span>}
    </span>
  );
}
