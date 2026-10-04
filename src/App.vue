<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { getApplicationDate } from './calendar/application-date';
import {
  getCurrentCalendarYear,
  getDaysUntilNextAdventStart,
  isDoorAvailable,
  isOutsideAdventPeriod,
} from './calendar/date-logic';
import type { Activity, CalendarDoor } from './content/types';
import { getCalendarContent } from './content/calendar-loader';
import { isValidCalendarDoor } from './content/runtime-validation';
import {
  loadYearProgress,
  saveYearProgress,
} from './progress/progress-storage';

const today = ref(getApplicationDate());
const currentYear = computed(() => getCurrentCalendarYear(today.value));
const calendarContent = computed(() => getCalendarContent(currentYear.value));
const selectedDoorNumber = ref<number | null>(null);
const progress = ref(loadYearProgress(currentYear.value));
const closeButton = ref<HTMLButtonElement | null>(null);
const previouslyFocusedElement = ref<HTMLElement | null>(null);
const isOutsideAdvent = computed(() => isOutsideAdventPeriod(today.value));
const daysUntilAdvent = computed(() =>
  getDaysUntilNextAdventStart(today.value),
);

function isAvailable(doorNumber: number): boolean {
  if (calendarContent.value === null) {
    return false;
  }

  return isDoorAvailable(calendarContent.value.year, doorNumber, today.value);
}

function getDoor(doorNumber: number): CalendarDoor | null {
  if (calendarContent.value === null) {
    return null;
  }

  const door = calendarContent.value.doors.find(
    (candidate) => candidate.number === doorNumber,
  );

  if (door === undefined || !isValidDoor(door)) {
    return null;
  }

  return door;
}

function isValidDoor(door: CalendarDoor): boolean {
  return isValidCalendarDoor(door);
}

function openDoor(doorNumber: number, event: MouseEvent): void {
  if (!canOpenDoor(doorNumber)) {
    return;
  }

  previouslyFocusedElement.value = event.currentTarget as HTMLElement;
  selectedDoorNumber.value = doorNumber;
  if (!progress.value.openedDoors.includes(doorNumber)) {
    progress.value.openedDoors.push(doorNumber);
    saveProgress();
  }

  void nextTick(() => {
    closeButton.value?.focus();
  });
}

function closeDoor(): void {
  selectedDoorNumber.value = null;
  void nextTick(() => {
    previouslyFocusedElement.value?.focus();
    previouslyFocusedElement.value = null;
  });
}

function handleModalKeydown(event: KeyboardEvent): void {
  if (selectedDoorNumber.value !== null && event.key === 'Escape') {
    closeDoor();
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleModalKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleModalKeydown);
});

function getActivityKey(doorNumber: number, activityIndex: number): string {
  return `${currentYear.value}-${doorNumber}-${activityIndex}`;
}

function getChecklistItemKey(
  doorNumber: number,
  activityIndex: number,
  itemIndex: number,
): string {
  return `${getActivityKey(doorNumber, activityIndex)}-${itemIndex}`;
}

function isActivityCompleted(activityKey: string): boolean {
  return progress.value.completedActivities.includes(activityKey);
}

function isChecklistItemCompleted(itemKey: string): boolean {
  return isActivityCompleted(itemKey);
}

function toggleCompletedActivity(activityKey: string): void {
  const activityIndex = progress.value.completedActivities.indexOf(activityKey);

  if (activityIndex >= 0) {
    progress.value.completedActivities.splice(activityIndex, 1);
  } else {
    progress.value.completedActivities.push(activityKey);
  }

  saveProgress();
}

function toggleChecklistItem(itemKey: string): void {
  toggleCompletedActivity(itemKey);
}

function isDoorCompleted(door: CalendarDoor): boolean {
  if (!isValidDoor(door)) {
    return false;
  }

  return door.activities.every((activity, activityIndex) => {
    const activityKey = getActivityKey(door.number, activityIndex);

    if (activity.type !== 'checklist') {
      return isActivityCompleted(activityKey);
    }

    return activity.items.every((_item, itemIndex) => {
      return isChecklistItemCompleted(
        getChecklistItemKey(door.number, activityIndex, itemIndex),
      );
    });
  });
}

function isDoorOpened(doorNumber: number): boolean {
  return progress.value.openedDoors.includes(doorNumber);
}

function canOpenDoor(doorNumber: number): boolean {
  return isAvailable(doorNumber) || isDoorOpened(doorNumber);
}

function getDoorState(
  door: CalendarDoor,
): 'locked' | 'available' | 'opened' | 'completed' {
  if (isDoorCompleted(door)) {
    return 'completed';
  }

  if (isDoorOpened(door)) {
    return 'opened';
  }

  if (isAvailable(door.number)) {
    return 'available';
  }

  return 'locked';
}

function getDoorIcon(
  state: 'locked' | 'available' | 'opened' | 'completed',
): string {
  if (state === 'locked') {
    return '🔒';
  }

  if (state === 'available') {
    return '✨';
  }

  if (state === 'opened') {
    return '↺';
  }

  return '✓';
}

function saveProgress(): void {
  saveYearProgress(currentYear.value, progress.value);
}

const selectedDoor = computed(() => {
  if (selectedDoorNumber.value === null) {
    return null;
  }

  return getDoor(selectedDoorNumber.value);
});

function getActivityLabel(activity: Activity): string {
  if (activity.type === 'text') {
    return 'Message';
  }

  if (activity.type === 'image') {
    return 'Image';
  }

  if (activity.type === 'riddle') {
    return 'Riddle';
  }

  return 'Checklist';
}
</script>

<template>
  <main class="calendar-page">
    <header class="calendar-header">
      <p class="eyebrow">A little festive moment every day</p>
      <h1>{{ currentYear }} Advent Calendar</h1>
      <p v-if="isOutsideAdvent" class="countdown">
        {{ daysUntilAdvent }} days until December 1.
      </p>
    </header>

    <p v-if="calendarContent === null" class="calendar-error" role="alert">
      No calendar content is configured for {{ currentYear }}.
    </p>

    <section v-else class="door-grid" aria-label="Advent doors">
      <article
        v-for="door in calendarContent.doors"
        :key="door.number"
        class="door"
        :class="`door--${getDoorState(door)}`"
        :aria-label="`Door ${door.number}`"
      >
        <button
          :aria-label="`Door ${door.number}, ${getDoorState(door)}`"
          class="door__button"
          :disabled="!canOpenDoor(door.number)"
          type="button"
          @click="openDoor(door.number, $event)"
        >
          <span class="door__number">{{ door.number }}</span>
          <span class="door__status" aria-hidden="true">
            {{ getDoorIcon(getDoorState(door)) }}
          </span>
        </button>
      </article>
    </section>

    <div
      v-if="selectedDoorNumber !== null"
      class="modal-backdrop"
      @click.self="closeDoor"
    >
      <section
        v-if="selectedDoor !== null"
        class="door-view"
        aria-describedby="door-view-description"
        aria-labelledby="door-view-title"
        aria-modal="true"
        role="dialog"
      >
        <div class="door-view__header">
          <div>
            <p class="eyebrow">Door {{ selectedDoor.number }}</p>
            <h2 id="door-view-title">Today's activities</h2>
            <p id="door-view-description" class="sr-only">
              Activities for door {{ selectedDoor.number }}.
            </p>
          </div>
          <button
            ref="closeButton"
            aria-label="Close door activities"
            class="close-button"
            type="button"
            @click="closeDoor"
          >
            Close
          </button>
        </div>

        <div class="activities">
          <article
            v-for="(activity, activityIndex) in selectedDoor.activities"
            :key="`${selectedDoor.number}-${activityIndex}`"
            class="activity"
          >
            <p class="activity__type">{{ getActivityLabel(activity) }}</p>
            <p v-if="activity.type === 'text'" class="activity__text">
              {{ activity.text }}
            </p>
            <img
              v-else-if="activity.type === 'image'"
              class="activity__image"
              :src="activity.src"
              :alt="activity.alt"
            />
            <div v-else-if="activity.type === 'riddle'" class="riddle">
              <p class="activity__text">{{ activity.question }}</p>
              <details v-if="activity.solution">
                <summary>Show solution</summary>
                <p class="activity__text">{{ activity.solution }}</p>
              </details>
            </div>
            <ul v-else class="checklist">
              <li v-for="(item, itemIndex) in activity.items" :key="itemIndex">
                <label>
                  <input
                    :checked="
                      isChecklistItemCompleted(
                        getChecklistItemKey(
                          selectedDoor.number,
                          activityIndex,
                          itemIndex,
                        ),
                      )
                    "
                    type="checkbox"
                    @change="
                      toggleChecklistItem(
                        getChecklistItemKey(
                          selectedDoor.number,
                          activityIndex,
                          itemIndex,
                        ),
                      )
                    "
                  />
                  <span>{{ item }}</span>
                </label>
              </li>
            </ul>
            <label
              v-if="activity.type !== 'checklist'"
              class="activity__complete"
            >
              <input
                :checked="
                  isActivityCompleted(
                    getActivityKey(selectedDoor.number, activityIndex),
                  )
                "
                type="checkbox"
                @change="
                  toggleCompletedActivity(
                    getActivityKey(selectedDoor.number, activityIndex),
                  )
                "
              />
              <span>Mark activity complete</span>
            </label>
          </article>
        </div>
      </section>
      <p v-else class="door-error" role="alert">
        This door cannot be displayed because its content is missing or invalid.
      </p>
    </div>
  </main>
</template>
