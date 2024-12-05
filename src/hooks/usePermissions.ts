'use client';

import { useAuth } from '@/context/AuthContext';
import { 
  Permission, 
  hasPermission, 
  hasAnyPermission, 
  hasAllPermissions,
  UserRole
} from '@/lib/auth/roles';

export const usePermissions = () => {
  const { user } = useAuth();
  const userRole = user?.role as UserRole || 'user';

  return {
    can: (permission: Permission) => hasPermission(userRole, permission),
    canAny: (permissions: Permission[]) => hasAnyPermission(userRole, permissions),
    canAll: (permissions: Permission[]) => hasAllPermissions(userRole, permissions),
    role: userRole,
  };
};
