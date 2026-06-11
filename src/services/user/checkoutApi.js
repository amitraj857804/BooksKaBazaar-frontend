import axiosInstance from "../axios/axiosInstance";

/**
 * Checkout API service
 *
 * Endpoints (all require JWT auth via axiosInstance interceptor):
 *   POST /auth/user/checkout/create-order    — create PENDING order + Razorpay payment order
 *   POST /auth/user/checkout/confirm-payment — verify signature + confirm order after payment
 *   GET  /auth/user/checkout/orders          — order history
 */
export const checkoutApi = {
  /**
   * Create a PENDING order from the user's cart and obtain a Razorpay order ID.
   *
   * @param {object} addressData - { fullName, phoneNumber, addressLine1, addressLine2?, city, state, pincode }
   * @returns {{ success, orderId, razorpayOrderId, amount, currency, razorpayKeyId }}
   */
  createOrder: async (addressData) => {
    const response = await axiosInstance.post("/auth/user/checkout/create-order", addressData);
    return response.data;
  },

  /**
   * Confirm the payment after Razorpay modal returns success.
   * Performs HMAC signature verification server-side before marking the order PAID.
   *
   * @param {string} razorpayOrderId   - from create-order response
   * @param {string} razorpayPaymentId - from Razorpay handler callback
   * @param {string} razorpaySignature - from Razorpay handler callback
   * @returns {{ success, message }}
   */
  confirmPayment: async (razorpayOrderId, razorpayPaymentId, razorpaySignature) => {
    const response = await axiosInstance.post("/auth/user/checkout/confirm-payment", {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });
    return response.data;
  },

  /**
   * Fetch the logged-in user's order history.
   * @returns {{ success, orders: OrderResponse[], total: number }}
   */
  getOrders: async () => {
    const response = await axiosInstance.get("/auth/user/checkout/orders");
    return response.data;
  },
};

export default checkoutApi;
