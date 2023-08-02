# Helsenorge Core Frontend

This is the repository for Helsenorge core packages. More details are found in the README for each package. 

The code in this repository is maintained in a private Git repository also containing code we have not yet open sourced. We use [Gitexporter](https://github.com/open-condo-software/gitexporter) to create the open source repository with only the code for NPM packages used in our other public repositories ([Refero](https://github.com/helsenorge/refero) and [Structor](https://github.com/helsenorge/structor)). 

The private Git repository is a monorepo containing other NPM packages, web pages and micro frontends for helsenorge.no. It uses NPM workspaces and Lerna for easier installation of dependencies, building and testing. Since the setup will not work without all the code from the monorepo, this is not included in the public repository. Therefore each package has to be built and tested separately for now.

## Questions

Questions about the code or project can be askes at [ROX Slack channel](https://norskhelsenett.slack.com/archives/CS70UT0R0) or as issues on GitHub.

## Internal documentation

https://confluence.atlassian.nhn.no/display/HR2/@helsenorge+NPM+pakker
