import generateString from "../lib/generateString.js";
// uniq,
// name,
// tagType,
// color,
// id,

const DEFAULT_COLOR = `#3471ff`;

export const state = () => ({
  tags: [],
});

export const mutations = {
  FETCH_TAGS(state, { tags = [] }) {
    state.tags = tags?.map((tag) => {
      let color = tag.color || DEFAULT_COLOR;
      return {
        ...tag,
        color,
        uniq: generateString(10).trim(),
      };
    });
  },
  DELETE_TAG(state, { uniq }) {
    state.tags = [...state.tags.filter((tag) => tag.uniq !== uniq)];
  },
  ADD_TAG(state, { name, tagType, color }) {
    state.tags?.unshift({
      name,
      tagType,
      color: color || DEFAULT_COLOR,
      uniq: generateString(10).trim(),
    });
  },
  UPDATE_TAG_DETAILS(state, { uniq, key, val }) {
    const idx = state.tags.findIndex((tag) => tag.uniq === uniq);
    if (idx !== -1) {
      state.tags[idx][key] = val;
    }
  },
};

export const actions = {
  async fetchTags({ commit, dispatch, state }) {
    let route = `tags`;
    const res = await dispatch("api/get", { route }, { root: true });
    commit("FETCH_TAGS", { tags: res.data });
    return res;
  },
  async updateTags({ dispatch, state }) {
    const route = `tags/updateTags`;
    const body = state.tags.map((tag, idx) => {
      return {
        name: tag.name,
        color: tag.color,
        tagType: tag.tagType,
        id: tag.id,
        order: idx,
      }
    });
    const res = await dispatch("api/patch", { route, body }, { root: true });
    if (res.status) {
      await dispatch('fetchTags')
      window.$nuxt.$toast.success('Success').goAway(2000);
    }
    return res
  },
};

export const getters = {
  tags: (state) => state.tags,
};
