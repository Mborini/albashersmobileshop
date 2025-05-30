import { Menu } from "@/types/Menu";

export const menuData: Menu[] = [
  {
    id: 1,
    title: "home",
    newTab: false,
    path: "/",
  },
  {
    id: 2,
    title: "common_Brands",
    newTab: false,
        path: "/Brands/AllCommon-Brands-Grid",
  },
  {
    id: 3,
    title: "contact",
    newTab: false,
    path: "/contact",
  },
  {
    id: 6,
    title: "pages",
    newTab: false,
    path: "/",
    submenu: [
      {
        id: 62,
        title: "Error",
        newTab: false,
        path: "/error",
      },
      {
        id: 63,
        title: "Mail Success",
        newTab: false,
        path: "/mail-success",
      },
    ],
  }
];
