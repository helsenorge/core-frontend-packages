# Helsenorge Core Frontend

This is the repository for Helsenorge core packages. More details are found in the README for each package. 

The code in this repository is maintained in a private Git repository also containing code we have not yet open sourced. We use [Gitexporter](https://github.com/open-condo-software/gitexporter) to create the open source repository with only the code for NPM packages used in our other public repositories ([Refero](https://github.com/helsenorge/refero) and [Structor](https://github.com/helsenorge/structor)). 

The private Git repository is a monorepo containing other NPM packages, web pages and micro frontends for helsenorge.no. It uses NPM workspaces and Lerna for easier installation of dependencies, building and testing. Since the setup will not work without all the code from the monorepo, this is not included in the public repository. Therefore each package has to be built and tested separately for now.

## Questions

Questions about the code or project can be askes at [ROX Slack channel](https://norskhelsenett.slack.com/archives/CS70UT0R0) or as issues on GitHub.

## Internal documentation

https://confluence.atlassian.nhn.no/display/HR2/@helsenorge+NPM+pakker


## Setup

For developing locally you should follow these steps:

### First time

1. Clone the repository
2. Run ```npm i```in root folder
3. Run ```npm run build``` in build folder
    - To build what is needed for a specific package you can run ```npm run build -- --scope=@helsenorge/core-framework``` in root folder
4. Run the specific package you are going to work on inside the package. Check the specific run scripts for each package.


### Common errors

- Missing packages when building/running a package:
    - Run ```npm run build```in root folder to make sure that all the packages are existing

- Other npm errors and troubles:
    - Delete all node_modules and package-lock.json and try reinstalling all packages.
        - ```npm i``` and ```npm run build``` in root

## Development chores

## Updating dependencies

```bash
npm i -g npm-check-updates
ncu -u \
    --deep \
    -x typescript \
    -x esbuild \
    -x react \
    -x react-dom \
    -x react-router-dom \
    -x @types/react \
    -x @types/react-dom \
    -x @types/node \
    -x bootstrap \
    -x conventional-changelog-cli
```