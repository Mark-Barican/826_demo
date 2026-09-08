'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { SERVICES } from '@/lib/data/services';
import { BRANCHES, PRIMARY_BRANCH } from '@/lib/data/branches';
import { VEHICLE_SEGMENTS, type VehicleSegmentId } from '@/lib/data/pricing';
import { makesFor, vehicleNoun } from '@/lib/data/vehicles';
import { MakePicker } from './MakePicker';
import { DatePicker, formatLong } from './DatePicker';

interface BookingFormProps {
  initialService?: string;
  initialBranch?: string;
  initialSegment?: VehicleSegmentId;
}

/** What can be wrong. */
type FieldName = 'vehicleMake' | 'vehicleModel' | 'preferredDate' | 'ownerName' | 'ownerPhone';
type Errors = Partial<Record<FieldName, string>>;

/** The order the fields appear in, so "the first problem" means the top one. */
const FIELD_ORDER: FieldName[] = [
  'vehicleMake',
  'vehicleModel',
  'preferredDate',
  'ownerName',
  'ownerPhone',
];

/** Today, as the same `YYYY-MM-DD` string an `<input type="date">` produces. */
function today(): string {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

/**
 * Everything that has to be true before this is worth reading down a phone.
 *
 * Deliberately shallow. The only thing being protected here is a phone call
 * between two people, so this checks that the studio would know what car to
 * expect and how to reach its owner, and stops. A booking rejected for a
 * "malformed" name is a customer lost to a regular expression.
 *
 * The mobile check accepts the three ways a Philippine mobile is actually
 * typed - 09xx, +639xx and a bare 9xx - after stripping spaces, brackets and
 * dashes, because a customer copying a number off their own phone has no idea
 * which of those a form wants.
 */
function validate(values: Record<FieldName, string>): Errors {
  const errors: Errors = {};

  if (!values.vehicleMake.trim()) errors.vehicleMake = 'Which make? The studio quotes by vehicle.';
  if (!values.vehicleModel.trim()) errors.vehicleModel = 'Which model?';
  if (values.preferredDate && values.preferredDate < today()) {
    errors.preferredDate = 'That date has passed. Pick today or later.';
  }
  if (!values.ownerName.trim()) errors.ownerName = 'We need a name to put the booking under.';

  const digits = values.ownerPhone.replace(/\D/g, '');
  if (!values.ownerPhone.trim()) {
    errors.ownerPhone = 'We need a number to confirm the slot on.';
  } else if (!/^(09\d{9}|639\d{9}|9\d{9})$/.test(digits)) {
    errors.ownerPhone = 'That does not look like a mobile number. Try 0917 123 4567.';
  }

  return errors;
}

/**
 * Booking enquiry.
 *
 * IMPORTANT - THIS FORM DOES NOT SEND ANYTHING.
 *
 * `handleSubmit` has never made a network request. The old completion screen
 * said "Reservation Request Confirmed" and promised that a concierge desk
 * "will contact you via WhatsApp or phone"; nothing was logged, e-mailed or
 * stored, so every booking made through this form was silently lost and the
 * customer was told the opposite. Until a real endpoint exists, the end of this
 * form says plainly that nothing has been sent and hands over the studio's
 * number with a summary to read out. Wiring up a real submission is a separate
 * job, and /privacy has to be revisited on the same day it happens.
 *
 * IT IS ONE SCREEN, NOT FOUR STEPS. This used to be a stepper - Service,
 * Vehicle, Studio, You - with a progress rail, Back and Next buttons, and a
 * running summary in a sticky sidebar. That is a lot of apparatus for eight
 * questions, and it cost more than it looked: you could not see what was being
 * asked before starting, you could not correct step two from step four without
 * walking back through step three, and three quarters of the form was hidden at
 * any moment. It also caused a real bug - browsers cannot validate inputs that
 * have been unmounted, so `required` did nothing and an empty vehicle could be
 * submitted. Everything is now visible at once, in the order a person would
 * ask it, and validation runs over the whole form because the whole form is
 * always there.
 *
 * The three choices that have sensible defaults - service, vehicle class and
 * studio - are `<select>`s rather than grids of tiles. A tile grid for six
 * services and five studios was over 900px of page before the first text field.
 * `color-scheme: dark` is set globally, so the native menus come up dark and
 * need no restyling.
 */
export function BookingForm({
  initialService,
  initialBranch,
  initialSegment,
}: BookingFormProps) {
  const [serviceSlug, setServiceSlug] = useState(
    SERVICES.some((s) => s.slug === initialService) ? (initialService as string) : SERVICES[0].slug,
  );
  const [branchSlug, setBranchSlug] = useState(
    BRANCHES.some((b) => b.slug === initialBranch) ? (initialBranch as string) : PRIMARY_BRANCH.slug,
  );
  const [segment, setSegment] = useState<VehicleSegmentId>(initialSegment ?? 'sedan');
  const [vehicleMake, setVehicleMake] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleYear, setVehicleYear] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  /**
   * Bumped on every rejected attempt, purely to drive the focus effect below.
   *
   * The effect cannot key off `errors`, because that object changes on every
   * keystroke that clears a message - which would yank the caret out of the
   * field being typed into and back to the first broken one.
   */
  const [attempt, setAttempt] = useState(0);
  const focusTarget = useRef<FieldName | null>(null);

  const service = SERVICES.find((s) => s.slug === serviceSlug);
  const branch = BRANCHES.find((b) => b.slug === branchSlug);
  const segmentLabel = VEHICLE_SEGMENTS.find((s) => s.id === segment)?.label ?? '';
  const phone = branch?.phone ?? PRIMARY_BRANCH.phone;

  const values: Record<FieldName, string> = {
    vehicleMake,
    vehicleModel,
    preferredDate,
    ownerName,
    ownerPhone,
  };

  // Send the caret to the first thing that needs fixing. Being told something
  // is wrong and then having to hunt for it is most of what makes a form
  // annoying, and on a phone the broken field is often off-screen.
  useEffect(() => {
    if (!focusTarget.current) return;
    document.getElementById(`field-${focusTarget.current}`)?.focus();
    focusTarget.current = null;
  }, [attempt]);

  /**
   * Check one field, once its turn is over.
   *
   * A form that turns red while you are still typing your name is worse than
   * one that waits, so nothing is checked until you leave the field - and then
   * only that field, never the ones below it that you have not reached yet.
   * This is the idea worth taking from the 21st.dev "Multi-Field Form"
   * reference: validate as the reader goes, rather than saving up a pile of
   * complaints for the submit button.
   *
   * There is no separate "touched" set to keep alongside this. A message can
   * only get into `errors` from here or from submit, so the presence of one
   * already means the reader has finished with that field.
   */
  const handleBlur = (name: FieldName) => {
    const found = validate(values);
    setErrors((current) => {
      const next = { ...current };
      if (found[name]) next[name] = found[name];
      else delete next[name];
      return next;
    });
  };

  /** Clear one message the moment its field is edited, never on blur. */
  const clearError = (name: FieldName) =>
    setErrors((current) => {
      if (!(name in current)) return current;
      const next = { ...current };
      delete next[name];
      return next;
    });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const found = validate(values);
    const names = FIELD_ORDER.filter((name) => name in found);
    if (names.length) {
      setErrors(found);
      focusTarget.current = names[0];
      setAttempt((n) => n + 1);
      return;
    }

    setErrors({});
    setDone(true);
  };

  if (done) {
    return (
      <div className="mx-auto max-w-2xl border border-rule bg-surface-raised p-7 sm:p-10">
        <h2 className="type-section">Nothing has been sent.</h2>
        <p className="type-body mt-4 text-fg-muted">
          This form is not connected to 826 yet. Call {branch?.name ?? 'the studio'}, read out the
          summary below, and they can book the slot while you are on the phone.
        </p>

        <a
          href={`tel:${phone.replace(/\s+/g, '')}`}
          className="type-meta mt-7 flex min-h-[52px] items-center justify-center bg-accent px-6 text-on-accent transition-colors hover:bg-accent-hover"
        >
          Call {phone}
        </a>

        <dl className="mt-9 border-t border-rule">
          <SummaryRow label="Service" value={service?.title} />
          <SummaryRow
            label="Vehicle"
            value={[vehicleYear, vehicleMake, vehicleModel].filter(Boolean).join(' ')}
          />
          <SummaryRow label="Vehicle type" value={segmentLabel} />
          <SummaryRow label="Studio" value={branch?.name} />
          <SummaryRow
            label="Preferred date"
            value={preferredDate ? formatLong(preferredDate) : 'Earliest available'}
          />
          <SummaryRow label="Name" value={ownerName} />
          <SummaryRow label="Mobile" value={ownerPhone} />
          {notes && <SummaryRow label="Notes" value={notes} />}
        </dl>

        <div className="mt-9 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setDone(false)}
            className="type-meta inline-flex min-h-[48px] items-center border border-rule px-6 text-fg transition-colors hover:border-accent hover:text-accent"
          >
            Change an answer
          </button>
          <Link
            href="/work"
            className="type-meta inline-flex min-h-[48px] items-center border border-rule px-6 text-fg transition-colors hover:border-accent hover:text-accent"
          >
            See the work
          </Link>
        </div>
      </div>
    );
  }

  const errorCount = Object.keys(errors).length;

  return (
    <form onSubmit={handleSubmit} noValidate className="mx-auto max-w-2xl">
      {/* Said once, at the top, where somebody deciding whether to fill this in
          can read it - not sprung on them after eight answers. */}
      <p className="type-detail border-l-2 border-accent pl-4 text-fg-muted">
        This builds a summary to read out when you call - a person confirms the slot.{' '}
        <a
          href={`tel:${phone.replace(/\s+/g, '')}`}
          className="text-fg underline decoration-accent underline-offset-4"
        >
          Or just call {phone}
        </a>
      </p>

      {attempt > 0 && errorCount > 0 && (
        <p role="alert" className="mt-8 border-l-2 border-danger pl-4 type-detail text-danger">
          {errorCount === 1 ? 'One answer needs fixing.' : `${errorCount} answers need fixing.`}
        </p>
      )}

      <Group title="What do you need?">
        <Select
          name="service"
          label="Service"
          value={serviceSlug}
          onChange={setServiceSlug}
          options={SERVICES.map((s) => ({ value: s.slug, label: s.shortTitle }))}
          hint={service ? `Usually ${service.duration.toLowerCase()} in the studio.` : undefined}
        />
      </Group>

      <Group title="What are we working on?">
        <Select
          name="segment"
          label="Vehicle type"
          value={segment}
          onChange={(v) => {
            const next = v as VehicleSegmentId;
            setSegment(next);
            // A make from the other list is now wrong - Ducati is not a car and
            // Land Rover is not a motorcycle - so drop it rather than leave a
            // stale answer the new suggestions cannot explain. Anything the
            // reader typed that is in BOTH lists (Honda, Suzuki, BMW) is kept.
            if (vehicleMake && !makesFor(next).includes(vehicleMake)) {
              setVehicleMake('');
              clearError('vehicleMake');
            }
          }}
          options={VEHICLE_SEGMENTS.map((s) => ({ value: s.id, label: s.label }))}
          hint={VEHICLE_SEGMENTS.find((s) => s.id === segment)?.examples}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="field-vehicleMake" className="type-meta mb-2 block text-fg-muted">
              Make<span aria-hidden> *</span>
            </label>
            <MakePicker
              id="field-vehicleMake"
              required
              value={vehicleMake}
              options={makesFor(segment)}
              noun={vehicleNoun(segment)}
              error={errors.vehicleMake}
              errorId="field-vehicleMake-error"
              placeholder={segment === 'motorcycle' ? 'Vespa' : 'Toyota'}
              onChange={(v) => {
                setVehicleMake(v);
                clearError('vehicleMake');
              }}
              onBlur={() => handleBlur('vehicleMake')}
            />
            {errors.vehicleMake && (
              <p id="field-vehicleMake-error" className="mt-2 type-detail text-danger">
                {errors.vehicleMake}
              </p>
            )}
          </div>
          <Field
            name="vehicleModel"
            label="Model"
            required
            onBlur={() => handleBlur('vehicleModel')}
            value={vehicleModel}
            error={errors.vehicleModel}
            onChange={(v) => {
              setVehicleModel(v);
              clearError('vehicleModel');
            }}
            placeholder={segment === 'motorcycle' ? 'Primavera' : 'Fortuner'}
          />
        </div>
        <Field
          name="vehicleYear"
          label="Year and colour"
          optional
          value={vehicleYear}
          onChange={setVehicleYear}
          placeholder="2022, white"
        />
      </Group>

      <Group title="Where and when?">
        <Select
          name="branch"
          label="Studio"
          value={branchSlug}
          onChange={setBranchSlug}
          options={BRANCHES.map((b) => ({
            value: b.slug,
            label: `${b.name.replace(/^826\s*/, '')} - ${b.city}`,
          }))}
          hint={branch?.address}
        />
        <div>
          <label htmlFor="field-preferredDate" className="type-meta mb-2 block text-fg-muted">
            Preferred date <span className="text-fg-muted/70">(optional)</span>
          </label>
          <DatePicker
            id="field-preferredDate"
            value={preferredDate}
            describedBy="field-preferredDate-hint"
            onChange={(v) => {
              setPreferredDate(v);
              clearError('preferredDate');
            }}
          />
          <p id="field-preferredDate-hint" className="mt-2 text-[13px] leading-snug text-fg-muted">
            A preference, not a reservation. The studio confirms the slot.
          </p>
        </div>
      </Group>

      <Group title="How do we reach you?">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            name="ownerName"
            label="Name"
            required
            onBlur={() => handleBlur('ownerName')}
            value={ownerName}
            error={errors.ownerName}
            autoComplete="name"
            onChange={(v) => {
              setOwnerName(v);
              clearError('ownerName');
            }}
            placeholder="Your name"
          />
          <Field
            name="ownerPhone"
            label="Mobile"
            required
            onBlur={() => handleBlur('ownerPhone')}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={ownerPhone}
            error={errors.ownerPhone}
            onChange={(v) => {
              setOwnerPhone(v);
              clearError('ownerPhone');
            }}
            placeholder="0917 123 4567"
          />
        </div>
        <div>
          <label className="type-meta mb-2 block text-fg-muted" htmlFor="field-notes">
            Anything we should know <span className="text-fg-muted/70">(optional)</span>
          </label>
          <div className="relative">
            <textarea
              id="field-notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Repaints, rock chips, deadlines"
              className="peer block w-full border border-rule bg-surface-raised px-4 py-3 text-sm text-fg placeholder:text-fg-muted focus:outline-none"
            />
            <FocusRule />
          </div>
        </div>
      </Group>

      <button
        type="submit"
        className="type-meta mt-10 flex min-h-[52px] w-full items-center justify-center bg-accent px-8 text-on-accent transition-colors hover:bg-accent-hover"
      >
        Get my summary
      </button>
    </form>
  );
}

/**
 * One group of questions.
 *
 * A `fieldset` with a real `legend`, not a styled `div` with a heading beside
 * it: a screen reader announces the legend with every field inside it, so
 * "Make" is read as "What are we working on? Make" without the label having to
 * repeat the context in its own text.
 */
function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="mt-10 border-t border-rule pt-7 first-of-type:mt-8 first-of-type:border-t-0 first-of-type:pt-0">
      <legend className="type-card mb-6">{title}</legend>
      <div className="flex flex-col gap-5">{children}</div>
    </fieldset>
  );
}

/**
 * The rule that grows under a focused field.
 *
 * THIS IS THE ONE THING WORTH BORROWING FROM THE EFFECT LIBRARIES, and it had
 * to be rebuilt rather than installed. ReactBits' form-adjacent pieces are
 * BorderGlow, GlassSurface, SpotlightCard, StarBorder - glows, blurs and
 * gradient borders, which is the exact vocabulary this site's rules exclude,
 * and 21st.dev's field set is shadcn: rounded corners, drop shadows and a
 * focus ring offset. What they are all reaching for is the same idea - tell me,
 * unmistakably, which field I am in - and this site already has its own way of
 * saying that. A hairline that grows from the left is what `SectionLink` does
 * on hover and what the header's active-page rule does on navigation. So the
 * focus state is that same gesture, and the form ends up looking like the site
 * rather than like a component gallery.
 *
 * Pure CSS off the `peer` class on the input beside it: no JavaScript, no state
 * and nothing to keep in sync. `scaleX` rather than width, so it is a composited
 * transform. It turns red instead of gold when the field is in error, because a
 * gold flourish under a rejected answer reads as approval.
 *
 * Keyboard users additionally get the gold outline from `:focus-visible` in
 * globals.css - that rule is unlayered, so `focus:outline-none` here cannot
 * take it away. Mouse users get this. Nobody gets neither.
 */
function FocusRule({ error = false }: { error?: boolean }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 transition-transform duration-300 ease-out peer-focus:scale-x-100 motion-reduce:transition-none ${
        error ? 'bg-danger' : 'bg-accent'
      }`}
    />
  );
}

/**
 * One labelled input, and its error.
 *
 * The id comes from `name` rather than from the label text, which is what makes
 * it addressable: the form focuses a broken field by id, and deriving that id
 * from a label would mean renaming "Mobile" to "Phone" silently breaks the
 * focus handling with nothing to catch it.
 *
 * THE MESSAGE IS NOT ONLY RED. It is named by `aria-describedby`, so a screen
 * reader reads it out with the field rather than leaving it as decoration
 * beside one, and `aria-invalid` marks the field itself. Colour alone would
 * tell a colour-blind reader nothing.
 *
 * `noValidate` on the form means the browser's own bubbles never appear, so
 * `required` here is left purely as the semantic hint for assistive tech - the
 * checks that actually run are in `validate`, against state.
 */
function Field({
  name,
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
  optional = false,
  error,
  hint,
  min,
  inputMode,
  autoComplete,
  onBlur,
  suggestions,
}: {
  name: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  suggestions?: readonly string[];
  placeholder?: string;
  type?: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
  hint?: string;
  min?: string;
  inputMode?: 'text' | 'tel' | 'numeric' | 'email';
  autoComplete?: string;
}) {
  const id = `field-${name}`;
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  return (
    <div>
      <label htmlFor={id} className="type-meta mb-2 block text-fg-muted">
        {label}
        {required && <span aria-hidden> *</span>}
        {optional && <span className="text-fg-muted/70"> (optional)</span>}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          min={min}
          list={suggestions ? `${id}-options` : undefined}
          inputMode={inputMode}
          autoComplete={autoComplete}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`peer w-full border bg-surface-raised px-4 py-3 text-sm text-fg placeholder:text-fg-muted focus:outline-none ${
            error ? 'border-danger' : 'border-rule'
          }`}
        />
        <FocusRule error={Boolean(error)} />
        {suggestions && (
          <datalist id={`${id}-options`}>
            {suggestions.map((option) => (
              <option key={option} value={option} />
            ))}
          </datalist>
        )}
      </div>
      {error ? (
        <p id={errorId} className="mt-2 type-detail text-danger">
          {error}
        </p>
      ) : (
        hint && (
          <p id={hintId} className="mt-2 text-[13px] leading-snug text-fg-muted">
            {hint}
          </p>
        )
      )}
    </div>
  );
}

/** One labelled dropdown. Native, so the phone gives it the OS picker. */
function Select({
  name,
  label,
  value,
  onChange,
  options,
  hint,
}: {
  name: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  hint?: string;
}) {
  const id = `field-${name}`;
  const hintId = `${id}-hint`;

  return (
    <div>
      <label htmlFor={id} className="type-meta mb-2 block text-fg-muted">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-describedby={hint ? hintId : undefined}
          className="peer w-full border border-rule bg-surface-raised px-4 py-3 text-sm text-fg focus:outline-none"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <FocusRule />
      </div>
      {hint && (
        <p id={hintId} className="mt-2 text-[13px] leading-snug text-fg-muted">
          {hint}
        </p>
      )}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-rule-soft py-3">
      <dt className="type-meta text-fg-muted">{label}</dt>
      <dd className="text-sm">{value}</dd>
    </div>
  );
}
