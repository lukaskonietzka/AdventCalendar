export type Activity =
  | { type: 'text'; text: string }
  | { type: 'image'; src: string; alt: string }
  | { type: 'riddle'; question: string; solution?: string }
  | { type: 'checklist'; items: string[] };

export interface CalendarDoor {
  number: number;
  activities: Activity[];
}

export interface CalendarContent {
  year: number;
  doors: CalendarDoor[];
}
