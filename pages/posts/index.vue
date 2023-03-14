<template>
<client-only>
  <main>
    <div class="flex h-full flex-col overflow-y-auto bg-white">
      <div class="flex-1 overflow-y-auto py-6 sm:px-6">
        <div class="md:flex items-start justify-between">
          <h2 class="text-3xl mb-4 font-medium">Search</h2>
          <input v-model="searchTerm" @keyup.enter="(e) => searchPosts({ title: e.target.value })" class="w-full md:w-auto mt-4 md:mt-0 border py-6 md:py-1 focus:ring-primary-500 focus:border-white block px-2" placeholder="Search" />
        </div>
        <div class="mt-8">
          <div class="flow-root">
            <ul role="list" class="my-6 divide-y divide-gray-200" v-if="!$store.state.posts.loadingPosts">
              <li class="flex py-6 overflow-hidden" v-for="(item, i) in posts" :key="i">
                <nuxt-link :to="getSlug(item.subtype, item.url)" class="w-full">
                  <div class="flex flex-1 flex-col">
                    <div>
                      <div class="flex justify-between text-base font-medium text-gray-900">
                        <h3 v-html="item.title">
                        </h3>
                        <span class="center whitespace-nowrap rounded-full bg-black py-2 px-3.5 items-center font-sans text-xs font-bold uppercase leading-none text-white">
                          <div>{{ item.subtype | uppercase }}</div>
                        </span>
                      </div>
                    </div>
                  </div>
                </nuxt-link>
              </li>
            </ul>
            <div v-else class="mx-auto w-24 h-24">
              <svg class="svg-icon animate-spin opacity-30" viewBox="0 0 20 20">
                <path fill="#000" d="M19.305,9.61c-0.235-0.235-0.615-0.235-0.85,0l-1.339,1.339c0.045-0.311,0.073-0.626,0.073-0.949
                  c0-3.812-3.09-6.901-6.901-6.901c-2.213,0-4.177,1.045-5.44,2.664l0.897,0.719c1.053-1.356,2.693-2.232,4.543-2.232
                  c3.176,0,5.751,2.574,5.751,5.751c0,0.342-0.037,0.675-0.095,1l-1.746-1.39c-0.234-0.235-0.614-0.235-0.849,0
                  c-0.235,0.235-0.235,0.615,0,0.85l2.823,2.25c0.122,0.121,0.282,0.177,0.441,0.172c0.159,0.005,0.32-0.051,0.44-0.172l2.25-2.25
                  C19.539,10.225,19.539,9.845,19.305,9.61z M10.288,15.752c-3.177,0-5.751-2.575-5.751-5.752c0-0.276,0.025-0.547,0.062-0.813
                  l1.203,1.203c0.235,0.234,0.615,0.234,0.85,0c0.234-0.235,0.234-0.615,0-0.85l-2.25-2.25C4.281,7.169,4.121,7.114,3.961,7.118
                  C3.802,7.114,3.642,7.169,3.52,7.291l-2.824,2.25c-0.234,0.235-0.234,0.615,0,0.85c0.235,0.234,0.615,0.234,0.85,0l1.957-1.559
                  C3.435,9.212,3.386,9.6,3.386,10c0,3.812,3.09,6.901,6.902,6.901c2.083,0,3.946-0.927,5.212-2.387l-0.898-0.719
                  C13.547,14.992,12.008,15.752,10.288,15.752z"></path>
              </svg>
              <p class="mx-auto text-center">Searching</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</client-only>
</template>

<script>
import {
  mapState,
  mapActions
} from "vuex";
export default {
  layout: "page",
  computed: {
    ...mapState("posts", ["posts"]),
  },

  data: () => {
    return {
      searchTerm: '',
    }
  },
  mounted() {
    let {
      criteria
    } = this.$route.query;
    if (criteria) {
      this.searchPosts({
        title: criteria
      });
      this.searchTerm = criteria
    }

  },
  methods: {
    getSlug(type, url) {
      const segments = new URL(url).pathname.split('/');
      const last = segments.pop() || segments.pop(); // Handle potential trailing slash
      if (type == 'post') {
        return `/blog/${last}`
      }
      if (type == 'page') {
        return `/${last}`
      }
      if (type == 'product') {
        return '/shop'
      }

    },
    ...mapActions({
      searchPosts: "posts/searchPosts",
    }),
  },
};
</script>

<style>

</style>
