<template>
<nav v-cloak class="w-full md:w-2/12 lg:w-2/12 md:absolute md:h-auto z-40 h-fit right-0">
    <div class="navMenu fixed z-40 right-0 md:relative top-0 w-full bg-black  md:bg-transparent right-0 h-full flex md:block items-center md:items-start" v-show="showMenu">
        <div class="mx-auto">
            <ul class="sticky top-0 px-6 pb-4 pt-0 " :class="darkMode ? 'navWhite' : 'navBlack'">

                <li v-for="page in $store.state.nav.mainNav" :key="page.id" :class="darkMode || frontpage ? 'text-white' : 'text-white md:text-black'" class="menuItem  lg:pl-2"> 
                    <nuxt-link class="menuItem_link" v-if="page.type !== 'custom' && page.type_label=='Page'" :to="'/'+page.slug" v-html="page.title"></nuxt-link>
                    <nuxt-link class="menuItem_link" v-else-if="page.type !== 'custom' && page.type_label=='Post'" :to="'/blog/'+page.slug" v-html="page.title"></nuxt-link>
                    <a class="menuItem_link" v-else :href="page.url" target="_blank" v-html="page.title"></a>
                </li>

                <li class="pl-2" :class="darkMode || frontpage ? 'text-white' : 'text-white md:text-black'">
                    <nuxt-link class="menuItem_link" to="/shop/cart" style="text-decoration: none !important">
                        <svg viewBox="0 0 20 20" class="w-4 h-4 inline-block">
                            <path fill="currentColor" d="M17.671,13.945l0.003,0.002l1.708-7.687l-0.008-0.002c0.008-0.033,0.021-0.065,0.021-0.102c0-0.236-0.191-0.428-0.427-0.428H5.276L4.67,3.472L4.665,3.473c-0.053-0.175-0.21-0.306-0.403-0.306H1.032c-0.236,0-0.427,0.191-0.427,0.427c0,0.236,0.191,0.428,0.427,0.428h2.902l2.667,9.945l0,0c0.037,0.119,0.125,0.217,0.239,0.268c-0.16,0.26-0.257,0.562-0.257,0.891c0,0.943,0.765,1.707,1.708,1.707S10,16.068,10,15.125c0-0.312-0.09-0.602-0.237-0.855h4.744c-0.146,0.254-0.237,0.543-0.237,0.855c0,0.943,0.766,1.707,1.708,1.707c0.944,0,1.709-0.764,1.709-1.707c0-0.328-0.097-0.631-0.257-0.891C17.55,14.182,17.639,14.074,17.671,13.945 M15.934,6.583h2.502l-0.38,1.709h-2.312L15.934,6.583zM5.505,6.583h2.832l0.189,1.709H5.963L5.505,6.583z M6.65,10.854L6.192,9.146h2.429l0.19,1.708H6.65z M6.879,11.707h2.027l0.189,1.709H7.338L6.879,11.707z M8.292,15.979c-0.472,0-0.854-0.383-0.854-0.854c0-0.473,0.382-0.855,0.854-0.855s0.854,0.383,0.854,0.855C9.146,15.596,8.763,15.979,8.292,15.979 M11.708,13.416H9.955l-0.189-1.709h1.943V13.416z M11.708,10.854H9.67L9.48,9.146h2.228V10.854z M11.708,8.292H9.386l-0.19-1.709h2.512V8.292z M14.315,13.416h-1.753v-1.709h1.942L14.315,13.416zM14.6,10.854h-2.037V9.146h2.227L14.6,10.854z M14.884,8.292h-2.321V6.583h2.512L14.884,8.292z M15.978,15.979c-0.471,0-0.854-0.383-0.854-0.854c0-0.473,0.383-0.855,0.854-0.855c0.473,0,0.854,0.383,0.854,0.855C16.832,15.596,16.45,15.979,15.978,15.979 M16.917,13.416h-1.743l0.189-1.709h1.934L16.917,13.416z M15.458,10.854l0.19-1.708h2.218l-0.38,1.708H15.458z"></path>
                        </svg>
                        {{ $store.getters['payment/CART_COUNT'] }}
                    </nuxt-link>
                </li>
            </ul>
        </div>
    </div>
</nav>
</template>

<script>
export default {
    props: ['frontpage', 'darkMode'],
    data: () => {
        return {
            isMobile: false,
            forward: true,
        }
    },
    computed: {
        showMenu() {
            if (this.isMobile && this.$store.state.nav.menuOpen) {
                return true
            }
            if (!this.isMobile) {
                return true
            } else {
                return false
            }
        }
    },
    watch: {
        '$store.state.nav.menuOpen'(val) {
            this.$nextTick(() => {
                const body = document.querySelector('body');
                if (val) {
                    body.classList.toggle("overflow-hidden");
                    this.$gsap.from('.navMenu', {
                        yPercent: 100
                    })
                    this.$gsap.from('nav li', {
                        y: 90,
                        autoAlpha: 0,
                        stagger: 0.05,
                        delay: 0.2
                    })
                } else {
                    body.classList.toggle("overflow-hidden");
                    this.$gsap.to('.logo', {
                        y: 0
                    })
                }
            });
        }
    },
    mounted() {
        this.animatePageLinks()
    },
    created() {
        if (process.client) {
            this.changeWidth()
            window.addEventListener("resize", this.changeWidth);
        }
    },
    destroyed() {
        if (process.client)
            window.removeEventListener("resize", this.changeWidth);
    },
    methods: {
        changeWidth() {
            if (process.client)
                this.isMobile = window.innerWidth < 768 ? true : false
        },
        animatePageLinks() {
            if (this.$route.name == 'index' && !this.isMobile) {
                this.$gsap.from('.logo', {
                    y: -50,
                    autoAlpha: 0,
                    delay: 0.7
                })
                this.$gsap.from('nav li', {
                    x: -50,
                    autoAlpha: 0,
                    stagger: 0.05,
                    delay: 1
                })
            }
        }
    }
}
</script>

<style>
.menuItem_link {
    list-style: none;
    @apply font-medium  capitalize block;

    /* Mobile */
    @apply text-xl w-full border-black mt-[15px] text-center w-fit mx-auto duration-300 leading-tight;

    /* Desktop */
    @apply md:mt-2 md:p-0 md:text-[15px] md:font-[400] md:leading-[1.5em] md:tracking-[2px] md:text-left md:mt-1 md:border-none md:mx-0;

}
</style>
