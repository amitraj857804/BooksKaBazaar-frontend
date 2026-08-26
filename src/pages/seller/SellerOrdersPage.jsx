import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Filter, RotateCcw, Eye, MoreVertical, ChevronDown,
  ShoppingBag, Clock, Settings2, Truck, CheckCircle2, XCircle,
  RefreshCcw, Calendar, Package, IndianRupee, X,
} from "lucide-react";
import { useDebounce } from "../../hooks/useDebounce";

/* ─── helpers ─── */
const fmt = (n) => new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);

/* ─── mock orders data ─── */
const MOCK_ORDERS = [
  {
    id: "#BKB12679", date: "May 18, 2025", time: "11:25 AM",
    customer: { name: "Amit Kumar", email: "amit.kumar@email.com", phone: "+91 98765 43210" },
    items: [{ title: "The Psychology of Money", img: "https://covers.openlibrary.org/b/id/10909258-M.jpg" }],
    extraItems: 2, payment: "Paid", method: "UPI",
    fulfillment: "Not Packed", fulfillmentDetail: "",
    total: 1245, orderStatus: "Pending", fulfillmentStatus: "Pending",
  },
  {
    id: "#BKB12678", date: "May 18, 2025", time: "09:15 AM",
    customer: { name: "Neha Singh", email: "neha.singh@email.com", phone: "+91 98765 67890" },
    items: [{ title: "Atomic Habits", img: "https://covers.openlibrary.org/b/id/8739161-M.jpg" }],
    extraItems: 0, payment: "Paid", method: "UPI",
    fulfillment: "Packing", fulfillmentDetail: "",
    total: 540, orderStatus: "Processing", fulfillmentStatus: "Processing",
  },
  {
    id: "#BKB12677", date: "May 17, 2025", time: "08:45 PM",
    customer: { name: "Rahul Verma", email: "rahul.verma@email.com", phone: "+91 91234 56789" },
    items: [{ title: "Rich Dad Poor Dad", img: "https://covers.openlibrary.org/b/id/8739161-M.jpg" }],
    extraItems: 1, payment: "Paid", method: "Card",
    fulfillment: "Delivery + 1234567890", fulfillmentDetail: "May 17, 2025",
    total: 860, orderStatus: "Shipped", fulfillmentStatus: "Shipped",
  },
  {
    id: "#BKB12676", date: "May 17, 2025", time: "06:20 PM",
    customer: { name: "Pooja Mehta", email: "pooja.mehta@email.com", phone: "+91 98887 66554" },
    items: [{ title: "Deep Work", img: "https://covers.openlibrary.org/b/id/9253895-M.jpg" }],
    extraItems: 3, payment: "Paid", method: "UPI",
    fulfillment: "Delivered on May 18", fulfillmentDetail: "11:30 AM",
    total: 1780, orderStatus: "Delivered", fulfillmentStatus: "Delivered",
  },
  {
    id: "#BKB12675", date: "May 17, 2025", time: "04:10 PM",
    customer: { name: "Vikram Patel", email: "vikram.patel@email.com", phone: "+91 90887 65432" },
    items: [{ title: "The Alchemist", img: "https://covers.openlibrary.org/b/id/8235896-M.jpg" }],
    extraItems: 0, payment: "Paid", method: "Net Banking",
    fulfillment: "Delivered on May 18", fulfillmentDetail: "09:45 AM",
    total: 320, orderStatus: "Delivered", fulfillmentStatus: "Delivered",
  },
  {
    id: "#BKB12674", date: "May 16, 2025", time: "11:05 AM",
    customer: { name: "Sneha Reddy", email: "sneha.reddy@email.com", phone: "+91 91234 88990" },
    items: [{ title: "Sapiens", img: "https://covers.openlibrary.org/b/id/8739165-M.jpg" }],
    extraItems: 1, payment: "Refunded", method: "UPI",
    fulfillment: "Cancelled on May 16", fulfillmentDetail: "11:20 AM",
    total: 699, orderStatus: "Cancelled", fulfillmentStatus: "Cancelled",
  },
  {
    id: "#BKB12673", date: "May 16, 2025", time: "09:30 AM",
    customer: { name: "Arjun Nair", email: "arjun.nair@email.com", phone: "+91 99887 76543" },
    items: [{ title: "Think and Grow Rich", img: "https://covers.openlibrary.org/b/id/8739161-M.jpg" }],
    extraItems: 0, payment: "Paid", method: "UPI",
    fulfillment: "Packing", fulfillmentDetail: "",
    total: 420, orderStatus: "Processing", fulfillmentStatus: "Processing",
  },
  {
    id: "#BKB12672", date: "May 15, 2025", time: "03:15 PM",
    customer: { name: "Kavya Rao", email: "kavya.rao@email.com", phone: "+91 91234 11223" },
    items: [{ title: "Zero to One", img: "https://covers.openlibrary.org/b/id/9253895-M.jpg" }],
    extraItems: 2, payment: "Paid", method: "Card",
    fulfillment: "Delivery + 9876543210", fulfillmentDetail: "May 16, 2025",
    total: 1150, orderStatus: "Shipped", fulfillmentStatus: "Shipped",
  },
  {
    id: "#BKB12671", date: "May 15, 2025", time: "01:00 PM",
    customer: { name: "Deepak Joshi", email: "deepak.joshi@email.com", phone: "+91 99001 23456" },
    items: [{ title: "1984", img: "https://covers.openlibrary.org/b/id/8235896-M.jpg" }],
    extraItems: 0, payment: "Paid", method: "UPI",
    fulfillment: "Not Packed", fulfillmentDetail: "",
    total: 299, orderStatus: "Pending", fulfillmentStatus: "Pending",
  },
  {
    id: "#BKB12670", date: "May 14, 2025", time: "10:45 AM",
    customer: { name: "Meera Iyer", email: "meera.iyer@email.com", phone: "+91 88765 43210" },
    items: [{ title: "The Lean Startup", img: "https://covers.openlibrary.org/b/id/9253895-M.jpg" }],
    extraItems: 1, payment: "Paid", method: "Net Banking",
    fulfillment: "Delivered on May 16", fulfillmentDetail: "02:30 PM",
    total: 890, orderStatus: "Delivered", fulfillmentStatus: "Delivered",
  },
  {
    id: "#BKB12669", date: "May 14, 2025", time: "08:00 AM",
    customer: { name: "Siddharth Gupta", email: "siddharth.g@email.com", phone: "+91 97654 32109" },
    items: [{ title: "Ikigai", img: "https://covers.openlibrary.org/b/id/8739165-M.jpg" }],
    extraItems: 0, payment: "Paid", method: "UPI",
    fulfillment: "Return Initiated", fulfillmentDetail: "May 15, 2025",
    total: 499, orderStatus: "Return/RTO", fulfillmentStatus: "Return/RTO",
  },
  {
    id: "#BKB12668", date: "May 13, 2025", time: "05:20 PM",
    customer: { name: "Priya Sharma", email: "priya.s@email.com", phone: "+91 91234 56780" },
    items: [{ title: "The 5 AM Club", img: "https://covers.openlibrary.org/b/id/8235896-M.jpg" }],
    extraItems: 1, payment: "Refunded", method: "Card",
    fulfillment: "RTO Initiated", fulfillmentDetail: "",
    total: 699, orderStatus: "Return/RTO", fulfillmentStatus: "Return/RTO",
  },
];

/* ─── status config ─── */
const STATUS_CONFIG = {
  Pending:    { badge: "bg-orange-100 text-orange-600 border-orange-200", dot: "bg-orange-400" },
  Processing: { badge: "bg-blue-100 text-blue-600 border-blue-200",       dot: "bg-blue-400"   },
  Shipped:    { badge: "bg-purple-100 text-purple-600 border-purple-200", dot: "bg-purple-400" },
  Delivered:  { badge: "bg-green-100 text-green-600 border-green-200",    dot: "bg-green-400"  },
  Cancelled:  { badge: "bg-red-100 text-red-600 border-red-200",          dot: "bg-red-400"    },
  "Return/RTO": { badge: "bg-gray-100 text-gray-600 border-gray-200",     dot: "bg-gray-400"   },
};

const PAYMENT_CONFIG = {
  Paid:     "bg-green-100 text-green-700",
  Refunded: "bg-red-100 text-red-600",
  Pending:  "bg-orange-100 text-orange-600",
};

const STATS = [
  { label: "All Orders",  value: 342, sub: "↑ 18% vs last 7 days", subColor: "text-green-500",  icon: ShoppingBag,  iconBg: "bg-blue-50",   iconColor: "text-blue-500",   status: "All" },
  { label: "Pending",     value: 68,  sub: "18.9% of all orders",   subColor: "text-orange-500", icon: Clock,        iconBg: "bg-orange-50", iconColor: "text-orange-500", status: "Pending" },
  { label: "Processing",  value: 86,  sub: "25.1% of all orders",   subColor: "text-blue-500",   icon: Settings2,    iconBg: "bg-blue-50",   iconColor: "text-blue-500",   status: "Processing" },
  { label: "Shipped",     value: 142, sub: "41.5% of all orders",   subColor: "text-purple-500", icon: Truck,        iconBg: "bg-purple-50", iconColor: "text-purple-500", status: "Shipped" },
  { label: "Delivered",   value: 40,  sub: "11.7% of all orders",   subColor: "text-green-500",  icon: CheckCircle2, iconBg: "bg-green-50",  iconColor: "text-green-500",  status: "Delivered" },
  { label: "Cancelled",   value: 6,   sub: "1.8% of all orders",    subColor: "text-red-500",    icon: XCircle,      iconBg: "bg-red-50",    iconColor: "text-red-500",    status: "Cancelled" },
  { label: "Returns/RTO", value: 12,  sub: "3.5% of all orders",    subColor: "text-gray-500",   icon: RefreshCcw,   iconBg: "bg-gray-100",  iconColor: "text-gray-500",   status: "Return/RTO" },
];

const TABS = [
  { label: "All Orders",    status: "All",        count: 342 },
  { label: "Pending",       status: "Pending",    count: 68  },
  { label: "Processing",    status: "Processing", count: 86  },
  { label: "Shipped",       status: "Shipped",    count: 142 },
  { label: "Delivered",     status: "Delivered",  count: 40  },
  { label: "Cancelled",     status: "Cancelled",  count: 6   },
  { label: "Returns / RTO", status: "Return/RTO", count: 12  },
];

const PAGE_SIZES = [10, 25, 50];

/* ─── sub-components ─── */
const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG["Pending"];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {status}
    </span>
  );
};

const FilterSelect = ({ label, options, value, onChange }) => (
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

/* ─── main component ─── */
export default function SellerOrdersPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [orderStatusFilter, setOrderStatusFilter] = useState("Order Status");
  const [paymentFilter, setPaymentFilter] = useState("Payment Status");
  const [fulfillmentFilter, setFulfillmentFilter] = useState("Fulfillment Status");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [openMenuId, setOpenMenuId] = useState(null);

  const debouncedSearch = useDebounce(search, 300);

  const filtered = useMemo(() => {
    let list = [...MOCK_ORDERS];
    if (activeTab !== "All") list = list.filter((o) => o.orderStatus === activeTab);
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.customer.name.toLowerCase().includes(q) ||
          o.items.some((i) => i.title.toLowerCase().includes(q))
      );
    }
    if (orderStatusFilter !== "Order Status") list = list.filter((o) => o.orderStatus === orderStatusFilter);
    if (paymentFilter !== "Payment Status") list = list.filter((o) => o.payment === paymentFilter);
    return list;
  }, [activeTab, debouncedSearch, orderStatusFilter, paymentFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const resetFilters = () => {
    setSearch("");
    setOrderStatusFilter("Order Status");
    setPaymentFilter("Payment Status");
    setFulfillmentFilter("Fulfillment Status");
    setActiveTab("All");
    setPage(1);
  };

  return (
    <div className="space-y-5">

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

      {/* ── Stats row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {STATS.map((s) => {
          const Icon = s.icon;
          const active = activeTab === s.status;
          return (
            <motion.button
              key={s.label}
              onClick={() => { setActiveTab(s.status); setPage(1); }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className={`text-left p-3 rounded-xl border transition-all cursor-pointer ${
                active
                  ? "border-red-400 bg-red-50/50 shadow-sm shadow-red-100"
                  : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm"
              }`}
            >
              <div className={`w-8 h-8 rounded-lg ${s.iconBg} flex items-center justify-center mb-2`}>
                <Icon size={16} className={s.iconColor} />
              </div>
              <p className="text-xs font-semibold text-gray-500 leading-none mb-1">{s.label}</p>
              <p className="text-xl font-extrabold text-gray-900 leading-none mb-1">{fmt(s.value)}</p>
              <p className={`text-[10px] font-medium leading-tight ${s.subColor}`}>{s.sub}</p>
            </motion.button>
          );
        })}
      </div>

      {/* ── Filters bar ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by Order ID, Customer, Book, SKU..."
            className="w-full pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 transition-all"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter selects */}
        <div className="flex flex-wrap gap-2 shrink-0">
          <FilterSelect label="Date" options={["Date", "Today", "This Week", "This Month"]} value="Date" onChange={() => {}} />
          <FilterSelect label="Order Status" options={["Order Status", "Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Return/RTO"]} value={orderStatusFilter} onChange={(v) => { setOrderStatusFilter(v); setPage(1); }} />
          <FilterSelect label="Payment Status" options={["Payment Status", "Paid", "Refunded", "Pending"]} value={paymentFilter} onChange={(v) => { setPaymentFilter(v); setPage(1); }} />
          <FilterSelect label="Fulfillment Status" options={["Fulfillment Status", "Not Packed", "Packing", "Shipped", "Delivered", "Cancelled"]} value={fulfillmentFilter} onChange={(v) => { setFulfillmentFilter(v); setPage(1); }} />
          <button
            onClick={resetFilters}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors font-medium cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw size={13} /> Reset
          </button>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 overflow-x-auto border-b border-gray-100 pb-0 scrollbar-none">
        {TABS.map((tab) => {
          const active = activeTab === tab.status;
          return (
            <button
              key={tab.status}
              onClick={() => { setActiveTab(tab.status); setPage(1); }}
              className={`relative px-4 py-2.5 text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer shrink-0 ${
                active ? "text-red-600" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
              {" "}
              <span className={`text-xs ${active ? "text-red-500" : "text-gray-400"}`}>
                ({tab.count})
              </span>
              {active && (
                <motion.div
                  layoutId="order-tab-indicator"
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
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-50 flex items-center justify-center">
              <Package size={28} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No orders found</h3>
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
              <table className="w-full text-sm min-w-[900px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Items</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Order Date</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Payment</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Fulfillment</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Order Total</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginated.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">

                      {/* Order ID */}
                      <td className="px-4 py-4 align-top">
                        <p className="font-bold text-gray-900 text-[13px]">{order.id}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{order.date}</p>
                      </td>

                      {/* Customer */}
                      <td className="px-4 py-4 align-top min-w-[180px]">
                        <p className="font-semibold text-gray-900 text-[13px]">{order.customer.name}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{order.customer.email}</p>
                        <p className="text-[11px] text-gray-400">{order.customer.phone}</p>
                      </td>

                      {/* Items */}
                      <td className="px-4 py-4 align-top min-w-[200px]">
                        <div className="flex items-start gap-2.5">
                          <div className="w-9 h-12 rounded-md overflow-hidden border border-gray-100 shrink-0 bg-gray-50">
                            <img
                              src={order.items[0].img}
                              alt={order.items[0].title}
                              className="w-full h-full object-cover"
                              onError={(e) => { e.target.src = "https://via.placeholder.com/36x48?text=Book"; }}
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[12px] font-semibold text-gray-800 leading-snug line-clamp-2">{order.items[0].title}</p>
                            {order.extraItems > 0 && (
                              <p className="text-[11px] text-gray-400 mt-0.5">+ {order.extraItems} more</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Order Date */}
                      <td className="px-4 py-4 align-top whitespace-nowrap">
                        <p className="text-[12px] font-medium text-gray-700">{order.date}</p>
                        <p className="text-[11px] text-gray-400">{order.time}</p>
                      </td>

                      {/* Payment */}
                      <td className="px-4 py-4 align-top">
                        <span className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold mb-1 ${PAYMENT_CONFIG[order.payment] || ""}`}>
                          {order.payment}
                        </span>
                        <p className="text-[11px] text-gray-400">{order.method}</p>
                      </td>

                      {/* Fulfillment */}
                      <td className="px-4 py-4 align-top min-w-[140px]">
                        <StatusBadge status={order.fulfillmentStatus} />
                        {order.fulfillment && (
                          <p className="text-[11px] text-gray-400 mt-1 leading-snug">{order.fulfillment}</p>
                        )}
                        {order.fulfillmentDetail && (
                          <p className="text-[11px] text-gray-400">{order.fulfillmentDetail}</p>
                        )}
                      </td>

                      {/* Order Total */}
                      <td className="px-4 py-4 align-top whitespace-nowrap">
                        <p className="text-[13px] font-bold text-gray-900">₹{fmt(order.total)}</p>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4 align-top">
                        <StatusBadge status={order.orderStatus} />
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4 align-top">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer" title="View order">
                            <Eye size={15} />
                          </button>
                          <div className="relative">
                            <button
                              onClick={() => setOpenMenuId(openMenuId === order.id ? null : order.id)}
                              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
                            >
                              <MoreVertical size={15} />
                            </button>
                            <AnimatePresence>
                              {openMenuId === order.id && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.92, y: -4 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.92, y: -4 }}
                                  transition={{ duration: 0.12 }}
                                  className="absolute right-0 top-full mt-1 w-44 bg-white border border-gray-100 rounded-xl shadow-xl z-50 py-1 overflow-hidden"
                                >
                                  {["Mark as Processing", "Mark as Shipped", "Mark as Delivered", "Cancel Order"].map((action) => (
                                    <button
                                      key={action}
                                      onClick={() => setOpenMenuId(null)}
                                      className={`w-full text-left px-4 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                                        action === "Cancel Order"
                                          ? "text-red-500 hover:bg-red-50"
                                          : "text-gray-700 hover:bg-gray-50"
                                      }`}
                                    >
                                      {action}
                                    </button>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── Pagination ── */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-gray-100 bg-gray-50/40">
              <p className="text-xs text-gray-500">
                Showing {Math.min((page - 1) * pageSize + 1, filtered.length)}–{Math.min(page * pageSize, filtered.length)} of {filtered.length} orders
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
                  items per page
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
                      className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                        page === p
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
