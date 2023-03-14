<template>
<client-only>
    <main>
        <div class="flex h-full flex-col overflow-y-auto bg-white">
            <div class="flex-1 overflow-y-auto">
                <div class="md:flex md:items-center md:justify-between">
                    <h2 class="text-4xl font-bold mb-6 md:mb-0 ">Cart</h2>
                </div>

                <div class="my-4  py-2">
                    <div class="flow-root">
                        <ul role="list" class="">
                            <li class="grid grid-cols-8 lg:grid-cols-12 border-b border-black border-opacity-30 font-bold">

                                <div class="col-span-4 lg:col-span-1 text-left">Product</div>
                                <div class="hidden lg:block w-full md:col-span-7"></div>
                                <div class="hidden lg:block col-span-2 text-center">Price</div>
                                <div class="hidden lg:block col-span-2 text-right">Quantity</div>

                            </li>

                            <li v-for="(item, i) in cart" :key="i" class="grid grid-cols-8 lg:grid-cols-12 items-center border-b border-black border-opacity-30 py-3 ">
                                <div class="md:col-span-1">
                                    <button @click="openRemoveItem(item.product.id)">
                                        <svg class="w-8 h-8" viewBox="0 0 20 20">
                                            <path fill="#000" d="M10.185,1.417c-4.741,0-8.583,3.842-8.583,8.583c0,4.74,3.842,8.582,8.583,8.582S18.768,14.74,18.768,10C18.768,5.259,14.926,1.417,10.185,1.417 M10.185,17.68c-4.235,0-7.679-3.445-7.679-7.68c0-4.235,3.444-7.679,7.679-7.679S17.864,5.765,17.864,10C17.864,14.234,14.42,17.68,10.185,17.68 M10.824,10l2.842-2.844c0.178-0.176,0.178-0.46,0-0.637c-0.177-0.178-0.461-0.178-0.637,0l-2.844,2.841L7.341,6.52c-0.176-0.178-0.46-0.178-0.637,0c-0.178,0.176-0.178,0.461,0,0.637L9.546,10l-2.841,2.844c-0.178,0.176-0.178,0.461,0,0.637c0.178,0.178,0.459,0.178,0.637,0l2.844-2.841l2.844,2.841c0.178,0.178,0.459,0.178,0.637,0c0.178-0.176,0.178-0.461,0-0.637L10.824,10z"></path>
                                        </svg>
                                    </button>
                                </div>
                                <div class="col-span-1"><img :src="item.product.images[0].src" alt="" class="h-full object-contain w-full" /></div>
                                <div class="text-right lg:text-left col-span-6 font-bold lg:font-body"> {{ item.product.name }}</div>

                                <div class="col-span-2 text-center mt-4 lg:mt-0"><span class="font-bold lg:hidden">Price</span> £{{ item.product.price }}</div>

                                <div class="mt-4 lg:mt-0 col-span-6 lg:col-span-2 text-center flex items-center grid">
                                    <div class="justify-self-end flex items-center">
                                        <span class="font-bold lg:hidden mr-4">Quantity</span>
                                        <div class="">
                                            <button class="bg-black hover: text-white font-bold p-2 w-8" @click="setQuantity(false, item)">
                                                -
                                            </button>
                                            <input class="w-8 border p-2" type="number" :value="item.quantity" @keyup.up="setQuantity(true, item)" @keyup.down="setQuantity(false, item)" />
                                            <button class="bg-black hover: text-white font-bold p-2 w-8" @click="setQuantity(true, item)">
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </li>

                        </ul>
                        <h3 v-if="!Object.entries(cart).length" class="text-2xl">There are no items in you basket</h3>
                    </div>
                </div>
            </div>
        </div>

        <div class="grid gap-x-12 grid-cols-12 mt-12">
            <div class=" col-span-12 lg:col-span-7 mb-12 ">
                <div class="md:max-w-[400px] space-y-6" Or>
                    <div>
                        <p class="font-bold text-left mb-0">Shipping cost</p>
                        <select @change="$event=>updateShippingAmount($event.target.value)" :value="shippingAmount" class="w-full h-12 pr-12 text-lg pl-3 pr-12 text-base placeholder-gray-600 border rounded-none appearance-none focus:shadow-outline">
                            <option v-for="(ship, i) in shippingData" :key="'ship_' + i" :value="ship.cost">
                                {{ countryName(ship.country) }}: {{ ship.cost == 0 ? 'Free' : '£'+ship.cost }}
                            </option>
                            <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" fill-rule="evenodd"></path>
                                </svg>
                            </div>
                        </select>
                    </div>

                    <div>
                        <p class="font-bold text-left mb-0">Discount</p>
                        <div v-if="discount" class="flex">
                            <span class="center relative flex select-none whitespace-nowrap  bg-green-500 py-2 px-3.5 items-center font-sans text-xs font-bold uppercase leading-none text-white">
                                <div>{{ discount.code | uppercase }}</div>
                                <button class="p-1 ml-auto bg-transparent border-0 text-white float-right leading-none font-semibold outline-none focus:outline-none" @click="resetCoupon()">
                                    x
                                </button>
                            </span>
                        </div>
                        <template v-else>
                            <div class="flex">
                                <input placeholder="Discount Code" class="w-full h-12 px-4 text-lg text-gray-700 placeholder-gray-600 border rounded-none focus:shadow-outline" type="text" v-model="couponCode" />
                                <button class="bg-black ml-2 text-white w-auto h-12 px-4 text-lg text-gray-700 placeholder-gray-600 border rounded-none focus:shadow-outline" @click="applyCoupon()">
                                    Apply
                                </button>
                            </div>
                        </template>
                    </div>
                </div>
                <div class="mt-10 mb-4 flex w-full justify- space-x-4">
                    <img src="https://js.stripe.com/v3/fingerprinted/img/visa-729c05c240c4bdb47b03ac81d9945bfe.svg" alt="Visa" class="BrandIcon" loading="lazy" fetchpriority="low" /><img src="https://js.stripe.com/v3/fingerprinted/img/mastercard-4d8844094130711885b5e41b28c9848f.svg" alt="MasterCard" class="BrandIcon" loading="lazy" fetchpriority="low" /><img src="https://js.stripe.com/v3/fingerprinted/img/amex-a49b82f46c5cd6a96a6e418a6ca1717c.svg" alt="American Express" class="BrandIcon" loading="lazy" fetchpriority="low" /><img src="https://js.stripe.com/v3/fingerprinted/img/unionpay-8a10aefc7295216c338ba4e1224627a1.svg" alt="UnionPay" class="BrandIcon" loading="lazy" fetchpriority="low" /><img src="https://js.stripe.com/v3/fingerprinted/img/discover-ac52cd46f89fa40a29a0bfb954e33173.svg" alt="Discover" class="BrandIcon" loading="lazy" fetchpriority="low" /><img src="https://js.stripe.com/v3/fingerprinted/img/diners-fbcbd3360f8e3f629cdaa80e93abdb8b.svg" alt="Diners Club" class="BrandIcon" loading="lazy" fetchpriority="low" />
                    <img src="/img/icons/apple.png" alt="Visa" class="" loading="lazy" fetchpriority="low" width="41px" height="20px" />
                    <img src="/img/icons/google-pay.png" alt="Visa" class="" loading="lazy" fetchpriority="low" width="41px" height="20px" />
                </div>
            </div>

            <div class="col-span-12 lg:col-span-5">
                <div class="flex border-b border-black border-opacity-30 pb-4 ">
                    <div class="w-1/2 font-bold text-left">Sub total</div>
                    <div class="w-1/2 text-right">£{{ cartSubTotal }}</div>
                </div>
                <div class="flex border-b border-black border-opacity-30 py-4">
                    <div class="w-1/2 font-bold text-left">Shipping</div>
                    <div class="w-1/2 text-right">£{{ shippingAmount }}</div>
                </div>

                <div v-if="discount" class="flex border-b border-black border-opacity-30 py-4">
                    <div class="w-1/2 font-bold text-left">Discount</div>
                    <div class="w-1/2 text-right">{{ discount.amount }}% - (£{{ discountPrice }})</div>
                </div>

                <div class="flex border-b border-black border-opacity-30 py-4">
                    <div class="w-1/2 font-bold text-left">Grand total</div>
                    <div class="w-1/2 text-right">£{{ grandTotal }}</div>
                </div>

                <div class="mt-12 w-full max-w-xl mx-auto">
                    <template v-if="cart.length > 0">
                        <button class="w-full bg-black hover: text-white fo py-4 px-4  font-bold" :disabled="loadingStripePage" :class="loadingStripePage && 'opacity-90'" @click="goToCheckout()">
                            <svg v-if="loadingStripePage" fill="#fff" class="w-4 h-4 animate-spin mx-6 mx-auto" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                                <path d="M512 1024c-69.1 0-136.2-13.5-199.3-40.2C251.7 958 197 921 150 874c-47-47-84-101.7-109.8-162.7C13.5 648.2 0 581.1 0 512c0-19.9 16.1-36 36-36s36 16.1 36 36c0 59.4 11.6 117 34.6 171.3 22.2 52.4 53.9 99.5 94.3 139.9 40.4 40.4 87.5 72.2 139.9 94.3C395 940.4 452.6 952 512 952c59.4 0 117-11.6 171.3-34.6 52.4-22.2 99.5-53.9 139.9-94.3 40.4-40.4 72.2-87.5 94.3-139.9C940.4 629 952 571.4 952 512c0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 0 0-94.3-139.9 437.71 437.71 0 0 0-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.2C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3s-13.5 136.2-40.2 199.3C958 772.3 921 827 874 874c-47 47-101.8 83.9-162.7 109.7-63.1 26.8-130.2 40.3-199.3 40.3z" />
                            </svg>
                            <span v-else>Pay with Card/Apple/Google</span>
                        </button>

                        <div class="flex items-center py-6 mb-4">
                            <div class="h-0.5 bg-black w-full opacity-10"></div>
                            <div class="px-4">Or</div>

                            <div class="h-0.5 bg-black w-full opacity-10"></div>
                        </div>

                        <paypal-checkout :amount="paypalGrandTotal" :env="paypalEnvironment" currency="GBP" :items="paypalLineItems" :client="paypal" :button-style="paypalBtnStyle" v-on:payment-completed="paypalPaymentCompleted" v-on:payment-authorized="paypalPaymentAuthorized" />
                    </template>
                </div>
                <div class="mt-6 flex justify-center text-center text-sm text-gray-500">
                    <p>
                        or
                        <nuxt-link to="/shop" class="font-medium text-black">
                            Continue Shopping
                            <span aria-hidden="true"> &rarr;</span>
                        </nuxt-link>
                    </p>
                </div>
            </div>

        </div>

        <stripe-checkout ref="checkoutRef" :pk="stripePublishKey" :session-id="sessionData.id" @loading="(v) => (loading = v)" />

        <ConfirmationDialog heading="Confirm Remove" body="Do you want to remoce item from cart?" ref="confirmationDialog" @onConfirm="confirmRemoveItem()" />
    </main>
</client-only>
</template>

<script>
import { mapMutations, mapActions, mapState, mapGetters } from "vuex";
import ConfirmationDialog from "../../components/confirmationDialog.vue";
import PayPal from "vue-paypal-checkout";
import { StripeCheckout } from "@vue-stripe/vue-stripe";

export default {
    layout: "page",
    components: {
        ConfirmationDialog,
        StripeCheckout,
        "paypal-checkout": PayPal,
    },
    data() {
        return {
            itemIdToRemove: null,
            couponCode: null,
            loadingStripePage: false,
            loading: false,
            paypal: {
                sandbox: process.env.paypalClientId,
                production: process.env.paypalClientId,
            },
            paypalBtnStyle: {
                label: "pay",
                size: "responsive",
                shape: "rect",
                color: "black",
                tagline: false,
                height: 55,
            },
            shippingData: [{
                country: "GB",
                cost: 0,
            }, ],
        };
    },
    computed: {
        ...mapState("payment", [
            "sessionData",
            "cart",
            "discount",
            "shippingAmount",
        ]),
        ...mapGetters({
            cartSubTotal: "payment/CART_SUBTOTAL",
            discountPrice: "payment/DISCOUNT_PRICE",
            grandTotal: "payment/GRAND_TOTAL",
            paypalLineItems: "payment/PAYPAL_LINE_ITEMS",
            stripeLineItems: "payment/STRIPE_LINE_ITEMS",
            paypalGrandTotal: "payment/GRAND_TOTAL_PAYPAL",
        }),
        stripePublishKey() {
            return process.env.stripePublishKey;
        },
        paypalEnvironment() {
            return process.env.NODE_ENV == "development" ? "sandbox" : "production";
        },
    },
    mounted() {
        this.resetSession();
        this.resetPaypalPayment();
    },
    methods: {

        countryName(code) {
            let regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
            return regionNames.of(code);
        },
        ...mapActions({
            verifyAndApplyCoupon: "payment/verifyAndApplyCoupon",
        }),
        ...mapMutations({
            removeProduct: "payment/REMOVE_FROM_CART",
            setPaypalPayment: "payment/SET_PAYPAL_PAYMENT",
            increaseQuantity: "payment/INCREASE_ITEM_QUANTITY",
            decreaseQuantity: "payment/DECREASE_ITEM_QUANTITY",
            resetSession: "payment/RESET_STRIPE_SESSION",
            resetPaypalPayment: "payment/RESET_PAYPAL_PAYMENT",
            clearCart: "payment/CLEAR_CART",
            resetCoupon: "payment/RESET_COUPON_CODE",
            updateShippingAmount: "payment/UPDATE_SHIPPING_AMOUNT"
        }),
        openRemoveItem(itemId) {
            this.itemIdToRemove = itemId;
            this.$refs.confirmationDialog.showModal();
        },
        confirmRemoveItem() {
            this.removeProduct(this.itemIdToRemove);
            this.itemIdToRemove = null;
            this.$refs.confirmationDialog.hideModal();
        },
        async goToCheckout() {
            this.loadingStripePage = true;
            const line_items = this.stripeLineItems;
            const myDomain = window.location.origin;
            const data = {
                success_url: `${myDomain}/shop/payment-success`,
                cancel_url: `${myDomain}/shop/cart`,
                shipping_options: [{
                    shipping_rate_data: {
                        type: "fixed_amount",
                        fixed_amount: { amount: this.shippingAmount, currency: "gbp" },
                        display_name: "Shipping",
                    },
                }, ],
                line_items,
                mode: "payment",
                billing_address_collection: "required",
                shipping_address_collection: {
                    allowed_countries: ["GB"],
                },
            };
            try {
                await this.$store.dispatch("payment/createStripeSession", data);
                this.$refs.checkoutRef.redirectToCheckout();
            } catch (error) {
                console.log(error);
            } finally {
                this.loadingStripePage = false;
            }
        },
        paypalPaymentCompleted(payment) {
            this.setPaypalPayment(payment);
            this.$router.push("/shop/payment-success");
        },
        paypalPaymentAuthorized(payment) {
            console.log("PMNT AUTH : ", payment);
        },
        setQuantity(plus, item) {
            if (plus) {
                this.increaseQuantity(item.product);
            } else if (item.quantity > 0) {
                this.decreaseQuantity(item.product);
            }
        },
        applyCoupon() {
            this.verifyAndApplyCoupon({
                couponCode: this.couponCode,
            });
        },
    },
};
</script>

<style scoped>
.paypal-button {
    background-color: #000 !important;
}

.details-desc>p:nth-child(1) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 0 !important;
    max-width: 80%;
}

.details-desc>p:not(:nth-child(1)) {
    display: none;
}

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

/* Firefox */
input[type="number"] {
    -moz-appearance: textfield;
}
</style>
