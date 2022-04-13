// pomodoro
// long
// short

const DOING = 1
const DONE = 2

const TIMER = {
  pomodoro: {
    tensOfminutes: 2,
    unitsOfminutes: 5,
    // tensOfseconds: 0,
    // unitsOfseconds: 0,
  },
  long: {
    tensOfminutes: 1,
    unitsOfminutes: 5,
    // tensOfseconds: 0,
    // unitsOfseconds: 5,
  },
  short: {
    tensOfminutes: 0,
    unitsOfminutes: 5,
    // tensOfseconds: 0,
    // unitsOfseconds: 5,
  },
};

export const state = () => ({
  toggleTodos: true,
  typeTimer: 'pomodoro',
  todosList: [],
  pomodoro: {
    tensOfminutes: TIMER.pomodoro.tensOfminutes,
    unitsOfminutes: TIMER.pomodoro.unitsOfminutes,
  },  
  long: {
    tensOfminutes: TIMER.long.tensOfminutes,
    unitsOfminutes: TIMER.long.unitsOfminutes,
  },
  short: {
    tensOfminutes: TIMER.short.tensOfminutes,
    unitsOfminutes: TIMER.short.unitsOfminutes,
  },
  sound: null,
  notification: null,
})

export const mutations = {
  CHANGE_TYPE(state, { type }) {
    state.typeTimer = type
  },
  FETCH_DATA(state, { todos = [] }) {
    state.todosList = todos
  },
  UPDATE_TO_LOCAL_STORAGE(state) {
    const todos = JSON.stringify(state.todosList || [])
    localStorage.setItem('pomodotoTodos', todos)
  },
  UPDATE_TODO(state, { id, title, content, est }) {
    const todo = state.todosList.find(item => item.id == id)
    if (!todo) return

    todo.title = title
    todo.content = content
    todo.est = est
  },
  CREATE_TODO(state, { title, content, est, status }) {
    const id = Math.random().toString(36).substr(2)
    state.todosList.push({ id, title, content, est, status })
  },
  DELETE_TODO(state, { id }) {
    const newTodosList = state.todosList.filter(item => item.id != id)
    state.todosList = [...newTodosList]
  },
  TOGGLE_TODOS(state, { val }) {
    state.toggleTodos = val
  },
  FETCH_CLOCKS(state, { pomodoro = null, long = null, short = null }) {
    if (pomodoro) state.pomodoro = pomodoro
    if (long) state.long = long
    if (short) state.short = short
  },
  CHANGE(state, { key, val }) {
    state[key] = val
    if (key === 'sound' || key === 'notification') {
      localStorage.setItem(key, val)
    }
  }
}

export const actions = {
  getData() {
    let todos = JSON.parse(localStorage.getItem('pomodotoTodos') || '[]')
    return todos.filter(item => item)
  },
  async fetchData({ commit, dispatch }) {
    const todos = await dispatch('getData')
    commit('FETCH_DATA', { todos })
    return todos
  },
  async updateTodo({ commit, dispatch }, { id, title, content, est }) {
    commit('UPDATE_TODO', { id, title, content, est })
    commit('UPDATE_TO_LOCAL_STORAGE')
    return await dispatch('fetchData')
  },
  async deleteTodo({ commit, dispatch }, { id }) {
    commit('DELETE_TODO', { id })
    commit('UPDATE_TO_LOCAL_STORAGE')
    return await dispatch('fetchData')
  },
  async createTodo({ commit, dispatch }, { title, content, est, status = DOING }) {
    commit('CREATE_TODO', { title, content, est, status })
    commit('UPDATE_TO_LOCAL_STORAGE')
    return await dispatch('fetchData')
  },
  fetchClocks({ commit, state }) {
    const pomodoro = JSON.parse(localStorage.getItem('pomodoro') || '{}')
    const long = JSON.parse(localStorage.getItem('long') || '{}')
    const short = JSON.parse(localStorage.getItem('short') || '{}')

    if (pomodoro.tensOfminutes || pomodoro.unitsOfminutes) {
      commit('FETCH_CLOCKS', { pomodoro })
    } else {
      localStorage.setItem('pomodoro', JSON.stringify({...state.pomodoro}))
    }

    if (long.tensOfminutes || long.unitsOfminutes) {
      commit('FETCH_CLOCKS', { long })
    } else {
      localStorage.setItem('long', JSON.stringify({...state.long}))
    }

    if (short.tensOfminutes || short.unitsOfminutes) {
      commit('FETCH_CLOCKS', { short })
    } else {
      localStorage.setItem('short', JSON.stringify({...state.short}))
    }
  },
  async updateClocks({ dispatch }, { pomodoro = null, long = null, short = null }) {
    if (pomodoro) {
      localStorage.setItem('pomodoro', JSON.stringify(pomodoro))
    } 
    if (long) {
      localStorage.setItem('long', JSON.stringify(long))
    }
    if (short) {
      localStorage.setItem('short', JSON.stringify(short))
    }
    return await dispatch('fetchClocks') 
  }
}

export const getters = {
  typeTimer: state => state.typeTimer,
  todosList: state => state.todosList,
  toggleTodos: state => state.toggleTodos,
  pomodoro: state => state.pomodoro,
  long: state => state.long,
  short: state => state.short,
  sound: state => state.sound,
  notification: state => state.notification,
}
