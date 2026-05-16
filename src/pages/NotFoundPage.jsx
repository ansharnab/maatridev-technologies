import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="section error-page">
      <div>
        <h1>404</h1>
        <h2>Page not found</h2>
        <p>The page you are looking for may have been moved or removed.</p>
        <Link to="/" className="btn btn--primary">Back to Home</Link>
      </div>
    </section>
  );
}
