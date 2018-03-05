# \<xtal-state\>

History api web component wrapper

This solution provides two small, dependency-free custom elements that provide declarative wrappers around the [history api](https://developer.mozilla.org/en-US/docs/Web/API/History_API), with a few twists.

## Listening for history changes

*xtal-state-watch* is a ~700B (minified and gzipped) js custom element that listens for all history changes, and it emits an event that local components can bind to. 

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

## Departmentalizing, Part I [TODO]

It's likely that most components won't be interested in the entire state object, assuming it is used for managing complex state in a large complex application.  Large numbers of components subscribing to every history change event, then, could be problematic -- in short we have a scalability problem.  We could give up, and just say use MobX, or Redux in such cases, but instead we shall stick our fingers into the fan and try a few tweaks that might allow us to hold such solutions at bay.

The first such tweak is to specify only a certain part of the history which is of interest.  We enhance the markup:

```html
<xtal-state-watch 
    watch history="{{policeBlotter}}" 
    where-path="MilkyWay.Earth.UnitedStates.Texas.Montgomery.CutAndShoot">
</xtal-state-watch>
``` 

## Applying changes

*xtal-state-update* is another custom element, that recognizes that most modern client-centric web applications use the history api as the foundation for routing.  But the history api can also be viewed as a rudimentary global state management system, including built-in time travel support via the back / forward buttons.  This component is designed to help leverage the latter perk of the history api, while attempting to avoid breaking existing routing solutions.  In a nutshell, xtal-state-update strives to minimize the chances of losing history state changes made from logic external to xtal-state.

xtal-state-update provides three properties that allow the developer to declaratively modify the global history.state object.

With Polymer syntax, this would look as follows:

```html

<xtal-state-update make history="[[watchedObject]]" ></xtal-state-update>

<xtal-state-update rewrite history="[[watchedObject]]"></xtal-state-update>

```

The "make" boolean attribute/property specifies that we want to **update** the history object based on the watchedObject changes, and mark this as a new state in the history.

The "rewrite" boolean attribute/property will cause the previous state change to be skipped over when going back using the back button.  The MDN article linked above explains this much better.

But unlike the native history.pushState and history.replaceState methods, xtal-state-update attempts to preserve what was there already.  If the source property is of type object or array, it creates a new empty object {}, then merges the existing state into it, then does a [deep, recursive merge](https://davidwalsh.name/javascript-deep-merge) of watchedObject (in this example) into that.  

xtal-state-update is ~888B (minified and gzipped).

## Departmentalizing Part II [TODO]

To specify that the history path we want to write to is actually a sub path of the root object, we also use attribute where-path:

<xtal-state-update make history="[[policeBlotter]]"  
    where-path="MilkyWay.Earth.UnitedStates.Texas.Montgomery.CutAndShoot">
</xtal-state-update>

If the history state is null, or doesn't have a nested object hierarchy matching the long path specified above, xtal-state-update will first create such an object hierarchy before inserting the policeBlotter object.

xtal-state-update will not the path being updated.  xtal-state-watch components will ignore history updates if their where-path is not in alignment with thewhere-path of xtalstate-update.

## Recording history [TODO]

The benefit of updating the window.location object (location.href and/or location.hash) as the user interacts with a web site is that it allows the user to copy and paste the url corresponding to what they are seeing, and communicate it via email, text message etc.  Others can then open the application and zoom right to the place the user was excited to convey.  The [webshare api](https://developers.google.com/web/updates/2016/09/navigator-share) also rests on sending a url, and would benefit in the same way.  Search results is another example.    This was the original intention of bookmarks, and is used, for example, when we want to send the line number of a code snippet from github.  Speaking of bookmarks, aside from sharing with others a user may want to bookmark different parts of an application, so jumping to that part of the application is more convenient.

Unfortunately, our [friends at Microsoft](https://www.computerworld.com/article/2534312/operating-systems/the--640k--quote-won-t-go-away----but-did-gates-really-say-it-.html) have determined that [2k ought to be enough for anybody](https://stackoverflow.com/questions/16247162/max-size-of-location-hash-in-browser).

For an application of any complexity, then, sharing the URL to a particular state would need to be accompanied by some sort of storage.

xtal-state-transcribe helps with this.  xtal-state-transcribe recognizes that most modern client-centric web applications have abandoned the location.hash portion of the URL, in favor of location.href.  This opens up the location.hash as an area we can use to indicate location where the storage of the full (or subset of) the current history is deposited.

But where to deposit it?  There are lots of options, of course.  One option that requires no token or account is [myjson.com](http://myjson.com/) (maximum size unknown.)

One could also imagine scenarios where application developers want to 

```html
<xtal-state-transcribe deposit-when-fn transcribe-fn ></xtal-state-transcripe>
```  

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
