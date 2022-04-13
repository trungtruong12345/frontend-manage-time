<template>
  <DetailsPage/>
</template>

<script>
import DetailsPage from "../../../components/notes/detailsPage.vue";
import { mapActions } from "vuex";

export default {
  components: { DetailsPage },
  layout: "home",
  // middleware: 'auth',
  methods: {
    ...mapActions('tags', ['fetchTags']),
  },
  async created() {
    this.startLoading()
    await this.fetchTags();
    this.stopLoading()
  }
};
</script>

<style lang="scss" scoped></style>
