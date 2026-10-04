export interface YearProgress {
  openedDoors: number[];
  completedActivities: string[];
}

interface ProgressStore {
  version: 1;
  years: Record<string, YearProgress>;
}

const STORAGE_KEY = 'advent-calendar-progress';
const EMPTY_PROGRESS: YearProgress = {
  openedDoors: [],
  completedActivities: [],
};

function createEmptyProgress(): YearProgress {
  return {
    openedDoors: [],
    completedActivities: [],
  };
}

function isYearProgress(value: unknown): value is YearProgress {
  if (!value || typeof value !== 'object') {
    return false;
  }

  return (
    'openedDoors' in value &&
    Array.isArray(value.openedDoors) &&
    value.openedDoors.every((doorNumber) => Number.isInteger(doorNumber)) &&
    'completedActivities' in value &&
    Array.isArray(value.completedActivities) &&
    value.completedActivities.every(
      (activityKey) => typeof activityKey === 'string',
    )
  );
}

function readStore(storage: Storage): ProgressStore {
  const serializedStore = storage.getItem(STORAGE_KEY);

  if (serializedStore === null) {
    return { version: 1, years: {} };
  }

  try {
    const parsedStore: unknown = JSON.parse(serializedStore);

    if (
      parsedStore &&
      typeof parsedStore === 'object' &&
      'version' in parsedStore &&
      parsedStore.version === 1 &&
      'years' in parsedStore &&
      parsedStore.years &&
      typeof parsedStore.years === 'object'
    ) {
      return parsedStore as ProgressStore;
    }
  } catch {
    return { version: 1, years: {} };
  }

  return { version: 1, years: {} };
}

export function loadYearProgress(
  year: number,
  storage: Storage | undefined = globalThis.localStorage,
): YearProgress {
  if (storage === undefined) {
    return createEmptyProgress();
  }

  const progress = readStore(storage).years[String(year)];

  if (!isYearProgress(progress)) {
    return createEmptyProgress();
  }

  return {
    openedDoors: [...progress.openedDoors],
    completedActivities: [...progress.completedActivities],
  };
}

export function saveYearProgress(
  year: number,
  progress: YearProgress,
  storage: Storage | undefined = globalThis.localStorage,
): void {
  if (storage === undefined) {
    return;
  }

  const store = readStore(storage);
  store.years[String(year)] = {
    openedDoors: [...progress.openedDoors],
    completedActivities: [...progress.completedActivities],
  };
  storage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function getEmptyProgress(): YearProgress {
  return { ...EMPTY_PROGRESS, openedDoors: [], completedActivities: [] };
}
