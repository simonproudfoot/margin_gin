const baseHref = process.env.BASE_URL || "/";
import axios from "axios";
export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: "static",
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: "Margin",
    htmlAttrs: {
      lang: "en",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
      { name: "format-detection", content: "telephone=no" },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },
  axios: {
    baseURL: baseHref + "/wp-json/", // Used as fallback if no runtime config is provided
  },
  env: {
    baseUrl: process.env.BASE_URL,
    netlifyFunctionsUrl: process.env.NETFLIFY_FUNCTION_URL,
    wooUser: process.env.WOO_USER,
    wooSecret: process.env.WOO_SECRET,
    stripePublishKey: process.env.STRIPE_PUBLISHABLE_KEY,
    stripeAccount: process.env.STRIPE_ACCOUNT,
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    paypalClientId: process.env.PAYPAL_CLIENT_ID,
  },
  css: ["~/assets/css/main.css"],
  generate: {
    fallback: "404.html",
    routes: async function () {
      const pages = await axios.get(
        baseHref + "/wp-json/wp/v2/pages?_embed&per_page=100"
      );
      const pageRoutes = pages.data.map((page) => {
        return {
          route: "/" + page.slug,
          payload: page,
        };
      });
      const posts = await axios.get(
        baseHref + "/wp-json/wp/v2/posts?_embed&per_page=100"
      );
      const postRoutes = posts.data.map((post) => {
        console.log("post render", post.title.rendered);
        return {
          route: "/blog/" + post.slug,
          payload: post,
        };
      });

      let allRoutes = [...pageRoutes, ...postRoutes];

      return allRoutes;
    },
  },
  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    "~/plugins/data.server.js",
    "~/plugins/persistedState.client.js",
    { src: "~/plugins/filters.js", ssr: false },
  ],
  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,
  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: ["nuxt-gsap-module"],
  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ["@nuxtjs/axios", "@nuxtjs/tailwindcss"],
  build: {
    extend(config, { isClient }) {
      // Extend only webpack config for client-bundle
      if (isClient) {
        config.devtool = "source-map";
      }
    },
  },
};
