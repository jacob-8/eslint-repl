import type { FileSystemTree } from "@webcontainer/api";

export function convertToFileSystemTree(files: Record<string, string>): FileSystemTree {
  const tree: FileSystemTree = {};
  for (const [path, content] of Object.entries(files)) {
    const pathParts = path.split("/");
    let current = tree;
    for (const part of pathParts) {
      if (part === pathParts[pathParts.length - 1]) {
        current[part] = { file: { contents: content }};
      }
    }
  }
  console.log({files, tree})
  return tree;
}