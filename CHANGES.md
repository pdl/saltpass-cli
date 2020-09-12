# 0.3.0

Fixes

- Fixed an issue where global installs would fail depending on the version of saltthepass

Security

- Upgraded dependencies with reported vulnerabilities.

# 0.2.1

Security release

- Upgraded eslint dev dependency as previous version relied on versions of eslint-utils and lodash
  which had reported vulnerabilities.

# 0.2.0

Feature release: `--keep`

- Can generate multiple passwords interactively without re-entering master using `--keep` option

# 0.1.0

First release

- Can enter master password interactively or as option
- Can enter domain phrase interactively or as option
- Can choose algorithm interactively or as option
- Can pipe in a file to generate passwords in bulk
