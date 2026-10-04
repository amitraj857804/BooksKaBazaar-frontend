import { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Edit2,
  Trash2,
  Plus,
  AlertCircle,
  BookX,
  Eye,
  MoreVertical,
  ChevronDown,
  X,
  RotateCcw,
} from "lucide-react";
import { useDebounce } from "../../utils/adminUtils";
import AuthenticatedImage from "../common/AuthenticatedImage";
import toast from "react-hot-toast";

/* ─── helpers ─── */
const TABS = ["All Books", "Live", "Draft", "Inactive"];
const CATEGORIES = ["All Categories", "Fiction", "Self Help", "Finance", "History", "Science", "Productivity", "Personal Finance"];
const STOCK_STATUSES = ["All Stock Status", "In Stock", "Low Stock", "Out of Stock"];
const PAGE_SIZES = [10, 20, 50, 100];

const statusBadge = (status) => {
  const map = {
    Live: "bg-green-100 text-green-700",
    Draft: "bg-gray-100 text-gray-600",
    Inactive: "bg-red-100 text-red-600",
  };
  return map[status] || "bg-gray-100 text-gray-500";
};

const stockInfo = (stock) => {
  if (stock === 0) return { label: "Out of Stock", cls: "text-red-500 font-semibold" };
  if (stock < 10) return { label: "Low Stock", cls: "text-orange-500 font-semibold" };
  return { label: "In Stock", cls: "text-green-600 font-semibold" };
};

const InventoryTable = ({
  books = [],
  onAddBook,
  onEditBook,
  onDeleteBook,
  onSearch,
  isLoading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All Books");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [stockFilter, setStockFilter] = useState("All Stock Status");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deletingIds, setDeletingIds] = useState(new Set());

  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => { onSearch?.(debouncedSearch); }, [debouncedSearch, onSearch]);
  useEffect(() => { setDeletingIds(new Set()); }, [books.length]);
  useEffect(() => { setPage(1); }, [searchQuery, activeTab, categoryFilter, stockFilter]);

  /* ── derive a fake status from stock (since backend doesn't send it) ── */
  const withStatus = useMemo(() =>
    books
      .filter((b) => !deletingIds.has(b.id))
      .map((b) => ({
        ...b,
        status: b.status || (b.stock === 0 ? "Inactive" : "Live"),
        sku: b.isbn ? `BKB${String(b.id).padStart(4, "0")}` : `BKB${String(b.id).padStart(4, "0")}`,
      })),
    [books, deletingIds]
  );

  /* ── client-side filters ── */
  const filtered = useMemo(() => {
    let list = withStatus;
    if (activeTab !== "All Books") list = list.filter((b) => b.status === activeTab);
    if (categoryFilter !== "All Categories") list = list.filter((b) => b.category === categoryFilter);
    if (stockFilter !== "All Stock Status") {
      list = list.filter((b) => {
        if (stockFilter === "In Stock") return b.stock >= 10;
        if (stockFilter === "Low Stock") return b.stock > 0 && b.stock < 10;
        if (stockFilter === "Out of Stock") return b.stock === 0;
        return true;
      });
    }
    return list;
  }, [withStatus, activeTab, categoryFilter, stockFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  /* ── tab counts ── */
  const tabCounts = useMemo(() => ({
    "All Books": withStatus.length,
    "Live": withStatus.filter((b) => b.status === "Live").length,
    "Draft": withStatus.filter((b) => b.status === "Draft").length,
    "Inactive": withStatus.filter((b) => b.status === "Inactive").length,
  }), [withStatus]);

  /* ── delete confirm ── */
  const handleDelete = useCallback((id) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3 p-1">
          <div className="flex items-start gap-2.5">
            <div className="p-1.5 bg-red-50 rounded-full text-red-600 shrink-0">
              <Trash2 size={16} />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">Delete Book</p>
              <p className="text-xs text-gray-500 mt-0.5">Are you sure? This action cannot be undone.</p>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-1">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1.5 text-xs text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors cursor-pointer"
            >Cancel</button>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                setDeletingIds((prev) => new Set(prev).add(id));
                onDeleteBook?.(id);
              }}
              className="px-3 py-1.5 text-xs text-white bg-red-600 hover:bg-red-700 rounded-lg font-semibold shadow-sm transition-colors cursor-pointer"
            >Delete</button>
          </div>
        </div>
      ),
      {
        duration: 8000,
        position: "top-center",
        style: {
          background: "#ffffff", color: "#1f2937", padding: "12px",
          borderRadius: "12px", maxWidth: "350px",
          boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", border: "1px solid #f3f4f6",
        },
      }
    );
  }, [onDeleteBook]);

  const resetFilters = () => {
    setSearchQuery("");
    setCategoryFilter("All Categories");
    setStockFilter("All Stock Status");
    setActiveTab("All Books");
  };

  /* ── select dropdown ── */
  const FilterSelect = ({ value, onChange, options }) => (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400 text-gray-600 bg-white cursor-pointer"
      >
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
      <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  );

  return (
    <div className="space-y-4">

      {/* ── Toolbar: Search + Filters + Add ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

        {/* Search + Filters group — stacks vertically on mobile, inline on desktop */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1 min-w-0">

          {/* Search input — full width on mobile, flex-1 on desktop */}
          <div className="relative w-full sm:flex-1 sm:max-w-[480px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by title, author, ISBN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400 transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filters — below search on mobile, inline on desktop */}
          <div className="flex gap-3 w-full sm:w-auto">
            <FilterSelect value={categoryFilter} onChange={setCategoryFilter} options={CATEGORIES} />
            <FilterSelect value={stockFilter} onChange={setStockFilter} options={STOCK_STATUSES} />
          </div>
        </div>

        {/* Reset + Apply — below filters on mobile, to the right on desktop */}
        <div className="flex gap-3 shrink-0">
          <button
            onClick={resetFilters}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors font-medium cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw size={14} /> Reset
          </button>
          <button
            className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors cursor-pointer"
          >
            Apply Filters
          </button>
        </div>

      </div>



      {/* ── Tabs ── */}
      <div className="flex gap-1 border-b border-gray-100">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-semibold transition-colors relative cursor-pointer whitespace-nowrap ${activeTab === tab ? "text-red-600" : "text-gray-500 hover:text-gray-700"
              }`}
          >
            {tab}
            {tabCounts[tab] !== undefined && (
              <span className="ml-1.5 text-xs font-bold">({tabCounts[tab]})</span>
            )}
            {activeTab === tab && (
              <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* ── Table / Empty / Loading ── */}
      <div className="relative min-h-[300px]">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 bg-white/70 backdrop-blur-[1px] flex flex-col items-center justify-center rounded-xl border border-gray-100"
            >
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                <div className="w-9 h-9 border-4 border-gray-100 border-t-red-600 rounded-full" />
              </motion.div>
              <p className="text-sm text-gray-500 font-medium mt-3">Updating inventory…</p>
            </motion.div>
          ) : paged.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl border border-gray-100 p-14 text-center"
            >
              <div className="inline-block p-4 bg-blue-50 rounded-full mb-4">
                <BookX className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchQuery ? "No books found" : "No books yet"}
              </h3>
              <p className="text-sm text-gray-500 mb-5">
                {searchQuery
                  ? `No results for "${searchQuery}". Try a different search.`
                  : "Start by adding your first book to the inventory."}
              </p>
              {!searchQuery && (
                <motion.button
                  onClick={onAddBook}
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors text-sm"
                >
                  <Plus size={16} /> Add Your First Book
                </motion.button>
              )}
            </motion.div>
          ) : (
            <motion.div key="table" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[860px]">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/60">
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Book Details</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">SKU / ISBN</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Price (₹)</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Stock</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Updated On</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    <AnimatePresence mode="popLayout">
                      {paged.map((book) => {
                        const stock = stockInfo(book.stock);
                        return (
                          <motion.tr
                            key={book.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -60 }}
                            layout
                            className="hover:bg-gray-50/60 transition-colors"
                          >
                            {/* Book Details */}
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <AuthenticatedImage
                                  src={book.imageURL}
                                  alt={book.title}
                                  className="w-9 h-12 object-cover rounded-md shadow-sm shrink-0"
                                />
                                <div className="min-w-0">
                                  <p className="font-semibold text-gray-900 truncate max-w-[160px]" title={book.title}>
                                    {book.title || "Untitled"}
                                  </p>
                                  <p className="text-xs text-gray-400 truncate">{book.author || "Unknown"}</p>
                                </div>
                              </div>
                            </td>

                            {/* SKU / ISBN */}
                            <td className="px-4 py-3">
                              <p className="text-xs font-mono font-semibold text-gray-700">{book.sku}</p>
                              <p className="text-xs text-gray-400 font-mono">{book.isbn || "—"}</p>
                            </td>

                            {/* Category */}
                            <td className="px-4 py-3">
                              <span className="text-sm text-gray-600">{book.category || "—"}</span>
                            </td>

                            {/* Price */}
                            <td className="px-4 py-3">
                              <span className="font-semibold text-gray-900">
                                ₹{(Number(book.price) || 0).toFixed(0)}
                              </span>
                            </td>

                            {/* Stock */}
                            <td className="px-4 py-3">
                              <p className={`text-sm font-bold ${stock.cls}`}>{book.stock}</p>
                              <p className={`text-[11px] ${stock.cls} opacity-80`}>{stock.label}</p>
                            </td>

                            {/* Status */}
                            <td className="px-4 py-3">
                              <span className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full ${statusBadge(book.status)}`}>
                                {book.status || "Live"}
                              </span>
                            </td>

                            {/* Updated On */}
                            <td className="px-4 py-3">
                              <p className="text-xs text-gray-500">
                                {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                              </p>
                              <p className="text-[11px] text-gray-400">
                                {new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                              </p>
                            </td>

                            {/* Actions */}
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => onEditBook?.(book)}
                                  title="View"
                                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                >
                                  <Eye size={15} />
                                </button>
                                <button
                                  onClick={() => onEditBook?.(book)}
                                  title="Edit"
                                  className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                                >
                                  <Edit2 size={15} />
                                </button>
                                <button
                                  onClick={() => handleDelete(book.id)}
                                  title="Delete"
                                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>

              {/* ── Footer: count + pagination ── */}
              <div className="px-4 py-3 border-t border-gray-50 bg-gray-50/40 flex items-center justify-between flex-wrap gap-3">
                <p className="text-xs text-gray-500">
                  Showing {Math.min((page - 1) * pageSize + 1, filtered.length)} to{" "}
                  {Math.min(page * pageSize, filtered.length)} of {filtered.length} books
                </p>

                <div className="flex items-center gap-3">
                  {/* Page size selector */}
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>Show</span>
                    <div className="relative">
                      <select
                        value={pageSize}
                        onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                        className="appearance-none pl-2 pr-6 py-1 text-xs border border-gray-200 rounded-md bg-white cursor-pointer focus:outline-none"
                      >
                        {PAGE_SIZES.map((s) => <option key={s}>{s}</option>)}
                      </select>
                      <ChevronDown size={11} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                    <span>items per page</span>
                  </div>

                  {/* Prev / Next */}
                  {totalPages > 1 && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-2.5 py-1 text-xs border border-gray-200 rounded-md disabled:opacity-40 hover:bg-gray-100 transition-colors cursor-pointer"
                      >Prev</button>
                      <span className="px-2 text-xs text-gray-500">{page} / {totalPages}</span>
                      <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-2.5 py-1 text-xs border border-gray-200 rounded-md disabled:opacity-40 hover:bg-gray-100 transition-colors cursor-pointer"
                      >Next</button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InventoryTable;
