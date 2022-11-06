<template>
  <fragment>
    <Loading />
    <div class="layout">
      <Header @toggle="toggleSidebar" />
      <div class="h-100 d-flex position-relative">
        <Sidebar :toggle="toggle" />
        <Nuxt />
      </div>
    </div>
  </fragment>
</template>

<script>
import Sidebar from "../components/share/sidebar.vue";
import Header from "../components/share/header.vue";
import Loading from '../components/loading.vue'

export default {
  components: { Header, Sidebar, Loading },
  middleware: "checkLogged",
  data() {
    return {
      toggle: false,
    };
  },
  methods: {
    toggleSidebar(e) {
      this.toggle = e;
    },
  },
};
</script>

<style lang="scss" scoped>
.layout {
  height: 100vh;
  width: 100%;
  overflow: hidden;
}
</style>
