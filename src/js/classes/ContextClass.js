export default class ContextClass {
  formContext;
  /** @type {FormContextUI} */
  formContextUI;
  formType;

  notificationType = {
    Info: 'INFO',
    Error: 'ERROR',
    Warning: 'WARNING',
  };

  static RequiredState(required) {
    return required === true || required == 'required' ? 'required' : 'none';
  }

  constructor(formContext) {
    this.formContext = formContext;
    this.formContextUI = this.formContext.ui;
    this.formType = this.formContextUI.getFormType();
  }

  /**
   * Return all attributes in the current context
   * @property allAttributes
   * @returns {Array<Attribute|TextAttribute|NumberAttribute|DateAttribute|OptionSetAttribute|LookupAttribute>}
   */
  get allAttributes() {
    return this.formContext.getData().getEntity().attributes.getAll();
  }

  /**
   * Return all controls on the form
   * @property allControls
   * @returns {Array<TextBoxControl|ComboBoxControl|GridControl|ButtonControl|DatePickerControl>}
   */
  get allControls() {
    return this.formContextUI.controls.getAll();
  }

  /**
   * Return the names of all attributes on the form
   * @property allAttributeNames
   * @returns {Array<string>} The name of all attributes on the form
   */
  get allAttributeNames() {
    return this.allAttributes.map((a) => a.getName());
  }

  /**
   * Return a named attribute
   * @method getAttribute
   * @param {string} name
   * @returns {Attribute|TextAttribute|NumberAttribute|DateAttribute|OptionSetAttribute|LookupAttribute|undefined}
   */
  getAttribute(name) {
    return this.formContext.getAttribute(name);
  }

  /**
   * Return a named control
   * @method getControl
   * @param {string} name
   * @returns {TextBoxControl|ComboBoxControl|GridControl|ButtonControl|DatePickerControl}
   */
  getControl(control) {
    return this.formContext.getControl(control);
  }

  /**
   * Return the named section from the named tab
   * @param {string} tabName
   * @param {string} sectionName
   * @returns {Section}
   */
  getSection(tabName, sectionName) {
    const tab = this.getTab(tabName);
    if (tab) {
      return tab.sections.get(sectionName);
    }
  }

  getSelectedLookup(controlName) {
    const selected = this.getValue(controlName);
    const control = this.getControl(controlName);
    return control?._options.filter((option) =>
      selected.includes(option.value),
    );
  }

  /**
   * Return the named tab
   * @param {string} tabName
   * @returns {Tab}
   */
  getTab(tabName) {
    return this.formContextUI.tabs.get(tabName);
  }

  /**
   * Return the value of a named attribute
   * @param {string} name
   * @returns {any}
   */
  getValue(name) {
    return this.getAttribute(name)?.getValue();
  }

  /**
   * Set the properties of the given attributes
   * @param {attributeSettings} settings
   * @param  {...string} attributes - The names of attriutes to be updated
   * @returns {void}
   */
  setAttributes(settings, ...attributes) {
    for (const attributeName of attributes) {
      const attribute = this.getAttribute(attributeName);
      if (attribute) {
        if (Object.hasOwn(settings, 'value')) {
          attribute.setValue(settings.value);
        }

        if (Object.hasOwn(settings, 'required')) {
          attribute.setRequiredLevel(
            ContextClass.RequiredState(settings.required),
          );
        }

        if (Object.hasOwn(settings, 'disabled')) {
          attribute.controls.forEach((c) => {
            c.setDisabled(settings.disabled);
          });
        }

        if (Object.hasOwn(settings, 'visible')) {
          attribute.controls.forEach((c) => {
            if (c.getParent()?.getVisible()) {
              // Only set fields visibility if the parent section is also visible
              c.setVisible(settings.visible);
            }
          });
        }
      }
    }
  }

  /**
   *
   * @param {controlSettings} settings
   * @param  {...string|Control} controls - The names of controls to be updated
   * @returns {void}
   */
  setControls(settings, ...controls) {
    controls.forEach((ctrl) => {
      const control = typeof ctrl == 'string' ? this.getControl(ctrl) : ctrl;
      if (control) {
        if (Object.hasOwn(settings, 'disabled') && control.getDisabled) {
          control.setDisabled(settings.disabled);
        }
        if (Object.hasOwn(settings, 'visible')) {
          control.setVisible(settings.visible);
        }
        if (Object.hasOwn(settings, 'label')) {
          control.setLabel(settings.label);
        }
      }
    });
  }

  /**
   * Update the label for the named control
   * @param {string} control - The name of teh control to be updated
   * @param {string} label - New label
   * @returns {void}
   */
  setLabel(control, label) {
    this.getControl(control)?.setLabel(label);
  }

  /**
   * Apply provided settings to named sections in the given tab
   * @param {sectionSettings} settings
   * @param {string} tabName
   * @param {...string} sectionNames
   * @returns {void}
   */
  setSections(settings, tabName, ...sectionNames) {
    sectionNames.forEach((sectionName) => {
      const section = this.getSection(tabName, sectionName);
      if (section) {
        if (Object.hasOwn(settings, 'visible')) {
          section.setVisible(settings.visible);
        }
        if (Object.hasOwn(settings, 'label')) {
          section.setLabel(settings.label);
        }
      }
    });
  }

  /**
   * Apply provided settings to named tabs
   * @param {tabSettings} settings
   * @param {...string} tabNames
   * @returns {void}
   */
  setTabs(settings, ...tabs) {
    tabs.forEach((tab) => {
      tab = typeof tab == 'string' ? this.getTab(tab) : tab;
      if (tab) {
        if (Object.hasOwn(settings, 'disabled') && tab.getDisabled) {
          tab.setDisabled(settings.disabled);
        }
        if (Object.hasOwn(settings, 'visible')) {
          tab.setVisible(settings.visible);
        }
        if (Object.hasOwn(settings, 'label')) {
          tab.setLabel(settings.label);
        }
      }
    });
  }

  /**
   * Set the value of a given attribute
   * @param {string} name
   * @param {*} value
   * @returns {Attribute} The named attribute
   */
  setValue(name, value) {
    this.getAttribute(name)?.setValue(value);

    return this.getAttribute(name);
  }

  /**
   * Display the provided controls
   * @param  {...string|Control} controls
   * @returns {void}
   */
  showControls(...controls) {
    this.setControls({ visible: true }, ...controls);
  }

  /**
   * Hide the provided controls
   * @param  {...string|Control} controls
   * @returns {void}
   */
  hideControls(...controls) {
    this.setControls({ visible: false }, ...controls);
  }

  /**
     * Apply an onchange event to the named attributes
     * @param {function name(params) {
     *
     }} callback 
     * @param  {...any} attributes 
     */
  addOnChange(callback, ...attributes) {
    attributes.forEach((attribute) =>
      this.getAttribute(attribute)?.addOnChange(callback),
    );
  }

  /**
     * Apply an onsave event to form
     * @param {function name() {
     *
     }} callback 
     */
  addOnSave(callback) {
    this.formContext.data.entity.addOnSave(callback);
  }

  /**
     * Apply an onpostsave event to form
     * @param {function name() {
     *
     }} callback 
     */
  addOnPostSave(callback) {
    this.formContext.data.entity.addOnPostSave(callback);
  }

  /**
     * Apply a presearch function to the named attributes
     * @param {function name() {
     *
     }} callback 
     * @param {...string} attributes      
     */
  addPreSearch(callback, ...attributes) {
    attributes.forEach((attribute) =>
      this.getControl(attribute)?.addPreSearch(callback),
    );
  }

  /**
   * Is the formType == 1
   * @returns {boolean}
   */
  isCreateEvent() {
    return this.formType === 1;
  }

  /**
   * Display a form notification with an optional time-limit on display time
   * @param {string} message - Text of notification
   * @param {notificationType} notificationType
   * @param {string} messageName - Unique id of the notification
   * @param {int} timeToDisplay - Number of milliseconds until notification is removed
   */
  setFormNotification(
    message,
    notificationType,
    messageName,
    timeToDisplay = 0,
  ) {
    this.formContextUI.setFormNotification(
      message,
      notificationType,
      messageName,
    );

    if (timeToDisplay > 0) {
      setTimeout(this.clearNotification.bind(this, messageName), timeToDisplay);
    }
  }

  /**
   * Remove the named message
   * @param {string } messageName - Unique id of message
   */
  clearNotification(messageName) {
    this.formContextUI.clearFormNotification(messageName);
  }

  /**
   * Find fields referred, via "this.getValue()", in a given string.
   * @param {string} text - The text to query
   * @returns {[string]}
   */
  getFields(text) {
    const pattern = /this\.getValue\(['"]([^'""]*)['"]\)/g;
    const values = [];
    let match;
    while ((match = pattern.exec(text)) !== null) {
      values.push(match[1]);
    }
    return values;
  }

  /**
   * Apply an onchange listener to any fields referenced in "watched" properties with 'visible' or 'required' rules specified
   * @param {function} method
   */
  setWatches(method) {
    const propNames = Object.keys(this);
    const watches = new Map();
    propNames.forEach((propName) => {
      if (typeof this[propName] !== 'object') return;
      if (typeof this[propName][method] !== 'function') return;
      const componentFields = this.getFields(this[propName][method]);
      componentFields.forEach((field) => {
        watches.has(field)
          ? watches.get(field).push(propName)
          : watches.set(field, [propName]);
      });
    });

    watches.forEach((targets, component) => {
      switch (method) {
        case 'visible':
          this.addOnChange(
            function () {
              this.setVisible(targets, false);
              this.setRequired(targets, false);
            }.bind(this),
            component,
          );
          break;
        case 'required':
          this.addOnChange(
            function () {
              this.setRequired(targets, false);
            }.bind(this),
            component,
          );
          break;
        default:
      }
    });
  }

  /**
   * Determine if fields are mandatory, based upon applying a 'required' method from inheriting classes.
   * @method setRequired
   * @param {string[]} targets An array specifying the fields to be evaluated, if null, the function will scan for and test any fields defined by the model
   * @param {boolean} watch If true, an onchange is registered against fields referenced in the 'required' methods ('name' the the example below), to recall this method
   * @return {void}
   * The 'required' method must be in a class property named to match the field whose manadatory status is being determined e.g.:
   * @example
   * Class Account extends FormClass
   * {
   *    description = {
   *        required: () => this.getValue('name') !== null
   *    }
   * }
   */
  setRequired(targets, watch = true) {
    if (!targets) {
      targets = Object.getOwnPropertyNames(this);
    }

    targets
      .filter(
        (propName) =>
          Object.hasOwn(this[propName], 'required') ||
          Object.hasOwn(this[propName], 'visibleResult'),
      )
      .forEach((propName) => {
        let isRequired = false;
        if (
          this[propName].visibleResult !== false &&
          Object.hasOwn(this[propName], 'required')
        ) {
          isRequired = this[propName].required();
        }
        this.setAttributes({ required: isRequired }, propName);
      });

    if (watch) {
      this.setWatches('required');
    }
  }

  /**
   * Determine if fields are visible, based upon applying a 'visible' method from inheriting classes.
   * @method setVisible
   * @param {string[]} targets An array specifying the fields to be evaluated, if null, the function will scan for and test any fields defined by the model
   * @param {} watch=true If true, an onchange is registered against fields referenced in the 'visible' methods ('name' the the example below), to recall this method
   * @return {void}
   * The 'visible' method must be in a class property named to match the field whose visibility is being determined e.g.:
   * @example
   * Class Account extends FormClass
   * {
   *    description = {
   *        tabName: '<Name of tab>' // Used if this property is a section rather than a control/attribute
   *        clearOnHide: true  // Clear the field when hidden by the visisble function
   *        visible: () => this.getValue('name') !== null
   *    }
   * }
   */
  setVisible(targets, watch = true) {
    if (!targets) {
      targets = Object.getOwnPropertyNames(this).filter(
        (propName) =>
          typeof this[propName] != 'undefined' &&
          Object.hasOwn(this[propName], 'visible'),
      );
    }

    targets.forEach((propName) => {
      const visible = !!this[propName].visible();
      if (this[propName].tabName) {
        this.setSections(
          { visible: visible },
          this[propName].tabName,
          propName,
        );
      } else {
        this[propName].visibleResult = visible;
        this._clearOnHide(propName);
        this.setAttributes({ visible: visible }, propName);
      }
    });
    if (watch) {
      this.setWatches('visible');
    }
  }

  /**
   * Clear the value of a hidden field, when configured to be cleared on hide
   * @param {string} targetName - Name of field to be cleared
   * @returns {void}
   */
  _clearOnHide(targetName) {
    if (
      this[targetName].visibleResult !== false ||
      this[targetName].clearOnHide !== true ||
      this.getValue(targetName) == null
    ) {
      return;
    }
    this.setValue(targetName, null);
    this.getAttribute(targetName)?.fireOnChange();
  }
}
