export type Stub = FileStub | DirectoryStub

export interface FileStub {
  name: string; // path
  basename: string; // filename
  contents: string;
  text: boolean;
}

export interface DirectoryStub {
  type: 'directory';
  name: string;
  basename: string;
}