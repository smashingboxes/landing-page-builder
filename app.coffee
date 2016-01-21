require('dotenv').load()

contentful              = require 'roots-contentful'
config                  = require './contentful'
marked                  = require 'marked'

accord                  = require 'accord'
lost                    = require 'lost'
postcss                 = accord.load 'postcss'
postcss_import          = require 'postcss-import'
precss                  = require 'precss'
postcss_cssnext         = require 'postcss-cssnext'
postcss_svg             = require 'postcss-svg'
postcss_vertical_rhythm = require 'postcss-vertical-rhythm'
postcss_round_subpixels = require 'postcss-round-subpixels'
postcss_reporter        = require 'postcss-reporter'

module.exports =
  ignores: [
    'readme.md', '**/layout.*', '**/_*', '**/_*/*', '.gitignore', 'contentful.coffee',
    'Makefile', 'ship*'
  ]

  postcss:
    use: [
      postcss_import()
      precss()
      postcss_cssnext()
      postcss_vertical_rhythm()
      lost()
      postcss_round_subpixels()
      postcss_svg({
        paths: ['assets/img'],
        defaults: "[fill]: #000000",
      })
      postcss_reporter()
    ]
    map: true

  locals:
    marked: marked

  extensions: [contentful(config)]
