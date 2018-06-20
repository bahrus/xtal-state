# \<xtal-state\>

xtal-state is a Web component wrapper around the history api.

This npm package contains three ES6 Modules:  xtal-state-commit.js, xtal-state-update.js, and xtal-state-watch.js, which define custom elements with the given file name.

xtal-state-commit.js is a lightweight custom element that simply posts (overwrites) the history.state object.

xtal-state-update.js extends xtal-state-commit, with the following features:

1)  The ability to *merge* changes to the existing history.state object, if it exists, so that other pieces of code that modify history.state won't be lost.
2)  The ability to specify a "path" within the history.state object, where the change should be made.
3)  An event-based validation step that allows users of the component to asynchronously persist state changes to a remote database, and keep what is actually stored in the history.state relatively small.

xtate-state-watch watches for all changes to history.state, and, optionally, can filter that object for a subsection that local components might be interested in.  It fires an event 'filtered-history-changed' when it the state is change. 

All three files are combined into a single IIFE class script file, xtal-state.js, which totals 2kb minified and gzipped.  


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
