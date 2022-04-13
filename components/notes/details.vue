<template>
  <div class="content note__content">
    <!-- Show -->
    <div :class="`show ${edit ? 'd-none' : ''}`">
      <div class="icon-edit" @click="edit = true" ref="icon-edit">
        <i class="fa fa-pencil-square" aria-hidden="true"></i>
        Edit
      </div>
      <div class="title">{{ title }}</div>
      <div class="edit-time d-flex">
        <i
          class="fa fa-clock-o d-flex align-items-center"
          aria-hidden="true"
        ></i>
        <div class="time ml-3" v-if="!!updatedAt">
          <Timeago :datetime="updatedAt" :auto-update="60" />
        </div>
      </div>
      <div class="tags d-flex align-items-center">
        <div
          class="tag mr-4"
          v-for="(tag, index) in tags"
          :key="index"
          :style="`color: ${tag.color}`"
        >
          {{ tag.name }}
        </div>
      </div>
      <div class="content__details ck-content" v-html="content"></div>
    </div>
    <!-- Edit -->
    <div :class="`content--edit ${edit ? '' : 'd-none'}`">
      <div
        class="text-right"
        role="button"
        @click="onBack"
        ref="btn-back-to-show"
      >
        <i class="fa fa-arrow-circle-left" aria-hidden="true"></i>
        Back
      </div>
      <div class="edit__title mt-3">
        <!-- <label for="">Write a title for the note</label> -->
        <input
          type="text"
          name=""
          id=""
          class="w-100"
          v-model="title"
          placeholder="Write a title for the note"
        />
      </div>
      <div class="edit__tags">
        <tags-input
          element-id="tags"
          :existing-tags="existingTags"
          v-model="tags"
          :typeahead="true"
          :only-existing-tags="true"
          :typeahead-hide-discard="true"
          id-field="id"
          text-field="name"
          placeholder="What are the tags of note ?"
        ></tags-input>
      </div>
      <div class="edit__details">
        <!-- <label for="">Content:</label> -->
        <Ckeditor
          v-model="content"
          :inputOptions="{
            placeholder: `Set note's content`,
          }"
        />
      </div>

      <div class="text-right mt-3">
        <button type="button" class="btn btn-primary" @click="onSubmitForm">
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import Ckeditor from "../share/ckeditor.vue";

const TagType = {
  Note: 0,
  BoardItem: 1,
};

export default {
  props: {
    id: Number,
  },
  components: { Ckeditor },
  data() {
    return {
      title: "",
      content: "",
      updatedAt: "",
      tags: [],
      edit: false,
    };
  },
  computed: {
    existingTags() {
      const tags = this.$store.getters["tags/tags"];
      return tags.filter((tag) => tag.tagType === TagType.Note);
    },
  },
  methods: {
    ...mapActions("notes", [
      "createNote",
      "showNoteDetauls",
      "updateNoteDetails",
    ]),
    // ...mapActions('tags', ['fetchTags']),
    async onSubmitForm() {
      this.startLoading();
      let res;
      const { title, content } = this;
      const tags = this.tags.map((tag) => tag.id);
      if (!this.id) {
        res = await this.createNote({ title, content, tags });
      } else {
        const { id, title, content } = this;
        res = await this.updateNoteDetails({ id, title, content, tags });
      }
      this.stopLoading();
      if (res.status) {
        window.$nuxt.$toast.success("Success!").goAway(2000);
        this.$router.push(`/notes/${res.data.id}`);
        if (this.$route.params?.id) {
          const { title, content, updated_at } = res.data;
          this.title = title;
          this.content = content;
          this.updatedAt = updated_at;
          this.edit = false;
        }
      }
    },
    async fetchNoteDetails(id) {
      const res = await this.showNoteDetauls({ id });
      if (res.status) {
        const { title, content, tags, updated_at } = res.data;
        this.title = title;
        this.content = content;
        this.tags = tags;
        this.updatedAt = updated_at;
      }
    },
    async onBack() {
      // this.startLoading()
      await this.fetchNoteDetails(this.id);
      // this.stopLoading()
      this.edit = false;
    },
  },
  async created() {
    if (!this.id) {
      // create or edit
      this.edit = true;
    } else {
      // show
      const { id } = this;
      if (this.$route.name === "notes-id-edit") this.edit = true;

      this.startLoading();
      await this.fetchNoteDetails(id);
      this.stopLoading();
    }
  },
  async mounted() {
    if (!this.id) this.$refs["btn-back-to-show"].classList.add("d-none");
  },
};
</script>

<style lang="scss" scoped>
.content {
  margin: 42px 304px;

  .title {
    font-family: "Poppins", Arial, sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 31px;
    line-height: 46px;
    color: #dfdddd;

    -webkit-line-clamp: 1;
    overflow: hidden;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    display: -webkit-box;
  }
  .edit-time {
    padding-bottom: 16px;
    border-bottom: 1px solid #2d2d2d;
    margin-top: 26px;
    i {
      color: #3471ff;
      width: 14px;
      height: 100%;
    }
    .time {
      font-family: "Nunito";
      font-style: normal;
      font-weight: 400;
      font-size: 13px;
      line-height: 18px;
      color: #ffffff;
    }
  }
  .tags {
    font-family: "Poppins", Arial, sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 13px;
    // line-height: 16px;
    color: #898989;
    margin-top: 10px;
    flex-wrap: wrap;
    .tag {
      cursor: pointer;
      overflow: hidden;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      display: -webkit-box;
      word-break: break-all;
      max-width: 87px;
    }
  }
  .content__details {
    margin-top: 22px;
    font-family: "Poppins", Arial, sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 15px;
    line-height: 18px;
    color: #ffffff !important;
  }
  .icon-edit {
    cursor: pointer;
    text-align: right;
    font-size: 17px;
  }
}
</style>
