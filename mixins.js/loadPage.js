import headMeta from '~/plugins/headMeta.js'
import formattedDate from "~/plugins/dateConvert.js";
export default {
  head() {
    if (this.post) {
      if (this.post.yoast_head_json) {
        const metaData = headMeta(this.post.yoast_head_json)
        return {
          title: this.post.title.rendered.replaceAll('&#8211;', '-'),
          meta: metaData
        }
      }
    }
  },
  methods: {
    formattedDate
  },
  computed: {
    darkMode() {
      if (this.post) {
        const darkMode = this.post.acf && this.post.acf.dark_background ? true : false
        return darkMode
      } else {
        return false
      }
    },
    featuredImage() {
      if (this.post) {
        let featuredImage = this.post.featured_media ? {
          src: '',
          sizes: this.post['_embedded']['wp:featuredmedia'][0].media_details.sizes,
          alt: this.post['_embedded']['wp:featuredmedia'][0].alt_text
        } : ''
        return featuredImage
      } else {
        return ''
      }
    },
    hideFeatured() {
      if (this.post) {
        const hideFeatured = this.post.acf && this.post.acf.hide_featured_image ? true : false
        return hideFeatured
      } else {
        return false
      }
    },
  },
  created() {
    this.$store.commit('nav/CLOSE_MENU')
    this.$nuxt.$emit('setPage', {
      featuredImage: this.featuredImage,
      darkMode: this.darkMode,
      hideFeatured: this.hideFeatured
    })
    if (process.client) {
      const bodyClass = document.querySelector('body').classList
      bodyClass.remove('overflow-hidden')
    }
  },
  async asyncData({
    params,
    payload,
    $axios,
    route
  }) {
    try {
      const isPost = route.name == 'blog-slug'
      if (payload) {
        return {
          post: payload
        }
      } else {
        //const slug = ''
        const wp = await $axios.get(
          `wp/v2/${isPost ? 'posts' : 'pages'}?slug=${params.slug ? params.slug : 'home'}&_embed`
        );
        const post = wp.data[0] || []
        return {
          post: post
        }
      }
    } catch (error) {
      console.log('generate error', error);
    }
  }
}
