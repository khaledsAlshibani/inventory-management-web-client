import { addProduct, deleteProduct, getProductById, updateProduct } from '../api/product.mjs';
import { getUserProducts } from '../api/user.mjs';
import { redirectToProducts } from '../utils/redirect.mjs'
import { capitalize } from '../utils/typography.mjs';
import { Button, Input, Select, Textarea } from '../utils/ui.mjs';
import { fetchProductStatistics } from '../api/statistics.mjs';

function handleAddProduct() {
    const form = document.querySelector('[data-add-product]');

    if (!form) return;

    form.addEventListener('submit', async function (event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const productData = {};

        formData.forEach((value, key) => {
            productData[key] = value;
        });

        const typeSelect = form.querySelector('[data-product-type][data-selected-value]');
        const statusSelect = form.querySelector('[data-product-status][data-selected-value]');

        if (typeSelect) {
            productData.productType = typeSelect.getAttribute('data-selected-value');
        }

        if (statusSelect) {
            productData.status = statusSelect.getAttribute('data-selected-value');
        }

        if (productData.area) productData.area = parseFloat(productData.area);
        if (productData.availableArea) productData.availableArea = parseFloat(productData.availableArea);

        try {
            const responseData = await addProduct(productData);
            console.log('Product data:', responseData);
        } catch (error) {
            console.error('Error details:', error);
        }
    });
}

async function renderProducts() {
    const listingContainer = document.querySelector('[data-products]');

    if (!listingContainer) return;

    try {
        const products = await getUserProducts();

        if (!products || products.length === 0) {
            listingContainer.innerHTML = `<p class="error">No products found for this user.</p>`;
            return;
        }

        listingContainer.innerHTML = '';

        products.forEach((product) => {
            const listingCard = document.createElement('div');
            listingCard.className = 'listing-card';
            listingCard.setAttribute('role', 'button');
            listingCard.setAttribute('data-product-id', product.id);

            const firstSection = document.createElement('div');
            firstSection.className = 'listing-card__section';
            firstSection.innerHTML = `
                <h3 class="listing-card__title">${product.name}</h3>
                <span class="listing-card__subtitle">Address: ${product.address || 'N/A'}</span>
                <p class="listing-card__description">${product.products?.length || 0} products</p>
                <div class="listing-card__badges">
                    ${product.status === 'ACTIVE'
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

        navigateToProductPage();
    } catch (error) {
        console.error('Error fetching products:', error);
        listingContainer.innerHTML = `<p class="error">Failed to load products. Please try again later.</p>`;
    }
}

function navigateToProductPage() {
    const cards = document.querySelectorAll('[data-product-id]');
    cards.forEach((card) => {
        card.addEventListener('click', (event) => {
            const productId = card.getAttribute('data-product-id');
            window.location.href = `/product.html?id=${productId}`;
        });
    });
}

async function renderSingleProduct() {
    const productContainer = document.querySelector('[data-single-product]');

    if (!productContainer) {
        return;
    }

    const productId = getProductIdFromUrl();
    if (!productId) {
        productContainer.innerHTML = `<p class="error">No product ID provided.</p>`;
        return;
    }

    try {
        const product = await getProductById(productId);
        renderProductForm(productId, product);
        attachFormHandlers(productContainer, productId);
    } catch (error) {
        console.error('Error fetching product:', error);
        productContainer.innerHTML = `<p class="error">Failed to load product. Please try again later.</p>`;
    }
}

function getProductIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    console.log('productId:', productId);
    return productId;
}

function renderProductFormFields(productId, product) {
    const fields = Object.entries(product)
        .filter(([key]) => key !== "id" && key !== "createdAt" && key !== "updatedAt" && key !== "message")
        .map(([key, value]) => {
            const typeMap = {
                name: "text",
                address: "text",
                description: "textarea",
                status: "select",
                productType: "select",
                area: "number",
                availableArea: "number",
            };

            const label = capitalize(key);
            const type = typeMap[key];

            if (type === "textarea") {
                return Textarea({
                    label,
                    id: `product-${key}-${productId}`,
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
                if (key.startsWith("product")) {
                    key = key.replace("product", "");
                    dataAttributes[`data-product-type`] = "";
                } else {
                    dataAttributes[`data-product-${key}`] = "";
                }
                return Select({
                    label,
                    togglerId: `product-${key}-toggler-${productId}`,
                    selectId: `product-${key}-${productId}`,
                    className: "form-control",
                    defaultValue,
                    options,
                    dataAttributes,
                });
            } else {
                return Input({
                    label,
                    id: `product-${key}-${productId}`,
                    name: key,
                    type: type || "text",
                    value: value || "",
                    className: "form-control",
                });
            }
        });

    return fields;
}

function renderProductForm(productId, product) {
    const formFields = renderProductFormFields(productId, product);

    const inputsContainer = document.querySelector('[data-product-inputs]');
    const form = inputsContainer.closest('form');
    form.setAttribute("data-product-id", productId);

    formFields.forEach((field) => {
        inputsContainer.appendChild(field);
    });

    const createdAtParagraph = document.createElement("p");
    createdAtParagraph.innerHTML = `<strong>Created At:</strong> ${new Date(product.createdAt).toLocaleString()}`;
    inputsContainer.appendChild(createdAtParagraph);

    const updatedAtParagraph = document.createElement("p");
    updatedAtParagraph.innerHTML = `<strong>Last Updated At:</strong> ${product.updatedAt ? new Date(product.updatedAt).toLocaleString() : "N/A"
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

function attachFormHandlers(container, productId) {
    const form = container.querySelector('.page-form'); // Use the form container
    if (!form) return;

    const updateButton = form.querySelector("[data-update-profile]");
    const deleteButton = form.querySelector("[data-delete-profile]");

    if (!updateButton || !deleteButton) return;

    updateButton.addEventListener('click', async (event) => {
        event.preventDefault();
        await handleUpdateProduct(form, productId);
    });

    deleteButton.addEventListener('click', async () => {
        event.preventDefault();
        await handleDeleteProduct(productId);
    });
}

async function handleUpdateProduct(form, productId) {
    const formData = new FormData(form);
    const updatedData = {};

    formData.forEach((value, key) => {
        updatedData[key] = value;
    });

    const typeSelect = form.querySelector('[data-product-type][data-selected-value]');
    const statusSelect = form.querySelector('[data-product-status][data-selected-value]');

    if (typeSelect) {
        updatedData.productType = typeSelect.getAttribute('data-selected-value');
    }

    if (statusSelect) {
        updatedData.status = statusSelect.getAttribute('data-selected-value');
    }

    try {
        const response = await updateProduct(productId, updatedData);
        console.log('Product updated:', response);
        alert('Product updated successfully!');
    } catch (error) {
        console.error('Error updating product:', error);
        alert('Failed to update product.');
    }
}

async function handleDeleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        try {
            await deleteProduct(productId);
            alert('Product deleted successfully!');
            redirectToProducts();
        } catch (error) {
            console.error('Error deleting product:', error);

            if (error.message.includes('404')) {
                alert('Product might have already been deleted.');
                redirectToProducts();
            } else {
                alert('Failed to delete product.');
            }
        }
    }
}

async function updateProductSidebarStats() {
    const sidebarItems = [
        { heading: "Total Product Locations", attribute: "data-total-products", statKey: "totalProducts" },
        { heading: "Fully Stocked Products", attribute: "data-fully-stocked-products", statKey: "fullyStockedProducts" },
        { heading: "Active Product Locations", attribute: "data-active-products", statKey: "statusCounts.ACTIVE" },
        { heading: "Inactive Product Locations", attribute: "data-inactive-products", statKey: "statusCounts.INACTIVE" },
        { heading: "Empty Product Locations", attribute: "data-empty-products", statKey: "emptyProducts" },
        { heading: "Products with Low Stock", attribute: "data-low-stock-products", statKey: "productsWithLowStock" },
        { heading: "Average Products per Product", attribute: "data-avg-products-per-product", statKey: "averageProductsPerProduct" },
        { heading: "Total Product Area (km²)", attribute: "data-total-product-area", statKey: "totalArea" },
        { heading: "Products with Expired Products", attribute: "data-products-with-expired-products", statKey: "productsWithExpiredProducts" },
    ];

    try {
        const stats = await fetchProductStatistics();
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
        console.error('Error updating product sidebar stats:', error);
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
    renderProducts();
    handleAddProduct();
    renderSingleProduct();
    updateProductSidebarStats();
});