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

xtal-state-parse is another web component that helps with parsing the address bar url and populating history.state object when the page loads.  

xtal-state-parse extends xtal-state-update (and hence benefits from support for namespacing the history object, and the ability to merge different sections together).  But xtal-state-update can (and will likely) be sprinkled repeatedly throughout the application, cozying up to anything that needs to update history.state.  

In contrast, there is only one address bar to contend with.  The placement of the xtal-state-parse web component instance(s) should be as close to the address bar as possible :-).  I.e. perhaps at the top of the body tag, or even inside the header.

This (or these multiple?) xtal-state-parse web component(s) will only do anything (i.e. populate the initial history.state object) if at least one of them finds history.state starting out null.  If history.state starts out with actual state, then we assume this is due the user refreshing, or clicking on the backbutton, and xtal-state-parse stays out of it.

For large complex applications, it may make sense to have multiple xtal-state-parse's, all next to each other, which may match on different patterns from different locations of the location object.  This is likely to work okay, because of xtal-state-*'s support for merging, rather than overwriting the history.state object.

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

The regular expression named group capture supports only populating an object with a flat list of fields -- no nested object support.  For quite complex applications requiring nested objects going into history.state, you will need to utilize the underlying support for nested objects using the where-path attribute.  

### Writing to the location object [TODO]

```html
<xtal-state-serialize destination="location.pathName" between="/view/" and="/" from="MilkyWay.Earth.UnitedStates.Texas.Montgomery.CutAndShoot" replace-with-pattern=""></xtal-state-serialize>
```

watches for history changes.  It does the following:

1)  Serializes the history.state object according to the following rules:
  a)  The optional from parameter specifies a sub property selector to a section of history.state.
  b)  Only fields from the selected object will be serialized.  No sub properties.
  c)  A string is formed by alphabetizing the fields and creating a single string from the fields, that looks like a css string: propertyA:valueA;propetyB:valueB
  d)  The replace-with-pattern attribute / property specifies the regular expression to be used, on apply the [replace with named capture groups method](http://2ality.com/2017/05/regexp-named-capture-groups.html#replace-and-named-capture-groups) on the string formed in c) above.

2)  If multiple xtal-state-serializes are used, they will all search for a previous sibling instance of xtal-state-serializes.  If no such previous sibling is found, it assumes the role of "master" updater.  None of the others actually call history.push(or replace)State.  The master only calls history.push(or replace)State when its updateCount matches all the others, and it consolodates all the changes into one.


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
