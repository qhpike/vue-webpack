const getters = {
    token: state => state.user.token,
    roles: state => state.user.roles,
    name: state => state.user.name,
    avatar: state => state.user.avatar,
    permission_routes: state => state.user.routes,
    sidebar: state => state.app.sidebar
}
export default getters