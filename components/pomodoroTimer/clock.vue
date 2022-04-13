<template>
  <div class="clock" :type="type">
    <div class="toggle-pomodoro-timer" role="button" @click="onNextType">
      <i
        class="fa fa-battery-full mr-2"
        aria-hidden="true"
        v-if="type === 'pomodoro'"
      ></i>
      <i
        class="fa fa-battery-three-quarters mr-2"
        aria-hidden="true"
        v-else-if="type === 'long'"
      ></i>
      <i class="fa fa-battery-half mr-2" aria-hidden="true" v-else></i>
      {{ capitalizedStr(type) }}
    </div>
    <div class="clock-time">
      <span>{{ tensOfminutes }}{{ unitsOfminutes }}</span
      ><span>:</span><span>{{ tensOfseconds }}{{ unitsOfseconds }}</span>
    </div>
    <div class="action">
      <div class="action-option" role="button" @click="onShowModalSetting">
        <i class="fa fa-ellipsis-h" aria-hidden="true"></i>
      </div>
      <div
        class="action-pause"
        role="button"
        @click="() => (intervalId ? onStop() : onStart())"
      >
        <i class="fa fa-pause" aria-hidden="true" v-if="intervalId"></i>
        <i class="fa fa-play" aria-hidden="true" v-else></i>
      </div>
      <div class="action-skip" role="button" @click="onNextType">
        <i class="fa fa-forward" aria-hidden="true"></i>
      </div>
    </div>
    <client-only>
      <ModalSetting />
    </client-only>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from "vuex";
import { capitalizedStr } from "../../lib/mixture";
import ModalSetting from "./modalSetting.vue";

export default {
  components: { ModalSetting },
  data() {
    return {
      intervalId: null,
      tensOfminutes: 0,
      unitsOfminutes: 0,
      tensOfseconds: 0,
      unitsOfseconds: 0,
    };
  },
  methods: {
    capitalizedStr,
    ...mapMutations({
      changeType: "pomodoro/CHANGE_TYPE",
      changeToggle: "pomodoro/TOGGLE_TODOS",
    }),
    ...mapActions("auth", ["pushNotiForMe"]),
    ...mapActions("pomodoro", ["fetchClocks"]),
    onClearInterval() {
      clearInterval(this.intervalId);
      this.intervalId = null;
    },
    onChangeTimer(type = "pomodoro") {
      this.onClearInterval();
      if (type !== null) this.type = type;
      const {
        tensOfminutes,
        unitsOfminutes,
        tensOfseconds = 0,
        unitsOfseconds = 0,
      } = this[type];
      this.tensOfminutes = tensOfminutes;
      this.unitsOfminutes = unitsOfminutes;
      this.tensOfseconds = tensOfseconds;
      this.unitsOfseconds = unitsOfseconds;
    },
    onNextType() {
      switch (this.type) {
        case "pomodoro":
          this.onChangeTimer("long");
          break;
        case "long":
          this.onChangeTimer("short");
          break;
        case "short":
          this.onChangeTimer("pomodoro");
          break;
      }
    },
    async onStart() {
      this.onClearInterval();
      const audio = new Audio(`${window.location.origin}/sounds/noti.mp3`);
      this.intervalId = setInterval(async () => {
        if (this.unitsOfseconds === 0) {
          this.unitsOfseconds = 9;
          if (this.tensOfseconds === 0) {
            this.tensOfseconds = 5;
            if (this.unitsOfminutes === 0) {
              this.unitsOfminutes = 9;
              if (this.tensOfminutes === 0) {
                /// End
                this.onClearInterval();
                this.onChangeTimer(this.type);
                if (this.sound) {
                  audio.play();
                }
                if (this.notification) {
                  const title = "FINISH TIME";
                  const content = "";
                  const link = `${window.location.origin}/pomodoro-timer`;
                  if (this.$cookies.get("username")) {
                    await this.pushNotiForMe({
                      title,
                      content,
                      link,
                    });
                  } else {
                    const noti = new Notification(title, {
                      body: content,
                      icon: "/images/pngwing.png",
                    });
                    noti.onclick = function () {
                      window.open(link);
                    };
                  }
                }
              } else {
                this.tensOfminutes--;
              }
            } else {
              this.unitsOfminutes--;
            }
          } else {
            this.tensOfseconds--;
          }
        } else {
          this.unitsOfseconds--;
        }
      }, 1000);
    },
    onStop() {
      this.onClearInterval();
    },
    onShowModalSetting() {
      this.$root.$emit("fetchClockData");
      this.$modal.show("setting-pomodoro");
    },
  },
  computed: {
    ...mapGetters("pomodoro", [
      "typeTimer",
      "pomodoro",
      "long",
      "short",
      "notification",
      "sound",
    ]),
    type: {
      get() {
        return this.typeTimer;
      },
      set(val) {
        this.changeType({ type: val });
      },
    },
  },
  watch: {
    pomodoro() {
      const { type } = this;
      if (type === "pomodoro") {
        this.onChangeTimer("pomodoro");
      }
    },
    long() {
      const { type } = this;
      if (type === "long") {
        this.onChangeTimer("long");
      }
    },
    short() {
      const { type } = this;
      if (type === "short") {
        this.onChangeTimer("short");
      }
    },
  },
  created() {
    this.onChangeTimer("pomodoro");
  },
  mounted() {
    this.fetchClocks();
  },
  beforeDestroy() {
    this.onClearInterval();
  },
};
</script>

<style></style>
