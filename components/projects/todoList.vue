<template>
  <div class="todos-list">
    <Board v-for="(board, index) in boards" :key="board.board_id || index" :board_id="board.board_id" :board="board"/>
  </div>
</template>

<script>
import Board from './board.vue'
import { mapGetters } from "vuex";

export default {
  components: { Board },
  computed: {
    ...mapGetters('boards', ['boards'])
  }
}
</script>
