# \<xtal-state\>

\<xtal-state\> provides declarative wrappers around the [history api](https://developer.mozilla.org/en-US/docs/Web/API/History_API), with a few twists.

## Problem Statement

A unit of the CIA, led by Agent Sarah Walker, is investigating a series of mysterious disappearances of prominent CEO's, artists, and scientists from around the world, each of them leaving behind the same note:

>Who is Soorjo Alexander William Langobard Oliphant Chuckerbutty III?

Agent Walker sends recent recruit Chuck Bartowski to visit Chuckerbutty's tombstone in Paddington, in search of clues.

Chuck is a lanky, earnest looking twenty-something with tangled, somewhat curly dark hair.  He works at Buy-more as a computer service technician, after being expelled from Standford University's CS Program. Chuck is relieved and excited to be sent away on his first solo mission.  Relieved, because he had just admitted to his feelings for Agent Walker the previous day, who stood there, stoically.

"We should keep our relationship purely professional" she responded.  But was there a faint glimmer of ambiguity in her face?  Or was Chuck just desperate for any sign of mutual attraction?  Anyway, things had become rather awkward between them -- and going on this mission would help him keep his mind off of Sarah.

Chuck decided he would kill two birds with one stone, and brings along one of his customer's Windows 7 laptops that needs updating to Windows 10.  He begins the upgrade at the Hollywood Burbank airport while waiting for his flight to London.

When Chuck arrives at the gravesite of Oliphant Chuckerbutty some 12 hours later, he is disappointed to see that the place was rather neglected, with no interesting markings that might lead anywhere.  Feeling like a total failure, Chuck sits down on the wet earth, burying his head in his hands.  Twenty minutes go by, and then Chuck hears someone whistling a tune that sounds eerily familiar, yet new and exciting at the same time.  The tune was clearly written by Krzysztof Penderecki, and obviously harkens to the melodies of his Symphony No. 3, "Threnody to the Victims of Hiroshima."  But it is something Chuck has never heard before.  Of course! This must be the rumored Symphony No. 4, dedicated to the victims of war and fascism, but Chuck knew Penderecky had not yet completed the work.  Pendercky was one of the recent disappearances, who had left behind the mysterious note!

Chuck spins around to determine the source of the melody.  It's a young lad, the cemetary's groundkeeper.

"Where did you learn that piece that you are whistling?  I haven't seen any recordings of it yet!" Chuck demands.

Startled at first, the lad quickly regains his composure. 

"Who is Soorjo Alexander William Langobard Oliphant Chuckerbutty III?" he asks, playfully, and turns around and walks away.

It was then that Chuck spotted the tatoo on the back of groundkeeper's neck.  Chuck experiences one of his flashes, that started the day his old roomate, Bryce, had sent Chuck a high speed tansmission of the most valuable CIA secrets, which somehow seeped right into Chuck's subconscious.

That tatoo was also spotted on Czech politician Vít Jedlička!

Whipping out his laptop, which is still undergoing the Windows 10 update, Chuck opens up the MS Edge browser, and pages through the introductory tutorial.  Once that's done, he opens up a top secret web site maintained by the CIA.  The website allows Chuck to select any business he wanted, and it displays a tree-like org-chart, starting from the CEO on down.  It allows Chuck to add multiple such companies on the same page, showing different org charts, so Chuck can look for patterns.  Chuck expands the nodes on each company whose CEO had disappeared -- Amazon, Whole Foods (prior to the merger), Overstock.com, Craiglist, the Dallas Mavericks... In each case Chuck is able to find Vít Jedlička, working the cigar stand closest to the CEO's office, joining a week or two before the CEO disappeared!

Chuck can't wait to send Sarah the page he is on, which so clearly shows that Vít Jedlička must be involved somehow.  Getting a warning that the fourth reboot would start in 15 seconds, Chuck quickly copies the url in the address bar, and sends it to Agent Walker's secured email account, just in the nick of time before the browser shuts down for the reboot.

\<xtal-state\> is a set of dependency free web components that help applications build url's like the one that Chuck sent Sarah.  It allows sharing complex views of an application state.

## Some browser-based obstacles

The benefit of updating the window.location object (location.href and/or location.hash) as the user interacts with a web site, is that it allows the user to copy and paste the url corresponding to what they are seeing, and communicate it via email, text message etc.  Others can then open the application and zoom right to the place the user was excited to convey.  And these days, many browsers support a sharing button, external to the web site, which sends the current url.  Some browsers, like Firefox, include the hash tag part ("hash fragment") of the url.  Unfortunately, some browsers, like Chrome, haven't seen the light on this.  I argue this is quite problematic.  Sites like GitHub, allow you to select a line number, which causes a hash location update to the url, specifying the line number.  Why does Chrome assume the user doesn't want to share that part of the URL?  That's a rather rude assumption, it seems to me.  Even inserting the "bang" before the hash doesn't help.

Because the sharing buttons are external to the website, the website doesn't get notified when the user is about to invoke this button, so whatever is in the address bar at that moment (with the exception of Chrome's rude ignoring of the bookmark) will be exactly what is sent.


The [webshare api](https://developers.google.com/web/updates/2016/09/navigator-share) also rests on sending a url, and would benefit in the same way.  Search results is another example, but hash fragments need to [include the bang symbol](https://www.oho.com/blog/explained-60-seconds-hash-symbols-urls-and-seo) for them to be honored.    Aside from sharing with others, a user may want to bookmark different parts of an application, so jumping to that part of the application is more convenient.  Here, Chrome doesn't fail us, and it includes the bookmark portion of the url in the bookmark.  Thanks, Chrome!

Unfortunately, our [friends at Microsoft](https://www.computerworld.com/article/2534312/operating-systems/the--640k--quote-won-t-go-away----but-did-gates-really-say-it-.html) have determined that [2k ought to be enough for anybody](https://stackoverflow.com/questions/16247162/max-size-of-location-hash-in-browser).

For an application with a large amount of complexity, then, sharing the URL to a particular state of an application might need to be accompanied by some sort of external storage on these browsers.  

The smallest maximum size of the history api appears to be 640k characters (ironically).  Here even Microsoft has been more genererous (their limit is 1 MB).  So we have a major mismatch (two orders of magnitude) between the amount of data we can store in the history api vs what can be serialized in the address bar of approximately 7% of browser used today.

The simplest solution to this dilemma would be to persist the history.state object to a central database with every modification, and to just add the id pointing to this object to the address bar somewhere.  The web components provided here will certainly not get in the way of doing just that, and will in fact provide some help in doing this.

One example of an existing service that requires no token or account, where one could store the stringified history.state object, is [myjson.com](http://myjson.com/) (maximum size unknown.)   

But this approach isn't very efficient.  It would require rapidly uploading a larger and larger object / JSON string as the user's application state grows, which could happen quite quickly.

Hopefully, having gone through all that background, what these web components are doing will make more sense.  As we will see, they don't strive to solve every problem under the sun, but rather to establish the ground work so applications can achieve what they want more easily.

# \<xtal-state-watch\>

## Listening for history changes

*xtal-state-watch* is (for now) a ~700B (minified and gzipped) js custom element that listens for all history changes, and it emits an event that local components can bind to. 

For example, using a JSX library that can listen for custom events, like Preact, we can have code like:

```JSX
<xtal-state-watch watch onHistory-changed={this.handleNewsFlash}></xtal-state-watch>
``` 

With Polymer, one would instead typically use the following for declarative syntax:

```html

<xtal-state-watch watch history="{{myTruth}}"></xtal-state-watch>

```

Other template frameworks follow similar patterns.

The boolean attribute/property "watch" is there so neighboring elements can ignore history changes when the attribute is removed, or the property is set to false.  This might be useful, for example, if an element is present but hidden.  When watch becomes true, it will notify the neighbors of the new state of history.

## Departmentalizing, Part I

It's likely that most components won't be interested in the entire state object, assuming it is used for managing complex state in a large complex application.  Large numbers of components subscribing to every history change event, then, could be problematic -- in short we have a scalability problem.  We employ a few tweaks that might allow us to keep more complex, comprehensive solutions at bay.

The first such tweak is to specify only a certain part of the history which is of interest to that area of the application.  We enhance the markup:

```html
<xtal-state-watch 
    watch history="{{policeBlotter}}" 
    where-path="MilkyWay.Earth.UnitedStates.Texas.Montgomery.CutAndShoot">
</xtal-state-watch>
``` 

As we will see later, as long as you update the history.state object using the web components described in this document, then the where-path will limit which events the specific instance will respond to.  The downside of using this attribute is that if other external logic  decides to update the history at this specific location using native JavaScript, this web component won't detect that,for now.  Solving that issue is a TODO item.

## Support for reference pointers, part I [TODO]

Suppose we want to use the history to reference a large object or a  function.  In the latter case, functions can't be stored in the history.state because it doesn't support cloning.  And the size of the history state is also limited (to 640K, Bill Gates's favorite number).

xtal-state-watch supports syntax where we specify how to populate an object, based on an ID:

```JavaScript
    [{
        caseNumber: 0102945
        "get()":"refs.getDetails"
    }]
```
```html
<!-- Polymer binding syntax -->
<xtal-state-watch watch history="{{policeBlotter}}"
    where-path="MilkyWay.Earth.UnitedStates.Texas.Montgomery.CutAndShoot"
    refs="[[courtCaseIndexLookup]]"
>
</xtal-state-watch>
```


Here we are assuming that the object passed to the refs property: courtCaseIndexLookup has a method called getDetails.  xtal-state-watch will pass the method the object containing the "get()" key.  getDetails can then fill in the details, either immediately, or via a promise.  Once the details are filled in, the binding event history-changed will be called, and the UI will be able to work with a more complete representaton of the state than what is actually stored in the history api.  Our goal, remember, is to keep the history api state object as small as possible, while not imposing arbitrary limits on the size of the objects the UI can work with. 

## Applying changes

*xtal-state-update* is another custom element, that recognizes that most modern client-centric web applications use the history api as the foundation for routing.  But the history api can also be viewed as a rudimentary global state management system, including built-in time travel support via the back / forward buttons.  This component is designed to help leverage the latter perk of the history api, while attempting to avoid breaking existing routing solutions.  In a nutshell, xtal-state-update strives to minimize the chances of losing history state changes made from logic external to xtal-state.

xtal-state-update provides three properties that allow the developer to declaratively modify the global history.state object.

With Polymer syntax, this would look as follows:

```html

<xtal-state-update make history="[[watchedObject]]" ></xtal-state-update>

<xtal-state-update rewrite history="[[watchedObject]]"></xtal-state-update>

```

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

## Support for reference pointers, part II [TODO]

Suppose we have a new police blotter entry someone entered:

```JavaSript
    [{
        caseNumber: 'unknown',
        reporter: 'Michael Davis',
        age: 20
        address:  '112 Privet Drive',
        incident: `Six men, their faces covered with red bandanas, got out of the Cherokee carrying a knife, baseball bat, billy club and rolling pin," said Davis, 20.

        "I knew when I saw the rolling pin that something bad was going to go down," Davis said.
        `,
        "set()":"refs.persistChanges"
    }]
```

We need to pass xtal-state-update an object which has persistChanges method, as the JavaScript above indicates:

```html
<xtal-state-update make history="[[newPoliceBlotterEntry]]"  
    where-path="MilkyWay.Earth.UnitedStates.Texas.Montgomery.CutAndShoot"
    refs="myObjectPersistenceEngine"
>
</xtal-state-update>
```

the method persistChanges can return an object, which might contain the id given when saving this new record.  This is what will get stored in the history object.  For example it might return

```JavaScript
   [{
        caseNumber: 0102945,
        "get()":"refs.getCaseDetails"
    }]
```

  

xtal-state-update is ~888B (minified and gzipped).



## Recording history [TODO]


xtal-state-transcribe listens for all history api changes, and it applies a user provided filter function, which can filter out those parts of history object which pertain only to the external routing solution.  xtal-state-transcribe recognizes that most modern client-centric web applications have abandoned the location.hash portion of the URL, in favor of location.href.  This opens up the location.hash as an area we can use to indicate location where the storage of the full (or a subset of) the current history is deposited.

After applying the filter, xtal-state-transcribe JSON serializes/stringifies the remaining object, and checks if the resulting string is different from before.  If it is, it sets location.hash to that value (starting with the bang symbol).

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
