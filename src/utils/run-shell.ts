import { spawn, SpawnOptionsWithoutStdio } from 'child_process';

export type ExecResult =
  | { ok: true; out: string }
  | { ok: false; code: number; err: string };

/**
 * Filters out known Node.js warning messages from stderr
 */
function filterNodeWarnings(text: string): string {
  // List of patterns to filter out
  const warningPatterns = [
    /\(node:\d+\) \[MODULE_TYPELESS_PACKAGE_JSON\] Warning:.*/g,
    /\(Use `node --trace-warnings \.\.\.` to show where the warning was created\)/g,
    /ExperimentalWarning: .*/g,
    /DeprecationWarning: .*/g,
    /\(node:\d+\) Warning: .*/g,
  ];
  
  let filtered = text;
  for (const pattern of warningPatterns) {
    filtered = filtered.replace(pattern, '');
  }
  
  // Remove empty lines created by filtering
  return filtered.split('\n')
    .filter(line => line.trim().length > 0)
    .join('\n');
}

/**
 * Executes a shell command with streaming output.
 * - Streams stdout/stderr to the parent process
 * - Auto-injects --no-pager for git commands
 * - Filters out Node.js module warnings from stderr
 * @param command The command to run
 * @param args Arguments for the command
 * @param opts Spawn options (e.g., cwd, env)
 * @returns ExecResult indicating success or failure
 */
/**
 * Escapes a string for safe use in shell commands
 */
function escapeShellArg(arg: string): string {
  if (process.platform === 'win32') {
    // Windows shell escaping: wrap in quotes and escape internal quotes
    return `"${arg.replace(/"/g, '""')}"`;
  } else {
    // Unix shell escaping: wrap in single quotes and escape single quotes
    return `'${arg.replace(/'/g, "'\"'\"'")}'`;
  }
}

export async function runShell(
  command: string,
  args: string[] = [],
  opts?: SpawnOptionsWithoutStdio
): Promise<ExecResult> {
  const finalArgs = command === 'git' ? ['--no-pager', ...args] : args;
  const useShell = process.platform === 'win32';

  return new Promise(resolve => {
    let spawnCommand = command;
    let spawnArgs = finalArgs;

    if (useShell) {
      // When using shell, we need to construct the full command string
      // and escape arguments properly
      const escapedArgs = finalArgs.map(escapeShellArg).join(' ');
      spawnCommand = `${command} ${escapedArgs}`;
      spawnArgs = [];
    }

    // Ensure critical environment variables are available for Gemini CLI
    const enhancedEnv = {
      ...process.env,
      ...(opts?.env || {})
    };

    // Special handling for Gemini CLI environment variable inheritance bug
    if (command === 'gemini' && !enhancedEnv.GEMINI_API_KEY) {
      console.warn(`[Gemini MCP] WARNING: GEMINI_API_KEY not found in environment for Gemini CLI execution`);
      console.warn(`[Gemini MCP] This is likely due to Gemini CLI issue #1560 - environment variable inheritance bug`);
    }

    const child = spawn(spawnCommand, spawnArgs, {
      shell: useShell,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: enhancedEnv,
      ...opts,
    });

    let out = '';
    let err = '';

    if (child.stdout) {
      child.stdout.on('data', data => {
        const text = data.toString();
        process.stdout.write(text);
        out += text;
      });
    }

    if (child.stderr) {
      child.stderr.on('data', data => {
        const text = data.toString();
        // Filter out Node.js warnings before streaming
        const filteredText = filterNodeWarnings(text);
        if (filteredText.trim()) {
          process.stderr.write(filteredText);
        }
        err += text; // Keep original for error reporting
      });
    }

    child.on('close', code => {
      if (code === 0) {
        resolve({ ok: true, out });
      } else {
        // Filter Node warnings from error output as well
        const filteredErr = filterNodeWarnings(err);
        resolve({ ok: false, code: code || 0, err: filteredErr || err });
      }
    });

    child.on('error', error => {
      resolve({ ok: false, code: -1, err: error.message });
    });
  });
}

