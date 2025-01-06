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


## Oppsett backend

**Med kubernetes**

1. F�lg [how-to for oppsett av kubernetes](https://confluence.atlassian.nhn.no/display/HR2/HOW-TO:+Kubernetes+Lokalt)
2. F�lg [how-to for installasjon av hncli](https://confluence.atlassian.nhn.no/display/HR2/HNCli+-+Lokal+installasjon)
3. Deploy tjenesten til kubernetes
    ```powershell
    devspace deploy
    # N�s n� p�
    # - http://corefrontend-internalapi.localtest.me:30080
    ```

4. Konfigurer
   ```powershell
   dotnet-hncli dev config deploy --env-config dev-mot-k8s
   ```

5. Du kan n� enten
    - A) Kj�r api inni kubernetes basert p� lokalt bygd image
        ```powershell
        # Dette innb�rer for alle komponenter
        # - Docker image bygges lokalt
        # - Kubernetes podens image byttes ut med lokalt image
        devpace dev
        ```
    - B) Kj�r api p� din lokale maskin, configurert mot kubernetes resurser, med riktig launch-profile. Evt F5 i Visual Studio.
        ```powershell
        dotnet watch run --launch-profile corefrontend.InternalApi --project .\Source\InternalApi
        dotnet watch run --launch-profile corefrontend.ExternalApi --project .\Source\ExternalApi
        ```

## Generer entities

Av ukjent grunn så genereres entities types i forskjellige rekkefølge på windows og linux, derfor må man nå generere de i linux.

1. Start Docker Desktop
2. Start linux miljø: `docker run --rm -it -e HNDEV_PAT=$env:HNDEV_PAT -v ${PWD}\:/mnt/repo/ -w /mnt/repo mcr.microsoft.com/dotnet/sdk:8.0`
3. Generer entities: `dotnet run --project Source/CoreFrontend.EntitiesGenerator/`