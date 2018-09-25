[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/xtal-state)

<a href="https://nodei.co/npm/xtal-state/"><img src="https://nodei.co/npm/xtal-state.png"></a>

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

*When Chuck arrives at the gravesite of Oliphant Chuckerbutty some 12 hours later, he is disappointed to see that the place was rather neglected, with no interesting markings that might lead anywhere.  Feeling like a total failure, Chuck sits down on the wet earth, burying his head in his hands.  Twenty minutes go by, and then Chuck hears someone whistling a tune that sounds eerily familiar, yet new and exciting at the same time.  The tune was clearly written by Krzysztof Penderecki, and obviously follows the mold he set with  "Threnody to the Victims of Hiroshima."  But it is something Chuck has never heard before.  Of course! This must be the rumored "Dies Irae", but Chuck knew Penderecky had not yet completed the work.  Penderecky was one of the recent disappearances, who had left behind the mysterious note!*

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

*In the year 2412, Guinan, president-elect of the United Federation of Planets, wants to make good on her promise to modernize the UFP website.  The last known browser running IE11 was destroyed when the planet Psi 2000 imploded, so Guinan thought it was time to finally take full advantage of what the platform had to offer in terms of scope isolation.  The current version of the website mashes together websites from each outpost - 5,173,000 in total.  Each website was built using the most popular framework of the day when the outpost was established, and due to framework lock-in, never migrated to anything newer.  Some of those frameworks, in fact, were conceived when the Beastie Boys' "Sabotage" was topping the Earthling charts.  Finding qualified developers requires finding Time Singularities and bringing in [ancient talent](https://motherboard.vice.com/en_us/article/pgapzy/heavens-gate-web-designers-higher-source-suicide-cult).  The mashing together is done via iframes.  So the idea is to switch out iframes for loosely coupled web components.*

*Doing her due diligence, Guinan visited alternate timelines where parallel Guinan's had tried the same thing. Guinan found one timeline where a mass inter-galactic civil-war had broken out.  The cause?  One of the web components had code that would update the window.history.state object.  This inadvertenly caused another outposts's web component to initiate war with the Romulans.*   


## Updating history.state

xtal-state-commit is a lightweight custom element that simply posts (overwrites) the history.state object.

As with all the other web components discussed here, you can specify the "level" at which the history.state object should be modified:

```html
<!--Polymer Notation -->
<div>
    <xtal-state-commit make history="[[newHistory]]" url="/tribble" level="local"></xtal-state-commit>
</div>
```

Note the attribute "level."  Possible values are "local", "shadow" and "global".  Since this is local, this will only affect the "history" of elements contained within the parent div tag.

## Observing history.state

xtal-state-watch watches for all history state changes.  Like xtal-state-commit, you can specify the level as "local", "shadow" or "global".

## Merging history.state

xtal-state-update extends xtal-state-commit, but adds the ability to *merge* changes to the existing history.state object, if it exists, so that other pieces of code that modify history.state won't be lost.

Syntax:

```html
<!-- Polymer notation -->
<xtal-state-update make history="[[watchedObject]]" title="myTitle" url="/myURL" level="shadow" ></xtal-state-update>

<xtal-state-update rewrite history="[[watchedObject]]" title="myTitle" url="/myURL" level="global"></xtal-state-update>

```





## Transcribing state from the address bar

### Parsing

xtal-state-parse is another web component that helps with parsing the address bar url and populating history.state object when the page loads.  

xtal-state-parse relies on the regular expression [named capture group enhancements](https://github.com/tc39/proposal-regexp-named-groups) that are part of [ES 2018](http://2ality.com/2017/05/regexp-named-capture-groups.html).  Only Chrome supports this feature currently.


[XregExp](http://xregexp.com/) is a library that inspired this spec, and that can provide a kind of polyfill for browsers that don't support named capture groups yet. The code checks if this alternative library is present.  If not, it uses the native regexp native function. [TODO]

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

If the url-pattern does not match the location.href (or whatever path is specified by the parse attribute/property, no changes to the history.state object are made.

All four files are combined into a single IIFE class script file, xtal-state.js, which totals ~2.3 kb minified and gzipped.  

## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) and npm (packaged with [Node.js](https://nodejs.org)) installed. Run `npm install` to install your element's dependencies, then run `polymer serve` to serve your element locally.

## Viewing Your Element

```
$ polymer serve
```

## Running Tests

WIP


