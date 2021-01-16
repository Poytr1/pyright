import { Dirent, ReadStream, WriteStream } from 'fs-extra';
import { CancellationToken, CompletionList, CompletionParams, MarkupKind, Position } from 'vscode-languageserver';

import { ImportResolver } from './analyzer/importResolver';
import { Program } from './analyzer/program';
import { SourceFile } from './analyzer/sourceFile';
import { ConfigOptions } from './common/configOptions';
import {
    FileSystem,
    FileWatcher,
    FileWatcherEventHandler,
    MkDirOptions,
    Stats,
    TmpfileOptions,
} from './common/fileSystem';

export class SingleFileAnalysis {
    private sourceFile: SourceFile;
    private _program: Program;
    private _dummyFilePath: string;

    constructor(content: string) {
        this._dummyFilePath = 'test.py';
        const fakeFS = new FakeFileSystem(content);
        const configOptions = new ConfigOptions('');
        this.sourceFile = new SourceFile(fakeFS, this._dummyFilePath, '', false, false, undefined, undefined);
        this._program = new Program(new ImportResolver(fakeFS, configOptions), configOptions);
    }

    public async getCompletions(params: CompletionParams): Promise<CompletionList | undefined> {
        const position: Position = {
            line: params.position.line,
            character: params.position.character,
        };
        const completionResult = await this._program.getCompletionsForPosition(
            this._dummyFilePath,
            position,
            '',
            MarkupKind.PlainText,
            undefined,
            undefined,
            CancellationToken.None
        );
        return completionResult?.completionList;
    }
}

class FakeFileSystem implements FileSystem {
    private _content: string;
    constructor(content: string) {
        this._content = content;
    }

    existsSync(path: string): boolean {
        throw new Error('Method not implemented.');
    }
    mkdirSync(path: string, options?: number | MkDirOptions): void {
        throw new Error('Method not implemented.');
    }
    chdir(path: string): void {
        throw new Error('Method not implemented.');
    }
    readdirEntriesSync(path: string): Dirent[] {
        throw new Error('Method not implemented.');
    }
    readdirSync(path: string): string[] {
        throw new Error('Method not implemented.');
    }
    readFileSync(path: string, encoding?: null): Buffer;
    readFileSync(path: string, encoding: BufferEncoding): string;
    readFileSync(path: string, encoding?: BufferEncoding | null): Buffer | string;
    readFileSync(path: string, encoding: BufferEncoding | null = null): string | Buffer {
        return this._content;
    }
    writeFileSync(
        path: string,
        data: string | Buffer,
        encoding:
            | 'ascii'
            | 'utf8'
            | 'utf-8'
            | 'utf16le'
            | 'ucs2'
            | 'ucs-2'
            | 'base64'
            | 'latin1'
            | 'binary'
            | 'hex'
            | null
    ): void {
        throw new Error('Method not implemented.');
    }
    statSync(path: string): Stats {
        throw new Error('Method not implemented.');
    }
    unlinkSync(path: string): void {
        throw new Error('Method not implemented.');
    }
    realpathSync(path: string): string {
        throw new Error('Method not implemented.');
    }
    getModulePath(): string {
        throw new Error('Method not implemented.');
    }
    createFileSystemWatcher(paths: string[], listener: FileWatcherEventHandler): FileWatcher {
        throw new Error('Method not implemented.');
    }
    createReadStream(path: string): ReadStream {
        throw new Error('Method not implemented.');
    }
    createWriteStream(path: string): WriteStream {
        throw new Error('Method not implemented.');
    }
    copyFileSync(src: string, dst: string): void {
        throw new Error('Method not implemented.');
    }
    readFile(path: string): Promise<Buffer> {
        throw new Error('Method not implemented.');
    }
    readFileText(path: string, encoding?: BufferEncoding): Promise<string> {
        throw new Error('Method not implemented.');
    }
    tmpdir(): string {
        throw new Error('Method not implemented.');
    }
    tmpfile(options?: TmpfileOptions): string {
        throw new Error('Method not implemented.');
    }
}
