<template>
  <div class="notes__note">
    <!-- <client-only> -->
    <div class="note__title">
      <nuxt-link :to="`/notes/${note.id}`">
        {{ note.title }}
      </nuxt-link>
    </div>

    <div class="note__content" v-html="note.content"></div>

    <div
      class="d-flex align-items-end justify-content-between position-relative dropdown flex-1"
    >
      <div class="time-ago">
        <Timeago :datetime="note.updated_at" :auto-update="60" />
      </div>

      <div class="icon-menu btn-dropdown">
        <i class="fa fa-ellipsis-v" aria-hidden="true"></i>
      </div>

      <div :class="`menu position-absolute d-none`">
        <div class="item">
          <i class="fa fa-pencil-square-o text-info" aria-hidden="true"></i>
          <NuxtLink :to="`/notes/${note.id}/edit`"> edit </NuxtLink>
        </div>
        <div class="item">
          <i class="fa fa-eraser text-danger" aria-hidden="true"></i>
          <a href="#" @click="onDelete">delete</a>
        </div>
      </div>
    </div>
    <!-- </client-only> -->
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  props: {
    note: Object,
  },
  methods: {
    ...mapActions("notes", ["delete"]),
    async onDelete() {
      const result = await confirm("Are you sure ?");
      const { id } = this.note;
      let res;
      if (!!result) {
        this.startLoading();
        res = await this.delete({ id });
        this.stopLoading();
        if (res.status) {
          window.$nuxt.$toast.success("Success!").goAway(2000);
          const paramId = this.$route.params?.id;
          if (paramId && paramId == id) this.$router.push({ path: "/notes" });
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.menu {
  background-color: #1f1f1f !important;
  width: 100px;
  min-width: none;
  top: 38px;
  right: -13px;
  border: 1px solid #000000 !important;
  .item {
    padding: 5px 15px !important;
    align-items: center;
    justify-content: space-between;
    i {
      width: 12.87px;
      height: 12.87px;
      margin-right: 9px;
    }
    a {
      font-family: "Nunito";
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      line-height: 19px;
      color: white;
      &:hover {
        text-decoration: revert !important;
      }
    }
    &:first-of-type {
      border-bottom: 1px solid #393939;
    }
  }
}
.notes__note {
  background-color: #36353a;
  padding: 11.04px 13px;
  cursor: pointer;
  // margin-bottom: 20px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
}
.note__title a {
  font-style: normal;
  overflow: hidden;
  -webkit-box-orient: vertical;
  display: -webkit-box;
  word-break: break-word;
  font-weight: 600;
  font-size: 18px;
  color: #dfdddd;
  line-height: 22px;
  margin-bottom: 5.11px;
  -webkit-line-clamp: 2;
}
.note__content {
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  color: #a6a6a6;
  line-height: 18px;
  margin-bottom: 4.32px;

  -webkit-line-clamp: 3;
  overflow: hidden;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  height: 93px;
  display: -webkit-box;

  word-break: break-all;
}
.icon-menu {
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30.46px;
  height: 26.1px;
  cursor: pointer;
}
</style>
