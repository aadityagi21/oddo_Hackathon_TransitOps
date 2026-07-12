/**
 * Application constants – roles, statuses, navigation items.
 */

export const ROLES = {
  ADMIN: 'admin',
  FLEET_MANAGER: 'fleet_manager',
  DISPATCHER: 'dispatcher',
  SAFETY_OFFICER: 'safety_officer',
  FINANCIAL_ANALYST: 'financial_analyst',
};

export const VEHICLE_STATUS = {
  AVAILABLE: 'available',
  ON_TRIP: 'on_trip',
  IN_SHOP: 'in_shop',
  RETIRED: 'retired',
};

export const DRIVER_STATUS = {
  AVAILABLE: 'available',
  ON_TRIP: 'on_trip',
  OFF_DUTY: 'off_duty',
  SUSPENDED: 'suspended',
};

export const TRIP_STATUS = {
  DRAFT: 'draft',
  DISPATCHED: 'dispatched',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

/** Sidebar navigation – filtered by role in Phase 2 */
export const NAV_ITEMS = [
  { label: 'Dashboard', path: '/', icon: '📊' },
  { label: 'Vehicles', path: '/vehicles', icon: '🚛' },
  { label: 'Drivers', path: '/drivers', icon: '👤' },
  { label: 'Trips', path: '/trips', icon: '🗺️' },
  { label: 'Maintenance', path: '/maintenance', icon: '🔧' },
  { label: 'Fuel Logs', path: '/fuel', icon: '⛽' },
  { label: 'Expenses', path: '/expenses', icon: '💰' },
  { label: 'Reports', path: '/reports', icon: '📈' },
];
