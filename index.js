#!/usr/bin/env node
const version  = process.env.npm_package_version;
const stp      = require('saltthepass');
const prompt   = require('prompt');
const getopt   = require('node-getopt-long');
const readline = require('readline');

const hashes = stp.getHashes();

const helpPrefix =`

Generate unique, secure passwords for all of the websites you visit based on a single Master Password that you remember.

Usage

Start in interactive mode:

    $ saltpass

You will be prompted for your Master Password, Domain Name, Domain Phrase, and algorithm of choice.

Start in interactive mode, but with a specific algorithm (you won't be prompted for this):

    $ saltpass -a sha2

Advanced users: pipe in your master password followed by domain names and phrases (tab separated, one per line) you want to use:

    $ cat tempfile
    some unguessable phrase
    example.com     myname
    example.net
    example.org     myfullname
    ^D
    $ saltpass < tempfile

`;

const options = getopt.options([
  [ 'algorithm|a=s',      { description: `The hashing algorithm to use. One of ${hashes.join(', ')}.`, test: hashes } ],
  [ 'domain-name|n=s',    { description: "The Domain Name should match the website you're generating a password for." } ],
  [ 'domain-phrase|p=s',  { description: "The Domain Phrase is an optional field that can be used to differentiate multiple passwords on the same website." } ],
  [ 'keep|k!',            { description: "This flag determines whether to continue to prompt for more passwords once the first has been returned." } ],
  [ 'nul-separator|0!',   { description: 'This flag determines whether to output passwords null-separated. For use in scripting.' } ],
], {
  name           : 'saltpass',
  commandVersion : version,
  helpPrefix     : helpPrefix,
  helpSuffix: [
    "This programme uses Nic Jansma's SaltThePass approach ( https://saltthepass.com/ ) and library. It depends on you remembering a single Master Password that you keep safe and only use on SaltThePass. Ideally, you should never disclose it to anyone else, or even write it down. The Master Password, Domain Name and (optionally) the Domain Phrase are combined and hashed to generate a different Salted Password for each website you visit.",
    "This programme, like SaltThePass is licensed under the MIT License."
  ].join("\n")
});

if (process.stdin.isTTY) {
  // We are running in interactive mode - give the user prompts.
  prompt.colors  = false;
  prompt.message = '';

  const schema = {
    properties: {
      masterPass: {
        hidden      : true,
        message     : 'Master Password cannot be empty',
        description : 'Master Password',
        required    : true,
        conform     : response => (response.length > 0),
      },
      domainName: {
        hidden      : false,
        description : 'Domain Name',
        message     : 'Domain Name cannot be empty',
        required    : true,
        conform     : response => (response.length > 0),
      },
      domainPhrase: {
        hidden      : true,
        description : 'Domain Phrase'
      },
      algorithm: {
        hidden      : false,
        message     : 'Algorithm must be one of ' + hashes.join(', '),
        description : 'Algorithm',
        default     : 'sha3',
        conform     : response => (hashes.indexOf(response.toLowerCase()) > -1),
      }
    }
  };

  const repeatSchema = {
    properties: {
      domainName   : schema.properties.domainName,
      domainPhrase : schema.properties.domainPhrase,
      algorithm    : schema.properties.algorithm
    }
  };

  if (options['domain-name']) {
    delete schema.properties.domainName;
    delete schema.properties.domainPhrase;

    if (options['keep']) {
      process.stderr.write('Option --keep not compatible with --domain-name\n');
      process.exit(1);
    }
  } else if (options['domain-phrase']) {
    process.stderr.write('Option --domain-phrase not sensible without --domain-name\n');
    process.exit(1);
  }

  if (options['algorithm']) {
    delete schema.properties.algorithm;
    delete repeatSchema.properties.algorithm;
  }

  let cachedMasterPass;

  const handleResult = (err, result) => {
    if (err) {
      process.stdout.write(err + '\n');
    } else {
      cachedMasterPass = result.masterPass || cachedMasterPass;

      const domainName = result.domainName || options['domain-name'] || '';
      const saltedPass = stp.saltthepass(
        result.algorithm || options['algorithm'],
        cachedMasterPass,
        domainName,
        result.domainPhrase || options['domain-phrase'] || ''
      );

      process.stdout.write(`Your password for '${domainName}' is:\n  ${saltedPass}\n`);
    }

    if (options['keep']) {
      prompt.get(repeatSchema, handleResult);
    }
  }

  prompt.start();

  prompt.get(schema, handleResult);
} else {
  const algorithm = options.algorithm || 'sha3';
  const rl        = readline.createInterface({
    input: process.stdin,
  });

  let masterPass;

  rl.on('line', (line) => {
    if (!masterPass) {
      masterPass = line;
    } else if (options['domain-name']) {
      process.stderr.write('domain-name option cannot be used with domain names piped in from STDIN\n');
      process.exit(1);
    } else if (line.length > 0) {
      const columns      = line.split('\t');
      const domainName   = columns[0] || '';
      const domainPhrase = columns[1] || '';
      const saltedPass   = stp.saltthepass(
        algorithm,
        masterPass,
        domainName,
        domainPhrase
      );

      const output = [ saltedPass, domainName, domainPhrase ];

      if (options['nul-separator']) {
        process.stdout.write(output.join('\0') + '\0');
      } else {
        process.stdout.write(output.join('\t') + '\n');
      }
    }
  });
}
