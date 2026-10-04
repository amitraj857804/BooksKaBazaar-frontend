import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  Search, RotateCcw, Eye, MoreVertical, ChevronDown,
  Truck, CheckCircle2, XCircle, RefreshCcw,
  Calendar, Package, X, Printer, Loader2,
} from "lucide-react";
import { useDebounce } from "../../hooks/useDebounce";
import SellerTrackingDrawer from "../../components/seller/SellerTrackingDrawer";

/* ─── helpers ─── */
const fmt = (n) => new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);

/* ─── Deterministic AWB generator (mock) ─── */
const COURIERS = ["Delhivery", "Ekart", "DTDC", "Xpressbees", "BlueDart"];
const generateAwb = (orderId) => {
  const seed = orderId.replace(/\D/g, "");
  const courier = COURIERS[seed % COURIERS.length];
  const awb = String(1000000000 + (seed * 7919) % 9000000000).slice(0, 10);
  return { courier, awb };
};

/* ─── Mock API ─── */
const mockGenerateLabel = (orderId) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate ~10% failure
      if (Math.random() < 0.1) {
        reject(new Error("Address PIN code unserviceable."));
      } else {
        resolve(generateAwb(orderId));
      }
    }, 1800);
  });

/* ─── Seed data — flat status model ─── */
const SEED_ORDERS = [
  {
    id: "#BKB12679", date: "May 18, 2025", time: "11:25 AM",
    customer: { name: "Amit Kumar", email: "amit.kumar@email.com", phone: "+91 98765 43210" },
    items: [{ title: "The Psychology of Money", img: "https://covers.openlibrary.org/b/id/10909258-M.jpg" }],
    extraItems: 2, method: "UPI", total: 1245,
    status: "Processing", courier: null, awb: null, deliveredOn: null,
  },
  {
    id: "#BKB12678", date: "May 18, 2025", time: "09:15 AM",
    customer: { name: "Neha Singh", email: "neha.singh@email.com", phone: "+91 98765 67890" },
    items: [{ title: "Atomic Habits", img: "https://covers.openlibrary.org/b/id/8739161-M.jpg" }],
    extraItems: 0, method: "UPI", total: 540,
    status: "Processing", courier: null, awb: null, deliveredOn: null,
  },
  {
    id: "#BKB12677", date: "May 17, 2025", time: "08:45 PM",
    customer: { name: "Rahul Verma", email: "rahul.verma@email.com", phone: "+91 91234 56789" },
    items: [{ title: "Rich Dad Poor Dad", img: "https://covers.openlibrary.org/b/id/8739161-M.jpg" }],
    extraItems: 1, method: "Card", total: 860,
    status: "Shipped", courier: "Delhivery", awb: "1234567890", deliveredOn: null,
  },
  {
    id: "#BKB12676", date: "May 17, 2025", time: "06:20 PM",
    customer: { name: "Pooja Mehta", email: "pooja.mehta@email.com", phone: "+91 98887 66554" },
    items: [{ title: "Deep Work", img: "https://covers.openlibrary.org/b/id/9253895-M.jpg" }],
    extraItems: 3, method: "UPI", total: 1780,
    status: "Delivered", courier: "Ekart", awb: "9876501234", deliveredOn: "May 18",
  },
  {
    id: "#BKB12675", date: "May 17, 2025", time: "04:10 PM",
    customer: { name: "Vikram Patel", email: "vikram.patel@email.com", phone: "+91 90887 65432" },
    items: [{ title: "The Alchemist", img: "https://covers.openlibrary.org/b/id/8235896-M.jpg" }],
    extraItems: 0, method: "Net Banking", total: 320,
    status: "Delivered", courier: "DTDC", awb: "5544332211", deliveredOn: "May 18",
  },
  {
    id: "#BKB12674", date: "May 16, 2025", time: "11:05 AM",
    customer: { name: "Sneha Reddy", email: "sneha.reddy@email.com", phone: "+91 91234 88990" },
    items: [{ title: "Sapiens", img: "https://covers.openlibrary.org/b/id/8739165-M.jpg" }],
    extraItems: 1, method: "UPI", total: 699,
    status: "Cancelled", courier: null, awb: null, deliveredOn: null,
  },
  {
    id: "#BKB12673", date: "May 16, 2025", time: "09:30 AM",
    customer: { name: "Arjun Nair", email: "arjun.nair@email.com", phone: "+91 99887 76543" },
    items: [{ title: "Think and Grow Rich", img: "https://covers.openlibrary.org/b/id/8739161-M.jpg" }],
    extraItems: 0, method: "UPI", total: 420,
    status: "Processing", courier: null, awb: null, deliveredOn: null,
  },
  {
    id: "#BKB12672", date: "May 15, 2025", time: "03:15 PM",
    customer: { name: "Kavya Rao", email: "kavya.rao@email.com", phone: "+91 91234 11223" },
    items: [{ title: "Zero to One", img: "https://covers.openlibrary.org/b/id/9253895-M.jpg" }],
    extraItems: 2, method: "Card", total: 1150,
    status: "Shipped", courier: "Delhivery", awb: "9876543210", deliveredOn: null,
  },
  {
    id: "#BKB12671", date: "May 15, 2025", time: "01:00 PM",
    customer: { name: "Deepak Joshi", email: "deepak.joshi@email.com", phone: "+91 99001 23456" },
    items: [{ title: "1984", img: "https://covers.openlibrary.org/b/id/8235896-M.jpg" }],
    extraItems: 0, method: "UPI", total: 299,
    status: "Processing", courier: null, awb: null, deliveredOn: null,
  },
  {
    id: "#BKB12670", date: "May 14, 2025", time: "10:45 AM",
    customer: { name: "Meera Iyer", email: "meera.iyer@email.com", phone: "+91 88765 43210" },
    items: [{ title: "The Lean Startup", img: "https://covers.openlibrary.org/b/id/9253895-M.jpg" }],
    extraItems: 1, method: "Net Banking", total: 890,
    status: "Delivered", courier: "Xpressbees", awb: "7788990011", deliveredOn: "May 16",
  },
  {
    id: "#BKB12669", date: "May 14, 2025", time: "08:00 AM",
    customer: { name: "Siddharth Gupta", email: "siddharth.g@email.com", phone: "+91 97654 32109" },
    items: [{ title: "Ikigai", img: "https://covers.openlibrary.org/b/id/8739165-M.jpg" }],
    extraItems: 0, method: "UPI", total: 499,
    status: "Return/RTO", courier: "Delhivery", awb: "1122334455", deliveredOn: null,
  },
  {
    id: "#BKB12668", date: "May 13, 2025", time: "05:20 PM",
    customer: { name: "Priya Sharma", email: "priya.s@email.com", phone: "+91 91234 56780" },
    items: [{ title: "The 5 AM Club", img: "https://covers.openlibrary.org/b/id/8235896-M.jpg" }],
    extraItems: 1, method: "Card", total: 699,
    status: "Cancelled", courier: null, awb: null, deliveredOn: null,
  },
];

/* ─── Status badge config ─── */
const STATUS_CFG = {
  Processing: { badge: "bg-purple-100 text-purple-700 border-purple-200", dot: "bg-purple-400" },
  Shipped: { badge: "bg-blue-100   text-blue-700   border-blue-200", dot: "bg-blue-400" },
  Delivered: { badge: "bg-green-100  text-green-700  border-green-200", dot: "bg-green-400" },
  Cancelled: { badge: "bg-red-100    text-red-600    border-red-200", dot: "bg-red-400" },
  "Return/RTO": { badge: "bg-gray-100   text-gray-600   border-gray-200", dot: "bg-gray-400" },
};

/* ─── Tabs ─── */
const TABS = [
  { label: "All Orders", status: "All", count: 342 },
  { label: "Processing", status: "Processing", count: 154 },
  { label: "Shipped", status: "Shipped", count: 142 },
  { label: "Delivered", status: "Delivered", count: 40 },
  { label: "Cancelled / RTO", status: "Cancelled/RTO", count: 18 },
];

const PAGE_SIZES = [10, 25, 50];

/* ────────────────── sub-components ────────────────── */

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CFG[status] ?? STATUS_CFG["Processing"];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {status}
    </span>
  );
};

/* Fulfillment cell — 3 states only */
const FulfillmentCell = ({ order, onOpenDrawer }) => {
  if (order.status === "Processing") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border bg-amber-50 text-amber-700 border-amber-200">
        <Package size={11} />
        Awaiting Dispatch
      </span>
    );
  }
  if (order.status === "Shipped" && order.courier) {
    return (
      <span

        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 active:scale-95 transition-all"
      >
        <Truck size={11} />
        {order.courier} • {order.awb}
      </span>
    );
  }
  if (order.status === "Delivered") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border bg-green-50 text-green-700 border-green-200">
        <CheckCircle2 size={11} />
        Delivered{order.deliveredOn ? ` on ${order.deliveredOn}` : ""}
      </span>
    );
  }
  if (order.status === "Cancelled") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border bg-red-50 text-red-600 border-red-200">
        <XCircle size={11} />
        Cancelled
      </span>
    );
  }
  if (order.status === "Return/RTO") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border bg-gray-100 text-gray-600 border-gray-200">
        <RefreshCcw size={11} />
        Return / RTO
      </span>
    );
  }
  return <span className="text-xs text-gray-400">—</span>;
};

/* Single action cell */
const ActionCell = ({ order, onShip, shipping, onOpenDrawer }) => {
  const isShipping = shipping === order.id;

  if (order.status === "Processing") {
    return (
      <button
        id={`ship-${order.id}`}
        onClick={() => onShip(order)}
        disabled={isShipping}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg text-[11px] font-bold transition-all cursor-pointer disabled:cursor-not-allowed whitespace-nowrap shadow-sm shadow-red-200 active:scale-95"
      >
        {isShipping ? (
          <Loader2 size={11} className="animate-spin" />
        ) : (
          <Truck size={11} />
        )}
        {isShipping ? "Processing…" : "Generate Label & Ship"}
      </button>
    );
  }
  if (order.status === "Shipped") {
    return (
      <button
        id={`track-${order.id}`}
        onClick={() => onOpenDrawer(order)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95"
      >
        <Truck size={11} />
        Track Package
      </button>
    );
  }
  if (order.status === "Delivered") {
    return (
      <button
        id={`invoice-${order.id}`}
        onClick={() => {
          toast.success(`Invoice for ${order.id} sent to printer.`, { duration: 3000 });
          window.print();
        }}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 shadow-sm"
      >
        <Printer size={11} />
        Print Invoice
      </button>
    );
  }
  return null;
};

const FilterSelect = ({ options, value, onChange }) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="appearance-none pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 transition-all cursor-pointer font-medium"
    >
      {options.map((o) => <option key={o}>{o}</option>)}
    </select>
    <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
  </div>
);

/* ═══════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════ */
export default function SellerOrdersPage() {
  /* orders live in state so mutations re-render */
  const [orders, setOrders] = useState(SEED_ORDERS);
  const [shippingId, setShippingId] = useState(null);   // which order is mid-API
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [paymentFilter, setPayment] = useState("Payment Method");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [trackingOrder, setTracking] = useState(null);

  const debouncedSearch = useDebounce(search, 280);

  /* ── filter logic ── */
  const filtered = useMemo(() => {
    let list = [...orders];

    // Tab filter
    if (activeTab === "Cancelled/RTO") {
      list = list.filter((o) => o.status === "Cancelled" || o.status === "Return/RTO");
    } else if (activeTab !== "All") {
      list = list.filter((o) => o.status === activeTab);
    }

    // Search
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.customer.name.toLowerCase().includes(q) ||
          o.items.some((i) => i.title.toLowerCase().includes(q)) ||
          (o.awb && o.awb.includes(q))
      );
    }

    // Payment method
    if (paymentFilter !== "Payment Method") {
      list = list.filter((o) => o.method === paymentFilter);
    }

    return list;
  }, [orders, activeTab, debouncedSearch, paymentFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const resetFilters = () => {
    setSearch(""); setPayment("Payment Method");
    setActiveTab("All"); setPage(1);
  };

  /* ── 1-click "Generate Label & Ship" ── */
  const handleShip = useCallback(async (order) => {
    setShippingId(order.id);

    const loadingToastId = toast.loading(
      "Assigning courier & generating shipping label…",
      { id: `ship-${order.id}` }
    );

    try {
      const { courier, awb } = await mockGenerateLabel(order.id);

      // Mutate the order in state
      setOrders((prev) =>
        prev.map((o) =>
          o.id === order.id
            ? { ...o, status: "Shipped", courier, awb }
            : o
        )
      );

      // Dismiss loading, show rich success toast
      toast.dismiss(loadingToastId);
      toast.custom(
        (t) => (
          <div
            className={`max-w-md w-full bg-white shadow-lg rounded-xl border border-green-100 p-4 flex items-start gap-3 transition-all ${t.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
              }`}
          >
            <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
              <CheckCircle2 size={18} className="text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900">Label generated!</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {order.id} · {courier} · AWB&nbsp;
                <span className="font-mono font-semibold text-gray-700">{awb}</span>
              </p>
            </div>
            <button
              onClick={() => { toast.dismiss(t.id); window.print(); }}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 hover:bg-gray-800 text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
            >
              <Printer size={11} />
              Print Label
            </button>
          </div>
        ),
        { duration: 7000 }
      );
    } catch (err) {
      toast.error(`Failed to generate label: ${err.message}`, {
        id: loadingToastId,
        duration: 5000,
      });
    } finally {
      setShippingId(null);
    }
  }, []);

  return (
    <div className="space-y-5">

      {/* ── Tracking Drawer ── */}
      <AnimatePresence>
        {trackingOrder && (
          <SellerTrackingDrawer
            key="tracking-drawer"
            order={trackingOrder}
            onClose={() => setTracking(null)}
          />
        )}
      </AnimatePresence>

      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage, track and fulfill customer orders.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer shrink-0">
          <Calendar size={14} />
          May 12 – May 18, 2025
          <ChevronDown size={13} className="text-gray-400" />
        </button>
      </div>

      {/* ── Filters bar ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            id="seller-order-search"
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search Order ID, Customer, Book, AWB…"
            className="w-full pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 shrink-0">
          <FilterSelect
            options={["Payment Method", "UPI", "Card", "Net Banking"]}
            value={paymentFilter}
            onChange={(v) => { setPayment(v); setPage(1); }}
          />
          <button
            onClick={resetFilters}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors font-medium cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw size={13} /> Reset
          </button>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 overflow-x-auto border-b border-gray-100 scrollbar-hide">
        {TABS.map((tab) => {
          const active = activeTab === tab.status;
          return (
            <button
              key={tab.status}
              id={`tab-orders-${tab.status.toLowerCase().replace(/[^a-z]/g, "-")}`}
              onClick={() => { setActiveTab(tab.status); setPage(1); }}
              className={`relative px-4 py-2.5 text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer shrink-0 ${active ? "text-red-600" : "text-gray-500 hover:text-gray-700"
                }`}
            >
              {tab.label}{" "}
              <span className={`text-xs ${active ? "text-red-500" : "text-gray-400"}`}>
                ({tab.count})
              </span>
              {active && (
                <motion.div
                  layoutId="order-tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500 rounded-t"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* ── Table ── */}
      <AnimatePresence mode="wait">
        {paginated.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-14 text-center"
          >
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gray-50 flex items-center justify-center">
              <Package size={24} className="text-gray-300" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">No orders found</h3>
            <p className="text-sm text-gray-400">Try adjusting your filters or search query.</p>
          </motion.div>
        ) : (
          <motion.div
            key="table"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[980px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/70">
                    {["Order ID", "Customer", "Items", "Date & Payment", "Total","Status", "Fulfillment",  "Action", ""].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginated.map((order) => (
                    <motion.tr
                      key={order.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50/50 transition-colors group"
                    >
                      {/* ORDER ID */}
                      <td className="px-4 py-4 align-top">
                        <p className="font-bold text-gray-900 text-[13px] font-mono">{order.id}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5 font-sans">{order.date}</p>
                      </td>

                      {/* CUSTOMER */}
                      <td className="px-4 py-4 align-top min-w-[175px]">
                        <p className="font-semibold text-gray-900 text-[13px]">{order.customer.name}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{order.customer.email}</p>
                        <p className="text-[11px] text-gray-400">{order.customer.phone}</p>
                      </td>

                      {/* ITEMS */}
                      <td className="px-4 py-4 align-top min-w-[190px]">
                        <div className="flex items-start gap-2.5">
                          <div className="w-9 h-12 rounded-md overflow-hidden border border-gray-100 shrink-0 bg-gray-50">
                            <img
                              src={order.items[0].img}
                              alt={order.items[0].title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = "https://placehold.co/36x48/f3f4f6/9ca3af?text=📚";
                              }}
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[12px] font-semibold text-gray-800 leading-snug line-clamp-2">
                              {order.items[0].title}
                            </p>
                            {order.extraItems > 0 && (
                              <span className="inline-block mt-1 text-[10px] font-bold bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">
                                +{order.extraItems} more
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* DATE & PAYMENT */}
                      <td className="px-4 py-4 align-top whitespace-nowrap">
                        <p className="text-[12px] font-medium text-gray-700">{order.date}</p>
                        <p className="text-[11px] text-gray-400">{order.time}</p>
                        <span className="inline-block mt-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-green-50 text-green-700">
                          Paid via {order.method}
                        </span>
                      </td>

                      {/* TOTAL */}
                      <td className="px-4 py-4 align-top whitespace-nowrap">
                        <p className="text-[13px] font-bold text-gray-900">₹{fmt(order.total)}</p>
                      </td>
                  
                      {/* STATUS */}
                      <td className="px-4 py-4 align-top">
                        <StatusBadge status={order.status} />
                      </td>

                      {/* FULFILLMENT */}
                      <td className="px-4 py-4 align-top min-w-[190px]">
                        <FulfillmentCell order={order} onOpenDrawer={setTracking} />
                      </td>

                      {/* ACTION */}
                      <td className="px-4 py-4 align-top min-w-[170px]">
                        <ActionCell
                          order={order}
                          onShip={handleShip}
                          shipping={shippingId}
                          onOpenDrawer={setTracking}
                        />
                      </td>

                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── Pagination ── */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-gray-100 bg-gray-50/40">
              <p className="text-xs text-gray-500">
                Showing {filtered.length === 0 ? 0 : (page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length} orders
              </p>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  Show
                  <div className="relative">
                    <select
                      value={pageSize}
                      onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                      className="appearance-none pl-2 pr-6 py-1 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 bg-white focus:outline-none cursor-pointer"
                    >
                      {PAGE_SIZES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                    <ChevronDown size={11} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                  per page
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1 text-xs font-semibold border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    Prev
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${page === p
                        ? "bg-red-600 text-white border-red-600"
                        : "border-gray-200 text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1 text-xs font-semibold border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
