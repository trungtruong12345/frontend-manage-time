<template>
  <div class="list-projects">
    <div>
      <div class="d-flex justify-content-end">
        <div class="d-flex align-items-center mr-3">
          <i
            class="fa fa-cog"
            aria-hidden="true"
            title="Setting"
            rule="buttom"
            @click="() => isShowModalChangeProjects()"
            :hidden="projects.length === 0"
          ></i>
          <client-only>
            <modal name="modal--setting-lists-projects" width="100%">
              <div class="setting-lists-project">
                <draggable
                  tag="ul"
                  :list="list"
                  class="list-group"
                  handle=".handle"
                >
                  <li
                    class="list-group-item"
                    v-for="element in list.filter((i) => !i.delete)"
                    :key="element.id"
                  >
                    <i class="fa fa-bars handle" aria-hidden="true"></i>

                    <input
                      type="text"
                      class="form-control ml-2 mr-2"
                      :value="element.name"
                      :ref="`input-project-name-${element.id}`"
                    />

                    <i
                      class="fa fa-times close"
                      @click="() => removeProjectAt(element.id)"
                    ></i>
                  </li>
                </draggable>
                <div class="text-right mt-2">
                  <button
                    type="button"
                    class="btn btn-primary"
                    @click="updateProjects"
                  >
                    Save
                  </button>
                </div>
              </div>
            </modal>
          </client-only>
        </div>
        <button
          type="button"
          class="btn btn-primary btn-new-project"
          @click="() => isShowModalNewProject(true)"
        >
          New Project
        </button>
        <client-only>
          <modal name="modal-create-new-project" width="100%">
            <div
              class="d-flex justify-content-center w-100 align-items-stretch"
            >
              <input
                type="text"
                name="project-name"
                class="w-100"
                required
                placeholder="Project name"
                v-model="newProjectName"
              />
              <button
                type="button"
                class="btn btn-primary ml-md-3"
                @click="onCreate"
              >
                Create
              </button>
            </div>
          </modal>
        </client-only>
      </div>

      <div class="items">
        <nuxt-link
          class="project-item"
          v-for="project in projects"
          :key="project.id"
          :to="`/projects/${project.id}`"
          :draggable="false"
        >
          <div class="info1">
            <div
              class="icon"
              :style="`background-color: ${getColor(project.name[0])}`"
            >
              {{ project.name[0].toUpperCase() }}
            </div>
            <div class="project-name">
              {{ project.name }}
            </div>
          </div>
          <div class="info2">
            <div class="total-todos">
              <img src="/images/list-todos.png" alt="" />
              <span class="number">
                {{ project.countBoardItems }}
              </span>
            </div>
            <div class="updated-at">
              <Timeago :datetime="project.maxUpdatedAt" :auto-update="60" />
            </div>
          </div>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import getColor from "../../lib/getColorByKeyword";
import draggable from "vuedraggable";

export default {
  components: { draggable },
  layout: "home",
  data() {
    return {
      newProjectName: "",
      list: [],
      dragging: false,
    };
  },
  methods: {
    ...mapActions("projects", [
      "fetchProjects",
      "createNewProject",
      "deleteProject",
      "updateProject",
    ]),
    isShowModalNewProject(show = true) {
      if (show) {
        this.$modal.show("modal-create-new-project");
      } else {
        this.$modal.hide("modal-create-new-project");
      }
    },
    async isShowModalChangeProjects(show = true) {
      if (show) {
        this.$modal.show("modal--setting-lists-projects");
        this.startLoading()
        const res = await this.fetchProjects();
        this.stopLoading()
        if (res.status) {
          this.list = [...res.data];
        }
      } else {
        this.$modal.hide("modal--setting-lists-projects");
      }
    },
    async onCreate() {
      const { newProjectName } = this;
      const order = (this.projects?.length || 0) + 1;
      this.startLoading()
      const res = await this.createNewProject({ name: newProjectName, order });
      if (res.status) {
        this.$modal.hide("modal-create-new-project");
        await this.fetchProjects();
      }
      this.stopLoading()
    },
    getColor,
    removeProjectAt(id) {
      const list = [...this.list];
      const element = list.find((item) => item.id == id);
      element.delete = true;
      this.list = list;
    },
    async updateProjects() {
      this.startLoading()
      const res = await [...this.list.reverse()].map(async (item, index) => {
        if (item.delete) {
          return await this.deleteProject({ id: item.id });
        } else {
          return await this.updateProject({
            id: item.id,
            name: this.$refs[`input-project-name-${item.id}`][0].value,
            order: index,
          });
        }
      });

      let result = true;
      await Promise.all(res).then((values) => {
        values.map((value) => {
          if (!value.status) result = false;
        });
      });
      this.stopLoading()
      if (result) {
        this.$modal.hide("modal--setting-lists-projects");
        window.$nuxt.$toast.success('success').goAway(2000);
        await this.fetchProjects();
      }
    },
  },
  computed: {
    ...mapGetters("projects", ["projects"]),
  },
  async created() {
    this.startLoading()
    await this.fetchProjects();
    this.isShowModalNewProject(this.projects.length === 0)
    this.stopLoading()
  },
};
</script>

<style lang="scss" scoped>
i[title="Setting"] {
  font-size: 24px;
  color: #9ea8b5;
}
</style>
