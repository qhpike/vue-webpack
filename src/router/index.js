/*
 * @Author: akexian
 * @Date: 2022-07-18
 * @Description:
 */
import Vue from "vue";
import VueRouter from "vue-router";
const originPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originPush.call(this, location).catch((err) => err);
};

Vue.use(VueRouter);

export const constantRoutes = [
  {
    path: "/login",
    component: () => import("@/views/login"),
    hidden: true,
  },
  {
    path: "/",
    component: () => import("@/Layout"),
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/views/dashboard/index"),
        meta: { title: "Dashboard", icon: "dashboard", affix: true },
      },
    ],
  },

  { path: "/404", component: () => import("@/views/404") },
];
// 添加页面时，在此处录入路径及对应组件
export const asyncRoutesMap = {
  菜单管理: "/system/auth/menu",
  用户管理: "/system/auth/users",
  用户日志: "/system/logo",
  部门管理: "/system/dept",
  角色管理: "/system/auth/roles",
  商品分类: "/product/category",
  商品组: "/product/productSpu",
  商品管理: "/product/productSku",
  轮播图: "/product/mallBanner",
  订单管理: "/orderManager",
};
const createRouter = () =>
  new VueRouter({
    mode: "hash",
    routes: constantRoutes,
  });

const router = createRouter();
console.log(router, "router-all");

export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // the relevant part
}
export default router;
