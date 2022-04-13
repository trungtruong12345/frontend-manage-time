<template>
  <modal name="setting-pomodoro" width="100%">
    <div class="content w-100">
      <div class="header">Setting</div>

      <hr />

      <div class="setting-times w-100">
        <label for="setting-times"> Time </label>
        <div class="w-100 d-flex align-items-center justify-content-between">
          <div class="time-pomodoro">
            <label for="pomodoro">Pomodoro</label>
            <TextField
              :inputOptions="{
                type: 'number',
                min: 1,
                max: 60,
              }"
              v-model="pomodoroTime"
              rules="maxLength:2||minLength:1||minNumber:1||maxNumber:60"
              ref="pomodoroTime"
              name="pomodoroTime"
            />
          </div>

          <div class="time-long">
            <label for="long">Long</label>
            <TextField
              :inputOptions="{
                type: 'number',
                min: 1,
                max: 60,
              }"
              v-model="longTime"
              rules="maxLength:2||minLength:1||minNumber:1||maxNumber:60"
              ref="longTime"
              name="longTime"
            />
          </div>

          <div class="time-short">
            <label for="short">Short</label>
            <TextField
              :inputOptions="{
                type: 'number',
                min: 1,
                max: 60,
              }"
              v-model="shortTime"
              rules="maxLength:2||minLength:1||minNumber:1||maxNumber:60"
              ref="shortTime"
              name="shortTime"
            />
          </div>
        </div>
      </div>

      <hr />

      <div class="setting-sound w-100">
        <label for="setting-sound">Sound</label>
        <input type="checkbox" v-model="toggleSound" />
      </div>

      <hr />

      <div class="setting-notification w-100">
        <label for="setting-notification">Notification</label>
        <input type="checkbox" v-model="toggleNotification" />
      </div>

      <hr />

      <div class="action-submit w-100">
        <div class="btn-save" role="button" @click="onSave">Save</div>
      </div>
    </div>
  </modal>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import TextField from "../inputs/textField.vue";

export default {
  components: { TextField },
  data() {
    return {
      pomodoroTime: 0,
      longTime: 0,
      shortTime: 0,
      toggleSound: false,
      toggleNotification: true,
    };
  },
  methods: {
    ...mapActions("pomodoro", ["updateClocks"]),
    ...mapMutations({
      toggleAlert: "pomodoro/CHANGE",
    }),
    fetchData() {
      const isUseSound = localStorage.getItem("sound") === "true";
      const isUseNoti = localStorage.getItem("notification") === "true";
      this.toggleAlert({
        key: "sound",
        val: isUseSound,
      });
      this.toggleSound = isUseSound;
      if (
        this.notification === null &&
        localStorage.getItem("notification") === null
      ) {
        this.toggleAlert({
          key: "notification",
          val: true,
        });
        this.toggleNotification = true;
      } else {
        this.toggleAlert({
          key: "notification",
          val: isUseNoti,
        });
        this.toggleNotification = isUseNoti;
      }

      this.pomodoroTime = parseInt(
        `${this.pomodoro?.tensOfminutes || 0}${
          this.pomodoro?.unitsOfminutes || 0
        }`
      );
      this.longTime = parseInt(
        `${this.long?.tensOfminutes || 0}${this.long?.unitsOfminutes || 0}`
      );
      this.shortTime = parseInt(
        `${this.short?.tensOfminutes || 0}${this.short?.unitsOfminutes || 0}`
      );
    },
    onSave() {
      let {
        toggleSound,
        toggleNotification,
        pomodoroTime,
        longTime,
        shortTime,
      } = this;
      if (
        [
          ...document.querySelector("#pomodoroTime").classList,
          ...document.querySelector("#longTime").classList,
          ...document.querySelector("#shortTime").classList,
        ].includes('is-invalid')
      ) {
        return;
      }
      this.toggleAlert({
        key: "sound",
        val: toggleSound,
      });
      this.toggleAlert({
        key: "notification",
        val: toggleNotification,
      });

      pomodoroTime = parseInt(pomodoroTime);
      longTime = parseInt(longTime);
      shortTime = parseInt(shortTime);

      this.updateClocks({
        pomodoro: {
          tensOfminutes:
            pomodoroTime >= 10 ? parseInt(String(pomodoroTime)[0]) : 0,
          unitsOfminutes:
            pomodoroTime >= 10
              ? parseInt(String(pomodoroTime)[1])
              : parseInt(String(pomodoroTime)),
        },
        long: {
          tensOfminutes: longTime >= 10 ? parseInt(String(longTime)[0]) : 0,
          unitsOfminutes:
            longTime >= 10
              ? parseInt(String(longTime)[1])
              : parseInt(String(longTime)),
        },
        short: {
          tensOfminutes: shortTime >= 10 ? parseInt(String(shortTime)[0]) : 0,
          unitsOfminutes:
            shortTime >= 10
              ? parseInt(String(shortTime)[1])
              : parseInt(String(shortTime)),
        },
      });
      return this.$modal.hide("setting-pomodoro");
    },
  },
  computed: {
    ...mapGetters("pomodoro", [
      "pomodoro",
      "long",
      "short",
      "sound",
      "notification",
    ]),
  },
  watch: {
    pomodoro(val) {
      const { tensOfminutes = 0, unitsOfminutes = 0 } = val || {};
      this.pomodoroTime = parseInt(`${tensOfminutes}${unitsOfminutes}`);
    },
    long(val) {
      const { tensOfminutes = 0, unitsOfminutes = 0 } = val || {};
      this.longTime = parseInt(`${tensOfminutes}${unitsOfminutes}`);
    },
    short(val) {
      const { tensOfminutes = 0, unitsOfminutes = 0 } = val || {};
      this.shortTime = parseInt(`${tensOfminutes}${unitsOfminutes}`);
    },
    sound(val) {
      this.toggleSound = val;
    },
    notification(val) {
      this.toggleNotification = val;
    },
  },
  mounted() {
    this.fetchData();
    this.$root.$on("fetchClockData", this.fetchData);
  },
  destroyed() {
    this.$root.$off("fetchClockData", this.fetchData);
  },
};
</script>

<style></style>
