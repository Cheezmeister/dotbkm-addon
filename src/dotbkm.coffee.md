# .bkm

## Dependencies

From Mozilla, require `io/file` and `places/bookmarks`, for obvious reasons.

    SDK =
      io: file: require 'sdk/io/file'
      places: bookmarks: require 'sdk/places/bookmarks'

Read YAML. TODO this is broken. Something about commonjs/buffer

    Npm =
      yaml: require 'vendor/js-yaml.min'

## Preliminaries

Check this path for data. One day we'll be clever about allowing trees and looking at
file extensions to allow YAML. For now, A JSON file named `.bkm` will do.

    path = '~/.bkm'

    bookmarks = []

Define our helper methods.

    makeBookmark = (title, url, group) ->
      console.log "URL: #{url}"
      console.log "Title: #{title}"
      bookmarks.push SDK.places.bookmarks.Bookmark (
        title: title,
        url: url,
        group: group
      )

    makeBookmarksR = (obj, group) ->
      console.log "Recursing with #{group}"
      for k,v of obj
        if typeof v == 'string'
          makeBookmark k, v, group
        else if typeof v == 'object' and v != null
          subgroup = SDK.places.bookmarks.Group title: k, group: group
          makeBookmarksR v, subgroup


Export helpers for test access.

    @exports =
      makeBookmark: makeBookmark
      makeBookmarksR: makeBookmarksR

## Read Files

    do ->

Prefer YAML over JSON, if present.
      
      if SDK.io.file.exists "#{path}.yaml"
        path = "#{path}.yaml"

Bail if the file doesn't exist. 

      return unless SDK.io.file.exists path

Bail if we can't read it.

      contents = SDK.io.file.read path
      return unless contents

Bail if it can't be parsed.

      tree = (if path.contains 'yaml' then Npm.yaml.load else JSON.parse) contents
      return unless tree

## Save Bookmarks

Construct bookmarks for FF.

Handle Firefox's "special" bookmark groups if any are used.

      'MENU TOOLBAR UNSORTED'.split(' ').map (specialGroup) ->
        if tree[specialGroup] and typeof tree[specialGroup] == 'object'
          makeBookmarksR tree[specialGroup], SDK.places.bookmarks[specialGroup]
          delete tree[specialGroup]

Handle loose bookmarks (no group specified). These are implitly treated as unsorted.

      makeBookmarksR tree, SDK.places.bookmarks.Group title: 'dotbkm'

Prune bookmarks that already exist.

      # TODO

Save them.
 
      console.log JSON.stringify bookmarks

      if bookmarks.length > 0
        emitter = SDK.places.bookmarks.save(bookmarks)
        emitter.on 'data', (saved, input) ->
          console.log "Saved #{saved}"
        emitter.on 'end', (saves, inputs) ->
          console.log "Saved #{saves.length} items"
