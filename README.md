# \<xtal-state\>

xtal-state is a Web component wrapper around the history api.

This npm package contains three ES6 Modules:  xtal-state-commit.js, xtal-state-update.js, and xtal-state-watch.js, which define custom elements with the given file name.

## Updating history.state

xtal-state-commit is a lightweight custom element that simply posts (overwrites) the history.state object.

xtal-state-update extends xtal-state-commit, with the following features:

1)  The ability to *merge* changes to the existing history.state object, if it exists, so that other pieces of code that modify history.state won't be lost.
2)  The ability to specify a "path" within the history.state object, where the change should be made.
3)  An event-based validation / data extraction step that allows users of the component to asynchronously persist state changes to a remote database, and keep what is actually stored in the history.state relatively small.

## Observing history.state

xtate-state-watch watches for all changes to history.state, and, optionally, can filter that object for a subsection that local components might be interested in.  It fires an event 'derived-history-changed' when the (adjusted) history.state changes. It also provides an event-based data injection step, so that the sparse history.state object can be (asynchronously) "hydrated" with detail information before firing the "derived-history-changed' event.

All three files are combined into a single IIFE class script file, xtal-state.js, which totals 2kb minified and gzipped.  

## Initializing state;

xtal-state-transcribe is another web component that helps with parsing and generating the mapping between the address bar url and the history.state object.  It relies on the regular expression [named capture group enhancements](https://github.com/tc39/proposal-regexp-named-groups) that are part of ES 2018.  As such, this web component is compatible with exactly 0% browsers today.

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
