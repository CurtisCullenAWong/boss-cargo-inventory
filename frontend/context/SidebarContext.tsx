import { createContext, useContext, useState, ReactNode } from 'react';

interface SidebarContextType {
  expandedGroups: Set<string>;
  toggleGroup: (key: string) => void;
  setGroupExpanded: (key: string, expanded: boolean) => void;
  isMinimized: boolean;
  setIsMinimized: (minimized: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebarContext = () => {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error('useSidebarContext must be used within SidebarProvider');
  return ctx;
};

interface SidebarProviderProps {
  children: ReactNode;
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({ children }) => {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set()
  );
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  const toggleGroup = (key: string) => {
    const newSet = new Set(expandedGroups);
    if (newSet.has(key)) {
      newSet.delete(key);
    } else {
      newSet.add(key);
    }
    setExpandedGroups(newSet);
  };

  const setGroupExpanded = (key: string, expanded: boolean) => {
    const newSet = new Set(expandedGroups);
    if (expanded) {
      newSet.add(key);
    } else {
      newSet.delete(key);
    }
    setExpandedGroups(newSet);
  };

  return (
    <SidebarContext.Provider value={{ expandedGroups, toggleGroup, setGroupExpanded, isMinimized, setIsMinimized }}>
      {children}
    </SidebarContext.Provider>
  );
};
