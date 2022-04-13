<template>
  <div class="todo">
    <div class="title">{{ todo.title }}</div>
    <div class="est d-flex align-items-center justify-content-between">
      <div :class="`timeleft ${todo.est ? '' : 'invisible'}`" role="button">
        <i class="fa fa-clock-o" aria-hidden="true"></i>
        {{ timeLeft }}
      </div>
      <div
        class="btn-show-details"
        role="button"
        @click="$modal.show(`todo-details-${todo.id}`)"
      >
        <i class="fa fa-file-text" aria-hidden="true"></i>
      </div>
    </div>
    <client-only>
      <ModalTodo
        :initialContent="todo.content"
        :initialTitle="todo.title"
        :initialEst="todo.est"
        :initialId="todo.id"
        :name="`todo-details-${todo.id}`"
      />
    </client-only>
  </div>
</template>

<script>
import ModalTodo from "./modalTodo.vue";

export default {
  components: {
    ModalTodo,
  },
  props: ["todo"],
  data() {
    return {
      timeLeft: null,
      IntervalId: null,
    };
  },
  methods: {
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
  updated() {
    if (this.todo.est) this.updateTimeLeft(this.todo.est);
  },
  mounted() {
    this.updateTimeLeft(this.todo?.est);
  },
  beforeDestroy() {
    if (this.IntervalId) clearInterval(this.IntervalId);
  },
};
</script>

<style></style>
