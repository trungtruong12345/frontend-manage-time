export const state = () => ({
  boards: [],
  search: "",
});

export const mutations = {
  FETCH_BOARDS(state, payload) {
    state.boards = payload;
  },
  UPDATE_BOARD_DETAILS(state, { board_id, data }) {
    const newBoards = [...state.boards];
    const index = state.boards.findIndex((board) => board.board_id == board_id);
    if (index !== -1) {
      newBoards[index] = data;
      state.boards = newBoards;
    }
  },
  NEW_BOARDITEM(state, { board_id }) {
    state.boards.map(function (board) {
      let { boardItems = [] } = board;
      boardItems.map(function (item, index) {
        const { id } = item;
        if (id == null) {
          delete boardItems[index];
        }
      });
      board.boardItems = boardItems.filter((n) => n);
    });

    if (!board_id) return;

    const board = state.boards.find((item) => item.board_id == board_id);
    const { boardItems = [] } = board;
    boardItems.unshift({
      created_at: null,
      id: null,
      boardId: board_id,
    });
  },
  NEW_BOARD(state) {
    const { boards } = state;
    if (boards.length > 0 && !boards[boards.length - 1]?.board_id) {
      boards.pop();
      state.boards = boards;
      return;
    }
    state.boards.push({ board_id: null, board_name: null });
  },
  CREATE_NEW_BOARD(
    state,
    {
      boardItems = [],
      board_created_at,
      board_id,
      board_name,
      board_projectId,
      board_updated_at,
    }
  ) {
    const { boards } = state;
    if (boards.length > 0 && !boards[boards.length - 1]?.board_id) {
      boards.pop();
      boards.push({
        boardItems,
        board_created_at,
        board_updated_at,
        board_id,
        board_name,
        board_projectId,
      });
      state.boards = boards;
      return;
    }
  },
  ADD_BOARDITEMS(state, { board_id, data = [] }) {
    const boards = [...state.boards];
    const board = boards.find((item) => item.board_id == board_id);
    const { boardItems = [] } = board;
    data.forEach(function (item) {
      if (!boardItems.find((localItem) => localItem.id == item.id)) {
        boardItems.push(item);
      }
    });
    state.boards = boards;
  },
  SET_SEARCH(state, { value }) {
    state.search = value;
  },
  UPDATE_NAME_BOARD(state, { board_id, name }) {
    const boards = [...state.boards];
    const board = boards.find((item) => item.board_id == board_id);
    board.board_name = name;
    state.boards = boards;
  },
};

export const actions = {
  async fetchBoards({ dispatch }, { projectId }) {
    const route = `boards?projectId=${projectId}`;
    const res = await dispatch("api/get", { route }, { root: true });
    await dispatch('updateCountBoardItems')
    return res;
  },

  async fetchBoardsAndBoardItems({ commit, dispatch, state }, { projectId }) {
    const res = await this.dispatch("boards/fetchBoards", { projectId });
    const { data = [], status = false } = res;
    if (status) {
      const boards = await data.map(async (item) => {
        if (!item.board_id) return;

        const routeGetBoardItems = `board-items?boardId=${item.board_id}&search=${state.search}`;
        const boardItems = await dispatch(
          "api/get",
          { route: routeGetBoardItems },
          { root: true }
        );
        return {
          ...item,
          boardItems: boardItems.data,
        };
      });
      await Promise.all(boards).then((values) => {
        commit("FETCH_BOARDS", values);
      });
      await dispatch('updateCountBoardItems')
    }
    return res;
  },

  async updateOrderOFBoardItem({ state, dispatch }, { id, newIndex }) {
    const board = state.boards.find(
      (board) => board.boardItems.filter((item) => item.id == id).length > 0
    );
    const { board_id, boardItems } = board;
    if (newIndex == 0) {
      const boardItemAfterId = boardItems[1]?.id || null;
      await dispatch(
        "boardItem/updateOrder",
        { id, boardId: board_id, boardItemAfterId },
        { root: true }
      );
    } else if (newIndex > 0) {
      const boardItemBeforeId = boardItems[newIndex - 1].id;
      const boardItemAfterId = boardItems[newIndex + 1]?.id || null;
      await dispatch(
        "boardItem/updateOrder",
        {
          id,
          boardId: board_id,
          boardItemBeforeId,
          boardItemAfterId,
        },
        { root: true }
      );
    }
    await dispatch('updateCountBoardItems')
  },

  async createNewBoard({ commit, dispatch, state }, { name, projectId }) {
    const route = "boards";
    const order = state.boards.filter(item => item.board_id).length + 1
    const body = {
      name,
      projectId,
      order
    };
    const res = await dispatch("api/post", { route, body }, { root: true });
    if (res.status) {
      const { id, name, created_at, updated_at, projectId } = res.data;
      commit("CREATE_NEW_BOARD", {
        board_created_at: created_at,
        board_id: id,
        board_name: name,
        board_projectId: projectId,
        board_updated_at: updated_at,
      });
    }
    await dispatch('updateCountBoardItems')
  },

  async loadMoreBoardItems(
    { commit, dispatch, state },
    { boardId, boardItemBeforeId }
  ) {
    const routeGetBoardItems = `board-items?boardId=${boardId}&boardItemBeforeId=${boardItemBeforeId}&search=${state.search}`;
    const boardItems = await dispatch(
      "api/get",
      { route: routeGetBoardItems },
      { root: true }
    );
    if (boardItems.status) {
      const { data = [] } = boardItems;
      if (data.length === 0) return;

      commit("ADD_BOARDITEMS", { board_id: boardId, data });
    }
  },

  async updateBoard({ commit, dispatch }, { board_id, name, order = null }) {
    const route = `boards/${board_id}`;
    const body = {
      name,
    };

    if (order !== null) body.order = order;

    const res = await dispatch("api/patch", { route, body }, { root: true });
    if (res.status) {
      commit("UPDATE_NAME_BOARD", { board_id, name });
    }
    return res;
  },

  async deleteBoard({ dispatch }, { board_id }) {
    const route = `boards/${board_id}`;
    const res = await dispatch("api/delete", { route }, { root: true });
    return res;
  },

  async updateCountBoardItems({ state, dispatch, commit }) {
    await state.boards.forEach(async (board) => {
      if (!board.board_id) return;

      const res = await dispatch(
        "boardItem/getCount",
        { board_id: board.board_id },
        { root: true }
      );
      if (res.status) {
        commit("UPDATE_BOARD_DETAILS", {
          board_id: board.board_id,
          data: {...board, countBoardItems: res.data},
        });
      }
    });
  },
};

export const getters = {
  boards: (state) => state.boards,
  getBoardItems: (state) => (board_id) =>
    state.boards.find((board) => board.board_id == board_id)?.boardItems,
  search: (state) => state.search,
};
