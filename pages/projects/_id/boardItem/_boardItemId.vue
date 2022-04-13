<template>
  <BoardItemsDetails :id="id" />
</template>

<script>
import BoardItemsDetails from "~/components/boardItems/details";

export default {
  components: { BoardItemsDetails },
  layout: "home",
  data() {
    return {
      id: null,
    }
  },
  created() {
    this.id = this.$route.params['boardItemId']
  },
};
</script>

<style></style>
