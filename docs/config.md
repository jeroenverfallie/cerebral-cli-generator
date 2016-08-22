# .cerebralrc

The generator will search for a .cerebralrc file from the file all the way up your filesystem, and finally in your home directory.
If found, it will overwrite any cli flags or editor options.

The file can be in either json or cson. Important: if you choose cson, the extension is required. (so .cerebralrc.cson)

# Generator Config format

> See the default configs [here](https://github.com/jeroenverfallie/cerebral-cli-generator/tree/master/docs/defaultConfigs) .

The generator has quite a few config options, let's go over them.

## generator.style

### generator.style.imports

#### - semiColon (`boolean` - default: `true`)

If enabled, it will add a semicolon to the end of the import statements.

#### - sortAll (`boolean` - default: `true`)

If enabled, the generator will manage existing imports too.<br>
If disabled, only generated imports will be managed (sorted).

#### - sortBy (`type, appearance` - default: `type`)

If by type, your imports will be grouped per type ("actions", "factories", ...). If by appearance, this will not happen. Instead they'll be sorted in the order they occur.

#### - separateGroups (`all, local, none` - default: `all`)

This will add an empty line between groups. If local, it will only place a spacing between local imports and packages ones.

### generator.style.indentation (`string`, default: `<4 spaces>`)

The indentation used in generated files.

### generator.style.indentationPrefersEditorConfig (`boolean`, default: `true`)

Let the .editorconfig override the indentation.

## generator.specialImports (`boolean or array`)

Defaults to the cerebral/operators.

### - As an array:

Either an object with a one-to-one mapping:

```javascript
{
    specialAction: 'common/utils/actions/specialAction'
}
```

Or an object with `keys` and `importPath`.

```javascript
{
    keys: ['set', 'unset', 'toggle'],
    importPath: 'cerebral/operators/{KEY}' // {KEY} is being replaced by the generator.
}
```

### - As an object:

Equal to the one-to-one mapping above.

## generator.legacy.signalFiles (`boolean` - default: `false`)

If you want signalFiles, enabled this. Otherwise everything will be a chain.

## generator.templates (`object`)

Requires `chain`, `action`, `chainFactory`, `actionFactory` templates. Optionally requires `signal` template depending on the legacy option.

Take a look at the default templates for what variables you can use.

## generator.paths (`object`)

Mappings of which type should go in which folder.
