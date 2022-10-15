import * as vscode from 'vscode';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { capitalizeFirstLetter, replaceDoubleSlashes } from './utils';

function windowPath(casePath: string) {
    const isWindow = process.platform === 'win32';
    const filePath = isWindow ? replaceDoubleSlashes(capitalizeFirstLetter(casePath)) : casePath;
    const dirname = path.dirname(filePath);
    return { 
        filePath, dirname
    }
}

function buildVitestArgs( path:string, name: string) {
    const wsPath = fileURLToPath(vscode.workspace.workspaceFolders?.[0]?.uri?.toString() || '');
    const { filePath: workspacePath } = windowPath(wsPath);
    // console.log('your path', path, name, wsPath, workspacePath);
    return ['vitest', 'run', '-r', workspacePath ,  path, '-t', name];
}

export function runInTerminal(name: string, casePath: string) {
    const { filePath } = windowPath(casePath);
    const vitestArgs = buildVitestArgs(filePath, name);
    const npxArgs = ['npx', ...vitestArgs];
    const terminal = vscode.window.activeTerminal || vscode.window.createTerminal(`vitest - ${name}`);
    terminal.show();
    terminal.sendText(npxArgs.join(' '), true);
    terminal.show();
    new vscode.ProcessExecution(`pnpm --help`)
    new vscode.ShellExecution(`nx --help`)
}

export function debugInTermial(name: string, casePath: string) {
    const { filePath } = windowPath(casePath);
    const config = {
        name: 'Debug vitest case',
        request: 'launch',
        runtimeArgs: buildVitestArgs(filePath, name),
        cwd: path.dirname(filePath),
        runtimeExecutable: 'npx',
        skipFiles: ['<node_internals>/**'],
        type: 'pwa-node',
        console: 'integratedTerminal',
        internalConsoleOptions: 'neverOpen'
    } as vscode.DebugConfiguration;
    vscode.debug.startDebugging(undefined, config);
}
