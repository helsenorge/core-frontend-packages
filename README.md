# Helsenorge Core Frontend

This is the repository for Helsenorge core packages. More details are found in the README for each package. 

The code in this repository is maintained in a private Git repository also containing code we have not yet open sourced. We use [Gitexporter](https://github.com/open-condo-software/gitexporter) to create the open source repository with only the code for NPM packages used in our other public repositories ([Refero](https://github.com/helsenorge/refero) and [Structor](https://github.com/helsenorge/structor)). 

The private Git repository is a monorepo containing other NPM packages, web pages and micro frontends for helsenorge.no. It uses NPM workspaces and Lerna for easier installation of dependencies, building and testing. Since the setup will not work without all the code from the monorepo, this is not included in the public repository. Therefore each package has to be built and tested separately for now.

## Questions

Questions about the code or project can be askes at [ROX Slack channel](https://norskhelsenett.slack.com/archives/CS70UT0R0) or as issues on GitHub.

## Internal documentation

https://confluence.atlassian.nhn.no/display/HR2/@helsenorge+NPM+pakker

## Setup - Backend

1. Følg [how-to for oppsett av kubernetes](https://confluence.atlassian.nhn.no/display/HR2/HOW-TO:+Kubernetes+Lokalt)
2. Følg [how-to for installasjon av hncli](https://confluence.atlassian.nhn.no/display/HR2/HNCli+-+Lokal+installasjon)
3. Deploy tjenesten til kubernetes
    ```powershell
    devspace deploy
    # Nås nå på
    # - http://corefrontend-internalapi.localtest.me:30080
    # - http://corefrontend-externalapi.localtest.me:30080
    ```
4. Konfigurer
    ```powershell
    dotnet-hncli dev config deploy --env-config dev-mot-k8s
    ```
5. Du kan nå enten
    - A) Kjør hele løsningsområdet inni kubernetes basert på lokalt bygd image
        ```powershell
        # Dette innbærer for alle komponenter
        # - Docker image for hele løsningsområdet bygges lokalt
        # - Kubernetes podens image byttes ut med lokalt image for hele løsningsområdet
        devspace dev
        ```
    - B) Kjør utvalgte komponenter inni kubernetes basert på lokalt bygd image
        ```powershell
        # Dette innbærer bare for valgt komponent
        # - Docker image for internalapi bygges lokalt
        # - Kubernetes podens image byttes ut med lokalt image bare for internalapi
        # - Det vil bli kjørt devspace deploy av de andre komponentene i løsningsområdet
        devspace dev "internalapi"
        # For å kjøre devspace dev av flere enkelt komponenter så kan man separere med mellomrom som under
        devspace dev "internalapi externalapi"
        ```
    - C) Kjør api på din lokale maskin, configurert mot kubernetes resurser, med riktig launch-profile. Evt F5 i Visual Studio.
        ```powershell
        dotnet watch run --launch-profile InternalApi --project .\Source\InternalApi\
        dotnet watch run --launch-profile ExternalApi --project .\Source\ExternalApi\
        ```

## Setup - Frontend

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
    -x react \
    -x react-dom \
    -x react-router \
    -x @types/react \
    -x @types/react-dom \
    -x @types/node \
    -x conventional-changelog-cli
```

## Documentation

Create a `{componentname}.stories.tsx` file in the same folder where the component code is.

Run Storybook locally to develop your component:

```
cd npm/packages/storybook
npm run start
```

Build using docker:

```bash
docker build -f documentation.Dockerfile --build-arg PAT=$env:HNDEV_PAT -t helsenorge/frontenddocs/static .
docker run -p 8080:8080 --rm -it --name helsenorge-frontenddocs-static helsenorge/frontenddocs/static
```

Available sites:

- http://localhost:8080/cmstest/
- http://localhost:8080/documentation/
- http://localhost:8080/tjenestertest/

## Playwright tests

```bash
cd web # Or other folder with Playwright tests
# Only necessary the first time
npx playwright install
# Run tests
npx playwright test
# or use the UI
npx playwright test --ui
```