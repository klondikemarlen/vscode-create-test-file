# VSCode Create Test File Extension

** This is a fork of https://github.com/paul-mannino/vscode-create-test-file **

This is an extension that adds a command for create a test file with a name and path inferred from a currently
open file (or one selected file from the sidebar).

For example, if your application code lives under the `app` directory in your workspace and your test code lives under
the `spec` folder, you can define rules such that for any file `app/foo/bar/filename.rb`, you will create or open a file
with `spec/foo/bar/filename_spec.rb`. These settings can be customized for each filetype, and you may create multiple
path mappers if you have multiple conventions for where you create tests.

## Configuration

```javascript
// Basic settings
"createTestFile.nameTemplate": "{filename}_spec", // If file is named foo.bar, will create test named foo_spec.bar
"createTestFile.languages": {
    "[javascript]": {
        "createTestFile.nameTemplate": "{filename}.test" // For javascript, if file is foo.js, will create foo.test.js
    }
},
"createTestFile.pathMaps": [
    {
        // Defines rule such that any file under app/ will have a test file created under spec/
        // Rules will be applied in the order they are defined. The first rule to match the file path will be used.
        "pathPattern": "app(/.*)?", // Regex file path matcher
        "testFilePath": "spec$1" // $1, $2, etc. will be replaced with the matching text from the pathPattern
    }
]
```

Template below this line
-----------------------------
# vscode-create-test-file README

This is the README for your extension "vscode-create-test-file". After writing up a brief description, we recommend including the following sections.

## Features

Describe specific features of your extension including screenshots of your extension in action. Image paths are relative to this README file.

For example if there is an image subfolder under your extension project workspace:

\!\[feature X\]\(images/feature-x.png\)

> Tip: Many popular extensions utilize animations. This is an excellent way to show off your extension! We recommend short, focused animations that are easy to follow.

## Requirements

If you have any requirements or dependencies, add a section describing those and how to install and configure them.

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `myExtension.enable`: Enable/disable this extension.
* `myExtension.thing`: Set to `blah` to do something.

## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Initial release of ...

### 1.0.1

Fixed issue #.

### 1.1.0

Added features X, Y, and Z.

---

## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Working with Markdown

You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux).
* Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux).
* Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets.

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
