## Action: Elixir Erlang Version

### Usage:

```yaml
name: Code Quality

on:
  pull_request:
    branches: [master]

permissions:
  contents: read

defaults:
  run:
    shell: bash -leo pipefail {0}


jobs:
  build:
    name: Build and Test
    runs-on: [self-hosted, runner-devops-shared]
    (...)
    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Get Elixir and Erlang versions from .tool-versions
        id: get-versions
        uses: arvore/.github/elixir-erlang-version@main

      - name: Set up Elixir
        id: beam
        uses: erlef/setup-beam@v1
        with:
          elixir-version: ${{ steps.get-versions.outputs.elixir-version }}
          otp-version: ${{ steps.get-versions.outputs.erlang-version }}
      (...)
```
