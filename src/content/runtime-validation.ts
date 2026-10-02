import type { Activity, CalendarDoor } from './types';

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isValidActivity(activity: unknown): activity is Activity {
  if (!activity || typeof activity !== 'object' || !('type' in activity)) {
    return false;
  }

  if (activity.type === 'text') {
    return 'text' in activity && isNonEmptyString(activity.text);
  }

  if (activity.type === 'image') {
    return (
      'src' in activity &&
      'alt' in activity &&
      isNonEmptyString(activity.src) &&
      isNonEmptyString(activity.alt)
    );
  }

  if (activity.type === 'riddle') {
    return 'question' in activity && isNonEmptyString(activity.question);
  }

  return (
    activity.type === 'checklist' &&
    'items' in activity &&
    Array.isArray(activity.items) &&
    activity.items.length > 0 &&
    activity.items.every(isNonEmptyString)
  );
}

export function isValidCalendarDoor(door: unknown): door is CalendarDoor {
  if (!door || typeof door !== 'object' || !('activities' in door)) {
    return false;
  }

  return (
    Array.isArray(door.activities) &&
    door.activities.length > 0 &&
    door.activities.every(isValidActivity)
  );
}
