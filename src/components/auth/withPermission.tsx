'use client';

import { usePermissions } from '@/hooks/usePermissions';
import { Permission } from '@/lib/auth/roles';

interface WithPermissionProps {
  permissions: Permission | Permission[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
}

export const withPermission = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  { permissions, requireAll = false, fallback = null }: WithPermissionProps
) => {
  return function WithPermissionComponent(props: P) {
    const { can, canAll, canAny } = usePermissions();

    const hasRequiredPermissions = Array.isArray(permissions)
      ? requireAll
        ? canAll(permissions)
        : canAny(permissions)
      : can(permissions);

    if (!hasRequiredPermissions) {
      return fallback;
    }

    return <WrappedComponent {...props} />;
  };
};

export const PermissionGate: React.FC<WithPermissionProps & { children: React.ReactNode }> = ({
  children,
  permissions,
  requireAll = false,
  fallback = null,
}) => {
  const { can, canAll, canAny } = usePermissions();

  const hasRequiredPermissions = Array.isArray(permissions)
    ? requireAll
      ? canAll(permissions)
      : canAny(permissions)
    : can(permissions);

  if (!hasRequiredPermissions) {
    return fallback;
  }

  return <>{children}</>;
};
