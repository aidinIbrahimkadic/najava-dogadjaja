import { useContext } from 'react';
import { createContext, useState } from 'react';

const SidebarCollapseContext = createContext();

function SidebarCollapseProvider({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  function toggleCollapsed() {
    setIsCollapsed((prev) => !prev);
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
