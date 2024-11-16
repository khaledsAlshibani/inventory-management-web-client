import { addInventory, getInventories } from '../api/inventory.mjs';

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
    const listingContainer = document.querySelector('[data-inventory-listing]');
    try {
        const inventories = await getInventories();
        const inventoryHtml = inventories
            .map((inventory) => {
                return `
                    <div class="listing-card" role="button" data-inventory-id="${inventory.id}">
                        <div class="listing-card__section">
                            <h3 class="listing-card__title">${inventory.name}</h3>
                            <span class="listing-card__subtitle">Address: ${inventory.address || 'N/A'}</span>
                            <p class="listing-card__description">${inventory.products?.length || 0} products</p>
                            <div class="listing-card__badges">
                                ${inventory.status === 'ACTIVE'
                        ? `<span class="badge badge--success">Active</span>`
                        : `<span class="badge badge--danger">Inactive</span>`
                    }
                            </div>
                        </div>
                        <div class="listing-card__section">
                            <button class="btn btn--small btn--standard">View</button>
                        </div>
                    </div>
                `;
            })
            .join('');

        listingContainer.innerHTML = inventoryHtml;

        navigateToInventoryPage();
    } catch (error) {
        console.error('Error fetching inventories:', error);
        listingContainer.innerHTML = `<p class="error">Failed to load inventories. Please try again later.</p>`;
    }
}

function navigateToInventoryPage() {
    const cards = document.querySelectorAll('[data-inventory-id]');
    console.log('cards:', cards);
    cards.forEach((card) => {
        console.log('card:', card);
        card.addEventListener('click', (event) => {
            const inventoryId = card.getAttribute('data-inventory-id');
            console.log(`card clicked: /inventory.html?id=${inventoryId}`);
            window.location.href = `/inventory.html?id=${inventoryId}`;
        });
    });
}

import { getInventoryById } from '../api/inventory.mjs';

async function renderSingleInventory() {
    const inventoryContainer = document.querySelector('[data-single-inventory]');

    if (!inventoryContainer) {
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const inventoryId = params.get('id');
    console.log('inventoryId:', inventoryId);

    if (!inventoryId) {
        inventoryContainer.innerHTML = `<p class="error">No inventory ID provided.</p>`;
        return;
    }

    try {
        const inventory = await getInventoryById(inventoryId);
        inventoryContainer.innerHTML = `
            <div class="inventory-details">
                <h1>${inventory.name}</h1>
                <p><strong>Address:</strong> ${inventory.address || 'N/A'}</p>
                <p><strong>Status:</strong> ${inventory.status}</p>
                <p><strong>Type:</strong> ${inventory.inventoryType || 'N/A'}</p>
                <p><strong>Area:</strong> ${inventory.area || 'N/A'} m²</p>
                <p><strong>Available Area:</strong> ${inventory.availableArea || 'N/A'} m²</p>
                <p><strong>Created At:</strong> ${new Date(inventory.createdAt).toLocaleString()}</p>
                <p><strong>Updated At:</strong> ${inventory.updatedAt ? new Date(inventory.updatedAt).toLocaleString() : 'N/A'}</p>
                <h2>Products (${inventory.products?.length || 0}):</h2>
                <ul>
                    ${inventory.products?.length
                ? inventory.products
                    .map(
                        (product) => `
                                        <li>
                                            <strong>${product.name}</strong> - ${product.description || 'No description'}
                                            <br />
                                            Quantity: ${product.quantity || 0}
                                            <br />
                                            Price: ${product.price ? `$${product.price.toFixed(2)}` : 'N/A'}
                                        </li>
                                    `
                    )
                    .join('')
                : '<li>No products available</li>'}
                </ul>
            </div>
        `;
    } catch (error) {
        console.error('Error fetching inventory:', error);
        inventoryContainer.innerHTML = `<p class="error">Failed to load inventory. Please try again later.</p>`;
    }
}

handleAddInventory();
renderInventories();
renderSingleInventory();