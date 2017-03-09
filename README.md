# saltpass

Generate unique, secure passwords for all of the websites you visit based on a single Master Password that you remember.

## Usage

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

## Options

    -a --algorithm[=]string

      The hashing algorithm to use. Defaults to sha3.

    -n --domain-name[=]string

      The Domain Name should match the website you're generating a password for.

    -p --domain-phrase[=]string

      The Domain Phrase is an optional field that can be used to differentiate multiple passwords on the same website.

    -0 --nul-separator

      This flag determines whether to output passwords null-separated. For use in scripting.

     --help

       Show options

     --version

       Show the version of this command

This programme uses Nic Jansma's SaltThePass approach ( https://saltthepass.com/ ) and library. It depends on you remembering a single Master Password that you keep safe and only use for SaltThePass. Ideally, you should never disclose it to anyone else, or even write it down. The Master Password, Domain Name and (optionally) the Domain Phrase are combined and hashed to generate a different Salted Password for each website you visit. 

This programme, like SaltThePass is licensed under the MIT License. See the LICENSE file for more information.

