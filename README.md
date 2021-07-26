# flytectl-setup-action

This action sets up [flytectl](https://docs.flyte.org/projects/flytectl/en/stable/) for use in actions by:

## Usage

Refer to the [action.yml](https://github.com/unionai/flytectl-setup-action/blob/master/action.yml) to see all of the action parameters.

Install specific version of flytectl
```yaml
steps:
  - uses: actions/checkout@v2
  - uses: unionai/flytectl-setup-action@v0.0.1
    with:
      version: '0.2.21' # The version of flytectl to download and use.
  - run: flytectl --help
```

Install latest version of flytectl
```yaml
steps:
  - uses: actions/checkout@v2
  - uses: unionai/flytectl-setup-action@v0.0.1
  - run: flytectl --help
```

## Getting started Examle
```bash
steps:
  - uses: actions/checkout@v2
  - uses: unionai/flytectl-setup-action@v0.0.1
  - name: Setup sandbox cluster
    run: flytectl sandbox start
  - name: Setup flytectl config
    run: flytectl config init
  - name: Register Core example
    run: |
      FLYTESNACKS_VERSION=$(curl --silent "https://api.github.com/repos/flyteorg/flytectl/releases/latest" | jq -r .tag_name)
      flytectl register files -p flytesnacks -d development --archive https://github.com/flyteorg/flytesnacks/releases/download/$FLYTESNACKS_VERSION/flytesnacks-core.tgz  --version v1
```