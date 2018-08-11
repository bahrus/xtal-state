# \<xtal-state\>

xtal-state is a Web component wrapper around the history api.

This npm package contains three ES6 Modules:  xtal-state-commit.js, xtal-state-update.js, and xtal-state-watch.js, which define custom elements with the given file name.



## Updating history.state

xtal-state-commit is a lightweight custom element that simply posts (overwrites) the history.state object.

xtal-state-update extends xtal-state-commit, with the following features:

1)  The ability to *merge* changes to the existing history.state object, if it exists, so that other pieces of code that modify history.state won't be lost.
2)  The ability to specify a "path" within the history.state object, where the change should be made.
3)  An event-based validation / data extraction step that allows users of the component to asynchronously persist state changes to a remote database, and keep what is actually stored in the history.state relatively small.

Syntax:


```html
<!-- Polymer notation -->
<xtal-state-update make history="[[watchedObject]]" title="myTitle" url="/myURL" ></xtal-state-update>

<xtal-state-update rewrite history="[[watchedObject]]" title="myTitle" url="/myURL"></xtal-state-update>

```

## Observing history.state

xtate-state-watch watches for all changes to history.state, and, optionally, can filter that object for a subsection that local components might be interested in.  It fires an event 'derived-history-changed' when the (adjusted) history.state changes. It also provides an event-based data injection step, so that the sparse history.state object can be (asynchronously) "hydrated" with detail information before firing the "derived-history-changed' event.

All three files are combined into a single IIFE class script file, xtal-state.js, which totals 2kb minified and gzipped.  

Syntax:

```html
<xtal-state-watch 
    watch derived-history="{{policeBlotter}}" 
    where-path="MilkyWay.Earth.UnitedStates.Texas.Montgomery.CutAndShoot">
</xtal-state-watch>
```


## Transcribing state to/from the address bar

### Parsing

xtal-state-parse is another web component that helps with parsing and generating the mapping between the address bar url and the history.state object.  It relies on the regular expression [named capture group enhancements](https://github.com/tc39/proposal-regexp-named-groups) that are part of ES 2018.  Only Chrome supports this feature currently.


[XregExp](http://xregexp.com/) is a library that inspired this spec, and that can provide a kind of polyfill for browsers that don't support named capture groups yet. The code checks if this alternative library is present.  If not, it uses the native regexp native function. [TODO]

Syntax:

```html
<xtal-state-parse parse="location.href" with-url-pattern="https://(?<domain>[a-z\.]*)/factory-mind/(?<article>[a-z0-9-]*)" ></xtal-state-parse>

```

Note the two captured named group fields:  "domain" and "article".

If the history.state object is empty, and the url has the form: https://medium.com/factory-mind/regex-tutorial-a-simple-cheatsheet-by-examples-649dc1c3f285

then the syntax above will initialize history.state to:

```JSON
{
    "domain":"medium.com",
    "article":"regex-tutorial-a-simple-cheatsheet-by-examples-649dc1c3f285"
}
```

### Derived url parameter [TODO]

<xtal-state-update make history with-url-pattern=""></xtal-state-update>


## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) and npm (packaged with [Node.js](https://nodejs.org)) installed. Run `npm install` to install your element's dependencies, then run `polymer serve` to serve your element locally.

## Viewing Your Element

```
$ polymer serve
```

## Running Tests

```
$ polymer test
```

Your application is already set up to be tested via [web-component-tester](https://github.com/Polymer/web-component-tester). Run `polymer test` to run your application's test suite locally.
