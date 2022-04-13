export default async ({ store, redirect, app }) => {
	const token = app.$cookies.get("token")
	if (!token) {
		redirect('/login');
	}
};
