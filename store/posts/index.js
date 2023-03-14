export const state = () => ({
  posts: [],
  loadingPosts: false
});
export const actions = {
  async searchPosts({ commit, state }, criteria) {
    commit("SET_LOADING", true);
    const { posts } = await this.$axios.$post(
      `${process.env.netlifyFunctionsUrl}/search-posts`,
      criteria,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (posts.length) {
      commit("SET_POSTS", posts);

    } else {
      commit("RESET_POSTS");
    }
    commit("SET_LOADING", false);
  },
};

export const mutations = {
  SET_LOADING: (state, payload) => {
    state.loadingPosts = payload;
  },
  SET_POSTS: (state, payload) => {
    state.posts = payload;
  },
  RESET_POSTS: (state) => {
    state.posts = [];
  },
};
