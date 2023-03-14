<template>
<main class=" text-center" id="scrollTo" :style="featuredImage && !hideFeatured ? 'margin-top: 100vh' : ''">
  <p class="mb-4 text-xs mx-auto " v-html="formattedDate(post.date_gmt)"></p>
  <h1 v-html="post.title.rendered" class="text-3xl  mb-12"></h1>
  <div class="prose max-w-full" v-html="post.content.rendered"></div>
</main>
</template>

<script>
import loadPage from '~/mixins.js/loadPage.js';
export default {
  layout: "page",
  mixins: [loadPage],
}
</script>
