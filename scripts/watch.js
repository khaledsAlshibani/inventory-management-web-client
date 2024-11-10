const chokidar = require('chokidar');
const { exec } = require('child_process');

async function runBuild() {
    const chalk = (await import('chalk')).default;
    console.log(chalk.blue('Change detected. Running build...'));
    exec('node scripts/build.js', (error, stdout, stderr) => {
        if (error) {
            console.error(chalk.red(`Build error: ${error.message}`));
            return;
        }
        if (stderr) {
            console.error(chalk.yellow(`Build stderr: ${stderr}`));
            return;
        }
        console.log(chalk.green(stdout));
        console.log(chalk.green.bold('Build completed successfully.'));
    });
}

const watcher = chokidar.watch('src', {
    // ignore dotfiles
    ignored: /(^|[\/\\])\../,
    persistent: true
});

// Watch for changes and rerun the build process
watcher
    .on('add', async (path) => {
        const chalk = (await import('chalk')).default;
        console.log(chalk.cyan(`File added: ${path}`));
        runBuild();
    })
    .on('change', async (path) => {
        const chalk = (await import('chalk')).default;
        console.log(chalk.magenta(`File changed: ${path}`));
        runBuild();
    })
    .on('unlink', async (path) => {
        const chalk = (await import('chalk')).default;
        console.log(chalk.red(`File removed: ${path}`));
        runBuild();
    });

(async () => {
    const chalk = (await import('chalk')).default;
    console.log(chalk.blue.bold('Watching for changes in the "src" directory...'));
})();