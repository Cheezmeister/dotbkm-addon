#dotbkm

Load bookmarks from ~/.bkm

Inspired by [rlr/dotjs](https://github.com/rlr/dotjs-addon)

The files you probably care about are the [gulpfile](gulpfile.coffee.md) and the [source code](src/dotbkm.coffee.md).

This is a work in progress. Kindly report any bugs via GH issues or [email][].

# Usage

Create and maintain a file called `.bkm` in your home directory. Your bookmarks will
be pulled in from here. Existing bookmarks won't be touched. That's about it.

```sh

$ cat >> ~/.bkm
TOOLBAR:
  GitHub: https://www.github.com
MENU:
  Social:
    Fakebook: http://www.facebook.com
    Twatter: http://www.twitter.com
    Instasham: http://www.instagram.com
  Forums:
    Reddit: http://www.reddit.com
    4Chan: http://www.4chan.org/
    Hacker News: http://news.ycombinator.com/
UNSORTED:
  Reading List:
    Programming: 
      - http://www.catb.org/esr/writings/cathedral-bazaar/
      - http://luchenlabs.com/words/programming
      - http://mollyrocket.com/casey/stream_0019.html
```


[email]: dotbkm@luchenlabs.com
