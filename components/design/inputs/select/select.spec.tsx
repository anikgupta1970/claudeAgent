import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { ApiBankingTheme } from '@api-banking/design.api-banking-theme';
import { Select } from './select.js';

// Polyfill ResizeObserver for jsdom (required by React Aria Popover)
if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}

    unobserve() {}

    disconnect() {}
  } as any;
}

const mockOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ApiBankingTheme>{ui}</ApiBankingTheme>);
};

describe('Select', () => {
  describe('rendering', () => {
    it('should render the select with the provided placeholder', () => {
      renderWithTheme(
        <Select
          id="test-select"
          value=""
          onChange={() => {}}
          options={mockOptions}
          placeholder="Select an option"
        />
      );
      expect(screen.getByText('Select an option')).toBeInTheDocument();
    });

    it('should render with default placeholder when none provided', () => {
      renderWithTheme(
        <Select
          id="test-select"
          value=""
          onChange={() => {}}
          options={mockOptions}
        />
      );
      expect(screen.getByText('Select an option')).toBeInTheDocument();
    });

    it('should display the selected option label', () => {
      renderWithTheme(
        <Select
          id="test-select"
          value="option2"
          onChange={() => {}}
          options={mockOptions}
        />
      );
      expect(screen.getByRole('button')).toHaveTextContent('Option 2');
    });

    it('should apply custom className', () => {
      const { container } = renderWithTheme(
        <Select
          id="test-select"
          value=""
          onChange={() => {}}
          options={mockOptions}
          className="custom-class"
        />
      );
      const selectContainer = container.querySelector('.selectContainer');
      expect(selectContainer).toHaveClass('custom-class');
    });

    it('should apply custom style', () => {
      const { container } = renderWithTheme(
        <Select
          id="test-select"
          value=""
          onChange={() => {}}
          options={mockOptions}
          style={{ width: '300px' }}
        />
      );
      const selectContainer = container.querySelector('.selectContainer');
      expect(selectContainer).toHaveStyle({ width: '300px' });
    });

    it('should render hidden select with name attribute for form submission', () => {
      renderWithTheme(
        <Select
          id="test-select"
          value="option1"
          onChange={() => {}}
          options={mockOptions}
          name="my-select"
        />
      );
      const hiddenSelect = document.querySelector('select[name="my-select"]');
      expect(hiddenSelect).toBeInTheDocument();
    });
  });

  describe('dropdown interaction', () => {
    it('should open the dropdown when clicked', () => {
      renderWithTheme(
        <Select
          id="test-select"
          value=""
          onChange={() => {}}
          options={mockOptions}
        />
      );

      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);

      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('should call onChange when an option is selected', () => {
      const onChange = vi.fn();
      renderWithTheme(
        <Select
          id="test-select"
          value=""
          onChange={onChange}
          options={mockOptions}
        />
      );

      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);

      const option = screen.getByRole('option', { name: 'Option 2' });
      fireEvent.click(option);

      expect(onChange).toHaveBeenCalledWith('option2');
    });

    it('should close the dropdown after selecting an option', async () => {
      const onChange = vi.fn();
      renderWithTheme(
        <Select
          id="test-select"
          value=""
          onChange={onChange}
          options={mockOptions}
        />
      );

      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);
      expect(screen.getByRole('listbox')).toBeInTheDocument();

      const option = screen.getByRole('option', { name: 'Option 2' });
      fireEvent.click(option);

      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      });
    });
  });

  describe('disabled state', () => {
    it('should have data-disabled attribute when disabled prop is true', () => {
      const { container } = renderWithTheme(
        <Select
          id="test-select"
          value=""
          onChange={() => {}}
          options={mockOptions}
          disabled={true}
        />
      );
      const selectContainer = container.querySelector('.selectContainer');
      expect(selectContainer).toHaveAttribute('data-disabled');
    });

    it('should not open when disabled', () => {
      renderWithTheme(
        <Select
          id="test-select"
          value=""
          onChange={() => {}}
          options={mockOptions}
          disabled={true}
        />
      );

      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('should have disabled attribute on trigger when disabled', () => {
      renderWithTheme(
        <Select
          id="test-select"
          value=""
          onChange={() => {}}
          options={mockOptions}
          disabled={true}
        />
      );

      const trigger = screen.getByRole('button');
      expect(trigger).toBeDisabled();
    });
  });

  describe('error state', () => {
    it('should have data-invalid attribute when the error prop is true', () => {
      const { container } = renderWithTheme(
        <Select
          id="test-select"
          value=""
          onChange={() => {}}
          options={mockOptions}
          error={true}
        />
      );
      const selectContainer = container.querySelector('.selectContainer');
      expect(selectContainer).toHaveAttribute('data-invalid');
    });

    it('should not have data-invalid when disabled even if error is true', () => {
      const { container } = renderWithTheme(
        <Select
          id="test-select"
          value=""
          onChange={() => {}}
          options={mockOptions}
          error={true}
          disabled={true}
        />
      );
      const selectContainer = container.querySelector('.selectContainer');
      expect(selectContainer).not.toHaveAttribute('data-invalid');
    });
  });

  describe('accessibility', () => {
    it('should have aria-expanded false when closed', () => {
      renderWithTheme(
        <Select
          id="test-select"
          value=""
          onChange={() => {}}
          options={mockOptions}
        />
      );

      const trigger = screen.getByRole('button');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    it('should have aria-expanded true when open', () => {
      renderWithTheme(
        <Select
          id="test-select"
          value=""
          onChange={() => {}}
          options={mockOptions}
        />
      );

      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);

      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    it('should have aria-haspopup listbox', () => {
      renderWithTheme(
        <Select
          id="test-select"
          value=""
          onChange={() => {}}
          options={mockOptions}
        />
      );

      const trigger = screen.getByRole('button');
      expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
    });

    it('should have options with role option', () => {
      renderWithTheme(
        <Select
          id="test-select"
          value="option2"
          onChange={() => {}}
          options={mockOptions}
        />
      );

      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);

      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(3);
    });
  });

  describe('empty options', () => {
    it('should render with empty options array', () => {
      renderWithTheme(
        <Select
          id="test-select"
          value=""
          onChange={() => {}}
          options={[]}
        />
      );

      const trigger = screen.getByRole('button');
      expect(trigger).toBeInTheDocument();
    });

    it('should not open dropdown with no options', () => {
      renderWithTheme(
        <Select
          id="test-select"
          value=""
          onChange={() => {}}
          options={[]}
        />
      );

      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  describe('portal mode', () => {
    it('should still select options when using portal', () => {
      const onChange = vi.fn();
      renderWithTheme(
        <Select
          id="test-select"
          value=""
          onChange={onChange}
          options={mockOptions}
          usePortal={true}
        />
      );

      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);

      const option = screen.getByRole('option', { name: 'Option 2' });
      fireEvent.click(option);

      expect(onChange).toHaveBeenCalledWith('option2');
    });
  });
});
