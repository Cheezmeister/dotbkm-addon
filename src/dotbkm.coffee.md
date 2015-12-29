# .bkm

## Dependencies

From Mozilla, require `io/file` and `places/bookmarks`, for obvious reasons.

    SDK =
      io: file: require 'sdk/io/file'
      places: bookmarks: require 'sdk/places/bookmarks'

Read YAML. TODO this is broken. Something about commonjs/buffer

    # Npm =
    #   yaml: require 'js-yaml'

Check this path for data. One day we'll be clever about allowing trees and looking at 
file extensions to allow YAML. For now, A JSON file named `.bkm` will do.

    path = '~/.bkm'

Bail if the file doesn't exist.

    do ->
      return unless SDK.io.file.exists path

Bail if we can't read it.

      contents = SDK.io.file.read path
      return unless contents

Bail if it can't be parsed as JSON.

      obj = JSON.parse contents
      return unless obj

Construct bookmarks for FF.

      mastergroup = SDK.places.bookmarks.Group title: 'dotbkm'
      bookmarks = []
      for k,v of obj
        bookmarks.push SDK.places.bookmarks.Bookmark(title: k, url: v, group: mastergroup)

Save them.

      if bookmarks.length > 0
        emitter = SDK.places.bookmarks.save(bookmarks)
        emitter.on 'data', (saved, input) ->
          console.log '.'
        emitter.on 'end', (saves, inputs) ->
          console.log "Saved #{saves.length} items"
