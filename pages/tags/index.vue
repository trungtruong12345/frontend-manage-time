<template>
  <div class="edit-tags-screen">
    <div class="form-edit">
      <div class="form-header">Edit tags</div>

      <div class="list-tags">
        <div class="action">
          <button
            type="button"
            class="btn btn-primary btn-new-tags w-100 mb-12"
            @click="() => addTag({ name: null, color: null, tagType: 0 })"
          >
            <i class="fa fa-plus" aria-hidden="true"></i>
          </button>
          <button
            type="button"
            class="btn btn-warning ml-2"
            @click="onFetchTags"
          >
            <i class="fa fa-refresh" aria-hidden="true"></i>
          </button>
          <button
            type="button"
            class="btn btn-success ml-2"
            @click="onUpdateTags"
          >
            Save
          </button>
        </div>
        <Row v-for="tag in tags" :key="tag.uniq" :tag="tag" />
      </div>
    </div>
  </div>
</template>

<script>
import Row from "../../components/tags/row.vue";
import { mapGetters, mapActions, mapMutations } from "vuex";

export default {
  layout: "home",
  components: { Row },
  methods: {
    ...mapActions("tags", ["fetchTags", "updateTags"]),
    ...mapMutations({
      addTag: "tags/ADD_TAG",
    }),
    onFetchTags() {
      this.startLoading();
      this.fetchTags();
      this.stopLoading();
    },
    async onUpdateTags() {
      this.startLoading();
      await this.updateTags();
      this.stopLoading();
    },
  },
  computed: {
    ...mapGetters("tags", ["tags"]),
  },
  created() {
    this.onFetchTags();
  },
};
</script>

<style></style>
