# Backbone.statefulEvents.js

`Backbone.statefulEvents.js` is a very simple extension to Backbone
Views that makes DOM event callbacks dependent on application state.

In simpler terms, you can assign callbacks that *only* get fired when
the application is in the right state; the events are ignored otherwise.
You can also assign multiple callbacks to the same DOM
element that will each be called based on the current application
state.

Best explained with an example (check the examples directory for a
working example):

```javascript
var SomeView = Backbone.StatefulEventView.extend({

  // Use this just like the events hash.
  // Mandatory: pass-in both a state and an event name here.
  statefulEvents: {
    'editing keydown': 'trackEdit',
    'overlay keydown': 'cancelIfRequired',
    'overlay mousedown .close': 'cancel'
  },

  // You can still use the default `events` hash.
  events: {
    'mousedown' : 'onMouseDown'
  }

  // One way to define the current state. If there is no getState()
  // method present in the view, we check for presence of getState()
  // in this view's model.

  // It is *mandatory* to have a getState() method either in the view
  // or model.
  getState: function () {
    return applicationModel.getCurrentState();
  }

  // This will be called on keydown, when current state is 'editing'.
  trackEdit: function (e) { },

  // This will be called on keydown, when current state is 'overlay'.
  cancelIfRequired: function (e) { },

  // This will be called on mousedown for the .close element,
  // only in the overlay state.
  cancel: function (e) { }
});
```

## Usage

  0. Import backbone.statefulEvents.min.js.
  1. Create a view that extends `Backbone.StatefulEventView`
  2. Ensure that either the view or its model define a `getState`
     method.
  3. Bind callbacks to specific application states, using the
     `statefulEvents` hash.

Note: it may be inefficient to use this for setting multiple callbacks
for frequent events like `mousemove`.

## Credits

Thanks to Jeremy Ashkenas and the whole Backbone.js community for
creating and maintaining such a great framework!

## Todo

Write test cases!
