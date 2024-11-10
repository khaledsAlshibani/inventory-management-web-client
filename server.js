const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'dist')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, async () => {
    const url = `http://localhost:${PORT}`;

    try {
        const { default: open } = await import('open');
        const { default: chalk } = await import('chalk');

        console.log(chalk.green.bold(`Server is running at ${chalk.blue.underline(url)}`));
        open(url);
    } catch (error) {
        const { default: chalk } = await import('chalk');
        console.error(chalk.red.bold("Failed to open browser:"), chalk.yellow(error.message));
    }
});