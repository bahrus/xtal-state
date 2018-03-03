# \<xtal-state\>

History api web component wrapper

xtal-state is a dependency free, 850B (gzipped and minified) web component that provides a thin, declarative wrapper around the [history api](https://developer.mozilla.org/en-US/docs/Web/API/History_API), with a few twists.

xtal-state recognizes that most modern client-centric web applications use the history api as the foundation for routing.  But the history api can also be viewed as a rudimentary global state management system, including built-in time travel support via the back / forward buttons.  This component is designed to help leverage the latter perk of the history api, while attempting to avoid breaking existing routing solutions..  In a nutshell, xtal-state strives to minimize the chances of losing history state changes made from logic external to xtal-state.

## Listening for changes

xtal-state listens for all history changes, and it emits an event that local components can bind to. 

For example, using a JSX library that can listen for custom events, like Preact, we can have code like:

```JSX
<xtal-state onHistory-state-changed={this.handleNewsFlash}></xtal-state>
``` 

With Polymer, one would instead typically use the following for declarative syntax:

```html

<xtal-state history-state="{{myNarrative}}"></xtal-state>

```

Other template frameworks follow similar patterns.

## Applying changes

xtal-state provides three properties that allow the developer to declaratively modify the state.

With Polymer syntax, this would look as follows:

```html

<xtal-state set-state-and-push source="[[watchedObject]]" ></xtal-state>

<xtal-state set-state-and-replace source="[[watchedObject]]"></xtal-state>

```

The set-state-and-push boolean property specifies that we want to update the history object based on the watchedObject changes, and mark this as a new state in the history.

The set-state-and-replace will cause the previous state change to be skipped over when going back using the back button.  The MDN article linked above explains this much better.

But unlike the native history.pushState and history.replaceState methods, xtal-state attempts to preserve what was there already.  If the source property is of type object or array, it creates a new empty object {}, then merges the existing state into it, then merges watchedObject into that.  It uses object.assign to do the merge.


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
