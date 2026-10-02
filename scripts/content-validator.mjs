const activityTypes = new Set(['text', 'image', 'riddle', 'checklist']);

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function validateActivity(activity, path) {
  if (!activity || typeof activity !== 'object') {
    return [`${path} must be an object.`];
  }

  if (!activityTypes.has(activity.type)) {
    return [`${path}.type must be one of text, image, riddle, or checklist.`];
  }

  if (activity.type === 'text' && !isNonEmptyString(activity.text)) {
    return [`${path}.text is required.`];
  }

  if (activity.type === 'image') {
    const errors = [];
    if (!isNonEmptyString(activity.src))
      errors.push(`${path}.src is required.`);
    if (!isNonEmptyString(activity.alt))
      errors.push(`${path}.alt is required.`);
    return errors;
  }

  if (activity.type === 'riddle' && !isNonEmptyString(activity.question)) {
    return [`${path}.question is required.`];
  }

  if (activity.type === 'checklist') {
    if (!Array.isArray(activity.items) || activity.items.length === 0) {
      return [`${path}.items must contain at least one item.`];
    }
    return activity.items.every(isNonEmptyString)
      ? []
      : [`${path}.items must contain only non-empty strings.`];
  }

  return [];
}

export function validateCalendarContent(content, fileName) {
  const errors = [];
  const prefix = fileName ? `${fileName}: ` : '';

  if (!content || typeof content !== 'object') {
    return [`${prefix}root must be an object.`];
  }

  if (!Number.isInteger(content.year))
    errors.push(`${prefix}year must be an integer.`);
  if (!Array.isArray(content.doors) || content.doors.length !== 24) {
    errors.push(`${prefix}doors must contain exactly 24 doors.`);
    return errors;
  }

  const doorNumbers = new Set();
  content.doors.forEach((door, doorIndex) => {
    const path = `${prefix}doors[${doorIndex}]`;
    if (!door || typeof door !== 'object') {
      errors.push(`${path} must be an object.`);
      return;
    }

    if (!Number.isInteger(door.number) || door.number < 1 || door.number > 24) {
      errors.push(`${path}.number must be an integer from 1 to 24.`);
    } else if (doorNumbers.has(door.number)) {
      errors.push(`${path}.number duplicates door ${door.number}.`);
    } else {
      doorNumbers.add(door.number);
    }

    if (!Array.isArray(door.activities) || door.activities.length === 0) {
      errors.push(`${path}.activities must contain at least one activity.`);
      return;
    }

    door.activities.forEach((activity, activityIndex) => {
      errors.push(
        ...validateActivity(activity, `${path}.activities[${activityIndex}]`),
      );
    });
  });

  return errors;
}
