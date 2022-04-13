<template>
  <div class="content d-flex flex-nowrap w-100 position-relative note_page">
    <div :class="`menu--right w-100 ${menuRight ? '' : 'w-0'} full-page`">
      <div class="d-flex align-items-center flex-wrap">
        <div class="search align-items-stretch w-100">
          <nuxt-link class="btn btn-info mr-2" to="notes/new">
            <i class="fa fa-plus" aria-hidden="true"></i>
          </nuxt-link>

          <input
            type="text"
            class="w-100"
            v-model="search"
            placeholder="Search"
          />
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

        <div class="tags">
          <div
            v-for="(item, index) in tags.filter((a, i) => i < 5)"
            :class="`tag ${item.checked ? 'checked' : ''}`"
            :key="index"
            @click="item.checked = !item.checked"
            v-tooltip.bottom="item.name"
            :style="{ color: item.color, 'border-color': item.color }"
          >
            {{ item.name }}
          </div>

          <div class="tag" @click="show" v-if="tags.length >= 5">...</div>
          <client-only>
            <modal name="list-notes-modal-tags" width="100%">
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
      </div>

      <div class="list-notes">
        <Item v-for="(item, index) in notes" :key="index" :note="item" />
      </div>

      <nav aria-label="Page navigation" class="navigation">
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
import Details from "../../components/notes/details.vue";
import Item from "../../components/notes/item.vue";
import { mapActions, mapGetters } from "vuex";

const TagType = {
  Note: 0,
  BoardItem: 1,
};

export default {
  components: { Item, Details },
  layout: "home",
  data() {
    return {
      search: null,
      tags: [],
      menuRight: true,
    };
  },
  computed: {
    ...mapGetters("notes", ["notes", "currentPage", "totalPages"]),
  },
  methods: {
    ...mapActions("notes", ["fetchData"]),
    ...mapActions("tags", ["fetchTags"]),
    async onSearch() {
      this.startLoading();
      const { search } = this;
      const tags = this.tagsSelected();
      await this.fetchData({ page: 1, search, tags });
      this.stopLoading();
    },
    show() {
      this.$modal.show("list-notes-modal-tags");
    },
    hide() {
      this.$modal.hide("list-notes-modal-tags");
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
  },
  async created() {
    this.startLoading();
    await this.fetchData({ page: 1 });

    const res = await this.fetchTags();
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
    this.stopLoading();
  },
};
</script>

<style lang="scss" scoped>
.content {
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
    padding: 28px 156px;
    .icon-arrow {
      position: absolute;
      left: -21px;
      top: 6px;
      div {
        background-color: #29282d;
        // position: absolute;
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
    height: 100%;
    background-color: #222126;
    display: flex;
    flex-direction: column;

    .search {
      margin-right: 35.59px;
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      max-width: 318.67px;
      input {
        background-color: #333333;
        border: 0px;
        outline: unset;
        border-radius: 7px;
        margin-right: 8px;
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
      // height: 100%;
      height: 60px;
      flex-wrap: wrap;
      align-items: center;
      border-bottom: 1px solid #484848;
      .tag {
        border-radius: 8px;
        border: 2px solid #3471ff;
        padding: 0px 5px;
        font-style: normal;
        font-weight: 600;
        font-size: 12.5px;
        color: #3471ff;
        margin-right: 6.2px;
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
      overflow-y: scroll;
      height: 100%;
      margin-top: 25.11px;
      margin-bottom: 15px;
      display: grid;
      grid-gap: 25px;
      grid-template-columns:
        calc((100% - 75px) / 4) calc((100% - 75px) / 4) calc((100% - 75px) / 4)
        calc((100% - 75px) / 4);
      grid-auto-rows: min-content;
    }
  }
}
</style>
