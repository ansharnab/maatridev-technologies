import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";
import { useShop } from "../context/ShopContext";

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useShop();

  return (
    <>
      <PageHero title="Wishlist" description="Saved products for later." breadcrumb={[{ label: "Wishlist" }]} />
      <section className="section">
        <div className="container">
          {wishlist.length === 0 ? (
            <p>No items yet. <Link to="/shop">Browse shop</Link></p>
          ) : (
            <div className="grid-3">
              {wishlist.map((p) => (
                <article key={p.id} className="card shop-card">
                  <img src={p.image} alt={p.name} />
                  <div className="card__body">
                    <h3>{p.name}</h3>
                    <p className="shop-card__price">₹{p.price.toLocaleString("en-IN")}</p>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button type="button" className="btn btn--primary" onClick={() => addToCart(p)}>Add to Cart</button>
                      <button type="button" className="btn btn--outline" onClick={() => toggleWishlist(p)}>Remove</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
