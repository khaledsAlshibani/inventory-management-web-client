import { addInventory, deleteInventory, getInventoryById, updateInventory } from '../api/inventory.mjs';
import { getUserInventories } from '../api/user.mjs';
import { redirectToInventories } from '../utils/redirect.mjs'
import { Button } from '../utils/ui.mjs';

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

        const inventoryTypeElement = document.querySelector('[data-inventory-type]');
        if (inventoryTypeElement) {
            const inventoryTypeValue = inventoryTypeElement.getAttribute('data-selected-value');
            if (inventoryTypeValue) {
                inventoryData.inventoryType = inventoryTypeValue;
            }
        }

        const statusElement = document.querySelector('[data-inventory-status]');
        if (statusElement) {
            const statusValue = statusElement.getAttribute('data-selected-value');
            if (statusValue) {
                inventoryData.status = statusValue;
            }
        }

        if (inventoryData.area) inventoryData.area = parseFloat(inventoryData.area);
        if (inventoryData.availableArea) inventoryData.availableArea = parseFloat(inventoryData.availableArea);

        console.log("inventoryData", inventoryData);

        const inventoriesElement = document.querySelector("[data-inventories]");
        if (inventoriesElement) {
            fetch(window.location.href)
                .then(response => response.text())
                .then(html => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, "text/html");
                    const newContent = doc.querySelector("[data-inventories]");
                    if (newContent) {
                        inventoriesElement.innerHTML = newContent.innerHTML;
                    }
                })
                .catch(error => {
                    console.error("Error loading inventories:", error);
                });
        }
    });
}

async function renderInventories() {
    const listingContainer = document.querySelector('[data-inventories]');
    try {
        const inventories = await getUserInventories();

        if (!inventories || inventories.length === 0) {
            listingContainer.innerHTML = `<p class="error">No inventories found for this user.</p>`;
            return;
        }

        // Clear container to append elements dynamically
        listingContainer.innerHTML = '';

        inventories.forEach((inventory) => {
            const listingCard = document.createElement('div');
            listingCard.className = 'listing-card';
            listingCard.setAttribute('role', 'button');
            listingCard.setAttribute('data-inventory-id', inventory.id);

            // First Section
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

            // Second Section
            const secondSection = document.createElement('div');
            secondSection.className = 'listing-card__section';

            // Create and append the button
            const viewButton = Button({
                label: "View",
                type: "button",
                variant: "standard",
                size: "small",
                iconStart: "edit-3",
            });
            secondSection.appendChild(viewButton);

            // Append sections to the listing card
            listingCard.appendChild(firstSection);
            listingCard.appendChild(secondSection);

            // Append the listing card to the container
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
        renderInventoryForm(inventoryContainer, inventoryId, inventory);
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

function renderInventoryForm(container, inventoryId, inventory) {
    container.innerHTML = `
        <form class="inventory-form" data-inventory-id="${inventoryId}">
            <div class="inventory-details">
                <label>
                    <strong>Name:</strong>
                    <input type="text" name="name" value="${inventory.name || ''}" />
                </label>
                <label>
                    <strong>Address:</strong>
                    <textarea name="address">${inventory.address || ''}</textarea>
                </label>
                <label>
                    <strong>Status:</strong>
                    <select name="status">
                        <option value="ACTIVE" ${inventory.status === 'ACTIVE' ? 'selected' : ''}>Active</option>
                        <option value="INACTIVE" ${inventory.status === 'INACTIVE' ? 'selected' : ''}>Inactive</option>
                    </select>
                </label>
                <label>
                    <strong>Type:</strong>
                    <select name="inventoryType">
                        <option value="WAREHOUSE" ${inventory.inventoryType === 'WAREHOUSE' ? 'selected' : ''}>Warehouse</option>
                        <option value="STORE" ${inventory.inventoryType === 'STORE' ? 'selected' : ''}>Store</option>
                        <option value="ONLINE" ${inventory.inventoryType === 'ONLINE' ? 'selected' : ''}>Online</option>
                    </select>
                </label>
                <label>
                    <strong>Area:</strong>
                    <input type="number" step="0.01" name="area" value="${inventory.area || 0}" />
                </label>
                <label>
                    <strong>Available Area:</strong>
                    <input type="number" step="0.01" name="availableArea" value="${inventory.availableArea || 0}" />
                </label>
                <p><strong>Created At:</strong> ${new Date(inventory.createdAt).toLocaleString()}</p>
                <p><strong>Updated At:</strong> ${inventory.updatedAt ? new Date(inventory.updatedAt).toLocaleString() : 'N/A'}</p>
            </div>
            <div class="inventory-actions">
                ${Button("Update", "submit")}
                ${Button("Delete", "button", "delete")}
            </div>
        </form>
    `;
}

function attachFormHandlers(container, inventoryId) {
    const form = container.querySelector('.inventory-form');
    if (!form) {
        return;
    }

    // Handle the Update button click
    form.querySelector('.btn--update').addEventListener('click', async () => {
        await handleUpdateInventory(form, inventoryId);
    });

    // Handle the Delete button click
    form.querySelector('.btn--delete').addEventListener('click', async () => {
        await handleDeleteInventory(inventoryId);
    });
}

async function handleUpdateInventory(form, inventoryId) {
    const formData = new FormData(form);
    const updatedData = {};

    formData.forEach((value, key) => {
        updatedData[key] = value;
    });

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

document.addEventListener('DOMContentLoaded', () => {
    renderInventories();
    handleAddInventory();
    renderSingleInventory();
});