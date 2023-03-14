<template>
<client-only>
    <div>
        <div v-if="featuredImage && !hideFeatured" class="absolute top-0 left-0 h-screen w-full bg-black">
            <wpImage v-if="featuredImage" v-on:imageLoaded="$route.name == 'index' ? imageLoaded= true : null" :image="featuredImage" :classList="'backImage w-full h-full object-cover opacity-80'" />
            <svg class="svg-icon h-12 cursor-pointer absolute bottom-6 left-0 right-0 mx-auto" viewBox="0 0 20 20" @click="scrollToContent()" style="transform: rotate(90deg)">
                <path fill="currentColor" d="M11.611,10.049l-4.76-4.873c-0.303-0.31-0.297-0.804,0.012-1.105c0.309-0.304,0.803-0.293,1.105,0.012l5.306,5.433c0.304,0.31,0.296,0.805-0.012,1.105L7.83,15.928c-0.152,0.148-0.35,0.223-0.547,0.223c-0.203,0-0.406-0.08-0.559-0.236c-0.303-0.309-0.295-0.803,0.012-1.104L11.611,10.049z"></path>
            </svg>
        </div>
        <AgeCheck />
        <TopNav :frontpage="false" :darkMode="darkMode" />
        <div class="min-h-screen md:flex justify-between">

            <div class="px-4 pb-16 md:w-[66%] mx-auto text-center font-book">
                <Nuxt />
            </div>
            <sideNav :darkMode="darkMode" />
        </div>
        <footerNav />
    </div>
</client-only>
</template>

<script>
export default {
    name: 'page',
    data: () => {
        return {
            featuredImage: '',
            darkMode: false,
            hideFeatured: false
        }
    },

    created() {
        console.log(this.$route.params.slug)
        this.$store.commit('nav/CLOSE_MENU')
        this.$nuxt.$on('setPage', (data) => this.setPage(data))
        if (process.client) {
            const bodyClass = document.querySelector('body').classList
            bodyClass.remove('overflow-hidden')
        }
    },

    methods: {
        setPage(data) {
            this.featuredImage = data.featuredImage
            this.darkMode = data.darkMode
            this.hideFeatured = data.hideFeatured

        },
        scrollToContent() {
            const selected = document.getElementById('scrollTo')
            selected.scrollIntoView({
                behavior: "smooth",
                inline: "nearest"
            });
        }
    },
}
</script>
