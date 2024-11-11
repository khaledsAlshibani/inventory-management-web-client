const express = require('express');
const path = require('path');
const chokidar = require('chokidar');
const { exec } = require('child_process');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, '../dist')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

async function startServer() {
    try {
        const { default: open } = await import('open');
        const { default: chalk } = await import('chalk');

        app.listen(PORT, () => {
            const url = `http://localhost:${PORT}`;
            console.log(chalk.green.bold(`Server running at ${chalk.blue.underline(url)}`));
            open(url);
        });
    } catch (error) {
        const { default: chalk } = await import('chalk');
        console.error(chalk.red("Failed to start server or open browser:"), chalk.yellow(error.message));
    }
}

async function runBuild() {
    const chalk = (await import('chalk')).default;
    console.log(chalk.blue('\nDetected change. Starting build...'));
    exec('node scripts/build.js', (error, stdout, stderr) => {
        if (error) {
            console.error(chalk.red(`Build error: ${error.message}`));
            return;
        }
        if (stderr) {
            console.error(chalk.yellow(`Build stderr: ${stderr}`));
            return;
        }
        console.log(chalk.green.bold('\nBuild completed successfully.'));
    });
}

async function startWatcher() {
    const chalk = (await import('chalk')).default;

    const watcher = chokidar.watch('src', {
        ignored: /(^|[\/\\])\../,
        persistent: true,
    });

    watcher.on('all', async (event, path) => {
        const eventColors = {
            add: chalk.cyan,
            change: chalk.magenta,
            unlink: chalk.red,
        };
        const logEvent = eventColors[event] || chalk.yellow;
        console.log(logEvent(`File ${event}: ${path}`));
        runBuild();
    });

    console.log(chalk.blue.bold('Watching for changes in "src" directory...'));
}

startServer();
startWatcher();
