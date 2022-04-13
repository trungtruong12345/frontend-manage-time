export const state = () => ({
  boardItem: {
    id: null,
    boardId: null,
    order: null,
    title: null,
    content: null,
    updated_at: null,
    created_at: null,
    tags: [],
    est: null,
  },
});

export const mutations = {
  UPDATE_VALUE(state, { key, value }) {
    state.boardItem[key] = value;
  },
  RESET_DATA(state) {
    state.boardItem.id = null
    state.boardItem.boardId = null
    state.boardItem.order = null
    state.boardItem.title = null
    state.boardItem.content = null
    state.boardItem.updated_at = null
    state.boardItem.tags = []
    state.boardItem.est = null
  }
};

export const actions = {
  async updateOrder(
    { dispatch },
    { id, boardId, boardItemBeforeId = null, boardItemAfterId = null }
  ) {
    const route = `board-items/${id}`;
    const body = { boardId, boardItemBeforeId, boardItemAfterId };
    const res = await dispatch("api/patch", { route, body }, { root: true });
    return res;
  },

  async createBoardItem(
    { dispatch, rootState, commit },
    { title, content = null, boardId = null, newIndex = 0 }
  ) {
    const { boards } = rootState.boards;
    let boardItemBeforeId = null;
    let boardItemAfterId = null;
    let board = {};
    let boardItems = [];
    const route = `board-items`;
    const body = {
      boardId,
      title,
      content,
      boardItemAfterId,
      boardItemBeforeId,
    };

    if (!boardId) {
      board = boards.find(
        (board) =>
          board.boardItems.filter(
            (item) => item.id === undefined || item.id === null
          ).length > 0
      );
      body.boardId = board.board_id;
      boardItems = board.boardItems;
    }

    if (newIndex == 0) {
      body.boardItemAfterId = boardItems[1]?.id || null;
      delete body.boardItemBeforeId;
    } else if (newIndex > 0) {
      body.boardItemBeforeId = boardItems[newIndex - 1].id;
      body.boardItemAfterId = boardItems[newIndex + 1]?.id || null;
    }
    const res = await dispatch("api/post", { route, body }, { root: true });

    if (!boardId && res.status) {
      const { content, title, id, order, created_at, updated_at, est } =
        res.data;
      for (let index = 0; index < boardItems.length; index++) {
        const boardItem = boardItems[index];
        if (boardItem.id === null) {
          boardItems[index] = {
            id,
            content: content,
            created_at: created_at,
            order: order,
            title: title,
            updated_at: updated_at,
            est: est,
            // boardId: body.boardId,
          };
          commit(
            "boards/UPDATE_BOARD_DETAILS",
            { board_id: body.boardId, data: board },
            { root: true }
          );
          break;
        }
      }
    }

    return res;
  },

  async showBoardItem({ commit, dispatch }, { id }) {
    const route = `board-items/${id}`;
    const res = await dispatch("api/get", { route }, { root: true });
    if (res.status) {
      const { data = {} } = res;
      commit("UPDATE_VALUE", { key: "id", value: data.id });
      commit("UPDATE_VALUE", { key: "order", value: data.order });
      commit("UPDATE_VALUE", { key: "title", value: data.title });
      commit("UPDATE_VALUE", { key: "content", value: data.content });
      commit("UPDATE_VALUE", { key: "boardId", value: data.boardId });
      commit("UPDATE_VALUE", { key: "tags", value: data.tags || [] });
      commit("UPDATE_VALUE", { key: "updated_at", value: data.updated_at });
      commit("UPDATE_VALUE", { key: "created_at", value: data.created_at });
      commit("UPDATE_VALUE", { key: "est", value: data.est });
    }
    return res;
  },

  async updateBoardItem({ commit, dispatch, state }) {
    const { id, title, content, order, boardId, tags, est } = state.boardItem;
    const route = `board-items/${id}`;
    const body = {
      title,
      content,
      order,
      boardId,
      est,
      tags: tags.map((tag) => tag.id),
    };
    return await dispatch("api/patch", { route, body }, { root: true });
  },

  async getCount({ dispatch }, { board_id }) {
    const route = `board-items/getCount?boardId=${board_id}`;
    return await dispatch("api/get", { route }, { root: true });
  },
};

export const getters = {
  boardItem: (state) => state.boardItem,
};
