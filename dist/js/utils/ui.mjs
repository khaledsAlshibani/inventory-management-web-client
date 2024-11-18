export const Button = ({ label, type = "button", variant = "primary", size, iconStart, iconEnd, dataAttributes }) => {
    const button = document.createElement("button");
    button.setAttribute("type", type);
    button.className = `button button--${variant} ${size ? "button--" + size : ""}`;

    if (iconStart !== undefined && iconStart !== null) {
        const iconStartEl = document.createElement("i");
        iconStartEl.className = `button__icon icon-${iconStart}`;
        button.appendChild(iconStartEl);
    }

    const labelEl = document.createElement("span");
    labelEl.className = "button__label";
    labelEl.textContent = label;
    button.appendChild(labelEl);

    if (iconEnd !== undefined && iconEnd !== null) {
        const iconEndEl = document.createElement("i");
        iconEndEl.className = `button__icon icon-${iconEnd}`;
        button.appendChild(iconEndEl);
    }

    // dataAttributes will be like {"data-foo": "bar"}
    if (dataAttributes) {
        Object.entries(dataAttributes).forEach(([key, value]) => button.setAttribute(key, value));
    }

    return button;
};

export const Input = ({
    label,
    id,
    name,
    type = "text",
    required = false,
    value = "",
    placeholder = " ",
    className = "",
}) => {
    const wrapper = document.createElement("div");
    wrapper.className = "input__wrapper";

    const input = document.createElement("input");
    input.setAttribute("id", id);
    input.setAttribute("name", name);
    input.setAttribute("type", type);
    input.setAttribute("value", value);
    input.setAttribute("placeholder", placeholder);
    input.className = `input ${className}`;
    if (required) {
        input.setAttribute("required", "required");
    }

    const labelEl = document.createElement("label");
    labelEl.setAttribute("for", id);
    labelEl.className = "input__label";
    labelEl.textContent = label;

    wrapper.appendChild(input);
    wrapper.appendChild(labelEl);

    return wrapper;
};

export const Textarea = ({
    label,
    id,
    name,
    required = false,
    value = "",
    placeholder = " ",
    className = "",
}) => {
    const wrapper = document.createElement("div");
    wrapper.className = "textarea__wrapper";

    const textarea = document.createElement("textarea");
    textarea.setAttribute("id", id);
    textarea.setAttribute("name", name);
    textarea.setAttribute("placeholder", placeholder);
    textarea.className = `textarea ${className}`;
    textarea.textContent = value;
    if (required) {
        textarea.setAttribute("required", "required");
    }

    const labelEl = document.createElement("label");
    labelEl.setAttribute("for", id);
    labelEl.className = "textarea__label";
    labelEl.textContent = label;

    wrapper.appendChild(textarea);
    wrapper.appendChild(labelEl);

    return wrapper;
};

export const Select = ({
    label,
    togglerId,
    selectId,
    className = "",
    defaultValue = "",
    dataAttributes = {},
    options = [],
}) => {
    const wrapper = document.createElement("div");
    wrapper.className = "select";
    wrapper.setAttribute("data-select", "");

    const labelEl = document.createElement("span");
    labelEl.className = "select__label";
    labelEl.textContent = label;
    wrapper.appendChild(labelEl);

    const toggler = document.createElement("button");
    toggler.setAttribute("type", "button");
    toggler.setAttribute("id", togglerId);
    toggler.className = `select__toggler button ${className}`;
    toggler.setAttribute("aria-haspopup", "listbox");
    toggler.setAttribute("aria-expanded", "false");
    toggler.setAttribute("aria-controls", selectId);
    toggler.setAttribute("data-select-toggler", "");
    toggler.setAttribute("data-selected-value", "");
    toggler.textContent = defaultValue;

    if (dataAttributes) {
        Object.entries(dataAttributes).forEach(([key, value]) =>
            toggler.setAttribute(key, value)
        );
    }

    const togglerIcon = document.createElement("i");
    togglerIcon.className = "select__toggler-icon icon-keyboard_arrow_down";
    toggler.appendChild(togglerIcon);

    wrapper.appendChild(toggler);

    const dropdown = document.createElement("ul");
    dropdown.className = "select__dropdown";
    dropdown.setAttribute("id", selectId);
    dropdown.setAttribute("role", "listbox");
    dropdown.setAttribute("aria-labelledby", togglerId);
    dropdown.setAttribute("data-select-dropdown", "");

    options.forEach((option) => {
        const optionEl = document.createElement("li");
        optionEl.className = "select__option";
        optionEl.setAttribute("role", "option");
        optionEl.setAttribute("tabindex", "0");
        optionEl.setAttribute("aria-selected", option.isSelected ? "true" : "false");
        optionEl.setAttribute("data-value", option.value);
        optionEl.setAttribute("data-select-option", "");
        optionEl.textContent = option.label;

        dropdown.appendChild(optionEl);
    });

    wrapper.appendChild(dropdown);

    return wrapper;
};
