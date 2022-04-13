import axios from 'axios';

const API_URL = process.env.API_URL

function returnErrors(error) {
	let { data } = error?.response

	if (!!data && !process.server && !!data?.message) {
		if (Array.isArray(data.message)) {
			data.message.forEach(element => {
				window.$nuxt.$toast.error(element).goAway(2000);
			});
		} else {
			window.$nuxt.$toast.error(data.message).goAway(2000);
		}
	}
	return {
		data: error?.response?.data,
		status: false,
	}
}

export const statue = () => ({})

export const actions = {
	async get({ rootState }, { route, config = {} }) {
		try {
			var token = !!rootState.auth.token ? rootState.auth.token : this.$cookies.get('token')
			config.headers = {
				Authorization: `Bearer ${token}`,
			}
			const { data } = await axios.get(`${API_URL}/${route}`, config);
			return {
				data,
				status: true
			}
		} catch (error) {
			return returnErrors(error)
		}
	},
	async post({ rootState }, { route, body = {}, config = {} }) {
		try {
			var token = !!rootState.auth.token ? rootState.auth.token : this.$cookies.get('token')
			config.headers = {
				Authorization: `Bearer ${token}`,
			}
			const { data } = await axios.post(`${API_URL}/${route}`, body, config);
			return {
				data,
				status: true
			}
		} catch (error) {
			return returnErrors(error)
		}
	},
	async put({ rootState }, { route, body = {}, config = {} }) {
		try {
			var token = !!rootState.auth.token ? rootState.auth.token : this.$cookies.get('token')
			config.headers = {
				Authorization: `Bearer ${token}`,
			}
			const { data } = await axios.put(`${API_URL}/${route}`, body, config);
			return {
				data,
				status: true
			}
		} catch (error) {
			return returnErrors(error)
		}
	},
	async patch({ rootState }, { route, body = {}, config = {} }) {
		try {
			var token = !!rootState.auth.token ? rootState.auth.token : this.$cookies.get('token')
			config.headers = {
				Authorization: `Bearer ${token}`,
			}
			const { data } = await axios.patch(`${API_URL}/${route}`, body, config);
			return {
				data,
				status: true
			}
		} catch (error) {
			return returnErrors(error)
		}
	},
	async delete({ rootState }, { route, body = {}, config = {} }) {
		try {
			var token = !!rootState.auth.token ? rootState.auth.token : this.$cookies.get('token')
			config.headers = {
				Authorization: `Bearer ${token}`,
			}
			const { data } = await axios.delete(`${API_URL}/${route}`, config);
			return {
				data,
				status: true
			}
		} catch (error) {
			return returnErrors(error)
		}
	}
}
