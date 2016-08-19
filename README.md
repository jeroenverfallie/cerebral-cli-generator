# cerebral-cli-generator

A parser and generator of cerebral logic files, to make your life easier.<br>
Ready for usage in cli's and editor plugins.

## The .cerebralrc format

See detailed docs [here](https://github.com/jeroenverfallie/cerebral-cli-generator/tree/master/docs/config.md).

## The one method API..

### `performOnFile(options)`

Options consist out of these properties:

- `filePath`(required): The file on which to perform the generation of imports.
- `config`(default null): A possible config, starting from the `generator` part of the .cerebralrc, is not required. If passed, it can have `useRcFile` to enable the `.cerebralrc` file usage.
- `write`(default false): Whether to write away the result immediately in the passed filePath.
- `logger`(default noop): A simple object with a `log` method in case you want some output. (barebones)

This will return the new generated content of the passed in file. Use this if write is disabled, for example in an atom plugin to perform `atom.editor.setText(...)`
