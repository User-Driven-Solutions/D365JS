import ContextClass from './ContextClass.js';

export default class FormClass extends ContextClass {
  constructor(context) {
    let pageType = 'ribbon';

    if (!context) {
      throw new Error('Attempt to instantiate FormClass without context');
    }

    if (typeof context.getFormContext === 'function') {
      pageType = context?.getContext()?.getQueryStringParameters()?.pageType;
      context = context.getFormContext();
    }

    super(context);
    this.pageType = pageType;
    this.originalOptions = new Map();
    this.addTabStateChange();
  }

  addTabStateChange() {
    if (this.pageType === 'quickcreate') {
      // Cannot addTabStateChange for a quick create form - gets a error - Exception in customer logic: Cannot read properties of undefined (reading 'bind')
      return;
    }

    this.formContext.ui.tabs.forEach((tab) =>
      tab
        .addTabStateChange((executionContext) => {
          const formContext = executionContext.getFormContext();
          if (
            formContext.ui.tabs
              .get(executionContext._eventSource._controlName)
              .getDisplayState() === 'expanded'
          ) {
            this.formContext = formContext;
            this.formContextUI = formContext.ui;
          }
        })
        .bind(this),
    );
  }

  /**
   * Filters the options of a specified control based on a filter function.
   *
   * @param {string} controlName - The name of the control to update.
   * @param {function} filter - A filter function taking two parameters (value & text of optionset) that determines which options to keep.
   */
  filterOptions(controlName, filter) {
    const control = this.getControl(controlName);

    if (!control) {
      console.error(`Control ${controlName} not found.`);
      return;
    }

    // Store original options if not already stored
    if (!this.originalOptions.has(controlName)) {
      const options = control.getOptions();
      const optionsMap = new Map();
      options.forEach((option) => {
        optionsMap.set(option.value, option.text);
      });
      this.originalOptions.set(controlName, optionsMap);
    }

    // Get the current value of the control
    const currentValue = control.getAttribute().getValue();

    // Remove all options
    control.clearOptions();

    // Apply the filter function to the original options
    const filteredOptions = Array.from(
      this.originalOptions.get(controlName),
    ).filter(([value, text]) => filter(value, text));

    // Add filtered options back to the control
    filteredOptions.forEach(([value, text]) => {
      control.addOption({ value: value, text: text });
    });

    // Set the control's value to the current value if it exists in the filtered options, otherwise set to null
    if (
      filteredOptions.some(([value, textIgnored]) => value === currentValue)
    ) {
      control.getAttribute().setValue(currentValue);
    } else {
      control.getAttribute().setValue(null);
    }
  }
}
