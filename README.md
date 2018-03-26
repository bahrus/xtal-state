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

## Some browser-based barriers

The benefit of updating the window.location object (location.href and/or location.hash) as the user interacts with a web site, is that it allows the user to copy and paste the url corresponding to what they are seeing, and communicate it via email, text message etc.  Others can then open the application and zoom right to the place the user was excited to convey.  [At least, that's what I'd like to see happen, but most of the time, especially for complex business applications, this doesn't work].  And these days, many browsers support a sharing button, external to the web site, which sends the current url.  Sensible browsers, like Firefox, and Edge, include the hash tag part ("hash fragment") of the url.  Unfortunately, some browsers, like Chrome, haven't seen the light on this.  I argue this is quite problematic.  Sites like GitHub allow you to select a line number, which causes a hash location update to the url, specifying the line number.  Why does Chrome assume the user doesn't want to share that part of the URL?  That's a rather rude assumption, it seems to me.  Even inserting the "bang" after the hash doesn't help.  Bad Chrome!

Because the sharing buttons are external to the website, the website doesn't get notified when the user is about to invoke this button, so whatever is in the address bar at that moment (with the exception of Chrome's rude ignoring of the bookmark) will be exactly what is sent.


The [webshare api](https://developers.google.com/web/updates/2016/09/navigator-share) also rests on sending a url, and would benefit in the same way.  Search results is another example, but hash fragments need to [include the bang symbol](https://www.oho.com/blog/explained-60-seconds-hash-symbols-urls-and-seo) for them to be honored.    Aside from sharing with others, a user may want to bookmark different parts of an application, so jumping to that part of the application is more convenient.  Here, Chrome doesn't fail us, and it includes the bookmark portion of the url in the bookmark.  Thanks, Chrome!

Web servers have, for security reasons, I think, needed to impose limits on the size of a url that gets sent, which is perfectly fair.  But the hash fragment doesn't get sent to the server, so in theory browsers can allow more flexibility in terms of the size of this string.  And indeed, browsers have generally been quite permissive with respect to the hash fragment.  True, using the history api, one can also update the non hash part of the url without that modification going to the server.  But unfortunately, should the user want to click on the refresh button, or send such a url to a friend, that entire string will be sent to the server, which could result in an ungraceful server error, perhaps containing text of an accusatory nature.  So if we want to encode complex state into the url, the hash fragment seems to be the most natural place to look.

Unfortunately, our [friends at Microsoft](https://www.computerworld.com/article/2534312/operating-systems/the--640k--quote-won-t-go-away----but-did-gates-really-say-it-.html) have determined that [2k ought to be enough for anybody](https://stackoverflow.com/questions/16247162/max-size-of-location-hash-in-browser).

For an application with a large amount of complexity, then, sharing the URL to a particular state of an application might need to be accompanied by some sort of external storage on these browsers.  

The smallest maximum size of the history api appears to be 640k characters (ironically).  Here even Microsoft has been more genererous (their limit is 1 MB).  So we have a major mismatch (two orders of magnitude) between the amount of data we can store in the history api vs what can be serialized in the address bar of approximately 7% of browser used today.

The simplest solution to this dilemma would be to persist the history.state object to a central database with every modification, and to just add the id pointing to this object to the address bar somewhere.  The web components provided here will certainly not get in the way of doing just that, and will in fact be somewhat helpful for this approach.

One example of an existing service that requires no token or account, where one could store the stringified history.state object, is [myjson.com](http://myjson.com/) (maximum size unknown.).  NB:  Using such a service, and blindly accepting any id without serious verification, could put a damper on your weekend. 

And this strategy isn't very efficient.  It would require rapidly uploading a larger and larger object / JSON string as the user's application state grows, which could happen quite quickly.

Hopefully, having gone through all that background, what these web components are doing will make more sense.  As we will see, they don't strive to solve every problem under the sun, but rather to establish the ground work so applications can achieve what they want more easily.


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

As we will see later, as long as you update the history.state object using the web components described in this document, then the where-path will limit which events the specific instance will respond to.  This attribute isn't all-powerful however.   If other external logic  decides to update the history outside the path specified, this web component will respond.  I.e. it will oversubscribe.  Solving that issue (if it is solvable?  maybe using proxies?) is a TODO item.

If you are using good UI components which are optimized for dealing with small changes to the model (e.g. a virtual DOM), then hopefully the consequences of this oversubscription (for now) won't be too bad.

## Data Injection [TODO]

Suppose we want to use the history to reference a large object or a  function.  In the latter case, functions can't be stored in the history.state because it doesn't support cloning.  And the size of the history state is also limited (to 640K, Bill Gates's favorite number).  Not to mention that if we want to serialize that history to the address bar, it should be *really* small because Microsoft.

xtal-state-watch supports asking containing elements for help filling in the details before posting the enhanced history to its peers.  So say the following is put into history.state:

```JavaScript
    {
        caseNumber: 0102945
    }
```

We can dispatch a request that passes up the DOM Tree, providing a name for the event using the event-name attribute:

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

Subscribers can modify the proposedState, reject doing anything by setting abort=true, or modify the title or route.

If an existing router is place, some listener can replace the url with the existing routing function used to open new url's.

Each of these properties can be turned into functions, that may optionally return promises.  xtal-state-update will first perform the function,and await the promise to complete if applicable before committing to the history api.


For example, a subscriber can return a promise, which, when done, might contain the id given when saving this new record.  The result of the promise is what would get stored in the history object.  For example it might return

```JavaScript
   {
        caseNumber: 0102945,
    }
```

If a function is returned for route, it will be passed the proposedState.

  

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
