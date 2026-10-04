import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";
import { cartApi } from "../services/user/cartApi";
import { addItem, removeItem, updateQuantity, clearCart, setCart } from "../store/cartSlice";

// ── localStorage helpers (guest cart only) ──────────────────────────────────
const GUEST_CART_KEY = "guestCart";

const saveGuestCart = (cartItems, totalQuantity, totalAmount) => {
  try {
    localStorage.setItem(
      GUEST_CART_KEY,
      JSON.stringify({ cartItems, totalQuantity, totalAmount })
    );
  } catch (_) {}
};

const clearGuestCart = () => {
  try {
    localStorage.removeItem(GUEST_CART_KEY);
  } catch (_) {}
};

const loadGuestCart = () => {
  try {
    const saved = localStorage.getItem(GUEST_CART_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (_) {
    return null;
  }
};
// ────────────────────────────────────────────────────────────────────────────

// Module-level lock: prevents multiple useCart() instances from triggering
// simultaneous merges (Navbar + Page component both call useCart)
let _mergeInProgress = false;

export const useCart = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const isLoggedIn = !!user;

  const { cartItems, totalQuantity, totalAmount } = useSelector(
    (state) => state.cart
  );

  // ── Persist guest cart to localStorage on every change ───────────────────
  // Skip first render to avoid overwriting a valid localStorage cart with
  // the empty default Redux state on initial mount.
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!isLoggedIn) {
      saveGuestCart(cartItems, totalQuantity, totalAmount);
    }
  }, [isLoggedIn, cartItems, totalQuantity, totalAmount]);

  // ── Sync full cart from backend ──────────────────────────────────────────
  const syncCart = useCallback(async () => {
    if (!user) return;
    try {
      const response = await cartApi.get();
      if (response && response.success) {
        const mappedItems = (response.cartItems || []).map((item) => ({
          cartItemId: item.cartItemId,
          id: item.bookId,
          title: item.bookTitle,
          author: item.authorName,
          price: parseFloat(item.price) || 0,
          imageURL: item.bookId
            ? `http://localhost:8080/api/public/books/${item.bookId}/image`
            : "https://images.unsplash.com/photo-1543565521-bcf289c60034?w=200&h=300&fit=crop",
          quantity: item.quantity,
          totalPrice: parseFloat(item.subTotal) || 0,
        }));
        dispatch(
          setCart({
            cartItems: mappedItems,
            totalQuantity: response.totalItemsCount || 0,
            totalAmount: parseFloat(response.cartTotal) || 0,
          })
        );
      }
    } catch (err) {
      console.error("[Cart] syncCart FAILED:", err);
    }
  }, [user, dispatch]);

  // ── Merge guest cart + logout cleanup ────────────────────────────────────
  const prevUserRef = useRef(user);

  useEffect(() => {
    const prevUser = prevUserRef.current;
    prevUserRef.current = user;

    // ── LOGIN: guest → logged in ─────────────────────────────────────────
    if (!prevUser && user && !_mergeInProgress) {
      _mergeInProgress = true;

      const mergeAndSync = async () => {
        try {
          const saved = loadGuestCart();
          const guestItems = saved?.cartItems;

          if (guestItems && guestItems.length > 0) {
            console.log("[Cart] Merging guest cart into backend:", guestItems);

            // Optimistically show guest items while API calls go through
            // (they're already in Redux from before login)

            // Push each guest item to the backend (sequential to avoid race)
            for (const item of guestItems) {
              try {
                await cartApi.add(item.id, item.quantity);
              } catch (err) {
                console.warn(`[Cart] Failed to merge book ${item.id}:`, err.message);
              }
            }

            // Clear guest cart from localStorage now that it's in the backend
            clearGuestCart();
            console.log("[Cart] Guest cart merged successfully ✅");
          } else {
            console.log("[Cart] No guest cart to merge, syncing from backend.");
          }

          // Pull the final merged cart from backend into Redux
          await syncCart();
        } catch (err) {
          console.error("[Cart] mergeAndSync FAILED:", err);
        } finally {
          _mergeInProgress = false;
        }
      };

      mergeAndSync();
    }

    // ── LOGOUT: logged in → guest ────────────────────────────────────────
    // Clear the FRONTEND only (Redux + localStorage).
    // Backend cart is intentionally left untouched so items are
    // available when the user logs back in.
    if (prevUser && !user) {
      dispatch(clearCart());
      clearGuestCart();
    }
  }, [user, syncCart, dispatch]);

  // ── addToCart ─────────────────────────────────────────────────────────────
  const addToCart = useCallback(
    async (book, quantity = 1) => {
      if (isLoggedIn) {
        try {
          await cartApi.add(book.id, quantity);
          await syncCart();
        } catch (err) {
          console.error("[Cart] addToCart FAILED:", err);
        }
      } else {
        // Guest: add to Redux (localStorage synced by persistence useEffect)
        dispatch(
          addItem({
            id: book.id,
            title: book.title,
            author: book.author,
            price: book.price,
            imageURL: book.imageURL,
          })
        );
      }
    },
    [isLoggedIn, dispatch, syncCart]
  );

  // ── updateQty ─────────────────────────────────────────────────────────────
  const updateQty = useCallback(
    async (item, quantity) => {
      if (isLoggedIn) {
        try {
          if (!item.cartItemId) {
            console.warn("⚠️ Cannot update cart item: cartItemId is missing");
            return;
          }
          await cartApi.update(item.cartItemId, quantity);
          await syncCart();
        } catch (err) {
          console.error("❌ Failed to update item quantity in database:", err.message);
        }
      } else {
        dispatch(updateQuantity({ itemId: item.id, quantity }));
      }
    },
    [isLoggedIn, dispatch, syncCart]
  );

  // ── removeItemFromCart ────────────────────────────────────────────────────
  const removeItemFromCart = useCallback(
    async (item) => {
      if (isLoggedIn) {
        try {
          if (!item.cartItemId) {
            console.warn("⚠️ Cannot remove cart item: cartItemId is missing");
            return;
          }
          await cartApi.remove(item.cartItemId);
          await syncCart();
        } catch (err) {
          console.error("❌ Failed to remove item from database cart:", err.message);
        }
      } else {
        dispatch(removeItem(item.id));
      }
    },
    [isLoggedIn, dispatch, syncCart]
  );

  // ── clearUserCart ─────────────────────────────────────────────────────────
  // For logged-in users, clears from backend + Redux.
  // For guests, clears from Redux + localStorage only.
  const clearUserCart = useCallback(async () => {
    if (isLoggedIn) {
      try {
        await cartApi.clear();
        dispatch(clearCart());
      } catch (err) {
        console.error("❌ Failed to clear database cart:", err.message);
      }
    } else {
      dispatch(clearCart());
      clearGuestCart();
    }
  }, [isLoggedIn, dispatch]);

  return {
    cartItems,
    totalQuantity,
    totalAmount,
    syncCart,
    addToCart,
    updateQty,
    removeItemFromCart,
    clearUserCart,
  };
};

export default useCart;
