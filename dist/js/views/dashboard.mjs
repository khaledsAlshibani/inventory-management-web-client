import { fetchInventoryStatistics } from '../api/statistics.mjs';

async function displayNumericStatistics(stats) {
    try {
        console.log('Received statistics:', stats);
        // General Statistics
        const totalInventories = stats.totalInventories;
        const activeInventories = stats.statusCounts.ACTIVE || 0;

        // Update Total Inventories
        const totalInventoriesChart = document.querySelector('[data-total-inventories-chart]');
        if (totalInventoriesChart) {
            const totalValueElement = totalInventoriesChart.querySelector('[data-statistic-value]');
            if (totalValueElement) {
                totalValueElement.textContent = totalInventories;
            }
        }

        // Update Active Inventories
        const activeInventoriesChart = document.querySelector('[data-active-inventories-chart]');
        if (activeInventoriesChart) {
            const activeValueElement = activeInventoriesChart.querySelector('[data-statistic-value]');
            if (activeValueElement) {
                activeValueElement.textContent = activeInventories;
            }
        }
    } catch (error) {
        console.error('Error displaying numeric statistics:', error);
        handleDashboardError(error);
    }
}

function renderSalesChart(revenueData) {
    const salesCanvas = document.querySelector('[data-sales-chart]');
    
    if (!salesCanvas || salesCanvas.tagName !== 'CANVAS') {
        console.error('Canvas element for sales chart is missing or invalid.');
        return;
    }

    const salesCtx = salesCanvas.getContext('2d');
    new Chart(salesCtx, {
        type: 'line',
        data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June'],
            datasets: [{
                label: 'Monthly Sales',
                data: revenueData,
                borderColor: 'rgba(255, 106, 0, 1)',
                backgroundColor: 'rgba(255, 106, 0, 0.2)',
                borderWidth: 2,
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    enabled: true,
                },
            },
            scales: {
                y: {
                    beginAtZero: true
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
        // Fetch statistics from the API
        const stats = await fetchInventoryStatistics();

        // Display numeric statistics
        displayNumericStatistics(stats);

        // Extract data for charts
        const statusLabels = Object.keys(stats.statusCounts);
        const statusData = Object.values(stats.statusCounts);
        const typeLabels = Object.keys(stats.typeCounts);
        const typeData = Object.values(stats.typeCounts);
        const revenueData = [15000, 20000, 25000, 40000, 22000, 30000]; // Example data

        // Render charts
        renderSalesChart(revenueData);
        renderStatusChart(statusLabels, statusData);
        renderTypeChart(typeLabels, typeData);
    } catch (error) {
        handleDashboardError(error);
    }
});