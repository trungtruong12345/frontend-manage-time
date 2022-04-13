<template>
  <div>
    <div class="form--auth change-password">
      <div class="icon-user">
        <img src="/images/user icon _1_.png" alt="" />
      </div>

      <div class="text-welcome">Enter your email</div>

      <input
        type="email"
        class="email"
        placeholder="Email"
        v-if="step == 1"
        v-model="email"
      />

      <input
        type="text"
        class="username"
        placeholder="Confimation code"
        v-if="step == 2"
        v-model="confirmCode"
      />

      <input
        type="text"
        class="username"
        placeholder="New name"
        v-if="step == 2"
        v-model="username"
      />

      <input
        type="password"
        class="password"
        placeholder="New password"
        v-if="step == 2"
        v-model="password"
      />

      <input
        type="password"
        class="re-password"
        v-if="step == 2"
        placeholder="Enter the new password"
        v-model="rePassword"
      />

      <div class="btn-submit mt-3">
        <div v-if="step == 1" @click="onReSendMailConfirmCode">
          Send mail confirm code & Next
          <i class="fa fa-angle-right" aria-hidden="true"></i>
        </div>
        <div v-else @click="onChangeUser">
          Submit
        </div>
      </div>

      <div class="forget-pass" v-if="step == 2" @click="onReSendMailConfirmCode">
        Re send mail
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

const MESSAGES = {
  changePassword: "Change password success!",
  passwordCorrect: "Password is not correct!"
};

const STEP_1 = 1
const STEP_2 = 2

export default {
  layout: "",
  data() {
    return {
      user_id: '',
      email: "",
      username: "",
      confirmCode: "",
      password: "",
      rePassword: "",
      step: STEP_1, /// (1 | 2)
    };
  },
  methods: {
    ...mapActions("auth", ["reSendMailConfirmCode", "changePassword"]),
    async onReSendMailConfirmCode() {
      const {email} = this;
      this.startLoading()
      const res = await this.reSendMailConfirmCode({email})
      this.stopLoading()
      if (res.status) {
        this.user_id = res.data.user_id;
        this.step = STEP_2;
      }
    },
    async onChangeUser() {
      const { confirmCode, username, password, rePassword, user_id } = this;
      if (password !== rePassword) return window.$nuxt.$toast.error(MESSAGES.passwordCorrect).goAway(2000);

      const res = await this.changePassword({ confirmCode, username, password, id: user_id });
      if (res.status) {
        window.$nuxt.$toast.success(MESSAGES.changePassword).goAway(2000);
        this.$emit('emitChangePass', null);
      }
    }
  },
};
</script>

<style lang="scss" scoped></style>
