<template>
<div class="">

    <div class="h-[750px]  md:h-[650px]  lg:h-[700px]  flex w-full text-white text-center bg-black relative mb-11">
        <img src="/img/RockyMarGin.webp" alt="RockyMarGin" class="w-full object-cover left-0 z-0">

        <div class="absolute top-10 left-0 right-0 [ md:right-auto md:left-10 md:top-12 ]">
            <div class="text-2xl font-bold mb-4 antialiased antialiased">#RockyMarGin</div>
            <ul class="font-bold text-[12px] leading-loose antialiased antialiased">
                <li>40ml MarGin
                </li>
                <li>Large square ice cube
                </li>
            </ul>
        </div>
    </div>

    <div class="h-[750px]  md:h-[650px]  lg:h-[700px]  flex w-full text-white text-center bg-black relative mb-11">
        <img src="/img/MarGinMelograno.webp" alt="MarGinMelograno" class="w-full object-cover left-0 z-0">
        <div class="absolute top-10 left-0 right-0 [ md:left-auto md:right-10 md:top-12 ]">
            <div class="text-2xl font-bold mb-4 antialiased">#MarGinMelograno</div>
            <ul class="font-bold text-[12px] leading-loose antialiased">
                <li>30ml MarGin
                </li>
                <li>30ml Fresh pomegranate juice
                </li>
                <li>20ml Noilly Prat Vermouth</li>
                <li>20ml Cointreau</li>
                <li>50ml Tonic Water</li>
            </ul>
        </div>
    </div>
    <div class="h-[750px]  md:h-[650px]  lg:h-[700px]  flex w-full text-white text-center bg-black relative mb-11">
        <img src="/img/MarGinMartini.webp" alt="MarGinMartini" class="w-full object-cover left-0 z-0">
        <div class="absolute top-10 left-0 right-0 [ md:right-auto md:left-10 md:top-12 ]">
            <div class="text-2xl font-bold mb-4 antialiased">#MarGinMartini</div>
            <ul class="font-bold text-[12px] leading-loose antialiased">
                <li>60ml MarGin
                </li>
                <li>Splash of Fino Sherry
                </li>
                <li>Ice and a shaker
                </li>

            </ul>
        </div>
    </div>

    <div class="h-[750px]  md:h-[650px]  lg:h-[700px]  flex w-full text-white text-center bg-black relative mb-11">
        <img src="/img/SlenderMarGin.webp" alt="SlenderMarGin" class="w-full object-cover left-0 z-0">
        <div class="absolute top-10 left-0 right-0 [ md:left-auto md:right-10 md:top-12 ]">
            <div class="text-2xl font-bold mb-4 antialiased">#SlenderMarGin</div>
            <ul class="font-bold text-[12px] leading-loose antialiased">
                <li>50ml MarGin

                </li>
                <li>100ml Soda water

                </li>
                <li>10ml Lime juice

                </li>

            </ul>
        </div>
    </div>
</div>
</template>

<script>
import loadPage from '~/mixins.js/loadPage.js';
import headMeta from '@/plugins/headMeta.js';
export default {
    layout: "simple",
    mixins: [loadPage],
    head() {
        if (this.$store.state.page.pageFeatures.yoast_head_json) {
            const metaData = headMeta(this.$store.state.page.pageFeatures.yoast_head_json)
            return {
                title: this.$store.state.page.pageFeatures.title,
                meta: metaData
            }
        }
    },

    created() {
        this.$store.commit('nav/CLOSE_MENU')
        if (process.client) {
            const bodyClass = document.querySelector('body').classList
            bodyClass.remove('overflow-hidden')
            console.log('body', bodyClass)
        }
    },
}
</script>
