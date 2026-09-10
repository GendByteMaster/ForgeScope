import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync
} from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const PACKAGE_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PACKAGE = JSON.parse(readFileSync(join(PACKAGE_ROOT, 'package.json'), 'utf8'));
const SKILL_NAME = 'forgescope';
const SKILL_SOURCE = join(PACKAGE_ROOT, 'skills', SKILL_NAME);
const WORKSPACE_SOURCE = join(SKILL_SOURCE, 'assets', 'REVIEW.md');
const WORKSPACE_RELATIVE = join('.forgescope', 'REVIEW.md');

export const VERSION = PACKAGE.version;

export function usage() {
  return `ForgeScope v${VERSION}\n\nUsage:\n  forgescope install [options]\n  forgescope status [options]\n  forgescope uninstall [options]\n  forgescope init [options]\n\nOptions:\n  --client <all|codex|claude|cursor>  Target client (default: all)\n  --global                             Install in user-level skill directories\n  --force                              Replace an existing skill or workspace\n  --dry-run                            Print actions without changing files\n  -h, --help                           Show help\n  -v, --version                        Show version\n\nExamples:\n  forgescope install --client codex --global\n  forgescope install --client all\n  forgescope init\n  forgescope status --client codex --global\n  forgescope uninstall --client codex --global\n\nNotes:\n  - uninstall removes only the installed ForgeScope skill.\n  - uninstall never deletes .forgescope/REVIEW.md.\n  - init preserves an existing REVIEW.md unless --force is provided.\n`;
}

export function parseArgs(argv) {
  const out = {
    command: 'install',
    client: 'all',
    global: false,
    force: false,
    dryRun: false,
    help: false,
    version: false
  };

  const args = [...argv];
  if (args[0] && !args[0].startsWith('-')) out.command = args.shift();

  while (args.length) {
    const arg = args.shift();
    if (arg === '--client') {
      const value = args.shift();
      if (!value) throw new Error('--client requires a value');
      out.client = value;
    } else if (arg?.startsWith('--client=')) {
      out.client = arg.slice('--client='.length);
    } else if (arg === '--global') out.global = true;
    else if (arg === '--force') out.force = true;
    else if (arg === '--dry-run') out.dryRun = true;
    else if (arg === '-h' || arg === '--help') out.help = true;
    else if (arg === '-v' || arg === '--version') out.version = true;
    else throw new Error(`unknown option: ${arg}`);
  }

  if (!['install', 'status', 'uninstall', 'init', 'help'].includes(out.command)) {
    throw new Error(`unknown command: ${out.command}`);
  }
  if (!['all', 'codex', 'claude', 'cursor'].includes(out.client)) {
    throw new Error(`unsupported client: ${out.client}`);
  }
  if (out.command === 'init' && out.global) {
    throw new Error('init is repository-local and cannot be combined with --global');
  }

  return out;
}

export function selectedClients(client) {
  return client === 'all' ? ['codex', 'claude', 'cursor'] : [client];
}

export function targetPaths(client, globalScope, context = {}) {
  const cwd = context.cwd ?? process.cwd();
  const home = context.home ?? homedir();
  const map = {
    codex: globalScope
      ? join(home, '.agents', 'skills', SKILL_NAME)
      : join(cwd, '.agents', 'skills', SKILL_NAME),
    claude: globalScope
      ? join(home, '.claude', 'skills', SKILL_NAME)
      : join(cwd, '.claude', 'skills', SKILL_NAME),
    cursor: globalScope
      ? join(home, '.cursor', 'skills', SKILL_NAME)
      : join(cwd, '.agents', 'skills', SKILL_NAME)
  };

  const grouped = new Map();
  for (const name of selectedClients(client)) {
    const path = map[name];
    const clients = grouped.get(path) ?? [];
    clients.push(name);
    grouped.set(path, clients);
  }

  return [...grouped.entries()].map(([path, clients]) => ({ path, clients }));
}

export function workspacePath(context = {}) {
  return join(context.cwd ?? process.cwd(), WORKSPACE_RELATIVE);
}

export function isForgeScopeInstallation(path) {
  const skillFile = join(path, 'SKILL.md');
  if (!existsSync(skillFile)) return false;
  const text = readFileSync(skillFile, 'utf8');
  return /^name:\s*forgescope\s*$/m.test(text);
}

function runtimeContext(context = {}) {
  return {
    cwd: context.cwd ?? process.cwd(),
    home: context.home ?? homedir(),
    log: context.log ?? console.log,
    error: context.error ?? console.error
  };
}

function install(options, context) {
  if (!existsSync(join(SKILL_SOURCE, 'SKILL.md'))) {
    throw new Error(`bundled skill is missing at ${SKILL_SOURCE}`);
  }

  for (const target of targetPaths(options.client, options.global, context)) {
    const label = target.clients.join('+');
    if (existsSync(target.path) && !options.force) {
      context.log(`skip     ${label}: ${target.path} (already exists; use --force)`);
      continue;
    }

    context.log(`${options.dryRun ? 'would install' : 'install  '} ${label}: ${target.path}`);
    if (options.dryRun) continue;

    if (existsSync(target.path)) rmSync(target.path, { recursive: true, force: true });
    mkdirSync(dirname(target.path), { recursive: true });
    cpSync(SKILL_SOURCE, target.path, { recursive: true });
  }
}

function status(options, context) {
  for (const target of targetPaths(options.client, options.global, context)) {
    const label = target.clients.join('+');
    const installed = isForgeScopeInstallation(target.path);
    context.log(`${installed ? 'installed' : 'missing  '} ${label}: ${target.path}`);
  }

  if (!options.global) {
    const path = workspacePath(context);
    context.log(`${existsSync(path) ? 'present  ' : 'missing  '} workspace: ${path}`);
  }
}

function uninstall(options, context) {
  for (const target of targetPaths(options.client, options.global, context)) {
    const label = target.clients.join('+');
    if (!existsSync(target.path)) {
      context.log(`skip     ${label}: ${target.path} (not installed)`);
      continue;
    }
    if (!isForgeScopeInstallation(target.path)) {
      context.log(`protect  ${label}: ${target.path} (not recognized as ForgeScope)`);
      continue;
    }

    context.log(`${options.dryRun ? 'would remove' : 'remove   '} ${label}: ${target.path}`);
    if (!options.dryRun) rmSync(target.path, { recursive: true, force: true });
  }

  if (!options.global) {
    const path = workspacePath(context);
    if (existsSync(path)) context.log(`preserve workspace: ${path}`);
  }
}

function initWorkspace(options, context) {
  if (!existsSync(WORKSPACE_SOURCE)) {
    throw new Error(`bundled workspace template is missing at ${WORKSPACE_SOURCE}`);
  }

  const path = workspacePath(context);
  if (existsSync(path) && !options.force) {
    context.log(`skip     workspace: ${path} (already exists; use --force to reset)`);
    return;
  }

  context.log(`${options.dryRun ? 'would init' : 'init     '} workspace: ${path}`);
  if (options.dryRun) return;

  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, readFileSync(WORKSPACE_SOURCE, 'utf8'), 'utf8');
}

export function main(argv = process.argv.slice(2), overrides = {}) {
  const context = runtimeContext(overrides);

  try {
    const options = parseArgs(argv);

    if (options.version) {
      context.log(VERSION);
      return 0;
    }
    if (options.help || options.command === 'help') {
      context.log(usage());
      return 0;
    }

    if (options.command === 'install') install(options, context);
    else if (options.command === 'status') status(options, context);
    else if (options.command === 'uninstall') uninstall(options, context);
    else if (options.command === 'init') initWorkspace(options, context);

    return 0;
  } catch (error) {
    context.error(`ForgeScope: ${error instanceof Error ? error.message : String(error)}`);
    return 1;
  }
}
