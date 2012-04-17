;(function (Backbone, _) {

// Backbone.StatefulEventView.js, v0.1.0

// (c) 2012 Ankit Solanki, nth loop.
// May be freely distributed under an MIT license.


// Extend Backbone.View to create Backbone.StatefulEventView.
Backbone.StatefulEventView = Backbone.View.extend({

  // Overload `Backbone.View.delegateEvents`.
  // Call both the original `delegateEvents` and our
  // `delegateStatefulEvents` methods.
  delegateEvents: function (events) {
    Backbone.View.prototype.delegateEvents.call(this, events);
    this.delegateStatefulEvents();
  },

  // The `delegateStatefulEvents` method behaves like `delegateEvents`.
  // The main difference is that it checks for a `this.statefulEvents` hash,
  // that should consist of:
  //
  // *{"stateName eventName optionalSelector": "callback"}*
  delegateStatefulEvents: function (events) {
    var keys, i, match, state, eventName, selector, key, method;

    // Verify that a `getState` method exists in this view, or its model.
    if (!_.isFunction(this.getState)) {
      if (!this.model || !_.isFunction(this.model.getState)) {
        throw new Error('A Backbone.StatefulEventView or its model must define a getState() method');
      }
    }

    events = this.statefulEvents;
    if (!events) return;

    keys = _.keys(events);

    for (i = 0; i < keys.length; i++) {
      key = keys[i];

      method = events[key];
      if (!_.isFunction(method)) method = this[events[key]];
      if (!_.isFunction(method)) throw new Error('Event "' + events[key] + '" does not exist');

      match = key.match(Backbone.StatefulEventView._splitter);
      if (!match || match.length <= 2) {
        throw new Error(
          'The key "' + key + '" passed to statefulEvents is invalid.\n'
            + 'It needs both a state and an event name.');
      }

      state = match[1]; eventName = match[2]; selector = match[3];

      // Wrap the method so that it is only invoked in the given state.
      method = this._invokeMethodOnlyInGivenState(method, state);

      // Ensure that undelegateEvents() unbinds this event listener, too.
      eventName += '.delegateEvents' + this.cid;

      if (selector === '') {
        this.$el.bind(eventName, method);
      } else {
        this.$el.delegate(selector, eventName, method);
      }
    }

  },

  // Creates a wrapper function that calls the given event
  // listener only when you are in the given state.
  _invokeMethodOnlyInGivenState: function (method, state) {
    return _.bind(function (e) {

      var currentState = _.isFunction(this.getState)
            ? this.getState()
            : this.model.getState();

      if (currentState === state) {
        return method.call(this, e);
      }
      return true; // Don't block the event in case it is to be ignored.
    }, this);
  }
});

// This is the RegEx splitter used to parse the `this.statefulEvents` hash.
Backbone.StatefulEventView._splitter = /^(\S+)\s+(\S+)\s*(.*)$/;
})(this.Backbone, this._);
