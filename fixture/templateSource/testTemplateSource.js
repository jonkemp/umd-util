(function(f) {
	if (typeof exports === "object" && typeof module !== "undefined") {
		module.exports = f()
	} else if (typeof define === "function" && define.amd) {
		define([], f)
	} else {
		var g;
		if (typeof window !== "undefined") {
			g = window
		} else if (typeof global !== "undefined") {
			g = global
		} else if (typeof self !== "undefined") {
			g = self
		} else {
			g = this
		}
		g.Foo.Bar = f()
	}
})(function() {
	var define, module, exports;
	module = {
		exports: (exports = {})
	};

	'use strict';
	function Foo() {}


	return module.exports;
});
