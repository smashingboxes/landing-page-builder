smashingboxes.com v3.0

Setup
-----

- Node 4.2 or > required
- Roots installed globally optional
- clone this repo down and `cd` into the folder
- run `npm install`
- Add contentful keys to the `.env` file (see example)
- run `roots watch` or `npm run roots watch`

Contentful and Netlify Keys
---------------------------

You will need the contentful keys to build the site locally. Those can be found
on passpack.

To deploy from your local machine you will need the Netlify access key also found in
passpack, however the app will automatically deploy from Netlify if the github
repo is updated or content is changed in Contentful.

Deployment
----------

This site is hosted at Netlify.

Run `make deploy` to deploy the site. This command is a shortcut for compiling the site with roots and deploying using [ship](https://github.com/carrot/ship). See the [Makefile](Makefile) for more info.

How This Thing Works
--------------------

Changes in Github or Contentful kick off a build on Netlify via webhooks
```
_________
| Github |---commit----------------|
---------                          |      _________      _______________
                                   |----->| Netlify| --->| Static Files |
_____________                      |      ---------      ---------------
| Contentful |---update published--|
-------------
```

Jobs Backend App
----------------

- Node 4.2 or > required
- Get Workable API Token and put int in your .env file (see below)

### run with docker
  - Make sure you install the docker toolbox: https://www.docker.com/products/docker-toolbox
  - Open your terminal with the "Docker Quickstart Terminal" app
  - or `docker-machine start default && eval "$(docker-machine env default)"`
  - `docker-compose up`
  - api is at `<yourdockermachineip>:3000`
  - run tests with `docker-compose run web npm test`

*Some docker cli help:*
  - Completion: https://docs.docker.com/compose/completion/
  - Make some aliases


### run without docker
```
npm install
npm start
```

Workable Key
------------

Can be found on passpack.

Tape Deploy
-----------
`bundle exec tape ansible docker_deploy --vault-password-file .vault_pass.txt`

Get the vault password from passpack.
