import { join } from "path";
import { mkdir, appendFile } from "fs/promises";
import { existsSync } from "fs";

const LOG_DIR = "logs";
const LOG_FILE = join(LOG_DIR, `app-${new Date().toISOString().split('T')[0]}.log`);

// Create the logs directory if it doesn't exist
if (!existsSync(LOG_DIR)) {
  await mkdir(LOG_DIR);
}

function formatLog(level: string, message: string, meta?: any): string {
  const timestamp = new Date().toISOString();
  const metaStr = meta ? ` - ${JSON.stringify(meta)}` : '';
  return `[${timestamp}] [${level}] ${message}${metaStr}\n`;
}

async function writeToFile(content: string) {
  try {
    await appendFile(LOG_FILE, content);
  } catch (error) {
    console.error('Error writing to log file:', error);
  }
}

const logger = {
  info: async (message: string, meta?: any) => {
    const log = formatLog('INFO', message, meta);
    console.log(log.trim());
    await writeToFile(log);
  },

  error: async (message: string, meta?: any) => {
    const log = formatLog('ERROR', message, meta);
    console.error(log.trim());
    await writeToFile(log);
  },

  warn: async (message: string, meta?: any) => {
    const log = formatLog('WARN', message, meta);
    console.warn(log.trim());
    await writeToFile(log);
  },

  debug: async (message: string, meta?: any) => {
    if (process.env.NODE_ENV === 'development') {
      const log = formatLog('DEBUG', message, meta);
      console.debug(log.trim());
      await writeToFile(log);
    }
  }
};

export default logger;
