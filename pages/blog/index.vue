<template>
<div class="grid gid-cols-2 lg:grid-cols-2 gap-2">

    <nuxt-link :to="'/blog/' + post.slug" v-for="post in posts" :key="post.id" class="bg-white shadow-md border border-gray-200  mb-5">
        <a href="#">
            <img class="h-72 w-full object-cover" :src="
          post._embedded['wp:featuredmedia'][0].media_details.sizes.large
            .source_url
        " :alt="post.title.rendered">
        </a>
        <div class="p-5">
            <a href="#">
                <h5 class="text-gray-900 font-book text-2xl tracking-tight mb-2"  v-html="post.title.rendered"></h5>
            </a>
            <p class="font-book text-gray-700 mb-3" v-html="post.excerpt.rendered" ></p>
            <a :to="'/blog/' + post.slug" class="text-white bg-black font-bold h-22 text-sm px-3 py-2 text-center inline-flex items-center" >
                Read more
            </a>
        </div>
    </nuxt-link>

    
</div>
</template>

<script>
import formattedDate from "~/plugins/dateConvert.js";
export default {
    layout: "simple",
    name: "PostList",
    methods: {
        formattedDate,
    },
    async asyncData({ $axios, store }) {
        store.commit("nav/CLOSE_MENU");
        const { data } = await $axios.get("wp/v2/posts?_embed ");
        return {
            posts: data,
        };
    },
};
</script>
