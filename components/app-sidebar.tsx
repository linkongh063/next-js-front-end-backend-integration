"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
const data = {
  user: {
    name: "Admin User",
    email: "admin@ecommerce.com",
    avatar: "/avatars/admin.jpg",
  },
  teams: [
    {
      name: "Ecom BD",
      logo: PieChart,
      plan: "Pro",
    },
    {
      name: "Warehouse Unit",
      logo: Map,
      plan: "Basic",
    },
  ],
  navMain: [
    {
      title: "Admin",
      url: "/dashboard",
      icon: SquareTerminal,
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
        },
      ],
    },
    {
      title: "Orders",
      url: "/dashboard/orders",
      icon: BookOpen,
      items: [
        {
          title: "All Orders",
          url: "/dashboard/orders",
        },
        {
          title: "Pending Orders",
          url: "/dashboard/orders/pending",
        },
        {
          title: "Completed Orders",
          url: "/dashboard/orders/completed",
        },
      ],
    },
    {
      title: "Manage Products",
      url: "/dashboard/products",
      icon: Bot,
      items: [
        {
          title: "All Product",
          url: "/products",
        },
        {
          title: "Variant & Stock",
          url: "/product-variant",
        },
        {
          title: "Categories",
          url: "/categories",
        },
        {
          title: "Brands",
          url: "/brands",
        },
      ],
    },
    {
      title: "Customers & Reviews",
      url: "/dashboard/customers",
      icon: GalleryVerticalEnd,
      items: [
        {
          title: "Customer List",
          url: "/customers",
        },
        {
          title: "Reviews",
          url: "/dashboard/reviews",
        },
      ],
    },
    // {
    //   title: "Analytics",
    //   url: "/dashboard/analytics",
    //   icon: PieChart,
    // },
    // {
    //   title: "Marketing",
    //   url: "/dashboard/marketing",
    //   icon: AudioWaveform,
    //   items: [
    //     {
    //       title: "Campaigns",
    //       url: "/dashboard/marketing/campaigns",
    //     },
    //     {
    //       title: "Coupons",
    //       url: "/dashboard/marketing/coupons",
    //     },
    //     {
    //       title: "Banners",
    //       url: "/dashboard/marketing/banners",
    //     },
    //   ],
    // },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings2,
      items: [
        {
          title: "General Settings",
          url: "/dashboard/settings/general",
        },
        {
          title: "Shipping",
          url: "/dashboard/settings/shipping",
        },
        {
          title: "Payments",
          url: "/dashboard/settings/payments",
        },
        {
          title: "Tax",
          url: "/dashboard/settings/tax",
        },
        {
          title: "Admin Users",
          url: "/dashboard/settings/admins",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Flash Sale Setup",
      url: "/dashboard/marketing/flash-sale",
      icon: Frame,
    },
    // {
    //   name: "Featured Products",
    //   url: "/dashboard/products/featured",
    //   icon: BookOpen,
    // },
    // {
    //   name: "Return & Refund Management",
    //   url: "/dashboard/orders/returns",
    //   icon: Command,
    // },
  ],
};
// This is sample data.
// const data = {
//   user: {
//     name: "shadcn",
//     email: "m@example.com",
//     avatar: "/avatars/shadcn.jpg",
//   },
//   teams: [
//     {
//       name: "Acme Inc",
//       logo: GalleryVerticalEnd,
//       plan: "Enterprise",
//     },
//     {
//       name: "Acme Corp.",
//       logo: AudioWaveform,
//       plan: "Startup",
//     },
//     {
//       name: "Evil Corp.",
//       logo: Command,
//       plan: "Free",
//     },
//   ],
//   navMain: [
//     {
//       title: "Playground",
//       url: "#",
//       icon: SquareTerminal,
//       isActive: true,
//       items: [
//         {
//           title: "History",
//           url: "#",
//         },
//         {
//           title: "Starred",
//           url: "#",
//         },
//         {
//           title: "Settings",
//           url: "#",
//         },
//       ],
//     },
//     {
//       title: "Models",
//       url: "#",
//       icon: Bot,
//       items: [
//         {
//           title: "Genesis",
//           url: "#",
//         },
//         {
//           title: "Explorer",
//           url: "#",
//         },
//         {
//           title: "Quantum",
//           url: "#",
//         },
//       ],
//     },
//     {
//       title: "Documentation",
//       url: "#",
//       icon: BookOpen,
//       items: [
//         {
//           title: "Introduction",
//           url: "#",
//         },
//         {
//           title: "Get Started",
//           url: "#",
//         },
//         {
//           title: "Tutorials",
//           url: "#",
//         },
//         {
//           title: "Changelog",
//           url: "#",
//         },
//       ],
//     },
//     {
//       title: "Settings",
//       url: "#",
//       icon: Settings2,
//       items: [
//         {
//           title: "General",
//           url: "#",
//         },
//         {
//           title: "Team",
//           url: "#",
//         },
//         {
//           title: "Billing",
//           url: "#",
//         },
//         {
//           title: "Limits",
//           url: "#",
//         },
//       ],
//     },
//   ],
//   projects: [
//     {
//       name: "Design Engineering",
//       url: "#",
//       icon: Frame,
//     },
//     {
//       name: "Sales & Marketing",
//       url: "#",
//       icon: PieChart,
//     },
//     {
//       name: "Travel",
//       url: "#",
//       icon: Map,
//     },
//   ],
// }

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
