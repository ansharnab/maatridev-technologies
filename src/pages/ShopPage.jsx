import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";
import { shopProducts } from "../data/siteData";
import { useShop } from "../context/ShopContext";

export default function ShopPage() {
  const { toggleWishlist, wishlist } = useShop();

  return (
    <>
      <PageHero title="Shop" description="Digital products, templates, and design kits." breadcrumb={[{ label: "Shop" }]} />
      <section className="section">
        <div className="container grid-3">
          {shopProducts.map((p) => (
            <article key={p.id} className="card shop-card">
              <Link to={`/shop/${p.id}`}>
                <img src={p.image} alt={p.name} />
              </Link>
              <div className="card__body">
                <span className="project-card__cat">{p.category}</span>
                <h3><Link to={`/shop/${p.id}`}>{p.name}</Link></h3>
                <p className="shop-card__price">₹{p.price.toLocaleString("en-IN")}</p>
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                  <Link to={`/shop/${p.id}`} className="btn btn--primary" style={{ flex: 1, justifyContent: "center" }}>View</Link>
                  <button
                    type="button"
                    className="btn btn--outline"
                    onClick={() => toggleWishlist(p)}
                    aria-label="Wishlist"
                  >
                    <i className={`fa-${wishlist.some((w) => w.id === p.id) ? "solid" : "regular"} fa-heart`} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
