<template>
  <div class="boardItem-details d-flex flex-nowrap w-100">
    <div class="overflow-y-scroll w-100 maxh-94">
      <BBreadcrumb :items="breadcrumb"></BBreadcrumb>
      <!-- Edit -->
      <div :class="`details--edit ${edit ? '' : 'd-none'}`">
        <div class="text-right mb-3" rule="button" @click="edit = false">
          <i
            data-v-f2a0dc6e=""
            aria-hidden="true"
            class="fa fa-arrow-circle-left"
          ></i>
          Back
        </div>

        <div class="form-group group-title">
          <input
            type="text"
            class="form-control"
            name=""
            id=""
            aria-describedby="helpId"
            placeholder="Write a title for the task"
            v-model="title"
          />
        </div>

        <div class="group-est">
          <DatePicker
            v-model="est"
            type="datetime"
            :disabled-date="disabledBeforeToday"
            :disabled-time="disabledBeforeTime"
            placeholder="Estimated time"
          />
        </div>

        <tags-input
          element-id="tags"
          :existing-tags="existingTags"
          :typeahead="true"
          :only-existing-tags="true"
          :typeahead-hide-discard="true"
          id-field="id"
          text-field="name"
          class="group-tags w-100"
          v-model="tags"
          placeholder="What are the tags of todo ?"
        ></tags-input>

        <div class="group-content mb-4">
          <!-- <label for="">Content:</label> -->
          <Ckeditor
            v-model="content"
            :inputOptions="{
              placeholder: `Set todo's content`,
            }"
          />
        </div>

        <div class="text-right pb-4">
          <button
            type="button"
            class="btn btn-primary"
            @click="onUpdateBoardItem"
          >
            Save
          </button>
        </div>
      </div>
      <!-- Show -->
      <div :class="`details--show ${edit ? 'd-none' : ''}`">
        <div class="text-right mb-2" rule="button" @click="edit = true">
          <i
            data-v-f2a0dc6e=""
            aria-hidden="true"
            class="fa fa-pencil-square"
          ></i>
          Edit
        </div>

        <div class="title">{{ title }}</div>

        <div class="updated-at">
          <i
            data-v-f2a0dc6e=""
            aria-hidden="true"
            class="fa fa-clock-o d-flex align-items-center mr-2"
          ></i>
          <Timeago :datetime="updated_at" :auto-update="60" />
        </div>

        <div class="tags d-flex align-items-center">
          <div
            class="tag mr-4"
            v-for="(tag, index) in boardItem.tags"
            :key="index"
            :style="`color: ${tag.color}`"
          >
            {{ tag.name }}
          </div>
        </div>

        <div class="content ck-content" v-html="content"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import Ckeditor from "../share/ckeditor.vue";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import { BBreadcrumb } from "bootstrap-vue";

const TagType = {
  Note: 0,
  BoardItem: 1,
};

export default {
  components: { Ckeditor, DatePicker, BBreadcrumb },
  props: {
    id: {
      type: String,
    },
  },
  data() {
    return {
      edit: false,
      tags: [],
    };
  },
  methods: {
    ...mapActions("boardItem", ["showBoardItem", "updateBoardItem"]),
    ...mapActions("tags", ["fetchTags"]),
    ...mapActions("breadcrumb", ["updateBreadcrumb"]),
    ...mapMutations({
      updateValue: "boardItem/UPDATE_VALUE",
      resetData: "boardItem/RESET_DATA",
    }),
    async fetchData() {
      const { id } = this;
      await this.showBoardItem({ id });
    },
    async onUpdateBoardItem() {
      this.startLoading();
      const res = await this.updateBoardItem();
      this.stopLoading();
      if (res.status) {
        window.$nuxt.$toast.success("Success").goAway(2000);
        this.edit = false;
      }
    },
    disabledBeforeToday(date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date < today;
    },
    disabledBeforeTime(date) {
      const today = new Date();
      return date < today;
    },
  },
  computed: {
    ...mapGetters("boardItem", ["boardItem"]),
    // ...mapGetters("breadcrumb", ["breadcrumb"]),
    breadcrumb() {
      const lists = this.$store.getters['breadcrumb/breadcrumb']
      console.log(lists);
      const idx = lists.findIndex(path => path.text === "boardItem");
      if (idx !== -1) {
        lists[idx].active = true
      }
      
      return lists
    },
    title: {
      get() {
        return this.boardItem.title;
      },
      set(val) {
        this.updateValue({ key: "title", value: val });
      },
    },
    content: {
      get() {
        return this.boardItem.content;
      },
      set(val) {
        this.updateValue({ key: "content", value: val });
      },
    },
    est: {
      get() {
        return this.boardItem.est ? new Date(this.boardItem.est) : null;
      },
      set(val) {
        this.updateValue({ key: "est", value: val });
      },
    },
    updated_at() {
      return this.boardItem.updated_at;
    },
    existingTags() {
      const tags = this.$store.getters["tags/tags"];
      return tags.filter((tag) => tag.tagType === TagType.BoardItem);
    },
  },
  watch: {
    edit(val) {
      if (!val) {
        this.fetchData();
      }
    },
    tags(val) {
      this.updateValue({ key: "tags", value: [...val] });
    },
  },
  async created() {
    this.startLoading();
    await this.fetchData();
    this.tags = this.boardItem.tags;
    await this.fetchTags();
    this.stopLoading();
    this.updateBreadcrumb({ fullPath: this.$route.fullPath });
  },
  beforeDestroy() {
    this.resetData();
  },
};
</script>

<style></style>
