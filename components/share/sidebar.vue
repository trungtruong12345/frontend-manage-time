<template>
  <div :class="'sidebar h-100 ' + (toggle ? 'active' : '')">
    <nuxt-link class="item" to="/pomodoro-timer">
      <div class="item__icon">
        <i class="fa fa-clock-o" aria-hidden="true"></i>
      </div>
      <div class="item__name">Pomodoro</div>
    </nuxt-link>

    <nuxt-link class="item" to="/projects">
      <div class="item__icon">
        <i class="fa fa-list-alt" aria-hidden="true"></i>
      </div>
      <div class="item__name">Todolist</div>
    </nuxt-link>

    <nuxt-link class="item" to="/notes">
      <div class="item__icon">
        <i class="fa fa-book" aria-hidden="true"></i>
      </div>
      <div class="item__name">Notes</div>
    </nuxt-link>
  </div>
</template>

<script>
export default {
  props: {
    toggle: Boolean,
  },
};
</script>

<style lang="scss" scoped>
.sidebar {
  border-top: 1px solid #75737d;
  width: 62px;
  background-color: #29282d;
  transition: 0.3s;
  overflow: hidden;
  .item {
    padding: 14px 22px;
    display: flex;
    justify-items: center;
    cursor: pointer;
    transition: 0.5s;
    padding: 14px 0px;
    &.active, &.nuxt-link-active {
      & * {
        color: #bbbabf;
      }
      border-right: 3px solid #7587ec;
    }
  }
  .item__icon {
    width: 24px;
    height: 24px;
    margin: 0 auto;
    font-size: 19px;
    color: #87868c;
  }
  .item__name {
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    color: #87868c;
    display: none;
  }
  &.active {
    width: 245px !important;
    min-width: 245px !important;
    .item__icon {
      display: block;
    }
    .item {
      padding: 14px 22px !important;
    }
    .item__icon {
      margin: unset;
      margin-right: 18px !important;
    }
    .item__name {
      display: unset !important;
    }
  }
}
</style>
