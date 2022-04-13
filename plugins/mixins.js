import Vue from "vue";
import { mapMutations, mapActions } from "vuex";

const mixinLoading = {
  methods: {
    ...mapMutations({
      startLoading: 'loading/START_LOADING',
      stopLoading: 'loading/STOP_LOADING',
    })
  },
};

const mixinFirebaseListeners = {
  methods: {
    ...mapActions('auth', ['updateDeviceToken']),
    async requestPermissionToPushNoti() {
      try {
        await Notification.requestPermission()
      } catch (error) {
        console.log(error);
      }
    },
    async getDeviceToken(async = true) {
      await this.$fire.messaging.deleteToken().catch(() => {})
      const token = await this.$fire.messaging.getToken()

      if (async && token && this.$cookies.get("username")) {
        return await this.updateDeviceToken({ token })
      }

      return token
    },
    async startOnMessageListener(func = null) {
      await this.$fire.messaging.onMessage(async (layload)=> {
        if (func) return await func(layload)
      })
    },
  }
}

Vue.mixin(mixinFirebaseListeners);
Vue.mixin(mixinLoading);
