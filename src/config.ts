import * as vscode from 'vscode';
import type { WorkspaceConfiguration, WorkspaceFolder } from 'vscode'

export const extensionId = 'vboy';

export function getConfigValue<T>(
  rootConfig: WorkspaceConfiguration,
  folderConfig: WorkspaceConfiguration,
  key: string,
  defaultValue: T,
): T {
  return folderConfig.get(key) ?? rootConfig.get(key) ?? defaultValue
}

export function getConfig(workspaceFolder?: WorkspaceFolder | vscode.Uri | string) {
  let workspace: WorkspaceFolder | vscode.Uri | undefined
  if (typeof workspaceFolder === 'string')
    workspace = vscode.Uri.from({ scheme: 'file', path: workspaceFolder })
  else
    workspace = workspaceFolder

  const folderConfig = vscode.workspace.getConfiguration('vboy', workspace)
  const rootConfig = vscode.workspace.getConfiguration('vboy')

  const get = <T>(key: string, defaultValue: T) => getConfigValue<T>(rootConfig, folderConfig, key, defaultValue)

  return {
    // env: get<null | Record<string, string>>('nodeEnv', null),
    // commandLine: get<string | undefined>('commandLine', undefined),
    // include: get<string[]>('include', []),
    // exclude: get<string[]>('exclude', []),
    // enable: get<boolean>('enable', false),
    configPath: get<string>('configPath', './vitest.config.ts')

  }
}