// ============================================================================
// PATTERN: Building API-Dependent Components with Modern Loading States
// ============================================================================
// This file demonstrates best practices for creating new components that
// fetch data from APIs. Copy and adapt these patterns for future components.
// ============================================================================

import { motion } from "framer-motion";
import { useLoadingState } from "../hooks";
import {
  SkeletonLoader,
  LoadingSpinner,
  ErrorState,
} from "../components/common";

// ============================================================================
// PATTERN 1: Simple List Component with Skeleton Loaders
// ============================================================================
/**
 * Example: AuthorsGrid component fetching authors from API
 * 
 * Features:
 * - Uses useLoadingState hook for data fetching
 * - Shows SkeletonLoader cards while loading
 * - Handles errors gracefully
 * - Responsive and animated
 */
export function ExampleAuthorsGrid() {
  const fetchAuthors = async () => {
    const response = await fetch("/api/authors");
    if (!response.ok) throw new Error("Failed to fetch authors");
    return response.json();
  };

  const { data: authors, isLoading, error, refetch } = useLoadingState(
    fetchAuthors,
    1200 // Show loading animation for at least 1.2 seconds
  );

  if (error) {
    return (
      <div className="p-6">
        <ErrorState
          error={error}
          message="Could not load authors"
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {isLoading ? (
        // Skeleton loading state
        Array(6)
          .fill(null)
          .map((_, i) => (
            <div key={i} className="space-y-4">
              <SkeletonLoader variant="circle" width="w-24" height="h-24" />
              <SkeletonLoader width="w-full" height="h-6" />
              <SkeletonLoader variant="text" lines={2} />
            </div>
          ))
      ) : (
        // Actual content
        authors?.map((author) => (
          <div key={author.id} className="border rounded-lg p-4">
            <img
              src={author.image}
              alt={author.name}
              className="w-24 h-24 rounded-full mb-4"
            />
            <h3 className="font-bold">{author.name}</h3>
            <p className="text-sm text-gray-600">{author.bio}</p>
          </div>
        ))
      )}
    </div>
  );
}

// ============================================================================
// PATTERN 2: Detail Page with Full-Page Loading Spinner
// ============================================================================
/**
 * Example: BookDetailPage fetching single book details
 * 
 * Features:
 * - Full-page loading spinner for initial load
 * - Detailed content display
 * - Error recovery with retry
 */
export function ExampleBookDetailPage({ bookId }) {
  const fetchBookDetails = async () => {
    const response = await fetch(`/api/books/${bookId}`);
    if (!response.ok) throw new Error("Failed to fetch book details");
    return response.json();
  };

  const { data: book, isLoading, error, refetch } = useLoadingState(
    fetchBookDetails,
    800
  );

  if (isLoading) {
    return <LoadingSpinner message="Loading book details..." fullPage={false} />;
  }

  if (error) {
    return (
      <ErrorState
        error={error}
        message="Failed to load book details"
        onRetry={refetch}
        fullSection={true}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto p-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={book.imageURL}
            alt={book.title}
            className="w-full rounded-lg shadow-lg"
          />
        </div>
        <div>
          <h1 className="text-4xl font-bold mb-2">{book.title}</h1>
          <p className="text-xl text-gray-600 mb-4">by {book.author}</p>
          <p className="text-3xl font-bold text-red-600 mb-6">
            ${book.price}
          </p>
          <p className="text-gray-700 leading-relaxed">{book.description}</p>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// PATTERN 3: Infinite Scroll / Paginated List
// ============================================================================
/**
 * Example: ReviewsList with pagination and individual skeleton loaders
 * 
 * Features:
 * - Skeleton loader for each review
 * - Handles pagination
 * - Staggered animations
 */
export function ExampleReviewsList({ bookId, page = 1 }) {
  const fetchReviews = async () => {
    const response = await fetch(`/api/books/${bookId}/reviews?page=${page}`);
    if (!response.ok) throw new Error("Failed to fetch reviews");
    return response.json();
  };

  const { data: reviews, isLoading, error, refetch } = useLoadingState(
    fetchReviews,
    1000
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {isLoading ? (
        // Skeleton loaders
        Array(5)
          .fill(null)
          .map((_, i) => (
            <div key={i} className="border rounded-lg p-4 space-y-2">
              <SkeletonLoader width="w-1/3" height="h-5" />
              <SkeletonLoader variant="text" lines={3} />
            </div>
          ))
      ) : error ? (
        <ErrorState
          error={error}
          message="Could not load reviews"
          onRetry={refetch}
        />
      ) : (
        // Actual content
        reviews?.map((review) => (
          <motion.div
            key={review.id}
            variants={itemVariants}
            className="border rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold">{review.reviewer}</h4>
              <span className="text-yellow-500">★ {review.rating}</span>
            </div>
            <p className="text-gray-700">{review.comment}</p>
          </motion.div>
        ))
      )}
    </motion.div>
  );
}

// ============================================================================
// PATTERN 4: Table/Data Display with Row Skeletons
// ============================================================================
/**
 * Example: OrdersTable fetching user orders
 * 
 * Features:
 * - Table with skeleton rows
 * - Clean, organized display
 * - Responsive design
 */
export function ExampleOrdersTable() {
  const fetchOrders = async () => {
    const response = await fetch("/api/user/orders");
    if (!response.ok) throw new Error("Failed to fetch orders");
    return response.json();
  };

  const { data: orders, isLoading, error, refetch } = useLoadingState(
    fetchOrders,
    1200
  );

  if (error) {
    return (
      <ErrorState
        error={error}
        message="Could not load orders"
        onRetry={refetch}
        fullSection={true}
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b-2 border-gray-300">
            <th className="text-left p-4">Order ID</th>
            <th className="text-left p-4">Date</th>
            <th className="text-left p-4">Total</th>
            <th className="text-left p-4">Status</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            // Skeleton rows
            Array(5)
              .fill(null)
              .map((_, i) => (
                <tr key={i} className="border-b border-gray-200">
                  <td className="p-4">
                    <SkeletonLoader width="w-20" height="h-5" />
                  </td>
                  <td className="p-4">
                    <SkeletonLoader width="w-24" height="h-5" />
                  </td>
                  <td className="p-4">
                    <SkeletonLoader width="w-16" height="h-5" />
                  </td>
                  <td className="p-4">
                    <SkeletonLoader width="w-20" height="h-5" />
                  </td>
                </tr>
              ))
          ) : (
            // Actual content
            orders?.map((order) => (
              <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="p-4">{order.id}</td>
                <td className="p-4">{order.date}</td>
                <td className="p-4">${order.total}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === 'completed' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================================
// QUICK REFERENCE: Which Component to Use
// ============================================================================
/**
 * 
 * LOADING STATES:
 * ├─ SkeletonLoader
 * │  └─ Use for: Individual placeholder elements (cards, rows, text blocks)
 * │     Example: <SkeletonLoader width="w-full" height="h-8" />
 * │
 * ├─ SkeletonCard (in products)
 * │  └─ Use for: Product card skeletons
 * │     Example: Shown automatically in BookGrid when isLoading=true
 * │
 * └─ LoadingSpinner
 *    └─ Use for: Full-page or section loading with message
 *       Example: <LoadingSpinner message="Loading..." fullPage={true} />
 * 
 * ERROR STATES:
 * └─ ErrorState
 *    └─ Use for: Displaying errors with retry button
 *       Example: <ErrorState error={error} onRetry={refetch} />
 * 
 * DATA FETCHING:
 * └─ useLoadingState hook
 *    └─ Use for: Managing loading/error/success states
 *       Example: const { data, isLoading, error, refetch } = useLoadingState(fetchFn)
 * 
 */

// ============================================================================
// BEST PRACTICES
// ============================================================================
/**
 * 1. ALWAYS use useLoadingState for API calls
 *    - Centralized loading state management
 *    - Automatic error handling
 *    - Minimum loading time for smooth animations
 * 
 * 2. Set minLoadingTime (1000-1500ms) for smooth skeleton animations
 *    - Prevents jarring instant transitions
 *    - Shows animations to users
 *    - Feels more professional
 * 
 * 3. Use SkeletonLoader for individual elements
 *    - More granular control over placeholder shapes
 *    - Mix and match for complex layouts
 * 
 * 4. Always handle errors with ErrorState
 *    - User-friendly error messages
 *    - Retry functionality
 *    - Clear visual feedback
 * 
 * 5. Use motion/Framer Motion for animations
 *    - Stagger children for smooth cascading effects
 *    - Keep animations under 600ms for perceived speed
 *    - Use spring physics for natural feel
 * 
 * 6. Responsive design
 *    - Use Tailwind's responsive prefixes (sm:, md:, lg:)
 *    - Test on mobile before shipping
 */
