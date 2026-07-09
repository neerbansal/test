export interface ParsedCommand {
  command: string;
  args: string[];
  flags: Record<string, string | boolean>;
}

export function parseCommand(input: string): ParsedCommand {
  const parts: string[] = [];
  let current = "";
  let inQuotes = false;
  let quoteChar = "";

  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    if ((char === '"' || char === "'") && (i === 0 || input[i - 1] !== "\\")) {
      if (inQuotes) {
        if (char === quoteChar) {
          inQuotes = false;
          parts.push(current);
          current = "";
        } else {
          current += char;
        }
      } else {
        inQuotes = true;
        quoteChar = char;
      }
    } else if (char === " " && !inQuotes) {
      if (current) {
        parts.push(current);
        current = "";
      }
    } else {
      current += char;
    }
  }
  if (current) parts.push(current);

  const command = parts[0] || "";
  const args: string[] = [];
  const flags: Record<string, string | boolean> = {};

  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    if (part.startsWith("--")) {
      const equalIndex = part.indexOf("=");
      if (equalIndex > -1) {
        const key = part.substring(2, equalIndex);
        const value = part.substring(equalIndex + 1);
        flags[key] = value;
      } else {
        flags[part.substring(2)] = true;
      }
    } else if (part.startsWith("-") && part.length > 1) {
       flags[part.substring(1)] = true;
    } else {
      args.push(part);
    }
  }

  return { command, args, flags };
}
