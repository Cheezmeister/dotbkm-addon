
# a dummy function, to show how tests work.
# to see how to test this function, look at test/test-index.js
    self = require('sdk/self')

    dummy = (text, callback) ->
      callback text
      return

    handleClick = (state) ->
      tabs.open 'http://www.mozilla.org/'
      return

    exports.dummy = dummy
    buttons = require('sdk/ui/button/action')
    tabs = require('sdk/tabs')
    button = buttons.ActionButton(
      id: 'mozilla-link'
      label: 'Visit Mozilla'
      icon:
        '16': './icon-16.png'
        '32': './icon-32.png'
        '64': './icon-64.png'
      onClick: handleClick)

