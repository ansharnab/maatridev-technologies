import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";
import { useShop } from "../context/ShopContext";

export default function CartPage() {
  const { cart, removeFromCart, updateQty, cartTotal } = useShop();

  return (
    <>
      <PageHero title="Cart" description="Review your items before checkout." breadcrumb={[{ label: "Cart" }]} />
      <section className="section">
        <div className="container">
          {cart.length === 0 ? (
            <p>Your cart is empty. <Link to="/shop">Browse shop</Link></p>
          ) : (
            <>
              <table className="cart-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Subtotal</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>₹{item.price.toLocaleString("en-IN")}</td>
                      <td>
                        <input
                          type="number"
                          min={1}
                          value={item.qty}
                          onChange={(e) => updateQty(item.id, Number(e.target.value))}
                          style={{ width: 60 }}
                        />
                      </td>
                      <td>₹{(item.price * item.qty).toLocaleString("en-IN")}</td>
                      <td>
                        <button type="button" className="btn btn--ghost" onClick={() => removeFromCart(item.id)}>
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p style={{ fontWeight: 700, fontSize: "1.25rem", marginTop: "1.5rem" }}>
                Total: ₹{cartTotal.toLocaleString("en-IN")}
              </p>
              <Link to="/checkout" className="btn btn--primary" style={{ marginTop: "1rem" }}>
                Proceed to Checkout
              </Link>
            </>
          )}
        </div>
      </section>
    </>
  );
}
