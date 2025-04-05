
import { User } from "@/types";

/**
 * Extracts the initials from a user's name
 */
export const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

/**
 * Defines the navigation menu items structure
 */
export interface MenuItem {
  path: string;
  label: string;
  authRequired?: boolean;
  adminRequired?: boolean;
}

/**
 * Default navigation menu items
 */
export const defaultMenuItems: MenuItem[] = [
  { path: "/", label: "Home" },
  { path: "/courts", label: "Find Courts" },
  { path: "/bookings", label: "My Bookings", authRequired: true },
  { path: "/admin", label: "Admin", adminRequired: true },
];
