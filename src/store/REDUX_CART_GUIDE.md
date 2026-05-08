/**
 * ============================================================================
 * SHOPPING CART SYSTEM - REDUX TOOLKIT + FRAMER MOTION
 * ============================================================================
 * 
 * Complete implementation of a global shopping cart system for BooksKaBazaar
 * using Redux Toolkit for state management and Framer Motion for animations.
 * 
 * ============================================================================
 * FILE STRUCTURE
 * ============================================================================
 * 
 * src/
 * ├── store/
 * │   ├── index.js                    (Redux store configuration)
 * │   └── cartSlice.js               (Cart state & reducers)
 * │
 * ├── components/
 * │   ├── cart/
 * │   │   ├── CartDrawer.jsx         (Sliding cart drawer UI)
 * │   │   └── index.js                (Cart exports)
 * │   │
 * │   ├── layout/
 * │   │   └── Navbar.jsx              (Updated with cart integration)
 * │   │
 * │   └── products/
 * │       └── BookCard.jsx            (Updated to dispatch Redux action)
 * │
 * ├── App.jsx                         (Wrapped with Redux Provider)
 * └── main.jsx                        (Entry point)
 * 
 * ============================================================================
 * SETUP INSTRUCTIONS
 * ============================================================================
 * 
 * 1. ALREADY INSTALLED:
 *    ✅ React Redux - react-redux
 *    ✅ Redux Toolkit - @reduxjs/toolkit
 *    ✅ Framer Motion - framer-motion
 *    ✅ Lucide React - lucide-react
 * 
 * 2. IMPORTS IN YOUR APP:
 *    The Redux Provider is already wrapped in App.jsx:
 *    
 *    import { Provider } from "react-redux";
 *    import store from "./store";
 *    
 *    <Provider store={store}>
 *      <YourApp />
 *    </Provider>
 * 
 * ============================================================================
 * HOW THE SYSTEM WORKS
 * ============================================================================
 * 
 * 1. USER CLICKS "ADD TO CART" BUTTON:
 *    - BookCard component dispatches addItem action
 *    - Redux checks if item already exists
 *    - If exists: increments quantity
 *    - If new: adds to cartItems array
 * 
 * 2. STATE UPDATES AUTOMATICALLY:
 *    - totalQuantity updates
 *    - totalAmount recalculates
 *    - Navbar badge updates with animation
 * 
 * 3. USER CLICKS CART ICON:
 *    - CartDrawer slides in from right
 *    - Displays all items with controls
 *    - Backdrop blur prevents interaction with main content
 * 
 * 4. QUANTITY CONTROL:
 *    - +/- buttons update item quantity
 *    - Remove button completely deletes item
 *    - Total automatically recalculates
 * 
 * ============================================================================
 * REDUX STATE STRUCTURE
 * ============================================================================
 * 
 * State shape:
 * {
 *   cart: {
 *     cartItems: [
 *       {
 *         id: 1,
 *         title: "The Great Gatsby",
 *         author: "F. Scott Fitzgerald",
 *         price: 12.99,
 *         imageURL: "...",
 *         badge: "Classic",
 *         quantity: 2,
 *         totalPrice: 25.98
 *       },
 *       ...
 *     ],
 *     totalQuantity: 5,      // Total number of items
 *     totalAmount: 123.45    // Total price in dollars
 *   }
 * }
 * 
 * ============================================================================
 * AVAILABLE REDUX ACTIONS
 * ============================================================================
 * 
 * 1. addItem(book)
 *    Adds item to cart or increases quantity if exists
 *    
 *    import { useDispatch } from "react-redux";
 *    import { addItem } from "../store/cartSlice";
 *    
 *    const dispatch = useDispatch();
 *    dispatch(addItem(book));
 * 
 * 2. removeItem(itemId)
 *    Completely removes item from cart
 *    
 *    dispatch(removeItem(5));
 * 
 * 3. updateQuantity({ itemId, quantity })
 *    Updates quantity of specific item
 *    If quantity <= 0, item is removed
 *    
 *    dispatch(updateQuantity({ itemId: 5, quantity: 3 }));
 * 
 * 4. clearCart()
 *    Empties entire cart
 *    
 *    dispatch(clearCart());
 * 
 * ============================================================================
 * USING CART STATE IN COMPONENTS
 * ============================================================================
 * 
 * Get cart data in any component:
 * 
 * import { useSelector } from "react-redux";
 * 
 * const MyComponent = () => {
 *   const { cartItems, totalQuantity, totalAmount } = useSelector(
 *     (state) => state.cart
 *   );
 *   
 *   return (
 *     <div>
 *       <p>Items: {totalQuantity}</p>
 *       <p>Total: ${totalAmount.toFixed(2)}</p>
 *     </div>
 *   );
 * };
 * 
 * ============================================================================
 * ANIMATIONS
 * ============================================================================
 * 
 * 1. CART DRAWER SLIDE-IN:
 *    - Slides from right (x: 100% → x: 0%)
 *    - Duration: 0.3s
 *    - Uses spring physics for smooth easing
 *    - Backdrop fades in smoothly
 * 
 * 2. CART BADGE SCALE:
 *    - Scales from 1 → 1.3 → 1 when item added
 *    - Duration: 0.4s
 *    - Provides feedback to user
 * 
 * 3. ITEMS ANIMATION:
 *    - Each cart item animates in (fade + slide)
 *    - Uses AnimatePresence for smooth removal
 *    - Layout animations for natural reflow
 * 
 * 4. EMPTY STATE:
 *    - ShoppingBag icon bounces
 *    - Smooth message display
 *    - "Start Shopping" button with hover effects
 * 
 * ============================================================================
 * CART DRAWER FEATURES
 * ============================================================================
 * 
 * ✓ Side drawer that slides from right
 * ✓ Dark semi-transparent backdrop with blur
 * ✓ Product thumbnails and details
 * ✓ Quantity +/- buttons
 * ✓ Remove button for each item
 * ✓ Real-time total calculation
 * ✓ "Proceed to Checkout" button (brand red #E31E2E)
 * ✓ "Clear Cart" button
 * ✓ Empty cart state with icon
 * ✓ Responsive design (mobile & desktop)
 * ✓ Smooth close animation
 * ✓ Item count display in header
 * 
 * ============================================================================
 * NAVBAR INTEGRATION
 * ============================================================================
 * 
 * ✓ Cart icon displays in both desktop & mobile
 * ✓ Badge shows totalQuantity from Redux
 * ✓ Badge scales when item added (visual feedback)
 * ✓ Clicking cart icon opens CartDrawer
 * ✓ Badge only shows when items in cart (0 items = no badge)
 * 
 * ============================================================================
 * STYLING & COLORS
 * ============================================================================
 * 
 * ✓ Card background: #FAFAFA (off-white)
 * ✓ Primary brand color: #E31E2E (red)
 * ✓ Backdrop: black/40 with blur-sm
 * ✓ Text: gray-900 (darkgray)
 * ✓ Borders: gray-200
 * ✓ Hover states: smooth transitions
 * 
 * ============================================================================
 * ERROR HANDLING
 * ============================================================================
 * 
 * The cart system handles:
 * ✓ Duplicate items (increases quantity instead of duplicating)
 * ✓ Removing items (updates totals automatically)
 * ✓ Zero quantity updates (removes item from cart)
 * ✓ Empty cart state (displays friendly message)
 * ✓ Large quantities (no limit set)
 * ✓ Price calculations (accurate decimal handling)
 * 
 * ============================================================================
 * FUTURE ENHANCEMENTS
 * ============================================================================
 * 
 * 1. LOCAL STORAGE PERSISTENCE:
 *    Save cart to localStorage to persist across sessions
 *    
 * 2. CHECKOUT PAGE:
 *    Connect "Proceed to Checkout" button to checkout flow
 *    
 * 3. PROMO CODES:
 *    Add discount code input and calculation
 *    
 * 4. SAVE FOR LATER:
 *    Move items to wishlist instead of removing
 *    
 * 5. STOCK CHECKING:
 *    Prevent adding more than available stock
 *    
 * 6. ANALYTICS:
 *    Track add-to-cart, remove, and checkout events
 *    
 * 7. NOTIFICATIONS:
 *    Toast messages on add/remove/cart actions
 * 
 * ============================================================================
 * TESTING THE SYSTEM
 * ============================================================================
 * 
 * 1. Run the dev server:
 *    npm run dev
 * 
 * 2. Navigate to Books section
 * 
 * 3. Click "Add to Cart" on any book:
 *    - Navbar badge should appear with "1"
 *    - Badge should scale animation
 * 
 * 4. Add more books:
 *    - Badge number increases
 *    - Add same book twice to test quantity increment
 * 
 * 5. Click cart icon in navbar:
 *    - CartDrawer slides in from right
 *    - Shows all items with thumbnails
 *    - Backdrop appears with blur
 * 
 * 6. Test quantity controls:
 *    - Click + to increase quantity
 *    - Click - to decrease quantity
 *    - Total updates in real-time
 * 
 * 7. Test remove:
 *    - Click trash icon to remove item
 *    - Item smoothly disappears
 *    - Totals update
 * 
 * 8. Test clear cart:
 *    - Click "Clear Cart" button
 *    - All items removed
 *    - Empty state displays
 * 
 * 9. Test empty state:
 *    - CartDrawer shows shopping bag icon
 *    - Shows empty message
 *    - "Start Shopping" button closes drawer
 * 
 * ============================================================================
 */

// Example integration patterns

// 1. IN A COMPONENT:
// import { useSelector, useDispatch } from "react-redux";
// import { addItem, removeItem, updateQuantity, clearCart } from "../store/cartSlice";
// 
// export function MyComponent() {
//   const dispatch = useDispatch();
//   const { cartItems, totalQuantity, totalAmount } = useSelector(state => state.cart);
//   
//   return (
//     <div>
//       <p>Total: {totalQuantity} items - ${totalAmount.toFixed(2)}</p>
//     </div>
//   );
// }

// 2. DISPATCHING ACTIONS:
// dispatch(addItem(book));
// dispatch(removeItem(bookId));
// dispatch(updateQuantity({ itemId: bookId, quantity: 5 }));
// dispatch(clearCart());
