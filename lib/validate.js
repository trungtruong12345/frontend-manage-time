const validators = {
  /**
   * Check value is valid with regex
   *
   * @param   {String | Number}  value  input value
   * @param   {String}  regex  String RegexPatern
   *
   * @return  {Boolean}  validate after regex validation
   */
  regex: (value, regex) => {
    // it don`t have regex validation
    if (!regex) {
      return true
    }

    // if have regex then
    if (!value) {
      return false
    }

    const strValue = value.toString()
    const r = strValue.match(regex)

    return r !== null
  },
  minLength: (value, len) => {
    if (typeof value === 'number') {
      value = value.toString()
    }
    return (value ? value.length : 0) >= len
  },
  maxLength: (value, len) => {
    if (typeof value === 'number') {
      value = value.toString()
    }
    return (value ? value.length : 0) <= len
  },
  minNumber: (value, num) => {
    return parseInt(value) >= num
  },
  maxNumber: (value, num) => {
    return parseInt(value) <= num
  },
  required: (value) => {
    if (Array.isArray(value)) {
      return !!value.length
    }
    if (value == null) {
      return false
    }
    return true
  },
  notEmpty: (value) => {
    if (value == null) {
      return false
    }
    if (typeof value === 'string' && value === '') {
      return false
    }
    return true
  },
  type: (value, type) => {
    if (value === undefined || value === null) {
      return false
    }
    if (typeof value === 'string' && type === 'string') {
      return true
    }
    if (typeof value === 'number' && type === 'number') {
      return true
    }
    if (typeof value === 'object' && type === 'object') {
      return true
    }
    if (typeof value === 'boolean' && type === 'boolean') {
      return true
    }
    return false
  },
}

const validateReturnFormat = (isValid = false, ...params) => {
  return {
    ...params,
    isValid,
  }
}

/**
 * Validate
 *
 * @param {any} value
 * @param {string} rules format `rules:params`
 */
 const validate = (value, rules) => {
  if (value == null && rules == null) {
    return validateReturnFormat(true)
  }
  for (const rule of rules) {
    const params = rule.split(':')
    if (validators[params[0]]) {
      if (!validators[params[0]](value, params[params.length - 1])) {
        return validateReturnFormat(false)
      }
    }
  }
  return validateReturnFormat(true)
}

module.exports = {
  validators,
  validate,
}
