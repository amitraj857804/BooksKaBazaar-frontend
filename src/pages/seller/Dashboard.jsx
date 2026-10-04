import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
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
  PlusCircle,
  Tag,
  Megaphone,
  CheckCircle2,
} from "lucide-react";
import { adminApi } from "../../services/admin/adminApi";

/* ─── helpers ─── */
const fmt = (n) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);

const statusColor = {
  Pending:    "bg-orange-100 text-orange-600",
  Processing: "bg-blue-100 text-blue-600",
  Shipped:    "bg-purple-100 text-purple-600",
  Delivered:  "bg-green-100 text-green-600",
  Cancelled:  "bg-red-100 text-red-600",
  PAID:       "bg-green-100 text-green-600",
  PENDING:    "bg-orange-100 text-orange-600",
  FAILED:     "bg-red-100 text-red-600",
  REFUNDED:   "bg-purple-100 text-purple-600",
};

// Parse Java LocalDateTime array [year, month, day, hour, min, sec, nano] → readable string
const parseJavaDate = (arr) => {
  if (!Array.isArray(arr) || arr.length < 3) return "—";
  const [year, month, day, hour = 0, min = 0] = arr;
  const date = new Date(year, month - 1, day, hour, min);
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    + " " + date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
};


// Static TOP_BOOKS removed — fetched live from /admin/dashboard/top-selling-books

// Static REVIEWS removed — fetched live from /admin/dashboard/recent-reviews

// Deterministic avatar color from name
const AVATAR_COLORS = [
  "bg-purple-500", "bg-teal-500", "bg-orange-500",
  "bg-blue-500",   "bg-pink-500",  "bg-emerald-500",
];
const avatarColor = (name = "") => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

/* ─── Recharts sparkline for Total Sales card ─── */
const SPARKLINE_DATA = [
  { v: 18 }, { v: 30 }, { v: 22 }, { v: 40 },
  { v: 32 }, { v: 38 }, { v: 28 }, { v: 35 },
];

const Sparkline = () => (
  <AreaChart width={80} height={32} data={SPARKLINE_DATA} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
    <defs>
      <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.25} />
        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
      </linearGradient>
    </defs>
    <Area type="monotone" dataKey="v" stroke="#22c55e" strokeWidth={2} fill="url(#sparkGrad)" dot={false} isAnimationActive={false} />
  </AreaChart>
);

/* ─── date helpers ─── */
const fmtChartDate = (dateStr) => {
  if (!dateStr) return "";
  const [, month, day] = dateStr.split("-");
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${monthNames[parseInt(month, 10) - 1]} ${parseInt(day, 10)}`;
};

// Fill every date in [fromDate, toDate] with ₹0 for missing days
// so the chart always has a full range and never shows a lone dot.
const fillDateRange = (fromDate, toDate, dataPoints) => {
  if (!fromDate || !toDate) return dataPoints;
  const revenueMap = {};
  dataPoints.forEach((p) => { revenueMap[p.date] = parseFloat(p.revenue) || 0; });

  const result = [];
  const cur = new Date(fromDate);
  const end = new Date(toDate);
  while (cur <= end) {
    const iso = cur.toISOString().split("T")[0]; // "2026-08-21"
    result.push({ day: fmtChartDate(iso), revenue: revenueMap[iso] ?? 0 });
    cur.setDate(cur.getDate() + 1);
  }
  return result;
};

/* ─── custom tooltip ─── */
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3 text-sm">
      <p className="font-semibold text-gray-700 mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: p.color }} />
          <span className="text-gray-500">{p.name}:</span>
          <span className="font-bold text-gray-800">₹{new Intl.NumberFormat("en-IN").format(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

/* ─── Sales Overview chart — area chart for revenue trend ─── */
const SalesChart = ({ data = [], loading = false }) => {
  if (loading) {
    return (
      <div className="h-[280px] flex items-center justify-center">
        <div className="space-y-4 w-full px-4 animate-pulse">
          {[40, 65, 45, 80, 60, 75, 55].map((w, i) => (
            <div key={i} className="h-2 bg-gray-100 rounded" style={{ width: `${w}%` }} />
          ))}
        </div>
      </div>
    );
  }
  if (!data.length) {
    return (
      <div className="h-[280px] flex items-center justify-center">
        <p className="text-sm text-gray-400">No sales data available for this period.</p>
      </div>
    );
  }
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 8 }}>
        <defs>
          <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.18} />
            <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="revenueStroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis
          dataKey="day"
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
          dy={8}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) =>
            v === 0 ? "₹0" :
            `₹${new Intl.NumberFormat("en-IN", { notation: "compact", maximumFractionDigits: 1 }).format(v)}`
          }
          width={52}
        />
        <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#e2e8f0", strokeWidth: 1.5 }} />
        <Area
          type="monotone"
          dataKey="revenue"
          name="Revenue (₹)"
          stroke="#ef4444"
          strokeWidth={2.5}
          fill="url(#revenueGrad)"
          dot={(props) => {
            // Only show dot on days with actual revenue
            if (props.payload.revenue === 0) return <g key={props.key} />;
            return (
              <circle
                key={props.key}
                cx={props.cx} cy={props.cy} r={4}
                fill="#ef4444" stroke="#fff" strokeWidth={2}
              />
            );
          }}
          activeDot={{ r: 6, fill: "#ef4444", stroke: "#fff", strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

/* ─── Stars ─── */
const Stars = ({ n }) => (
  <span className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map(i => (
      <Star key={i} size={13} className={i <= n ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"} />
    ))}
  </span>
);

/* ─── Animation variants ─── */
const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

/* ═══════════════════════════════════════════════════════════ */
const Dashboard = () => {
  const adminData = JSON.parse(localStorage.getItem("adminData") || "{}");
  const sellerName = adminData.sellerName || "Seller";

  const [summary, setSummary] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [loadingChart, setLoadingChart] = useState(true);
  const [topBooks, setTopBooks] = useState([]);
  const [loadingTopBooks, setLoadingTopBooks] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  useEffect(() => {
    adminApi.getDashboardSummary()
      .then((res) => setSummary(res.data))
      .catch((err) => console.warn("[Dashboard] Summary fetch failed:", err?.response?.status, err?.message))
      .finally(() => setLoadingStats(false));

    adminApi.getRecentOrders()
      .then((res) => setRecentOrders(res?.data || []))
      .catch((err) => {
        const status = err?.response?.status;
        if (status === 403) setOrdersError("You don't have permission to view orders.");
        else if (status === 404) setOrdersError("Orders endpoint not found.");
        else setOrdersError("Failed to load recent orders.");
        console.warn("[Dashboard] Recent orders fetch failed:", status, err?.message);
      })
      .finally(() => setLoadingOrders(false));

    adminApi.getSalesOverview()
      .then((res) => setSalesData(fillDateRange(res?.fromDate, res?.toDate, res?.data || [])))
      .catch((err) => console.warn("[Dashboard] Sales overview fetch failed:", err?.response?.status, err?.message))
      .finally(() => setLoadingChart(false));

    adminApi.getTopSellingBooks()
      .then((res) => setTopBooks(res?.data || []))
      .catch((err) => console.warn("[Dashboard] Top books fetch failed:", err?.response?.status, err?.message))
      .finally(() => setLoadingTopBooks(false));

    adminApi.getRecentReviews()
      .then((res) => setReviews(res?.data || []))
      .catch((err) => console.warn("[Dashboard] Recent reviews fetch failed:", err?.response?.status, err?.message))
      .finally(() => setLoadingReviews(false));
  }, []);

  /* ── Build stat cards from live data ── */
  const statsRow1 = summary
    ? [
        {
          label: "Today's Orders",
          value: String(summary.todayOrders?.total ?? 0),
          sub: `${summary.todayOrders?.pending ?? 0} pending`,
          subColor: "text-orange-500",
          icon: ShoppingBag,
          iconBg: "bg-blue-50",
          iconColor: "text-blue-500",
        },
        {
          label: "Total Orders",
          value: fmt(summary.totalOrders ?? 0),
          sub: "Since you started selling",
          subColor: "text-gray-400",
          icon: Package,
          iconBg: "bg-purple-50",
          iconColor: "text-purple-500",
        },
        {
          label: "Total Books Listed",
          value: String(summary.totalBooksListed?.total ?? 0),
          sub: `${summary.totalBooksListed?.listed ?? 0} live · ${summary.totalBooksListed?.draft ?? 0} draft`,
          subColor: "text-gray-400",
          icon: BookOpen,
          iconBg: "bg-purple-50",
          iconColor: "text-purple-500",
        },
      ]
    : [];

  const statsRow2 = summary
    ? [
       {
          label: "Today's Earning",
          value: `₹${fmt(summary.todayEarnings ?? 0)}`,
          sub: `From ${summary.todayEarningOrderCount ?? 0} orders`,
          subColor: "text-green-500",
          icon: IndianRupee,
          iconBg: "bg-green-50",
          iconColor: "text-green-500",
        },
        {
          label: "Total Earning",
          value: `₹${fmt(summary.totalEarnings ?? 0)}`,
          sub: "After commission",
          subColor: "text-gray-400",
          icon: IndianRupee,
          iconBg: "bg-green-50",
          iconColor: "text-green-500",
        },
       
        {
          label: "Last Week Sales",
          value: `${fmt(summary.lastWeekSales ?? 0)}`,
          sub: "Previous 7 days",
          subColor: "text-gray-400",
          icon: TrendingUp,
          iconBg: "bg-orange-50",
          iconColor: "text-orange-500",
          sparkline: true,
        },
      ]
    : [];

  /* ── Skeleton card for loading state ── */
  const SkeletonCard = () => (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex flex-col gap-3 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl bg-gray-100" />
      </div>
      <div className="space-y-2">
        <div className="h-3 w-24 bg-gray-100 rounded" />
        <div className="h-7 w-32 bg-gray-200 rounded" />
        <div className="h-3 w-20 bg-gray-100 rounded" />
      </div>
    </div>
  );

  const StatCard = ({ s }) => {
    const Icon = s.icon;
    return (
      <motion.div variants={fadeUp}
        className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3"
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

      </motion.div>

      {/* ── 4-cell grid: [Stats][Recent Orders] / [Sales Overview][Top Books] ── */}
      {/* CSS grid items in the same row auto-share height — no hardcoded pixels needed */}
      <div className="grid grid-cols-1 xl:grid-cols-3 xl:grid-rows-[auto_1fr] gap-4">

        {/* CELL 1 (row 1, col 1-2): Stats rows */}
        <div className="xl:col-span-2 flex flex-col gap-4">
          <motion.div className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            variants={stagger} initial="hidden" animate="show"
          >
            {loadingStats
              ? [0, 1, 2].map((i) => <SkeletonCard key={i} />)
              : statsRow1.map((s, i) => <StatCard key={i} s={s} />)}
          </motion.div>

          <motion.div className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            variants={stagger} initial="hidden" animate="show"
          >
            {loadingStats
              ? [0, 1, 2].map((i) => <SkeletonCard key={i} />)
              : statsRow2.map((s, i) => <StatCard key={i} s={s} />)}
          </motion.div>
        </div>

        {/* CELL 2 (row 1, col 3): Recent Orders — same row as stats, auto-same height */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.15 }}
          className="xl:col-span-1 bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-gray-900">Recent Orders</h2>
            <button className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors">View all</button>
          </div>
          {/* flex-1 so the list fills whatever height the grid gives this cell */}
          <div className="divide-y divide-gray-50 overflow-y-auto flex-1">
            {loadingOrders ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between py-2.5 animate-pulse">
                  <div className="space-y-1.5">
                    <div className="h-3 w-24 bg-gray-100 rounded" />
                    <div className="h-2.5 w-32 bg-gray-100 rounded" />
                  </div>
                  <div className="h-5 w-14 bg-gray-100 rounded-full" />
                </div>
              ))
            ) : ordersError ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-xs text-red-400 font-medium text-center">{ordersError}</p>
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-gray-400">No recent orders yet.</p>
              </div>
            ) : (
              recentOrders.slice(0, 4).map((o) => (
                <div key={o.orderId} className="flex items-center justify-between py-2.5">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900">#{o.orderId}</p>
                    <p className="text-xs text-gray-400">{parseJavaDate(o.orderDate)}</p>
                    <p className="text-xs text-gray-600 mt-0.5">
                      {o.customerName} · {o.bookNames?.length ?? 0} {o.bookNames?.length === 1 ? "item" : "items"}
                    </p>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mb-1 ${statusColor[o.paymentStatus] || "bg-gray-100 text-gray-500"}`}>
                      {o.paymentStatus}
                    </span>
                    <p className="text-sm font-bold text-gray-900">₹{fmt(o.totalAmount)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* CELL 3 (row 2, col 1-2): Sales Overview */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.2 }}
          className="xl:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col"
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-bold text-gray-900">Sales Overview</h2>
          </div>
          <SalesChart data={salesData} loading={loadingChart} />
          <div className="grid grid-cols-2 gap-4 mt-2 pt-3 border-t border-gray-50">
            <div>
              <p className="text-xs text-gray-500">Last Week Sales</p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-lg font-bold text-gray-900">
                  {summary ? `${fmt(summary.lastWeekSales ?? 0)}` : "—"}
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Earnings</p>
              <p className="text-lg font-bold text-gray-900 mt-1">
                {summary ? `₹${fmt(summary.totalEarnings ?? 0)}` : "—"}
              </p>
            </div>
          </div>
        </motion.div>

        {/* CELL 4 (row 2, col 3): Top Selling Books — live from API */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.25 }}
          className="xl:col-span-1 bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-900">Top Selling Books</h2>
          </div>
          <div className="flex flex-col gap-4 flex-1 justify-start">
            {loadingTopBooks ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="w-4 h-3 bg-gray-100 rounded shrink-0" />
                  <div className="w-9 h-12 rounded bg-gray-100 shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 bg-gray-100 rounded w-3/4" />
                    <div className="h-2.5 bg-gray-100 rounded w-1/2" />
                    <div className="h-1 bg-gray-100 rounded-full w-full" />
                  </div>
                  <div className="w-6 h-5 bg-gray-100 rounded shrink-0" />
                </div>
              ))
            ) : topBooks.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-sm text-gray-400">No sales data yet.</p>
              </div>
            ) : (() => {
              const maxSold = Math.max(...topBooks.map((b) => b.unitsSold), 1);
              return topBooks.slice(0, 5).map((b, i) => (
                <div key={b.bookId} className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-300 w-4 shrink-0">{i + 1}</span>
                  {/* Book cover — real image or fallback icon */}
                  <div className="w-9 h-12 rounded overflow-hidden shrink-0 bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
                    {b.imageUrl ? (
                      <img
                        src={b.imageUrl}
                        alt={b.bookTitle}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
                      />
                    ) : null}
                    <div className="w-full h-full flex items-center justify-center" style={{ display: b.imageUrl ? "none" : "flex" }}>
                      <BookOpen size={14} className="text-red-400" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{b.bookTitle}</p>
                    <p className="text-xs text-gray-400 truncate">{b.authorName}</p>
                    <div className="mt-1 bg-gray-100 rounded-full h-1 w-full">
                      <div
                        className="h-1 rounded-full bg-gradient-to-r from-red-500 to-orange-400 transition-all duration-700"
                        style={{ width: `${(b.unitsSold / maxSold) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[10px] text-gray-400">Sold</p>
                    <p className="text-sm font-bold text-gray-900">{b.unitsSold}</p>
                  </div>
                </div>
              ));
            })()}
          </div>
        </motion.div>

      </div>

      {/* ── Recent Reviews — full width, live from API ── */}
      <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.35 }}
        className="bg-white rounded-xl border border-gray-100 shadow-sm p-5"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-gray-900">Recent Reviews</h2>
          <button className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors">View all</button>
        </div>

        {loadingReviews ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100 animate-pulse">
                <div className="w-9 h-9 rounded-full bg-gray-200 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-2.5 bg-gray-100 rounded w-1/3" />
                  <div className="h-2.5 bg-gray-100 rounded w-full" />
                  <div className="h-2.5 bg-gray-100 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="py-10 text-center">
            <Star size={32} className="text-gray-200 mx-auto mb-3" />
            <p className="text-sm text-gray-400 font-medium">No reviews yet.</p>
            <p className="text-xs text-gray-300 mt-1">Customer reviews will appear here once orders are reviewed.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {reviews.map((r, i) => {
              // Support multiple possible field names from the backend
              const name = r.reviewerName || r.customerName || r.userName || r.name || "Customer";
              const rating = r.rating ?? r.stars ?? 0;
              const comment = r.comment || r.review || r.text || "";
              const bookTitle = r.bookTitle || r.book || "";
              const rawDate = r.reviewDate || r.createdAt || r.date || "";
              const displayDate = rawDate
                ? new Date(rawDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                : "";
              return (
                <div key={r.reviewId ?? r.id ?? i} className="flex gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <div className={`w-9 h-9 rounded-full ${avatarColor(name)} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                    {name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <p className="text-sm font-semibold text-gray-900 truncate">{name}</p>
                      <p className="text-xs text-gray-400">{displayDate}</p>
                    </div>
                    {bookTitle && (
                      <p className="text-[10px] text-red-400 font-medium truncate mt-0.5">{bookTitle}</p>
                    )}
                    <Stars n={rating} />
                    {comment && (
                      <p className="text-xs text-gray-500 mt-1.5 leading-relaxed line-clamp-3">{comment}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>

    </div>
  );
};

export default Dashboard;
