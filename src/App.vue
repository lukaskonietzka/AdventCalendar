<script setup lang="ts">
import { computed, ref } from 'vue';
import calendarContentJson from './content/2026.json';
import {
  getCurrentCalendarYear,
  getDaysUntilNextAdventStart,
  isDoorAvailable,
  isOutsideAdventPeriod,
} from './calendar/date-logic';
import type { CalendarContent } from './content/types';

const calendarContent = calendarContentJson as CalendarContent;
const today = ref(new Date());
const currentYear = getCurrentCalendarYear(today.value);
const isOutsideAdvent = computed(() => isOutsideAdventPeriod(today.value));
const daysUntilAdvent = computed(() =>
  getDaysUntilNextAdventStart(today.value),
);

function isAvailable(doorNumber: number): boolean {
  return isDoorAvailable(calendarContent.year, doorNumber, today.value);
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
      >
        <span class="door__number">{{ door.number }}</span>
        <span class="door__status">
          {{ isAvailable(door.number) ? 'Available' : 'Locked' }}
        </span>
      </article>
    </section>
  </main>
</template>
