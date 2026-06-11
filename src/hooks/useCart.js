import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";
import { cartApi } from "../services/user/cartApi";
import { addItem, removeItem, updateQuantity, clearCart, setCart } from "../store/cartSlice";

export const useCart = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const isLoggedIn = !!user;

  const { cartItems, totalQuantity, totalAmount } = useSelector((state) => state.cart);

  // Fetch the latest cart from the backend and sync with Redux
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
      console.warn("⚠️ Failed to sync cart from database:", err.message);
    }
  }, [user, dispatch]);

  const addToCart = useCallback(async (book, quantity = 1) => {
    if (isLoggedIn) {
      try {
        await cartApi.add(book.id, quantity);
        await syncCart();
      } catch (err) {
        console.error("❌ Failed to add item to database cart:", err.message);
      }
    } else {
      // Local Redux cart for guests
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
  }, [isLoggedIn, dispatch, syncCart]);

  const updateQty = useCallback(async (item, quantity) => {
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
      // Local Redux update for guests
      dispatch(updateQuantity({ itemId: item.id, quantity }));
    }
  }, [isLoggedIn, dispatch, syncCart]);

  const removeItemFromCart = useCallback(async (item) => {
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
      // Local Redux remove for guests
      dispatch(removeItem(item.id));
    }
  }, [isLoggedIn, dispatch, syncCart]);

  const clearUserCart = useCallback(async () => {
    if (isLoggedIn) {
      try {
        await cartApi.clear();
        dispatch(clearCart());
      } catch (err) {
        console.error("❌ Failed to clear database cart:", err.message);
      }
    } else {
      // Local Redux clear for guests
      dispatch(clearCart());
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
