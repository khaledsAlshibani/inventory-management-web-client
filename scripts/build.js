const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
const helpers = require('handlebars-helpers')();
const sass = require('sass');

const rootDir = path.resolve(__dirname, '..');
const templatesDir = path.join(rootDir, 'src/templates');
const dataDir = path.join(rootDir, 'src/data');
const componentsDir = path.join(rootDir, 'src/components');
const distDir = path.join(rootDir, 'dist');
const assetsDir = path.join(rootDir, 'src/assets');
const jsDir = path.join(rootDir, 'src/js');
const scssFile = path.join(rootDir, 'src/scss/style.scss');

async function getChalk() {
    return (await import('chalk')).default;
}

async function cleanDist() {
    const chalk = await getChalk();
    try {
        if (fs.existsSync(distDir)) {
            fs.rmSync(distDir, { recursive: true, force: true });
        }
        fs.mkdirSync(distDir);
        console.log(chalk.green('✔ Cleaned and prepared "dist" directory.'));
    } catch (error) {
        console.error(chalk.red("✘ Error cleaning 'dist' directory:"), chalk.yellow(error.message));
        process.exit(1);
    }
}

function registerPartials() {
    try {
        if (!fs.existsSync(componentsDir)) {
            throw new Error(`Components directory not found: ${componentsDir}`);
        }

        const componentFiles = fs.readdirSync(componentsDir);
        componentFiles.forEach((file) => {
            const componentPath = path.join(componentsDir, file);
            const componentName = path.parse(file).name;
            const componentTemplate = fs.readFileSync(componentPath, 'utf8');
            Handlebars.registerPartial(componentName, componentTemplate);
        });
        console.log('✔ Registered all Handlebars partials.');
    } catch (error) {
        console.error("Error registering partials:", error.message);
        process.exit(1);
    }
}

async function loadTemplateData(templateName) {
    const dataFilePath = path.join(dataDir, `${templateName}.data.json`);
    const chalk = await getChalk();
    if (fs.existsSync(dataFilePath)) {
        return JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
    } else {
        console.warn(chalk.yellow(`⚠ Data file not found for template "${templateName}"`));
        return {};
    }
}

async function compileTemplates() {
    const chalk = await getChalk();
    try {
        if (!fs.existsSync(templatesDir)) {
            throw new Error(`Templates directory not found: ${templatesDir}`);
        }

        const templateFiles = fs.readdirSync(templatesDir);
        templateFiles.forEach(async (file) => {
            const templateName = path.parse(file).name;
            const templatePath = path.join(templatesDir, file);
            const templateContent = fs.readFileSync(templatePath, 'utf8');
            const template = Handlebars.compile(templateContent);
            const data = await loadTemplateData(templateName);
            const result = template(data);
            const outputFilePath = path.join(distDir, `${templateName}.html`);
            fs.writeFileSync(outputFilePath, result, 'utf8');
            console.log(chalk.green(`✔ Compiled template: ${templateName}.html`));
        });
    } catch (error) {
        console.error(chalk.red("✘ Error compiling templates:"), chalk.yellow(error.message));
        process.exit(1);
    }
}

async function copyDirectory(src, dest) {
    const chalk = await getChalk();
    try {
        if (!fs.existsSync(src)) {
            throw new Error(`Source directory not found: ${src}`);
        }

        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }

        const entries = fs.readdirSync(src, { withFileTypes: true });
        entries.forEach((entry) => {
            const srcPath = path.join(src, entry.name);
            const destPath = path.join(dest, entry.name);

            if (entry.isDirectory()) {
                copyDirectory(srcPath, destPath);
            } else {
                fs.copyFileSync(srcPath, destPath);
            }
        });
        console.log(chalk.green(`✔ Copied directory from ${src} to ${dest}.`));
    } catch (error) {
        console.error(chalk.red(`✘ Error copying directory from ${src} to ${dest}:`), chalk.yellow(error.message));
        process.exit(1);
    }
}

async function compileSass() {
    const chalk = await getChalk();
    try {
        if (!fs.existsSync(scssFile)) {
            throw new Error(`SCSS file not found: ${scssFile}`);
        }

        const result = sass.compile(scssFile);

        const cssDir = path.join(distDir, 'css');
        if (!fs.existsSync(cssDir)) {
            fs.mkdirSync(cssDir, { recursive: true });
        }

        const cssOutputPath = path.join(cssDir, 'style.css');
        fs.writeFileSync(cssOutputPath, result.css, 'utf8');
        console.log(chalk.green('✔ Compiled SCSS to CSS in "dist/css/style.css".'));
    } catch (error) {
        console.error(chalk.red("✘ Error compiling SCSS:"), chalk.yellow(error.message));
        process.exit(1);
    }
}

async function copyFavicon() {
    const chalk = await getChalk();
    const srcFavicon = path.join(rootDir, 'favicon.ico');
    const destFavicon = path.join(distDir, 'favicon.ico');
    
    try {
        if (fs.existsSync(srcFavicon)) {
            fs.copyFileSync(srcFavicon, destFavicon);
            console.log(chalk.green('✔ Copied favicon.ico to the "dist" directory.'));
        } else {
            console.warn(chalk.yellow('⚠ favicon.ico not found in the root directory.'));
        }
    } catch (error) {
        console.error(chalk.red("✘ Error copying favicon.ico:"), chalk.yellow(error.message));
        process.exit(1);
    }
}

async function build() {
    const chalk = await getChalk();
    console.log(chalk.blue.bold('\nStarting build process...'));
    await cleanDist();
    await registerPartials();
    await compileTemplates();
    await copyDirectory(assetsDir, path.join(distDir, 'assets'));
    await copyDirectory(jsDir, path.join(distDir, 'js'));
    await compileSass();
    await copyFavicon();
    console.log(chalk.green.bold('\n✔ Build process completed successfully.\n'));
}

build();
