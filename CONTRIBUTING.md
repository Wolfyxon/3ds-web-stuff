# Contributing guildlines
## Pull requests
### Guide
If you want to contribute to the project directly by writing code:
1. [Fork](https://github.com/Wolfyxon/3ds-web-stuff/fork) the repository
2. Clone the forked repository onto your machine
3. Make and commit changes
4. Push the changes
5. Open a pull request, make sure to state what was changed
6. Your code will be tested and reviewed

Your changes should cover:
- New features
- Bugfixes
- Typo and grammar corrections
- Performance improvements

Your code must also be tested on a actual Nintendo 3DS, the 3DS browser is very outdated and does not have many of the modern features.  
Most notable issues:
- Missing `animation` and `transition` in CSS (alternative: scripts/lib/anim.js)
- Missing `let`
- Inability to make lambda expressions ( `() => {}` )
- Only **D-pad** and **A** buttons are usable. (Other keys have a built in functionality in the browser. They can be detected but can't be disabled)
- Lack of class functionality. Using `class` will result in a reserved keyword error

For more details visit https://en-americas-support.nintendo.com/app/answers/detail/a_id/13802/~/nintendo-3ds-internet-browser-specs  
Also see https://developer.mozilla.org/ whenever you need to check if a property or a function is supported on the 3DS, check the compatibility for Safari and the year it was added. Features up to 2015 should work.

### Rules
- Your code must work on both PC/mobile browser and the 3DS browser.
- Your code has to be human readable, using any obfuscated code is prohibited.
- Don't make redundant code, the site has already built in libraries to handle things like linear interpolation, animations and easy gamepad input detection.
- Avoid using external libraries as they are often not compatible with old browsers.
- Controls have to be indicated with the 3DS system font characters. [Unicode table](https://www.3dbrew.org/wiki/System_Font#Unicode_Private_Use_characters)
- All pages have to be built on top of [template.html](https://github.com/Wolfyxon/3ds-web-stuff/blob/main/template.html), unless they have no visual functionality (example: redirect page)
- Follow this file structure:
```
games
|_ gameName
  |_ gameName.js
  |_ gameName.css
  |_ index.html

other
|_ appName
  |_ appName.js
  |_ appName.css
  |_ index.html
```

## Bugs and suggestions
If you found a bug or want to suggest something, go to [issues](https://github.com/Wolfyxon/3ds-web-stuff/issues/).

If you are reporting a bug, fully explain it. *Doesn't work*, *Broken*, *Glitchy*, *Buggy* are not valid bug reports.
