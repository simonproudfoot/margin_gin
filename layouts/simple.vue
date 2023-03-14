<template>
<client-only>
    <div>
        <AgeCheck />
        <TopNav :frontpage="false" />
        <div class="min-h-screen md:flex">
            <div class="px-4 pb-16 md:w-[66%] mx-auto">  
                <Nuxt />
            </div>
            <sideNav />
        </div>
        <footerNav />
    </div>
</client-only>
</template>

<script>
export default {
    name: 'simple',
    created() {
        this.$store.commit('nav/CLOSE_MENU')
        this.$store.commit('page/FORCE_LIGHT')
        if (process.client) {
            const bodyClass = document.querySelector('body').classList
            bodyClass.remove('overflow-hidden')
            console.log('body', bodyClass)
        }
    },

}
</script>
