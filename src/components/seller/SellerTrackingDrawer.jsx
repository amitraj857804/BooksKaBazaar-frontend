import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  X, Truck, Package, CheckCircle2, Copy,
  MapPin, Clock, ExternalLink, ChevronRight, FileText,
  ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";

/* ─── 5-stage model ─── */
const buildStages = (courierName, awb, currentStage) => [
  {
    key: "placed",
    label: "Order Placed",
    icon: Package,
    timestamp: "May 17, 2025 · 08:45 PM",
    location: "BooksKaBazaar Platform",
    detail: "Order confirmed and payment received.",
    done: currentStage >= 1,
  },
  {
    key: "dispatched",
    label: "Dispatched",
    icon: Truck,
    timestamp: "May 18, 2025 · 07:30 AM",
    location: `${courierName} Hub, Sector-63 Noida`,
    detail: `AWB ${awb} — picked up by ${courierName}.`,
    done: currentStage >= 2,
  },
  {
    key: "in_transit",
    label: "In Transit",
    icon: Truck,
    timestamp: "May 18, 2025 · 01:15 PM",
    location: "Regional Hub — Greater Noida",
    detail: "Arrived at sorting facility. Expected to move tonight.",
    done: currentStage >= 3,
  },
  {
    key: "out_for_delivery",
    label: "Out for Delivery",
    icon: Truck,
    timestamp: "",
    location: "",
    detail: "Package is out with the delivery agent.",
    done: currentStage >= 4,
  },
  {
    key: "delivered",
    label: "Delivered",
    icon: CheckCircle2,
    timestamp: "",
    location: "",
    detail: "Successfully delivered to the customer.",
    done: currentStage >= 5,
  },
];

/* ─── StepNode ─── */
const StepNode = ({ stage, index, isLast, isActive }) => {
  const Icon = stage.icon;

  return (
    <div className="relative flex gap-4">
      {/* Baseline connector (always rendered below the node) */}
      {!isLast && (
        <div className="absolute left-[17px] top-[38px] bottom-0 w-px bg-gray-200" />
      )}
      {/* Completed segment overlay */}
      {!isLast && stage.done && (
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.3, delay: index * 0.06 }}
          className="absolute left-[17px] top-[38px] bottom-0 w-px bg-gray-400 origin-top"
        />
      )}

      {/* Node */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.22, delay: index * 0.06 }}
        className={`relative z-10 w-[35px] h-[35px] rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
          stage.done
            ? "bg-gray-800 border-gray-800"
            : isActive
            ? "bg-white border-red-500"
            : "bg-white border-gray-200"
        }`}
      >
        {stage.done ? (
          <CheckCircle2 size={14} className="text-white" strokeWidth={2.5} />
        ) : (
          <Icon size={13} className={isActive ? "text-red-500" : "text-gray-300"} />
        )}
        {/* Pulse only on the single active-pending node */}
        {isActive && !stage.done && (
          <span className="absolute inset-0 rounded-full animate-ping bg-red-400 opacity-20" />
        )}
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, x: 5 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.22, delay: index * 0.06 + 0.04 }}
        className="pb-6 flex-1 min-w-0"
      >
        <div className="flex items-start justify-between gap-2">
          <p
            className={`text-[13px] font-bold leading-tight ${
              stage.done
                ? "text-gray-800"
                : isActive
                ? "text-red-600"
                : "text-gray-400"
            }`}
          >
            {stage.label}
          </p>
          {stage.done && stage.timestamp && (
            <span className="flex items-center gap-1 text-[10px] text-gray-400 shrink-0 tabular-nums">
              <Clock size={9} />
              {stage.timestamp}
            </span>
          )}
        </div>

        {stage.done && stage.location && (
          <div className="flex items-center gap-1 mt-0.5">
            <MapPin size={9} className="text-gray-400 shrink-0" />
            <p className="text-[11px] text-gray-500 font-medium">{stage.location}</p>
          </div>
        )}

        {(stage.done || isActive) && stage.detail && (
          <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">{stage.detail}</p>
        )}

        {isActive && !stage.done && (
          <span className="inline-block mt-1 text-[10px] font-semibold text-red-500 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">
            Pending
          </span>
        )}
      </motion.div>
    </div>
  );
};

/* ═══════════════════════════════════════
   MAIN DRAWER
═══════════════════════════════════════ */
export default function SellerTrackingDrawer({ order, onClose }) {
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  if (!order) return null;

  const courier     = order.courier || "Delhivery";
  const awb         = order.awb     || "0000000000";
  const trackingUrl = `https://www.delhivery.com/track/package/${awb}`;

  const stageIndex =
    order.status === "Delivered" ? 5 :
    order.status === "Shipped"   ? 3 : 2;

  const stages    = buildStages(courier, awb, stageIndex);
  const activeIdx = stages.findIndex((s) => !s.done);
  const doneCount = stages.filter((s) => s.done).length;

  const copyLink = () => {
    navigator.clipboard.writeText(trackingUrl).catch(() => {});
    toast.success("Tracking link copied!", { duration: 2500 });
  };

  return (
    <div className="fixed inset-0 z-[60] flex">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"
        onClick={onClose}
      />

      {/* Panel */}
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 380, damping: 38 }}
        className="relative ml-auto w-full max-w-[420px] h-full bg-white shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Red accent top strip ── */}
        <div className="h-1 w-full bg-gradient-to-r from-red-600 via-red-500 to-orange-400 shrink-0" />

        {/* ══ HEADER — charcoal, professional ══ */}
        <div className="bg-zinc-900 px-5 pt-4 pb-5 shrink-0">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              {/* Brand mark */}
              <div className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center shrink-0">
                <Truck size={13} className="text-white" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none">
                  Shipment Tracker
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-zinc-400 hover:text-white cursor-pointer"
            >
              <X size={17} />
            </button>
          </div>

          {/* Order ID + customer */}
          <h2 className="text-2xl font-black text-white font-mono tracking-tight leading-none">
            {order.id}
          </h2>
          <p className="text-sm text-zinc-400 mt-1">{order.customer?.name}</p>

          {/* Courier + AWB */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <div className="flex items-center gap-1.5 bg-white/8 border border-white/10 rounded-lg px-3 py-1.5">
              <Truck size={11} className="text-zinc-400" />
              <span className="text-[12px] font-semibold text-zinc-200">
                Shiprocket — {courier}
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/8 border border-white/10 rounded-lg px-3 py-1.5">
              <span className="text-[10px] text-zinc-500 font-medium">AWB</span>
              <span className="text-[12px] font-bold text-white font-mono">{awb}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 mt-3">
            <button
              onClick={copyLink}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/15 border border-white/10 text-white text-[11px] font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <Copy size={10} />
              Copy Tracking Link
            </button>
            <a
              href={trackingUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/15 border border-white/10 text-white text-[11px] font-semibold rounded-lg transition-colors"
            >
              <ExternalLink size={10} />
              Track on Site
            </a>
          </div>
        </div>

        {/* ══ Order summary strip ══ */}
        <div className="px-5 py-2.5 bg-gray-50 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2 flex-wrap text-[11px] text-gray-500">
            <Package size={10} className="text-gray-400 shrink-0" />
            <span className="truncate max-w-[150px] font-medium">{order.items?.[0]?.title}</span>
            {order.extraItems > 0 && <span className="text-gray-400">+{order.extraItems} more</span>}
            <ChevronRight size={9} className="text-gray-300 shrink-0" />
            <Clock size={9} className="text-gray-400 shrink-0" />
            <span>{order.date} · {order.time}</span>
            <ChevronRight size={9} className="text-gray-300 shrink-0" />
            <span className="font-bold text-gray-700">
              ₹{new Intl.NumberFormat("en-IN").format(order.total)}
            </span>
          </div>
        </div>

        {/* ══ TIMELINE ══ */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {/* Section header */}
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[13px] font-extrabold text-gray-900 uppercase tracking-wider">
              Tracking Timeline
            </h3>
            <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 border border-gray-200 px-2.5 py-1 rounded-full tabular-nums">
              {doneCount} / {stages.length} stages
            </span>
          </div>

          {/* Steps */}
          <div>
            {stages.map((stage, i) => (
              <StepNode
                key={stage.key}
                stage={stage}
                index={i}
                isLast={i === stages.length - 1}
                isActive={i === activeIdx}
              />
            ))}
          </div>

          {/* ETA card */}
          {stageIndex < 5 && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-2 rounded-xl border border-amber-100 bg-amber-50 p-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                  <Clock size={14} className="text-amber-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-amber-900">Estimated Delivery</p>
                  <p className="text-[11px] text-amber-700 mt-0.5">
                    May 19 – 20, 2025 &nbsp;·&nbsp; 9 AM – 6 PM
                  </p>
                </div>
                <ArrowRight size={14} className="text-amber-400 ml-auto shrink-0" />
              </div>
            </motion.div>
          )}
        </div>

        {/* ══ FOOTER ══ */}
        <div className="border-t border-gray-100 bg-white px-5 py-4 shrink-0">
          <div className="flex gap-3">
            <button
              onClick={() => window.print()}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-bold rounded-xl transition-colors cursor-pointer active:scale-[0.98]"
            >
              <FileText size={14} />
              Print Manifest
            </button>
            <button
              onClick={onClose}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-bold rounded-xl transition-colors cursor-pointer active:scale-[0.98]"
            >
              <X size={14} />
              Close
            </button>
          </div>
        </div>
      </motion.aside>
    </div>
  );
}
