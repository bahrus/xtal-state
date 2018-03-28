# \<xtal-state\>

\<xtal-state\> provides declarative wrappers around the [history api](https://developer.mozilla.org/en-US/docs/Web/API/History_API), with a few twists.

## Problem Statement

A unit of the CIA, led by Agent Sarah Walker, is investigating a series of mysterious disappearances of prominent CEO's, artists, and scientists from around the world, each of them leaving behind the same note:

>Who is Soorjo Alexander William Langobard Oliphant Chuckerbutty III?

Agent Walker sends recent recruit Chuck Bartowski to visit the tombstone of Olipant Chuckerbutty (Senior), located in Paddington, in search of clues.

Chuck Bartowski is a lanky, earnest looking twenty-something with tangled, somewhat curly dark hair.  He works at Buy More as a computer service technician, after being expelled from Standford University's CS Program. Chuck is relieved and excited to be sent away on his first solo mission.  Relieved, because he had just admitted to his feelings for Agent Walker the previous day, who stood there, stoically.

"We should keep our relationship purely professional" she responded.  But was there a faint glimmer of ambiguity in her face?  Or was Chuck just desperate for any sign of mutual attraction?  Anyway, things had become rather awkward between them -- and going on this mission would help him keep his mind off of Sarah.

Chuck decides he would kill two birds with one stone, and brings along one of his customer's Windows 7 laptops that needs updating to Windows 10.  He begins the upgrade at the Hollywood Burbank airport while waiting for his flight to London.

When Chuck arrives at the gravesite of Oliphant Chuckerbutty some 12 hours later, he is disappointed to see that the place was rather neglected, with no interesting markings that might lead anywhere.  Feeling like a total failure, Chuck sits down on the wet earth, burying his head in his hands.  Twenty minutes go by, and then Chuck hears someone whistling a tune that sounds eerily familiar, yet new and exciting at the same time.  The tune was clearly written by Krzysztof Penderecki, and clearly follows the mold he set with  "Threnody to the Victims of Hiroshima."  But it is something Chuck has never heard before.  Of course! This must be the rumored "Dies Irae", but Chuck knew Penderecky had not yet completed the work.  Penderecky was one of the recent disappearances, who had left behind the mysterious note!

Chuck spins around to determine the source of the melody.  It's a young lad, the cemetary's groundkeeper.

"Where did you learn that piece you're whistling?  I haven't seen any recordings of it yet!" Chuck demands.

Startled at first, the lad quickly regains his composure. 

"Who is Soorjo Alexander William Langobard Oliphant Chuckerbutty III?" he asks, playfully, and turns around and walks away.

It was then that Chuck spots the tatoo on the back of the groundkeeper's neck.  Chuck experiences one of his flashes, that started the day his old roomate, Bryce, had sent Chuck a high speed transmission of the most valuable CIA secrets, which somehow seeped right into Chuck's subconscious.

That tatoo was also spotted on Czech politician Vít Jedlička!

Whipping out his laptop, which is still undergoing the Windows 10 update, Chuck opens up the MS Edge browser, and pages through the introductory tutorial.  Once that's done, he opens up a top secret web site maintained by the CIA.  The website allows Chuck to select any business he wants, and it displays a tree-like org-chart, starting from the CEO on down.  It allows Chuck to add multiple such companies on the same page, showing different org charts, so Chuck can look for patterns.  Chuck expands the nodes on each company whose CEO had disappeared -- Amazon, Whole Foods (prior to the merger), Overstock.com, Craiglist, the Dallas Mavericks... In each case Chuck is able to find Vít Jedlička, working the cigar stand closest to the CEO's office, joining a week or two before the CEO disappeared!

Chuck can't wait to send Sarah the page he is on, which so clearly shows that Vít Jedlička must be involved somehow.  Getting a warning that the fourth reboot would start in 15 seconds, Chuck quickly copies the url in the address bar, and sends it to Agent Walker's secured email account, just in the nick of time before the browser shuts down for the reboot.

\<xtal-state\> is a set of dependency free web components that help applications interface with the history API, in a way that's conducive to building a URL like the one that Chuck sent Sarah.  It promotes being able to share complex views of an application state.

## Throwing out the baby with the hash marker.

The benefit of updating the window.location object (location.href and/or location.hash) as the user interacts with a web site, is that it allows the user to copy and paste the url corresponding to what they are seeing, and communicate it via email, text message etc.  Others can then open the application and zoom right to the place the user was excited to convey.  [At least, that's what I'd like to see happen, but most of the time, especially for complex business applications, this doesn't work].  And these days, many browsers support a sharing button, external to the web site, which sends the current url.  Sensible browsers, like Firefox, and Edge, include the hash tag part ("hash fragment") of the url.  Okay, I guess some neat freak commentators consider Chrome's recent URL castration / mutilation / amputation / lobotomy initiative a [feature](https://www.engadget.com/2018/02/19/chrome-cleans-messy-urls-share-phone/), not a bug.  I think this is quite problematic.  Sites like GitHub allow you to select a line number, which causes a hash location update to the url, specifying the line number.  Why does Chrome assume the user doesn't want to share that part of the URL?  That's a rather rude assumption, it seems to me.  Bad Chrome! 

## Chrome conspires with Internet Explorer

Chrome seems to be hanging out with [a new crowd](https://stackoverflow.com/questions/16247162/max-size-of-location-hash-in-browser).  

## So what to do?

The simplest solution to this dilemma would be to persist the history.state object to a central database with every modification, and to just add the id pointing to this object in the address bar somewhere Google hasn't started expunging yet.

One example of an existing service that requires no token or account, where one could store the stringified history.state object, is [myjson.com](http://myjson.com/) (maximum size unknown.).  NB:  Using such a service, and blindly accepting any id without serious verification, could put a damper on your weekend. 

And this strategy isn't very efficient.  It would require rapidly uploading a larger and larger object / JSON string as the user's application state grows, which could happen quite quickly.

Basically what we need is a miniature, 1 kb git client running in the browser, that can commit only the minimal required change set,  at every user click we want to preserve, to a central repository, returning a revision number, which will go somewhere in the address bar, until naughty advertisers figure out the same trick, at which point only the domain can be sent via sharing, no query string parameters or paths.  

These web components assume the existence of such an all-powerful "git client" in the browser, and simply serve as a meek assistant to this (for now?) phantom incredibly amazing state management / persistence library.  They focus on getting this god-like library the information it needs to commit the changes to some magical github-like database that returns a revision number with every save, allowing the entire state to be retrieved by another user with just that token.  

I.e. these components address simple pieces of the puzzle, leaving the heavier lifting to others.

# \<xtal-state-watch\>

## Listening for history changes

*xtal-state-watch* was a ~700B (minified and gzipped) js custom element that still listens for all history changes, and it emits an event that local components can bind to. 

For example, using a JSX library that can listen for custom events, like Preact, we can have code like:

```JSX
<xtal-state-watch watch onHistory-changed={this.handleNewsFlash}></xtal-state-watch>
``` 

With Polymer, one would instead typically use the following for declarative syntax:

```html

<xtal-state-watch watch history="{{myTruth}}"></xtal-state-watch>

```

Other template frameworks follow similar patterns.

The boolean attribute/property "watch" is there so neighboring elements can ignore history changes when the attribute is removed, or the property is set to false.  This might be useful, for example, if an element is present but hidden.  When watch becomes true, it will notify the ancestral nodes (and possibly) neighbors of the new state of history.

## Departmentalizing, Part I

It's likely that most components won't be interested in the entire state object, assuming it is used for managing complex state in a large complex application.  Large numbers of components subscribing to every history change event, then, could be problematic -- in short we have a scalability problem.  We employ a few tweaks that might allow us to keep more complex, comprehensive solutions at bay.

The first such tweak is to specify only a certain part of the history which is of interest to that area of the application.  We enhance the markup:

```html
<xtal-state-watch 
    watch history="{{policeBlotter}}" 
    where-path="MilkyWay.Earth.UnitedStates.Texas.Montgomery.CutAndShoot">
</xtal-state-watch>
``` 

As we will see later, as long as you update the history.state object using the web components described in this document, then the where-path will limit which events the specific instance will respond to.[TODO]  This attribute isn't all-powerful however.   If other external logic  decides to update the history outside the path specified, this web component will respond.  I.e. it will oversubscribe.  Solving that issue (if it is solvable?  maybe using proxies?) is a TODO item.

If you are using good UI components which are optimized for dealing with small changes to the model (e.g. a virtual DOM), then hopefully the consequences of this oversubscription (for now) won't be too bad.

## Data Injection [TODO]

Suppose we want to use the history to reference a large object or a  function.  In the latter case, functions can't be stored in the history.state because it doesn't support cloning.

xtal-state-watch supports asking containing elements for help filling in the details before posting the enhanced history to its peers.  So say the following is put into history.state:

```JavaScript
    {
        caseNumber: 0102945
    }
```

We can dispatch a request that passes this minimal object up the DOM Tree, providing a name for the event, and the path:

```html
<!-- Polymer binding syntax -->
<xtal-state-watch watch history="{{policeBlotter}}"
    where-path="MilkyWay.Earth.UnitedStates.Texas.Montgomery.CutAndShoot"  
    dispatch event-name="getPoliceIncidentDetails" composed bubbles
>
</xtal-state-watch>
```

The event contains the value of the history object (restricted to the optional where-path).

Subscribing elements can replace the value with a new value (in this example, performing a lookup on the caseNumber), or replace the value with a promise, which xtal-state-watch will wait for, before setting the history property / event for local elements.  

## Applying changes

*xtal-state-update* is another custom element, that views the history api as a rudimentary global state management system, including built-in time travel support via the back / forward buttons.  xtal-state-update allows you to declaratively modify the history.state object.  But in the interest of being a good neighbor to other components that may work with the history api (like routing components), the changes made to the history.state are made so as not to trample on changes made externally.  In other words, xtal-state-update strives to minimize the chances of losing history state changes made from logic external to xtal-state-update.

xtal-state-update provides three required properties that allow the developer to declaratively modify the global history.state object.

With Polymer syntax, this would look as follows:

```html

<xtal-state-update make history="[[watchedObject]]" ></xtal-state-update>

<xtal-state-update rewrite history="[[watchedObject]]"></xtal-state-update>

```

When the watchedObject changes, it will be merged into the (existing) history.state object, forming a new history.state object.

Two additional properties / attributes allow you to specify the title and url for the history update change.  They are named "title" and "url."

## Departmentalizing Part II

To specify that the history path we want to write to is actually a sub path of the root object, we also use attribute where-path:

```html
<xtal-state-update make history="[[newPoliceBlotterEntry]]"  
    where-path="MilkyWay.Earth.UnitedStates.Texas.Montgomery.CutAndShoot">
</xtal-state-update>
```

If the history state is null, or doesn't have a nested object hierarchy matching the long path specified above, xtal-state-update will first create such an object hierarchy before inserting the policeBlotter object without losing the state created elsewhere.

xtal-state-update will note the path being updated.  xtal-state-watch components will ignore history updates if their where-path is not in alignment with the where-path of xtal-state-update.

The "make" boolean attribute/property specifies that we want to **update** the history object based on the watchedObject changes, and mark this as a new state in the history.

The "rewrite" boolean attribute/property will cause the previous state change to be skipped over when going back using the back button.  The MDN article linked above explains this much better.

But unlike the native history.pushState and history.replaceState methods, xtal-state-update attempts to preserve what was there already.  If the source property is of type object or array, it creates a new empty object {}, then merges the existing state into it, then does a [deep, recursive merge](https://davidwalsh.name/javascript-deep-merge) of watchedObject (in this example) into that.

## Support for data extraction / route information [Done, but not sufficiently tested / optimized]

Suppose we have a new police blotter entry someone entered:

```JavaScript
    {
        caseNumber: 'unknown',
        reporter: 'Michael Davis',
        age: 20
        address:  '112 Privet Drive',
        incident: `Six men, their faces covered with red bandanas, got out of the Cherokee carrying a knife, baseball bat, billy club and rolling pin," said Davis, 20.

        "I knew when I saw the rolling pin that something bad was going to go down," Davis said.
        `,
    }
```


```html
<xtal-state-update make history="[[newPoliceBlotterEntry]]"  
    where-path="MilkyWay.Earth.UnitedStates.Texas.Montgomery.CutAndShoot"
    dispatch event-name="savePoliceBlotterEntry" bubbles composed
    title="notSureWhatPurposeTitleHas" url="[[overridenRouteGenerator]]"
>
</xtal-state-update>
```


xtal-state-update will pass the event with the specified name.  The detail of the event has four properties:

1)  proposedState : object
2)  abort:  boolean
3)  title : string
4)  url: string
5)  where-path: string

Subscribers can, first, indicate "hey, that's my job!", and invoke their preferred router, and prevent xtal-state-update from doing anything further, by setting abort = true.

Subscribers can modify these properties as needed.  For example, if a subscriber already knows the id for this new incident, it can modify the proposedState:

```JavaScript
{
    proposedState: {
        caseNumber: 0102945,
    } 
        
}
```

If the subscriber doesn't know the id, but knows how to generate it, it can replace the proposedState with a function.  xtal-state-update will evaluate this function, and check if the result has a property called 'then' of type function.  It will then assume that it is a promise, and evaluate the promise.  Only after the promise is completed will the resulting object be merged into the history object.

If an existing router is in place, some listener can replace the url with the existing routing function used to open new url's.  The entire detail object, containing the four properties, will be passed to that function.  The routing function will only be called after the detail promise is finished (if applicable);

But I can't see a use case for returning a function that evaluates to a promise here.

The title property seems to not yet have any use yet, so the subscriber can replace it if so desired, but it should replace it with another string.



xtal-state-update was ~888B (minified and gzipped).



## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) installed. Then run `polymer serve` to serve your element locally.

## Viewing Your Element

```
$ polymer serve
```

## Running Tests

```
$ polymer test
```

Your application is already set up to be tested via [web-component-tester](https://github.com/Polymer/web-component-tester). Run `polymer test` to run your application's test suite locally.
