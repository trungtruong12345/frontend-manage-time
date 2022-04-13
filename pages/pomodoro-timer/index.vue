<template>
  <div class="pomodoro-timer">
    
    <div class="btn-back" @click="$router.back()" v-if="$cookies.get('username')">
      <i class="fa fa-chevron-left" aria-hidden="true"></i>
      <span>Back</span>
    </div>

    <div class="btn-back" @click="$router.push('/login')" v-else>
      <i class="fa fa-sign-in" aria-hidden="true"></i>
      <span>Login</span>
    </div>

    <div :class="`timer ${typeTimer}`">
      <div
        class="btn-show-todos"
        @click="toggleTodos = true"
        v-if="!toggleTodos"
      >
        <i class="fa fa-bars" aria-hidden="true" role="button"></i>
      </div>

      <Clock />

      <div :class="`todo-list ${toggleTodos ? '' : 'd-none'}`">
        <div class="todo-header">Todo list</div>
        <div class="list">
          <Todo v-for="(todo, idx) in todosList" :key="idx" :todo="todo" />

          <div class="btn-add" @click="$modal.show('add-new-todo')">
            <i class="fa fa-plus" aria-hidden="true"></i>
          </div>
          <client-only>          
            <ModalTodo :name="`add-new-todo`" />
          </client-only>
        </div>
        <div class="btn-hide-todos">
          <i
            class="fa fa-arrow-circle-o-right"
            aria-hidden="true"
            role="button"
            @click="toggleTodos = false"
            v-if="toggleTodos"
          ></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from "vuex";
import Todo from "../../components/pomodoroTimer/todo.vue";
import Clock from "../../components/pomodoroTimer/clock.vue";
import ModalTodo from "../../components/pomodoroTimer/modalTodo.vue";

export default {
  components: { Todo, Clock, ModalTodo },
  layout: "pomodoroTimer",
  methods: {
    ...mapActions("pomodoro", ["fetchData"]),
    ...mapMutations({
      changeToggle: "pomodoro/TOGGLE_TODOS",
    }),
    async requestPushNoti() {
      await this.requestPermissionToPushNoti();
      this.getDeviceToken().then(() => {
        return this.startOnMessageListener().catch((error) => {
          console.log(error);
        });
      });
    },
  },
  computed: {
    ...mapGetters("pomodoro", ["todosList", "notification", "typeTimer"]),
    toggleTodos: {
      get() {
        return this.$store.getters["pomodoro/toggleTodos"];
      },
      set(val) {
        this.changeToggle({ val });
      },
    },
  },
  async mounted() {
    await this.fetchData();
    if (this.notification) await this.requestPushNoti();
  },
  // watch: {
  //   async notification(val) {
  //     if (val) {
  //       await this.requestPushNoti();
  //     }
  //   },
  // },
};
</script>

<style></style>
