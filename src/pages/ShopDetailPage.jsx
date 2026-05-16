import { useParams, Link } from "react-router-dom";
import PageHero from "../components/PageHero";
import { shopProducts } from "../data/siteData";
import { useShop } from "../context/ShopContext";

export default function ShopDetailPage() {
  const product = shopProducts.find((p) => String(p.id) === useParams().id) || shopProducts[0];
  const { addToCart, toggleWishlist, wishlist } = useShop();

  return (
    <>
      <PageHero title={product.name} description={product.category} breadcrumb={[{ to: "/shop", label: "Shop" }, { label: product.name }]} />
      <section className="section">
        <div className="container grid-2">
          <img src={product.image} alt={product.name} style={{ borderRadius: "var(--radius)" }} />
          <div>
            <p className="shop-card__price">₹{product.price.toLocaleString("en-IN")}</p>
            <p>Licensed digital product from MaatriDev Technologies. Instant delivery after checkout.</p>
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem", flexWrap: "wrap" }}>
              <button type="button" className="btn btn--primary" onClick={() => addToCart(product)}>
                Add to Cart
              </button>
              <button type="button" className="btn btn--outline" onClick={() => toggleWishlist(product)}>
                <i className={`fa-${wishlist.some((w) => w.id === product.id) ? "solid" : "regular"} fa-heart`} /> Wishlist
              </button>
              <Link to="/cart" className="btn btn--ghost">View Cart</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
