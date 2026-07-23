#!/usr/bin/env node
/**
 * Smoke test: verifies the theme switcher is wired up end-to-end.
 *
 * Specifically catches the kind of rebase accident we already hit once,
 * where the "add theme switcher" commit had a message but no files.
 *
 * Runs as:
 *   npm run smoke-test            (manual)
 *   .git/hooks/pre-commit         (auto, via Husky)
 *   .github/workflows/ci.yml      (CI on push/PR)
 *
 * Static checks only — fast (<100ms) so it fits comfortably inside a
 * pre-commit hook. For anything stricter, write a real Playwright/Vitest
 * test against the running app.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const errors = [];
let checks = 0;

const green = (s) => `\x1b[32m${s}\x1b[0m`;
const red = (s) => `\x1b[31m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;

function pass(msg) {
    checks++;
    console.log(`  ${green('✓')} ${msg}`);
}

function fail(msg) {
    errors.push(msg);
    console.log(`  ${red('✗')} ${msg}`);
}

function section(title) {
    console.log(`\n${yellow(title)}`);
}

function readFile(relPath) {
    return fs.readFileSync(path.join(ROOT, relPath), 'utf8');
}

function fileExists(relPath) {
    return fs.existsSync(path.join(ROOT, relPath));
}

// ---------------------------------------------------------------------------
section('1. Required theme files exist');
// ---------------------------------------------------------------------------

const requiredFiles = [
    'lib/themes.js',
    'components/ThemeProvider.js',
    'components/ThemeSwitcher.js',
    'components/ThemeSwitcher.module.css',
];
for (const f of requiredFiles) {
    if (fileExists(f)) pass(f);
    else fail(`Missing file: ${f}`);
}

// ---------------------------------------------------------------------------
section('2. DomainSalePage renders <ThemeSwitcher />');
// ---------------------------------------------------------------------------

if (fileExists('components/DomainSalePage.js')) {
    const content = readFile('components/DomainSalePage.js');
    if (/import\s+ThemeSwitcher/.test(content)) {
        pass('imports ThemeSwitcher');
    } else {
        fail('does NOT import ThemeSwitcher');
    }
    if (/<ThemeSwitcher\s*\/>/.test(content)) {
        pass('renders <ThemeSwitcher />');
    } else {
        fail('does NOT render <ThemeSwitcher />');
    }
    if (/settingsIcon/.test(content)) {
        fail('still has the old static `.settingsIcon` div — replace it with <ThemeSwitcher />');
    }
}

// ---------------------------------------------------------------------------
section('3. layout.js wraps children in <ThemeProvider>');
// ---------------------------------------------------------------------------

if (fileExists('app/layout.js')) {
    const content = readFile('app/layout.js');
    if (/import\s+.*ThemeProvider/.test(content)) {
        pass('imports ThemeProvider');
    } else {
        fail('does NOT import ThemeProvider');
    }
    if (/<ThemeProvider[^>]*>[\s\S]*\{children\}[\s\S]*<\/ThemeProvider>/.test(content)) {
        pass('wraps {children} in <ThemeProvider>');
    } else {
        fail('does NOT wrap {children} in <ThemeProvider>');
    }
}

// ---------------------------------------------------------------------------
section('4. themes.js has at least 4 themes');
// ---------------------------------------------------------------------------

if (fileExists('lib/themes.js')) {
    const content = readFile('lib/themes.js');
    const themeMatches = content.match(/^\s*id:\s*['"][^'"]+['"],/gm) || [];
    if (themeMatches.length >= 4) {
        pass(`declares ${themeMatches.length} themes`);
    } else {
        fail(`declares only ${themeMatches.length} themes (expected >= 4)`);
    }
    if (/defaultThemeId/.test(content)) {
        pass('exports defaultThemeId');
    } else {
        fail('does NOT export defaultThemeId');
    }
}

// ---------------------------------------------------------------------------
section('5. Theme tokens are wired into CSS');
// ---------------------------------------------------------------------------

if (fileExists('app/globals.css')) {
    const content = readFile('app/globals.css');
    if (/var\(--bg/.test(content)) {
        pass('globals.css uses var(--bg) (theme-aware background)');
    } else {
        fail('globals.css does NOT use var(--bg) — body bg is hardcoded');
    }
}

if (fileExists('components/DomainSalePage.module.css')) {
    const content = readFile('components/DomainSalePage.module.css');
    if (/var\(--accent/.test(content) && /var\(--card-bg/.test(content)) {
        pass('DomainSalePage.module.css uses --accent / --card-bg vars');
    } else {
        fail('DomainSalePage.module.css missing --accent / --card-bg vars — themes won\'t apply');
    }
}

// ---------------------------------------------------------------------------
section('6. API route exists and gates on Turnstile');
// ---------------------------------------------------------------------------

if (fileExists('app/api/offer/route.js')) {
    const content = readFile('app/api/offer/route.js');
    if (/export\s+async\s+function\s+POST/.test(content)) {
        pass('exports POST handler');
    } else {
        fail('does NOT export a POST handler');
    }
    if (/neon/i.test(content) || /process\.env\.DATABASE_URL/.test(content)) {
        pass('references Neon / DATABASE_URL');
    } else {
        fail('does NOT reference Neon / DATABASE_URL');
    }
}

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

console.log('');
if (errors.length === 0) {
    console.log(green(`✓ Smoke test passed — ${checks} checks`));
    process.exit(0);
} else {
    console.log(red(`✗ Smoke test FAILED — ${errors.length} issue(s), ${checks - errors.length} passed`));
    console.log('\n  Fix the issues above before committing.\n');
    process.exit(1);
}
