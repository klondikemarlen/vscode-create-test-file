import * as vscode from 'vscode';
import * as path from 'path';
import { ExtensionConfiguration } from './extensionConfiguration';

export function createTestFile(srcUri: vscode.Uri): Thenable<vscode.Uri> {
    return inferTestUri(srcUri).then(uri => {
        let we = new vscode.WorkspaceEdit();
        we.createFile(uri, { overwrite: false });
        return vscode.workspace.applyEdit(we).then((success) => {
            if (success) {
                let relPath = vscode.workspace.asRelativePath(uri);
                vscode.window.showInformationMessage(`Created ${relPath}`);
            }
            return uri;
        });
    });
}

export function findTestFile(srcUri: vscode.Uri): Thenable<vscode.TextDocument> {
    return inferTestUri(srcUri).then(uri => {
        return vscode.workspace.openTextDocument(uri);
    });
}

export function testPath(srcPath: string,
                         nameTemplate: string,
                         pathMap?: PathMap): string {
    let directory = path.dirname(srcPath);
    if (typeof pathMap !== 'undefined') {
        directory = destPath(directory, pathMap);
    }

    const extension = path.extname(srcPath);
    const filename = path.basename(srcPath, extension);
    let testBasename = nameTemplate.replace('{filename}', filename);

    const extensionWithoutDot = extension.slice(1);
    testBasename = testBasename.replace('{extension}', extensionWithoutDot);

    return path.posix.join(directory, testBasename);
}

function inferTestUri(srcUri: vscode.Uri): Thenable<vscode.Uri> {
    return getExtensionSettings(srcUri).then((settings: ExtensionConfiguration) => {
        const nameTemplate = settings.get('nameTemplate');

        const absolutePath = srcUri.path;
        const relativePath = vscode.workspace.asRelativePath(absolutePath);
        const replaceLastMatchPattern = new RegExp(relativePath + '$');
        const workspaceRootPath = absolutePath.replace(replaceLastMatchPattern, '');

        const pathMapper = matchingPathMap(relativePath, settings);
        const replacedPath = testPath(relativePath, nameTemplate, pathMapper);

        const path = workspaceRootPath + replacedPath;
        return srcUri.with({ path });
    });
}

interface PathMap {
    pathPattern: string;
    testFilePathPattern: string;
}

function destPath(srcPath: string, pathMap: PathMap): string {
    const matcher = new RegExp(pathMap.pathPattern);
    const match = srcPath.match(matcher);
    if (!match) {
        throw new Error('pathMap does not match provided path');
    }

    const destPattern = pathMap.testFilePathPattern;
    return srcPath.replace(matcher, destPattern);
}

function matchingPathMap(srcPath: string, settings: ExtensionConfiguration): PathMap | undefined {
    let pathMaps = settings.get('pathMaps') as Array<PathMap>;
    for (let pathMap of pathMaps) {
        let matcher = new RegExp(pathMap.pathPattern);
        if (srcPath.match(matcher)) {
            return pathMap;
        }
    }
    return undefined;
}

function getExtensionSettings(srcUri: vscode.Uri): Thenable<ExtensionConfiguration> {
    return vscode.workspace.openTextDocument(srcUri).then((doc: vscode.TextDocument) => {
        let docLang = doc.languageId;
        let langSettings =  vscode.workspace.getConfiguration('createTestFile.languages');
        let langMatcher = new RegExp(`\\[${docLang}\\]`);
        let docLangKey = Object.keys(langSettings).find((key: string) => key.match(langMatcher));
        let langConfig = {};
        if (docLangKey) {
            langConfig = langSettings[docLangKey];
        }
        let generalConfig = vscode.workspace.getConfiguration('createTestFile');
        return new ExtensionConfiguration(langConfig, generalConfig);
    });
}
