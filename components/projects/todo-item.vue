<template>
  <div
    :class="`todo__item list-group-item boardItemId_${todo.id}`"
    :boardItemId="todo.id"
    @click="() => redirectToDetails(todo.id)"
  >
    <div class="item--title">
      <template v-if="todo.id">
        {{ todo.title }}
      </template>
      <template v-else>
        <input type="text" class="" placeholder="Title" v-model="title" />
      </template>
    </div>
    <div class="item--content" v-html="todo.content"></div>
    <div class="item--tags" v-if="todo.id">
      <div
        class="tag"
        v-for="(tag, index) in todo.tags"
        :key="index"
        :style="`border-color: ${tag.color}; color: ${tag.color}`"
      >
        {{ tag.name }}
      </div>
    </div>
    <div class="item-est" v-if="todo.est && timeLeft">
      {{ timeLeft }} <i class="fa fa-clock-o" aria-hidden="true"></i>
    </div>
    <div class="text-right" v-if="!todo.id">
      <button
        type="button"
        class="btn btn-primary"
        @click="$emit('createBoardItem', { title })"
      >
        <i class="fa fa-external-link" aria-hidden="true"></i>
      </button>
    </div>
  </div>
</template>

<script>
import getColor from "../../lib/getColorByKeyword";

export default {
  props: ["todo"],
  data() {
    return {
      title: null,
      timeLeft: null,
      IntervalId: null,
    };
  },
  methods: {
    getColor,
    redirectToDetails(id) {
      if (id === null) return;

      const projectId = this.$route.params.id;
      this.$router.push(`/projects/${projectId}/boardItem/${id}`);
    },
    updateTimeLeft(datetime) {
      clearInterval(this.IntervalId);
      if (!datetime) {
        this.timeLeft = null;
        return;
      }

      var countDownDate = new Date(datetime).getTime();
      // Update the count down every 1 second
      this.IntervalId = setInterval(() => {
        // Get today's date and time
        var now = new Date().getTime();

        // Find the distance between now and the count down date
        var distance = countDownDate - now;

        // Time calculations for days, hours, minutes and seconds
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        this.timeLeft = "";
        if (days) this.timeLeft += `${days}d `;
        if (days || hours) this.timeLeft += `${hours}h `;
        if (days || hours || minutes) this.timeLeft += `${minutes}m `;
        this.timeLeft += `${seconds}s`;
        // If the count down is over, write some text
        if (distance < 0) {
          clearInterval(this.IntervalId);
          this.timeLeft = "EXPIRED";
        }
      }, 1000);
    },
  },
  created() {
    const { est } = this.todo;
    if (est) this.updateTimeLeft(est);
  },
  destroyed() {
    clearInterval(this.IntervalId);
  },
  updated() {
    const { est } = this.todo;
    if (est) this.updateTimeLeft(est);
  },
};
</script>

<style lang="scss" scoped>
input {
  background-color: #5c5b62;
  border-radius: 3px;
  color: #ffffff;
  border: 0px;
  outline: unset !important;
  padding: 2.1px 7px;
  font-size: 17px;
  font-weight: 400;
}
</style>
