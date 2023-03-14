<template>
  <main
    id="scrollTo"
    class="md:w-9/12 px-12 pb-24 contentArea z-10 bg-white max-w-[800px] pt-4 mt-1"
  >
    <h1 class="text-3xl font-bold mb-6">Thank you!</h1>
    <h1 class="text-2xl">Your order was successful.</h1>
    <h1 class="text-2xl">Please check your email for confirmation</h1>
  </main>
</template>

<script>
import { mapMutations, mapState, mapGetters } from "vuex";

export default {
  layout: "simple",
  computed: {
    ...mapState("payment", [
      "cart",
      "sessionData",
      "tempPayPalPayment",
      "discount",
      "shippingAmount",
    ]),
    ...mapGetters({
      discountTotal: "payment/DISCOUNT_PRICE",
    }),
  },
  created() {
    this.createOrderFromPaymentMethods();
  },
  methods: {
    ...mapMutations({
      clearCart: "payment/CLEAR_CART",
      resetCoupon: "payment/RESET_COUPON_CODE",
      resetSession: "payment/RESET_STRIPE_SESSION",
      resetPaypalPayment: "payment/RESET_PAYPAL_PAYMENT",
    }),
    async createOrderFromPaymentMethods() {
      if (this.sessionData?.id) {
        await this.retriveStripeSession();
      } else if (this.tempPayPalPayment?.id) {
        await this.createOrderFromPaypalPayment(this.tempPayPalPayment);
      }
    },
    async retriveStripeSession() {
      console.log("retriveStripeSession");
      const session = await this.$store.dispatch(
        "payment/retriveStripeSession"
      );
      if (session?.id) {
        await this.createOrderFromStripeSession(session);
      }
    },
    async createOrderFromStripeSession(session) {
      console.log("createOrderFromStripeSession");
      const payment_method = session.payment_method_types[0];
      const { name, email, phone } = session.customer_details;
      const namesList = name ? name.split(" ") : ["", ""];
      const first_name = namesList[0];
      const last_name = namesList[1];
      const line_items = this.cart.map((res) => {
        return { quantity: res.quantity, product_id: res.product.id };
      });

      const { code: couponCode = "", id: couponId = null } = this.discount?.id
        ? this.discount
        : {};
      const coupon_lines = couponId
        ? [
            {
              code: couponCode,
              discount: this.discountTotal.toString(),
            },
          ]
        : [];
      const {
        line1,
        line2,
        city,
        country,
        state,
        postal_code: postcode,
      } = session.customer_details.address;

      const {
        line1: shippingLine1,
        line2: shippingLine2,
        city: shippingCity,
        country: shippingCountry,
        state: shippingState,
        postal_code: shippingPostcode,
      } = session.shipping
        ? session.shipping.address
        : session.shipping_details.address;

      // session.shipping_details.address; BREAKS FINAL PAYMENT TO WOO

      const billing = {
        first_name,
        last_name,
        address_1: line1 || "",
        address_2: line2 || "",
        city,
        state: state || "",
        postcode,
        country,
        email,
        phone: phone || "",
      };
      const shipping = {
        first_name,
        last_name,
        address_1: shippingLine1 || line1 || "",
        address_2: shippingLine2 || line2 || "",
        city: shippingCity || city || "",
        state: shippingState || state || "",
        postcode: shippingPostcode || postcode || "",
        country: shippingCountry || country || "",
      };

      const data = {
        status: "processing",
        payment_method,
        payment_method_title: `${name} paid via ${payment_method}`,
        set_paid: true,
        billing,
        shipping,
        shipping_lines: [
          {
            method_id: "flat_rate",
            method_title: "Shipping",
            total: this.shippingAmount.toFixed(2),
          },
        ],
        line_items,
        coupon_lines,
      };

      let order = JSON.parse(JSON.stringify(data));
      console.log(
        `invoking function URL ${process.env.netlifyFunctionsUrl}/createOrder`
      );
      console.log("data", order);

      await this.$axios
        .$post(`${process.env.netlifyFunctionsUrl}/createOrder`, order, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .catch(function (error) {
          console.log(error.toJSON());
        })
        .finally(() => {
          this.clearCart();
          this.resetCoupon();
          this.resetSession();
        });
    },
    async createOrderFromPaypalPayment(paypalPayment) {
      console.log("createOrderFromPaypalPayment");
      const { payment_method, payer_info } = paypalPayment.payer;
      const { first_name, last_name, email, shipping_address } = payer_info;
      const {
        recipient_name,
        line1,
        city,
        state,
        postal_code: postcode,
        country_code: country,
      } = shipping_address;

      const line_items = this.cart.map((res) => {
        return { quantity: res.quantity, product_id: res.product.id };
      });

      const { code: couponCode = "", id: couponId = null } = this.discount?.id
        ? this.discount
        : {};
      const coupon_lines = couponId
        ? [
            {
              code: couponCode,
              discount: this.discountTotal.toString(),
            },
          ]
        : [];

      const shipping = {
        first_name,
        last_name,
        address_1: line1 || "",
        address_2: "",
        city: city,
        state: state || "",
        postcode,
        country,
      };

      const billing = {
        ...shipping,
        email,
        phone: "",
      };

      const data = {
        payment_method,
        payment_method_title: `${recipient_name} paid via ${payment_method}`,
        set_paid: true,
        billing,
        shipping,
        shipping_lines: [
          {
            method_id: "flat_rate",
            method_title: "Shipping",
            total: this.shippingAmount.toFixed(2),
          },
        ],
        line_items,
        coupon_lines,
      };

      let order = JSON.parse(JSON.stringify(data));
      console.log(
        `invoking function URL ${process.env.netlifyFunctionsUrl}/createOrder`
      );
      console.log("data", order);

      await this.$axios
        .$post(`${process.env.netlifyFunctionsUrl}/createOrder`, order, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .catch(function (error) {
          console.log(error.toJSON());
        })
        .finally(() => {
          this.clearCart();
          this.resetCoupon();
          this.resetPaypalPayment();
        });
    },
  },
};
</script>
