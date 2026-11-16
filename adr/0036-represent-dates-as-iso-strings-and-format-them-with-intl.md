# 0036. Represent dates as ISO strings and format them with Intl

- Status: Proposed
- Date: 2026-11-16
- Related: [0011](0011-controlled-uncontrolled-props-naming.md), [0029](0029-render-overlays-in-place-in-the-top-layer-with-native-dialog-and-popover.md)

## Context

Date Input and Date Picker (M5) need a type for their values (`value`, `defaultValue`,
`bind:value`, `min`, `max`, disabled dates) and rules for locale, calendar system, first day of
week and time zone.

Constraints:

- **Qwik serializes state.** Values in signals and props must survive SSR → resume. Plain
  values (strings, numbers, `Date`) serialize; instances of library classes (for example
  `CalendarDate` of `@internationalized/date`) do not, unless wrapped in `noSerialize`, which
  drops them on resume.
- **Supported browsers** are those in which the features we use are Baseline (newly
  available) (adr/0029). As of 2026-11, `Temporal` ships in Chrome (144) and Firefox (139) but
  not in a stable Safari, so it is not Baseline and would need a polyfill.
- A date picker mostly works with **calendar dates without a time**. `Date` is an instant in
  time, so using it for a calendar date shifts the day across time zones (a classic bug).
- `Intl.DateTimeFormat` is Baseline and gives localized month and weekday names, and the
  order of date fields for a locale.

## Considered Options

1. **`Temporal` with a polyfill** — The right model (`Temporal.PlainDate`), but the polyfill
   is large, and `Temporal` objects are not serializable by Qwik 1.
2. **`@internationalized/date`** — Mature, supports many calendars and time zones, but its
   objects are class instances that Qwik cannot serialize, and it adds a dependency to every
   consumer.
3. **Native `Date`** — Serializable and built in, but it is an instant, so calendar dates
   shift with the time zone.
4. **ISO 8601 strings in the API, small date math inside** — Values are strings such as
   `"2026-11-16"`. Serializable, unambiguous, sortable, and they match `<input type="date">`,
   form submission and `Temporal.PlainDate.toString()`.

## Decision

We will represent dates in the public API as **ISO 8601 calendar date strings**
(`"YYYY-MM-DD"`), with `null` for no date:

- `value` / `defaultValue` / `bind:value` (`Signal<string | null>`), `min`, `max`, and the
  argument of `isDateDisabled$` are ISO date strings.
- The HiddenInput submits the same string (adr/0026), like a native `<input type="date">`.
- Time and date-time values are out of scope until a component needs them; they will use ISO
  strings as well (`"HH:mm"`, `"YYYY-MM-DDTHH:mm"`), without a time zone.

We will do **date math in `@leve-ui/utils`** with small pure functions on `{ year, month, day }`
(parse / format ISO, add days and months, compare, days in month, day of week), using UTC
only to compute the day of week. We will not add a date library dependency.

We will use **`Intl`** for everything shown to the user:

- `locale` prop (a BCP 47 tag), defaulting to `en-US`. We will not read the browser's
  locale, so that the SSR output and the client agree; apps pass the locale they render.
- Month and weekday names and the field order come from `Intl.DateTimeFormat(locale)`.
- `weekStartsOn` prop (`0`–`6`). When it is not given, it comes from
  `Intl.Locale#getWeekInfo()` where available, otherwise `0` (Sunday).

We will support only the **Gregorian calendar** for values. Other calendars may be used for
display later through `Intl`, but values stay ISO (Gregorian) dates.

Calendar dates have **no time zone**. "Today" is computed from the user's local date on the
client; during SSR there is no "today" highlight.

## Rationale

- ISO strings are the only option that is serializable by Qwik, has no dependency, does not
  shift with time zones, and works with native forms.
- The date math a date picker needs is small and easy to test. A library would cost every
  consumer bundle size for features we do not use.
- `Intl` is Baseline and covers localization. Supporting non-Gregorian values would need a
  calendar library, which we do not want before there is a need.
- When `Temporal` becomes Baseline, `Temporal.PlainDate.from(value)` and `.toString()` read
  and write the same strings, so the public API does not change.

## Consequences

- `@leve-ui/utils` gets a date module with unit tests (including month and year boundaries
  and leap years).
- Consumers convert to their own date type at the edge (`Temporal.PlainDate.from(value)`,
  `new Date(`${value}T00:00`)`, `parseDate(value)` of `@internationalized/date`).
- Invalid strings are treated as no date (`null`) and reported in development.
- The "today" marker appears only after the component resumes on the client.

## Revisit When

- `Temporal` is Baseline (switch the internal math to `Temporal.PlainDate`, keep the API).
- Users need non-Gregorian calendars or date-time values with time zones.
- Qwik can serialize custom classes.
