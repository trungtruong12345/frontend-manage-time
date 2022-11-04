<template>
  <textarea ref="textarea" v-bind="inputOptions" v-html="inputValue"></textarea>
</template>

<script>
export default {
  props: {
    inputOptions: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      editor: null,
    };
  },
  computed: {
    inputValue: {
      get() {
        return this.$attrs.value == null ? "" : this.$attrs.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
  },
  async mounted() {
    this.startLoading();
    const ClassicEditor = await import("../../lib/ckeditor.js");
    await ClassicEditor.default
      .create(this.$refs["textarea"], {
        licenseKey: "",
      })
      .then((editor) => {
        // editor.setData(this.inputValue);
        editor.model.document.on("change:data", () => {
          this.inputValue = editor.getData();
        });
        this.editor = editor;
      })
      .catch((error) => {
        console.error(error);
      });
    this.stopLoading();
  },
  watch: {
    inputValue(val) {
      if (this.editor && !this.editor.getData() && val) {
        this.editor.setData(val);
      }
    },
  },
};
</script>
