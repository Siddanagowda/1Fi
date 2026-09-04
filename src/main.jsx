import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

const CATS = ["All", "Mobiles", "Laptops", "TVs", "Appliances"];
const PRODUCTS = [
  {
    id: "iphone-17",
    brand: "Apple",
    name: "iPhone 17",
    cat: "Mobiles",
    price: 79999,
    badge: "Popular",
    desc: "A premium smartphone with a bright display, powerful performance and an advanced camera system.",
    colors: ["Black", "Blue", "White"],
    variants: [
      ["128 GB", 79999],
      ["256 GB", 89999],
      ["512 GB", 109999],
    ],
    img: "https://images.unsplash.com/photo-1592286927505-2fdc6b9f1c0d?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "pixel-10",
    brand: "Google",
    name: "Pixel 10",
    cat: "Mobiles",
    price: 69999,
    badge: "New",
    desc: "A clean Android experience with intelligent photography and a smooth high-refresh display.",
    colors: ["Obsidian", "Porcelain", "Mint"],
    variants: [
      ["128 GB", 69999],
      ["256 GB", 79999],
    ],
    img: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "macbook-pro",
    brand: "Apple",
    name: "MacBook Pro",
    cat: "Laptops",
    price: 149999,
    badge: "Bestseller",
    desc: "A powerful professional laptop designed for development, creative work and demanding workflows.",
    colors: ["Space Black", "Silver"],
    variants: [
      ["14-inch / 16 GB", 149999],
      ["16-inch / 24 GB", 199999],
    ],
    img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "s25-ultra",
    brand: "Samsung",
    name: "Galaxy S25 Ultra",
    cat: "Mobiles",
    price: 129999,
    badge: "Flagship",
    desc: "A flagship Android phone with a large display, versatile cameras and all-day performance.",
    colors: ["Titanium Black", "Titanium Gray"],
    variants: [
      ["256 GB", 129999],
      ["512 GB", 139999],
    ],
    img: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "oneplus-15",
    brand: "OnePlus",
    name: "OnePlus 15",
    cat: "Mobiles",
    price: 64999,
    badge: "Value pick",
    desc: "Fast, fluid performance with a premium design at a competitive price.",
    colors: ["Midnight", "Silver"],
    variants: [
      ["128 GB", 64999],
      ["256 GB", 69999],
    ],
    img: "https://images.unsplash.com/photo-1598965402089-897ce52e8355?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "bravia",
    brand: "Sony",
    name: "Bravia 55-inch 4K TV",
    cat: "TVs",
    price: 89999,
    badge: "Home",
    desc: "A cinematic 4K television with vibrant picture quality and smart entertainment features.",
    colors: ["Black"],
    variants: [
      ["55-inch", 89999],
      ["65-inch", 119999],
    ],
    img: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=900&q=85",
  },
];
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const api = {
  async list() {
    await wait(450);
    return PRODUCTS;
  },
  async one(id) {
    await wait(250);
    return PRODUCTS.find((x) => x.id === id);
  },
};
const money = (n) => "₹" + n.toLocaleString("en-IN");

function Nav({ go }) {
  return (
    <nav className="nav">
      {[
        ["⌂", "Home", "/"],
        ["▣", "Shop", "/shop"],
        ["▤", "EMI Dues", "/emi"],
        ["⌁", "Limit", "/limit"],
        ["♙", "Profile", "/profile"],
      ].map(([i, l, p]) => (
        <button
          className={l === "Shop" ? "on" : ""}
          onClick={() => go(p)}
          key={l}
        >
          <b>{i}</b>
          <span>{l}</span>
        </button>
      ))}
    </nav>
  );
}
function Header({ title, back, go }) {
  return (
    <header className="head">
      <button className="round" onClick={() => go(back)}>
        ←
      </button>
      <div>
        <small>1FI</small>
        <h1>{title}</h1>
      </div>
      <span />
    </header>
  );
}
function Shop({ go }) {
  const [t, setT] = useState("Nearby Stores");
  return (
    <div className="page shop">
      <div className="hero">
        <div>
          <span>✦ NO-COST EMIs</span>
          <h1>
            Shop today.
            <br />
            <i>Pay later using</i>
            <br />
            Mutual funds.
          </h1>
          <p>
            No credit score required. No interest.
            <br />
            Backed by your investments.
          </p>
        </div>
        <div className="hero-art">
          📱 💻
          <br />
          🚗 🛵
        </div>
      </div>
      <div className="tabs">
        {["Top Brands", "Nearby Stores", "1Fi Marketplace"].map((x) => (
          <button
            className={t === x ? "on" : ""}
            onClick={() => setT(x)}
            key={x}
          >
            {x}
          </button>
        ))}
      </div>
      {t === "1Fi Marketplace" ? (
        <section className="entry">
          <div className="purple-card">
            <small>1FI MARKETPLACE</small>
            <h2>
              Shop more.
              <br />
              Pay later.
            </h2>
            <p>
              Choose your product and a no-cost EMI plan backed by your
              investments.
            </p>
          </div>
          <button className="primary wide" onClick={() => go("/marketplace")}>
            Explore Marketplace →
          </button>
        </section>
      ) : (
        <section>
          <div className="search">
            ⌕{" "}
            <input
              placeholder={
                t === "Top Brands"
                  ? "Search online stores..."
                  : "Search stores..."
              }
            />
          </div>
          <div className="section">
            <h2>{t}</h2>
            {t === "Nearby Stores" && (
              <button className="location">Bengaluru Urban⌄</button>
            )}
          </div>
          <div className="list">
            {(t === "Top Brands"
              ? [
                  ["Air India", "No-cost EMIs upto 18 months", "AI"],
                  [
                    "Apple Premium Reseller",
                    "No-cost EMIs upto 24 months",
                    "",
                  ],
                  ["CaratLane", "No-cost EMIs upto 6 months", "CL"],
                ]
              : [
                  [
                    "TripBouquet",
                    "241, Tower B, Spazedge, near Dmart, Gurugram, Haryana, 122018",
                    "1726 KM",
                  ],
                  [
                    "Charger On Wheels",
                    "Orchid Business Park, Near Subhash Chowk, Gurugram, Haryana, 122101",
                    "1727 KM",
                  ],
                  [
                    "Pacholi Suzuki Haya...",
                    "RAKBA 12, KANAL 11, MARLA 0, Hayatpur, SARSAI, Gurugram, Haryana, 122001",
                    "1727 KM",
                  ],
                ]
            ).map((x, i) => (
              <div className="store" key={x[0]}>
                <div className="logo">{x[2]}</div>
                <div>
                  <h3>{x[0]}</h3>
                  <p>{x[1]}</p>
                </div>
                {t === "Nearby Stores" && <em>{x[2]}</em>}
              </div>
            ))}
          </div>
        </section>
      )}
      <Nav go={go} />
    </div>
  );
}
function Marketplace({ go }) {
  const [data, setData] = useState([]),
    [q, setQ] = useState(""),
    [cat, setCat] = useState("All"),
    [load, setLoad] = useState(true),
    [err, setErr] = useState(false);
  const loadData = () => {
    setLoad(true);
    setErr(false);
    api
      .list()
      .then(setData)
      .catch(() => setErr(true))
      .finally(() => setLoad(false));
  };
  useEffect(loadData, []);
  const filtered = useMemo(
    () =>
      data.filter(
        (p) =>
          (cat === "All" || p.cat === cat) &&
          (!q ||
            `${p.name} ${p.brand} ${p.cat}`
              .toLowerCase()
              .includes(q.toLowerCase())),
      ),
    [data, q, cat],
  );
  return (
    <div className="page">
      <Header title="Marketplace" back="/shop" go={go} />
      <div className="intro">
        <div>
          <h2>Shop today.</h2>
          <p>Pay later using your mutual funds.</p>
        </div>
        <b>✦</b>
      </div>
      <div className="search">
        ⌕{" "}
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search products..."
        />
      </div>
      <div className="chips">
        {CATS.map((c) => (
          <button
            className={cat === c ? "on" : ""}
            onClick={() => setCat(c)}
            key={c}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="section">
        <div>
          <h2>{cat === "All" ? "Featured products" : cat}</h2>
          <p>{filtered.length} products available</p>
        </div>
      </div>
      {load ? (
        <div className="grid">
          {[1, 2, 3, 4].map((i) => (
            <div className="skeleton" key={i} />
          ))}
        </div>
      ) : err ? (
        <div className="state">
          <h3>Something went wrong</h3>
          <p>We couldn't load products.</p>
          <button className="secondary" onClick={loadData}>
            Try again
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="state">
          <h3>No products found</h3>
          <p>Try another search or category.</p>
        </div>
      ) : (
        <div className="grid">
          {filtered.map((p) => (
            <button
              className="product"
              key={p.id}
              onClick={() => go("/product/" + p.id)}
            >
              <div className="pimg">
                <span>{p.badge}</span>
                <img src={p.img} />
              </div>
              <article>
                <small>{p.brand}</small>
                <h3>{p.name}</h3>
                <strong>{money(p.price)}</strong>
                <p>From {money(Math.ceil(p.price / 12))} / month</p>
                <label>0% interest • 12 months</label>
                <footer>View product →</footer>
              </article>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
function Product({ id, go }) {
  const [p, setP] = useState(null),
    [variant, setVariant] = useState(0),
    [color, setColor] = useState(0),
    [emi, setEmi] = useState(12),
    [img, setImg] = useState(0);
  useEffect(() => {
    api.one(id).then((x) => {
      setP(x);
      setVariant(0);
      setColor(0);
      setEmi(12);
    });
  }, [id]);
  if (!p)
    return (
      <div className="page">
        <div className="state">Loading product...</div>
      </div>
    );
  const price = p.variants[variant][1],
    monthly = Math.ceil(price / emi);
  return (
    <div className="page detail">
      <Header title="Details" back="/marketplace" go={go} />
      <div className="detail-img">
        <img src={p.img} />
        <span>1 / 1</span>
      </div>
      <div className="title">
        <small>{p.brand}</small>
        <h2>{p.name}</h2>
        <strong>{money(price)}</strong>
        <p>{p.desc}</p>
      </div>
      <Choice
        title="Choose variant"
        opts={p.variants.map((x) => x[0])}
        val={variant}
        set={setVariant}
      />
      <Choice title="Colour" opts={p.colors} val={color} set={setColor} />
      <section className="emi">
        <div className="section">
          <div>
            <h2>No-cost EMI</h2>
            <p>Choose a plan that works for you</p>
          </div>
          <b>0% interest</b>
        </div>
        {[3, 6, 9, 12, 18, 24].map((n) => (
          <button
            className={"emi-row " + (emi === n ? "on" : "")}
            onClick={() => setEmi(n)}
            key={n}
          >
            <i>{emi === n ? "✓" : ""}</i>
            <span>
              <strong>
                {money(Math.ceil(price / n))} <small>/ month</small>
              </strong>
              <label>{n} months • 0% interest</label>
            </span>
            {n === 12 && <em>Recommended</em>}
          </button>
        ))}
      </section>
      <div className="trust">
        ✓ Secure plan &nbsp;&nbsp; ✓ Delivery available
      </div>
      <div className="cta">
        <div>
          <small>Selected EMI</small>
          <strong>{money(monthly)} / month</strong>
        </div>
        <button
          className="primary"
          onClick={() => {
            localStorage.setItem(
              "1fi-order",
              JSON.stringify({ id, variant, color, emi, price }),
            );
            go("/success");
          }}
        >
          Proceed →
        </button>
      </div>
    </div>
  );
}
function Choice({ title, opts, val, set }) {
  return (
    <section className="choice">
      <h3>{title}</h3>
      <div>
        {opts.map((o, i) => (
          <button
            className={val === i ? "on" : ""}
            onClick={() => set(i)}
            key={o}
          >
            {o}
          </button>
        ))}
      </div>
    </section>
  );
}
function Success({ go }) {
  let s = { id: "iphone-17", variant: 0, color: 0, emi: 12, price: 79999 };
  try {
    s = { ...s, ...JSON.parse(localStorage.getItem("1fi-order") || "{}") };
  } catch {}
  const p = PRODUCTS.find((x) => x.id === s.id) || PRODUCTS[0],
    v = p.variants[s.variant] || p.variants[0],
    c = p.colors[s.color] || p.colors[0],
    m = Math.ceil(v[1] / s.emi);
  return (
    <div className="page success">
      <div className="check">✓</div>
      <small>PLAN READY</small>
      <h1>Your EMI plan is selected</h1>
      <p>
        Review the details below. This demo completes the Marketplace frontend
        journey without processing a real payment.
      </p>
      <div className="summary">
        <div className="sumhead">
          <div className="bag">1Fi</div>
          <div>
            <small>{p.brand}</small>
            <h2>{p.name}</h2>
            <p>
              {v[0]} • {c}
            </p>
          </div>
        </div>
        {[
          ["Product price", money(v[1])],
          ["EMI tenure", s.emi + " months"],
          ["Monthly EMI", money(m)],
          ["Interest", "0%"],
        ].map((x) => (
          <div className="line" key={x[0]}>
            <span>{x[0]}</span>
            <strong>{x[1]}</strong>
          </div>
        ))}
        <div className="total">
          <span>Total payable</span>
          <strong>{money(v[1])}</strong>
        </div>
      </div>
      <button className="primary wide" onClick={() => go("/marketplace")}>
        Continue shopping →
      </button>
      <button className="text" onClick={() => go("/shop")}>
        Back to Shop
      </button>
    </div>
  );
}
function App() {
  const [path, setPath] = useState(location.pathname);
  const go = (p) => {
    history.pushState({}, "", p);
    setPath(p);
    window.scrollTo(0, 0);
  };
  useEffect(() => {
    const f = () => setPath(location.pathname);
    addEventListener("popstate", f);
    return () => removeEventListener("popstate", f);
  }, []);
  if (path.startsWith("/product/"))
    return <Product id={path.split("/")[2]} go={go} />;
  if (path === "/marketplace") return <Marketplace go={go} />;
  if (path === "/success") return <Success go={go} />;
  return <Shop go={go} />;
}
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
