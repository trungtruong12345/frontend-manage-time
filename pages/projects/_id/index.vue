<template>
  <div class="project-details w-100 h-100">
    <SearchField />
    <TodoList />
  </div>
</template>

<script>
import SearchField from "../../../components/projects/searchField.vue";
import TodoList from "../../../components/projects/todoList.vue";
import { mapActions, mapMutations } from "vuex";
import $ from "jquery";

export default {
  layout: "home",
  components: { SearchField, TodoList },
  data() {
    return {
      id: null,
    };
  },
  methods: {
    ...mapActions("boards", ["fetchBoardsAndBoardItems"]),
    ...mapMutations({
      newBoardItems: "boards/NEW_BOARDITEM",
    }),
  },
  async created() {
    this.startLoading()
    this.id = this.$route.params.id;
    const { id } = this;
    await this.fetchBoardsAndBoardItems({ projectId: id });
    this.stopLoading()
  },
  mounted() {
    const { newBoardItems } = this;
    $(document).click(function (e) {
      const target = $(e.target);
      if (
        target.parents('img[alt="Add new todo"]').length < 1 &&
        target.parents(".boardItemId_null").length < 1 &&
        !target.hasClass("boardItemId_null") &&
        target.attr("alt") != "Add new todo"
      ) {
        newBoardItems({})
      }
    });
  },
};
</script>

<style></style>
