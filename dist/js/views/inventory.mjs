import { addInventory } from '../api/inventory.mjs';

document.querySelector('[data-add-inventory]').addEventListener('submit', async function (event) {
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