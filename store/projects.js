export const state = () => ({
  projects: [],
  // project: {},
})

export const mutations = {
  FETCH_PROJECTS(state, payload) {
    state.projects = payload.projects;
  },
}

export const actions = {
  async fetchProjects({ commit, dispatch }) {
    const route = 'projects';
    const res = await dispatch("api/get", { route }, { root: true })
    commit("FETCH_PROJECTS", { projects: res.data });
    return res
  },
  async createNewProject({ commit, dispatch }, { name, order }) {
    const route = 'projects';
    const body = { name, order };
    const res = await dispatch("api/post", { route, body }, { root: true })
    return res
  },
  async deleteProject({ dispatch }, { id }) {
    const route = `projects/${id}`;
    const res = await dispatch("api/delete", { route }, { root: true })
    return res
  },
  async updateProject({ dispatch }, { id, name, order }) {
    const route = `projects/${id}`;
    const body = {
      name, order
    }
    const res = await dispatch("api/patch", { route, body }, { root: true })
    return res
  }
}

export const getters = {
  projects: state => state.projects
}
