import { useState } from "react";
import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";
import { useShop } from "../context/ShopContext";

export default function CheckoutPage() {
  const { cart, cartTotal } = useShop();
  const [done, setDone] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setDone(true);
  };

  return (
    <>
      <PageHero title="Checkout" description="Complete your purchase securely." breadcrumb={[{ label: "Checkout" }]} />
      <section className="section">
        <div className="container grid-2">
          {done ? (
            <div className="alert alert--success">
              <h3>Order placed!</h3>
              <p>Thank you for shopping with MaatriDev Technologies.</p>
              <Link to="/shop" className="btn btn--primary">Continue Shopping</Link>
            </div>
          ) : cart.length === 0 ? (
            <p>Cart is empty. <Link to="/shop">Go to shop</Link></p>
          ) : (
            <form onSubmit={handleSubmit}>
              <h2 className="section-title">Billing Details</h2>
              <div className="form-group"><label>Name</label><input required /></div>
              <div className="form-group"><label>Email</label><input type="email" required /></div>
              <div className="form-group"><label>Address</label><textarea required rows={3} /></div>
              <p><strong>Order total: ₹{cartTotal.toLocaleString("en-IN")}</strong></p>
              <button type="submit" className="btn btn--primary">Place Order</button>
            </form>
          )}
          <div className="card">
            <div className="card__body">
              <h3>Order Summary</h3>
              <ul>
                {cart.map((i) => (
                  <li key={i.id}>{i.name} × {i.qty}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
