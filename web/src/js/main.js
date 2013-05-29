/* global console */
( function () {

  var TDF = window.TDF || {};

  TDF.init = function () {

	console.log('init');

  };

  // Document Ready
  jQuery( document ).ready( function () {

	TDF.init();

  } );


} )();
