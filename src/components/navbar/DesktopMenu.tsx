
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { MenuItem } from "./NavbarUtils";
import { UserMenu } from "./UserMenu";
import { useAuth } from "@/contexts/AuthContext";

interface DesktopMenuProps {
  menuItems: MenuItem[];
  currentPath: string;
}

export const DesktopMenu: React.FC<DesktopMenuProps> = ({ 
  menuItems, 
  currentPath 
}) => {
  const { user, isAdmin } = useAuth();

  return (
    <div className="hidden md:flex items-center space-x-1">
      <div className="flex space-x-1">
        {menuItems.map((item) => {
          if (
            (item.authRequired && !user) ||
            (item.adminRequired && !isAdmin)
          ) {
            return null;
          }
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                currentPath === item.path
                  ? "bg-primary/10 text-primary"
                  : "text-foreground/80 hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="pl-4 ml-4 border-l">
        <UserMenu />
      </div>
    </div>
  );
};
