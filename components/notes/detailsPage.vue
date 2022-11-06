<template>
  <div class="content d-flex flex-nowrap position-relative note_page">
    <div class="details w-100">
      <Details :id="id" />
    </div>
    <div :class="`menu--right w-100 ${menuRight ? '' : 'w-0'}`">
      <div class="icon-arrow d-flex" role="button">
        <div
          :class="`left  ${menuRight ? '' : 'd-none'}`"
          @click="
            () => {
              toggleMenuRight(false);
            }
          "
        >
          <i class="fa fa-arrow-circle-o-right" aria-hidden="true"></i>
        </div>

        <div
          :class="`right  ${menuRight ? 'd-none' : ''}`"
          @click="
            () => {
              toggleMenuRight(true);
            }
          "
        >
          <i class="fa fa-arrow-circle-o-left" aria-hidden="true"></i>
        </div>
      </div>

      <div class="search align-items-stretch w-100">
        <input type="text" class="w-100" v-model="search" />
        <a
          name=""
          id=""
          class="btn btn-primary"
          href="#"
          role="button"
          @click="onSearch"
          ><i class="fa fa-search" aria-hidden="true"></i
        ></a>
      </div>

      <div class="icon-filter">
        <div class="filter__icon">
          <img src="~static/images/icon-filter.png" class="img-fluid" alt="" />
        </div>
        <div class="filter__text">Filro</div>
        <div class="line w-100"></div>
      </div>

      <div class="tags">
        <div
          v-for="(item, index) in tags.filter((a, i) => i < 5)"
          :key="index"
          :class="`tag ${item.checked ? 'checked' : ''}`"
          @click="item.checked = !item.checked"
          v-tooltip.bottom="item.name"
          :style="{ color: item.color, 'border-color': item.color }"
        >
          {{ item.name }}
        </div>

        <div class="tag" @click="show" v-if="tags.length >= 5">...</div>

        <client-only>
          <modal name="modal-tags" width="100%">
            <div
              :class="`tag ${item.checked ? 'checked' : ''}`"
              v-for="(item, index) in tags"
              :key="index"
              @click="item.checked = !item.checked"
              v-tooltip.bottom="item.name"
              :style="{ color: item.color, 'border-color': item.color }"
            >
              {{ item.name }}
            </div>
          </modal>
        </client-only>
      </div>

      <div class="list-notes">
        <Item v-for="(item, index) in notes" :key="index" :note="item" />
      </div>
      <nav
        :aria-label="`Page navigation`"
        :class="`navigation ${menuRight ? '' : 'd-none'}`"
      >
        <client-only>
          <paginate
            :page-count="totalPages || 1"
            :prev-text="'Prev'"
            :next-text="'Next'"
            :container-class="'pagination'"
            :page-class="'page-item'"
            :prev-class="'page-item'"
            :next-class="'page-item'"
            :page-link-class="'page-link'"
            :prev-link-class="'page-link'"
            :next-link-class="'page-link'"
            :click-handler="onChangePage"
          >
          </paginate>
        </client-only>
      </nav>
    </div>
  </div>
</template>

<script>
import Details from "./details.vue";
import Item from "./item.vue";
import { mapActions, mapGetters } from "vuex";

const TagType = {
  Note: 0,
  BoardItem: 1,
};

export default {
  components: { Item, Details },
  props: {
    id: Number,
  },
  data() {
    return {
      search: null,
      menuRight: false,
      tags: [],
    };
  },
  methods: {
    ...mapActions("notes", ["fetchData"]),
    ...mapActions("tags", ["fetchTags"]),
    show() {
      this.$modal.show("modal-tags");
    },
    hide() {
      this.$modal.hide("modal-tags");
    },
    async onSearch() {
      const { search } = this;
      const tags = this.tagsSelected();
      this.startLoading();
      await this.fetchData({ page: 1, search, tags });
      this.stopLoading();
    },
    async onChangePage(numberOfPage) {
      const { search } = this;
      const tags = this.tagsSelected();
      this.startLoading();
      await this.fetchData({ page: numberOfPage, search, tags });
      this.stopLoading();
    },
    tagsSelected() {
      return this.tags
        .filter((tag) => tag.checked === true)
        .map((tag) => tag.id);
    },
    toggleMenuRight(isShow = null) {
      if (isShow === null) {
        if (window.localStorage.getItem("showMenuRight") === "true") {
          this.menuRight = true;
        } else {
          this.menuRight = false;
        }
      } else {
        this.menuRight = isShow;
        window.localStorage.setItem("showMenuRight", isShow.toString());
      }
    },
  },
  computed: {
    ...mapGetters("notes", ["notes", "currentPage", "totalPages"]),
  },
  async created() {
    this.startLoading();
    await this.fetchData({ page: 1 });

    const res = await this.fetchTags();
    this.stopLoading();
    if (res.status) {
      this.tags = res.data
        .filter((tag) => tag.tagType === TagType.Note)
        .map((tag) => {
          return {
            id: tag.id,
            name: tag.name,
            checked: false,
            color: tag.color,
          };
        });
    }
  },
  mounted() {
    this.toggleMenuRight();
  },
};
</script>

<style lang="scss" scoped>
.d-none {
  display: none !important;
}
.content {
  .navigation {
    margin-bottom: 23px;
    justify-content: center !important;
    margin-top: 6px;
  }
  background-color: #1c1b20;
  color: #c8c8c8;

  & *:not(i) {
    font-family: "Poppins", Arial, sans-serif;
  }
  .details {
    overflow-y: scroll;
    max-height: 93%;
  }
  .menu--right {
    transition: 0.4s;
    position: relative;
    .icon-arrow {
      position: absolute;
      left: -21px;
      top: 6px;
      div {
        background-color: #29282d;
        position: absolute;
        border-radius: 50%;
        width: 21px;
        height: 21px;
        justify-content: center;
        align-items: center;
        display: flex;
        // border: 1px solid #3471ff;
        i {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 22px;
        }
      }
    }
    max-width: 362px;
    height: 100%;
    background-color: #272727;
    padding: 22px 10px 17.5px;

    display: flex;
    flex-direction: column;

    .search {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      margin-bottom: 16.34px;

      input {
        background-color: #333333;
        border: 0px;
        outline: unset;
        border-radius: 7px;
        margin-right: 16px;
        padding: 0px 12px;
        color: #ffffff;

        font-style: normal;
        font-weight: 400;
        font-size: 14px;
      }
    }
    .icon-filter {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;

      .filter__icon {
        width: 17.57px;
        height: 15.06px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 5.86px;
      }
      .filter__text {
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        color: #484848;
        margin-right: 15px;
      }
      .line {
        border: 2px solid #484848;
      }
    }
    .tags {
      display: flex;
      flex-wrap: wrap;
      margin-top: 15.06px;
      .tag {
        border-radius: 10px;
        border: 2px solid #3471ff;
        padding: 3px 5px;
        font-style: normal;
        font-weight: 600;
        font-size: 12.5px;
        color: #3471ff;
        margin-right: 6.2px;
        margin-bottom: 7.02px;
        cursor: pointer;
        overflow: hidden;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        display: -webkit-box;
        word-break: break-all;
        max-width: 87px;
      }
    }
    .list-notes {
      overflow: scroll;
      height: 100%;
      margin-top: 25.11px;
      margin-bottom: 0px;
    }
  }
}
</style>
