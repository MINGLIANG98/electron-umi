export default [
  {
    path: "/login",
    component: "@/layouts/BlankLayout",
    routes: [{ path: "/login", component: "login" }],
  },
  {
    path: "/",
    component: "@/layouts/BasicLayout",
    routes: [
      // { path: '/', component: 'home' },
      // { path: '/todo', component: 'todo' },
      {
        path: "/",
        component: "@/layouts/HomeLayout",
        routes: [
          { path: "/", redirect: "/material" },
          { path: "/material", component: "Material" },
          { path: "/product", component: "Product" },
          { path: "/commodity", component: "Commodity" },
        ],
      },
    ],
  },
];
