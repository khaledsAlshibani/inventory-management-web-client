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