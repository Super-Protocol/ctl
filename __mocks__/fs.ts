import path from 'path';
const fs: any = jest.createMockFromModule('fs');

// This is a custom function that our tests can use during setup to specify
// what the files on the "mock" filesystem should look like when any of the
// `fs` APIs are used.
let mockFiles: { [dir: string]: { [file: string]: string } } = Object.create(null);

function __setMockFiles(newMockFiles: { [path: string]: string; }) {
    mockFiles = Object.create(null);
    for (const file in newMockFiles) {
        addMockFile(file, newMockFiles[file]);
    }
}

function addMockFile(filePath: string, data: string) {
    const dir = path.dirname(filePath);

    if (!mockFiles[dir]) {
        mockFiles[dir] = {};
    }
    mockFiles[dir][path.basename(filePath)] = data;
}

async function writeFile(filePath: string, data: string) {
    addMockFile(filePath, data);
}

async function readFile(filePath: string) {
    const dir = path.dirname(filePath);
    const file = path.basename(filePath);

    return mockFiles[dir][file];
}

const fsPromises = {
    readFile,
    writeFile,
    unlink: jest.fn(),
};

fs.__setMockFiles = __setMockFiles;
fs.promises = fsPromises;

module.exports = fs;