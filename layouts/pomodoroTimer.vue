<template>
    <fragment>
    <Loading />
    <div :class="`layout-of-pomodoro ${typeTimer}`">
      <Nuxt />
    </div>
  </fragment>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  // middleware: "auth",
  computed: {
    ...mapGetters("pomodoro", ["typeTimer"]),
  },
}
</script>
