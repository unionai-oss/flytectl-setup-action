# flytectl-setup-action

This action sets up [flytectl](https://docs.flyte.org/projects/flytectl/en/stable/) for use in actions.

## Usage

Refer to the [action.yml](https://github.com/unionai/flytectl-setup-action/blob/master/action.yml) to see all of the action parameters.


**Inputs**

Name | Description | Example
--- | --- | ---
version | The version of flytectl to download and use, Default value is latest |  v0.2.20

Install specific version of flytectl
```yaml
steps:
  - uses: actions/checkout@v2
  - uses: unionai-oss/flytectl-setup-action@master
    with:
      version: '0.2.21' # The version of flytectl to download and use.
  - run: flytectl --help
```

Install latest version of flytectl
```yaml
steps:
  - uses: actions/checkout@v2
  - uses: unionai-oss/flytectl-setup-action@master
  - run: flytectl --help
```

## Getting started Example
```bash
name: flytectl-setup-action
on: [push]
jobs:
  install-flytectl:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: unionai-oss/flytectl-setup-action@master
      - name: Setup demo cluster
        run: flytectl demo start
      - name: Setup flytectl config
        run: flytectl config init
  
```
