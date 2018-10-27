[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/xtal-state)

<a href="https://nodei.co/npm/xtal-state/"><img src="https://nodei.co/npm/xtal-state.png"></a>

<img src="http://img.badgesize.io/https://unpkg.com/xtal-state@0.0.24/build/ES6/xtal-state.js?compression=gzip">

# \<xtal-state\>

xtal-state-* are a few Web components that wrap and extend the power of the history api.

One of the goals of xtal-state is that it be scalable (think [Scala](https://www.scala-lang.org/old/node/250.html)) -- it can solve simple problems simply, with a miminal learning curve, but it can also be used to tackle progressively more difficult problems, each problem requiring more nuance and mastery.

## Problem Statement I -- Object-centric routing

At the simplest level, it can provide part of a routing solution (but other components are needed in combination with these components for a full routing implementation).  But unlike typical routing solutions, perhaps, xtal-state* views the history.state object as the focal point, and the address bar as a subservient recorder of the history.state object.

At the other extreme, consider the following two problem statements.

## Problem Statement II -- Git in the browser

*A unit of the CIA, led by Agent Sarah Walker, is investigating a series of mysterious disappearances of prominent CEO's, artists, and scientists from around the world, each of them leaving behind the same note:*

>Who is Soorjo Alexander William Langobard Oliphant Chuckerbutty III?

*Agent Walker sends recent recruit Chuck Bartowski to visit the tombstone of Olipant Chuckerbutty (Senior), located in Paddington [located within greater London], in search of clues.*

*Chuck Bartowski is a lanky, earnest looking twenty-something with tangled, somewhat curly dark hair.  He works at Buy More as a computer service technician, after being expelled from Standford University's CS Program. Chuck is relieved and excited to be sent away on his first solo mission.  Relieved, because he had just admitted to his feelings for Agent Walker the previous day, who stood there, stoically.*

*"We should keep our relationship purely professional" she responded.  But was there a faint glimmer of ambiguity in her face?  Or was Chuck just desperate for any sign of mutual attraction?  Anyway, things had become rather awkward between them -- and going on this mission would help him keep his mind off of Sarah.*

*Chuck decides he would make the best use of his time for the long trip, and brings along one of his customer's Windows 7 laptops that needs updating to Windows 10.  He begins the upgrade at the Hollywood Burbank airport while waiting for his flight to London.*

*When Chuck arrives at the gravesite of Oliphant Chuckerbutty some 12 hours later, he is disappointed to see that the place was rather neglected, with no interesting markings that might lead anywhere.  Feeling like a total failure, Chuck sits down on the wet earth, burying his head in his hands.  Twenty minutes go by, and then Chuck hears someone whistling a tune that sounds eerily familiar, yet new and exciting at the same time.  The tune was clearly written by Krzysztof Penderecki, and obviously follows the mold he set with "Threnody to the Victims of Hiroshima."  But it is something Chuck has never heard before.  Of course! This must be the rumored "Dies Irae", but Chuck knew Penderecki had not yet completed the work.  Penderecki was one of the recent disappearances, who had left behind the mysterious note!*

*Chuck spins around to determine the source of the melody.  It's a young lad, the cemetary's groundkeeper.*

*"Where did you learn that piece you're whistling?  I haven't seen any recordings of it yet!" Chuck demands.*

*Startled at first, the lad quickly regains his composure.*

*"Who is Soorjo Alexander William Langobard Oliphant Chuckerbutty III?" he asks, playfully, and turns around and walks away.*

*It was then that Chuck spots the tatoo on the back of the groundkeeper's neck.  Chuck experiences one of his flashes, that started the day his old roomate, Bryce, had sent Chuck a high speed transmission of the most valuable CIA secrets, which somehow seeped right into Chuck's subconscious.*

*That tatoo was also spotted on Czech politician Vít Jedlička!*

*Whipping out his laptop, which is still undergoing the Windows 10 update, Chuck opens up the MS Edge browser, and pages through the introductory tutorial.  Once that's done, he opens up a top secret web site maintained by the CIA.  The website allows Chuck to select any business he wants, and it displays a tree-like org-chart, starting from the CEO on down.  It allows Chuck to add multiple such companies on the same page, showing different org charts, so Chuck can look for patterns.  Chuck expands the nodes on each company whose CEO had disappeared -- Amazon, Whole Foods (prior to the merger), Overstock.com, Craigslist, the Dallas Mavericks... In each case Chuck is able to find Vít Jedlička, working the cigar stand closest to the CEO's office, joining a week or two before the CEO disappeared!*

*Chuck can't wait to send Sarah the page he is on, which so clearly shows that Vít Jedlička must be involved somehow.  Getting a warning that the fourth reboot would start in 15 seconds, Chuck quickly copies the url in the address bar, and sends it to Agent Walker's secured email account, just in the nick of time before the browser shuts down for the reboot.*

### Why is this a difficult problem to solve?  

####  Challenge 1: Chrome throws out the baby with the hash marker.

The benefit of updating the window.location object (location.href and/or location.hash) as the user interacts with a web site, is that it allows the user to copy and paste the url corresponding to what they are seeing, and communicate it via email, text message etc.  Others can then open the application and zoom right to the place the user was excited to convey.  [At least, that's what I'd like to see happen, but most of the time, especially for complex business applications, this doesn't work].  And these days, many browsers support a sharing button, external to the web site, which sends the current url.  Sensible browsers, like Firefox, and Edge, include the hash tag part ("hash fragment") of the url.  Okay, I guess some neat freak commentators consider Chrome's recent URL castration / mutilation / amputation / lobotomy initiative a [feature](https://www.engadget.com/2018/02/19/chrome-cleans-messy-urls-share-phone/), not a bug.  I think this is quite problematic.  Sites like GitHub allow you to select a line number, which causes a hash location update to the url, specifying the line number.  Why does Chrome assume the user doesn't want to share that part of the URL?  That's a rather rude assumption, it seems to me.  Bad Chrome! 

####  Challenge 2: Internet Explorer and Edge:  Hold my beer.

[Egads](https://stackoverflow.com/questions/16247162/max-size-of-location-hash-in-browser). 

### So what to do?

The simplest solution to this dilemma would be to persist the history.state object to a central database with every modification, and to just add the id pointing to this object in the address bar somewhere Google hasn't started expunging yet.

One example of an existing service that requires no token or account, where one could store the stringified history.state object, is [myjson.com](http://myjson.com/) (maximum size unknown.).  NB:  Using such a service, and blindly accepting any id without serious verification, could put a damper on your weekend. 

And this strategy isn't very efficient.  It would require rapidly uploading a larger and larger object / JSON string as the user's application state grows, which could happen quite quickly.

Basically what we need is a miniature, 1 kb git client running in the browser, combined, perhaps with some smart middle-ware sitting on the server, that can commit only the minimal required change set,  at every user click we want to preserve, to a central repository.  It would return a revision number, which would go somewhere in the address bar. Until naughty advertisers figure out the same trick, at which point only the domain can be sent via sharing, no query string parameters or paths.  

## Problem Statement III -- Building https://UFP.gov

*In the year 2412, Guinan, president-elect of the United Federation of Planets, wants to make good on her promise to modernize the UFP website.  The last known browser running IE11 was destroyed when the planet Psi 2000 imploded, so Guinan thought it was time to finally take full advantage of what the platform had to offer in terms of scope isolation.  The current version of the website mashes together websites from each outpost - 5,173,000 in total.  Each website was built using the most popular framework of the day when the outpost was established, and due to framework lock-in, never migrated to anything newer.  Some of those frameworks, in fact, were conceived when the Beastie Boys' "Sabotage" was topping the Earthling charts.  Finding qualified developers requires finding time singularities and bringing in [ancient talent](https://motherboard.vice.com/en_us/article/pgapzy/heavens-gate-web-designers-higher-source-suicide-cult).  The mashing together is done via iframes.  So the idea is to switch out iframes for loosely coupled web components.*

*Doing her due diligence, Guinan visited alternate timelines where parallel Guinan's had tried the same thing. Guinan found one timeline where a mass inter-galactic civil-war had broken out.  The cause?  One of the web components had code that would update the window.history.state object.  This inadvertenly caused another outposts's web component to initiate war with the Romulans.*   


## Updating history.state

xtal-state-commit is a lightweight custom element that inserts its "history" property into the history.state object with an optional specified path.

As with all the other web components discussed here, you can specify the "level" at which the history.state object should be modified:

```html
<!--Polymer Notation -->
<div>
    <xtal-state-commit make level="local" history="[[newHistory]]" 
        with-path="myPath" url="/tribble"></xtal-state-commit>
</div>
```

Note the attribute "level."  Possible reserved values are "local", "shadow" and "global".  Since this is local, this will only affect the "history" of elements contained within the parent div tag.  If "level" is not one of these three values, it will assume this is a CSS "matches" expression, and it will only affect the history of elements contained within the ancestor tag matching the css selector.

The value of url can be hardcoded, as shown above, or set programmatically.  A third option is to allow reformatting of the url based on a regular expression, using the ES2018 replace and named capture groups:

```html
<!--Polymer Notation -->
<xtal-state-commit make history="[[newHistory]]" url="[[myBindingToYYYY-MM-DD-formattedDate]]" 
    url-search="(?<year>[0-9]{4})-(?<month>[0-9]{2})-(?<day>[0-9]{2})" 
    replace-url-value="?date=$<month>/$<day>/$<year>"
    level="local" with-path="myPath">
</xtal-state-commit>
```

## Observing history.state

xtal-state-watch watches for all history state changes.  Like xtal-state-commit, you can specify the level as "local", "shadow" or "global".  When history changes, it emits an event "history-changed".  xtal-state-watch also supports an attribute / property:  "once."  If this is set, it will only emit the first non trivial history object, and then stop listening for history change events.  This can be useful for initializing an object based on the last history object (received by Agent Walker, e.g.).

## Merging history.state

xtal-state-update extends xtal-state-commit, but adds the ability to *merge* changes to the existing history.state object, even with the same path, if it exists, so that other history updates done by other pieces of code will be even less likely to be lost.

Syntax:

```html
<!-- Polymer notation -->
<xtal-state-update make history="[[watchedObject]]" title="myTitle" url="/myURL" level="shadow" ></xtal-state-update>

<xtal-state-update rewrite history="[[watchedObject]]" title="myTitle" url="/myURL" level="global"></xtal-state-update>

```


## Transcribing state from the address bar

### Parsing

xtal-state-parse is another web component that helps with parsing the address bar url and, often, populating history.state object when the page loads. 

There are two distinctly different scenarios for how this could work.  For now xtal-state-parse (at least one instance thereof) assumes you are adopting one or the other scenario:

1.  Routing 101 Scenario:  The critical pieces of information that need to go into history.state are all encoded in the address bar.
2.  Git in the browser scenario:  The address bar simply contains an id somewhere, which we need, but it doesn't need to go into history.state.  Rather, that id is used to query some remote data store, and *that* object is what is to go into history.state.

In the Routing 101 scenario, xtal-state-parse will initialize history.state, only if history.state starts out null.  

In the 'git in the browser scenario", the id will simply emit an event with the decoded id (or really, the parsed object, which may contain more information than a single id), and will let other components take it from there, leaving history untouched.

To let xtal-state-parse know which scenario is desired, for scenario 1 (routing 101) set attribute:  "init-history-if-null".  If that attribute isn't present, leave history.state alone, and just emit an event "match-found".

xtal-state-parse relies on the regular expression [named capture group enhancements](https://github.com/tc39/proposal-regexp-named-groups) that are part of [ES 2018](http://2ality.com/2017/05/regexp-named-capture-groups.html).  Only Chrome supports this feature currently.

Syntax:

```html
<xtal-state-parse parse="location.href" with-url-pattern="https://(?<domain>[a-z\.]*)/factory-mind/(?<article>[a-z0-9-]*)" ></xtal-state-parse>

```

Note the two captured named group fields:  "domain" and "article".

For example, if the url has the form: https://medium.com/factory-mind/regex-tutorial-a-simple-cheatsheet-by-examples-649dc1c3f285

then the syntax above will initialize history.state to:

```JSON
{
    "domain":"medium.com",
    "article":"regex-tutorial-a-simple-cheatsheet-by-examples-649dc1c3f285"
}
```

[XregExp](http://xregexp.com/) is a library that inspired this spec, and that could provide a kind of polyfill for browsers that don't support named capture groups yet. However, it is a rather large polyfill, and supporting this is ultimately throw away code.  More useful is to be able to provide a parser function, should regular expressions not meet the requirements.  To set the parser function, use property "parserFn".  The signature of the function should be:

> function(url: string) : object

If you set attribute "with-url-pattern", the code tries that first.  If that gives an error (e.g. no support for named capture groups), then it will try the parserFn property

If attribute "init-history-if-null" is set, then if the url-pattern and/or parserFn matches the location.href (or whatever path is specified by the parse attribute/property)  the (contextual) history.state object is set to the parsed object.  Otherwise / in addition, xtal-state-parse will emit event "match-found" after parsing, and the event contains the matching object.

If the address bar doesn't match the regular expression, event "no-match-found" is emitted.

## Surely, xtal-state-parse watches for pop-state events, right?

No.  Remember, xtal-state views history.state as the focal point, not the address bar.  The application is responsible for making sure the address bar can be parsed, and history restored, when the address bar contents are sent to someone else (or bookmarked for later use).  But xtal-state works with the premise that all binding should be done to history.state, not to the address bar.  And don't call me Shirley.

## xtal-state.js

All four files are combined into a single IIFE class script file, xtal-state.js, which totals ~3.3 kb minified and gzipped.  



## Programmatic API

To partake in usage of the state management without using web components, you can get the window object containing the history.state:

```JavaScript
import {getWinCtx} from 'xtal-state/xtal-state-base.js';

...
const win = getWinCtx(el, level);
console.log(win.history.state);
```

where "el" is a DOM element, and "level" has the same meaning as described above.  Unless level is "global", "el" will be used as the reference point to apply the "level" to.

## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) and npm (packaged with [Node.js](https://nodejs.org)) installed. Run `npm install` to install your element's dependencies, then run `polymer serve` to serve your element locally.

## Viewing Your Element

```
$ polymer serve
```

## Running Tests

WIP


