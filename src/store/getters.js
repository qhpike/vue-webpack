const getters = {
    token: state => state.user.token,
    roles: state => state.user.roles,
    name: state => state.user.name,
    avatar: state => state.user.avatar,
    permission_routes: state => state.user.routes,
    sidebar: state => state.app.sidebar,
    areaId: state => state.user.areaId,
    perms: state => state.user.perms,
    isRoot: state => state.user.isRoot,
}
export default getters