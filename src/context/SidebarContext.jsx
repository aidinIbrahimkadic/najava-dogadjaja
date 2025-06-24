import { useContext } from 'react';
import { createContext, useState } from 'react';

const SidebarCollapseContext = createContext();

function SidebarCollapseProvider({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const stored = localStorage.getItem('isCollapsed');
    return stored === 'true';
  });

  function toggleCollapsed() {
    setIsCollapsed((prev) => {
      const newValue = !prev;
      localStorage.setItem('isCollapsed', JSON.stringify(newValue));
      return newValue;
    });
  }

  return (
    <SidebarCollapseContext.Provider value={{ isCollapsed, toggleCollapsed }}>
      {children}
    </SidebarCollapseContext.Provider>
  );
}

function useSidebarCollapsed() {
  const context = useContext(SidebarCollapseContext);
  if (context === undefined)
    throw new Error('SidebarCollapseContext was used outside of SidebarCollapseProvider');
  return context;
}

export { SidebarCollapseProvider, useSidebarCollapsed };
