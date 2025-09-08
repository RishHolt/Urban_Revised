import MainDashboard from "./pages/MainDashboard";
import BuildingDashboard from "./pages/building/BuildingDashboard";
import ZoningDashboard from "./pages/zoning/ZoningDashboard";
import Applications from "./pages/zoning/Application";
import CoordinationDashboard from "./pages/coordination/CoordinationDashboard";
import HousingDashboard from "./pages/housing/HousingDashboard";
import OccupancyDashboard from "./pages/occupancy/OccupancyDashboard";

import {
  LayoutDashboard,
  HardHat,
  Locate,
  Building,
  Home,
  Briefcase,
  Settings,
} from "lucide-react";

export const routes = [
  {
    id: "main-dashboard",
    path: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
    element: <MainDashboard />,
  },
  {
    id: "zoning",
    label: "Zoning Clearance",
    icon: Locate,
    subItems: [
      {
        id: "zoning-dashboard",
        path: "/zoning/dashboard",
        label: "Dashboard",
        element: <ZoningDashboard />,
      },
      {
        id: "zoning-applications",
        path: "/zoning/applications",
        label: "Applications",
        element: <Applications />,
      },
    ],
  },
  {
    id: "building",
    label: "Building Review",
    icon: HardHat,
    subItems: [
      {
        id: "building-dashboard",
        path: "/building/dashboard",
        label: "Dashboard",
        element: <BuildingDashboard />,
      },
    ],
  },
  {
    id: "housing",
    label: "Housing Beneficiary",
    icon: Home,
    subItems: [
      {
        id: "housing-dashboard",
        path: "/housing/dashboard",
        label: "Dashboard",
        element: <HousingDashboard />,
      },
    ],
  },
  {
    id: "occupancy",
    label: "Occupancy Monitoring",
    icon: Building,
    subItems: [
      {
        id: "occupancy-dashboard",
        path: "/occupancy/dashboard",
        label: "Dashboard",
        element: <OccupancyDashboard />,
      },
    ],
  },
  {
    id: "coordination",
    label: "Project Coordination",
    icon: Briefcase,
    subItems: [
      {
        id: "coordination-dashboard",
        path: "/coordination/dashboard",
        label: "Dashboard",
        element: <CoordinationDashboard />,
      },
    ],
  },
  {
    id: "settings",
    path: "/settings",
    label: "Settings",
    icon: Settings,
    element: <div>Settings Page</div>,
  },
];