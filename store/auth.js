export const state = () => ({
  user_id: "",
  token: "",
  username: "",
  email: "",
});

export const mutations = {
  AUTH_SUCCESS(state, payload) {
    state.token = `${payload.access_token}`;
    state.username = payload.username;
  },
  UPDATE_DATA(state, { key, val }) {
    state[key] = val;
  },
};

export const actions = {
  logout({ commit }) {
    commit("UPDATE_DATA", {
      key: "username",
      val: null,
    });
    commit("UPDATE_DATA", {
      key: "token",
      val: null,
    });
    commit("UPDATE_DATA", {
      key: "email",
      val: null,
    });
    this.$cookies.removeAll();
  },
  async register({ commit, dispatch, state }, { email, password, username }) {
    const route = "users";
    const body = { email, password, username };
    const res = await dispatch("api/post", { route, body }, { root: true });
    return res;
  },
  async activeUser({ commit, dispatch, state }, { email, confirmCode }) {
    const route = "users/active";
    const body = { email, confirmCode };
    const res = await dispatch("api/post", { route, body }, { root: true });
    return res;
  },
  async login({ commit, dispatch, state }, { username, password }) {
    const route = "auth/login";
    const body = { username, password };
    const res = await dispatch("api/post", { route, body }, { root: true });
    if (res.status == true) {
      commit("AUTH_SUCCESS", { username, ...res.data });
      this.$cookies.set("username", `${username}`, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
      this.$cookies.set("token", `${res.data.access_token}`, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }
    return res;
  },
  async loginBySocial({ dispatch, commit }, { access_token, social }) {
    let res = {};
    if (social === "google") {
      const route = "auth/google";
      const body = { access_token };
      res = await dispatch("api/post", { route, body }, { root: true });
    }

    if (res.status == true) {
      commit("AUTH_SUCCESS", { ...res.data });
      this.$cookies.set("username", `${res?.data?.username}`, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      this.$cookies.set("token", `${res.data.access_token}`, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }
    return res?.data?.access_token
  },
  async reSendMailConfirmCode({ commit, dispatch, state }, { email }) {
    const route = "users/reSendConfirmCode";
    const body = { email };
    const res = await dispatch("api/post", { route, body }, { root: true });
    return res;
  },
  async changePassword(
    { commit, dispatch, state },
    { confirmCode, username, password, id }
  ) {
    const route = "users/changePassword";
    const body = { confirmCode, username, password, id };
    const res = await dispatch("api/post", { route, body }, { root: true });
    return res;
  },
  async updateDeviceToken({ commit, dispatch, state }, { token }) {
    const route = "users/updateDeviceToken";
    const body = { token };
    const res = await dispatch("api/post", { route, body }, { root: true });
    return res;
  },
  async pushNotiForMe({ dispatch }, { title, content, link = null }) {
    const route = "users/pushNotiForMe";
    const body = { title, body: content, link };
    const res = await dispatch("api/post", { route, body }, { root: true });
    return res;
  },
};

export const getters = {
  token: (state) => state.token,
  email: (state) => state.email,
  username: (state) => state.username,
};
