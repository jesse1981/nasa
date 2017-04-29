/*jslint node: true */
"use strict";

var _levels = {
	debug : 0,
	info : 1,
	warning : 2,
	error : 3
};
function toLowerCase(val) {
	var myVal = val || "";
	myVal = myVal.toLowerCase();
	return myVal;
}

module.exports = function(level) {

	// global settings
	var _level = 0;

	if(toLowerCase(level) == "debug" || toLowerCase(level) == "") _level = 0;
	else if(toLowerCase(level) == "info") _level = 1;
	else if(toLowerCase(level) == "warning") _level = 2;
	else if(toLowerCase(level) == "error") _level = 3;
	else
		throw new Error("Unrecognized level: " + level);

	var _output = function(levelStr, message, prefix) {
		var thisLevel = _levels[levelStr];

		// if it's below the level we have set, let's swallow this entry
		if(thisLevel < _level) return;

		if(prefix && prefix !== "")
			console.log(new Date().toISOString() + ":", levelStr.toUpperCase()+  ":", prefix + ":", message);
		else
			console.log(new Date().toISOString() + ":", levelStr.toUpperCase()+ ":", message);
	};

	// local settings
	this.get = function(prefix) {

		var _prefix = prefix;

		return {
			debug: function(message) { _output("debug", message, prefix); },
			info: function(message) { _output("info", message, prefix); },
			warning: function(message) { _output("warning", message, prefix); },
			error: function(message) { _output("error", message, prefix); }
		};
	};

};
