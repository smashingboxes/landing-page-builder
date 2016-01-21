require.config
  paths:
    jquery: '//cdnjs.cloudflare.com/ajax/libs/jquery/2.0.3/jquery.min'

require ['jquery'], ($) ->
  console.log 'jquery loaded'

  $headerHeight = $('.header').outerHeight()
  $hero = $('.hero')

  $hero.css('padding-top': $headerHeight + 'px')

  console.log($headerHeight)
