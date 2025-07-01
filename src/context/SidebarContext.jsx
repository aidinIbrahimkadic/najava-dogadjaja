import { useContext, useEffect, useState, createContext } from 'react';

const SidebarCollapseContext = createContext();

function SidebarCollapseProvider({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('isCollapsed');
    setIsCollapsed(stored === 'true');
  }, []);

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

// eslint-disable-next-line react-refresh/only-export-components
export { SidebarCollapseProvider, useSidebarCollapsed };
