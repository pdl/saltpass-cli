# saltpass

Generate unique, secure passwords for all of the websites you visit based on a single Master Password that you remember.

## Options

    -a --algorithm[=]string
    
      The hashing algorithm to use. One of md5, sha1, sha2, sha3, ripemd160
    
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

This programme, like SaltThePass is licensed under the MIT License.

