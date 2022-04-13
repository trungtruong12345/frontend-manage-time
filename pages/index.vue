<template>
  <Fragment>
    <Project v-if="$cookies.get('username')" />
    <Pomodoro v-else />
  </Fragment>
</template>

<script>
import Project from "./projects/index.vue";
import Pomodoro from "./pomodoro-timer/index.vue";
import { Fragment } from "vue-fragment";

export default {
  components: { Project, Pomodoro, Fragment },
  layout(context) {
    if (context.$cookies.get("username")) {
      return "home";
    } else {
      return "pomodoroTimer";
    }
  },
};
</script>

<style></style>
