<script setup lang="ts">
import { computed, ref } from 'vue';
import calendarContentJson from './content/2026.json';
import {
  getCurrentCalendarYear,
  getDaysUntilNextAdventStart,
  isDoorAvailable,
  isOutsideAdventPeriod,
} from './calendar/date-logic';
import type { Activity, CalendarContent, CalendarDoor } from './content/types';
import { isValidCalendarDoor } from './content/runtime-validation';

const calendarContent = calendarContentJson as CalendarContent;
const today = ref(new Date());
const currentYear = getCurrentCalendarYear(today.value);
const selectedDoorNumber = ref<number | null>(null);
const completedChecklistItems = ref<Set<string>>(new Set());
const isOutsideAdvent = computed(() => isOutsideAdventPeriod(today.value));
const daysUntilAdvent = computed(() =>
  getDaysUntilNextAdventStart(today.value),
);

function isAvailable(doorNumber: number): boolean {
  return isDoorAvailable(calendarContent.year, doorNumber, today.value);
}

function getDoor(doorNumber: number): CalendarDoor | null {
  const door = calendarContent.doors.find(
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

function openDoor(doorNumber: number): void {
  if (!isAvailable(doorNumber)) {
    return;
  }

  selectedDoorNumber.value = doorNumber;
}

function closeDoor(): void {
  selectedDoorNumber.value = null;
}

function getActivityKey(doorNumber: number, activityIndex: number): string {
  return `${calendarContent.year}-${doorNumber}-${activityIndex}`;
}

function isChecklistItemCompleted(activityKey: string): boolean {
  return completedChecklistItems.value.has(activityKey);
}

function toggleChecklistItem(activityKey: string): void {
  const nextCompletedItems = new Set(completedChecklistItems.value);

  if (nextCompletedItems.has(activityKey)) {
    nextCompletedItems.delete(activityKey);
  } else {
    nextCompletedItems.add(activityKey);
  }

  completedChecklistItems.value = nextCompletedItems;
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

    <section class="door-grid" aria-label="Advent doors">
      <article
        v-for="door in calendarContent.doors"
        :key="door.number"
        class="door"
        :class="{ 'door--available': isAvailable(door.number) }"
        :aria-label="`Door ${door.number}`"
      >
        <button
          class="door__button"
          :disabled="!isAvailable(door.number)"
          type="button"
          @click="openDoor(door.number)"
        >
          <span class="door__number">{{ door.number }}</span>
          <span class="door__status">
            {{ isAvailable(door.number) ? 'Open door' : 'Locked' }}
          </span>
        </button>
      </article>
    </section>

    <section
      v-if="selectedDoorNumber !== null"
      class="door-view"
      aria-live="polite"
    >
      <template v-if="selectedDoor !== null">
        <div class="door-view__header">
          <div>
            <p class="eyebrow">Door {{ selectedDoor.number }}</p>
            <h2>Today's activities</h2>
          </div>
          <button class="close-button" type="button" @click="closeDoor">
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
                        getActivityKey(selectedDoor.number, activityIndex) +
                          '-' +
                          itemIndex,
                      )
                    "
                    type="checkbox"
                    @change="
                      toggleChecklistItem(
                        getActivityKey(selectedDoor.number, activityIndex) +
                          '-' +
                          itemIndex,
                      )
                    "
                  />
                  <span>{{ item }}</span>
                </label>
              </li>
            </ul>
          </article>
        </div>
      </template>
      <p v-else class="door-error" role="alert">
        This door cannot be displayed because its content is missing or invalid.
      </p>
    </section>
  </main>
</template>
