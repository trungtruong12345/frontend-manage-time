<template>
  <div class="header">
    <div class="logo" @click="toggle = !toggle">
      <div class="logo--image">
        <img src="~static/images/GitHub.png" class="img-fluid" alt="" />
      </div>
      <div class="company-name">TRNG</div>
    </div>

    <div
      class="user"
      @mouseover="() => toggleDropdown(true)"
      @mouseleave="() => toggleDropdown(false)"
    >
      <div class="user-image">
        <img src="~static/images/GitHub.png" class="img-fluid" alt="" />
      </div>
      <div class="user-name">{{ username }}</div>

      <div
        :class="`dropdown-content ${dropdown ? '' : 'd-none'}`"
        @mouseover="() => toggleDropdown(true)"
      >
        <div class="dropdown-item" @click="onLogout">Logout</div>

        <nuxt-link class="dropdown-item" to="/tags" tag="div">
          Edit tags
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions } from "vuex";

export default {
  data() {
    return {
      toggle: true,
      dropdown: false,
      timeoutId: null
    };
  },
  methods: {
    ...mapActions('auth', ['logout']),
    ...mapMutations({
      updateUserInfo: "auth/UPDATE_DATA",
    }),
    toggleDropdown(toggle = true) {
      if (toggle) {
        this.dropdown = true
        clearTimeout(this.timeoutId)
      } else {
        this.timeoutId = setTimeout(() => {
          this.dropdown = false
        }, 200);
      }
    },
    onLogout() {
      this.logout()
      this.$router.push('/login');
    }
  },
  computed: {
    username: {
      get() {
        return this.$store.getters["auth/username"];
      },
      set(val) {
        this.updateUserInfo({ key: "username", val });
      },
    },
  },
  watch: {
    toggle(val) {
      this.$cookies.set("sidebar", val);
      this.$emit("toggle", val);
    },
  },
  created() {
    this.toggle = !!this.$cookies.get("sidebar");
    this.username = this.$cookies.get("username");
  },
};
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  flex-wrap: nowrap;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  background-color: #29282d;
  color: #eeeeee;
  padding: 6.5px 16px;
  .logo,
  & .user {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    cursor: pointer;
    position: relative;
    .dropdown-content {
      position: absolute;
      top: 30px;
      z-index: 1;
      right: 0;
      background-color: white;
      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
      .dropdown-item {
        &:hover {
        text-decoration: underline;
        }
      }
    }
  }

  .logo--image {
    width: 34px;
    height: 35px;
    margin-right: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .user-image {
    width: 23.41px;
    height: 24px;
    margin-right: 9.96px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .company-name {
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    color: #eeeeee;
  }
  .user-name {
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    color: #bbbabf;
  }
}
</style>
