<template>
  <modal :name="name" width="100%">
    <div class="content">
      <div class="form-group">
        <input
          type="text"
          class="form-control"
          placeholder="What do you want to do ?"
          v-model="title"
        />
      </div>

      <div class="form-group">
        <textarea
          class="form-control"
          rows="10"
          placeholder="Some notes"
          v-model="content"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="">EST:</label>
        <DatePicker
          v-model="est"
          type="datetime"
          :disabled-date="disabledBeforeToday"
          :disabled-time="disabledBeforeTime"
        />
      </div>

      <div class="btn-action d-flex align-items-center justify-content-end">
        <button type="button" class="btn btn-warning mr-3" @click="onDelete" v-if="initialId">
          Delete
        </button>
        <button
          type="button"
          class="btn btn-primary"
          @click="
            () => {
              initialId ? onUpdate() : onCreateTodo();
            }
          "
        >
          Save
        </button>
      </div>
    </div>
  </modal>
</template>

<script>
import { mapActions } from "vuex";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";

export default {
  components: { DatePicker },
  props: {
    initialId: {
      type: String,
      default: null,
    },
    initialTitle: {
      type: String,
      default: null,
    },
    initialEst: {
      default: null,
    },
    initialContent: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      default: null
    },
  },
  data() {
    return {
      title: null,
      content: null,
      est: null,
      timeLeft: null,
    };
  },
  methods: {
    ...mapActions("pomodoro", ["updateTodo", "deleteTodo", "createTodo"]),
    initData() {
      const { initialTitle, initialEst, initialContent } = this;
      this.title = initialTitle;
      this.content = initialContent;
      if (initialEst) this.est = new Date(initialEst);
    },
    async onUpdate() {
      const id = this.initialId;
      const { title, content, est, name } = this;
      if (!title) return window.$nuxt.$toast.error("Need title!").goAway(2000);

      const today = new Date();
      if (est && today >= new Date(est)) {
        return window.$nuxt.$toast
          .error("Est must be greater than the current time!")
          .goAway(2000);
      }

      await this.updateTodo({ id, title, content, est });
      this.$modal.hide(name);
    },
    async onDelete() {
      const id = this.initialId;
      await this.deleteTodo({ id });
      this.$modal.hide(this.name);
    },
    async onCreateTodo() {
      const { title, content, est } = this;
      if (!title) return window.$nuxt.$toast.error("Need title!").goAway(2000);

      const today = new Date();
      if (est && today >= new Date(est)) {
        return window.$nuxt.$toast
          .error("Est must be greater than the current time!")
          .goAway(2000);
      }

      await this.createTodo({ title, content, est });
      this.$modal.hide(this.name);
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
  mounted() {
    this.initData();
  },
};
</script>

<style></style>
