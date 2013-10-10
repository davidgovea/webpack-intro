## An introduction to webpack: Cross develop for Node and the Browser without forking around

With the various options available for managing client-side code, it can be tough to decide which path to go down.  There are many opinions in the AMD vs CommonJS argument, and there are 
plenty of information and guides for the most popular tools: [RequireJS](http://www.requirejs.org/) (AMD) and [browserify](http://browserify.org/) (CommonJS). I've recently read several accounts of [RequireJS users switching](http://esa-matti.suuronen.org/blog/2013/03/22/journey-from-requirejs-to-browserify/) [to browserify](http://codeofrob.com/entries/why-i-stopped-using-amd.html), mainly due to the lack of uniformity across front-end libraries. Incorporating a library into your project often requires a shim module file or a "light" project fork. Frustrating!

[Webpack](https://github.com/webpack/webpack) is an excellent project that just might be the browser require() you've always wanted.
### Notable features beyond browserify:
* Avoids boilerplate. **Can use AMD**, CommonJS, Labeled modules, and even sloppy/global libraries using [loaders](https://github.com/webpack/docs/wiki/loader-list)
* Intuitive **bundle splitting** (vs. browserify, which produces a single bundle per entry file)
* Fancy tools like ```require('./assets/style.css')``` like ```var tpl = require('./template.jade')```

So, lets put together a sample project to show the power of webpack.  
[Source](https://github.com/davidgovea/webpack-intro)

Install webpack:
```bash
npm install -g webpack
```

### Example Goals
1. Use jQuery, jQuery plugins, and Backbone in-browser with require
2. Use Bower for client-side library management
3. Conditionally require touch-libraries for applicable devices (bundle splitting)

#### Process
First, we set up our **package.json** and **bower.json** files with our dependencies:
* bower.json: ```modernizr```, ```jquery```, and popular plugin ```jquery.scrollTo``` 
* package.json: ```backbone``` and ```hammerjs```

**Note:** I've included hammerjs and backbone through npm, but including through bower would also work.  I prefer a project with a good package.json, but this is the beauty of webpack: work 
with what's available, and prevent trivial project forking.

Next, we set up our bare html file:  
**index.html**  
```html
<!DOCTYPE html>
<html>
<head><title></title></head>
<body>

    <script src="./bundle.js"></script>
</body>
</html>
```

And then, our "entry" script for the browser. Require() as usual!  
**entry.js**  
```js
// Run Modernizr on our page
require('./bower_components/modernizr/modernizr.js')

// Require jquery and Backbone
var $ = require('./bower_components/jquery/jquery.js'),
    Backbone = require('backbone'); // Use backbone from npm

// Include jquery.scrollTo (does not export anything)
require('./bower_components/jquery.scrollTo/jquery.scrollTo.js');

...

```
If the explicit ```bower_components/``` path offends you, it is very easy to configure webpack to look in the bower_components folder, or to provide a module alias (for example, make every 
```require('underscore')``` load the ```lodash``` library instead).

Then we have some basic backbone objects and a domReady handler,  
```js
...

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
```

We can prepare our bundle for the browser now:  
```bash
$ webpack entry.js bundle.js
```  
Add the option ```--optimize-minimize``` to minify the bundle.  
```bash
$ webpack entry.js bundle.js

Hash: e3a43e0123c1e533fcde
Version: webpack 0.11.0-beta19
Time: 2111ms
    Asset    Size  Chunks             Chunk Names
bundle.js  420395       0  [emitted]  main       
   [0] ./entry.js 1269 {0} [built]
   [1] ./bower_components/modernizr/modernizr.js 50144 {0} [built]
   [2] ./bower_components/jquery/jquery.js 242142 {0} [built]
   [3] ./bower_components/jquery.scrollTo/jquery.scrollTo.js 7765 {0} [built]
   [4] (webpack)/buildin/amd-options.js 43 {0} [built]
   [5] (webpack)/buildin/module.js 251 {0} [built]
   [6] ./~/backbone/backbone.js 59498 {0} [built]
   [7] ./~/backbone/~/underscore/underscore.js 43566 {0} [built]
```
Note how ```underscore``` was automatically required (backbone dependency)

#### Bundle Splitting
For this portion, we will use ```Modernizr.touch``` to detect touch features, then **asynchrounously require** [hammer.js](https://github.com/EightMedia/hammer.js)

Continuing **entry.js**:  
```js
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

```
By wrapping our code in ```require.ensure```, webpack will **split** ```bundle.js``` into **two files**:
* ```bundle.js```: Modernizr, jquery, jquery.scrollTo, backbone, and underscore
* ```1.bundle.js```: Hammer.js - loaded if touch features present

Excited yet?  
  
Our use of webpack at Cuttle has allowed us to keep our client-side codebase clean and testable, and has facilitated the sharing of code between the front- and back-ends (most significantly 
our model + validation modules).

Take a look at webpack's [getting started]() and [docs]() pages for more information.  

The next article in this series will cover how to massage unruly libraries using webpack's ```imports``` loader, and the seamless require()'ing of templates, styles, and other assets.

