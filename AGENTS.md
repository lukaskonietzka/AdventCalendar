# Engineering Guidelines

## 1. Grundprinzipien

### Code wird gelesen, nicht geschrieben

Code wird sehr viel häufiger gelesen als geschrieben. Deshalb hat die Lesbarkeit des Codes höchste Priorität.

Jede Implementierung muss so geschrieben sein, dass ein anderer Entwickler sie möglichst schnell verstehen kann, ohne lange nachdenken, zwischen zahlreichen Dateien springen oder komplexe Zusammenhänge im Kopf behalten zu müssen.

Es gilt folgende Priorität:

1. Verständlichkeit
2. Korrektheit
3. Wartbarkeit
4. Testbarkeit
5. Einfachheit der Erweiterung
6. Performance, sofern relevant und nachgewiesen

Performance darf nicht ignoriert werden. Optimierungen müssen jedoch einen nachvollziehbaren Nutzen haben und dürfen die Lesbarkeit nicht ohne guten Grund verschlechtern.

### Verbindliche Regeln

- Bevorzuge expliziten, leicht nachvollziehbaren Code gegenüber cleveren Abkürzungen.
- Bevorzuge einfache Kontrollstrukturen gegenüber komplexen Ausdrücken.
- Bevorzuge sprechende Namen gegenüber Kommentaren, die unverständlichen Code erklären.
- Bevorzuge kleine, klar abgegrenzte Funktionen gegenüber großen Methoden mit mehreren Verantwortlichkeiten.
- Bevorzuge nachvollziehbare Datenflüsse gegenüber versteckten Seiteneffekten.
- Vermeide unnötige Abstraktionen und vorzeitige Generalisierung.
- Implementiere nur das, was tatsächlich benötigt wird.
- Verwende bestehende, etablierte Projektkonventionen, sofern sie diesen Regeln nicht widersprechen.
- Vermeide Lösungen, die zwar weniger Code benötigen, aber schwieriger zu verstehen sind.

**Wichtig:** Weniger Code ist kein Selbstzweck. Etwas mehr Code ist ausdrücklich erwünscht, wenn dadurch die Intention besser erkennbar wird.

### Beispiel: Verständlichkeit vor Kompaktheit

Schlecht:

```ts
const result = items.filter(x => x.active && x.price > 0).map(x => ({ ...x, price: x.price * (1 - discount) }));
```

Besser:

```ts
const activeItems = items.filter((item) => {
  return item.active;
});

const itemsWithPositivePrice = activeItems.filter((item) => {
  return item.price > 0;
});

const discountedItems = itemsWithPositivePrice.map((item) => {
  const discountedPrice = item.price * (1 - discount);

  return {
    ...item,
    price: discountedPrice,
  };
});
```

Die zweite Variante macht jeden Verarbeitungsschritt sichtbar und lässt sich leichter erweitern, testen und debuggen.

Vermeide allerdings auch unnötige Zwischenschritte, wenn sie keinerlei zusätzliche Verständlichkeit schaffen. Entscheidend ist die tatsächliche Lesbarkeit.

---

## 2. Technologie und Architektur

Das Projekt verwendet grundsätzlich folgende Technologien:

- Vue 3
- TypeScript
- Vite
- Composition API
- `<script setup lang="ts">`
- Vue Router für clientseitiges Routing, sofern benötigt
- Pinia für gemeinsam benötigten Anwendungszustand, sofern benötigt
- Vitest für Unit- und Integrationstests
- Vue Test Utils und gegebenenfalls Testing Library für Komponententests
- Playwright für End-to-End-Tests
- ESLint für statische Codeanalyse
- Prettier für einheitliche Formatierung

Verwende aktuelle, miteinander kompatible und stabile Versionen.

Führe keine zusätzliche Bibliothek ein, wenn sich die Anforderung mit den bereits vorhandenen Werkzeugen angemessen lösen lässt.

Ergänze Abhängigkeiten nur, wenn sie einen konkreten Mehrwert bieten.

### Architekturprinzipien

- Halte die Architektur so einfach wie möglich.
- Trenne fachliche Logik von Darstellung und technischer Infrastruktur.
- Vermeide unnötige Abhängigkeiten zwischen Komponenten und Modulen.
- Mache Abhängigkeiten explizit.
- Vermeide globale Zustände, sofern sie nicht wirklich erforderlich sind.
- Vermeide versteckte Seiteneffekte.
- Halte zusammengehörige Funktionalität zusammen.
- Trenne unterschiedliche Verantwortlichkeiten klar voneinander.
- Verwende keine Architekturpatterns nur deshalb, weil sie bekannt sind.
- Führe keine zusätzliche Abstraktion ein, solange kein konkretes Problem dadurch gelöst wird.

Neue Architekturentscheidungen müssen anhand eines tatsächlichen Bedarfs begründet werden.

---

## 3. TypeScript

TypeScript wird konsequent zur Absicherung der Implementierung eingesetzt.

### Strenge Typisierung

- Aktiviere und erhalte `strict` in der TypeScript-Konfiguration.
- Vermeide `any`.
- Verwende `unknown`, wenn ein Wert tatsächlich noch nicht bekannt ist.
- Grenze unbekannte Werte durch Type Guards oder nachvollziehbare Validierung ein.
- Vermeide Type Assertions, wenn sich die Typen korrekt modellieren lassen.
- Verwende keine Non-Null-Assertions (`!`), nur um Compilerfehler zu unterdrücken.
- Ignoriere keine TypeScript-Fehler ohne nachvollziehbaren Grund.
- Vermeide `@ts-ignore`.
- Verwende `@ts-expect-error` nur dann, wenn der erwartete Typfehler beabsichtigt und dokumentiert ist.
- Vermeide unnötige Typkonvertierungen.
- Modelliere optionale Werte und mögliche Fehlerzustände ausdrücklich.

### Verständliche Typen

Verwende sprechende Namen für Typen, Interfaces und Enums.

Schlecht:

```ts
type D = {
  n: string;
  a: boolean;
};
```

Besser:

```ts
interface User {
  name: string;
  isActive: boolean;
}
```

Bevorzuge präzise Typen gegenüber allgemeinen Typen, die zahlreiche ungültige Zustände zulassen.

Nutze Union Types und Discriminated Unions, wenn dadurch Zustände und ihre erlaubten Eigenschaften klarer werden.

Beispielsweise:

```ts
type RequestState<T> =
  | {
      status: 'idle';
    }
  | {
      status: 'loading';
    }
  | {
      status: 'success';
      data: T;
    }
  | {
      status: 'error';
      message: string;
    };
```

Ein solcher Typ ist dann sinnvoll, wenn die Anwendung diese Zustände tatsächlich benötigt. Führe keine zusätzlichen Abstraktionen ohne konkreten Bedarf ein.

### Keine unnötige Typkomplexität

Vermeide übermäßig komplexe generische Typen, rekursive Typdefinitionen und schwer lesbare Conditional Types, wenn eine einfachere Lösung möglich ist.

Typen sollen die Implementierung verständlicher machen und nicht zu einer eigenen Programmiersprache werden.

---

## 4. Dateistruktur und Verantwortlichkeiten

Die Dateistruktur muss es ermöglichen, Verantwortlichkeiten schnell zu finden.

Verwende aussagekräftige Dateinamen und eine nachvollziehbare Verzeichnisstruktur.

Beispiel:

```text
src/
├── app/
│   ├── App.vue
│   ├── router/
│   │   └── index.ts
│   └── providers/
├── components/
│   └── common/
├── features/
│   └── users/
│       ├── components/
│       ├── composables/
│       ├── services/
│       ├── types/
│       └── utils/
├── layouts/
├── pages/
├── services/
├── types/
├── utils/
└── main.ts

tests/
├── unit/
├── integration/
└── e2e/
```

Diese Struktur ist eine Orientierung und keine starre Vorgabe. Passe sie an die tatsächliche Größe und Komplexität der Anwendung an.

Vermeide es, kleine Projekte künstlich in zahlreiche leere Verzeichnisse aufzuteilen.

### Eine Klasse pro Datei

Jede Klasse bekommt eine eigene Datei.

Beispielsweise:

```text
services/
├── UserService.ts
└── AuthenticationService.ts
```

Jede Datei enthält genau eine Klasse als zentrale Verantwortlichkeit.

Zusätzliche kleine Hilfsfunktionen dürfen in einer Datei liegen, wenn sie unmittelbar zu dieser Klasse gehören und dadurch verständlicher werden. Eigenständige Klassen gehören jedoch in separate Dateien.

Verwende für Klassen einen einheitlichen, zum Projekt passenden Dateinamenstil.

### Funktionen statt unnötiger Klassen

Nicht jede fachliche Einheit muss eine Klasse sein.

Verwende normale Funktionen für einfache, zustandslose Logik.

Verwende Klassen, wenn sie einen konkreten Nutzen bieten, beispielsweise durch einen eigenen Lebenszyklus, kontrollierten internen Zustand oder eine klar abgegrenzte Objektverantwortung.

Erzeuge keine Klassen, die lediglich eine Sammlung statischer Methoden darstellen, wenn einfache Funktionen die Aufgabe verständlicher lösen.

### Eine klare Verantwortung pro Datei

Eine Datei sollte eine klar erkennbare Hauptaufgabe haben.

Vermeide insbesondere:

- Große Dateien mit zahlreichen unabhängigen Funktionen.
- Dateien mit unspezifischen Namen wie `helpers.ts`, die immer weiter wachsen.
- Vermischung von API-Kommunikation, fachlicher Logik und UI-Darstellung.
- Mehrere unabhängige Klassen in einer Datei.
- Zentrale Dateien, die sämtliche Anwendungslogik bündeln.

Lagere Funktionalität aus, wenn sie dadurch eine klarere Verantwortung erhält. Teile Dateien nicht allein aufgrund ihrer Zeilenanzahl auf.

---

## 5. Typen in eigenen Dateien

Typdefinitionen werden von der Implementierung getrennt.

Lege Typen in dedizierten TypeScript-Dateien ab, beispielsweise:

```text
features/
└── users/
    ├── components/
    ├── services/
    └── types/
        ├── User.ts
        ├── CreateUserRequest.ts
        └── UserApiResponse.ts
```

Jede Datei enthält eine zusammengehörige, klar benannte Typdefinition als Hauptverantwortlichkeit.

### Regeln für Typdateien

- Definiere fachliche Typen nicht wiederholt in Komponenten.
- Verteile Typen nicht unkontrolliert über zahlreiche Implementierungsdateien.
- Lege gemeinsam verwendete Typen an einer nachvollziehbaren Stelle ab.
- Halte fachlich zusammengehörige Typen in derselben Datei, wenn sie gemeinsam verständlicher werden.
- Vermeide eine einzige globale `types.ts`, die mit der Zeit sämtliche Typen des Projekts enthält.
- Verwende lokale Typdefinitionen nur dann, wenn sie wirklich implementationsintern sind und eine Auslagerung die Lesbarkeit verschlechtern würde.
- Trenne fachliche Domänentypen von API- und Transporttypen, wenn sich ihre Verantwortlichkeiten oder Datenstrukturen unterscheiden.

Beispielsweise sind `User`, `CreateUserRequest` und `UserApiResponse` nicht automatisch derselbe Typ.

Die API kann zusätzliche Felder enthalten oder andere Datenformate verwenden. Die Anwendung sollte diese Unterschiede ausdrücklich modellieren, wenn sie relevant sind.

### Exporte

Verwende nachvollziehbare Exporte und Importe.

Bevorzuge direkte Importe aus den zuständigen Dateien.

Nutze Barrel-Dateien wie `index.ts` nur dann, wenn sie die API eines Moduls tatsächlich übersichtlicher machen.

Vermeide verschachtelte Re-Exports, die den Ursprung eines Typs oder einer Funktion verschleiern.

---

## 6. Funktionen und Methoden

Funktionen und Methoden sollen eine Geschichte erzählen.

Wenn ein Entwickler eine Methode liest, soll er ihren Ablauf möglichst von oben nach unten verstehen können.

### Aussagekräftige Namen

Namen müssen ausdrücken, was eine Funktion tut und gegebenenfalls warum sie benötigt wird.

Bevorzuge:

- `loadUserProfile`
- `validateEmailAddress`
- `calculateOrderTotal`
- `saveUserPreferences`
- `isUserAuthorized`

Vermeide:

- `process`
- `handleData`
- `execute`
- `doStuff`
- `manage`
- `check`, wenn nicht klar wird, was geprüft wird.

Die Namen müssen zur fachlichen Bedeutung passen.

Vermeide außerdem unnötig lange Namen, die lediglich den gesamten Implementierungsablauf wiederholen.

### Methoden erzählen eine Geschichte

Eine Methode soll einen klaren Ablauf besitzen.

Beispiel:

```ts
async function registerUser(
  registrationData: UserRegistrationData,
): Promise<User> {
  validateRegistrationData(registrationData);

  const existingUser = await findUserByEmail(
    registrationData.email,
  );

  if (existingUser !== null) {
    throw new UserAlreadyExistsError(
      registrationData.email,
    );
  }

  const user = createUser(registrationData);

  await saveUser(user);

  return user;
}
```

Die Methode macht die fachlichen Schritte sichtbar:

1. Eingaben validieren.
2. Existenz prüfen.
3. Benutzer erstellen.
4. Benutzer speichern.
5. Ergebnis zurückgeben.

Die Details der einzelnen Schritte können in eigenen Funktionen liegen, sofern diese dadurch verständlicher werden.

### Methodenlänge

Es gibt keine starre maximale Zeilenanzahl.

Eine Methode sollte jedoch aufgeteilt werden, wenn sie:

- Mehrere voneinander unabhängige Aufgaben erfüllt.
- Mehrere Abstraktionsebenen gleichzeitig behandelt.
- Schwer verständliche verschachtelte Bedingungen enthält.
- Mehrere unterschiedliche Fehlerbehandlungen miteinander vermischt.
- Nur durch umfangreiche Kommentare verständlich wird.
- Schwer isoliert getestet werden kann.

Teile Methoden nicht mechanisch auf. Eine zusätzliche Funktion ist nur dann sinnvoll, wenn sie einen verständlichen Namen, eine klare Verantwortung oder einen konkreten Wiederverwendungszweck erhält.

### Kontrollfluss

Bevorzuge einen flachen, gut lesbaren Kontrollfluss.

Vermeide unnötige Verschachtelungen und komplexe ternäre Ausdrücke.

Nutze Early Returns, wenn dadurch Sonderfälle früh und eindeutig behandelt werden können.

Schlecht:

```ts
function getUserLabel(user: User | null): string {
  return user
    ? user.isActive
      ? user.name
      : `${user.name} (inactive)`
    : 'Unknown user';
}
```

Besser:

```ts
function getUserLabel(user: User | null): string {
  if (user === null) {
    return 'Unknown user';
  }

  if (!user.isActive) {
    return `${user.name} (inactive)`;
  }

  return user.name;
}
```

Der zweite Ansatz macht die Entscheidungslogik explizit.

### Parameter

Vermeide Funktionen mit vielen unabhängigen Parametern.

Wenn mehrere Parameter fachlich zusammengehören, kann ein benannter Parameter-Typ sinnvoll sein.

Erzeuge jedoch nicht für jede Funktion automatisch ein eigenes Optionsobjekt.

Verwende aussagekräftige Parameternamen und vermeide schwer verständliche boolesche Parameter, deren Bedeutung beim Aufruf nicht erkennbar ist.

Bevorzuge:

```ts
loadUsers({
  includeInactiveUsers: false,
});
```

gegenüber:

```ts
loadUsers(false);
```

wenn die Bedeutung des booleschen Parameters nicht unmittelbar offensichtlich ist.

### Seiteneffekte

Seiteneffekte sollen klar erkennbar sein.

Eine Funktion, die Daten speichert, eine API aufruft oder den globalen Zustand verändert, sollte das durch ihren Namen und ihre Verantwortlichkeit erkennen lassen.

Vermeide versteckte Änderungen an globalen Variablen oder gemeinsam verwendeten Objekten.

Reine Funktionen sind für Berechnungen und fachliche Regeln zu bevorzugen, sofern dies die Implementierung vereinfacht.

---

## 7. Vue 3 und Komponenten

Verwende Vue 3 mit der Composition API und TypeScript.

Bevorzuge `<script setup lang="ts">`.

### Verantwortung einer Komponente

Eine Komponente sollte eine klar erkennbare UI-Verantwortung besitzen.

Vermeide Komponenten, die gleichzeitig:

- Komplexe API-Kommunikation durchführen.
- Fachliche Regeln implementieren.
- Große Datenmengen transformieren.
- Globalen Zustand verwalten.
- Formularvalidierung vollständig selbst implementieren.
- Umfangreiche Darstellungslogik enthalten.

Trenne solche Aufgaben bei Bedarf in Composables, Services und eigenständige Funktionen aus.

Nicht jede Komponente benötigt ein Composable. Verwende die zusätzlichen Abstraktionen nur, wenn sie eine klarere Struktur schaffen.

### Lesbare Templates

Vue-Templates sollen leicht zu überfliegen sein.

- Verwende sprechende Komponenten- und Variablennamen.
- Vermeide umfangreiche Berechnungen direkt im Template.
- Lagere nicht triviale Bedingungen in benannte Funktionen oder berechnete Werte aus.
- Vermeide tief verschachtelte bedingte Renderlogik.
- Nutze `v-if`, `v-else-if` und `v-else` nachvollziehbar.
- Verwende bei Listen stabile, fachlich passende `key`-Werte.
- Vermeide `v-html`, wenn eine normale Textdarstellung ausreicht.

Schlecht:

```vue
<p>
  {{
    user
      ? user.isActive
        ? user.name
        : `${user.name} (inactive)`
      : 'Unknown user'
  }}
</p>
```

Besser:

```vue
<p>{{ userLabel }}</p>
```

```ts
const userLabel = computed(() => {
  if (props.user === null) {
    return 'Unknown user';
  }

  if (!props.user.isActive) {
    return `${props.user.name} (inactive)`;
  }

  return props.user.name;
});
```

### Props und Events

Definiere Props und Events ausdrücklich und typisiert.

- Verwende `defineProps` mit passenden Typen.
- Verwende `defineEmits` mit klaren Event-Namen und Payload-Typen.
- Vermeide unkontrollierte Änderungen an übergebenen Props.
- Halte die Richtung des Datenflusses nachvollziehbar.
- Verwende keine Events, wenn ein einfacherer, klarer Datenfluss ausreicht.
- Verwende `v-model` dort, wo es die Semantik einer Komponente sinnvoll beschreibt.

Komponenten sollen möglichst über eine überschaubare und verständliche öffentliche Schnittstelle verfügen.

### Computed und Watcher

Verwende `computed` für abgeleitete Werte.

Verwende `watch` und `watchEffect` nur, wenn tatsächlich auf Änderungen reagiert oder ein Seiteneffekt ausgelöst werden muss.

Vermeide es, Werte manuell zu synchronisieren, wenn sie sich direkt aus bestehenden reaktiven Daten ableiten lassen.

Vermeide mehrere Watcher, die sich gegenseitig auslösen und dadurch schwer nachvollziehbare Zustandsänderungen erzeugen.

Wenn ein Watcher notwendig ist, müssen seine Ursache und seine Auswirkungen klar erkennbar sein.

### Composables

Composables kapseln zusammengehörige reaktive Logik.

Beispiele:

- `useUserProfile`
- `useUserSearch`
- `useFormValidation`
- `usePagination`

Regeln:

- Ein Composable besitzt eine klare Verantwortung.
- Namen beginnen mit `use`.
- Rückgabewerte sind verständlich benannt.
- Seiteneffekte und Lifecycle-Abhängigkeiten sind nachvollziehbar.
- Fehler und Ladezustände werden ausdrücklich behandelt, wenn sie fachlich relevant sind.
- Vermeide Composables, die zu umfangreichen, schwer verständlichen Mini-Frameworks werden.

Ein Composable ist kein Pflichtbestandteil jeder Komponente.

### Komponentenstruktur

Eine Vue-Komponente soll möglichst in folgender Reihenfolge aufgebaut sein:

1. Imports
2. Props und Events
3. Konstanten und lokale Typen, soweit unvermeidbar
4. Reaktiver Zustand
5. Abgeleitete Werte
6. Ereignisbehandlung und fachliche Aktionen
7. Lifecycle-Logik
8. Template
9. Styles

Ausgelagerte Typen gehören in die dafür vorgesehenen Typdateien.

Die Reihenfolge darf angepasst werden, wenn dadurch die tatsächliche Geschichte der Komponente verständlicher wird.

---

## 8. Trennung von UI, Fachlogik und Infrastruktur

Die Darstellung, fachliche Entscheidungen und technische Kommunikation müssen voneinander unterscheidbar sein.

### UI

Die UI ist für Darstellung, Benutzerinteraktionen und die Weitergabe von Aktionen zuständig.

Sie soll keine unnötig komplexen fachlichen Regeln enthalten.

### Fachlogik

Fachliche Regeln sollen möglichst unabhängig von Vue-Komponenten testbar sein.

Beispielsweise:

- Preisberechnungen.
- Berechtigungsregeln.
- Validierung fachlicher Bedingungen.
- Statusübergänge.
- Auswahl und Transformation von Daten.

Solche Logik gehört in benannte Funktionen oder fachlich passende Module.

### Services

Services kapseln externe Kommunikation oder klar abgegrenzte technische beziehungsweise fachliche Abläufe.

Beispiele:

- `UserService`
- `AuthenticationService`
- `UserApiClient`

Vermeide Services, die für die gesamte Anwendung zuständig sind.

Wenn eine Funktion lediglich eine einfache Berechnung durchführt, ist dafür kein Service erforderlich.

### API-Kommunikation

API-Aufrufe gehören nicht unkontrolliert in Templates oder komplexe UI-Ausdrücke.

- Verwende klar benannte Funktionen für API-Aufrufe.
- Typisiere Request- und Response-Daten.
- Behandle HTTP-Fehler ausdrücklich.
- Validiere externe Daten, wenn deren Struktur nicht zuverlässig garantiert ist.
- Vermische API-Transporttypen nicht automatisch mit fachlichen Domänentypen.
- Vermeide doppelte Implementierungen derselben Fehlerbehandlung.
- Halte Umwandlungen zwischen API-Daten und Anwendungsmodellen nachvollziehbar.

Vertraue externen Daten nicht allein deshalb, weil ein TypeScript-Interface existiert. TypeScript-Typen validieren keine Daten zur Laufzeit.

---

## 9. State Management

Verwalte Zustand so lokal wie möglich.

Bevorzuge lokale reaktive Zustände, wenn diese nur von einer Komponente benötigt werden.

Verwende Pinia, wenn ein gemeinsam benötigter Anwendungszustand tatsächlich zentral verwaltet werden muss.

### Regeln

- Halte State so klein wie möglich.
- Speichere keine Werte redundant, wenn sie sich zuverlässig ableiten lassen.
- Vermeide mehrere konkurrierende Quellen für dieselben Daten.
- Definiere klar, welche Komponente oder welcher Store für einen Zustand verantwortlich ist.
- Trenne Ladezustand, Erfolgszustand und Fehlerzustand, sofern die Anwendung diese Zustände benötigt.
- Vermeide unnötige globale Stores.
- Halte Änderungen am Zustand nachvollziehbar.
- Vermeide versteckte Zustandsänderungen innerhalb von Hilfsfunktionen.

Ein Store soll nicht zum Ablageort sämtlicher Daten und Geschäftslogik werden.

---

## 10. Fehlerbehandlung

Fehler müssen bewusst behandelt werden.

Vermeide es, Fehler zu verschlucken oder durch scheinbar erfolgreiche Standardwerte zu ersetzen.

Schlecht:

```ts
try {
  await saveUser(user);
} catch {
  return null;
}
```

Diese Implementierung verschleiert, weshalb der Vorgang fehlgeschlagen ist.

Besser ist eine Fehlerbehandlung, die zum fachlichen Kontext passt:

```ts
try {
  await saveUser(user);
} catch (error: unknown) {
  logger.error('Failed to save user.', error);

  throw new UserSaveError(
    'The user could not be saved.',
    { cause: error },
  );
}
```

Eine zusätzliche Fehlerklasse ist nur dann sinnvoll, wenn sie eine eigenständige fachliche Bedeutung oder einen konkreten technischen Nutzen besitzt.

### Verbindliche Regeln

- Behandle erwartbare Fehler an einer geeigneten Stelle.
- Unterscheide erwartbare Fehler von unerwarteten technischen Fehlern.
- Vermeide leere `catch`-Blöcke.
- Verwende aussagekräftige Fehlermeldungen.
- Gib keine vertraulichen Informationen in Fehlermeldungen oder Logs aus.
- Verwende keine allgemeinen Erfolgswerte, um tatsächliche Fehler zu verdecken.
- Halte Fehlerbehandlung so nah am fachlich sinnvollen Kontext wie möglich.
- Vermeide mehrfaches Loggen desselben Fehlers auf verschiedenen Ebenen.
- Behandle Ladezustände und abgebrochene Requests nachvollziehbar, wenn sie relevant sind.

Fehler müssen so behandelt werden, dass Benutzer sinnvolle Rückmeldungen erhalten und Entwickler die Ursache diagnostizieren können.

---

## 11. Umfassende Tests

Tests sind ein wesentlicher Bestandteil der Implementierung.

Code gilt nicht allein deshalb als fertig, weil er funktioniert oder der TypeScript-Compiler keine Fehler meldet.

Die Implementierung muss durch aussagekräftige Tests abgesichert werden.

### Teststrategie

Verwende mehrere Testebenen:

**Unit-Tests**

Testen isolierte Funktionen und fachliche Regeln.

Sie sollen schnell laufen und Fehler möglichst präzise lokalisieren.

**Komponententests**

Testen das sichtbare und interaktive Verhalten von Vue-Komponenten.

Sie überprüfen beispielsweise:

- Darstellung anhand verschiedener Props.
- Benutzerinteraktionen.
- Events und deren Payloads.
- Ladezustände.
- Fehlerzustände.
- Leere Datenmengen.
- Bedingte Darstellung.
- Reaktive Aktualisierungen.

**Integrationstests**

Prüfen das Zusammenspiel mehrerer Module, Services, Stores oder Komponenten.

Sie sollen sicherstellen, dass die einzelnen Bestandteile korrekt zusammenarbeiten.

**End-to-End-Tests**

Prüfen wichtige Benutzerabläufe aus Sicht der Anwendung.

Verwende Playwright für kritische Abläufe, beispielsweise:

- Anmeldung.
- Erstellung oder Bearbeitung wichtiger Daten.
- Formularvalidierung.
- Navigation zwischen zentralen Bereichen.
- Fehlerbehandlung bei relevanten Geschäftsprozessen.

Nicht jede kleine Funktion benötigt einen eigenen End-to-End-Test.

### Was getestet werden muss

Für jede relevante Funktion sind insbesondere folgende Fälle zu berücksichtigen:

1. Regulärer Erfolgsfall.
2. Ungültige Eingaben.
3. Leere oder fehlende Daten.
4. Grenzwerte und Randbedingungen.
5. Erwartbare Fehler.
6. Unerwartete Fehler, sofern die Funktion diese behandelt.
7. Alternative fachliche Zustände.
8. Relevante Seiteneffekte.
9. Asynchrone Abläufe und Ladezustände.
10. Regressionen bei bereits behobenen Fehlern.

Nicht jeder Punkt ist für jede Funktion relevant. Die Testauswahl muss zur tatsächlichen Verantwortung der Funktion passen.

### Aussagekräftige Tests

Tests müssen verständlich sein und einen konkreten fachlichen Zweck erfüllen.

Verwende sprechende Testnamen.

Bevorzuge:

```ts
it('rejects an email address without a domain', () => {
  const result = validateEmailAddress('user@');

  expect(result.isValid).toBe(false);
});
```

Vermeide:

```ts
it('works', () => {
  // ...
});
```

Ein Testname soll möglichst klar beschreiben, welches Verhalten erwartet wird.

### Arrange, Act, Assert

Strukturiere Tests nach dem Prinzip:

1. Arrange: Ausgangszustand vorbereiten.
2. Act: Die zu prüfende Aktion ausführen.
3. Assert: Das beobachtbare Ergebnis überprüfen.

Beispiel:

```ts
it('calculates the total price including tax', () => {
  const netPrice = 100;
  const taxRate = 0.19;

  const totalPrice = calculateTotalPrice(
    netPrice,
    taxRate,
  );

  expect(totalPrice).toBe(119);
});
```

Vermeide übermäßig komplexe Test-Setups, die mehr Aufmerksamkeit erfordern als die eigentliche Funktion.

### Tests für Vue-Komponenten

Teste das Verhalten aus Sicht des Benutzers.

Bevorzuge Assertions auf sichtbare Inhalte, zugängliche Rollen, Labels und tatsächliche Benutzerinteraktionen.

Vermeide Tests, die ausschließlich interne Implementierungsdetails überprüfen.

Ein Test soll nicht unnötig fehlschlagen, nur weil eine interne Variable umbenannt oder eine Funktion anders aufgeteilt wurde.

Verwende bei asynchronen Interaktionen die passenden asynchronen Testwerkzeuge.

### Mocking

Verwende Mocks gezielt.

- Mocke externe Systeme, wenn sie nicht Bestandteil des Tests sein sollen.
- Mocke keine internen Implementierungsdetails ohne konkreten Grund.
- Vermeide umfangreiche Mock-Strukturen, die das tatsächliche Verhalten kaum noch abbilden.
- Verwende echte Implementierungen für einfache, deterministische Logik, sofern dies sinnvoll ist.
- Stelle sicher, dass Mock-Daten die relevanten fachlichen Situationen realistisch abbilden.

### Testabdeckung

Strebe eine hohe Testabdeckung für fachliche Logik und kritische Abläufe an.

Als Ausgangspunkt gilt:

- Kritische fachliche Regeln: möglichst vollständige Abdeckung relevanter Entscheidungen.
- Komplexe Berechnungen und Validierungen: umfassende Tests aller fachlich relevanten Zweige.
- Services mit externen Abhängigkeiten: Erfolgs-, Fehler- und Randfalltests.
- UI-Komponenten: alle wesentlichen Zustände und Benutzerinteraktionen.
- Kritische Benutzerabläufe: geeignete End-to-End-Tests.

Eine globale Line-Coverage von 80 % kann als anfänglicher Richtwert dienen, ist jedoch kein Beweis für ausreichende Tests.

100 % Coverage ist ebenfalls kein Selbstzweck.

Entscheidend ist, ob die Tests die tatsächlichen Anforderungen und möglichen Fehler ausreichend abdecken.

### Regressionstests

Wenn ein Fehler behoben wird, soll nach Möglichkeit ein Test ergänzt werden, der das bisher fehlerhafte Verhalten reproduziert.

Der Test muss sicherstellen, dass derselbe Fehler bei zukünftigen Änderungen nicht unbemerkt wieder auftritt.

### Tests dürfen nicht ignoriert werden

- Bestehende Tests dürfen nicht entfernt werden, nur weil sie eine fehlerhafte Implementierung aufdecken.
- Fehlgeschlagene Tests dürfen nicht ohne nachvollziehbaren Grund übersprungen werden.
- Verwende keine Assertions, die Fehler lediglich kaschieren.
- Ändere erwartete Ergebnisse nur, wenn sich das fachlich beabsichtigte Verhalten tatsächlich geändert hat.
- Teste nach Möglichkeit auch, dass ungültige Zustände nicht versehentlich akzeptiert werden.

### Testdateien

Ordne Tests konsistent zu.

Beispielsweise:

```text
src/
└── features/
    └── users/
        ├── services/
        │   └── UserService.ts
        ├── types/
        │   └── User.ts
        └── components/
            └── UserProfile.vue

tests/
├── unit/
│   └── features/
│       └── users/
├── integration/
│   └── features/
│       └── users/
└── e2e/
    └── user-profile.spec.ts
```

Alternativ können Tests direkt neben ihren Implementierungen liegen, wenn dies bereits der Projektkonvention entspricht.

Wichtig ist eine konsistente Struktur, in der Tests schnell auffindbar sind.

---

## 12. Lesbarkeit und Formatierung

Der Code muss im gesamten Projekt einheitlich formatiert sein.

Verwende ESLint und Prettier, um wiederkehrende Stilentscheidungen automatisiert durchzusetzen.

### Verbindliche Regeln

- Verwende konsistente Einrückungen.
- Verwende aussagekräftige Variablennamen.
- Vermeide kryptische Abkürzungen.
- Vermeide übermäßig lange Zeilen, wenn sie die Lesbarkeit beeinträchtigen.
- Formatiere komplexere Funktionsaufrufe über mehrere Zeilen.
- Verwende Leerzeilen, um logische Abschnitte zu trennen.
- Gruppiere zusammengehörige Anweisungen.
- Halte Imports übersichtlich.
- Entferne ungenutzte Variablen und Imports.
- Vermeide unnötige Kommentare.
- Vermeide ungenutzten Code und auskommentierte Implementierungen.

### Kommentare

Kommentare sollen erklären, warum eine Entscheidung getroffen wurde, wenn sich dieser Grund nicht zuverlässig aus dem Code ergibt.

Schlecht:

```ts
// Increment the counter.
counter++;
```

Besser:

```ts
// Keep one additional slot available for the pending request.
availableSlots--;
```

Der konkrete Kommentar muss natürlich zur tatsächlichen Logik passen.

Dokumentiere insbesondere:

- Ungewöhnliche fachliche Entscheidungen.
- Nicht offensichtliche Randbedingungen.
- Technische Einschränkungen.
- Bewusst akzeptierte Kompromisse.
- Komplexe Algorithmen, deren Ablauf nicht allein durch sprechende Namen verständlich wird.

Verwende Kommentare nicht als Ersatz für eine verständliche Implementierung.

### Keine unnötige Cleverness

Vermeide insbesondere:

- Stark verschachtelte ternäre Ausdrücke.
- Lange Verkettungen komplexer Transformationen.
- Verschachtelte Callbacks mit mehreren Verantwortlichkeiten.
- Übermäßig generische Hilfsfunktionen.
- Unnötig komplexe Regex-Ausdrücke.
- Magische Zahlen und unerklärte Zeichenketten.
- Implizite Typkonvertierungen, deren Wirkung nicht offensichtlich ist.
- Schwer nachvollziehbare Metaprogrammierung.

Wenn eine einfache Schleife verständlicher ist als eine komplexe Array-Transformation, verwende die Schleife.

Wenn ein `if` verständlicher ist als ein ternärer Ausdruck, verwende `if`.

Wenn eine explizite Fallunterscheidung verständlicher ist als eine generische Abstraktion, verwende die Fallunterscheidung.

---

## 13. DRY, SOLID und Abstraktionen

Wiederverwendung ist sinnvoll, aber nicht um jeden Preis.

Das DRY-Prinzip bedeutet, unnötige Duplizierung von Wissen und Regeln zu vermeiden. Es bedeutet nicht, jede ähnliche Codezeile sofort in eine gemeinsame Funktion auszulagern.

### Duplizierung

Wenn mehrere Stellen dieselbe fachliche Regel implementieren, prüfe, ob sie gemeinsam modelliert werden sollte.

Wenn zwei Codeabschnitte nur oberflächlich ähnlich sind, aber unterschiedliche Verantwortlichkeiten besitzen, dürfen sie getrennt bleiben.

Vermeide Abstraktionen, die nur durch zahlreiche Parameter, Optionen oder Sonderfälle funktionieren.

### SOLID

Wende SOLID pragmatisch an.

Insbesondere:

- Eine Funktion oder Klasse sollte eine klare Verantwortung besitzen.
- Abhängigkeiten sollen nachvollziehbar sein.
- Änderungen an einer Funktionalität sollen möglichst wenige unabhängige Bereiche beeinflussen.
- Abstraktionen müssen einen konkreten Nutzen haben.
- Interfaces und Basisklassen sollen nicht allein aus Prinzip eingeführt werden.

Erzeuge keine unnötigen Interfaces für jede Klasse und keine zusätzliche Vererbungshierarchie ohne fachlichen Grund.

### Komplexität

Bevorzuge lineare, nachvollziehbare Abläufe.

Wenn eine Lösung mehrere Abstraktionsebenen benötigt, muss jede Ebene einen erkennbaren Nutzen bieten.

Ein Entwickler soll nicht erst durch zahlreiche Wrapper, Factorys, Adapter und generische Basisklassen navigieren müssen, um eine einfache fachliche Aktion zu verstehen.

---

## 14. Sicherheit

Sicherheit ist Bestandteil der Implementierung und darf nicht erst am Ende berücksichtigt werden.

- Vertraue keinen externen Eingaben ohne geeignete Validierung.
- Behandle API-Antworten als potenziell fehlerhaft.
- Speichere keine Passwörter, Tokens oder Secrets im Quellcode.
- Committe keine `.env`-Dateien mit vertraulichen Werten.
- Verwende Umgebungsvariablen für geeignete Konfigurationen.
- Beachte, dass Vite-Variablen mit dem Präfix `VITE_` im Client-Bundle öffentlich zugänglich sein können.
- Lege keine geheimen API-Schlüssel im Frontend ab.
- Vermeide unsichere HTML-Injektionen.
- Verwende `v-html` nur mit einer nachvollziehbaren und geeigneten Sicherheitsstrategie.
- Vermeide die Ausgabe vertraulicher Informationen in Logs.
- Verwende sichere Standardwerte und eine nachvollziehbare Fehlerbehandlung.
- Prüfe Berechtigungen serverseitig, wenn geschützte Ressourcen betroffen sind.

Frontend-Prüfungen können die Benutzerführung verbessern, ersetzen aber keine serverseitige Autorisierung.

Führe sicherheitsrelevante Bibliotheken und Werkzeuge in einem angemessenen Umfang aktuell.

---

## 15. Accessibility

Die Anwendung muss möglichst vielen Menschen zugänglich sein.

Berücksichtige WCAG-konforme Gestaltung und Semantik bereits bei der Implementierung.

- Verwende semantische HTML-Elemente.
- Verwende echte Buttons für Aktionen.
- Verwende Links für Navigation.
- Stelle Formulare mit nachvollziehbaren Labels bereit.
- Mache Fehlermeldungen verständlich und zugänglich.
- Stelle Tastaturbedienbarkeit sicher.
- Achte auf sichtbare Fokuszustände.
- Verwende ARIA-Attribute nur dann, wenn sie tatsächlich erforderlich sind.
- Verlasse dich nicht ausschließlich auf Farben, um Zustände zu vermitteln.
- Achte auf ausreichende Kontraste.
- Stelle dynamische Zustandsänderungen angemessen dar.
- Berücksichtige die Bedienbarkeit mit Screenreadern.

Accessibility ist keine nachträgliche Dekorationsaufgabe, sondern ein Bestandteil der funktionalen Qualität.

---

## 16. Performance

Performance-Optimierungen müssen nachvollziehbar und angemessen sein.

- Vermeide unnötige API-Aufrufe.
- Vermeide unnötige reaktive Abhängigkeiten.
- Nutze `computed`, wenn abgeleitete Werte sinnvoll zwischengespeichert werden können.
- Vermeide unnötige Watcher.
- Berücksichtige die Größe des initial geladenen Bundles.
- Lade umfangreiche oder selten benötigte Bereiche bei Bedarf dynamisch.
- Vermeide unnötige Wiederholungen teurer Berechnungen.
- Achte auf stabile Schlüssel bei gerenderten Listen.
- Berücksichtige die Abbruchmöglichkeit überholter asynchroner Requests, wenn sie zu falschen Ergebnissen führen könnten.

Führe keine Optimierungen ein, die den Code wesentlich komplizierter machen, ohne einen konkreten Nutzen zu belegen.

Wenn Performance tatsächlich ein Problem darstellt, verwende geeignete Messungen, bevor du die Architektur veränderst.

---

## 17. Dokumentation

Dokumentation soll den Einstieg und die Wartung erleichtern.

Das Projekt benötigt mindestens:

- Eine README mit den Voraussetzungen.
- Eine Anleitung zur Installation.
- Eine Anleitung zum Starten der Entwicklungsumgebung.
- Eine Anleitung zum Ausführen der Tests.
- Eine Anleitung zum Erstellen des Produktionsbuilds.
- Eine Übersicht über wichtige Architekturentscheidungen, wenn diese nicht offensichtlich sind.
- Eine Dokumentation notwendiger Umgebungsvariablen.

Dokumentiere öffentliche APIs, komplexe fachliche Regeln und wichtige Einschränkungen.

Vermeide Dokumentation, die lediglich den Code Zeile für Zeile wiederholt.

Halte Dokumentation aktuell, wenn sich die beschriebene Funktionalität ändert.

---

## 18. Umgang mit Änderungen am bestehenden Code

Vor jeder Änderung muss der vorhandene Code verstanden werden.

Ein Coding-Agent darf nicht einfach die erstbeste Implementierung überschreiben.

### Vor der Implementierung

1. Untersuche die bestehende Dateistruktur.
2. Prüfe vorhandene Implementierungen und wiederverwendbare Funktionen.
3. Prüfe die verwendeten Technologien und Projektkonventionen.
4. Verstehe den relevanten Datenfluss.
5. Identifiziere die betroffenen Tests.
6. Bestimme die kleinste verständliche Änderung, die das Problem löst.

Stelle bei unklaren Anforderungen Rückfragen, sofern eine falsche Annahme erhebliche Auswirkungen hätte.

Erfinde keine fachlichen Anforderungen, die nicht aus dem Kontext hervorgehen.

### Während der Implementierung

- Ändere nur die Bereiche, die für die Aufgabe erforderlich sind.
- Behalte bestehendes Verhalten bei, sofern keine Änderung ausdrücklich vorgesehen ist.
- Refaktoriere nicht unaufgefordert das gesamte Projekt.
- Vermeide unnötige Änderungen an Dateistrukturen.
- Führe keine neuen Abhängigkeiten ohne konkreten Bedarf ein.
- Ergänze Tests für neues oder geändertes Verhalten.
- Verwende bestehende Abstraktionen, wenn sie sinnvoll sind.
- Verbessere problematischen Code gezielt, statt unnötig große Umbauten vorzunehmen.

### Nach der Implementierung

1. Prüfe die Änderungen auf Verständlichkeit.
2. Führe die relevanten Tests aus.
3. Führe TypeScript-Prüfungen aus.
4. Führe ESLint aus.
5. Prüfe den Produktionsbuild, wenn die Änderungen dies rechtfertigen.
6. Behebe neu eingeführte Fehler.
7. Berichte transparent, welche Prüfungen tatsächlich ausgeführt wurden.

Behaupte niemals, Tests oder Builds seien erfolgreich, wenn sie nicht ausgeführt wurden.

Wenn eine Prüfung aufgrund fehlender Abhängigkeiten, Umgebungsprobleme oder anderer Hindernisse nicht möglich ist, benenne dies ausdrücklich.

---

## 19. Abhängigkeiten und technische Entscheidungen

Neue Bibliotheken und Werkzeuge müssen einen nachvollziehbaren Nutzen bieten.

Prüfe vor der Einführung:

- Wird die Funktionalität tatsächlich benötigt?
- Existiert bereits eine geeignete Lösung im Projekt?
- Ist die neue Abhängigkeit mit der vorhandenen Architektur kompatibel?
- Entstehen zusätzliche Wartungs- oder Sicherheitsrisiken?
- Vereinfacht die Abhängigkeit den Code tatsächlich?
- Könnte eine kleine, verständliche Eigenimplementierung angemessener sein?

Vermeide sowohl unnötige Abhängigkeiten als auch selbst entwickelte Ersatzlösungen für komplexe, etablierte Funktionalität.

Wähle die einfachste wartbare Lösung, nicht automatisch die Lösung mit den wenigsten Abhängigkeiten.

Dokumentiere größere Architekturentscheidungen, wenn sie spätere Änderungen beeinflussen oder nicht ohne Weiteres rückgängig zu machen sind.

---

## 20. Git und Änderungen

Änderungen sollen nachvollziehbar und überprüfbar bleiben.

- Halte Änderungen möglichst auf eine fachlich zusammenhängende Aufgabe beschränkt.
- Vermeide Änderungen an nicht betroffenen Dateien.
- Committe keine Build-Artefakte oder vertraulichen Informationen.
- Verwende aussagekräftige Commit-Nachrichten.
- Entferne keinen bestehenden Code, ohne die Auswirkungen zu verstehen.
- Vermeide Änderungen an öffentlichen Schnittstellen, wenn sie für die Aufgabe nicht notwendig sind.
- Dokumentiere relevante Breaking Changes.
- Prüfe vor Abschluss, ob unerwartete Dateien verändert wurden.

Bestehende Änderungen anderer Entwickler dürfen nicht ohne nachvollziehbaren Grund überschrieben oder zurückgesetzt werden.

---

## 21. Definition of Done

Eine Aufgabe ist erst abgeschlossen, wenn die folgenden Punkte angemessen berücksichtigt wurden.

### Funktionalität

- Die geforderte Funktionalität ist implementiert.
- Relevante Randfälle sind berücksichtigt.
- Fehlerzustände werden nachvollziehbar behandelt.
- Bestehendes Verhalten bleibt erhalten, sofern keine Änderung vorgesehen ist.

### Codequalität

- Der Code ist leicht verständlich.
- Funktionen und Methoden haben klare Verantwortlichkeiten.
- Namen vermitteln die fachliche Bedeutung.
- Typen sind explizit und nachvollziehbar.
- Jede Klasse liegt in einer eigenen Datei.
- Fachliche Typdefinitionen liegen in dedizierten Typdateien.
- UI, Fachlogik und technische Infrastruktur sind angemessen getrennt.
- Unnötige Abstraktionen wurden vermieden.
- Es gibt keine ungenutzten Variablen oder unnötigen Implementierungsreste.

### Tests

- Neue oder geänderte Funktionalität ist durch passende Tests abgesichert.
- Relevante Fehlerfälle und Randbedingungen sind berücksichtigt.
- Bestehende Tests wurden nicht unnötig entfernt oder abgeschwächt.
- Relevante Test-Suites wurden ausgeführt.
- Fehlgeschlagene Prüfungen sind transparent dokumentiert.

### Technische Qualität

- TypeScript-Prüfungen sind erfolgreich.
- ESLint ist erfolgreich.
- Die Formatierung entspricht den Projektkonventionen.
- Der Produktionsbuild funktioniert, sofern er für die Änderung relevant ist.
- Es wurden keine unnötigen Abhängigkeiten eingeführt.
- Sicherheits- und Accessibility-Aspekte wurden berücksichtigt.

### Abschluss

Die abschließende Zusammenfassung muss kurz und nachvollziehbar enthalten:

1. Was geändert wurde.
2. Welche wesentlichen Entscheidungen getroffen wurden.
3. Welche Tests und Prüfungen ausgeführt wurden.
4. Ob bekannte Einschränkungen oder offene Punkte bestehen.

---

## 22. Abschließende Leitlinie

Wenn du zwischen zwei Implementierungen wählen musst, entscheide dich für diejenige, die ein anderer Entwickler in sechs Monaten am schnellsten verstehen und sicher verändern kann.

Bevorzuge expliziten Code, sprechende Namen, klare Verantwortlichkeiten und umfassende Tests.

Vermeide unnötige Abstraktionen, verschachtelte Logik und versteckte Seiteneffekte.

Jede Klasse erhält eine eigene Datei. Fachliche Typen werden in dedizierten Typdateien organisiert.

Methoden sollen einen klaren Ablauf erzählen, statt den Leser mit Implementierungsdetails zu überfordern.

Tests müssen nicht nur bestätigen, dass der normale Ablauf funktioniert. Sie sollen auch relevante Fehler, Randbedingungen und unerwartete Zustände sichtbar machen.

**Die wichtigste Regel lautet: Schreibe Code, den andere Menschen mühelos lesen, verstehen, testen und verändern können. Nicht Code, der möglichst clever aussieht oder möglichst wenige Zeilen benötigt.**
