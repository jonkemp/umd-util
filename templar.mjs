const ObjProto = Object.prototype;
const { hasOwnProperty } = ObjProto;

const isObject = (obj) => {
	const type = typeof obj;
	return type === 'function' || (type === 'object' && !!obj);
};

const has = (obj, key) =>
	obj != null && hasOwnProperty.call(obj, key);

const hasEnumBug = !Object.prototype.propertyIsEnumerable.call({toString: null}, 'toString');

const createEmulatedSet = (keys) => {
	const hash = Object.create(null);
	keys.forEach(key => hash[key] = true);

	return {
		contains: (key) => hash[key] === true,
		push: (key) => {
			hash[key] = true;
			return keys.push(key);
		}
	};
};

const nonEnumerableProps = [
	'valueOf',
	'isPrototypeOf',
	'toString',
	'propertyIsEnumerable',
	'hasOwnProperty',
	'toLocaleString'
];

const isFunction = (value) => typeof value === 'function';

const collectNonEnumProps = (obj, keysParam) => {
	const keys = createEmulatedSet(keysParam);
	let nonEnumIdx = nonEnumerableProps.length;
	const constructor = obj.constructor;
	const proto = (isFunction(constructor) && constructor.prototype) || ObjProto;

	// Constructor is a special case
	const constructorProp = 'constructor';
	if (has(obj, constructorProp) && !keys.contains(constructorProp)) {
	  keys.push(constructorProp);
	}

	while (nonEnumIdx--) {
	  const prop = nonEnumerableProps[nonEnumIdx];
	  if (prop in obj && obj[prop] !== proto[prop] && !keys.contains(prop)) {
			keys.push(prop);
	  }
	}
};

const allKeys = (obj) => {
	if (!isObject(obj)) return [];
	const keys = [];
	for (const key in obj) keys.push(key);
	if (hasEnumBug) collectNonEnumProps(obj, keys);
	return keys;
};

const createAssigner = (keysFunc, defaults) => {
	return function(objParam) {
		const length = arguments.length;
		const obj = defaults ? Object(objParam) : objParam;
		if (length < 2 || obj == null) return obj;

		for (let index = 1; index < length; index++) {
			const source = arguments[index];
			const keys = keysFunc(source);

			for (const key of keys) {
				if (!defaults || obj[key] === undefined) {
					obj[key] = source[key];
				}
			}
		}
		return obj;
	};
};

const defaults = createAssigner(allKeys, true);

const templateSettings = {
	evaluate: /<%([\s\S]+?)%>/g,
	interpolate: /<%=([\s\S]+?)%>/g,
	escape: /<%-([\s\S]+?)%>/g
};

// Guaranteed not to match when customizing settings
const noMatch = /(.)^/;

// Characters that need escaping for string literals
const escapes = {
	'\'': '\'',
	'\\': '\\',
	'\r': 'r',
	'\n': 'n',
	'\u2028': 'u2028',
	'\u2029': 'u2029'
};

const escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;

const escapeChar = (match) => `\\${escapes[match]}`;

const bareIdentifier = /^\s*(\w|\$)+\s*$/;

/**
 * JavaScript micro-templating engine
 * Handles arbitrary delimiters, preserves whitespace,
 * and correctly escapes quotes within interpolated code
 */
export default function templar(text, settingsParam, oldSettings) {
	const settings = defaults(
		{},
		settingsParam || oldSettings,
		templateSettings
	);

	// Combine delimiters into one regular expression via alternation
	const matcher = RegExp([
		(settings.escape || noMatch).source,
		(settings.interpolate || noMatch).source,
		(settings.evaluate || noMatch).source
	  ].join('|') + '|$', 'g');

	// Compile the template source, escaping string literals appropriately.
	let index = 0;
	let source = '__p+=\'';

	text.replace(matcher, (match, escape, interpolate, evaluate, offset) => {
		source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
		index = offset + match.length;

		if (escape) {
			source += '\'+\n((__t=(' + escape + '))==null?\'\':_.escape(__t))+\n\'';
		} else if (interpolate) {
			source += '\'+\n((__t=(' + interpolate + '))==null?\'\':__t)+\n\'';
		} else if (evaluate) {
			source += '\';\n' + evaluate + '\n__p+=\'';
		}

		return match;
	});

	source += '\';\n';

	let argument = settings.variable;
  	if (argument) {
    	// Protect against code injection (CVE-2021-23358)
    	if (!bareIdentifier.test(argument)) {
      		throw new Error(`variable is not a bare identifier: ${argument}`);
    	}
  	} else {
		// Place data values in local scope if no variable specified
		source = `with(obj||{}){\n${source}}\n`;
		argument = 'obj';
	}

	source = `
		let __t, __p='';
		const __j = Array.prototype.join;
		const print = (...args) => { __p += __j.call(args, ''); };
		${source}
		return __p;
	`;

	let render;
	try {
		render = new Function(argument || 'obj', '_', source);
	} catch (e) {
		e.source = source;
		throw e;
	}

	const template = (data) => render.call(this, data, {});

  	// Provide compiled source for precompilation
  	template.source = `function(${argument || 'obj'}){\n${source}}`;

	return template;
}
