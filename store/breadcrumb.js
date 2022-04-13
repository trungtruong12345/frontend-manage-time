export const state = () => ({
  breadcrumb: [],
});

export const mutations = {
  FETCH(state, { breadcrumb }) {
    state.breadcrumb = breadcrumb;
  },
};

export const actions = {
  updateBreadcrumb({ commit }, { fullPath }) {
    if (fullPath) {
      let nextPath = "";
      const breadcrumb = fullPath
        .split("/")
        .filter((path) => path)
        .map((path) => {
          console.log(path);
          nextPath = `${nextPath}/${path}`;
          console.log(nextPath);
          return {
            text: path,
            href: nextPath,
          };
        });
      const isLastEle = breadcrumb[breadcrumb.length - 1]
      if (isLastEle) {
        isLastEle.active = true
      }
      commit("FETCH", { breadcrumb });
    }
  },
};

export const getters = {
  breadcrumb: (state) => state.breadcrumb,
};
