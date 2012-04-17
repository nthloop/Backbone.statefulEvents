
// This is a simple example of how you can use Backbone.StatefulEventView.

var App = Backbone.Model.extend({
  states: ['rectangles', 'circles', 'eraser'],
  defaults: { state: 'rectangles' },

  initialize: function () {
    this.canvas = new CanvasView({ el: $('#drawingCanvas')[0], application: this });

    // Typically, the below functionality will be in a Application View,
    // or other sub-views. Doing it wrong, just for brevity's sake.
    this.on('change:state', function (model, state) {
      $('.toolName').text(state);
    });

    var app = this;
    $('#toggleButton').click(function () {
      var oldState = app.get('state');
      var index = _.indexOf(app.states, oldState) + 1;
      if (index >= app.states.length) index = 0;
      app.set('state', app.states[index]);
    });
  }
});

var CanvasView = Backbone.StatefulEventView.extend({

  initialize: function () {
    this.application = this.options.application;
    this.ctx = this.el.getContext('2d');
    this.clearCanvas();
  },

  // Return the application state.
  getState: function () {
    return this.application.get('state');
  },

  // When in the 'draw' mode, clicks on the canvas will invoke drawSquare()
  // In the 'clear' mode, clicks will invoke clearCanvas()
  statefulEvents: {
    "rectangles click": "drawSquare",
    "circles click": "drawCircle",
    "eraser click": "erase"

  },

  drawSquare: function (e) {
    this.ctx.fillStyle = '#FA0';
    this.ctx.fillRect(e.offsetX - 10, e.offsetY - 10, 20, 20);
  },

  drawCircle: function (e) {
    this.ctx.fillStyle = '#AF5';
    this.ctx.beginPath();
    this.ctx.arc(e.offsetX, e.offsetY, 10, 0, 2 * Math.PI);
    this.ctx.fill();
  },

  erase: function (e) {
    this.ctx.fillStyle = "#333";
    this.ctx.fillRect(e.offsetX - 30, e.offsetY - 30, 60, 60);
  },

  clearCanvas: function () {
    this.ctx.fillStyle = "#333";
    this.ctx.fillRect(0, 0, this.el.width, this.el.height);
  }

});



var app = new App();
