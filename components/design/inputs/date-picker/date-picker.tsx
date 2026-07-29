import React, { type CSSProperties } from 'react';
import {
  DatePicker as AriaDatePicker,
  DateInput,
  DateSegment,
  Button,
  Popover,
  Dialog,
  Calendar,
  CalendarGrid,
  CalendarGridHeader,
  CalendarHeaderCell,
  CalendarGridBody,
  CalendarCell,
  Heading,
  Group,
} from 'react-aria-components';
import { CalendarDate, today, getLocalTimeZone } from '@internationalized/date';
import { usePortalContainer } from '@api-banking/design.api-banking-theme';
import { Icon } from '@api-banking/design.content.icon';
import { CalendarIconPath, ChevronLeftIconPath, ChevronRightIconPath } from './calendar-icon.js';
import styles from './date-picker.module.scss';

/**
 * Defines the properties for the DatePicker component.
 */
export type DatePickerProps = {
  /**
   * The currently selected date. Can be null if no date is selected.
   */
  value?: Date | null;
  /**
   * Callback function that is called when a new date is selected.
   * @param date - The newly selected Date object.
   */
  onChange: (date: Date | null) => void;
  /**
   * Placeholder text for the input field when no date is selected.
   * @default 'MM/DD/YYYY'
   */
  placeholder?: string;
  /**
   * If true, the date picker will be disabled and non-interactive.
   * @default false
   */
  disabled?: boolean;
  /**
   * Optional class name to apply to the root element for custom styling.
   */
  className?: string;
  /**
   * Optional inline styles to apply to the root element.
   */
  style?: CSSProperties;
  /**
   * If true, shows error styling on the input.
   * @default false
   */
  error?: boolean;
  /**
   * If true, dates after today will be disabled.
   * @default false
   */
  disableFutureDates?: boolean;
  /**
   * If true, dates before today will be disabled.
   * @default false
   */
  disablePastDates?: boolean;
  /**
   * If true, the calendar popup will be rendered via a portal to document.body.
   * This is useful when the date picker is inside a container with overflow: hidden.
   * React Aria Popover handles portaling natively, so this prop is accepted
   * for backward compatibility but has no effect.
   * @default false
   */
  usePortal?: boolean;
};

function jsDateToCalendarDate(date: Date): CalendarDate {
  return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

function calendarDateToJsDate(cd: CalendarDate): Date {
  return new Date(cd.year, cd.month - 1, cd.day);
}

/**
 * An intuitive and accessible date picker component that allows users to select a date from a calendar interface
 * or by typing directly. It integrates with the application's theme and provides a seamless user experience.
 */
export function DatePicker({
  value,
  onChange,
  placeholder,
  disabled = false,
  className,
  style,
  error = false,
  disableFutureDates = false,
  disablePastDates = false,
  usePortal,
}: DatePickerProps) {
  const portalContainer = usePortalContainer();

  const ariaValue = value ? jsDateToCalendarDate(value) : null;
  const todayDate = today(getLocalTimeZone());

  const handleChange = (cd: CalendarDate | null) => {
    onChange(cd ? calendarDateToJsDate(cd) : null);
  };

  const handleDateInputKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === '/') {
      e.preventDefault();
      const segments = Array.from(
        e.currentTarget.querySelectorAll('[data-type]:not([data-type="literal"])')
      ) as HTMLElement[];
      const idx = segments.indexOf(document.activeElement as HTMLElement);
      if (idx >= 0 && idx < segments.length - 1) {
        segments[idx + 1].focus();
      }
    }
  };

  return (
    <AriaDatePicker
      aria-label="Date Picker"
      value={ariaValue}
      onChange={handleChange}
      isDisabled={disabled}
      isInvalid={error && !disabled}
      maxValue={disableFutureDates ? todayDate : undefined}
      minValue={disablePastDates ? todayDate : undefined}
      className={`${styles.datePickerWrapper}${className ? ` ${className}` : ''}`}
      style={style}
    >
      <Group className={styles.inputGroup}>
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
        <div onKeyDown={handleDateInputKeyDown} className={styles.dateInputWrapper}>
          <DateInput className={styles.dateInput}>
            {(segment) => <DateSegment segment={segment} className={styles.dateSegment} />}
          </DateInput>
        </div>
        <Button className={styles.iconButton}>
          <Icon size="20px">
            <CalendarIconPath />
          </Icon>
        </Button>
      </Group>
      <Popover className={styles.calendarPopup} UNSTABLE_portalContainer={portalContainer}>
        <Dialog className={styles.calendarDialog}>
          <Calendar className={styles.calendar}>
            <header className={styles.calendarHeader}>
              <Button slot="previous" aria-label="Previous month" className={styles.navButton}>
                <Icon size="20px">
                  <ChevronLeftIconPath />
                </Icon>
              </Button>
              <Heading className={styles.monthYearDisplay} />
              <Button slot="next" aria-label="Next month" className={styles.navButton}>
                <Icon size="20px">
                  <ChevronRightIconPath />
                </Icon>
              </Button>
            </header>
            <CalendarGrid className={styles.calendarGrid}>
              <CalendarGridHeader className={styles.calendarGridHeader}>
                {(day) => <CalendarHeaderCell className={styles.weekday}>{day}</CalendarHeaderCell>}
              </CalendarGridHeader>
              <CalendarGridBody>
                {(date) => <CalendarCell date={date} className={styles.day} />}
              </CalendarGridBody>
            </CalendarGrid>
          </Calendar>
        </Dialog>
      </Popover>
    </AriaDatePicker>
  );
}
