import { set } from "vue";

export const state = () => ({
  cart: [],
  sessionData: {},
  tempPayPalPayment: null,
  discount: null,
  shippingAmount: 0,
});

export const getters = {
  CART_COUNT(state) {
    return state.cart.reduce((acc, curr) => acc + curr.quantity, 0);
  },
  CART_SUBTOTAL(state) {
    let totalAmount = state.cart.reduce(
      (acc, curr) => acc + curr.quantity * curr.product.price,
      0
    );
    return Number(totalAmount.toFixed(2));
  },
  DISCOUNT_PRICE(state, getters) {
    let subTotal = getters.CART_SUBTOTAL;
    let { amount, discount_type } = state.discount || {
      amount: "0",
      discount_type: "fixed_cart",
    };

    if (discount_type == "percent" && Number(amount) > 0) {
      return Number(eval("(amount * subTotal) / 100").toFixed(2));
    } else {
      return Number(amount);
    }
  },
  GRAND_TOTAL(state, getters) {
    let subTotal = getters.CART_SUBTOTAL;
    let discountPrice = getters.DISCOUNT_PRICE;
    let shippingAmount = state.shippingAmount;
    return (subTotal + shippingAmount - discountPrice).toFixed(2);
  },
  GRAND_TOTAL_PAYPAL(state, getters) {
    let lineItems = getters.PAYPAL_LINE_ITEMS;
    let grandTotal = lineItems.reduce(
      (acc, curr) => acc + curr.quantity * curr.price,
      0
    );
    return grandTotal.toFixed(2);
  },
  CART(state) {
    return state.cart;
  },
  PAYPAL_LINE_ITEMS(state) {
    const itemsAddedInCart = [...state.cart];
    const lineItems = itemsAddedInCart.map((itm) => {
      let itemPrice = Number(itm.product.price).toFixed(2);
      const { amount, discount_type } = state.discount || {
        amount: "0",
        discount_type: "fixed_cart",
      };
      if (Number(amount) > 0) {
        itemPrice = calculateDiscountPrice(itemPrice, amount, discount_type);
      }
      return {
        name: itm.product.name,
        description: itm.product.name,
        quantity: itm.quantity.toString(),
        price: itemPrice,
        currency: "GBP",
      };
    });

    lineItems.push({
      name: "Shipping Cost",
      description: "Shipping Cost",
      quantity: "1",
      price: state.shippingAmount.toString(),
      currency: "GBP",
    });
    return lineItems;
  },
  STRIPE_LINE_ITEMS(state) {
    let itemsAddedInCart = state.cart;
    return itemsAddedInCart.map((item) => {
      let itemPrice = Number(item.product.price) * 100;
      const { amount, discount_type } = state.discount || {
        amount: "0",
        discount_type: "fixed_cart",
      };
      if (Number(amount) > 0) {
        itemPrice = calculateDiscountPrice(
          itemPrice,
          amount,
          discount_type
        ).toFixed(0);
      }
      return {
        price_data: {
          currency: "gbp",
          unit_amount: itemPrice,
          product_data: {
            name: item.product.name,
            images: item.product.images.map((res) => res.src),
          },
        },
        quantity: item.quantity,
      };
    });
  },
};

export const mutations = {
  SET_STRIPE_SESSION_DATA: (state, payload) => (state.sessionData = payload),
  CLEAR_CART: (state) => {
    state.cart = [];
  },
  ADD_TO_CART: (state, payload) => {
    const itemIndex = state.cart.findIndex(
      (res) => res.product.id == payload.product.id
    );
    if (itemIndex < 0) {
      state.cart.push(payload);
    } else {
      const item = state.cart[itemIndex];
      item.quantity++;
      set(state.cart, itemIndex, item);
    }
  },
  REMOVE_FROM_CART: (state, payload) => {
    const itemIndex = state.cart.findIndex((res) => res.product.id == payload);
    if (itemIndex >= 0) {
      state.cart.splice(itemIndex, 1);
    }
  },
  INCREASE_ITEM_QUANTITY: (state, payload) => {
    const itemIndex = state.cart.findIndex(
      (res) => res.product.id == payload.id
    );
    if (itemIndex >= 0) {
      const item = state.cart[itemIndex];
      item.quantity++;
      set(state.cart, itemIndex, item);
    }
  },
  DECREASE_ITEM_QUANTITY: (state, payload) => {
    const itemIndex = state.cart.findIndex(
      (res) => res.product.id == payload.id
    );
    if (itemIndex >= 0) {
      const item = state.cart[itemIndex];
      item.quantity--;
      set(state.cart, itemIndex, item);
      if (item.quantity == 0) {
        state.cart.splice(itemIndex, 1);
      }
    }
  },
  RESET_STRIPE_SESSION: (state) => {
    state.sessionData = {};
  },
  SET_PAYPAL_PAYMENT: (state, payload) => {
    state.tempPayPalPayment = payload;
  },
  RESET_PAYPAL_PAYMENT: (state) => {
    state.tempPayPalPayment = null;
  },
  APPLY_COUPON_CODE: (state, payload) => {
    state.discount = payload;
  },
  RESET_COUPON_CODE: (state) => {
    state.discount = null;
  },
  UPDATE_SHIPPING_AMOUNT: (state, payload) => {
    state.shippingAmount = Number(payload);
  },
};

export const actions = {
  async createStripeSession({ commit }, data) {
    const { session } = await this.$axios.$post(
      `${process.env.netlifyFunctionsUrl}/create-checkout-session`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (session.id) {
      commit("SET_STRIPE_SESSION_DATA", session);
    }
    return session;
  },
  async verifyAndApplyCoupon({ commit }, data) {
    const { discount } = await this.$axios.$post(
      `${process.env.netlifyFunctionsUrl}/verify-coupon`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (discount?.id) {
      commit("APPLY_COUPON_CODE", discount);
    } else {
      commit("APPLY_COUPON_CODE", null);
    }
  },
  async retriveStripeSession({ state, commit }) {
    const { session } = await this.$axios.$post(
      `${process.env.netlifyFunctionsUrl}/retrive-checkout-session`,
      {
        sessionId: state.sessionData.id,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (session.id) {
      commit("SET_STRIPE_SESSION_DATA", session);
    }
    return session;
  },
};

const calculateDiscountPrice = (price, discount, type) => {
  let calculatedDiscount = 0;
  if (type == "percent") {
    calculatedDiscount = eval("(discount * price) / 100");
  } else if (type === "fixed_cart") {
    calculatedDiscount = discount;
  }

  return Number((price - calculatedDiscount).toFixed(2));
};
