import { addInventory, deleteInventory, getInventoryById, updateInventory } from '../api/inventory.mjs';
import { getUserInventories } from '../api/user.mjs';
import { redirectToInventories } from '../utils/redirect.mjs'
import { capitalize } from '../utils/typography.mjs';
import { Button, Input, Select, Textarea } from '../utils/ui.mjs';
import { fetchInventoryStatistics } from '../api/statistics.mjs';

function handleAddInventory() {
    const form = document.querySelector('[data-add-inventory]');

    if (!form) return;

    form.addEventListener('submit', async function (event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const inventoryData = {};

        formData.forEach((value, key) => {
            inventoryData[key] = value;
        });

        const typeSelect = form.querySelector('[data-inventory-type][data-selected-value]');
        const statusSelect = form.querySelector('[data-inventory-status][data-selected-value]');

        if (typeSelect) {
            inventoryData.inventoryType = typeSelect.getAttribute('data-selected-value');
        }

        if (statusSelect) {
            inventoryData.status = statusSelect.getAttribute('data-selected-value');
        }

        if (inventoryData.area) inventoryData.area = parseFloat(inventoryData.area);
        if (inventoryData.availableArea) inventoryData.availableArea = parseFloat(inventoryData.availableArea);

        try {
            const responseData = await addInventory(inventoryData);
            console.log('Inventory data:', responseData);
        } catch (error) {
            console.error('Error details:', error);
        }
    });
}

async function renderInventories() {
    const listingContainer = document.querySelector('[data-inventories]');

    if (!listingContainer) return;

    try {
        const inventories = await getUserInventories();

        if (!inventories || inventories.length === 0) {
            listingContainer.innerHTML = `<p class="error">No inventories found for this user.</p>`;
            return;
        }

        listingContainer.innerHTML = '';

        inventories.forEach((inventory) => {
            const listingCard = document.createElement('div');
            listingCard.className = 'listing-card';
            listingCard.setAttribute('role', 'button');
            listingCard.setAttribute('data-inventory-id', inventory.id);

            const firstSection = document.createElement('div');
            firstSection.className = 'listing-card__section';
            firstSection.innerHTML = `
                <h3 class="listing-card__title">${inventory.name}</h3>
                <span class="listing-card__subtitle">Address: ${inventory.address || 'N/A'}</span>
                <p class="listing-card__description">${inventory.products?.length || 0} products</p>
                <div class="listing-card__badges">
                    ${inventory.status === 'ACTIVE'
                    ? `<span class="badge badge--success">Active</span>`
                    : `<span class="badge badge--danger">Inactive</span>`}
                </div>
            `;

            const secondSection = document.createElement('div');
            secondSection.className = 'listing-card__section';
            const viewButton = Button({
                label: "View",
                type: "button",
                variant: "standard",
                size: "small",
                iconStart: "edit-3",
            });

            secondSection.appendChild(viewButton);
            listingCard.appendChild(firstSection);
            listingCard.appendChild(secondSection);
            listingContainer.appendChild(listingCard);
        });

        navigateToInventoryPage();
    } catch (error) {
        console.error('Error fetching inventories:', error);
        listingContainer.innerHTML = `<p class="error">Failed to load inventories. Please try again later.</p>`;
    }
}

function navigateToInventoryPage() {
    const cards = document.querySelectorAll('[data-inventory-id]');
    cards.forEach((card) => {
        card.addEventListener('click', (event) => {
            const inventoryId = card.getAttribute('data-inventory-id');
            window.location.href = `/inventory.html?id=${inventoryId}`;
        });
    });
}

async function renderSingleInventory() {
    const inventoryContainer = document.querySelector('[data-single-inventory]');

    if (!inventoryContainer) {
        return;
    }

    const inventoryId = getInventoryIdFromUrl();
    if (!inventoryId) {
        inventoryContainer.innerHTML = `<p class="error">No inventory ID provided.</p>`;
        return;
    }

    try {
        const inventory = await getInventoryById(inventoryId);
        renderInventoryForm(inventoryId, inventory);
        attachFormHandlers(inventoryContainer, inventoryId);
    } catch (error) {
        console.error('Error fetching inventory:', error);
        inventoryContainer.innerHTML = `<p class="error">Failed to load inventory. Please try again later.</p>`;
    }
}

function getInventoryIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const inventoryId = params.get('id');
    console.log('inventoryId:', inventoryId);
    return inventoryId;
}

function renderInventoryFormFields(inventoryId, inventory) {
    const fields = Object.entries(inventory)
        .filter(([key]) => key !== "id" && key !== "createdAt" && key !== "updatedAt" && key !== "message")
        .map(([key, value]) => {
            const typeMap = {
                name: "text",
                address: "text",
                description: "textarea",
                status: "select",
                inventoryType: "select",
                area: "number",
                availableArea: "number",
            };

            const label = capitalize(key);
            const type = typeMap[key];

            if (type === "textarea") {
                return Textarea({
                    label,
                    id: `inventory-${key}-${inventoryId}`,
                    name: key,
                    value: value || "",
                    className: "form-control",
                });
            } else if (type === "select") {
                const options =
                    key === "status"
                        ? [
                            { label: "Active", value: "ACTIVE", isSelected: value === "ACTIVE" },
                            { label: "Inactive", value: "INACTIVE", isSelected: value === "INACTIVE" },
                        ]
                        : [
                            { label: "Warehouse", value: "WAREHOUSE", isSelected: value === "WAREHOUSE" },
                            { label: "Store", value: "STORE", isSelected: value === "STORE" },
                            { label: "Online", value: "ONLINE", isSelected: value === "ONLINE" },
                        ];

                const selectedOption = options.find((option) => option.isSelected);
                const defaultValue = selectedOption ? selectedOption.label : `Select ${key}`;

                const dataAttributes = {};
                if (key.startsWith("inventory")) {
                    key = key.replace("inventory", "");
                    dataAttributes[`data-inventory-type`] = "";
                } else {
                    dataAttributes[`data-inventory-${key}`] = "";
                }
                return Select({
                    label,
                    togglerId: `inventory-${key}-toggler-${inventoryId}`,
                    selectId: `inventory-${key}-${inventoryId}`,
                    className: "form-control",
                    defaultValue,
                    options,
                    dataAttributes,
                });
            } else {
                return Input({
                    label,
                    id: `inventory-${key}-${inventoryId}`,
                    name: key,
                    type: type || "text",
                    value: value || "",
                    className: "form-control",
                });
            }
        });

    return fields;
}

function renderInventoryForm(inventoryId, inventory) {
    const formFields = renderInventoryFormFields(inventoryId, inventory);

    const inputsContainer = document.querySelector('[data-inventory-inputs]');
    const form = inputsContainer.closest('form');
    form.setAttribute("data-inventory-id", inventoryId);

    formFields.forEach((field) => {
        inputsContainer.appendChild(field);
    });

    const createdAtParagraph = document.createElement("p");
    createdAtParagraph.innerHTML = `<strong>Created At:</strong> ${new Date(inventory.createdAt).toLocaleString()}`;
    inputsContainer.appendChild(createdAtParagraph);

    const updatedAtParagraph = document.createElement("p");
    updatedAtParagraph.innerHTML = `<strong>Last Updated At:</strong> ${inventory.updatedAt ? new Date(inventory.updatedAt).toLocaleString() : "N/A"
        }`;
    inputsContainer.appendChild(updatedAtParagraph);

    const buttonsContainer = document.createElement("div");
    buttonsContainer.className = "page-form__buttons";

    const updateButtonEl = Button({
        label: "Update",
        type: "submit",
        variant: "primary",
        iconStart: "user-check",
        iconEnd: false,
        dataAttributes: { "data-update-profile": "" },
    });
    const deleteButtonEl = Button({
        label: "Delete",
        type: "button",
        variant: "delete",
        iconStart: "trash-2",
        iconEnd: false,
        dataAttributes: { "data-delete-profile": "" },
    });

    buttonsContainer.appendChild(updateButtonEl);
    buttonsContainer.appendChild(deleteButtonEl);

    inputsContainer.appendChild(buttonsContainer);
}

function attachFormHandlers(container, inventoryId) {
    const form = container.querySelector('.page-form'); // Use the form container
    if (!form) return;

    const updateButton = form.querySelector("[data-update-profile]");
    const deleteButton = form.querySelector("[data-delete-profile]");

    if (!updateButton || !deleteButton) return;

    updateButton.addEventListener('click', async (event) => {
        event.preventDefault();
        await handleUpdateInventory(form, inventoryId);
    });

    deleteButton.addEventListener('click', async () => {
        event.preventDefault();
        await handleDeleteInventory(inventoryId);
    });
}

async function handleUpdateInventory(form, inventoryId) {
    const formData = new FormData(form);
    const updatedData = {};

    formData.forEach((value, key) => {
        updatedData[key] = value;
    });

    const typeSelect = form.querySelector('[data-inventory-type][data-selected-value]');
    const statusSelect = form.querySelector('[data-inventory-status][data-selected-value]');

    if (typeSelect) {
        updatedData.inventoryType = typeSelect.getAttribute('data-selected-value');
    }

    if (statusSelect) {
        updatedData.status = statusSelect.getAttribute('data-selected-value');
    }

    try {
        const response = await updateInventory(inventoryId, updatedData);
        console.log('Inventory updated:', response);
        alert('Inventory updated successfully!');
    } catch (error) {
        console.error('Error updating inventory:', error);
        alert('Failed to update inventory.');
    }
}

async function handleDeleteInventory(inventoryId) {
    if (confirm('Are you sure you want to delete this inventory?')) {
        try {
            await deleteInventory(inventoryId);
            alert('Inventory deleted successfully!');
            redirectToInventories();
        } catch (error) {
            console.error('Error deleting inventory:', error);

            if (error.message.includes('404')) {
                alert('Inventory might have already been deleted.');
                redirectToInventories();
            } else {
                alert('Failed to delete inventory.');
            }
        }
    }
}

async function updateInventorySidebarStats() {
    const sidebarItems = [
        { heading: "Total Inventory Locations", attribute: "data-total-inventories", statKey: "totalInventories" },
        { heading: "Fully Stocked Inventories", attribute: "data-fully-stocked-inventories", statKey: "fullyStockedInventories" },
        { heading: "Active Inventory Locations", attribute: "data-active-inventories", statKey: "statusCounts.ACTIVE" },
        { heading: "Inactive Inventory Locations", attribute: "data-inactive-inventories", statKey: "statusCounts.INACTIVE" },
        { heading: "Empty Inventory Locations", attribute: "data-empty-inventories", statKey: "emptyInventories" },
        { heading: "Inventories with Low Stock", attribute: "data-low-stock-inventories", statKey: "inventoriesWithLowStock" },
        { heading: "Average Products per Inventory", attribute: "data-avg-products-per-inventory", statKey: "averageProductsPerInventory" },
        { heading: "Total Inventory Area (km²)", attribute: "data-total-inventory-area", statKey: "totalArea" },
        { heading: "Inventories with Expired Products", attribute: "data-inventories-with-expired-products", statKey: "inventoriesWithExpiredProducts" },
    ];

    try {
        const stats = await fetchInventoryStatistics();
        console.log('Fetched statistics:', stats);

        sidebarItems.forEach(item => {
            const element = document.querySelector(`[${item.attribute}]`);
            if (element) {
                const valueElement = element.querySelector('[data-statistic-value]');
                if (valueElement) {
                    const statValue = item.statKey.includes(".")
                        ? item.statKey.split(".").reduce((obj, key) => obj?.[key], stats)
                        : stats[item.statKey];
                    valueElement.textContent = statValue ?? 0;
                }
            }
        });
    } catch (error) {
        console.error('Error updating inventory sidebar stats:', error);
        handleSidebarStatsError();
    }
}

function handleSidebarStatsError() {
    const sidebar = document.querySelector('[data-sidebar-stats]');
    if (sidebar) {
        sidebar.innerHTML = '<p class="error">Failed to load statistics. Please try again later.</p>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderInventories();
    handleAddInventory();
    renderSingleInventory();
    updateInventorySidebarStats();
});