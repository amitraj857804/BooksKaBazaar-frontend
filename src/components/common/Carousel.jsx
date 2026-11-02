import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

/* ─────────────────────────────────────────────────────
   SLIDE VISUAL COMPONENTS
───────────────────────────────────────────────────── */

/** Slide 1 – Tilted books fan (right side) */
const TiltedBooksVisual = () => {
  const books = [
    { title: "Atomic Habits", author: "James Clear", bg: "#F97316", spine: "#EA580C", textColor: "#fff" },
    { title: "Wings of Fire", author: "A.P.J. Abdul Kalam", bg: "#60A5FA", spine: "#3B82F6", textColor: "#fff" },
    { title: "Ikigai", author: "Héctor García", bg: "#34D399", spine: "#10B981", textColor: "#fff" },
    { title: "Sapiens", author: "Yuval Noah Harari", bg: "#F9FAFB", spine: "#E5E7EB", textColor: "#1F2937" },
    { title: "Alchemist", author: "Paulo Coelho", bg: "#FCD34D", spine: "#FBBF24", textColor: "#78350F" },
  ];

  const rotations = [-22, -10, 0, 11, 22];
  const translateY = [10, -8, -18, -8, 10];
  const translateX = [-60, -40, 0, 38, 60];
  const zIndex = [1, 2, 5, 3, 2];

  return (
    <div className="relative flex items-end justify-center" style={{ width: 300, height: 200 }}>
      {books.map((book, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            bottom: 10,
            left: "50%",
            transform: `translateX(calc(-50% + ${translateX[i]}px)) translateY(${translateY[i]}px) rotate(${rotations[i]}deg)`,
            zIndex: zIndex[i],
            width: 140,
            height: 180,
            borderRadius: 4,
            boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
            overflow: "hidden",
            display: "flex",
          }}
        >
          {/* Spine */}
          <div style={{ width: 12, background: book.spine, flexShrink: 0 }} />
          {/* Cover */}
          <div
            style={{
              flex: 1,
              background: book.bg,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "6px 4px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 9,
                fontWeight: 800,
                color: book.textColor,
                lineHeight: 1.2,
                marginBottom: 4,
                fontFamily: "serif",
              }}
            >
              {book.title}
            </div>
            <div style={{ fontSize: 7, color: book.textColor, opacity: 0.75, lineHeight: 1.2 }}>
              {book.author}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

/** Slide 2 – eBook / PDF device mockup */
const EbookDeviceVisual = () => (
  <div className="relative flex items-center justify-center" style={{ width: 300, height: 200 }}>
    {/* Tablet */}
    <div
      style={{
        position: "absolute",
        left: 2,
        top: 10,
        width: 260,
        height: 200,
        background: "#1E293B",
        borderRadius: 10,
        boxShadow: "0 12px 32px rgba(0,0,0,0.5)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        border: "3px solid #334155",
      }}
    >
      <div style={{ flex: 1, background: "#F8F5E4", padding: "10px 12px", display: "flex", flexDirection: "column", gap: 5 }}>
        <div style={{ height: 8, background: "#374151", borderRadius: 3, width: "90%" }} />
        <div style={{ height: 6, background: "#FCD34D", borderRadius: 3, width: "75%" }} />
        <div style={{ height: 6, background: "#FCD34D", borderRadius: 3, width: "60%" }} />
        <div style={{ height: 5, background: "#D1D5DB", borderRadius: 3, width: "85%" }} />
        <div style={{ height: 5, background: "#D1D5DB", borderRadius: 3, width: "70%" }} />
        <div style={{ height: 5, background: "#D1D5DB", borderRadius: 3, width: "80%" }} />
      </div>
      <div style={{ height: 10, background: "#0F172A", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 24, height: 3, background: "#475569", borderRadius: 2 }} />
      </div>
    </div>

    {/* PDF Label */}
    <div
      style={{
        position: "absolute",
        left: -6 ,
        top: 1,
        background: "#E31E2E",
        color: "#fff",
        fontSize: 12,
        fontWeight: 800,
        padding: "5px 9px",
        borderRadius: 4,
        zIndex: 10,
        boxShadow: "0 2px 8px rgba(227,30,46,0.5)",
      }}
    >
      PDF
    </div>

    {/* Phone */}
    <div
      style={{
        position: "absolute",
        right: 14,
        bottom: -20,
        width: 70,
        height: 120,
        background: "#1E293B",
        borderRadius: 12,
        boxShadow: "0 12px 32px rgba(0,0,0,0.5)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        border: "3px solid #334155",
        zIndex: 6,
      }}
    >
      <div style={{ height: 10, background: "#0F172A", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 20, height: 4, background: "#1E293B", borderRadius: 3 }} />
      </div>
      <div style={{ flex: 1, background: "#F8F5E4", padding: "6px 8px", display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ height: 6, background: "#374151", borderRadius: 2, width: "90%" }} />
        <div style={{ height: 5, background: "#FCD34D", borderRadius: 2, width: "70%" }} />
        <div style={{ height: 4, background: "#D1D5DB", borderRadius: 2, width: "80%" }} />
        <div style={{ height: 4, background: "#D1D5DB", borderRadius: 2, width: "65%" }} />
      </div>
    </div>

    {/* eBook Label */}
    <div
      style={{
        position: "absolute",
        right: 10,
        top: 2,
        background: "#F8FAFC",
        color: "#1E293B",
        fontSize: 14,
        fontWeight: 800,
        padding: "5px 9px",
        borderRadius: 4,
        border: "1px solid #CBD5E1",
        zIndex: 10,
        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
      }}
    >
      eBook
    </div>

    {/* Instant Badge */}
    <div
      style={{
        position: "absolute",
        bottom: 16,
        left: "45%",
        transform: "translateX(-50%)",
        background: "#FCD34D",
        color: "#78350F",
        fontSize: 12,
        fontWeight: 800,
        padding: "4px 10px",
        borderRadius: 20,
        zIndex: 10,
        boxShadow: "0 2px 8px rgba(252,211,77,0.5)",
        whiteSpace: "nowrap",
      }}
    >
      ⚡ Instant Download
    </div>
  </div>
);

/** Slide 3 – Stacked books with 70% badge */
const StackedBooksVisual = () => {
  const stackBooks = [
    { bg: "#1E3A5F", stripe: "#2D5A8E" },
    { bg: "#1A6B3C", stripe: "#2D9B5A" },
    { bg: "#D4A017", stripe: "#E8B823" },
    { bg: "#C41E3A", stripe: "#E02449" },
    { bg: "#2D4A6B", stripe: "#3D6B9E" },
  ];

  return (
    <div className="relative flex items-center justify-center" style={{ width: 280, height: 200 }}>
      <div style={{ position: "relative", display: "flex", flexDirection: "column-reverse", alignItems: "center", gap: 4 }}>
        {stackBooks.map((book, i) => (
          <div
            key={i}
            style={{
              width: 160 - i * 8,
              height: 24,
              background: book.bg,
              borderRadius: 3,
              boxShadow: i === 0 ? "0 8px 20px rgba(0,0,0,0.4)" : "0 2px 6px rgba(0,0,0,0.25)",
              position: "relative",
              display: "flex",
              alignItems: "center",
              paddingLeft: 12,
            }}
          >
            <div className="absolute right-2" style={{ width: "60%", height: 4,  background: book.stripe, borderRadius: 2, opacity: 0.6 }} />
          </div>
        ))}
        <div style={{ fontSize: 20, marginBottom: -4, zIndex: 10 }}>🌿</div>
      </div>

      {/* 70% OFF badge */}
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          width: 70,
          height: 70,
          background: "#FCD34D",
          borderRadius: "50%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 16px rgba(252,211,77,0.5)",
          border: "3px solid #F59E0B",
        }}
      >
        <div style={{ fontSize: 8, fontWeight: 700, color: "#78350F", lineHeight: 1 }}>UP TO</div>
        <div style={{ fontSize: 20, fontWeight: 900, color: "#78350F", lineHeight: 1 }}>70%</div>
        <div style={{ fontSize: 8, fontWeight: 700, color: "#78350F", lineHeight: 1 }}>OFF</div>
      </div>
    </div>
  );
};

/** Slide 4 – Tilted article cards */
const ArticleCardsVisual = () => {
  const cards = [
    {
      tag: "General Studies",
      title: "Understanding Customs and Duties",
      bg: "#F1F5F9",
      tagColor: "#64748B",
      light: false,
    },
    {
      tag: "Current Affairs",
      title: "India's Digital Leap: Transforming Lives and Livelihoods",
      bg: "#0F2D3D",
      tagColor: "#38BDF8",
      light: true,
    },
    {
      tag: "Economy 2024",
      title: "Challenges and Opportunities Ahead",
      bg: "#1A1A2E",
      tagColor: "#818CF8",
      light: true,
    },
  ];

  const rotations = [-12, 0, 10];
  const translateX = [-50, 0, 45];
  const translateY = [15, -5, 20];
  const zIndex = [1, 5, 2];

  return (
    <div className="relative flex items-center justify-center" style={{ width: 300, height: 200 }}>
      {cards.map((card, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: `translate(calc(-50% + ${translateX[i]}px), calc(-50% + ${translateY[i]}px)) rotate(${rotations[i]}deg)`,
            zIndex: zIndex[i],
            width: 130,
            minHeight: 90,
            background: card.bg,
            borderRadius: 8,
            boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
            padding: "10px 12px",
            display: "flex",
            flexDirection: "column",
            gap: 5,
          }}
        >
          <div style={{ fontSize: 8, fontWeight: 700, color: card.tagColor }}>{card.tag}</div>
          <div
            style={{
              fontSize: 9,
              fontWeight: 700,
              color: card.light ? "#F1F5F9" : "#1E293B",
              lineHeight: 1.35,
            }}
          >
            {card.title}
          </div>
        </div>
      ))}
    </div>
  );
};

/** Slide 5 – Blog quote card */
const BlogQuoteVisual = () => (
  <div className="relative flex items-center justify-center" style={{ width: 300, height: 200 }}>
    <div
      style={{
        background: "rgba(255,255,255,0.1)",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(255,255,255,0.2)",
        borderRadius: 14,
        padding: "20px 22px",
        width: 260,
        boxShadow: "0 12px 40px rgba(0,0,0,0.3)",
      }}
    >
      <div style={{ fontSize: 28, color: "#FCD34D", lineHeight: 1, marginBottom: 8 }}>&ldquo;</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", lineHeight: 1.45, marginBottom: 14 }}>
        In Conversation with Ruskin Bond: Stories of the Hills
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {["A", "R", "S"].map((letter, i) => (
          <div
            key={i}
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: ["#EF4444", "#3B82F6", "#22C55E"][i],
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 800,
              color: "#fff",
              border: "2px solid rgba(255,255,255,0.3)",
            }}
          >
            {letter}
          </div>
        ))}
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            fontWeight: 800,
            color: "#fff",
            border: "2px solid rgba(255,255,255,0.3)",
          }}
        >
          +
        </div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", marginLeft: 4 }}>
          Authors, educators &amp; thought leaders
        </div>
      </div>
    </div>
  </div>
);

/** Slide 6 – Bookshelf with reading progress card */
const BookshelfVisual = () => {
  const shelfBooks = [
    { bg: "#1E3A5F", w: 18 },
    { bg: "#2563EB", w: 14 },
    { bg: "#1D4ED8", w: 20 },
    { bg: "#1E3A5F", w: 16 },
    { bg: "#F8F5E4", w: 12 },
    { bg: "#D4A017", w: 14 },
    { bg: "#1E3A5F", w: 18 },
    { bg: "#1D4ED8", w: 16 },
    { bg: "#C41E3A", w: 14 },
    { bg: "#1E3A5F", w: 20 },
    { bg: "#E31E2E", w: 13 },
    { bg: "#1D4ED8", w: 18 },
    { bg: "#1E3A5F", w: 16 },
    { bg: "#C41E3A", w: 14 },
  ];

  return (
    <div className="relative flex items-end justify-center" style={{ width: 320, height: 200 }}>
      {/* Bookshelf structure */}
      <div style={{ position: "relative", width: 290, height: 160 }}>
        {/* Books row */}
        <div
          style={{
            position: "absolute",
            bottom: 22,
            left: 0,
            right: 0,
            display: "flex",
            alignItems: "flex-end",
            gap: 3,
            paddingLeft: 8,
            paddingRight: 8,
          }}
        >
          {shelfBooks.map((book, i) => {
            const height = 70 + (i % 3) * 14;
            return (
              <div
                key={i}
                style={{
                  width: book.w,
                  height,
                  background: book.bg,
                  borderRadius: "3px 3px 0 0",
                  flexShrink: 0,
                  boxShadow: "inset -2px 0 4px rgba(0,0,0,0.2)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Book spine line */}
                <div
                  style={{
                    position: "absolute",
                    top: 8,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: Math.max(book.w - 6, 4),
                    height: 2,
                    background: "rgba(255,255,255,0.25)",
                    borderRadius: 1,
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Wooden shelf plank */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 22,
            background: "linear-gradient(180deg, #8B5E3C 0%, #6B4226 100%)",
            borderRadius: 3,
            boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
          }}
        />

        {/* Continue reading card */}
        <div
          style={{
            position: "absolute",
            bottom: 30,
            right: 0,
            width: 148,
            background: "#fff",
            borderRadius: 8,
            padding: "8px 10px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.45)",
            display: "flex",
            flexDirection: "column",
            gap: 5,
            zIndex: 10,
          }}
        >
          <div style={{ fontSize: 9, fontWeight: 800, color: "#1E293B" }}>Continue reading</div>
          <div style={{ fontSize: 8, color: "#64748B" }}>Page 146 of 326</div>
          {/* Progress bar */}
          <div style={{ width: "100%", height: 5, background: "#E2E8F0", borderRadius: 3, overflow: "hidden" }}>
            <div
              style={{
                width: "46%",
                height: "100%",
                background: "#E31E2E",
                borderRadius: 3,
              }}
            />
          </div>
          {/* % label */}
          <div style={{ fontSize: 11, fontWeight: 900, color: "#E31E2E", alignSelf: "flex-end", marginTop: -2 }}>46%</div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────
   SKELETON
───────────────────────────────────────────────────── */
const CarouselSkeleton = () => (
  <div className="w-full bg-white">
    <div className="w-full relative overflow-hidden h-[180px] sm:h-[300px] md:h-[350px] lg:h-[380px] bg-gray-100 border-b border-gray-100 flex items-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full flex flex-col justify-center text-left space-y-3.5 sm:space-y-5">
        <motion.div className="h-6 sm:h-8 w-32 sm:w-48 bg-gray-200 rounded-md" animate={{ opacity: [0.5, 0.8, 0.5] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="h-8 sm:h-12 w-2/3 sm:w-1/2 md:w-1/3 bg-gray-200 rounded-md" animate={{ opacity: [0.5, 0.8, 0.5] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.15 }} />
        <motion.div className="h-8 sm:h-12 w-1/2 sm:w-1/3 md:w-1/4 bg-gray-200 rounded-md" animate={{ opacity: [0.5, 0.8, 0.5] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.3 }} />
        <motion.div className="h-9 sm:h-11 w-24 sm:w-32 bg-gray-200 rounded-lg mt-2" animate={{ opacity: [0.5, 0.8, 0.5] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.45 }} />
      </div>
      {/* Skeleton dots inside the slide */}
      <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-1.5">
        <div className="h-1.5 w-6 bg-gray-300 rounded-full" />
        <div className="h-1.5 w-2.5 bg-gray-200 rounded-full animate-pulse" />
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────
   SLIDE DEFINITIONS
───────────────────────────────────────────────────── */
const slides = [
  {
    id: "bestsellers",
    bg: "linear-gradient(135deg, #C0392B 0%, #922B21 50%, #7B241C 100%)",
    badge: "India's Trusted Book Marketplace",
    badgeBg: "#FCD34D",
    badgeText: "#78350F",
    badgeBorder: "none",
    titleLine1: "Every Book You Love,",
    titleLine2: "All in One Place.",
    titleLine1Color: "#FFFFFF",
    titleLine2Color: "#FCD34D",
    description: "New books, eBooks, PDFs and used books from trusted sellers across India.",
    descColor: "rgba(255,255,255,0.8)",
    ctaText: "SHOP BEST SELLERS",
    ctaStyle: { backgroundColor: "white", color: "red", border: "2px solid #fff" },
    ctaHoverClass: "hover:bg-white hover:!text-red-700",
    Visual: TiltedBooksVisual,
    ctaAction: () => {
      const el = document.querySelector("#book-collection-section");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    },
  },
  {
    id: "ebooks",
    bg: "linear-gradient(135deg, #1E3A5F 0%, #152A4A 60%, #0D1B2E 100%)",
    badge: "eBooks & PDFs",
    badgeBg: "#E31E2E",
    badgeText: "#fff",
    badgeBorder: "none",
    titleLine1: "Read Anywhere,",
    titleLine2: "Anytime.",
    titleLine1Color: "#FFFFFF",
    titleLine2Color: "#E31E2E",
    description: "Instant downloads on any device. Your notes and highlights stay in My Bookshelf.",
    descColor: "rgba(255,255,255,0.75)",
    ctaText: "EXPLORE EBOOKS",
    ctaStyle: { background: "#fff", color: "#1E3A5F", border: "none" },
    ctaHoverClass: "hover:bg-slate-100",
    Visual: EbookDeviceVisual,
    ctaAction: () => {
      const el = document.querySelector("#book-collection-section");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    },
  },
  {
    id: "used-books",
    bg: "linear-gradient(135deg, #1A6B3C 0%, #145530 55%, #0D3D22 100%)",
    badge: "Old / Used Books",
    badgeBg: "#FCD34D",
    badgeText: "#78350F",
    badgeBorder: "none",
    titleLine1: "Great Reads.",
    titleLine2: "Smarter Choice.",
    titleLine1Color: "#FFFFFF",
    titleLine2Color: "#FCD34D",
    description: "Save up to 70% on pre-owned books.",
    descColor: "rgba(255,255,255,0.8)",
    ctaText: "SHOP USED BOOKS",
    ctaStyle: { backgroundColor: "white", color: "green", border: "2px solid #fff" },
    ctaHoverClass: "hover:bg-white hover:!text-green-900",
    Visual: StackedBooksVisual,
    ctaAction: () => {
      const el = document.querySelector("#book-collection-section");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    },
  },
  {
    id: "reading-room",
    bg: "linear-gradient(135deg, #0B3D45 0%, #072D35 55%, #041E24 100%)",
    badge: "Reading Room · Today's Highlight",
    badgeBg: "transparent",
    badgeText: "#38BDF8",
    badgeBorder: "1px solid #38BDF8",
    titleLine1: "News, Views &",
    titleLine2: "Analysis.",
    titleLine1Color: "#FFFFFF",
    titleLine2Color: "#38BDF8",
    description: "Today's highlight: India's Digital Leap: Transforming Lives and Livelihoods.",
    descColor: "rgba(255,255,255,0.75)",
    ctaText: "READ NOW",
    ctaStyle: { backgroundColor: "white", color: "teal", border: "2px solid #fff" },
    ctaHoverClass: "hover:bg-white hover:!text-teal-900",
    Visual: ArticleCardsVisual,
    ctaAction: () => {
      const el = document.querySelector("#book-collection-section");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    },
  },
  {
    id: "blogs",
    bg: "linear-gradient(135deg, #6D28D9 0%, #5B21B6 50%, #4C1D95 100%)",
    badge: "Blogs · Inspiring Voices",
    badgeBg: "#FCD34D",
    badgeText: "#78350F",
    badgeBorder: "none",
    titleLine1: "Stories from",
    titleLine2: "People Who Inspire.",
    titleLine1Color: "#FFFFFF",
    titleLine2Color: "#FCD34D",
    description: "Conversations and blogs by authors, educators and thought leaders.",
    descColor: "rgba(255,255,255,0.8)",
    ctaText: "READ BLOGS",
    ctaStyle: { backgroundColor: "white", color: "purple", border: "2px solid #fff" },
    ctaHoverClass: "hover:bg-white hover:!text-purple-900",
    Visual: BlogQuoteVisual,
    ctaAction: () => {
      const el = document.querySelector("#book-collection-section");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    },
  },
  {
    id: "my-bookshelf",
    bg: "linear-gradient(135deg, #2C1810 0%, #1A0E08 55%, #0D0604 100%)",
    badge: "My Bookshelf",
    badgeBg: "#E31E2E",
    badgeText: "#fff",
    badgeBorder: "none",
    titleLine1: "Your Personal",
    titleLine2: "Reading Hub.",
    titleLine1Color: "#FFFFFF",
    titleLine2Color: "#FCD34D",
    description: "Continue reading, save books, track your progress and get price alerts.",
    descColor: "rgba(255,255,255,0.75)",
    ctaText: "OPEN MY BOOKSHELF",
    ctaStyle: { backgroundColor: "white", color: "amber", border: "2px solid #fff" },
    ctaHoverClass: "hover:bg-white hover:!text-amber-900",
    Visual: BookshelfVisual,
    ctaAction: () => {
      const el = document.querySelector("#book-collection-section");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    },
  },
];

/* ─────────────────────────────────────────────────────
   MAIN CAROUSEL
───────────────────────────────────────────────────── */
const Carousel = ({ isLoading = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [direction, setDirection] = useState(0);

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, []);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(handleNext, 5000);
    return () => clearInterval(timer);
  }, [isHovered, handleNext]);

  if (isLoading) return <CarouselSkeleton />;

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
    center: {
      x: 0,
      opacity: 1,
      transition: { x: { type: "spring", stiffness: 260, damping: 26 }, opacity: { duration: 0.45 } },
    },
    exit: (dir) => ({
      x: dir < 0 ? "100%" : "-100%",
      opacity: 0,
      transition: { x: { type: "spring", stiffness: 260, damping: 26 }, opacity: { duration: 0.35 } },
    }),
  };

  const slide = slides[currentIndex];
  const Visual = slide.Visual;

  return (
    <div className="w-full bg-white">
      <div
        className="w-full relative overflow-hidden h-[180px] sm:h-[240px] md:h-[280px] lg:h-[300px] group/carousel border-b border-gray-100 "
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={slide.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 w-full flex items-center "
            style={{ background: slide.bg }}
          >
            {/* Inner layout */}
            <div className="absolute inset-0 flex items-center px-5 sm:px-8 lg:px-14 ">
              <div className="w-full max-w-7xl mx-auto flex items-center justify-between">

                {/* ── LEFT: Text content ── */}
                <div className="flex flex-col justify-center text-left select-none max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
                  {/* Badge */}
                  <motion.div
                    key={slide.id + "-badge"}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="self-start mb-2 sm:mb-3 md:p-[4px_12px] p-[2px_6px] text-xs md:text-sm"
                    style={{
                      background: slide.badgeBg,
                      color: slide.badgeText,
                      border: slide.badgeBorder,
                    
                      fontWeight: 800,
                    
                      borderRadius: 5,
                      letterSpacing: "0.02em",
                    }}
                  >
                    {slide.badge}
                  </motion.div>

                  {/* Title */}
                  <motion.div
                    key={slide.id + "-title"}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="leading-tight"
                  >
                    <span
                      className="block font-black"
                      style={{
                        fontSize: "clamp(18px, 3.5vw, 36px)",
                        color: slide.titleLine1Color,
                        fontFamily: "'Georgia', serif",
                      }}
                    >
                      {slide.titleLine1}
                    </span>
                    <span
                      className="block font-black"
                      style={{
                        fontSize: "clamp(18px, 3.5vw, 36px)",
                        color: slide.titleLine2Color,
                        fontFamily: "'Georgia', serif",
                      }}
                    >
                      {slide.titleLine2}
                    </span>
                  </motion.div>

                  {/* Description */}
                  <motion.p
                    key={slide.id + "-desc"}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.18 }}
                    className="mt-2 sm:mt-3 hidden sm:block"
                    style={{
                      fontSize: "clamp(11px, 1.3vw, 14px)",
                      color: slide.descColor,
                      lineHeight: 1.55,
                      maxWidth: 340,
                    }}
                  >
                    {slide.description}
                  </motion.p>

                  {/* CTA Button */}
                  <motion.div
                    key={slide.id + "-cta"}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="mt-3 sm:mt-5"
                  >
                    <button
                      onClick={slide.ctaAction}
                      className={`font-extrabold md:p-[10px_22px] p-[4px_12px] tracking-wider transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 ${slide.ctaHoverClass}`}
                      style={{
                        ...slide.ctaStyle,
                        fontSize: "clamp(11px, 1.2vw, 15px)",
                        borderRadius: 7,
                        boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
                        letterSpacing: "0.06em",
                      }}
                    >
                      {slide.ctaText}
                    </button>
                  </motion.div>
                </div>

                {/* ── RIGHT: Visual ── */}
                <div className="hidden sm:flex items-center justify-center flex-shrink-0">
                  <motion.div
                    key={slide.id + "-visual"}
                    initial={{ opacity: 0, x: 30, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 22 }}
                  >
                    <Visual />
                  </motion.div>
                </div>

              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ── Navigation Arrows ── */}
        <button
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 hover:bg-white/40 text-white shadow-md flex items-center justify-center transition-all cursor-pointer z-20 opacity-0 group-hover/carousel:opacity-100 focus:opacity-100 hover:scale-105 active:scale-95 backdrop-blur-sm border border-white/20"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <button
          onClick={handleNext}
          aria-label="Next Slide"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 hover:bg-white/40 text-white shadow-md flex items-center justify-center transition-all cursor-pointer z-20 opacity-0 group-hover/carousel:opacity-100 focus:opacity-100 hover:scale-105 active:scale-95 backdrop-blur-sm border border-white/20"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* ── Dots Indicator ── */}
        <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-1.5 z-20">
          {slides.map((s, index) => (
            <button
              key={s.id}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer ${
                index === currentIndex ? "bg-white w-6" : "bg-white/40 hover:bg-white/70 w-2.5"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
