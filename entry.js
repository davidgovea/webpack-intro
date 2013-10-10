// Run Modernizr on our page
require('./bower_components/modernizr/modernizr.js');

// Require jquery and Backbone
var $ = require('./bower_components/jquery/jquery.js'),
    Backbone = require('backbone'); // Use backbone from npm

// Include jquery.scrollTo (does not export anything)
require('./bower_components/jquery.scrollTo/jquery.scrollTo.js');


// Simple example:
var MyView  = Backbone.View.extend({/* ... */}),
    MyModel = Backbone.Model.extend({/* ... */});

// Much better:
// var MyView  = require('./src/MyView'),
//     MyModel = require('./src/MyModel'),


// DOM ready - start things up
$(function(){
    var view  = new MyView(),
        model = new MyModel();

    console.log("Backbone modules initialized");
});


// Code-splitting example
//
// For touch devices, load hammerjs ASYNCHRONOUSLY
if (Modernizr.touch) {
    console.log("Loading touch libraries");

    require.ensure([/* AMD-style dependencies */], function(require){

        // require.ensure creates a bundle split-point
        var Hammer = require('hammerjs');

        // Hammer loaded via XHR - ready to initialize
        // Hammer(/* ... */);
    });

} else {
    console.log("No touch features detected - skipping unneeded libraries");
}