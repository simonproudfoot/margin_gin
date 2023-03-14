<template>
<client-only>
    <main id="scrollTo" class="contentArea  z-10 bg-white  mt-1">
        <div v-for="item in products" :key="item.id" class="flex flex-col lg:flex-row justify-between items-center mb-12">
            <div class="lg:w-2/3  w-full  p-4 order-2 lg:order-1">
                <h2 class="text-4xl font-bold mb-2" v-html="item.name"></h2>
                <p class="text-xl mb-0 font-bold" v-if="!item.on_sale">
                    £{{ item.price }}
                </p>
                <p v-else class="text-red mb-0">SALE £{{ item.sale_price }}</p>
                <p>Shipping included</p>
                <p class="text-gray-700 leading-relaxed mb-4 prose font-book"  v-html="item.description"></p>
                <div class="">
                    <button :id="`button-${item.id}`" v-if="item.in_stock" class="bg-black text-white font-bold py-2 px-4 w-full md:w-52" @click="addToCart({ product: item, quantity: 1, id: item.id })">
                        Add To Cart
                    </button>

                    <button v-else-if="!item.in_stock" class="bg-black hover: text-white font-bold py-2 w-full px-4">
                        CURRENTLY NOT IN STOCK
                    </button>
                </div>
            </div>
            <div class="w-3/5 mb-12 lg:mb-0 md:w-1/3 order-1 lg:order-1">
                <div>
                    <img v-for="(img, i) in item.images" :key="img.id" class="w-full h-full object-cover" :src="img.src" :class="showImg == i ? 'block' : 'hidden'" :alt="img.alt" />
                </div>
                <div class="flex justify-center">
                    <img class="h-16 mx-2 cursor-pointer" @click="showImg = i" v-for="(img, i) in item.images" :key="img.id" :src="img.src" :class="showImg == i ? '' : 'opacity-60'" :alt="img.alt" />
                </div>
            </div>
        </div>
    </main>
</client-only>
</template>

<script>
import { mapMutations, mapState } from "vuex";
export default {
    layout: "simple",
    data() {
        return {
            products: [],
            showImg: 0,
        };
    },
    computed: {
        ...mapState("payment", ["cart"]),
    },
    methods: {
        addToCart(data) {

            let btn = document.getElementById(`button-${data.id}`)
            btn.innerHTML = 'Added!'
            this.$store.commit("payment/ADD_TO_CART", data)

            setTimeout(() => {
                btn.innerHTML = 'Add To Cart'
                this.$router.push('/shop/cart');
            }, 300);

        },
        ...mapMutations({
            // addToCart: "payment/ADD_TO_CART",
        }),
        itemExistInCart(item) {
            const cartItem = this.cart.find((res) => res.product.id == item.id);
            return cartItem ?.quantity > 0;
        },
        currentItemQuantity(item) {
            const cartItem = this.cart.find((res) => res.product.id == item.id);
            return cartItem ?.quantity || 0;
        },
    },
    async asyncData({ $axios }) {
        try {
            const response = await $axios.get(
                `${process.env.netlifyFunctionsUrl}/wooProducts`
            );
            const products = await response.data;
            // Sort products by menu_order
            products.sort((a, b) => (a.menu_order > b.menu_order) ? 1 : -1);
            return {
                products,
            };
        } catch (error) {
            console.log(error);
        }
    },
};
</script>

<style>
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
