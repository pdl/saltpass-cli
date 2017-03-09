#!/usr/bin/env node
var version  = process.env.npm_package_version;
var stp      = require('saltthepass');
var prompt   = require('prompt');
var getopt   = require('node-getopt-long');
var readline = require('readline');

var hashes = stp.getHashes();

var options = getopt.options([
  [ 'algorithm|a=s',      { description: 'The hashing algorithm to use. One of ' + hashes.join(', '), test: hashes } ],
  [ 'domain-name|n=s',    { description: "The Domain Name should match the website you're generating a password for." } ],
  [ 'domain-phrase|p=s',  { description: "The Domain Phrase is an optional field that can be used to differentiate multiple passwords on the same website." } ],
  [ 'nul-separator|0!',   { description: 'This flag determines whether to output passwords null-separated. For use in scripting.' } ],
], {
  'name' : 'saltpass',
  'commandVersion' : version,
  'helpPrefix' : [
    "",
    "",
    "Generate unique, secure passwords for all of the websites you visit based on a single Master Password that you remember.",
    "",
    "Usage",
    "",
    "Start in interactive mode:",
    "",
    "    $ saltpass",
    "",
    "You will be prompted for your Master Password, Domain Name, Domain Phrase, and algorithm of choice.",
    "",
    "Start in interactive mode, but with a specific algorithm (you won't be prompted for this):",
    "",
    "    $ saltpass -a sha2",
    "",
    "Advanced users: pipe in your master password followed by domain names and phrases (tab separated, one per line) you want to use:",
    "",
    "    $ cat tempfile",
    "    some unguessable phrase",
    "    example.com     myname",
    "    example.net",
    "    example.org     myfullname",
    "    ^D",
    "    $ saltpass < tempfile",
    "",
    "",
  ].join("\n"),
  'helpSuffix' : [
    "This programme uses Nic Jansma's SaltThePass approach ( https://saltthepass.com/ ) and library. It depends on you remembering a single Master Password that you keep safe and only use on SaltThePass. Ideally, you should never disclose it to anyone else, or even write it down. The Master Password, Domain Name and (optionally) the Domain Phrase are combined and hashed to generate a different Salted Password for each website you visit.",
    "This programme, like SaltThePass is licensed under the MIT License."
  ].join("\n")
});

if (process.stdin.isTTY) {
  // We are running in interactive mode - give the user prompts.
  prompt.colors  = false;
  prompt.message = '';
  
  var schema = {
    properties: {
      masterPass: {
        hidden: true,
        message: 'Master Password cannot be empty',
        description: 'Master Password',
        required: true,
        conform: function(response) {
          return response.length > 0;
        }
      },
      domainName: {
        hidden: false,
        description: 'Domain Name',
        message: 'Domain Name cannot be empty',
        required: true,
        conform: function(response) {
          return response.length > 0;
        }
      },
      domainPhrase: {
        hidden: true,
        description: 'Domain Phrase'
      },
      algorithm: {
        hidden: false,
        message: 'Algorithm must be one of ' + hashes.join(', '),
        description: 'Algorithm',
        'default': 'sha3',
        conform: function(response) {
          var lc = response.toLowerCase();
          return hashes.indexOf(lc) > -1;
        }
      }
    }
  };
  
  if (options['domain-name']) {
    delete schema.properties.domainName;
    delete schema.properties.domainPhrase;
  } else if (options['domain-phrase']){
    console.warn('Option --domain-phrase not sensible without --domain-name');
    process.exit(1);
  }
  if (options['algorithm']) {
    delete schema.properties.algorithm;
  }
  
  prompt.start();
  
  prompt.get(schema, function (err, result) {
    if (err) {
      console.warn(err);
    } else {
      console.log("Your password for '" + ( result.domainName || options['domain-name']) + "' is:");
      console.log(
        "  ",
        stp.saltthepass(
          result.algorithm || options['algorithm'],
          result.masterPass,
          result.domainName || options['domain-name'] || '',
          result.domainPhrase || options['domain-phrase'] || ''
        )
      );
    }
  });
} else {
  var masterPass;
  var algorithm = options.algorithm || 'sha3';
  var rl        = readline.createInterface({
    input: process.stdin,
  });
  
  rl.on('line', function(line){
    if (!masterPass) {
      masterPass = line;
    } else if ( options['domain-name'] ) {
      console.warn('domain-name option cannot be used with domain names piped in from STDIN')
      process.exit(1);
    } else if (line.length > 0) {
      var columns      = line.split('\t');
      var domainName   = columns[0] || '';
      var domainPhrase = columns[1] || '';
      var saltedPass   = stp.saltthepass(
        algorithm,
        masterPass,
        domainName,
        domainPhrase
      );
      var output = [saltedPass, domainName, domainPhrase];
      if (options['nul-separator']){
        process.stdout.write(output.join('\0') + '\0');
      } else {
        console.log(output.join('\t'));
      }
    }
  })
}
