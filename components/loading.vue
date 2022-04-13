<template>
  <client-only>
    <vue-element-loading
      :active="isLoading"
      is-full-screen
      spinner="bar-fade-scale"
      color="#9c88ff"
    />
  </client-only>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters("loading", ["isLoading"]),
  },
};
</script>

<style></style>
