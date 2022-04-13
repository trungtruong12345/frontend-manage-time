<template>
  <div class="search-todo">
    <input
      type="text"
      class="input--search mr-md-3"
      placeholder="Search"
      v-model="search"
    />

    <div class="btn--create-list" @click="onNewBoard">
      <i class="fa fa-plus-square-o" aria-hidden="true" title="Create list"></i>
    </div>
    <div class="btn--setting-list ml-md-3" @click="show">
      <i class="fa fa-cog" aria-hidden="true" title="Setting"></i>
    </div>

    <client-only>
      <modal name="modal--setting-lists-board" width="100%">
        <div class="setting-lists-board">
          <draggable tag="ul" :list="list" class="list-group" handle=".handle">
            <li
              class="list-group-item"
              v-for="(element, idx) in list.filter((i) => !i.delete)"
              :key="idx"
            >
              <i class="fa fa-bars handle" aria-hidden="true"></i>

              <input
                type="text"
                class="form-control ml-2 mr-2"
                v-model="element.name"
              />

              <i class="fa fa-times close" @click="removeAt(element.id)"></i>
            </li>
          </draggable>
          <div class="text-right mt-2">
            <button type="button" class="btn btn-primary" @click="updateBoards">
              Save
            </button>
          </div>
        </div>
      </modal>
    </client-only>
  </div>
</template>

<script>
import { mapMutations, mapActions } from "vuex";
import draggable from "vuedraggable";

export default {
  components: { draggable },
  data() {
    return {
      list: [],
      dragging: false,
    };
  },
  methods: {
    ...mapMutations({
      newBoard: "boards/NEW_BOARD",
      setSearch: "boards/SET_SEARCH",
    }),
    ...mapActions("boards", [
      "fetchBoardsAndBoardItems",
      "fetchBoards",
      "updateBoard",
      "deleteBoard",
    ]),
    onNewBoard() {
      new Promise((resolve, reject) => {
        resolve(this.newBoard());
      }).then(() => {
        const element = document.querySelector(
          ".project-details > .todos-list"
        );
        element.scrollLeft = element.scrollWidth - element.clientWidth;
      });
    },
    async show() {
      const id = this.$route.params.id;
      this.startLoading()
      const res = await this.fetchBoards({ projectId: id });
      this.stopLoading()
      const { data = [] } = res;
      this.list = data.map((item) => ({
        id: item.board_id,
        name: item.board_name,
        delete: false,
      }));
      this.$modal.show("modal--setting-lists-board");
    },
    hide() {
      this.$modal.hide("modal--setting-lists-board");
    },
    removeAt(id) {
      const element = this.list.find((item) => item.id == id);
      element.delete = true;
    },
    async updateBoards() {
      this.startLoading()
      const res = await this.list.map(async (item, index) => {
        if (item.delete) {
          return await this.deleteBoard({ board_id: item.id });
        } else {
          return await this.updateBoard({
            board_id: item.id,
            name: item.name,
            order: index,
          });
        }
      });

      let result = true;
      await Promise.all(res).then((values) => {
        values.map((value) => {
          if (!value.status) result = false;
        });
      });
      if (result) {
        this.hide();
        const projectId = this.$route.params.id;
        await this.fetchBoardsAndBoardItems({ projectId });
      }
      this.stopLoading()
    },
  },
  computed: {
    search: {
      get() {
        return this.$store.getters["boards/search"];
      },
      async set(val) {
        this.setSearch({ value: val });
        const projectId = this.$route.params.id;
        // this.startLoading()
        await this.fetchBoardsAndBoardItems({ projectId });
        // this.stopLoading()
      },
    },
  },
};
</script>
