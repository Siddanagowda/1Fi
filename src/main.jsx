import React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { apiClient } from './api/client'
import './style.css'

// ============= Original Code Below (Kept for Reference) =============
const CATS_OLD = ["All", "Mobiles", "Laptops", "TVs", "Appliances"];
const CATS = CATS_OLD;
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
const toProduct = (product) => {
  const basePrice = Number(product.price);
  const variants = Array.isArray(product.variants) ? product.variants : [];
  const colorOptions = variants
    .filter((variant) => variant.variant_name?.toLowerCase() === "color")
    .map((variant) => variant.variant_value);
  const productVariants = variants
    .filter((variant) => variant.variant_name?.toLowerCase() !== "color")
    .map((variant) => [
      `${variant.variant_name}: ${variant.variant_value}`,
      basePrice + Number(variant.price_adjustment || 0),
    ]);

  return {
    id: product.id,
    brand: product.name.split(" ")[0],
    name: product.name,
    cat: product.category,
    price: basePrice,
    badge: Number(product.rating) >= 4.5 ? "Popular" : "Featured",
    desc: product.description,
    colors: colorOptions.length ? colorOptions : ["Standard"],
    variants: productVariants.length ? productVariants : [["Standard", basePrice]],
    img: product.image_url,
    emiPlans: Array.isArray(product.emi_plans) ? product.emi_plans : [],
  };
};
const api = {
  async list() {
    const products = await apiClient.getProducts();
    return products.map(toProduct);
  },
  async one(id) {
    const product = await apiClient.getProductById(id);
    return toProduct(product);
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
  const [t, setT] = useState("1Fi Marketplace");
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
        <MarketplaceInline go={go} />
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

function MarketplaceInline({ go }) {
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
    <section className="market-inline">
      <div className="market-head">
        <div>
          <small>1FI MARKETPLACE</small>
          <h2>
            Shop products with
            <br />
            <i>no-cost EMI.</i>
          </h2>
          <p>
            Choose a product, select your plan and use your investments to pay
            later.
          </p>
        </div>
        <div className="market-bubble">✦</div>
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
                <img src={p.img} alt={p.name} />
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
    </section>
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
      <Header title="Product Details" back="/shop" go={go} />
      <div className="detail-img">
        <img src={p.img} alt={p.name} />
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
        {(p.emiPlans.length ? p.emiPlans : [3, 6, 9, 12, 18, 24].map((n) => ({
          tenure_months: n,
          emi_amount: Math.ceil(price / n),
          interest_rate: 0,
        }))).map((plan) => {
          const n = plan.tenure_months;
          const monthlyAmount = Number(plan.emi_amount) || Math.ceil(price / n);
          return (
          <button
            className={"emi-row " + (emi === n ? "on" : "")}
            onClick={() => setEmi(n)}
            key={n}
          >
            <i>{emi === n ? "✓" : ""}</i>
            <span>
              <strong>
                {money(monthlyAmount)} <small>/ month</small>
              </strong>
              <label>{n} months • {plan.interest_rate}% interest</label>
            </span>
            {n === 12 && <em>Recommended</em>}
          </button>
          );
        })}
      </section>
      <div className="trust">
        ✓ Secure plan &nbsp;&nbsp; ✓ No-cost EMI &nbsp;&nbsp; ✓ Investment
        backed
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
              JSON.stringify({ id, variant, color, emi, price, product: p }),
            );
            go("/eligibility");
          }}
        >
          Continue with plan →
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

function Eligibility({ go }) {
  const [step, setStep] = useState(0);
  let s = { id: "iphone-17", variant: 0, color: 0, emi: 12 };
  try {
    s = { ...s, ...JSON.parse(localStorage.getItem("1fi-order") || "{}") };
  } catch {}
  const p = s.product || PRODUCTS.find((x) => x.id === s.id) || PRODUCTS[0],
    v = p.variants[s.variant] || p.variants[0],
    c = p.colors[s.color] || p.colors[0],
    monthly = Math.ceil(v[1] / s.emi);
  const next = () => setStep((x) => x + 1);
  return (
    <div className="page eligibility">
      <Header title="EMI setup" back={"/product/" + p.id} go={go} />
      <div className="progress">
        <span className={step >= 0 ? "on" : ""} />
        <span className={step >= 1 ? "on" : ""} />
        <span className={step >= 2 ? "on" : ""} />
      </div>
      {step === 0 ? (
        <>
          <div className="setup-hero">
            <div className="setup-icon">1Fi</div>
            <small>BEFORE YOU PROCEED</small>
            <h2>Let's check your EMI readiness</h2>
            <p>
              Your selected plan is <strong>{money(monthly)}/month</strong> for{" "}
              {s.emi} months. 1Fi uses eligible investments as security for the
              purchase.
            </p>
          </div>
          <div className="check-card">
            <CheckRow
              title="1Fi account"
              text="Sign in or create your account"
              done={false}
            />
            <CheckRow
              title="KYC verification"
              text="Required before an investment pledge"
              done={false}
            />
            <CheckRow
              title="Mutual funds"
              text="Link eligible investments to continue"
              done={false}
            />
          </div>
          <button className="primary wide" onClick={next}>
            Sign in & check eligibility →
          </button>
        </>
      ) : step === 1 ? (
        <>
          <div className="setup-hero">
            <div className="setup-icon">✓</div>
            <small>ACCOUNT VERIFIED</small>
            <h2>Your account is ready</h2>
            <p>
              Now link eligible mutual funds. You can review the amount before
              any pledge is created.
            </p>
          </div>
          <div className="fund-card">
            <div>
              <span>Eligible investment value</span>
              <strong>₹1,25,000</strong>
            </div>
            <div>
              <span>Required for this purchase</span>
              <strong>{money(v[1])}</strong>
            </div>
            <div className="fund-progress">
              <span style={{ width: "64%" }} />
            </div>
            <small>Eligible amount is sufficient for this demo purchase.</small>
          </div>
          <button className="secondary wide" onClick={next}>
            Link mutual funds
          </button>
          <button className="text" onClick={() => setStep(0)}>
            ← Back
          </button>
        </>
      ) : (
        <>
          <div className="setup-hero">
            <div className="setup-icon green">✓</div>
            <small>FUNDS LINKED</small>
            <h2>Ready to create your pledge</h2>
            <p>Review the order and confirm the investment-backed payment.</p>
          </div>
          <div className="pledge-card">
            <div className="pledge-product">
              <img src={p.img} alt="" />
              <div>
                <small>{p.brand}</small>
                <h3>{p.name}</h3>
                <p>
                  {v[0]} • {c}
                </p>
              </div>
            </div>
            <div className="line">
              <span>Product price</span>
              <strong>{money(v[1])}</strong>
            </div>
            <div className="line">
              <span>Monthly EMI</span>
              <strong>{money(monthly)}</strong>
            </div>
            <div className="line">
              <span>Tenure</span>
              <strong>{s.emi} months</strong>
            </div>
            <div className="total">
              <span>Interest</span>
              <strong>0%</strong>
            </div>
          </div>
          <button className="primary wide" onClick={() => go("/success")}>
            Confirm pledge & continue →
          </button>
          <p className="fine-print">
            Demo only: no real mutual-fund pledge, loan or payment is created.
          </p>
        </>
      )}
    </div>
  );
}
function CheckRow({ title, text, done }) {
  return (
    <div className="check-row">
      <span>{done ? "✓" : "○"}</span>
      <div>
        <strong>{title}</strong>
        <p>{text}</p>
      </div>
      <b>›</b>
    </div>
  );
}

function Success({ go }) {
  let s = { id: "iphone-17", variant: 0, color: 0, emi: 12 };
  try {
    s = { ...s, ...JSON.parse(localStorage.getItem("1fi-order") || "{}") };
  } catch {}
  const p = s.product || PRODUCTS.find((x) => x.id === s.id) || PRODUCTS[0],
    v = p.variants[s.variant] || p.variants[0],
    c = p.colors[s.color] || p.colors[0],
    m = Math.ceil(v[1] / s.emi);
  return (
    <div className="page success">
      <div className="check">✓</div>
      <small>ORDER READY</small>
      <h1>Your EMI plan is confirmed</h1>
      <p>
        In a real 1Fi flow, the next step would create the investment-backed
        purchase. This demo shows the complete front-end journey.
      </p>
      <div className="summary">
        <div className="sumhead">
          <img src={p.img} alt="" />
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
          <span>Investment pledge</span>
          <strong>{money(v[1])}</strong>
        </div>
      </div>
      <div className="success-note">
        ✓ Eligible mutual funds linked &nbsp; • &nbsp; Pledge ready
      </div>
      <button className="primary wide" onClick={() => go("/shop")}>
        Back to Shop →
      </button>
      <button className="text" onClick={() => go("/marketplace")}>
        Continue shopping
      </button>
    </div>
  );
}

function Placeholder({ title, go }) {
  return (
    <div className="page placeholder">
      <div className="placeholder-icon">1Fi</div>
      <h2>{title}</h2>
      <p>This navigation item is outside the Marketplace assignment scope.</p>
      <button className="primary" onClick={() => go("/shop")}>
        Back to Shop
      </button>
    </div>
  );
}

function App() {
  const [path, setPath] = useState(window.location.pathname);
  const go = (p) => {
    window.history.pushState({}, "", p);
    setPath(p);
    window.scrollTo(0, 0);
  };
  useEffect(() => {
    const f = () => setPath(window.location.pathname);
    window.addEventListener("popstate", f);
    return () => window.removeEventListener("popstate", f);
  }, []);
  if (path.startsWith("/product/"))
    return <Product id={path.split("/")[2]} go={go} />;
  if (path === "/eligibility") return <Eligibility go={go} />;
  if (path === "/success") return <Success go={go} />;
  if (path === "/marketplace") return <MarketplaceInline go={go} />;
  if (["/emi", "/limit", "/profile"].includes(path))
    return <Placeholder title={path.slice(1)} go={go} />;
  return <Shop go={go} />;
}
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
