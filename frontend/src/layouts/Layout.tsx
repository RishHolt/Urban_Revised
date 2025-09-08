import React, { useState, useEffect, createContext, useContext } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { motion, AnimatePresence } from "framer-motion";

// Create a context for sidebar state management
interface SidebarContextType {
  sidebarHidden: boolean;
  setSidebarHidden: (hidden: boolean) => void;
  isMobile: boolean;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarHidden, setSidebarHidden] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Auto-hide sidebar on mobile
      if (mobile) {
        setSidebarHidden(true);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Persist sidebar state in localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-hidden');
    if (saved !== null && !isMobile) {
      setSidebarHidden(JSON.parse(saved));
    }
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile) {
      localStorage.setItem('sidebar-hidden', JSON.stringify(sidebarHidden));
    }
  }, [sidebarHidden, isMobile]);

  const handleToggleSidebar = () => {
    setSidebarHidden((prev) => !prev);
  };

  // Close sidebar when clicking outside on mobile
  const handleBackdropClick = () => {
    if (isMobile && !sidebarHidden) {
      setSidebarHidden(true);
    }
  };

  return (
    <SidebarContext.Provider value={{ sidebarHidden, setSidebarHidden, isMobile }}>
      <div className="flex flex-row bg-gray-50 dark:bg-gray-900 h-screen">
        {/* Mobile backdrop */}
        <AnimatePresence>
          {isMobile && !sidebarHidden && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden z-40 fixed inset-0 bg-black/50"
              onClick={handleBackdropClick}
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <AnimatePresence initial={false}>
          {!sidebarHidden && (
            <motion.div
              key="sidebar"
              initial={isMobile ? { x: -256, opacity: 0 } : { width: 0, opacity: 0 }}
              animate={isMobile ? { x: 0, opacity: 1 } : { width: 256, opacity: 1 }}
              exit={isMobile ? { x: -256, opacity: 0 } : { width: 0, opacity: 0 }}
              transition={{ 
                duration: isMobile ? 0.25 : 0.3, 
                ease: "easeInOut",
                opacity: { duration: isMobile ? 0.2 : 0.3 }
              }}
              className={`h-full overflow-hidden ${
                isMobile ? 'fixed left-0 top-0 z-50' : 'relative'
              }`}
            >
              <div className="w-64 h-full">
                <Sidebar />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Main content */}
        <motion.div 
          className="relative flex flex-col flex-1 min-w-0"
          layout={!isMobile}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <Header onToggleSidebar={handleToggleSidebar} />
          <main className="flex-1 overflow-auto">
            <motion.div 
              className="p-4 md:p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              {children}
            </motion.div>
          </main>
        </motion.div>
      </div>
    </SidebarContext.Provider>
  );
}