#! /usr/bin/env node

import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import { pseudoLocalizeString } from '../localize.ts';

yargs(hideBin(process.argv))
  .usage(
    '$0 <string> [options]',
    'Pseudo localize a string',
    (yargs) => {
      return yargs
        .positional('string', {
          describe: 'String to pseudo-localize',
          type: 'string',
          demandOption: true,
        })
        .option('strategy', {
          alias: 's',
          type: 'string',
          describe: 'Set the strategy for localization',
          choices: ['accented', 'bidi'] as const,
          default: 'accented' as const,
        });
    },
    ({ string, strategy }) => {
      process.stdout.write(pseudoLocalizeString(string, { strategy }));
    }
  )
  .help()
  .parse();
