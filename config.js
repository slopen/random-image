require.config({
  paths: {

    "jquery"                : 'http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min',
    "underscore"            : 'http://cdnjs.cloudflare.com/ajax/libs/lodash.js/2.2.1/lodash.compat.min',
    
    // launch demo
    "app"                   : 'app'
  }

});

var deps = [

    // launcher
    'app', 

  	// libraries
    'jquery',
    'underscore'
];

require (deps, function (app, $) {

  console.log('loading...');

  $(function(){
    console.log('opening...');
    app.start ();  
  })
  

});