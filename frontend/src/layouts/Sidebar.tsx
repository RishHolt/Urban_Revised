import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import { ChevronDown, Globe, ShoppingBag } from "lucide-react";
import { useSidebar } from "./Layout";

// Import your routes
import { routes } from "../Routes";

export type RouteItem = {
  id: string;
  path?: string;
  label: string;
  icon?: React.ElementType;
  subItems?: RouteItem[];
  badge?: string | number;
};

import ProfileCard from "./ProfileCard";


// Optimized style classes
const baseLinkClasses = "w-full flex items-center p-2.5 rounded-xl transition-all duration-200 text-sm group";
const activeClasses = "bg-orange-200 text-orange-600 font-semibold";
const inactiveClasses = "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200";

// Utility functions
const hasActiveSubItems = (item: RouteItem, pathname: string): boolean => {
  return item.subItems?.some((sub: RouteItem) => sub.path === pathname) ?? false;
};

// Memoized LinkContent component
const LinkContent = React.memo(({ route }: { route: RouteItem }) => (
  <div className="flex flex-1 items-center space-x-3 min-w-0">
    <div className="flex-shrink-0">
      {route.icon ? (
        <route.icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
      ) : (
        <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
      )}
    </div>
    <span className="font-medium truncate whitespace-nowrap">{route.label}</span>
    {route.badge && (
      <span className="flex-shrink-0 bg-red-500 ml-auto px-2 py-1 rounded-full text-white text-xs">
        {route.badge}
      </span>
    )}
  </div>
));

LinkContent.displayName = 'LinkContent';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isMobile, setSidebarHidden } = useSidebar();
  const [openDropdown, setOpenDropdown] = useState(new Set<string>());
  const sidebarRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const scrollPositionRef = useRef(0);

  // Helper function to safely access badge property
  const getBadge = (route: any): string | number | undefined => {
    return route.badge;
  };

  // Persist dropdown states in localStorage (without browser storage issues)
  useEffect(() => {
    try {
      const savedStates = localStorage.getItem('sidebar-dropdown-states');
      if (savedStates) {
        const parsed = JSON.parse(savedStates);
        setOpenDropdown(new Set(parsed));
      }
    } catch (e) {
      // Silently handle localStorage errors
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('sidebar-dropdown-states', JSON.stringify([...openDropdown]));
    } catch (e) {
      // Silently handle localStorage errors
    }
  }, [openDropdown]);

  // Remember scroll position
  useEffect(() => {
    const nav = navRef.current;
    if (nav) {
      nav.scrollTop = scrollPositionRef.current;
    }
  }, []);

  useEffect(() => {
    const nav = navRef.current;
    const handleScroll = () => {
      if (nav) {
        scrollPositionRef.current = nav.scrollTop;
      }
    };

    nav?.addEventListener('scroll', handleScroll);
    return () => nav?.removeEventListener('scroll', handleScroll);
  }, []);

  // Memoize active states for performance
  const activeStates = useMemo(() => {
    const states: Record<string, boolean> = {};
    routes.forEach(route => {
      states[route.id] = route.path === location.pathname || hasActiveSubItems(route, location.pathname);
    });
    return states;
  }, [location.pathname]);

  // Auto-expand active dropdowns and highlight parent items
  useEffect(() => {
    const newExpanded = new Set(openDropdown);
    routes.forEach(item => {
      if (item.subItems && hasActiveSubItems(item, location.pathname)) {
        newExpanded.add(item.id);
      }
    });
    setOpenDropdown(newExpanded);
  }, [location.pathname]);


  const toggleExpanded = useCallback((item: RouteItem) => {
    setOpenDropdown(prev => {
      const newExpanded = new Set<string>(); // Accordion: always clear others
      if (!prev.has(item.id)) {
        newExpanded.add(item.id);
        // Auto-navigate to first sub-item
        if (item.subItems && item.subItems.length > 0 && !hasActiveSubItems(item, location.pathname)) {
          const firstSubPath = item.subItems[0].path;
          if (firstSubPath) {
            handleNavigation(firstSubPath);
          }
        }
      }
      return newExpanded;
    });
  }, [location.pathname]);

  const handleNavigation = useCallback((path: string) => {
    navigate(path);
    if (isMobile) {
      setSidebarHidden(true);
    }
  }, [navigate, isMobile, setSidebarHidden]);

  const handleNavClick = useCallback((path?: string) => {
    if (path) {
      handleNavigation(path);
    }
  }, [handleNavigation]);

  return (
    <aside
      ref={sidebarRef}
      className="flex flex-col bg-white dark:bg-slate-900 shadow-lg border-slate-200/60 dark:border-slate-700 border-r w-64 h-full"
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Logo Section */}
      <div className="flex flex-shrink-0 items-center px-6 py-5 border-slate-200 dark:border-slate-700 border-b h-20">
        <NavLink 
          to="/" 
          className="group flex items-center space-x-3"
          onClick={() => handleNavClick("/")}
        >
          <div className="flex flex-shrink-0 justify-center items-center bg-orange-500 shadow-lg group-hover:shadow-xl rounded-xl w-11 h-11 font-bold text-white text-xl group-hover:scale-105 transition-all duration-200">
            <Globe className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <h1 className="font-bold dark:group-hover:text-orange-400 dark:text-white group-hover:text-orange-600 text-xl whitespace-nowrap transition-colors duration-200">
              GSM
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs whitespace-nowrap">
              Admin Dashboard
            </p>
          </div>
        </NavLink>
      </div>

      <nav ref={navRef} className="flex flex-col gap-2 px-2 py-4 h-full overflow-y-auto" role="menu">
        {routes.map((route) => {
          const isActiveParent = activeStates[route.id];
          const isDropdownOpen = openDropdown.has(route.id);
          return (
            <div key={route.id} className="relative">
              {route.subItems ? (
                <>
                  <button
                    className={`${baseLinkClasses} ${isActiveParent ? activeClasses : inactiveClasses} justify-between`}
                    onClick={() => toggleExpanded(route)}
                    aria-expanded={isDropdownOpen}
                    aria-controls={`dropdown-${route.id}`}
                    role="menuitem"
                  >
                    <LinkContent route={route} />
                    <ChevronDown 
                      className={`w-4 h-4 flex-shrink-0 transition-all duration-200 ${
                        isDropdownOpen ? 'rotate-180' : ''
                      } ${isActiveParent ? 'text-orange-600' : 'text-gray-400'}`} 
                    />
                  </button>
                  
                  <div
                    id={`dropdown-${route.id}`}
                    className={`ml-6 border-l-2 border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-300 ease-in-out ${
                      isDropdownOpen ? 'max-h-96 opacity-100 mt-2 mb-2' : 'max-h-0 opacity-0'
                    }`}
                    role="menu"
                  >
                    <div className="space-y-1 py-1 pl-4">
                      {route.subItems.map((sub) => (
                        <NavLink
                          key={sub.id}
                          to={sub.path || '#'}
                          onClick={() => handleNavClick(sub.path)}
                          className={({ isActive }) =>
                            `block w-full text-sm text-left p-2.5 pl-4 rounded-lg whitespace-nowrap transition-all duration-200 relative ${
                              isActive 
                                ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 font-semibold border-orange-500" 
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 hover:pl-5"
                            }`
                          }
                          role="menuitem"
                        >
                          <span className="flex justify-between items-center">
                            <span className="flex items-center space-x-2">
                              <span>{sub.label}</span>
                            </span>
                            {getBadge(sub) && (
                              <span className="bg-red-500 ml-2 px-1.5 py-0.5 rounded-full text-white text-xs">
                                {getBadge(sub)}
                              </span>
                            )}
                          </span>
                        </NavLink>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <NavLink
                  to={route.path || '#'}
                  onClick={() => handleNavClick(route.path)}
                  className={({ isActive }) => `${baseLinkClasses} ${isActive ? activeClasses : inactiveClasses}`}
                  role="menuitem"
                >
                  <LinkContent route={route} />
                </NavLink>
              )}
            </div>
          );
        })}
      </nav>

      {/* Enhanced profile section */}
      <div className="pt-4 border-slate-200 dark:border-slate-700 border-t">
        <ProfileCard />
      </div>
    </aside>
  );
}