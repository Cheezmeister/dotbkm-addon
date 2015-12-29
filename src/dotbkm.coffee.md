# .bkm

## Dependencies

From Mozilla, require `io/file` and `places/bookmarks`, for obvious reasons.

    SDK =
      io: file: require 'sdk/io/file'
      places: bookmarks: require 'sdk/places/bookmarks'

Read YAML. TODO this is broken. Something about commonjs/buffer

    # Npm =
    #   yaml: require 'js-yaml'

Check this path for data

    path = '~/.bkm'

    if SDK.io.file.exists path
      console.log 'yay'
      contents = SDK.io.file.read path
      if contents
        console.log "Contents: #{contents}"
        obj = JSON.parse contents
        if obj
          mastergroup = SDK.places.bookmarks.Group title: 'dotbkm'
          bookmarks = []
          for k,v of obj
            bookmarks.push SDK.places.bookmarks.Bookmark(title: k, url: v, group: mastergroup)
          if bookmarks.length > 0
            emitter = SDK.places.bookmarks.save(bookmarks)
            emitter.on 'data', (saved, input) ->
              console.log '.'
            emitter.on 'end', (saves, inputs) ->
              console.log "Saved #{saves.length} items"
