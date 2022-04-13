<template>
  <div class="tag-details">
    <div class="form-group input">
      <input
        type="text"
        class="form-control"
        aria-describedby="helpId"
        placeholder="Tag name"
        v-model="name"
      />
    </div>
    <div class="form-group select">
      <select class="form-control" placeholder="Type of tag" v-model="tagType">
        <option value="0">Note</option>
        <option value="1">Kanban</option>
      </select>
    </div>
    <input
      type="color"
      class="form-control form-control-color"
      id="exampleColorInput"
      title="Choose your color"
      v-model="color"
    />
    <button type="button" class="btn btn-danger" @click="() => deleteTag({ uniq: tag.uniq })">
      <i class="fa fa-times" aria-hidden="true"></i>
    </button>
  </div>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  props: ["tag"],
  data() {
    return {
      name: "",
      tagType: "",
      color: "",
    };
  },
  methods: {
    ...mapMutations({
      updateTagDetails: "tags/UPDATE_TAG_DETAILS",
      deleteTag: 'tags/DELETE_TAG'
    }),
  },
  watch: {
    name(val) {
      const uniq = this.tag.uniq;
      this.updateTagDetails({
        uniq,
        key: "name",
        val,
      });
    },
    color(val) {
      const uniq = this.tag.uniq;
      this.updateTagDetails({
        uniq,
        key: "color",
        val,
      });
    },
    tagType(val) {
      const uniq = this.tag.uniq;
      this.updateTagDetails({
        uniq,
        key: "tagType",
        val,
      });
    },
  },
  created() {
    const { name, tagType, color } = this.tag;
    this.name = name;
    this.tagType = tagType;
    this.color = color;
  },
};
</script>

<style></style>
