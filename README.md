# VSCode Create Test File Extension

** This is a fork of https://github.com/paul-mannino/vscode-create-test-file **

This is an extension that adds a command for creating a test file, with a given name and path inferred from a currently open file (or one selected file from the sidebar).

For example, if your application code lives under the `app` directory in your workspace and your test code lives under the `spec` folder, you can define rules such that for any file `app/foo/bar/filename.rb`, you will create or open a file with `spec/foo/bar/filename_spec.rb`. These settings can be customized for each filetype, and you may create multiple
path mappers if you have multiple conventions for where you create tests.

## Features

Full path mutation support via JS regex replace.
Given an absolute path, a path pattern and a test file pattern, you get `absolutePath.replace(pathPattern, testFilePattern)`; anything you can write via https://regex101.com/ will work.

If you want workspace specific behavior, this is built in to VSCode itself. You can activate this feature by editing appropriate settings in the project relative `./.vscode/settings.json` file.

## Extension Settings

For pattern replacement conventions see [Specifying a string as the replacement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#specifying_a_string_as_the_replacement)

```javascript -- instead of json to support comments
// Basic settings
"createTestFile.nameTemplate": "{filename}_spec", // If file is named foo.bar, will create test named foo_spec.bar
"createTestFile.languages": {
    "[javascript]": {
        "createTestFile.nameTemplate": "{filename}.test" // For javascript, if file is foo.js, will create foo.test.js
    }
},
// NOTE: Only the first rule to match the file path will be used!
// Rules will be searched in the order they are defined.
"createTestFile.pathMaps": [
    {
        // Defines rule such that any file under app/ will have a test file created under spec/
        "pathPattern": "app/?(.*)?", // Regex file path matcher
        "testFilePathPattern": "spec/$1" // $1, $2, etc. will be replaced with the matching text from the pathPattern
    }
]
```

## Known Issues

While path replacement has full regex support, filename replacement **does not** support full regex replacement.

## Release Notes

See [CHANGELOG](./CHANGELOG.md)

## Development

Generally you would run the project via F5 in VSCode.

Alternatively, see package.json -> scripts other commands.
- npm run test

### File Access in Tests

The test config opens the app with `./out/tmp/example-workspace/` as the default workspace.
File manipulation tests can be performed in this folder. The directory is copied from the project `./src/test/example-workspace` directory as part of the `npm run test` command.

FUTURE: investigate continuous integration and headless testing https://code.visualstudio.com/api/working-with-extensions/continuous-integration#azure-pipelines

### Publishing

See https://code.visualstudio.com/api/working-with-extensions/publishing-extension for full details. The following is a quick refresher:

1. (as needed) `npm install -g @vscode/vsce`
2. `vsce package`
3. `vsce publish`

> You might need to periodically refresh your azure dev ops api key.

Published to https://marketplace.visualstudio.com/items?itemName=klondikemarlen.create-test-file
