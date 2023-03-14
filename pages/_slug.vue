<template>
<main id="scrollTo" :style="featuredImage && 'margin-top: 100vh'">
  <h1 v-html="post.title.rendered" class="text-3xl mb-12"></h1>
  <div class="prose max-w-full mb-6" v-html="post.content.rendered"></div>
  <ContactForm v-if="$route.params.slug == 'contact'" />
</main>
</template>

<script>
import loadPage from '~/mixins.js/loadPage.js';
export default {
  layout: "page",
  mixins: [loadPage],
}
</script>
