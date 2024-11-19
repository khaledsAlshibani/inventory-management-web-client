import { fetchInventoryStatistics, fetchProductStatistics } from '../api/statistics.mjs';

async function displayNumericStatistics(inventoriesStats, productsStats) {
    try {
        console.log('Received statistics:', inventoriesStats);

        const mappings = [
            { attribute: 'data-total-products-price-value', value: productsStats.totalPriceValue },
            { attribute: 'data-total-products', value: inventoriesStats.totalInventories },
            { attribute: 'data-active-inventories', value: inventoriesStats.statusCounts.ACTIVE || 0 },
            { attribute: 'data-inventories-with-low-stock', value: inventoriesStats.inventoriesWithLowStock || 0 },
            { attribute: 'data-average-products-per-inventory', value: inventoriesStats.averageProductsPerInventory || 0 },
        ];

        // Dynamically update values based on attributes
        mappings.forEach(({ attribute, value }) => {
            const element = document.querySelector(`[${attribute}]`);
            if (element) {
                const valueElement = element.querySelector('[data-statistic-value]');
                if (valueElement) {
                    valueElement.textContent = value;
                }
            }
        });
    } catch (error) {
        console.error('Error displaying numeric statistics:', error);
        handleDashboardError(error);
    }
}

function renderUtilizationChart(utilizationData) {
    const utilizationRanges = ['0-25%', '25-50%', '50-75%', '75-100%'];
    const utilizationCounts = [0, 0, 0, 0];

    utilizationData.forEach(utilization => {
        if (utilization <= 0.25) {
            utilizationCounts[0]++;
        } else if (utilization <= 0.50) {
            utilizationCounts[1]++;
        } else if (utilization <= 0.75) {
            utilizationCounts[2]++;
        } else {
            utilizationCounts[3]++;
        }
    });

    const utilizationCtx = document.querySelector('[data-utilization-chart]').getContext('2d');
    if (!utilizationCtx) return;
    new Chart(utilizationCtx, {
        type: 'bar',
        data: {
            labels: utilizationRanges,
            datasets: [{
                label: 'Number of Inventories',
                data: utilizationCounts,
                backgroundColor: [
                    'rgba(75, 192, 192, 0.5)', // 0-25%
                    'rgba(255, 205, 86, 0.5)', // 25-50%
                    'rgba(54, 162, 235, 0.5)', // 50-75%
                    'rgba(255, 99, 132, 0.5)'  // 75-100%
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 205, 86, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Inventories',
                    },
                },
                x: {
                    title: {
                        display: true,
                        text: 'Utilization Ranges',
                    },
                }
            }
        }
    });
}

function renderProductStatusBarChart(statusCounts) {
    const statusLabels = Object.keys(statusCounts); 
    const statusData = Object.values(statusCounts);

    const productStatusCtx = document.querySelector('[data-product-status-chart]').getContext('2d');
    if (!productStatusCtx) return;

    new Chart(productStatusCtx, {
        type: 'bar',
        data: {
            labels: statusLabels, // X-axis labels
            datasets: [{
                label: 'Product Status',
                data: statusData, // Y-axis values
                backgroundColor: [
                    'rgba(54, 162, 235, 0.5)', // AVAILABLE
                    'rgba(255, 99, 132, 0.5)', // UNAVAILABLE
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false 
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Products'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Product Status'
                    }
                }
            }
        }
    });
}

function renderExpiredProductsChart(expiredProducts) {
    const expiredCtx = document.querySelector('[data-expired-chart]').getContext('2d');
    if (!expiredCtx) return;
    new Chart(expiredCtx, {
        type: 'pie',
        data: {
            labels: ['Expired Products', 'Non-Expired Products'],
            datasets: [{
                label: 'Expiration Status',
                data: [expiredProducts, 100 - expiredProducts], // Example values
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)', // Expired
                    'rgba(75, 192, 192, 0.5)'  // Non-expired
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            }
        }
    });
}

function renderStatusChart(statusLabels, statusData) {
    const statusCtx = document.querySelector('[data-status-chart]').getContext('2d');
    if (!statusCtx) return;
    new Chart(statusCtx, {
        type: 'doughnut',
        data: {
            labels: statusLabels,
            datasets: [{
                label: 'Inventory Status',
                data: statusData,
                backgroundColor: [
                    'rgba(75, 192, 192, 0.5)', // ACTIVE
                    'rgba(255, 99, 132, 0.5)'  // INACTIVE
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            }
        }
    });
}

function renderTypeChart(typeLabels, typeData) {
    const typeCtx = document.querySelector('[data-type-chart]').getContext('2d');
    if (!typeCtx) return;
    new Chart(typeCtx, {
        type: 'bar',
        data: {
            labels: typeLabels, // 'WAREHOUSE', 'STORE', 'ONLINE'
            datasets: [{
                label: 'Inventory Types',
                data: typeData,
                backgroundColor: [
                    'rgba(54, 162, 235, 0.5)', // WAREHOUSE
                    'rgba(153, 102, 255, 0.5)', // STORE
                    'rgba(255, 159, 64, 0.5)'   // ONLINE
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Function to handle errors during dashboard rendering
function handleDashboardError(error) {
    console.error('Error displaying dashboard:', error);
    document.body.innerHTML = `<p class="error">Failed to load dashboard data. Please try again later.</p>`;
}

document.addEventListener("DOMContentLoaded", async function () {
    try {
        const inventoriesStats = await fetchInventoryStatistics();
        const productsStats = await fetchProductStatistics();

        displayNumericStatistics(inventoriesStats, productsStats);

        const statusLabels = Object.keys(inventoriesStats.statusCounts);
        const statusData = Object.values(inventoriesStats.statusCounts);
        const typeLabels = Object.keys(inventoriesStats.typeCounts);
        const typeData = Object.values(inventoriesStats.typeCounts);
        const averageUtilization = Object.values(inventoriesStats.averageUtilization);
        const inventoriesWithExpiredProducts = Object.values(inventoriesStats.inventoriesWithExpiredProducts);
        const statusCounts = productsStats.statusCounts;

        renderStatusChart(statusLabels, statusData);
        renderTypeChart(typeLabels, typeData);
        // renderUtilizationChart(averageUtilization);
        renderExpiredProductsChart(inventoriesWithExpiredProducts);
        renderProductStatusBarChart(statusCounts);
    } catch (error) {
        handleDashboardError(error);
    }
});