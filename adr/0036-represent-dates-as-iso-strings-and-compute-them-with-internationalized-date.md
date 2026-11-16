# 0036. Represent dates as ISO strings and compute them with @internationalized/date

- Status: Accepted
- Date: 2026-11-16
- Related: [0011](0011-controlled-uncontrolled-props-naming.md), [0026](0026-participate-in-native-forms-through-a-hiddeninput-part.md), [0029](0029-render-overlays-in-place-in-the-top-layer-with-native-dialog-and-popover.md)

## Context

Date Input and Date Picker (M5) need a type for their values (`value`, `defaultValue`,
`bind:value`, `min`, `max`, unavailable dates) and rules for locale, calendar system, first
day of week and time zone.

Date components are hard mostly because of three things, not because of Gregorian date math:

- **calendar systems** (Japanese era, Buddhist, Islamic, …), where months and years work
  differently;
- **time zones and date-time values** (daylight saving time, offsets);
- **segmented date fields** (year / month / day typed separately, ordered per locale).

That is why calendar logic usually lives in dedicated libraries. We do not want leve-ui to
own calendar knowledge; its responsibility should stay the same as for other components:
interaction state, ARIA, keyboard handling and parts.

Constraints:

- **Qwik serializes state.** Values in signals and props must survive SSR → resume. Strings,
  numbers and `Date` serialize; instances of library classes (for example `CalendarDate` of
  `@internationalized/date`) and state machines do not, unless wrapped in `noSerialize`, which
  drops them on resume.
- **Supported browsers** are those in which the features we use are Baseline (newly
  available) (adr/0029). As of 2026-11, `Temporal` ships in Chrome (144) and Firefox (139) but
  not in a stable Safari, so it is not Baseline and would need a polyfill.
- `Date` is an instant in time, so using it for a calendar date shifts the day across time
  zones.

## Considered Options

1. **Our own date math on ISO strings** — No dependency and serializable, but leve-ui would
   own calendar knowledge, and every new calendar system or time zone feature would grow it.
2. **`@zag-js/date-picker`** — Complete interaction logic, but it has no Qwik adapter, keeps
   its state in a state machine and `@internationalized/date` objects that Qwik cannot
   serialize (the picker would be rebuilt on the client after resume), and uses its own
   attributes (`data-scope` / `data-part`) and state handling instead of leve-ui's.
3. **`Temporal` with a polyfill** — The right model (`Temporal.PlainDate`), but not Baseline,
   the polyfill is large, and Qwik 1 cannot serialize `Temporal` objects.
4. **ISO strings in the API, `@internationalized/date` inside** — Values stay plain strings;
   calendar arithmetic, calendar systems and time zones are delegated to a framework-agnostic
   library of pure functions and value objects, used only inside the date packages.

## Decision

We will represent dates in the public API as **ISO 8601 calendar date strings**
(`"YYYY-MM-DD"`), with `null` for no date:

- `value` / `defaultValue` / `bind:value` (`Signal<string | null>`), `min`, `max`, and the
  argument of `isDateUnavailable$` are ISO date strings.
- The HiddenInput submits the same string (adr/0026), like a native `<input type="date">`.
- Date-time values, when a component needs them, will also be ISO strings.

We will compute dates with **`@internationalized/date`** inside the date packages:

- Strings are parsed (`parseDate`) where they are used and converted back with `toString()`.
  `CalendarDate` objects are never stored in signals, context or props, so nothing
  non-serializable crosses the SSR → resume boundary.
- `@internationalized/date` is a dependency of the date packages only (Date Picker, Date
  Input, Calendar), not of `@leve-ui/utils` or other components.
- Calendar systems and time zones come from the library when we support them; leve-ui does
  not implement calendar rules.

We will use **`Intl`** (through the library's `DateFormatter` where useful) for everything
shown to the user:

- `locale` prop (a BCP 47 tag), defaulting to `en-US`. We will not read the browser's
  locale, so that the SSR output and the client agree; apps pass the locale they render.
- `weekStartsOn` prop (`0`–`6`); when it is not given, it comes from the locale.

We will start with the **Gregorian calendar and date-only values**. Non-Gregorian calendars
(for example the Japanese calendar) and date-time values are later additions on top of the
same library.

We will **not build a segmented date field** at first. Date entry starts with a text input
(or the native `<input type="date">`) combined with the calendar.

leve-ui owns only what it owns for every component: the open / focused / selected state, ARIA,
keyboard interaction (following the APG Date Picker Dialog pattern), focus management and
parts.

## Rationale

- ISO strings are serializable by Qwik, unambiguous, sortable, do not shift with time zones and
  match native forms.
- Delegating calendar rules to `@internationalized/date` keeps leve-ui's responsibility small,
  which was the main concern with option 1, without the Qwik problems of option 2. It is the
  same library that Zag and React Aria build on, so it is well tested.
- Using the library only at the edges of the date packages keeps its objects out of Qwik state
  and its dependency out of packages that do not need it.
- Segmented fields are the most complex and least necessary part; starting without them keeps
  the first version small.
- When `Temporal` becomes Baseline, `Temporal.PlainDate` reads and writes the same strings, so
  the public API does not change.

## Consequences

- The date packages depend on `@internationalized/date`; consumers of other packages are not
  affected.
- Components parse ISO strings at the start of each computation; invalid strings are treated as
  no date (`null`) and reported in development.
- Consumers convert to their own date type at the edge (`parseDate(value)`,
  `Temporal.PlainDate.from(value)`, `` new Date(`${value}T00:00`) ``).
- "Today" is computed on the client; during SSR there is no "today" marker.
- A segmented date field, non-Gregorian calendars and date-time values need follow-up issues.

## Revisit When

- `Temporal` is Baseline (it could replace the library inside, keeping the API).
- Users need a segmented date field, non-Gregorian calendars or time zones.
- Qwik can serialize custom classes.
