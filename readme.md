smashingboxes.com v3.0

Setup
-----

- Node 0.10 or > required
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
