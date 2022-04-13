<template>
  <div :class="`board board-id-${board_id}`">
    <div class="board__header">
      <template v-if="edit">
        <input
          type="text"
          class="mw-79per h-100"
          name="new-name"
          ref="new_name"
          placeholder="Name"
          v-model="name"
        />
        <button
          type="button"
          class="btn btn-primary p-1"
          @click="onUpdateBoardName"
        >
          <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
        </button>
        <button type="button" class="btn btn-warning p-1" @click="edit = false">
          <i class="fa fa-external-link" aria-hidden="true"></i>
        </button>
      </template>
      <template v-else-if="board_id">
        <div class="mw-76per">
          <div class="board--name" :style="`color: ${getColor(board.board_name[0])}`"><span>{{ board.board_name }}</span></div>
          <div class="board--total-todos">
            {{ board.countBoardItems }}
          </div>
        </div>

        <div class="board--btn">
          <img
            src="/images/add-new-todo.png"
            alt="Add new todo"
            @click="onNewBoardItem"
          />
          <img src="/images/setting.png" alt="Setting" @click="edit = true" />
        </div>
      </template>
      <template v-else>
        <input
          type="text"
          class="h-100 mr-2 w-100"
          name="name"
          placeholder="Name"
          v-model="name"
        />
        <button
          type="button"
          class="btn btn-primary p-1"
          @click="() => createNewBoard({ name, projectId: $route.params.id })"
        >
          Add
        </button>
      </template>
    </div>

    <draggable
      class="board__todo-items list-group"
      group="board"
      v-bind="dragOptions"
      v-model="boardItems"
      @start="checkStart"
      @end="checkEnd"
      v-if="board_id"
      :ref="`board-id-${board_id}`"
    >
      <template>
        <todo-item
          v-for="(todo, index) in boardItems"
          :key="index"
          :todo="todo"
          @createBoardItem="onCreateBoardItem"
        />
      </template>
    </draggable>
  </div>
</template>

<script>
import todoItem from "./todo-item.vue";
import draggable from "vuedraggable";
import { mapActions, mapGetters, mapMutations } from "vuex";
import getColor from '../../lib/getColorByKeyword';

export default {
  props: ["board_id", "board"],
  data() {
    return {
      name: "",
      newIndex: 0,
      edit: false,
    };
  },
  components: { todoItem, draggable },
  methods: {
    getColor,
    ...mapMutations({
      updateBoardDetails: "boards/UPDATE_BOARD_DETAILS",
      newBoardItems: "boards/NEW_BOARDITEM",
    }),
    ...mapActions("boards", [
      "updateOrderOFBoardItem",
      "createNewBoard",
      "loadMoreBoardItems",
      "updateBoard",
    ]),
    ...mapActions("boardItem", ["createBoardItem"]),
    onNewBoardItem() {
      this.newIndex = 0;
      const { board_id } = this;
      this.newBoardItems({ board_id });
      this.$refs[`board-id-${board_id}`].$el.scrollTop = 0;
    },
    async checkEnd(e) {
      const { clone, newIndex } = e;
      const id = clone.attributes.boarditemid?.value;
      this.newIndex = newIndex;
      if (id === undefined) {
        return;
      }
      this.startLoading()
      await this.updateOrderOFBoardItem({ id, newIndex });
      this.stopLoading()
    },
    async checkStart(e) {
      const { clone } = e;
      const id = clone.attributes.boarditemid?.value;
      if (id !== undefined) {
        this.newBoardItems({});
      }
    },
    async onCreateBoardItem(e) {
      const { title } = e;
      const { newIndex } = this;
      this.startLoading()
      await this.createBoardItem({ title, newIndex });
      this.stopLoading()
    },
    async onUpdateBoardName() {
      this.startLoading()
      const name = this.$refs["new_name"].value;
      const { board_id } = this;
      const res = await this.updateBoard({ name, board_id });
      this.stopLoading()
      if (res.status) this.edit = false;
    },
  },
  computed: {
    ...mapGetters("boards", ["boards", "getBoardItems"]),
    boardItems: {
      get() {
        return this.getBoardItems(this.board_id);
      },
      set(boardItems) {
        const { board_id, board } = this;
        return this.updateBoardDetails({
          board_id,
          data: {
            ...board,
            boardItems,
          },
        });
      },
    },
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost",
      };
    },
  },
  watch: {
    edit(val) {
      const { board_id = null } = this;
      if (!board_id) return;

      if (val) this.name = this.board.board_name;
    },
  },
  async mounted() {
    const { board_id = null } = this;
    if (!board_id) return;

    this.name = this.board.board_name;

    const { loadMoreBoardItems } = this;
    await this.$refs[`board-id-${board_id}`]?.$el?.addEventListener(
      "scroll",
      async (event) => {
        var element = event.target;
        if (element.scrollHeight - element.scrollTop === element.clientHeight) {
          const { boardItems = [] } = this;
          if (!boardItems || boardItems.length === 0) return;

          const lastItem = boardItems[boardItems.length - 1];
          if (!lastItem?.id) return;

          await loadMoreBoardItems({
            boardId: board_id,
            boardItemBeforeId: lastItem.id,
          });
        }
      }
    );
  },
};
</script>

<style></style>
