import { MaterialCommunityIcons } from '@expo/vector-icons';

// --- SIDEBAR CONFIGURATION ---

export type SidebarConfigItem = {
  key: string;
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  position: 'top' | 'bottom';
  children?: SidebarConfigItem[];
};

export const ADMIN_SIDEBAR_CONFIG: SidebarConfigItem[] = [
  {
    key: 'Dashboard',
    label: 'Dashboard',
    icon: 'view-dashboard',
    position: 'top',
  },

  {
    key: 'Operations',
    label: 'Operations',
    icon: 'swap-horizontal',
    position: 'top',
    children: [
      {
        key: 'Stock Inbound',
        label: 'Stock Inbound',
        icon: 'truck-plus',
        position: 'top',
      },
      {
        key: 'Item Issuance',
        label: 'Item Issuance',
        icon: 'file-document-alert',
        position: 'top',
      },
      {
        key: 'Stock Outbound',
        label: 'Stock Outbound',
        icon: 'truck-minus',
        position: 'top',
      },
    ],
  },

  {
    key: 'Inventory',
    label: 'Inventory',
    icon: 'clipboard-list',
    position: 'top',
    children: [
      {
        key: 'Item Registration',
        label: 'Item Registration',
        icon: 'database-plus',
        position: 'top',
      },
      {
        key: 'Inventory Stock',
        label: 'Inventory Stock',
        icon: 'warehouse',
        position: 'top',
      },
    ],
  },

  {
    key: 'System',
    label: 'System',
    icon: 'cogs',
    position: 'top',
    children: [
      {
        key: 'User Management',
        label: 'User Management',
        icon: 'account-group',
        position: 'top',
      },
      {
        key: 'Audit Logs',
        label: 'Audit Logs',
        icon: 'clipboard-text-clock',
        position: 'top',
      },
      {
        key: 'Profile',
        label: 'Profile',
        icon: 'account-circle',
        position: 'top',
      },
    ],
  },

  {
    key: 'Logout',
    label: 'Logout',
    icon: 'logout',
    position: 'bottom',
  },
];

