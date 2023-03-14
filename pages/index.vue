<template>
<div class="relative bg-black">

    <ageCheck v-on:cookieUpdated="cookieUpdated" />
    <div v-show="imageLoaded" class="h-screen w-full overflow-hidden  relative top-0 bottom-0">
        <div class=" h-screen w-full  bg-black justify-items-stretch">
            <TopNav class="absolute top-0 bg-transparent" v-if="imageLoaded  && cookieGo" :frontpage="true" />
            <sideNav class="z-40 absolute" v-if="imageLoaded && cookieGo" :frontpage="true" />
            <wpImage v-on:imageLoaded="$route.name == 'index' ? imageLoaded=true : false" v-if="featuredImage" :image="featuredImage" :classList="'backImage absolute top-0 left-0 w-full h-screen object-cover opacity-0 contentArea'" />

            <div class="absolute flex left-0 top-1/3 z-10 font-body text-center md:text-left w-full md:w-1/2 ">
                <div class="mx-auto leading-tight w-fit block md:pl-12">
                    <h1 class="intro-text font-bold mb-6 text-white self-center italic">The Perfect Sipping Gin... </h1>
                    <nuxt-link to="/shop" class="cta py-2 px-6 mt-12 border-white text-xl block w-full mx-auto bg-white md:hidden z-30">SHOP</nuxt-link>
                </div>
            </div>
        </div>
    </div>
    <footerNav v-show="imageLoaded" />
</div>
</template>

<script>
import getCookie from '@/plugins/getCookie.js';
import loadPage from '~/mixins.js/loadPage.js';
export default {
    layout: "frontpage",
    mixins: [loadPage],

    data: () => {
        return {
            imageLoaded: false,
            cookieGo: false
        }
    },

    watch: {
        imageLoaded(val) {
            if (val && getCookie('ageCheck') == 'true') {
                this.runAnimation()
                this.cookieGo = true
            } else {
                console.log('Test: Image not loaded!')
            }
        }
    },
    methods: {
        runAnimation() {
            if (process.client) {
                const isMobile = window.innerWidth < 768 ? true : false
                let body = document.querySelector('body');
                this.$gsap.set('.backImage', {
                    scale: 1.2
                })
                this.$gsap.to('.backImage', {
                    autoAlpha: isMobile ? 0.3 : 1,
                    duration: 2,
                    scale: 1
                }).then(() => {})
                this.$gsap.from('.intro-text, .cta', {
                    y: 50,
                    autoAlpha: 0,
                    delay: 1,
                    stagger: 0.4,
                    duration: 1
                })
            }
        },
        cookieUpdated() {
            this.runAnimation()
            this.cookieGo = true
        },
    },
}
</script>
