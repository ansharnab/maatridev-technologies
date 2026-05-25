import { useEffect, useState } from "react";
import axios from "axios";

function authHeaders() {
  return { Authorization: `Bearer ${localStorage.getItem("maatridev-admin-token")}` };
}

export default function BlogPanel() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState("");

  const load = () => {
    setLoading(true);
    axios
      .get("/api/blogs")
      .then((r) => setPosts(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const generate = async (force = false) => {
    setGenerating(true);
    setMessage("");
    try {
      const { data } = await axios.post("/api/blogs/generate", { force }, { headers: authHeaders() });
      if (data.skipped) {
        setMessage(`Already published today (${data.date}). Use force to add another.`);
      } else {
        setMessage(`Published: ${data.post?.title}`);
        load();
      }
    } catch (err) {
      setMessage(err.response?.data?.error || err.message || "Generation failed");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="admin-panel">
      <div className="admin-panel__head">
        <h2>Blog (auto daily)</h2>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <button type="button" className="btn btn--primary" disabled={generating} onClick={() => generate(false)}>
            {generating ? "Writing…" : "Generate today’s post"}
          </button>
          <button
            type="button"
            className="btn btn--outline"
            disabled={generating}
            onClick={() => generate(true)}
            title="Uses a different topic than recent posts (not a rewrite of today's article)"
          >
            Force new post (different topic)
          </button>
        </div>
      </div>
      <p className="admin-hint">
        Topics &amp; images are generated fresh each run (OpenAI topic + Unsplash/Pexels search). Add{" "}
        <code>UNSPLASH_ACCESS_KEY</code> in server <code>.env</code> for real stock photos (free). Posts live in{" "}
        <code>server/data/blogs.json</code> (not overwritten by ec2-push).
      </p>
      {message && <p className="admin-hint">{message}</p>}
      {loading ? (
        <p>Loading…</p>
      ) : (
        <ul className="blog-admin-list">
          {posts.map((p) => (
            <li key={p.slug}>
              <strong>{p.title}</strong>
              <span>
                {p.datePublished} · {p.author}
                {p.generated ? " · auto" : ""}
              </span>
              <a href={`/blog/${p.slug}`} target="_blank" rel="noreferrer">
                View
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
