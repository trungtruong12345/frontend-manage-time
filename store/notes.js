export const state = () => ({
  notes: [],
  totalPages: null,
  currentPage: null,
  noteDetails: null,
  search: '',
})

export const mutations = {
  CHANGE_PAGE_NUMBER(state, payload) {
    const { totalPages, currentPage } = payload;
    state.currentPage = currentPage;
    state.totalPages = totalPages;
  },
  FETCH_DATA(state, payload) {
    state.notes = payload.notes;
  },
  FETCH_NOTE_DETAILS(state, payload) {
    state.noteDetails = payload.noteDetails;
  },
  CHANGE_SEARCH_TEXT(state, payload) {
    state.search = payload.search
  }
}

export const actions = {
  async createNote({ commit, dispatch, state }, { title, content, tags }) {
    const route = "notes"
    const body = { title, content, tags }
    const res = await dispatch("api/post", { route, body }, { root: true })
    return res
  },

  async fetchData({ commit, dispatch, state }, { page, search = '', tags = [] }) {
    let route = new URL(`http://localhost:3004/notes?page=${page}`);
    if (!!search) route.searchParams.append('search', search);

    if (tags.length > 0) route.searchParams.append('tags', tags);
    route = route.href.replace('http://localhost:3004/', '');
    const res = await dispatch("api/get", { route }, { root: true })
    commit("FETCH_DATA", { notes: res.data.items });
    const { currentPage, totalPages } = res.data.meta;
    commit("CHANGE_PAGE_NUMBER", { currentPage, totalPages })
    commit("CHANGE_SEARCH_TEXT", { search })
    return res
  },

  async showNoteDetauls({ commit, dispatch, state }, { id }) {
    const route = `notes/${id}`;
    const res = await dispatch("api/get", { route }, { root: true })
    return res
  },

  async updateNoteDetails({ commit, dispatch, state }, { id, title, content, tags }) {
    const route = `notes/${id}`;
    const body = { title, content, tags }
    const res = await dispatch("api/put", { route, body }, { root: true });
    return res
  },

  async delete({ commit, dispatch, state }, { id }) {
    const route = `notes/${id}`;
    const res = await dispatch("api/delete", { route }, { root: true });
    let { currentPage } = state;
    // const { totalPages } = state;
    if (currentPage == null || currentPage == undefined) currentPage = 1;
    // if (totalPages < currentPage && currentPage > 1) currentPage--;
    await dispatch('fetchData', { page: currentPage })
    return res
  }
}

export const getters = {
  notes: (state) => state.notes,
  currentPage: (state) => state.currentPage,
  totalPages: (state) => state.totalPages,
  noteDetails: (state) => state.noteDetails
}
