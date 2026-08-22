import { motion } from "framer-motion";
import {
  ShoppingBag,
  TrendingUp,
  Star,
  BookOpen,
  IndianRupee,
  BarChart2,
  Package,
  ArrowUpRight,
  Calendar,
  Download,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

/* ─── helpers ─── */
const fmt = (n) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);

const statusColor = {
  Pending:    "bg-orange-100 text-orange-600",
  Processing: "bg-blue-100 text-blue-600",
  Shipped:    "bg-purple-100 text-purple-600",
  Delivered:  "bg-green-100 text-green-600",
  Cancelled:  "bg-red-100 text-red-600",
};

/* ─── mock data ─── */
const STATS_ROW1 = [
  {
    label: "Today's Orders",
    value: "8",
    sub: "3 pending",
    subColor: "text-orange-500",
    icon: ShoppingBag,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
  },
  {
    label: "Today's Earning",
    value: "₹1,940",
    sub: "From 8 orders",
    subColor: "text-green-500",
    icon: IndianRupee,
    iconBg: "bg-green-50",
    iconColor: "text-green-500",
  },
  {
    label: "Total Orders",
    value: "342",
    sub: "Since you started selling",
    subColor: "text-gray-400",
    icon: Package,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-500",
  },
  {
    label: "Total Sales",
    value: "₹2,07,133",
    sub: "↑ 12.5% this week",
    subColor: "text-green-500",
    icon: TrendingUp,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-500",
    sparkline: true,
  },
];

const STATS_ROW2 = [
  {
    label: "Total Earning",
    value: "₹1,86,420",
    sub: "After commission",
    subColor: "text-gray-400",
    icon: IndianRupee,
    iconBg: "bg-green-50",
    iconColor: "text-green-500",
  },
  {
    label: "Store Rating",
    value: "4.8",
    valueSmall: "/ 5",
    sub: "214 reviews",
    subColor: "text-yellow-500",
    icon: Star,
    iconBg: "bg-yellow-50",
    iconColor: "text-yellow-500",
  },
  {
    label: "Store Performance",
    value: "3.8%",
    sub2: "2.1%",
    sub2Label: "Return / RTO rate",
    sub: "Conversion rate",
    subColor: "text-gray-400",
    icon: BarChart2,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
    dual: true,
  },
  {
    label: "Total Books Listed",
    value: "156",
    sub: "142 live · 9 draft",
    subColor: "text-gray-400",
    icon: BookOpen,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-500",
  },
];

const RECENT_ORDERS = [
  { id: "#BK12678", date: "May 18, 2025", customer: "Amit Kumar",  items: "3 items", status: "Pending",    amount: "₹1,245" },
  { id: "#BK12677", date: "May 18, 2025", customer: "Neha Singh",  items: "1 item",  status: "Processing", amount: "₹540"   },
  { id: "#BK12676", date: "May 17, 2025", customer: "Rahul Verma", items: "2 items", status: "Shipped",    amount: "₹860"   },
  { id: "#BK12675", date: "May 17, 2025", customer: "Pooja Mehta", items: "4 items", status: "Delivered",  amount: "₹1,780" },
  { id: "#BK12674", date: "May 17, 2025", customer: "Vikram Patel",items: "1 item",  status: "Delivered",  amount: "₹320"   },
];

const TOP_BOOKS = [
  { rank: 1, title: "Rich Dad Poor Dad",       author: "Robert Kiyosaki", sold: 56, max: 60 },
  { rank: 2, title: "Atomic Habits",            author: "James Clear",     sold: 42, max: 60 },
  { rank: 3, title: "The Psychology of Money",  author: "Morgan Housel",   sold: 38, max: 60 },
];

const REVIEWS = [
  { initials: "A", color: "bg-purple-500", name: "Ankit Sharma", date: "May 18, 2025", stars: 5, text: "Excellent packaging and fast delivery. Book is in perfect condition!" },
  { initials: "N", color: "bg-teal-500",   name: "Neha Verma",   date: "May 17, 2025", stars: 5, text: "Great collection of books. Very happy with the purchase." },
  { initials: "P", color: "bg-orange-500", name: "Prakash Singh", date: "May 16, 2025", stars: 4, text: "Good experience overall. Will order again." },
];

/* ─── tiny SVG sparkline for Total Sales card ─── */
const Sparkline = () => {
  const pts = [18, 30, 22, 40, 32, 38, 28, 35];
  const W = 80, H = 32;
  const min = Math.min(...pts), max = Math.max(...pts);
  const sx = (i) => (i / (pts.length - 1)) * W;
  const sy = (v) => H - ((v - min) / (max - min)) * H;
  const d = pts.map((v, i) => `${i === 0 ? "M" : "L"}${sx(i)},${sy(v)}`).join(" ");
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="overflow-visible">
      <polyline fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={pts.map((v, i) => `${sx(i)},${sy(v)}`).join(" ")} />
    </svg>
  );
};

/* ─── Sales chart (SVG) ─── */
const SalesChart = () => {
  const days   = ["May 12", "May 13", "May 14", "May 15", "May 16", "May 17", "May 18"];
  const sales  = [14, 22, 18, 38, 30, 26, 34];  // in thousands
  const orders = [28, 42, 35, 72, 60, 48, 65];  // scaled
  const W = 560, H = 180, PAD = { t: 10, b: 30, l: 50, r: 20 };
  const cW = W - PAD.l - PAD.r;
  const cH = H - PAD.t - PAD.b;

  const scaleX = (i) => PAD.l + (i / (days.length - 1)) * cW;
  const scaleY = (v, max) => PAD.t + cH - (v / max) * cH;

  const maxS = Math.max(...sales) * 1.1;
  const maxO = Math.max(...orders) * 1.1;

  const pathOf = (pts, yScale) =>
    pts.map((v, i) => `${i === 0 ? "M" : "L"}${scaleX(i).toFixed(1)},${yScale(v).toFixed(1)}`).join(" ");

  const yLabels = [0, 10, 20, 30, 40, 50];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 200 }}>
      {/* grid lines */}
      {yLabels.map((v) => {
        const y = scaleY(v, maxS);
        return (
          <g key={v}>
            <line x1={PAD.l} x2={W - PAD.r} y1={y} y2={y} stroke="#f1f5f9" strokeWidth="1" />
            <text x={PAD.l - 6} y={y + 4} textAnchor="end" fontSize="10" fill="#94a3b8">
              ₹{v}K
            </text>
          </g>
        );
      })}
      {/* right axis (orders) */}
      {[0, 25, 50, 75, 100].map((v) => (
        <text key={v} x={W - PAD.r + 6} y={scaleY(v, 110) + 4} fontSize="10" fill="#94a3b8">{v}</text>
      ))}
      {/* x axis labels */}
      {days.map((d, i) => (
        <text key={i} x={scaleX(i)} y={H - 6} textAnchor="middle" fontSize="10" fill="#94a3b8">{d}</text>
      ))}
      {/* orders line (blue) */}
      <path d={pathOf(orders.map(o => (o / 100) * 50), scaleY.bind(null, undefined, maxS))} fill="none"
        stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        style={{ "--pts": pathOf(orders.map(o => (o / 100) * 50), v => scaleY(v, maxS)) }}
      />
      {/* sales line (red) */}
      <path d={pathOf(sales, v => scaleY(v, maxS))} fill="none"
        stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      />
      {/* dots – sales */}
      {sales.map((v, i) => (
        <circle key={i} cx={scaleX(i)} cy={scaleY(v, maxS)} r="3.5" fill="#ef4444" stroke="#fff" strokeWidth="1.5" />
      ))}
      {/* dots – orders */}
      {orders.map((v, i) => (
        <circle key={i} cx={scaleX(i)} cy={scaleY((v / 100) * 50, maxS)} r="3" fill="#3b82f6" stroke="#fff" strokeWidth="1.5" />
      ))}
    </svg>
  );
};

/* ─── Stars ─── */
const Stars = ({ n }) => (
  <span className="flex gap-0.5">
    {[1,2,3,4,5].map(i => (
      <Star key={i} size={13} className={i <= n ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"} />
    ))}
  </span>
);

/* ─── Animation variants ─── */
const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

/* ═══════════════════════════════════════════════════════════ */
const Dashboard = () => {
  const adminData  = JSON.parse(localStorage.getItem("adminData") || "{}");
  const sellerName = adminData.sellerName || "Seller";

  const StatCard = ({ s }) => {
    const Icon = s.icon;
    return (
      <motion.div variants={fadeUp}
        className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3"
      >
        <div className="flex items-start justify-between">
          <div className={`${s.iconBg} w-10 h-10 rounded-xl flex items-center justify-center shrink-0`}>
            <Icon size={20} className={s.iconColor} />
          </div>
          {s.sparkline && <Sparkline />}
        </div>

        <div>
          <p className="text-xs text-gray-500 font-medium mb-0.5">{s.label}</p>
          <p className="text-2xl font-bold text-gray-900 leading-tight">
            {s.value}
            {s.valueSmall && <span className="text-base font-normal text-gray-400 ml-1">{s.valueSmall}</span>}
          </p>
        </div>

        {s.dual ? (
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm text-gray-400">{s.sub}</span>
            <span className="text-sm font-semibold text-red-500">{s.sub2}</span>
            <span className="text-xs text-gray-400">{s.sub2Label}</span>
          </div>
        ) : (
          <p className={`text-sm font-medium ${s.subColor}`}>{s.sub}</p>
        )}
      </motion.div>
    );
  };

  return (
    <div className="space-y-6 pb-8">

      {/* ── Welcome bar ── */}
      <motion.div initial="hidden" animate="show" variants={fadeUp}
        className="flex items-start justify-between flex-wrap gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {sellerName}! <span className="text-2xl">👋</span>
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Here's what's happening in your store today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors font-medium">
            <Calendar size={15} />
            May 12 – May 18, 2025
            <ChevronRight size={14} className="text-gray-400" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors font-medium">
            <Download size={15} />
            Export Report
          </button>
        </div>
      </motion.div>

      {/* ── Stats row 1 ── */}
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
        variants={stagger} initial="hidden" animate="show"
      >
        {STATS_ROW1.map((s, i) => <StatCard key={i} s={s} />)}
      </motion.div>

      {/* ── Stats row 2 ── */}
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
        variants={stagger} initial="hidden" animate="show"
      >
        {STATS_ROW2.map((s, i) => <StatCard key={i} s={s} />)}
      </motion.div>

      {/* ── Chart + Recent Orders ── */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">

        {/* Sales Overview */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.2 }}
          className="xl:col-span-3 bg-white rounded-xl border border-gray-100 shadow-sm p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-900">Sales Overview</h2>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-red-500 inline-block rounded" />Sales (₹)</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-blue-500 inline-block rounded" />Orders</span>
            </div>
          </div>
          <SalesChart />
          {/* Week summary */}
          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-50">
            <div>
              <p className="text-xs text-gray-500">This Week (May 12 – 18)</p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-lg font-bold text-gray-900">₹2,07,133</p>
                <span className="text-xs font-semibold text-green-500 flex items-center gap-0.5">
                  <ArrowUpRight size={12} /> 12.5%
                </span>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500">Last Week (May 05 – 11)</p>
              <p className="text-lg font-bold text-gray-900 mt-1">₹1,84,091</p>
            </div>
          </div>
        </motion.div>

        {/* Recent Orders */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.25 }}
          className="xl:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-900">Recent Orders</h2>
            <button className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors">View all</button>
          </div>
          <div className="space-y-3 flex-1">
            {RECENT_ORDERS.map((o, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{o.id}</p>
                  <p className="text-xs text-gray-400">{o.date}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{o.customer} · {o.items}</p>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mb-1 ${statusColor[o.status]}`}>
                    {o.status}
                  </span>
                  <p className="text-sm font-bold text-gray-900">{o.amount}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-600 transition-colors">
            View all orders <ArrowRight size={13} />
          </button>
        </motion.div>
      </div>

      {/* ── Top Selling Books + Recent Reviews ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

        {/* Top Selling Books */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.3 }}
          className="bg-white rounded-xl border border-gray-100 shadow-sm p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-900">Top Selling Books</h2>
            <button className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors">View all</button>
          </div>
          <div className="space-y-4">
            {TOP_BOOKS.map((b) => (
              <div key={b.rank} className="flex items-center gap-4">
                <span className="text-sm font-bold text-gray-400 w-4 shrink-0">{b.rank}</span>
                {/* placeholder cover */}
                <div className="w-10 h-14 rounded bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center shrink-0">
                  <BookOpen size={16} className="text-red-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{b.title}</p>
                  <p className="text-xs text-gray-400">{b.author}</p>
                  <div className="mt-1.5 bg-gray-100 rounded-full h-1.5 w-full">
                    <div
                      className="h-1.5 rounded-full bg-red-500 transition-all duration-700"
                      style={{ width: `${(b.sold / b.max) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-gray-400">Sold</p>
                  <p className="text-sm font-bold text-gray-900">{b.sold}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Reviews */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.35 }}
          className="bg-white rounded-xl border border-gray-100 shadow-sm p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-900">Recent Reviews</h2>
            <button className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors">View all</button>
          </div>
          <div className="space-y-4">
            {REVIEWS.map((r, i) => (
              <div key={i} className="flex gap-3 pb-4 border-b border-gray-50 last:border-0">
                <div className={`w-9 h-9 rounded-full ${r.color} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                  {r.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <p className="text-sm font-semibold text-gray-900">{r.name}</p>
                    <p className="text-xs text-gray-400">{r.date}</p>
                  </div>
                  <Stars n={r.stars} />
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{r.text}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

    </div>
  );
};

export default Dashboard;
