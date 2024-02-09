# Super Protocol Publisher CLI
A tool for publishing values in a secure and reliable way.

## Setup
1. Follow instructions to setup Decentralized Cloud Storage providers: [StorJ](https://github.com/storj-thirdparty/uplink-nodejs)
2. Install dependencies:

    ```
    npm i
    ```
3. Run help in dev mode to see available commands:

    ```
    npm run dev help
    ```

## Building
`upload` and `download` commands supported only on MacOS and Linux and requires to make build on the same system as the target platform
### Linux
#### Build in docker (recommended):
```
cd linux_builder && ./build.sh && cd ..
```
Can be run on any os with Docker support.</br>
Result will be saved at `./dist/spctl-linux`
#### Build on native os:
```
npm run build
```
IMPORTANT: to make `upload` and `download` commands works correctly, requires to make this build on Linux only</br>
Result will be saved at `./dist/spctl`

### MacOS
```
npm run build
```
IMPORTANT: to make `upload` and `download` commands works correctly, requires to make this build on MacOS only</br>
Result will be saved at `./dist/spctl`

## Develop and Release

Before making a release, please decide what version tag this release should have - major, minor or patch. Then create a new `release/vX.X.X` branch with new version. Then run one of the next commands: `npm run patch:beta` or `npm run minor:beta` or `npm run major:beta`. This command will make commit, create new tag and push all of this to remote.
Then you need to make PR to master and merge it with `Rebase and Merge` after approve. Then go the Releases Page and create new release with the name as new tag.

## Commands
`npm run build:prepare` – compiles typescript with tcs.</br>
`npm run build` - builds a binary file (target will be autodetected)</br>
`npm run build:win:x64` - builds a binary file for Windows with arch x64</br>
`npm run build:win:arm64` - builds a binary file for Windows with arch arm64</br>
`npm run build:linux:x64` – builds a binary file for Linux with arch x64</br>
`npm run build:linux:arm64` – builds a binary file for Linux with arch arm64</br>
`npm run build:macos:x64` – builds a macos binary file for MacOS with arch x64</br>
`npm run build:macos:arm64` – builds a macos binary file for MacOS with arch arm64</br>
`npm run dev -- [command]` – runs command in dev mode</br>
`npm run prettier` – runs code auto formatting

## Dependencies
- NodeJS v17.4.0
- NPM v8.3.1
