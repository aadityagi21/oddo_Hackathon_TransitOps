/**
 * Application-wide constants – roles, statuses, permissions.
 * Used across models, services, and RBAC middleware (Phase 2+).
 */

// ─── User Roles ───────────────────────────────────────────────
export const ROLES = {
  ADMIN: 'admin',
  FLEET_MANAGER: 'fleet_manager',
  DISPATCHER: 'dispatcher',
  SAFETY_OFFICER: 'safety_officer',
  FINANCIAL_ANALYST: 'financial_analyst',
};

export const ROLE_LIST = Object.values(ROLES);

// ─── Vehicle Status ───────────────────────────────────────────
export const VEHICLE_STATUS = {
  AVAILABLE: 'available',
  ON_TRIP: 'on_trip',
  IN_SHOP: 'in_shop',
  RETIRED: 'retired',
};

// ─── Driver Status ────────────────────────────────────────────
export const DRIVER_STATUS = {
  AVAILABLE: 'available',
  ON_TRIP: 'on_trip',
  OFF_DUTY: 'off_duty',
  SUSPENDED: 'suspended',
};

// ─── Trip Status ──────────────────────────────────────────────
export const TRIP_STATUS = {
  DRAFT: 'draft',
  DISPATCHED: 'dispatched',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

// ─── Maintenance Status ───────────────────────────────────────
export const MAINTENANCE_STATUS = {
  OPEN: 'open',
  CLOSED: 'closed',
};

// ─── Expense Types ────────────────────────────────────────────
export const EXPENSE_TYPES = {
  MAINTENANCE: 'maintenance',
  TOLL: 'toll',
  FUEL: 'fuel',
  OTHER: 'other',
};

// ─── RBAC Permission Matrix (Phase 2+) ────────────────────────
export const PERMISSIONS = {
  [ROLES.ADMIN]: ['*'],
  [ROLES.FLEET_MANAGER]: [
    'dashboard', 'vehicles', 'drivers', 'trips:read',
    'maintenance', 'fuel', 'expenses:read', 'reports:utilization',
  ],
  [ROLES.DISPATCHER]: [
    'dashboard', 'vehicles:read', 'drivers:read', 'trips',
  ],
  [ROLES.SAFETY_OFFICER]: [
    'dashboard', 'vehicles:read', 'drivers:read', 'drivers:suspend', 'trips:read',
  ],
  [ROLES.FINANCIAL_ANALYST]: [
    'dashboard', 'fuel:read', 'expenses', 'reports',
  ],
};
