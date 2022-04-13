<template>
  <fragment>
    <Loading />
    <div class="bg__form--auth">
      <div class="form--auth">
        <div class="login-google text-white" role="button" @click="googleLogin">
          <img
            src="https://cdn-icons-png.flaticon.com/512/300/300221.png"
            alt="Google"
          />
          <span>Login via Google</span>
        </div>
        <nuxt-link to="/pomodoro-timer" class="opent-pomodoro w-100 mt-4" tag="div" role="button">
          <img
            src="https://vivaldi.com/wp-content/uploads/The_Pomodoro_timer_in_Vivaldi_browser-980x551.png"
            alt="pomodoro"
            class="w-100"
          />
        </nuxt-link>
      </div>
    </div>
  </fragment>
</template>

<script>
import Loading from "../components/loading.vue";
import { mapActions } from "vuex";

export default {
  components: { Loading },
  layout: false,
  methods: {
    async googleLogin() {
      return await this.$auth.loginWith("google", {
        params: { prompt: "select_account" },
      });
    },
    ...mapActions("auth", ["loginBySocial"]),

    getHashValue(key) {
      var matches = this.$route.hash.match(new RegExp(key + "=([^&]*)"));
      return matches ? matches[1] : null;
    },
  },
  async created() {
    const token = this.$cookies.get("token");
    if (!!token) return this.$router.push("/notes");

    let res;
    const googleToken = this.getHashValue("access_token");
    this.startLoading()
    if (googleToken) {
      res = await this.loginBySocial({
        access_token: googleToken.replace("Bearer ", ""),
        social: "google",
      });
    }
    this.stopLoading()
    if (!!res) {
      this.$router.push("/notes");
    }
  },
};
</script>
