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
    let ext = path.extname(srcPath);
    let file = path.basename(srcPath, ext);
    let dir = path.dirname(srcPath);
    if (typeof pathMap !== 'undefined') {
        dir = destPath(dir, pathMap);
    }
    let testBasename = nameTemplate.replace('{filename}', file) + ext;
    return path.posix.join(dir, testBasename);
}

function inferTestUri(srcUri: vscode.Uri): Thenable<vscode.Uri> {
    const absolutePath = srcUri.path;
    return getExtensionSettings(srcUri).then((settings: ExtensionConfiguration) => {
        const nameTemplate = settings.get('nameTemplate');
        const pathMapper = matchingPathMap(absolutePath, settings);
        return srcUri.with({ path: testPath(absolutePath, nameTemplate, pathMapper) });
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
