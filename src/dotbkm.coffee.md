# .bkm

## Dependencies

From Mozilla, require `io/file` and `places/bookmarks`, for obvious reasons.

    SDK =
      io: file: require 'sdk/io/file'
      places: bookmarks: require 'sdk/places/bookmarks'

Also use URL parsing to normalize URLs. Not only does this help make things squeaky clean without demanding users be meticulous with their URLs, it prevents false duplicates caused by Firefox sneakily appending slashes onto URLS like `http://g.co` -> `http://g.co/`.

      url: require 'sdk/url'

Read YAML.

    Npm =
      yaml: require 'vendor/js-yaml.min'

## Preliminaries

Check this path for data. It may have a `json` or `yaml` extension.  If no extension is present, YAML is assumed.

    path = '~/.bkm'

    bookmarks = []

### Helper Methods

Normalize a URL to contain a single trailing slash if a top-level page.

    normalize = (url) ->
      new SDK.url.URL(url).href

Construct a typed Mozilla `Bookmark`

    makeBookmark = (title, url, group) ->
      console.log "URL: #{url}"
      url = normalize url
      console.log "URL: #{url} (normalized)"
      console.log "Title: #{title}"
      bookmarks.push SDK.places.bookmarks.Bookmark (
        title: title,
        url: url,
        group: group
      )

Get the group ancestry of a bookmark.

    ancestry = (bookmark) ->
      ancestryR = (group) ->
        if !group
          ''
        else
          ancestryR(group.parent) + '->' + group.title
      ancestryR bookmark.group

Recurse through an object tree of untyped bookmarks, creating typed `Group`s as we go, finally yielding a flat list of typed `Bookmark`s.

    makeBookmarksR = (obj, group) ->
      console.log "Recursing with #{group.title}"
      for k,v of obj
        if typeof v == 'string'
          makeBookmark k, v, group
        else if typeof v == 'object' and v != null
          subgroup = SDK.places.bookmarks.Group title: k, group: group
          makeBookmarksR v, subgroup

### Exports

These exist mainly for test access.

    @exports =
      makeBookmark: makeBookmark
      makeBookmarksR: makeBookmarksR

## Read Files

    do ->

Prefer YAML over JSON, if present.
      
      if SDK.io.file.exists "#{path}.yaml"
        path = "#{path}.yaml"
      else if SDK.io.file.exists "#{path}.json"
        path = "#{path}.json"

Bail if the file doesn't exist.

      return unless SDK.io.file.exists path

Bail if we can't read it.

      contents = SDK.io.file.read path
      return unless contents

Bail if it can't be parsed.

      load = (if path.contains 'json' then JSON.parse else Npm.yaml.load)
      tree = load contents
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

Prune bookmarks that already exist. For our purposes this means that an existing bookmark has the same title, URL, and group ancestry as the one we are prospectively adding. Two bookmark in the same group, with the same name and the same URL is not prevented by Firefox, but I don't see much practical use in it. 

      SDK.places.bookmarks.search({}).on 'end', (results) ->
        pruneBookmark = (existing) ->
          bookmarks.filter (b, index) ->
            match = (b.title == existing.title and
              b.url == existing.url and
              ancestry(b) == ancestry(existing))
            console.log "...#{match}"
            !match
        bookmarks = pruneBookmark r for r in results

Save them.
 
        console.log JSON.stringify bookmarks

        if bookmarks.length > 0
          emitter = SDK.places.bookmarks.save(bookmarks)
          emitter.on 'data', (saved, input) ->
            console.log "Saved #{saved}"
          emitter.on 'end', (saves, inputs) ->
            console.log "Saved #{saves.length} items"
