<template>
  <DetailsPage :id="id" v-if="id"/>
</template>

<script>
import DetailsPage from '../../../components/notes/detailsPage.vue'
import { mapActions } from "vuex";

export default {
  components: { DetailsPage },
  layout: "home",
  // middleware: 'auth',
  data() {
    return {
      id: null,
    }
  },  
  methods: {
    ...mapActions('tags', ['fetchTags']),
  },
  async created() {
    this.startLoading()
    const { id } = this.$route.params
    this.id = parseInt(id);
    await this.fetchTags();
    this.stopLoading()
  }
};
</script>

<style lang="scss" scoped></style>
