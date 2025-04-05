
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { DesktopMenu } from "./DesktopMenu";
import { MobileMenu } from "./MobileMenu";
import { defaultMenuItems } from "./NavbarUtils";

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-background border-b shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">FC</span>
            </div>
            <span className="font-bold text-xl hidden sm:block">FutsalConnect</span>
          </Link>

          {/* Desktop Menu */}
          <DesktopMenu 
            menuItems={defaultMenuItems} 
            currentPath={location.pathname} 
          />

          {/* Mobile Menu */}
          <MobileMenu 
            menuItems={defaultMenuItems}
            currentPath={location.pathname}
            isOpen={isMobileMenuOpen}
            toggleMenu={toggleMobileMenu}
          />
        </div>
      </div>
    </nav>
  );
};
