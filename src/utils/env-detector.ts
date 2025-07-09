import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';

/**
 * Cross-platform Gemini CLI authentication detection utility
 * Handles environment variable inheritance differences between VSCode extensions
 * and supports multiple Gemini CLI authentication methods
 */

interface GeminiAuthConfig {
  selectedAuthType?: string;
  apiKey?: string;
  [key: string]: any;
}

// Simple logging utility
function logDebug(message: string): void {
  if (process.env.GEMINI_MCP_DEBUG === '1') {
    console.warn(`[Gemini MCP] ${message}`);
  }
}

/**
 * Get cross-platform Gemini CLI configuration directory
 */
function getGeminiConfigDir(): string {
  return path.join(os.homedir(), '.gemini');
}

/**
 * Check if Gemini CLI has valid authentication configured
 */
async function checkGeminiAuth(): Promise<{ hasAuth: boolean; authType?: string; details?: string }> {
  try {
    const configDir = getGeminiConfigDir();
    const settingsFile = path.join(configDir, 'settings.json');

    // Check if settings file exists
    try {
      const settingsContent = await fs.readFile(settingsFile, 'utf-8');
      const settings: GeminiAuthConfig = JSON.parse(settingsContent);

      // Check for API key directly in settings
      if (settings.apiKey) {
        return {
          hasAuth: true,
          authType: 'gemini-settings-api-key',
          details: 'API key found in ~/.gemini/settings.json'
        };
      }

      // Check for selected auth type
      if (settings.selectedAuthType) {
        return {
          hasAuth: true,
          authType: settings.selectedAuthType,
          details: `Found ${settings.selectedAuthType} in ~/.gemini/settings.json`
        };
      }
    } catch (error) {
      // Settings file doesn't exist or is invalid
    }

    // Check for environment variable
    if (process.env.GEMINI_API_KEY) {
      return {
        hasAuth: true,
        authType: 'environment-variable',
        details: 'GEMINI_API_KEY found in environment variables'
      };
    }

    return { hasAuth: false };
  } catch (error) {
    return { hasAuth: false };
  }
}

/**
 * Simplified cross-platform environment variable detection
 * Focuses on process.env and basic fallbacks without complex process spawning
 */
async function readSystemEnvironmentVariable(varName: string): Promise<string | null> {
  // First check if it's already in process.env
  if (process.env[varName]) {
    return process.env[varName] || null;
  }

  // For Windows MCP compatibility, we rely on process.env inheritance
  // Complex PowerShell spawning removed for simplicity and reliability
  logDebug(`${varName} not found in process.env - relying on Gemini CLI settings or .env files`);
  return null;
}

// Removed complex PowerShell environment variable detection
// Simplified approach relies on process.env inheritance and fallback methods

/**
 * Parse .env file content and extract variable value
 */
function parseEnvFileContent(content: string, varName: string): string | null {
  const lines = content.split('\n');
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const [key, ...valueParts] = trimmedLine.split('=');
      if (key?.trim() === varName) {
        let value = valueParts.join('=').trim();
        // Remove quotes if present
        if ((value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        return value || null;
      }
    }
  }
  return null;
}

/**
 * Reads environment variable from .env files following Gemini CLI's search order:
 * 1. Workspace .env (current working directory)
 * 2. ~/.gemini/.env (Gemini CLI configuration directory)
 * 3. ~/.env (user home directory)
 */
async function readFromEnvFile(varName: string): Promise<string | null> {
  const envFilePaths = [
    path.join(process.cwd(), '.env'),                    // Workspace .env
    path.join(getGeminiConfigDir(), '.env'),             // ~/.gemini/.env
    path.join(os.homedir(), '.env')                      // ~/.env
  ];

  for (const envFilePath of envFilePaths) {
    try {
      const envContent = await fs.readFile(envFilePath, 'utf-8');
      const value = parseEnvFileContent(envContent, varName);
      if (value) {
        logDebug(`Found ${varName} in ${envFilePath}`);
        return value;
      }
    } catch (error) {
      // File doesn't exist or can't be read, continue to next
      continue;
    }
  }

  return null;
}

// Removed complex Unix environment variable detection
// Simplified approach relies on process.env inheritance and fallback methods

/**
 * Read API key from Gemini CLI settings file
 */
async function readFromGeminiSettings(varName: string): Promise<string | null> {
  try {
    const configDir = getGeminiConfigDir();
    const settingsFile = path.join(configDir, 'settings.json');

    const settingsContent = await fs.readFile(settingsFile, 'utf-8');
    const settings: GeminiAuthConfig = JSON.parse(settingsContent);

    // Check for API key in settings
    if (varName === 'GEMINI_API_KEY' && settings.apiKey) {
      return settings.apiKey;
    }

    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Ensures GEMINI_API_KEY is available in process.env for Gemini CLI
 * Addresses environment variable inheritance differences between VSCode extensions
 */
export async function ensureGeminiAuthentication(): Promise<void> {
  // Always check if GEMINI_API_KEY is available in process.env
  if (process.env.GEMINI_API_KEY) {
    logDebug('✅ GEMINI_API_KEY already available in process.env');
    return;
  }

  logDebug('GEMINI_API_KEY not found in process.env, attempting detection...');

  // Try to detect from Gemini CLI settings first
  const geminiSettingsApiKey = await readFromGeminiSettings('GEMINI_API_KEY');
  if (geminiSettingsApiKey) {
    process.env.GEMINI_API_KEY = geminiSettingsApiKey;
    logDebug('✅ Successfully detected GEMINI_API_KEY from ~/.gemini/settings.json');
    logDebug('💡 Using Gemini CLI configuration for authentication');
    return;
  }

  // Try to detect from system environment
  const systemApiKey = await readSystemEnvironmentVariable('GEMINI_API_KEY');
  if (systemApiKey) {
    process.env.GEMINI_API_KEY = systemApiKey;
    logDebug('✅ Successfully detected GEMINI_API_KEY from system environment');
    logDebug('💡 This resolves environment variable inheritance differences between VSCode extensions');
    return;
  }

  // Try .env file as fallback
  const envFileApiKey = await readFromEnvFile('GEMINI_API_KEY');
  if (envFileApiKey) {
    process.env.GEMINI_API_KEY = envFileApiKey;
    logDebug('✅ Successfully detected GEMINI_API_KEY from .env file');
    return;
  }

  logDebug('❌ GEMINI_API_KEY not found. Gemini CLI will handle authentication.');
}

/**
 * Legacy function name for backward compatibility
 * @deprecated Use ensureGeminiAuthentication instead
 */
export async function ensureEnvironmentVariables(): Promise<void> {
  return ensureGeminiAuthentication();
}

/**
 * Check current Gemini CLI authentication status
 */
export async function checkGeminiAuthenticationStatus(): Promise<{ hasAuth: boolean; authType?: string; details?: string }> {
  return await checkGeminiAuth();
}
