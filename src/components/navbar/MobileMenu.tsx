
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { MenuItem } from "./NavbarUtils";
import { UserMenu } from "./UserMenu";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

interface MobileMenuProps {
  menuItems: MenuItem[];
  currentPath: string;
  isOpen: boolean;
  toggleMenu: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  menuItems,
  currentPath,
  isOpen,
  toggleMenu,
}) => {
  const { user, isAdmin } = useAuth();

  return (
    <div className="md:hidden">
      <div className="flex items-center">
        {user && <UserMenu isMobile />}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleMenu}
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {isOpen && (
        <div className="pt-4 pb-3 border-t mt-4">
          <div className="flex flex-col space-y-2">
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
                    "px-4 py-2 rounded-md text-sm font-medium",
                    currentPath === item.path
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/80 hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            {!user && (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
