import React from 'react';
import { render, screen, fireEvent, within, waitFor, cleanup } from '@testing-library/react';
import { ApiBankingTheme } from '@api-banking/design.api-banking-theme';
import { DatePicker } from './date-picker.js';

// Polyfill ResizeObserver for jsdom (required by React Aria Popover)
if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}

    unobserve() {}

    disconnect() {}
  } as any;
}

// Store the original Date constructor
const RealDate = Date;

// Define MOCK_DATE using the RealDate constructor to avoid mocking it inadvertently
const MOCK_DATE = new RealDate(2024, 0, 15); // January 15, 2024

describe('DatePicker', () => {
  beforeAll(() => {
    // Mock global Date object
    global.Date = class extends RealDate {
      constructor(...args: any[]) {
        super();

        if (args.length === 0) {
          return new RealDate(MOCK_DATE.getTime());
        }
        // @ts-ignore
        return new RealDate(...args);
      }

      static now() {
        return MOCK_DATE.getTime();
      }

      static parse = RealDate.parse;

      static UTC = RealDate.UTC;
    } as typeof Date;
  });

  afterAll(() => {
    global.Date = RealDate;
  });

  afterEach(() => {
    cleanup();
  });

  const renderWithTheme = (ui: React.ReactElement) => {
    return render(<ApiBankingTheme>{ui}</ApiBankingTheme>);
  };

  /** Opens the calendar and returns the dialog element */
  const openCalendar = () => {
    const triggerButton = screen.getByRole('button');
    fireEvent.click(triggerButton);
    return screen.getByRole('dialog');
  };

  describe('rendering', () => {
    it('should render with date segments', () => {
      renderWithTheme(<DatePicker onChange={() => {}} value={null} />);
      const group = screen.getByRole('group');
      expect(group).toBeInTheDocument();
    });

    it('should display the selected date', () => {
      const selectedDate = new RealDate(2024, 0, 20); // January 20, 2024
      renderWithTheme(<DatePicker onChange={() => {}} value={selectedDate} />);
      const group = screen.getByRole('group');
      expect(group).toHaveTextContent('1');
      expect(group).toHaveTextContent('20');
      expect(group).toHaveTextContent('2024');
    });

    it('should apply custom className', () => {
      const { container } = renderWithTheme(
        <DatePicker onChange={() => {}} value={null} className="custom-class" />
      );
      const wrapper = container.querySelector('.datePickerWrapper');
      expect(wrapper).toHaveClass('custom-class');
    });

    it('should apply custom style', () => {
      const { container } = renderWithTheme(
        <DatePicker onChange={() => {}} value={null} style={{ width: '300px' }} />
      );
      const wrapper = container.querySelector('.datePickerWrapper');
      expect(wrapper).toHaveStyle({ width: '300px' });
    });

    it('should have calendar trigger button', () => {
      renderWithTheme(<DatePicker onChange={() => {}} value={null} />);
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe('calendar popup', () => {
    it('should open calendar when trigger button is clicked', () => {
      renderWithTheme(<DatePicker onChange={() => {}} value={null} />);
      openCalendar();
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should display a calendar grid', () => {
      renderWithTheme(<DatePicker onChange={() => {}} value={null} />);
      openCalendar();
      expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    it('should display month and year heading', () => {
      renderWithTheme(<DatePicker onChange={() => {}} value={null} />);
      openCalendar();
      expect(screen.getByRole('heading', { name: /January 2024/ })).toBeInTheDocument();
    });
  });

  describe('date selection', () => {
    it('should call onChange when a date is selected', () => {
      const onChange = vi.fn();
      renderWithTheme(<DatePicker onChange={onChange} value={null} />);
      openCalendar();

      const dayButton = screen.getByRole('button', { name: /January 10, 2024/ });
      fireEvent.click(dayButton);

      expect(onChange).toHaveBeenCalledTimes(1);
      const calledDate = onChange.mock.calls[0][0] as Date;
      expect(calledDate.getFullYear()).toBe(2024);
      expect(calledDate.getMonth()).toBe(0);
      expect(calledDate.getDate()).toBe(10);
    });

    it('should close calendar after selection', async () => {
      const onChange = vi.fn();
      renderWithTheme(<DatePicker onChange={onChange} value={null} />);
      openCalendar();

      const dayButton = screen.getByRole('button', { name: /January 10, 2024/ });
      fireEvent.click(dayButton);

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });
  });

  describe('month navigation', () => {
    it('should navigate to next month', () => {
      renderWithTheme(<DatePicker onChange={() => {}} value={null} />);
      openCalendar();

      expect(screen.getByRole('heading', { name: /January 2024/ })).toBeInTheDocument();

      const nextMonthButton = screen.getByRole('button', { name: 'Next month' });
      fireEvent.click(nextMonthButton);

      expect(screen.getByRole('heading', { name: /February 2024/ })).toBeInTheDocument();
    });

    it('should navigate to previous month', () => {
      renderWithTheme(<DatePicker onChange={() => {}} value={null} />);
      openCalendar();

      expect(screen.getByRole('heading', { name: /January 2024/ })).toBeInTheDocument();

      const prevMonthButton = screen.getByRole('button', { name: 'Previous month' });
      fireEvent.click(prevMonthButton);

      expect(screen.getByRole('heading', { name: /December 2023/ })).toBeInTheDocument();
    });

    it('should navigate across years', () => {
      renderWithTheme(<DatePicker onChange={() => {}} value={null} />);
      openCalendar();

      const nextMonthButton = screen.getByRole('button', { name: 'Next month' });
      for (let i = 0; i < 12; i++) {
        fireEvent.click(nextMonthButton);
      }

      expect(screen.getByRole('heading', { name: /January 2025/ })).toBeInTheDocument();
    });
  });

  describe('disabled state', () => {
    it('should not open the calendar when disabled', () => {
      renderWithTheme(<DatePicker onChange={() => {}} value={null} disabled />);
      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).toBeDisabled();
      });

      fireEvent.click(buttons[0]);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should disable the date input when disabled', () => {
      renderWithTheme(<DatePicker onChange={() => {}} value={null} disabled />);
      const group = screen.getByRole('group');
      expect(group).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('error state', () => {
    it('should mark the date picker as invalid when error prop is true', () => {
      const { container } = renderWithTheme(<DatePicker onChange={() => {}} value={null} error />);
      const wrapper = container.querySelector('.datePickerWrapper');
      expect(wrapper).toHaveAttribute('data-invalid');
    });

    it('should not have data-invalid when disabled even if error is true', () => {
      const { container } = renderWithTheme(
        <DatePicker onChange={() => {}} value={null} error disabled />
      );
      const wrapper = container.querySelector('.datePickerWrapper');
      expect(wrapper).not.toHaveAttribute('data-invalid');
    });
  });

  describe('disableFutureDates', () => {
    it('should disable dates after today in the calendar', () => {
      renderWithTheme(<DatePicker onChange={() => {}} value={null} disableFutureDates />);
      openCalendar();

      const grid = screen.getByRole('grid');
      // January 16, 2024 is after MOCK_DATE (January 15)
      const futureCell = within(grid).getByText('16').closest('td');
      expect(futureCell).toHaveAttribute('aria-disabled', 'true');
    });

    it('should allow dates before today', () => {
      renderWithTheme(<DatePicker onChange={() => {}} value={null} disableFutureDates />);
      openCalendar();

      const grid = screen.getByRole('grid');
      // January 14, 2024 is before MOCK_DATE (January 15)
      const pastCell = within(grid).getByText('14').closest('td');
      expect(pastCell).not.toHaveAttribute('aria-disabled', 'true');
    });

    it('should allow today', () => {
      renderWithTheme(<DatePicker onChange={() => {}} value={null} disableFutureDates />);
      openCalendar();

      const grid = screen.getByRole('grid');
      // January 15, 2024 is MOCK_DATE (today)
      const todayCell = within(grid).getByText('15').closest('td');
      expect(todayCell).not.toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('disablePastDates', () => {
    it('should disable dates before today in the calendar', () => {
      renderWithTheme(<DatePicker onChange={() => {}} value={null} disablePastDates />);
      openCalendar();

      const grid = screen.getByRole('grid');
      // January 14, 2024 is before MOCK_DATE (January 15)
      const pastCell = within(grid).getByText('14').closest('td');
      expect(pastCell).toHaveAttribute('aria-disabled', 'true');
    });

    it('should allow dates after today', () => {
      renderWithTheme(<DatePicker onChange={() => {}} value={null} disablePastDates />);
      openCalendar();

      const grid = screen.getByRole('grid');
      // January 16, 2024 is after MOCK_DATE (January 15)
      const futureCell = within(grid).getByText('16').closest('td');
      expect(futureCell).not.toHaveAttribute('aria-disabled', 'true');
    });

    it('should allow today', () => {
      renderWithTheme(<DatePicker onChange={() => {}} value={null} disablePastDates />);
      openCalendar();

      const grid = screen.getByRole('grid');
      // January 15, 2024 is MOCK_DATE (today)
      const todayCell = within(grid).getByText('15').closest('td');
      expect(todayCell).not.toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('calendar displays correct selected date', () => {
    it('should display calendar on selected date month', () => {
      const selectedDate = new RealDate(2024, 5, 20); // June 20, 2024
      renderWithTheme(<DatePicker onChange={() => {}} value={selectedDate} />);
      openCalendar();

      const headings = screen.getAllByRole('heading', { name: /June 2024/ });
      expect(headings.length).toBeGreaterThan(0);
    });
  });

  describe('portal mode', () => {
    it('should still select dates when using portal', () => {
      const onChange = vi.fn();
      renderWithTheme(<DatePicker onChange={onChange} value={null} usePortal />);
      openCalendar();

      const dayButton = screen.getByRole('button', { name: /January 10, 2024/ });
      fireEvent.click(dayButton);

      expect(onChange).toHaveBeenCalled();
    });
  });
});
