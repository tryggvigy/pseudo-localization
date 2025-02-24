#! /usr/bin/env node

import { pseudoLocalizeString, type Strategy } from '../localize.ts';

type Args = {
  string: string;
  strategy: 'accented' | 'bidi';
};

function isStrategy(str: string): str is Strategy {
  return ['accented', 'bidi'].includes(str);
}

function parseArgs(argv: string[]): Args {
  const options: Args = {
    string: '',
    strategy: 'accented', // Default strategy
  };

  const args = argv.slice(2); // Skip node and script name
  let i = 0;

  while (i < args.length) {
    const arg = args[i];

    if (arg === '--strategy' || arg === '-s') {
      // Handle the `--strategy` or `-s` flag
      const value = args[i + 1];
      if (!isStrategy(value)) {
        throw new Error(
          `Invalid value for --strategy. Choose 'accented' or 'bidi'.`
        );
      }
      options.strategy = value;
      i += 2; // Skip the flag and its value
    } else if (!arg.startsWith('--') && !arg.startsWith('-')) {
      // Assume it's the positional `string` argument
      if (!options.string) {
        options.string = arg;
      } else {
        throw new Error('Unexpected additional argument: ' + arg);
      }
      i += 1;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (!options.string) {
    throw new Error('The <string> argument is required.');
  }

  return options;
}

function displayHelp() {
  console.log(`
Usage: <script> <string> [options]

Pseudo localize a string

Arguments:
  <string>        String to pseudo-localize

Options:
  --strategy, -s  Set the strategy for localization (choices: 'accented', 'bidi', default: 'accented')
  --help          Show help
`);
}

function main() {
  const argv = process.argv;

  if (argv.includes('--help')) {
    displayHelp();
    process.exit(0);
  }

  try {
    const { string, strategy } = parseArgs(argv);
    process.stdout.write(pseudoLocalizeString(string, { strategy }));
  } catch (error) {
    console.error(error);
    displayHelp();
    process.exit(1);
  }
}

main();
