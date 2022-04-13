<template>
  <Fragment :is="isFragment ? 'Fragment' : 'div'">
      <input
        v-model="inputValue"
        :class="inputClass"
        :id="name"
        :name="name"
        v-bind="inputOptions"
      />
  </Fragment>
</template>

<script>
import { validate } from '../../lib/validate'
import { Fragment } from 'vue-fragment'

export default {
  components: { Fragment },
  props: {
    isFragment: {
      type: Boolean,
      default: true,
    },
    name: {
      type: String,
      default: '',
    },
    rules: String,
    inputOptions: {
      type: Object,
      default: () => ({}),
    },
    inputs: String,
  },
  computed: {
    inputValue: {
      get() {
        return this.$attrs.value == null ? '' : this.$attrs.value
      },
      set(val) {
        this.$emit('input', val)
      },
    },
    validateClass() {
      if (!this.rules) {
        return ''
      }
      const rules = this.rules.split('||') || []
      const { isValid } = validate(this.$attrs.value, rules)
      return isValid ? 'is-valid' : 'is-invalid'
    },
    inputClass() {
      return `${this.inputs || ''} ${this.validateClass}`
    },
  },
}
</script>
