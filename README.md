# flytectl-setup-action
Install and setup [flytectl](https://github.com/flyteorg/flytectl) for use in other actions

## Usage

Refer to the [action.yml](https://github.com/unionai/flytectl-setup-action/blob/master/action.yml)
to see all of the action parameters.

```yaml
steps:
  - uses: actions/checkout@v2
  - uses: unionai/flytectl-setup-action@v0.0.1
    with:
      version: '0.1.8' # The version of flytectl to download and use.
  - run: flytectl --help
```

