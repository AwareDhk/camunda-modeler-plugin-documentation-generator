/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@xmldom/xmldom/lib/conventions.js":
/*!********************************************************!*\
  !*** ./node_modules/@xmldom/xmldom/lib/conventions.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


/**
 * Ponyfill for `Array.prototype.find` which is only available in ES6 runtimes.
 *
 * Works with anything that has a `length` property and index access properties, including NodeList.
 *
 * @template {unknown} T
 * @param {Array<T> | ({length:number, [number]: T})} list
 * @param {function (item: T, index: number, list:Array<T> | ({length:number, [number]: T})):boolean} predicate
 * @param {Partial<Pick<ArrayConstructor['prototype'], 'find'>>?} ac `Array.prototype` by default,
 * 				allows injecting a custom implementation in tests
 * @returns {T | undefined}
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
 * @see https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype.find
 */
function find(list, predicate, ac) {
	if (ac === undefined) {
		ac = Array.prototype;
	}
	if (list && typeof ac.find === 'function') {
		return ac.find.call(list, predicate);
	}
	for (var i = 0; i < list.length; i++) {
		if (Object.prototype.hasOwnProperty.call(list, i)) {
			var item = list[i];
			if (predicate.call(undefined, item, i, list)) {
				return item;
			}
		}
	}
}

/**
 * "Shallow freezes" an object to render it immutable.
 * Uses `Object.freeze` if available,
 * otherwise the immutability is only in the type.
 *
 * Is used to create "enum like" objects.
 *
 * @template T
 * @param {T} object the object to freeze
 * @param {Pick<ObjectConstructor, 'freeze'> = Object} oc `Object` by default,
 * 				allows to inject custom object constructor for tests
 * @returns {Readonly<T>}
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
 */
function freeze(object, oc) {
	if (oc === undefined) {
		oc = Object
	}
	return oc && typeof oc.freeze === 'function' ? oc.freeze(object) : object
}

/**
 * Since we can not rely on `Object.assign` we provide a simplified version
 * that is sufficient for our needs.
 *
 * @param {Object} target
 * @param {Object | null | undefined} source
 *
 * @returns {Object} target
 * @throws TypeError if target is not an object
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
 * @see https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.assign
 */
function assign(target, source) {
	if (target === null || typeof target !== 'object') {
		throw new TypeError('target is not an object')
	}
	for (var key in source) {
		if (Object.prototype.hasOwnProperty.call(source, key)) {
			target[key] = source[key]
		}
	}
	return target
}

/**
 * All mime types that are allowed as input to `DOMParser.parseFromString`
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMParser/parseFromString#Argument02 MDN
 * @see https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#domparsersupportedtype WHATWG HTML Spec
 * @see DOMParser.prototype.parseFromString
 */
var MIME_TYPE = freeze({
	/**
	 * `text/html`, the only mime type that triggers treating an XML document as HTML.
	 *
	 * @see DOMParser.SupportedType.isHTML
	 * @see https://www.iana.org/assignments/media-types/text/html IANA MimeType registration
	 * @see https://en.wikipedia.org/wiki/HTML Wikipedia
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMParser/parseFromString MDN
	 * @see https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#dom-domparser-parsefromstring WHATWG HTML Spec
	 */
	HTML: 'text/html',

	/**
	 * Helper method to check a mime type if it indicates an HTML document
	 *
	 * @param {string} [value]
	 * @returns {boolean}
	 *
	 * @see https://www.iana.org/assignments/media-types/text/html IANA MimeType registration
	 * @see https://en.wikipedia.org/wiki/HTML Wikipedia
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMParser/parseFromString MDN
	 * @see https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#dom-domparser-parsefromstring 	 */
	isHTML: function (value) {
		return value === MIME_TYPE.HTML
	},

	/**
	 * `application/xml`, the standard mime type for XML documents.
	 *
	 * @see https://www.iana.org/assignments/media-types/application/xml IANA MimeType registration
	 * @see https://tools.ietf.org/html/rfc7303#section-9.1 RFC 7303
	 * @see https://en.wikipedia.org/wiki/XML_and_MIME Wikipedia
	 */
	XML_APPLICATION: 'application/xml',

	/**
	 * `text/html`, an alias for `application/xml`.
	 *
	 * @see https://tools.ietf.org/html/rfc7303#section-9.2 RFC 7303
	 * @see https://www.iana.org/assignments/media-types/text/xml IANA MimeType registration
	 * @see https://en.wikipedia.org/wiki/XML_and_MIME Wikipedia
	 */
	XML_TEXT: 'text/xml',

	/**
	 * `application/xhtml+xml`, indicates an XML document that has the default HTML namespace,
	 * but is parsed as an XML document.
	 *
	 * @see https://www.iana.org/assignments/media-types/application/xhtml+xml IANA MimeType registration
	 * @see https://dom.spec.whatwg.org/#dom-domimplementation-createdocument WHATWG DOM Spec
	 * @see https://en.wikipedia.org/wiki/XHTML Wikipedia
	 */
	XML_XHTML_APPLICATION: 'application/xhtml+xml',

	/**
	 * `image/svg+xml`,
	 *
	 * @see https://www.iana.org/assignments/media-types/image/svg+xml IANA MimeType registration
	 * @see https://www.w3.org/TR/SVG11/ W3C SVG 1.1
	 * @see https://en.wikipedia.org/wiki/Scalable_Vector_Graphics Wikipedia
	 */
	XML_SVG_IMAGE: 'image/svg+xml',
})

/**
 * Namespaces that are used in this code base.
 *
 * @see http://www.w3.org/TR/REC-xml-names
 */
var NAMESPACE = freeze({
	/**
	 * The XHTML namespace.
	 *
	 * @see http://www.w3.org/1999/xhtml
	 */
	HTML: 'http://www.w3.org/1999/xhtml',

	/**
	 * Checks if `uri` equals `NAMESPACE.HTML`.
	 *
	 * @param {string} [uri]
	 *
	 * @see NAMESPACE.HTML
	 */
	isHTML: function (uri) {
		return uri === NAMESPACE.HTML
	},

	/**
	 * The SVG namespace.
	 *
	 * @see http://www.w3.org/2000/svg
	 */
	SVG: 'http://www.w3.org/2000/svg',

	/**
	 * The `xml:` namespace.
	 *
	 * @see http://www.w3.org/XML/1998/namespace
	 */
	XML: 'http://www.w3.org/XML/1998/namespace',

	/**
	 * The `xmlns:` namespace
	 *
	 * @see https://www.w3.org/2000/xmlns/
	 */
	XMLNS: 'http://www.w3.org/2000/xmlns/',
})

exports.assign = assign;
exports.find = find;
exports.freeze = freeze;
exports.MIME_TYPE = MIME_TYPE;
exports.NAMESPACE = NAMESPACE;


/***/ }),

/***/ "./node_modules/@xmldom/xmldom/lib/dom-parser.js":
/*!*******************************************************!*\
  !*** ./node_modules/@xmldom/xmldom/lib/dom-parser.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var conventions = __webpack_require__(/*! ./conventions */ "./node_modules/@xmldom/xmldom/lib/conventions.js");
var dom = __webpack_require__(/*! ./dom */ "./node_modules/@xmldom/xmldom/lib/dom.js")
var entities = __webpack_require__(/*! ./entities */ "./node_modules/@xmldom/xmldom/lib/entities.js");
var sax = __webpack_require__(/*! ./sax */ "./node_modules/@xmldom/xmldom/lib/sax.js");

var DOMImplementation = dom.DOMImplementation;

var NAMESPACE = conventions.NAMESPACE;

var ParseError = sax.ParseError;
var XMLReader = sax.XMLReader;

/**
 * Normalizes line ending according to https://www.w3.org/TR/xml11/#sec-line-ends:
 *
 * > XML parsed entities are often stored in computer files which,
 * > for editing convenience, are organized into lines.
 * > These lines are typically separated by some combination
 * > of the characters CARRIAGE RETURN (#xD) and LINE FEED (#xA).
 * >
 * > To simplify the tasks of applications, the XML processor must behave
 * > as if it normalized all line breaks in external parsed entities (including the document entity)
 * > on input, before parsing, by translating all of the following to a single #xA character:
 * >
 * > 1. the two-character sequence #xD #xA
 * > 2. the two-character sequence #xD #x85
 * > 3. the single character #x85
 * > 4. the single character #x2028
 * > 5. any #xD character that is not immediately followed by #xA or #x85.
 *
 * @param {string} input
 * @returns {string}
 */
function normalizeLineEndings(input) {
	return input
		.replace(/\r[\n\u0085]/g, '\n')
		.replace(/[\r\u0085\u2028]/g, '\n')
}

/**
 * @typedef Locator
 * @property {number} [columnNumber]
 * @property {number} [lineNumber]
 */

/**
 * @typedef DOMParserOptions
 * @property {DOMHandler} [domBuilder]
 * @property {Function} [errorHandler]
 * @property {(string) => string} [normalizeLineEndings] used to replace line endings before parsing
 * 						defaults to `normalizeLineEndings`
 * @property {Locator} [locator]
 * @property {Record<string, string>} [xmlns]
 *
 * @see normalizeLineEndings
 */

/**
 * The DOMParser interface provides the ability to parse XML or HTML source code
 * from a string into a DOM `Document`.
 *
 * _xmldom is different from the spec in that it allows an `options` parameter,
 * to override the default behavior._
 *
 * @param {DOMParserOptions} [options]
 * @constructor
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMParser
 * @see https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#dom-parsing-and-serialization
 */
function DOMParser(options){
	this.options = options ||{locator:{}};
}

DOMParser.prototype.parseFromString = function(source,mimeType){
	var options = this.options;
	var sax =  new XMLReader();
	var domBuilder = options.domBuilder || new DOMHandler();//contentHandler and LexicalHandler
	var errorHandler = options.errorHandler;
	var locator = options.locator;
	var defaultNSMap = options.xmlns||{};
	var isHTML = /\/x?html?$/.test(mimeType);//mimeType.toLowerCase().indexOf('html') > -1;
  	var entityMap = isHTML ? entities.HTML_ENTITIES : entities.XML_ENTITIES;
	if(locator){
		domBuilder.setDocumentLocator(locator)
	}

	sax.errorHandler = buildErrorHandler(errorHandler,domBuilder,locator);
	sax.domBuilder = options.domBuilder || domBuilder;
	if(isHTML){
		defaultNSMap[''] = NAMESPACE.HTML;
	}
	defaultNSMap.xml = defaultNSMap.xml || NAMESPACE.XML;
	var normalize = options.normalizeLineEndings || normalizeLineEndings;
	if (source && typeof source === 'string') {
		sax.parse(
			normalize(source),
			defaultNSMap,
			entityMap
		)
	} else {
		sax.errorHandler.error('invalid doc source')
	}
	return domBuilder.doc;
}
function buildErrorHandler(errorImpl,domBuilder,locator){
	if(!errorImpl){
		if(domBuilder instanceof DOMHandler){
			return domBuilder;
		}
		errorImpl = domBuilder ;
	}
	var errorHandler = {}
	var isCallback = errorImpl instanceof Function;
	locator = locator||{}
	function build(key){
		var fn = errorImpl[key];
		if(!fn && isCallback){
			fn = errorImpl.length == 2?function(msg){errorImpl(key,msg)}:errorImpl;
		}
		errorHandler[key] = fn && function(msg){
			fn('[xmldom '+key+']\t'+msg+_locator(locator));
		}||function(){};
	}
	build('warning');
	build('error');
	build('fatalError');
	return errorHandler;
}

//console.log('#\n\n\n\n\n\n\n####')
/**
 * +ContentHandler+ErrorHandler
 * +LexicalHandler+EntityResolver2
 * -DeclHandler-DTDHandler
 *
 * DefaultHandler:EntityResolver, DTDHandler, ContentHandler, ErrorHandler
 * DefaultHandler2:DefaultHandler,LexicalHandler, DeclHandler, EntityResolver2
 * @link http://www.saxproject.org/apidoc/org/xml/sax/helpers/DefaultHandler.html
 */
function DOMHandler() {
    this.cdata = false;
}
function position(locator,node){
	node.lineNumber = locator.lineNumber;
	node.columnNumber = locator.columnNumber;
}
/**
 * @see org.xml.sax.ContentHandler#startDocument
 * @link http://www.saxproject.org/apidoc/org/xml/sax/ContentHandler.html
 */
DOMHandler.prototype = {
	startDocument : function() {
    	this.doc = new DOMImplementation().createDocument(null, null, null);
    	if (this.locator) {
        	this.doc.documentURI = this.locator.systemId;
    	}
	},
	startElement:function(namespaceURI, localName, qName, attrs) {
		var doc = this.doc;
	    var el = doc.createElementNS(namespaceURI, qName||localName);
	    var len = attrs.length;
	    appendElement(this, el);
	    this.currentElement = el;

		this.locator && position(this.locator,el)
	    for (var i = 0 ; i < len; i++) {
	        var namespaceURI = attrs.getURI(i);
	        var value = attrs.getValue(i);
	        var qName = attrs.getQName(i);
			var attr = doc.createAttributeNS(namespaceURI, qName);
			this.locator &&position(attrs.getLocator(i),attr);
			attr.value = attr.nodeValue = value;
			el.setAttributeNode(attr)
	    }
	},
	endElement:function(namespaceURI, localName, qName) {
		var current = this.currentElement
		var tagName = current.tagName;
		this.currentElement = current.parentNode;
	},
	startPrefixMapping:function(prefix, uri) {
	},
	endPrefixMapping:function(prefix) {
	},
	processingInstruction:function(target, data) {
	    var ins = this.doc.createProcessingInstruction(target, data);
	    this.locator && position(this.locator,ins)
	    appendElement(this, ins);
	},
	ignorableWhitespace:function(ch, start, length) {
	},
	characters:function(chars, start, length) {
		chars = _toString.apply(this,arguments)
		//console.log(chars)
		if(chars){
			if (this.cdata) {
				var charNode = this.doc.createCDATASection(chars);
			} else {
				var charNode = this.doc.createTextNode(chars);
			}
			if(this.currentElement){
				this.currentElement.appendChild(charNode);
			}else if(/^\s*$/.test(chars)){
				this.doc.appendChild(charNode);
				//process xml
			}
			this.locator && position(this.locator,charNode)
		}
	},
	skippedEntity:function(name) {
	},
	endDocument:function() {
		this.doc.normalize();
	},
	setDocumentLocator:function (locator) {
	    if(this.locator = locator){// && !('lineNumber' in locator)){
	    	locator.lineNumber = 0;
	    }
	},
	//LexicalHandler
	comment:function(chars, start, length) {
		chars = _toString.apply(this,arguments)
	    var comm = this.doc.createComment(chars);
	    this.locator && position(this.locator,comm)
	    appendElement(this, comm);
	},

	startCDATA:function() {
	    //used in characters() methods
	    this.cdata = true;
	},
	endCDATA:function() {
	    this.cdata = false;
	},

	startDTD:function(name, publicId, systemId) {
		var impl = this.doc.implementation;
	    if (impl && impl.createDocumentType) {
	        var dt = impl.createDocumentType(name, publicId, systemId);
	        this.locator && position(this.locator,dt)
	        appendElement(this, dt);
					this.doc.doctype = dt;
	    }
	},
	/**
	 * @see org.xml.sax.ErrorHandler
	 * @link http://www.saxproject.org/apidoc/org/xml/sax/ErrorHandler.html
	 */
	warning:function(error) {
		console.warn('[xmldom warning]\t'+error,_locator(this.locator));
	},
	error:function(error) {
		console.error('[xmldom error]\t'+error,_locator(this.locator));
	},
	fatalError:function(error) {
		throw new ParseError(error, this.locator);
	}
}
function _locator(l){
	if(l){
		return '\n@'+(l.systemId ||'')+'#[line:'+l.lineNumber+',col:'+l.columnNumber+']'
	}
}
function _toString(chars,start,length){
	if(typeof chars == 'string'){
		return chars.substr(start,length)
	}else{//java sax connect width xmldom on rhino(what about: "? && !(chars instanceof String)")
		if(chars.length >= start+length || start){
			return new java.lang.String(chars,start,length)+'';
		}
		return chars;
	}
}

/*
 * @link http://www.saxproject.org/apidoc/org/xml/sax/ext/LexicalHandler.html
 * used method of org.xml.sax.ext.LexicalHandler:
 *  #comment(chars, start, length)
 *  #startCDATA()
 *  #endCDATA()
 *  #startDTD(name, publicId, systemId)
 *
 *
 * IGNORED method of org.xml.sax.ext.LexicalHandler:
 *  #endDTD()
 *  #startEntity(name)
 *  #endEntity(name)
 *
 *
 * @link http://www.saxproject.org/apidoc/org/xml/sax/ext/DeclHandler.html
 * IGNORED method of org.xml.sax.ext.DeclHandler
 * 	#attributeDecl(eName, aName, type, mode, value)
 *  #elementDecl(name, model)
 *  #externalEntityDecl(name, publicId, systemId)
 *  #internalEntityDecl(name, value)
 * @link http://www.saxproject.org/apidoc/org/xml/sax/ext/EntityResolver2.html
 * IGNORED method of org.xml.sax.EntityResolver2
 *  #resolveEntity(String name,String publicId,String baseURI,String systemId)
 *  #resolveEntity(publicId, systemId)
 *  #getExternalSubset(name, baseURI)
 * @link http://www.saxproject.org/apidoc/org/xml/sax/DTDHandler.html
 * IGNORED method of org.xml.sax.DTDHandler
 *  #notationDecl(name, publicId, systemId) {};
 *  #unparsedEntityDecl(name, publicId, systemId, notationName) {};
 */
"endDTD,startEntity,endEntity,attributeDecl,elementDecl,externalEntityDecl,internalEntityDecl,resolveEntity,getExternalSubset,notationDecl,unparsedEntityDecl".replace(/\w+/g,function(key){
	DOMHandler.prototype[key] = function(){return null}
})

/* Private static helpers treated below as private instance methods, so don't need to add these to the public API; we might use a Relator to also get rid of non-standard public properties */
function appendElement (hander,node) {
    if (!hander.currentElement) {
        hander.doc.appendChild(node);
    } else {
        hander.currentElement.appendChild(node);
    }
}//appendChild and setAttributeNS are preformance key

exports.__DOMHandler = DOMHandler;
exports.normalizeLineEndings = normalizeLineEndings;
exports.DOMParser = DOMParser;


/***/ }),

/***/ "./node_modules/@xmldom/xmldom/lib/dom.js":
/*!************************************************!*\
  !*** ./node_modules/@xmldom/xmldom/lib/dom.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var conventions = __webpack_require__(/*! ./conventions */ "./node_modules/@xmldom/xmldom/lib/conventions.js");

var find = conventions.find;
var NAMESPACE = conventions.NAMESPACE;

/**
 * A prerequisite for `[].filter`, to drop elements that are empty
 * @param {string} input
 * @returns {boolean}
 */
function notEmptyString (input) {
	return input !== ''
}
/**
 * @see https://infra.spec.whatwg.org/#split-on-ascii-whitespace
 * @see https://infra.spec.whatwg.org/#ascii-whitespace
 *
 * @param {string} input
 * @returns {string[]} (can be empty)
 */
function splitOnASCIIWhitespace(input) {
	// U+0009 TAB, U+000A LF, U+000C FF, U+000D CR, U+0020 SPACE
	return input ? input.split(/[\t\n\f\r ]+/).filter(notEmptyString) : []
}

/**
 * Adds element as a key to current if it is not already present.
 *
 * @param {Record<string, boolean | undefined>} current
 * @param {string} element
 * @returns {Record<string, boolean | undefined>}
 */
function orderedSetReducer (current, element) {
	if (!current.hasOwnProperty(element)) {
		current[element] = true;
	}
	return current;
}

/**
 * @see https://infra.spec.whatwg.org/#ordered-set
 * @param {string} input
 * @returns {string[]}
 */
function toOrderedSet(input) {
	if (!input) return [];
	var list = splitOnASCIIWhitespace(input);
	return Object.keys(list.reduce(orderedSetReducer, {}))
}

/**
 * Uses `list.indexOf` to implement something like `Array.prototype.includes`,
 * which we can not rely on being available.
 *
 * @param {any[]} list
 * @returns {function(any): boolean}
 */
function arrayIncludes (list) {
	return function(element) {
		return list && list.indexOf(element) !== -1;
	}
}

function copy(src,dest){
	for(var p in src){
		if (Object.prototype.hasOwnProperty.call(src, p)) {
			dest[p] = src[p];
		}
	}
}

/**
^\w+\.prototype\.([_\w]+)\s*=\s*((?:.*\{\s*?[\r\n][\s\S]*?^})|\S.*?(?=[;\r\n]));?
^\w+\.prototype\.([_\w]+)\s*=\s*(\S.*?(?=[;\r\n]));?
 */
function _extends(Class,Super){
	var pt = Class.prototype;
	if(!(pt instanceof Super)){
		function t(){};
		t.prototype = Super.prototype;
		t = new t();
		copy(pt,t);
		Class.prototype = pt = t;
	}
	if(pt.constructor != Class){
		if(typeof Class != 'function'){
			console.error("unknown Class:"+Class)
		}
		pt.constructor = Class
	}
}

// Node Types
var NodeType = {}
var ELEMENT_NODE                = NodeType.ELEMENT_NODE                = 1;
var ATTRIBUTE_NODE              = NodeType.ATTRIBUTE_NODE              = 2;
var TEXT_NODE                   = NodeType.TEXT_NODE                   = 3;
var CDATA_SECTION_NODE          = NodeType.CDATA_SECTION_NODE          = 4;
var ENTITY_REFERENCE_NODE       = NodeType.ENTITY_REFERENCE_NODE       = 5;
var ENTITY_NODE                 = NodeType.ENTITY_NODE                 = 6;
var PROCESSING_INSTRUCTION_NODE = NodeType.PROCESSING_INSTRUCTION_NODE = 7;
var COMMENT_NODE                = NodeType.COMMENT_NODE                = 8;
var DOCUMENT_NODE               = NodeType.DOCUMENT_NODE               = 9;
var DOCUMENT_TYPE_NODE          = NodeType.DOCUMENT_TYPE_NODE          = 10;
var DOCUMENT_FRAGMENT_NODE      = NodeType.DOCUMENT_FRAGMENT_NODE      = 11;
var NOTATION_NODE               = NodeType.NOTATION_NODE               = 12;

// ExceptionCode
var ExceptionCode = {}
var ExceptionMessage = {};
var INDEX_SIZE_ERR              = ExceptionCode.INDEX_SIZE_ERR              = ((ExceptionMessage[1]="Index size error"),1);
var DOMSTRING_SIZE_ERR          = ExceptionCode.DOMSTRING_SIZE_ERR          = ((ExceptionMessage[2]="DOMString size error"),2);
var HIERARCHY_REQUEST_ERR       = ExceptionCode.HIERARCHY_REQUEST_ERR       = ((ExceptionMessage[3]="Hierarchy request error"),3);
var WRONG_DOCUMENT_ERR          = ExceptionCode.WRONG_DOCUMENT_ERR          = ((ExceptionMessage[4]="Wrong document"),4);
var INVALID_CHARACTER_ERR       = ExceptionCode.INVALID_CHARACTER_ERR       = ((ExceptionMessage[5]="Invalid character"),5);
var NO_DATA_ALLOWED_ERR         = ExceptionCode.NO_DATA_ALLOWED_ERR         = ((ExceptionMessage[6]="No data allowed"),6);
var NO_MODIFICATION_ALLOWED_ERR = ExceptionCode.NO_MODIFICATION_ALLOWED_ERR = ((ExceptionMessage[7]="No modification allowed"),7);
var NOT_FOUND_ERR               = ExceptionCode.NOT_FOUND_ERR               = ((ExceptionMessage[8]="Not found"),8);
var NOT_SUPPORTED_ERR           = ExceptionCode.NOT_SUPPORTED_ERR           = ((ExceptionMessage[9]="Not supported"),9);
var INUSE_ATTRIBUTE_ERR         = ExceptionCode.INUSE_ATTRIBUTE_ERR         = ((ExceptionMessage[10]="Attribute in use"),10);
//level2
var INVALID_STATE_ERR        	= ExceptionCode.INVALID_STATE_ERR        	= ((ExceptionMessage[11]="Invalid state"),11);
var SYNTAX_ERR               	= ExceptionCode.SYNTAX_ERR               	= ((ExceptionMessage[12]="Syntax error"),12);
var INVALID_MODIFICATION_ERR 	= ExceptionCode.INVALID_MODIFICATION_ERR 	= ((ExceptionMessage[13]="Invalid modification"),13);
var NAMESPACE_ERR            	= ExceptionCode.NAMESPACE_ERR           	= ((ExceptionMessage[14]="Invalid namespace"),14);
var INVALID_ACCESS_ERR       	= ExceptionCode.INVALID_ACCESS_ERR      	= ((ExceptionMessage[15]="Invalid access"),15);

/**
 * DOM Level 2
 * Object DOMException
 * @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html
 * @see http://www.w3.org/TR/REC-DOM-Level-1/ecma-script-language-binding.html
 */
function DOMException(code, message) {
	if(message instanceof Error){
		var error = message;
	}else{
		error = this;
		Error.call(this, ExceptionMessage[code]);
		this.message = ExceptionMessage[code];
		if(Error.captureStackTrace) Error.captureStackTrace(this, DOMException);
	}
	error.code = code;
	if(message) this.message = this.message + ": " + message;
	return error;
};
DOMException.prototype = Error.prototype;
copy(ExceptionCode,DOMException)

/**
 * @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-536297177
 * The NodeList interface provides the abstraction of an ordered collection of nodes, without defining or constraining how this collection is implemented. NodeList objects in the DOM are live.
 * The items in the NodeList are accessible via an integral index, starting from 0.
 */
function NodeList() {
};
NodeList.prototype = {
	/**
	 * The number of nodes in the list. The range of valid child node indices is 0 to length-1 inclusive.
	 * @standard level1
	 */
	length:0,
	/**
	 * Returns the indexth item in the collection. If index is greater than or equal to the number of nodes in the list, this returns null.
	 * @standard level1
	 * @param index  unsigned long
	 *   Index into the collection.
	 * @return Node
	 * 	The node at the indexth position in the NodeList, or null if that is not a valid index.
	 */
	item: function(index) {
		return this[index] || null;
	},
	toString:function(isHTML,nodeFilter){
		for(var buf = [], i = 0;i<this.length;i++){
			serializeToString(this[i],buf,isHTML,nodeFilter);
		}
		return buf.join('');
	},
	/**
	 * @private
	 * @param {function (Node):boolean} predicate
	 * @returns {Node[]}
	 */
	filter: function (predicate) {
		return Array.prototype.filter.call(this, predicate);
	},
	/**
	 * @private
	 * @param {Node} item
	 * @returns {number}
	 */
	indexOf: function (item) {
		return Array.prototype.indexOf.call(this, item);
	},
};

function LiveNodeList(node,refresh){
	this._node = node;
	this._refresh = refresh
	_updateLiveList(this);
}
function _updateLiveList(list){
	var inc = list._node._inc || list._node.ownerDocument._inc;
	if(list._inc != inc){
		var ls = list._refresh(list._node);
		//console.log(ls.length)
		__set__(list,'length',ls.length);
		copy(ls,list);
		list._inc = inc;
	}
}
LiveNodeList.prototype.item = function(i){
	_updateLiveList(this);
	return this[i];
}

_extends(LiveNodeList,NodeList);

/**
 * Objects implementing the NamedNodeMap interface are used
 * to represent collections of nodes that can be accessed by name.
 * Note that NamedNodeMap does not inherit from NodeList;
 * NamedNodeMaps are not maintained in any particular order.
 * Objects contained in an object implementing NamedNodeMap may also be accessed by an ordinal index,
 * but this is simply to allow convenient enumeration of the contents of a NamedNodeMap,
 * and does not imply that the DOM specifies an order to these Nodes.
 * NamedNodeMap objects in the DOM are live.
 * used for attributes or DocumentType entities
 */
function NamedNodeMap() {
};

function _findNodeIndex(list,node){
	var i = list.length;
	while(i--){
		if(list[i] === node){return i}
	}
}

function _addNamedNode(el,list,newAttr,oldAttr){
	if(oldAttr){
		list[_findNodeIndex(list,oldAttr)] = newAttr;
	}else{
		list[list.length++] = newAttr;
	}
	if(el){
		newAttr.ownerElement = el;
		var doc = el.ownerDocument;
		if(doc){
			oldAttr && _onRemoveAttribute(doc,el,oldAttr);
			_onAddAttribute(doc,el,newAttr);
		}
	}
}
function _removeNamedNode(el,list,attr){
	//console.log('remove attr:'+attr)
	var i = _findNodeIndex(list,attr);
	if(i>=0){
		var lastIndex = list.length-1
		while(i<lastIndex){
			list[i] = list[++i]
		}
		list.length = lastIndex;
		if(el){
			var doc = el.ownerDocument;
			if(doc){
				_onRemoveAttribute(doc,el,attr);
				attr.ownerElement = null;
			}
		}
	}else{
		throw new DOMException(NOT_FOUND_ERR,new Error(el.tagName+'@'+attr))
	}
}
NamedNodeMap.prototype = {
	length:0,
	item:NodeList.prototype.item,
	getNamedItem: function(key) {
//		if(key.indexOf(':')>0 || key == 'xmlns'){
//			return null;
//		}
		//console.log()
		var i = this.length;
		while(i--){
			var attr = this[i];
			//console.log(attr.nodeName,key)
			if(attr.nodeName == key){
				return attr;
			}
		}
	},
	setNamedItem: function(attr) {
		var el = attr.ownerElement;
		if(el && el!=this._ownerElement){
			throw new DOMException(INUSE_ATTRIBUTE_ERR);
		}
		var oldAttr = this.getNamedItem(attr.nodeName);
		_addNamedNode(this._ownerElement,this,attr,oldAttr);
		return oldAttr;
	},
	/* returns Node */
	setNamedItemNS: function(attr) {// raises: WRONG_DOCUMENT_ERR,NO_MODIFICATION_ALLOWED_ERR,INUSE_ATTRIBUTE_ERR
		var el = attr.ownerElement, oldAttr;
		if(el && el!=this._ownerElement){
			throw new DOMException(INUSE_ATTRIBUTE_ERR);
		}
		oldAttr = this.getNamedItemNS(attr.namespaceURI,attr.localName);
		_addNamedNode(this._ownerElement,this,attr,oldAttr);
		return oldAttr;
	},

	/* returns Node */
	removeNamedItem: function(key) {
		var attr = this.getNamedItem(key);
		_removeNamedNode(this._ownerElement,this,attr);
		return attr;


	},// raises: NOT_FOUND_ERR,NO_MODIFICATION_ALLOWED_ERR

	//for level2
	removeNamedItemNS:function(namespaceURI,localName){
		var attr = this.getNamedItemNS(namespaceURI,localName);
		_removeNamedNode(this._ownerElement,this,attr);
		return attr;
	},
	getNamedItemNS: function(namespaceURI, localName) {
		var i = this.length;
		while(i--){
			var node = this[i];
			if(node.localName == localName && node.namespaceURI == namespaceURI){
				return node;
			}
		}
		return null;
	}
};

/**
 * The DOMImplementation interface represents an object providing methods
 * which are not dependent on any particular document.
 * Such an object is returned by the `Document.implementation` property.
 *
 * __The individual methods describe the differences compared to the specs.__
 *
 * @constructor
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation MDN
 * @see https://www.w3.org/TR/REC-DOM-Level-1/level-one-core.html#ID-102161490 DOM Level 1 Core (Initial)
 * @see https://www.w3.org/TR/DOM-Level-2-Core/core.html#ID-102161490 DOM Level 2 Core
 * @see https://www.w3.org/TR/DOM-Level-3-Core/core.html#ID-102161490 DOM Level 3 Core
 * @see https://dom.spec.whatwg.org/#domimplementation DOM Living Standard
 */
function DOMImplementation() {
}

DOMImplementation.prototype = {
	/**
	 * The DOMImplementation.hasFeature() method returns a Boolean flag indicating if a given feature is supported.
	 * The different implementations fairly diverged in what kind of features were reported.
	 * The latest version of the spec settled to force this method to always return true, where the functionality was accurate and in use.
	 *
	 * @deprecated It is deprecated and modern browsers return true in all cases.
	 *
	 * @param {string} feature
	 * @param {string} [version]
	 * @returns {boolean} always true
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation/hasFeature MDN
	 * @see https://www.w3.org/TR/REC-DOM-Level-1/level-one-core.html#ID-5CED94D7 DOM Level 1 Core
	 * @see https://dom.spec.whatwg.org/#dom-domimplementation-hasfeature DOM Living Standard
	 */
	hasFeature: function(feature, version) {
			return true;
	},
	/**
	 * Creates an XML Document object of the specified type with its document element.
	 *
	 * __It behaves slightly different from the description in the living standard__:
	 * - There is no interface/class `XMLDocument`, it returns a `Document` instance.
	 * - `contentType`, `encoding`, `mode`, `origin`, `url` fields are currently not declared.
	 * - this implementation is not validating names or qualified names
	 *   (when parsing XML strings, the SAX parser takes care of that)
	 *
	 * @param {string|null} namespaceURI
	 * @param {string} qualifiedName
	 * @param {DocumentType=null} doctype
	 * @returns {Document}
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation/createDocument MDN
	 * @see https://www.w3.org/TR/DOM-Level-2-Core/core.html#Level-2-Core-DOM-createDocument DOM Level 2 Core (initial)
	 * @see https://dom.spec.whatwg.org/#dom-domimplementation-createdocument  DOM Level 2 Core
	 *
	 * @see https://dom.spec.whatwg.org/#validate-and-extract DOM: Validate and extract
	 * @see https://www.w3.org/TR/xml/#NT-NameStartChar XML Spec: Names
	 * @see https://www.w3.org/TR/xml-names/#ns-qualnames XML Namespaces: Qualified names
	 */
	createDocument: function(namespaceURI,  qualifiedName, doctype){
		var doc = new Document();
		doc.implementation = this;
		doc.childNodes = new NodeList();
		doc.doctype = doctype || null;
		if (doctype){
			doc.appendChild(doctype);
		}
		if (qualifiedName){
			var root = doc.createElementNS(namespaceURI, qualifiedName);
			doc.appendChild(root);
		}
		return doc;
	},
	/**
	 * Returns a doctype, with the given `qualifiedName`, `publicId`, and `systemId`.
	 *
	 * __This behavior is slightly different from the in the specs__:
	 * - this implementation is not validating names or qualified names
	 *   (when parsing XML strings, the SAX parser takes care of that)
	 *
	 * @param {string} qualifiedName
	 * @param {string} [publicId]
	 * @param {string} [systemId]
	 * @returns {DocumentType} which can either be used with `DOMImplementation.createDocument` upon document creation
	 * 				  or can be put into the document via methods like `Node.insertBefore()` or `Node.replaceChild()`
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation/createDocumentType MDN
	 * @see https://www.w3.org/TR/DOM-Level-2-Core/core.html#Level-2-Core-DOM-createDocType DOM Level 2 Core
	 * @see https://dom.spec.whatwg.org/#dom-domimplementation-createdocumenttype DOM Living Standard
	 *
	 * @see https://dom.spec.whatwg.org/#validate-and-extract DOM: Validate and extract
	 * @see https://www.w3.org/TR/xml/#NT-NameStartChar XML Spec: Names
	 * @see https://www.w3.org/TR/xml-names/#ns-qualnames XML Namespaces: Qualified names
	 */
	createDocumentType: function(qualifiedName, publicId, systemId){
		var node = new DocumentType();
		node.name = qualifiedName;
		node.nodeName = qualifiedName;
		node.publicId = publicId || '';
		node.systemId = systemId || '';

		return node;
	}
};


/**
 * @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-1950641247
 */

function Node() {
};

Node.prototype = {
	firstChild : null,
	lastChild : null,
	previousSibling : null,
	nextSibling : null,
	attributes : null,
	parentNode : null,
	childNodes : null,
	ownerDocument : null,
	nodeValue : null,
	namespaceURI : null,
	prefix : null,
	localName : null,
	// Modified in DOM Level 2:
	insertBefore:function(newChild, refChild){//raises
		return _insertBefore(this,newChild,refChild);
	},
	replaceChild:function(newChild, oldChild){//raises
		_insertBefore(this, newChild,oldChild, assertPreReplacementValidityInDocument);
		if(oldChild){
			this.removeChild(oldChild);
		}
	},
	removeChild:function(oldChild){
		return _removeChild(this,oldChild);
	},
	appendChild:function(newChild){
		return this.insertBefore(newChild,null);
	},
	hasChildNodes:function(){
		return this.firstChild != null;
	},
	cloneNode:function(deep){
		return cloneNode(this.ownerDocument||this,this,deep);
	},
	// Modified in DOM Level 2:
	normalize:function(){
		var child = this.firstChild;
		while(child){
			var next = child.nextSibling;
			if(next && next.nodeType == TEXT_NODE && child.nodeType == TEXT_NODE){
				this.removeChild(next);
				child.appendData(next.data);
			}else{
				child.normalize();
				child = next;
			}
		}
	},
  	// Introduced in DOM Level 2:
	isSupported:function(feature, version){
		return this.ownerDocument.implementation.hasFeature(feature,version);
	},
    // Introduced in DOM Level 2:
    hasAttributes:function(){
    	return this.attributes.length>0;
    },
	/**
	 * Look up the prefix associated to the given namespace URI, starting from this node.
	 * **The default namespace declarations are ignored by this method.**
	 * See Namespace Prefix Lookup for details on the algorithm used by this method.
	 *
	 * _Note: The implementation seems to be incomplete when compared to the algorithm described in the specs._
	 *
	 * @param {string | null} namespaceURI
	 * @returns {string | null}
	 * @see https://www.w3.org/TR/DOM-Level-3-Core/core.html#Node3-lookupNamespacePrefix
	 * @see https://www.w3.org/TR/DOM-Level-3-Core/namespaces-algorithms.html#lookupNamespacePrefixAlgo
	 * @see https://dom.spec.whatwg.org/#dom-node-lookupprefix
	 * @see https://github.com/xmldom/xmldom/issues/322
	 */
    lookupPrefix:function(namespaceURI){
    	var el = this;
    	while(el){
    		var map = el._nsMap;
    		//console.dir(map)
    		if(map){
    			for(var n in map){
						if (Object.prototype.hasOwnProperty.call(map, n) && map[n] === namespaceURI) {
							return n;
						}
    			}
    		}
    		el = el.nodeType == ATTRIBUTE_NODE?el.ownerDocument : el.parentNode;
    	}
    	return null;
    },
    // Introduced in DOM Level 3:
    lookupNamespaceURI:function(prefix){
    	var el = this;
    	while(el){
    		var map = el._nsMap;
    		//console.dir(map)
    		if(map){
    			if(Object.prototype.hasOwnProperty.call(map, prefix)){
    				return map[prefix] ;
    			}
    		}
    		el = el.nodeType == ATTRIBUTE_NODE?el.ownerDocument : el.parentNode;
    	}
    	return null;
    },
    // Introduced in DOM Level 3:
    isDefaultNamespace:function(namespaceURI){
    	var prefix = this.lookupPrefix(namespaceURI);
    	return prefix == null;
    }
};


function _xmlEncoder(c){
	return c == '<' && '&lt;' ||
         c == '>' && '&gt;' ||
         c == '&' && '&amp;' ||
         c == '"' && '&quot;' ||
         '&#'+c.charCodeAt()+';'
}


copy(NodeType,Node);
copy(NodeType,Node.prototype);

/**
 * @param callback return true for continue,false for break
 * @return boolean true: break visit;
 */
function _visitNode(node,callback){
	if(callback(node)){
		return true;
	}
	if(node = node.firstChild){
		do{
			if(_visitNode(node,callback)){return true}
        }while(node=node.nextSibling)
    }
}



function Document(){
	this.ownerDocument = this;
}

function _onAddAttribute(doc,el,newAttr){
	doc && doc._inc++;
	var ns = newAttr.namespaceURI ;
	if(ns === NAMESPACE.XMLNS){
		//update namespace
		el._nsMap[newAttr.prefix?newAttr.localName:''] = newAttr.value
	}
}

function _onRemoveAttribute(doc,el,newAttr,remove){
	doc && doc._inc++;
	var ns = newAttr.namespaceURI ;
	if(ns === NAMESPACE.XMLNS){
		//update namespace
		delete el._nsMap[newAttr.prefix?newAttr.localName:'']
	}
}

/**
 * Updates `el.childNodes`, updating the indexed items and it's `length`.
 * Passing `newChild` means it will be appended.
 * Otherwise it's assumed that an item has been removed,
 * and `el.firstNode` and it's `.nextSibling` are used
 * to walk the current list of child nodes.
 *
 * @param {Document} doc
 * @param {Node} el
 * @param {Node} [newChild]
 * @private
 */
function _onUpdateChild (doc, el, newChild) {
	if(doc && doc._inc){
		doc._inc++;
		//update childNodes
		var cs = el.childNodes;
		if (newChild) {
			cs[cs.length++] = newChild;
		} else {
			var child = el.firstChild;
			var i = 0;
			while (child) {
				cs[i++] = child;
				child = child.nextSibling;
			}
			cs.length = i;
			delete cs[cs.length];
		}
	}
}

/**
 * Removes the connections between `parentNode` and `child`
 * and any existing `child.previousSibling` or `child.nextSibling`.
 *
 * @see https://github.com/xmldom/xmldom/issues/135
 * @see https://github.com/xmldom/xmldom/issues/145
 *
 * @param {Node} parentNode
 * @param {Node} child
 * @returns {Node} the child that was removed.
 * @private
 */
function _removeChild (parentNode, child) {
	var previous = child.previousSibling;
	var next = child.nextSibling;
	if (previous) {
		previous.nextSibling = next;
	} else {
		parentNode.firstChild = next;
	}
	if (next) {
		next.previousSibling = previous;
	} else {
		parentNode.lastChild = previous;
	}
	child.parentNode = null;
	child.previousSibling = null;
	child.nextSibling = null;
	_onUpdateChild(parentNode.ownerDocument, parentNode);
	return child;
}

/**
 * Returns `true` if `node` can be a parent for insertion.
 * @param {Node} node
 * @returns {boolean}
 */
function hasValidParentNodeType(node) {
	return (
		node &&
		(node.nodeType === Node.DOCUMENT_NODE || node.nodeType === Node.DOCUMENT_FRAGMENT_NODE || node.nodeType === Node.ELEMENT_NODE)
	);
}

/**
 * Returns `true` if `node` can be inserted according to it's `nodeType`.
 * @param {Node} node
 * @returns {boolean}
 */
function hasInsertableNodeType(node) {
	return (
		node &&
		(isElementNode(node) ||
			isTextNode(node) ||
			isDocTypeNode(node) ||
			node.nodeType === Node.DOCUMENT_FRAGMENT_NODE ||
			node.nodeType === Node.COMMENT_NODE ||
			node.nodeType === Node.PROCESSING_INSTRUCTION_NODE)
	);
}

/**
 * Returns true if `node` is a DOCTYPE node
 * @param {Node} node
 * @returns {boolean}
 */
function isDocTypeNode(node) {
	return node && node.nodeType === Node.DOCUMENT_TYPE_NODE;
}

/**
 * Returns true if the node is an element
 * @param {Node} node
 * @returns {boolean}
 */
function isElementNode(node) {
	return node && node.nodeType === Node.ELEMENT_NODE;
}
/**
 * Returns true if `node` is a text node
 * @param {Node} node
 * @returns {boolean}
 */
function isTextNode(node) {
	return node && node.nodeType === Node.TEXT_NODE;
}

/**
 * Check if en element node can be inserted before `child`, or at the end if child is falsy,
 * according to the presence and position of a doctype node on the same level.
 *
 * @param {Document} doc The document node
 * @param {Node} child the node that would become the nextSibling if the element would be inserted
 * @returns {boolean} `true` if an element can be inserted before child
 * @private
 * https://dom.spec.whatwg.org/#concept-node-ensure-pre-insertion-validity
 */
function isElementInsertionPossible(doc, child) {
	var parentChildNodes = doc.childNodes || [];
	if (find(parentChildNodes, isElementNode) || isDocTypeNode(child)) {
		return false;
	}
	var docTypeNode = find(parentChildNodes, isDocTypeNode);
	return !(child && docTypeNode && parentChildNodes.indexOf(docTypeNode) > parentChildNodes.indexOf(child));
}

/**
 * Check if en element node can be inserted before `child`, or at the end if child is falsy,
 * according to the presence and position of a doctype node on the same level.
 *
 * @param {Node} doc The document node
 * @param {Node} child the node that would become the nextSibling if the element would be inserted
 * @returns {boolean} `true` if an element can be inserted before child
 * @private
 * https://dom.spec.whatwg.org/#concept-node-ensure-pre-insertion-validity
 */
function isElementReplacementPossible(doc, child) {
	var parentChildNodes = doc.childNodes || [];

	function hasElementChildThatIsNotChild(node) {
		return isElementNode(node) && node !== child;
	}

	if (find(parentChildNodes, hasElementChildThatIsNotChild)) {
		return false;
	}
	var docTypeNode = find(parentChildNodes, isDocTypeNode);
	return !(child && docTypeNode && parentChildNodes.indexOf(docTypeNode) > parentChildNodes.indexOf(child));
}

/**
 * @private
 * Steps 1-5 of the checks before inserting and before replacing a child are the same.
 *
 * @param {Node} parent the parent node to insert `node` into
 * @param {Node} node the node to insert
 * @param {Node=} child the node that should become the `nextSibling` of `node`
 * @returns {Node}
 * @throws DOMException for several node combinations that would create a DOM that is not well-formed.
 * @throws DOMException if `child` is provided but is not a child of `parent`.
 * @see https://dom.spec.whatwg.org/#concept-node-ensure-pre-insertion-validity
 * @see https://dom.spec.whatwg.org/#concept-node-replace
 */
function assertPreInsertionValidity1to5(parent, node, child) {
	// 1. If `parent` is not a Document, DocumentFragment, or Element node, then throw a "HierarchyRequestError" DOMException.
	if (!hasValidParentNodeType(parent)) {
		throw new DOMException(HIERARCHY_REQUEST_ERR, 'Unexpected parent node type ' + parent.nodeType);
	}
	// 2. If `node` is a host-including inclusive ancestor of `parent`, then throw a "HierarchyRequestError" DOMException.
	// not implemented!
	// 3. If `child` is non-null and its parent is not `parent`, then throw a "NotFoundError" DOMException.
	if (child && child.parentNode !== parent) {
		throw new DOMException(NOT_FOUND_ERR, 'child not in parent');
	}
	if (
		// 4. If `node` is not a DocumentFragment, DocumentType, Element, or CharacterData node, then throw a "HierarchyRequestError" DOMException.
		!hasInsertableNodeType(node) ||
		// 5. If either `node` is a Text node and `parent` is a document,
		// the sax parser currently adds top level text nodes, this will be fixed in 0.9.0
		// || (node.nodeType === Node.TEXT_NODE && parent.nodeType === Node.DOCUMENT_NODE)
		// or `node` is a doctype and `parent` is not a document, then throw a "HierarchyRequestError" DOMException.
		(isDocTypeNode(node) && parent.nodeType !== Node.DOCUMENT_NODE)
	) {
		throw new DOMException(
			HIERARCHY_REQUEST_ERR,
			'Unexpected node type ' + node.nodeType + ' for parent node type ' + parent.nodeType
		);
	}
}

/**
 * @private
 * Step 6 of the checks before inserting and before replacing a child are different.
 *
 * @param {Document} parent the parent node to insert `node` into
 * @param {Node} node the node to insert
 * @param {Node | undefined} child the node that should become the `nextSibling` of `node`
 * @returns {Node}
 * @throws DOMException for several node combinations that would create a DOM that is not well-formed.
 * @throws DOMException if `child` is provided but is not a child of `parent`.
 * @see https://dom.spec.whatwg.org/#concept-node-ensure-pre-insertion-validity
 * @see https://dom.spec.whatwg.org/#concept-node-replace
 */
function assertPreInsertionValidityInDocument(parent, node, child) {
	var parentChildNodes = parent.childNodes || [];
	var nodeChildNodes = node.childNodes || [];

	// DocumentFragment
	if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
		var nodeChildElements = nodeChildNodes.filter(isElementNode);
		// If node has more than one element child or has a Text node child.
		if (nodeChildElements.length > 1 || find(nodeChildNodes, isTextNode)) {
			throw new DOMException(HIERARCHY_REQUEST_ERR, 'More than one element or text in fragment');
		}
		// Otherwise, if `node` has one element child and either `parent` has an element child,
		// `child` is a doctype, or `child` is non-null and a doctype is following `child`.
		if (nodeChildElements.length === 1 && !isElementInsertionPossible(parent, child)) {
			throw new DOMException(HIERARCHY_REQUEST_ERR, 'Element in fragment can not be inserted before doctype');
		}
	}
	// Element
	if (isElementNode(node)) {
		// `parent` has an element child, `child` is a doctype,
		// or `child` is non-null and a doctype is following `child`.
		if (!isElementInsertionPossible(parent, child)) {
			throw new DOMException(HIERARCHY_REQUEST_ERR, 'Only one element can be added and only after doctype');
		}
	}
	// DocumentType
	if (isDocTypeNode(node)) {
		// `parent` has a doctype child,
		if (find(parentChildNodes, isDocTypeNode)) {
			throw new DOMException(HIERARCHY_REQUEST_ERR, 'Only one doctype is allowed');
		}
		var parentElementChild = find(parentChildNodes, isElementNode);
		// `child` is non-null and an element is preceding `child`,
		if (child && parentChildNodes.indexOf(parentElementChild) < parentChildNodes.indexOf(child)) {
			throw new DOMException(HIERARCHY_REQUEST_ERR, 'Doctype can only be inserted before an element');
		}
		// or `child` is null and `parent` has an element child.
		if (!child && parentElementChild) {
			throw new DOMException(HIERARCHY_REQUEST_ERR, 'Doctype can not be appended since element is present');
		}
	}
}

/**
 * @private
 * Step 6 of the checks before inserting and before replacing a child are different.
 *
 * @param {Document} parent the parent node to insert `node` into
 * @param {Node} node the node to insert
 * @param {Node | undefined} child the node that should become the `nextSibling` of `node`
 * @returns {Node}
 * @throws DOMException for several node combinations that would create a DOM that is not well-formed.
 * @throws DOMException if `child` is provided but is not a child of `parent`.
 * @see https://dom.spec.whatwg.org/#concept-node-ensure-pre-insertion-validity
 * @see https://dom.spec.whatwg.org/#concept-node-replace
 */
function assertPreReplacementValidityInDocument(parent, node, child) {
	var parentChildNodes = parent.childNodes || [];
	var nodeChildNodes = node.childNodes || [];

	// DocumentFragment
	if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
		var nodeChildElements = nodeChildNodes.filter(isElementNode);
		// If `node` has more than one element child or has a Text node child.
		if (nodeChildElements.length > 1 || find(nodeChildNodes, isTextNode)) {
			throw new DOMException(HIERARCHY_REQUEST_ERR, 'More than one element or text in fragment');
		}
		// Otherwise, if `node` has one element child and either `parent` has an element child that is not `child` or a doctype is following `child`.
		if (nodeChildElements.length === 1 && !isElementReplacementPossible(parent, child)) {
			throw new DOMException(HIERARCHY_REQUEST_ERR, 'Element in fragment can not be inserted before doctype');
		}
	}
	// Element
	if (isElementNode(node)) {
		// `parent` has an element child that is not `child` or a doctype is following `child`.
		if (!isElementReplacementPossible(parent, child)) {
			throw new DOMException(HIERARCHY_REQUEST_ERR, 'Only one element can be added and only after doctype');
		}
	}
	// DocumentType
	if (isDocTypeNode(node)) {
		function hasDoctypeChildThatIsNotChild(node) {
			return isDocTypeNode(node) && node !== child;
		}

		// `parent` has a doctype child that is not `child`,
		if (find(parentChildNodes, hasDoctypeChildThatIsNotChild)) {
			throw new DOMException(HIERARCHY_REQUEST_ERR, 'Only one doctype is allowed');
		}
		var parentElementChild = find(parentChildNodes, isElementNode);
		// or an element is preceding `child`.
		if (child && parentChildNodes.indexOf(parentElementChild) < parentChildNodes.indexOf(child)) {
			throw new DOMException(HIERARCHY_REQUEST_ERR, 'Doctype can only be inserted before an element');
		}
	}
}

/**
 * @private
 * @param {Node} parent the parent node to insert `node` into
 * @param {Node} node the node to insert
 * @param {Node=} child the node that should become the `nextSibling` of `node`
 * @returns {Node}
 * @throws DOMException for several node combinations that would create a DOM that is not well-formed.
 * @throws DOMException if `child` is provided but is not a child of `parent`.
 * @see https://dom.spec.whatwg.org/#concept-node-ensure-pre-insertion-validity
 */
function _insertBefore(parent, node, child, _inDocumentAssertion) {
	// To ensure pre-insertion validity of a node into a parent before a child, run these steps:
	assertPreInsertionValidity1to5(parent, node, child);

	// If parent is a document, and any of the statements below, switched on the interface node implements,
	// are true, then throw a "HierarchyRequestError" DOMException.
	if (parent.nodeType === Node.DOCUMENT_NODE) {
		(_inDocumentAssertion || assertPreInsertionValidityInDocument)(parent, node, child);
	}

	var cp = node.parentNode;
	if(cp){
		cp.removeChild(node);//remove and update
	}
	if(node.nodeType === DOCUMENT_FRAGMENT_NODE){
		var newFirst = node.firstChild;
		if (newFirst == null) {
			return node;
		}
		var newLast = node.lastChild;
	}else{
		newFirst = newLast = node;
	}
	var pre = child ? child.previousSibling : parent.lastChild;

	newFirst.previousSibling = pre;
	newLast.nextSibling = child;


	if(pre){
		pre.nextSibling = newFirst;
	}else{
		parent.firstChild = newFirst;
	}
	if(child == null){
		parent.lastChild = newLast;
	}else{
		child.previousSibling = newLast;
	}
	do{
		newFirst.parentNode = parent;
	}while(newFirst !== newLast && (newFirst= newFirst.nextSibling))
	_onUpdateChild(parent.ownerDocument||parent, parent);
	//console.log(parent.lastChild.nextSibling == null)
	if (node.nodeType == DOCUMENT_FRAGMENT_NODE) {
		node.firstChild = node.lastChild = null;
	}
	return node;
}

/**
 * Appends `newChild` to `parentNode`.
 * If `newChild` is already connected to a `parentNode` it is first removed from it.
 *
 * @see https://github.com/xmldom/xmldom/issues/135
 * @see https://github.com/xmldom/xmldom/issues/145
 * @param {Node} parentNode
 * @param {Node} newChild
 * @returns {Node}
 * @private
 */
function _appendSingleChild (parentNode, newChild) {
	if (newChild.parentNode) {
		newChild.parentNode.removeChild(newChild);
	}
	newChild.parentNode = parentNode;
	newChild.previousSibling = parentNode.lastChild;
	newChild.nextSibling = null;
	if (newChild.previousSibling) {
		newChild.previousSibling.nextSibling = newChild;
	} else {
		parentNode.firstChild = newChild;
	}
	parentNode.lastChild = newChild;
	_onUpdateChild(parentNode.ownerDocument, parentNode, newChild);
	return newChild;
}

Document.prototype = {
	//implementation : null,
	nodeName :  '#document',
	nodeType :  DOCUMENT_NODE,
	/**
	 * The DocumentType node of the document.
	 *
	 * @readonly
	 * @type DocumentType
	 */
	doctype :  null,
	documentElement :  null,
	_inc : 1,

	insertBefore :  function(newChild, refChild){//raises
		if(newChild.nodeType == DOCUMENT_FRAGMENT_NODE){
			var child = newChild.firstChild;
			while(child){
				var next = child.nextSibling;
				this.insertBefore(child,refChild);
				child = next;
			}
			return newChild;
		}
		_insertBefore(this, newChild, refChild);
		newChild.ownerDocument = this;
		if (this.documentElement === null && newChild.nodeType === ELEMENT_NODE) {
			this.documentElement = newChild;
		}

		return newChild;
	},
	removeChild :  function(oldChild){
		if(this.documentElement == oldChild){
			this.documentElement = null;
		}
		return _removeChild(this,oldChild);
	},
	replaceChild: function (newChild, oldChild) {
		//raises
		_insertBefore(this, newChild, oldChild, assertPreReplacementValidityInDocument);
		newChild.ownerDocument = this;
		if (oldChild) {
			this.removeChild(oldChild);
		}
		if (isElementNode(newChild)) {
			this.documentElement = newChild;
		}
	},
	// Introduced in DOM Level 2:
	importNode : function(importedNode,deep){
		return importNode(this,importedNode,deep);
	},
	// Introduced in DOM Level 2:
	getElementById :	function(id){
		var rtv = null;
		_visitNode(this.documentElement,function(node){
			if(node.nodeType == ELEMENT_NODE){
				if(node.getAttribute('id') == id){
					rtv = node;
					return true;
				}
			}
		})
		return rtv;
	},

	/**
	 * The `getElementsByClassName` method of `Document` interface returns an array-like object
	 * of all child elements which have **all** of the given class name(s).
	 *
	 * Returns an empty list if `classeNames` is an empty string or only contains HTML white space characters.
	 *
	 *
	 * Warning: This is a live LiveNodeList.
	 * Changes in the DOM will reflect in the array as the changes occur.
	 * If an element selected by this array no longer qualifies for the selector,
	 * it will automatically be removed. Be aware of this for iteration purposes.
	 *
	 * @param {string} classNames is a string representing the class name(s) to match; multiple class names are separated by (ASCII-)whitespace
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByClassName
	 * @see https://dom.spec.whatwg.org/#concept-getelementsbyclassname
	 */
	getElementsByClassName: function(classNames) {
		var classNamesSet = toOrderedSet(classNames)
		return new LiveNodeList(this, function(base) {
			var ls = [];
			if (classNamesSet.length > 0) {
				_visitNode(base.documentElement, function(node) {
					if(node !== base && node.nodeType === ELEMENT_NODE) {
						var nodeClassNames = node.getAttribute('class')
						// can be null if the attribute does not exist
						if (nodeClassNames) {
							// before splitting and iterating just compare them for the most common case
							var matches = classNames === nodeClassNames;
							if (!matches) {
								var nodeClassNamesSet = toOrderedSet(nodeClassNames)
								matches = classNamesSet.every(arrayIncludes(nodeClassNamesSet))
							}
							if(matches) {
								ls.push(node);
							}
						}
					}
				});
			}
			return ls;
		});
	},

	//document factory method:
	createElement :	function(tagName){
		var node = new Element();
		node.ownerDocument = this;
		node.nodeName = tagName;
		node.tagName = tagName;
		node.localName = tagName;
		node.childNodes = new NodeList();
		var attrs	= node.attributes = new NamedNodeMap();
		attrs._ownerElement = node;
		return node;
	},
	createDocumentFragment :	function(){
		var node = new DocumentFragment();
		node.ownerDocument = this;
		node.childNodes = new NodeList();
		return node;
	},
	createTextNode :	function(data){
		var node = new Text();
		node.ownerDocument = this;
		node.appendData(data)
		return node;
	},
	createComment :	function(data){
		var node = new Comment();
		node.ownerDocument = this;
		node.appendData(data)
		return node;
	},
	createCDATASection :	function(data){
		var node = new CDATASection();
		node.ownerDocument = this;
		node.appendData(data)
		return node;
	},
	createProcessingInstruction :	function(target,data){
		var node = new ProcessingInstruction();
		node.ownerDocument = this;
		node.tagName = node.target = target;
		node.nodeValue= node.data = data;
		return node;
	},
	createAttribute :	function(name){
		var node = new Attr();
		node.ownerDocument	= this;
		node.name = name;
		node.nodeName	= name;
		node.localName = name;
		node.specified = true;
		return node;
	},
	createEntityReference :	function(name){
		var node = new EntityReference();
		node.ownerDocument	= this;
		node.nodeName	= name;
		return node;
	},
	// Introduced in DOM Level 2:
	createElementNS :	function(namespaceURI,qualifiedName){
		var node = new Element();
		var pl = qualifiedName.split(':');
		var attrs	= node.attributes = new NamedNodeMap();
		node.childNodes = new NodeList();
		node.ownerDocument = this;
		node.nodeName = qualifiedName;
		node.tagName = qualifiedName;
		node.namespaceURI = namespaceURI;
		if(pl.length == 2){
			node.prefix = pl[0];
			node.localName = pl[1];
		}else{
			//el.prefix = null;
			node.localName = qualifiedName;
		}
		attrs._ownerElement = node;
		return node;
	},
	// Introduced in DOM Level 2:
	createAttributeNS :	function(namespaceURI,qualifiedName){
		var node = new Attr();
		var pl = qualifiedName.split(':');
		node.ownerDocument = this;
		node.nodeName = qualifiedName;
		node.name = qualifiedName;
		node.namespaceURI = namespaceURI;
		node.specified = true;
		if(pl.length == 2){
			node.prefix = pl[0];
			node.localName = pl[1];
		}else{
			//el.prefix = null;
			node.localName = qualifiedName;
		}
		return node;
	}
};
_extends(Document,Node);


function Element() {
	this._nsMap = {};
};
Element.prototype = {
	nodeType : ELEMENT_NODE,
	hasAttribute : function(name){
		return this.getAttributeNode(name)!=null;
	},
	getAttribute : function(name){
		var attr = this.getAttributeNode(name);
		return attr && attr.value || '';
	},
	getAttributeNode : function(name){
		return this.attributes.getNamedItem(name);
	},
	setAttribute : function(name, value){
		var attr = this.ownerDocument.createAttribute(name);
		attr.value = attr.nodeValue = "" + value;
		this.setAttributeNode(attr)
	},
	removeAttribute : function(name){
		var attr = this.getAttributeNode(name)
		attr && this.removeAttributeNode(attr);
	},

	//four real opeartion method
	appendChild:function(newChild){
		if(newChild.nodeType === DOCUMENT_FRAGMENT_NODE){
			return this.insertBefore(newChild,null);
		}else{
			return _appendSingleChild(this,newChild);
		}
	},
	setAttributeNode : function(newAttr){
		return this.attributes.setNamedItem(newAttr);
	},
	setAttributeNodeNS : function(newAttr){
		return this.attributes.setNamedItemNS(newAttr);
	},
	removeAttributeNode : function(oldAttr){
		//console.log(this == oldAttr.ownerElement)
		return this.attributes.removeNamedItem(oldAttr.nodeName);
	},
	//get real attribute name,and remove it by removeAttributeNode
	removeAttributeNS : function(namespaceURI, localName){
		var old = this.getAttributeNodeNS(namespaceURI, localName);
		old && this.removeAttributeNode(old);
	},

	hasAttributeNS : function(namespaceURI, localName){
		return this.getAttributeNodeNS(namespaceURI, localName)!=null;
	},
	getAttributeNS : function(namespaceURI, localName){
		var attr = this.getAttributeNodeNS(namespaceURI, localName);
		return attr && attr.value || '';
	},
	setAttributeNS : function(namespaceURI, qualifiedName, value){
		var attr = this.ownerDocument.createAttributeNS(namespaceURI, qualifiedName);
		attr.value = attr.nodeValue = "" + value;
		this.setAttributeNode(attr)
	},
	getAttributeNodeNS : function(namespaceURI, localName){
		return this.attributes.getNamedItemNS(namespaceURI, localName);
	},

	getElementsByTagName : function(tagName){
		return new LiveNodeList(this,function(base){
			var ls = [];
			_visitNode(base,function(node){
				if(node !== base && node.nodeType == ELEMENT_NODE && (tagName === '*' || node.tagName == tagName)){
					ls.push(node);
				}
			});
			return ls;
		});
	},
	getElementsByTagNameNS : function(namespaceURI, localName){
		return new LiveNodeList(this,function(base){
			var ls = [];
			_visitNode(base,function(node){
				if(node !== base && node.nodeType === ELEMENT_NODE && (namespaceURI === '*' || node.namespaceURI === namespaceURI) && (localName === '*' || node.localName == localName)){
					ls.push(node);
				}
			});
			return ls;

		});
	}
};
Document.prototype.getElementsByTagName = Element.prototype.getElementsByTagName;
Document.prototype.getElementsByTagNameNS = Element.prototype.getElementsByTagNameNS;


_extends(Element,Node);
function Attr() {
};
Attr.prototype.nodeType = ATTRIBUTE_NODE;
_extends(Attr,Node);


function CharacterData() {
};
CharacterData.prototype = {
	data : '',
	substringData : function(offset, count) {
		return this.data.substring(offset, offset+count);
	},
	appendData: function(text) {
		text = this.data+text;
		this.nodeValue = this.data = text;
		this.length = text.length;
	},
	insertData: function(offset,text) {
		this.replaceData(offset,0,text);

	},
	appendChild:function(newChild){
		throw new Error(ExceptionMessage[HIERARCHY_REQUEST_ERR])
	},
	deleteData: function(offset, count) {
		this.replaceData(offset,count,"");
	},
	replaceData: function(offset, count, text) {
		var start = this.data.substring(0,offset);
		var end = this.data.substring(offset+count);
		text = start + text + end;
		this.nodeValue = this.data = text;
		this.length = text.length;
	}
}
_extends(CharacterData,Node);
function Text() {
};
Text.prototype = {
	nodeName : "#text",
	nodeType : TEXT_NODE,
	splitText : function(offset) {
		var text = this.data;
		var newText = text.substring(offset);
		text = text.substring(0, offset);
		this.data = this.nodeValue = text;
		this.length = text.length;
		var newNode = this.ownerDocument.createTextNode(newText);
		if(this.parentNode){
			this.parentNode.insertBefore(newNode, this.nextSibling);
		}
		return newNode;
	}
}
_extends(Text,CharacterData);
function Comment() {
};
Comment.prototype = {
	nodeName : "#comment",
	nodeType : COMMENT_NODE
}
_extends(Comment,CharacterData);

function CDATASection() {
};
CDATASection.prototype = {
	nodeName : "#cdata-section",
	nodeType : CDATA_SECTION_NODE
}
_extends(CDATASection,CharacterData);


function DocumentType() {
};
DocumentType.prototype.nodeType = DOCUMENT_TYPE_NODE;
_extends(DocumentType,Node);

function Notation() {
};
Notation.prototype.nodeType = NOTATION_NODE;
_extends(Notation,Node);

function Entity() {
};
Entity.prototype.nodeType = ENTITY_NODE;
_extends(Entity,Node);

function EntityReference() {
};
EntityReference.prototype.nodeType = ENTITY_REFERENCE_NODE;
_extends(EntityReference,Node);

function DocumentFragment() {
};
DocumentFragment.prototype.nodeName =	"#document-fragment";
DocumentFragment.prototype.nodeType =	DOCUMENT_FRAGMENT_NODE;
_extends(DocumentFragment,Node);


function ProcessingInstruction() {
}
ProcessingInstruction.prototype.nodeType = PROCESSING_INSTRUCTION_NODE;
_extends(ProcessingInstruction,Node);
function XMLSerializer(){}
XMLSerializer.prototype.serializeToString = function(node,isHtml,nodeFilter){
	return nodeSerializeToString.call(node,isHtml,nodeFilter);
}
Node.prototype.toString = nodeSerializeToString;
function nodeSerializeToString(isHtml,nodeFilter){
	var buf = [];
	var refNode = this.nodeType == 9 && this.documentElement || this;
	var prefix = refNode.prefix;
	var uri = refNode.namespaceURI;

	if(uri && prefix == null){
		//console.log(prefix)
		var prefix = refNode.lookupPrefix(uri);
		if(prefix == null){
			//isHTML = true;
			var visibleNamespaces=[
			{namespace:uri,prefix:null}
			//{namespace:uri,prefix:''}
			]
		}
	}
	serializeToString(this,buf,isHtml,nodeFilter,visibleNamespaces);
	//console.log('###',this.nodeType,uri,prefix,buf.join(''))
	return buf.join('');
}

function needNamespaceDefine(node, isHTML, visibleNamespaces) {
	var prefix = node.prefix || '';
	var uri = node.namespaceURI;
	// According to [Namespaces in XML 1.0](https://www.w3.org/TR/REC-xml-names/#ns-using) ,
	// and more specifically https://www.w3.org/TR/REC-xml-names/#nsc-NoPrefixUndecl :
	// > In a namespace declaration for a prefix [...], the attribute value MUST NOT be empty.
	// in a similar manner [Namespaces in XML 1.1](https://www.w3.org/TR/xml-names11/#ns-using)
	// and more specifically https://www.w3.org/TR/xml-names11/#nsc-NSDeclared :
	// > [...] Furthermore, the attribute value [...] must not be an empty string.
	// so serializing empty namespace value like xmlns:ds="" would produce an invalid XML document.
	if (!uri) {
		return false;
	}
	if (prefix === "xml" && uri === NAMESPACE.XML || uri === NAMESPACE.XMLNS) {
		return false;
	}

	var i = visibleNamespaces.length
	while (i--) {
		var ns = visibleNamespaces[i];
		// get namespace prefix
		if (ns.prefix === prefix) {
			return ns.namespace !== uri;
		}
	}
	return true;
}
/**
 * Well-formed constraint: No < in Attribute Values
 * > The replacement text of any entity referred to directly or indirectly
 * > in an attribute value must not contain a <.
 * @see https://www.w3.org/TR/xml11/#CleanAttrVals
 * @see https://www.w3.org/TR/xml11/#NT-AttValue
 *
 * Literal whitespace other than space that appear in attribute values
 * are serialized as their entity references, so they will be preserved.
 * (In contrast to whitespace literals in the input which are normalized to spaces)
 * @see https://www.w3.org/TR/xml11/#AVNormalize
 * @see https://w3c.github.io/DOM-Parsing/#serializing-an-element-s-attributes
 */
function addSerializedAttribute(buf, qualifiedName, value) {
	buf.push(' ', qualifiedName, '="', value.replace(/[<>&"\t\n\r]/g, _xmlEncoder), '"')
}

function serializeToString(node,buf,isHTML,nodeFilter,visibleNamespaces){
	if (!visibleNamespaces) {
		visibleNamespaces = [];
	}

	if(nodeFilter){
		node = nodeFilter(node);
		if(node){
			if(typeof node == 'string'){
				buf.push(node);
				return;
			}
		}else{
			return;
		}
		//buf.sort.apply(attrs, attributeSorter);
	}

	switch(node.nodeType){
	case ELEMENT_NODE:
		var attrs = node.attributes;
		var len = attrs.length;
		var child = node.firstChild;
		var nodeName = node.tagName;

		isHTML = NAMESPACE.isHTML(node.namespaceURI) || isHTML

		var prefixedNodeName = nodeName
		if (!isHTML && !node.prefix && node.namespaceURI) {
			var defaultNS
			// lookup current default ns from `xmlns` attribute
			for (var ai = 0; ai < attrs.length; ai++) {
				if (attrs.item(ai).name === 'xmlns') {
					defaultNS = attrs.item(ai).value
					break
				}
			}
			if (!defaultNS) {
				// lookup current default ns in visibleNamespaces
				for (var nsi = visibleNamespaces.length - 1; nsi >= 0; nsi--) {
					var namespace = visibleNamespaces[nsi]
					if (namespace.prefix === '' && namespace.namespace === node.namespaceURI) {
						defaultNS = namespace.namespace
						break
					}
				}
			}
			if (defaultNS !== node.namespaceURI) {
				for (var nsi = visibleNamespaces.length - 1; nsi >= 0; nsi--) {
					var namespace = visibleNamespaces[nsi]
					if (namespace.namespace === node.namespaceURI) {
						if (namespace.prefix) {
							prefixedNodeName = namespace.prefix + ':' + nodeName
						}
						break
					}
				}
			}
		}

		buf.push('<', prefixedNodeName);

		for(var i=0;i<len;i++){
			// add namespaces for attributes
			var attr = attrs.item(i);
			if (attr.prefix == 'xmlns') {
				visibleNamespaces.push({ prefix: attr.localName, namespace: attr.value });
			}else if(attr.nodeName == 'xmlns'){
				visibleNamespaces.push({ prefix: '', namespace: attr.value });
			}
		}

		for(var i=0;i<len;i++){
			var attr = attrs.item(i);
			if (needNamespaceDefine(attr,isHTML, visibleNamespaces)) {
				var prefix = attr.prefix||'';
				var uri = attr.namespaceURI;
				addSerializedAttribute(buf, prefix ? 'xmlns:' + prefix : "xmlns", uri);
				visibleNamespaces.push({ prefix: prefix, namespace:uri });
			}
			serializeToString(attr,buf,isHTML,nodeFilter,visibleNamespaces);
		}

		// add namespace for current node
		if (nodeName === prefixedNodeName && needNamespaceDefine(node, isHTML, visibleNamespaces)) {
			var prefix = node.prefix||'';
			var uri = node.namespaceURI;
			addSerializedAttribute(buf, prefix ? 'xmlns:' + prefix : "xmlns", uri);
			visibleNamespaces.push({ prefix: prefix, namespace:uri });
		}

		if(child || isHTML && !/^(?:meta|link|img|br|hr|input)$/i.test(nodeName)){
			buf.push('>');
			//if is cdata child node
			if(isHTML && /^script$/i.test(nodeName)){
				while(child){
					if(child.data){
						buf.push(child.data);
					}else{
						serializeToString(child, buf, isHTML, nodeFilter, visibleNamespaces.slice());
					}
					child = child.nextSibling;
				}
			}else
			{
				while(child){
					serializeToString(child, buf, isHTML, nodeFilter, visibleNamespaces.slice());
					child = child.nextSibling;
				}
			}
			buf.push('</',prefixedNodeName,'>');
		}else{
			buf.push('/>');
		}
		// remove added visible namespaces
		//visibleNamespaces.length = startVisibleNamespaces;
		return;
	case DOCUMENT_NODE:
	case DOCUMENT_FRAGMENT_NODE:
		var child = node.firstChild;
		while(child){
			serializeToString(child, buf, isHTML, nodeFilter, visibleNamespaces.slice());
			child = child.nextSibling;
		}
		return;
	case ATTRIBUTE_NODE:
		return addSerializedAttribute(buf, node.name, node.value);
	case TEXT_NODE:
		/**
		 * The ampersand character (&) and the left angle bracket (<) must not appear in their literal form,
		 * except when used as markup delimiters, or within a comment, a processing instruction, or a CDATA section.
		 * If they are needed elsewhere, they must be escaped using either numeric character references or the strings
		 * `&amp;` and `&lt;` respectively.
		 * The right angle bracket (>) may be represented using the string " &gt; ", and must, for compatibility,
		 * be escaped using either `&gt;` or a character reference when it appears in the string `]]>` in content,
		 * when that string is not marking the end of a CDATA section.
		 *
		 * In the content of elements, character data is any string of characters
		 * which does not contain the start-delimiter of any markup
		 * and does not include the CDATA-section-close delimiter, `]]>`.
		 *
		 * @see https://www.w3.org/TR/xml/#NT-CharData
		 * @see https://w3c.github.io/DOM-Parsing/#xml-serializing-a-text-node
		 */
		return buf.push(node.data
			.replace(/[<&>]/g,_xmlEncoder)
		);
	case CDATA_SECTION_NODE:
		return buf.push( '<![CDATA[',node.data,']]>');
	case COMMENT_NODE:
		return buf.push( "<!--",node.data,"-->");
	case DOCUMENT_TYPE_NODE:
		var pubid = node.publicId;
		var sysid = node.systemId;
		buf.push('<!DOCTYPE ',node.name);
		if(pubid){
			buf.push(' PUBLIC ', pubid);
			if (sysid && sysid!='.') {
				buf.push(' ', sysid);
			}
			buf.push('>');
		}else if(sysid && sysid!='.'){
			buf.push(' SYSTEM ', sysid, '>');
		}else{
			var sub = node.internalSubset;
			if(sub){
				buf.push(" [",sub,"]");
			}
			buf.push(">");
		}
		return;
	case PROCESSING_INSTRUCTION_NODE:
		return buf.push( "<?",node.target," ",node.data,"?>");
	case ENTITY_REFERENCE_NODE:
		return buf.push( '&',node.nodeName,';');
	//case ENTITY_NODE:
	//case NOTATION_NODE:
	default:
		buf.push('??',node.nodeName);
	}
}
function importNode(doc,node,deep){
	var node2;
	switch (node.nodeType) {
	case ELEMENT_NODE:
		node2 = node.cloneNode(false);
		node2.ownerDocument = doc;
		//var attrs = node2.attributes;
		//var len = attrs.length;
		//for(var i=0;i<len;i++){
			//node2.setAttributeNodeNS(importNode(doc,attrs.item(i),deep));
		//}
	case DOCUMENT_FRAGMENT_NODE:
		break;
	case ATTRIBUTE_NODE:
		deep = true;
		break;
	//case ENTITY_REFERENCE_NODE:
	//case PROCESSING_INSTRUCTION_NODE:
	////case TEXT_NODE:
	//case CDATA_SECTION_NODE:
	//case COMMENT_NODE:
	//	deep = false;
	//	break;
	//case DOCUMENT_NODE:
	//case DOCUMENT_TYPE_NODE:
	//cannot be imported.
	//case ENTITY_NODE:
	//case NOTATION_NODE：
	//can not hit in level3
	//default:throw e;
	}
	if(!node2){
		node2 = node.cloneNode(false);//false
	}
	node2.ownerDocument = doc;
	node2.parentNode = null;
	if(deep){
		var child = node.firstChild;
		while(child){
			node2.appendChild(importNode(doc,child,deep));
			child = child.nextSibling;
		}
	}
	return node2;
}
//
//var _relationMap = {firstChild:1,lastChild:1,previousSibling:1,nextSibling:1,
//					attributes:1,childNodes:1,parentNode:1,documentElement:1,doctype,};
function cloneNode(doc,node,deep){
	var node2 = new node.constructor();
	for (var n in node) {
		if (Object.prototype.hasOwnProperty.call(node, n)) {
			var v = node[n];
			if (typeof v != "object") {
				if (v != node2[n]) {
					node2[n] = v;
				}
			}
		}
	}
	if(node.childNodes){
		node2.childNodes = new NodeList();
	}
	node2.ownerDocument = doc;
	switch (node2.nodeType) {
	case ELEMENT_NODE:
		var attrs	= node.attributes;
		var attrs2	= node2.attributes = new NamedNodeMap();
		var len = attrs.length
		attrs2._ownerElement = node2;
		for(var i=0;i<len;i++){
			node2.setAttributeNode(cloneNode(doc,attrs.item(i),true));
		}
		break;;
	case ATTRIBUTE_NODE:
		deep = true;
	}
	if(deep){
		var child = node.firstChild;
		while(child){
			node2.appendChild(cloneNode(doc,child,deep));
			child = child.nextSibling;
		}
	}
	return node2;
}

function __set__(object,key,value){
	object[key] = value
}
//do dynamic
try{
	if(Object.defineProperty){
		Object.defineProperty(LiveNodeList.prototype,'length',{
			get:function(){
				_updateLiveList(this);
				return this.$$length;
			}
		});

		Object.defineProperty(Node.prototype,'textContent',{
			get:function(){
				return getTextContent(this);
			},

			set:function(data){
				switch(this.nodeType){
				case ELEMENT_NODE:
				case DOCUMENT_FRAGMENT_NODE:
					while(this.firstChild){
						this.removeChild(this.firstChild);
					}
					if(data || String(data)){
						this.appendChild(this.ownerDocument.createTextNode(data));
					}
					break;

				default:
					this.data = data;
					this.value = data;
					this.nodeValue = data;
				}
			}
		})

		function getTextContent(node){
			switch(node.nodeType){
			case ELEMENT_NODE:
			case DOCUMENT_FRAGMENT_NODE:
				var buf = [];
				node = node.firstChild;
				while(node){
					if(node.nodeType!==7 && node.nodeType !==8){
						buf.push(getTextContent(node));
					}
					node = node.nextSibling;
				}
				return buf.join('');
			default:
				return node.nodeValue;
			}
		}

		__set__ = function(object,key,value){
			//console.log(value)
			object['$$'+key] = value
		}
	}
}catch(e){//ie8
}

//if(typeof require == 'function'){
	exports.DocumentType = DocumentType;
	exports.DOMException = DOMException;
	exports.DOMImplementation = DOMImplementation;
	exports.Element = Element;
	exports.Node = Node;
	exports.NodeList = NodeList;
	exports.XMLSerializer = XMLSerializer;
//}


/***/ }),

/***/ "./node_modules/@xmldom/xmldom/lib/entities.js":
/*!*****************************************************!*\
  !*** ./node_modules/@xmldom/xmldom/lib/entities.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var freeze = (__webpack_require__(/*! ./conventions */ "./node_modules/@xmldom/xmldom/lib/conventions.js").freeze);

/**
 * The entities that are predefined in every XML document.
 *
 * @see https://www.w3.org/TR/2006/REC-xml11-20060816/#sec-predefined-ent W3C XML 1.1
 * @see https://www.w3.org/TR/2008/REC-xml-20081126/#sec-predefined-ent W3C XML 1.0
 * @see https://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references#Predefined_entities_in_XML Wikipedia
 */
exports.XML_ENTITIES = freeze({amp:'&', apos:"'", gt:'>', lt:'<', quot:'"'})

/**
 * A map of currently 241 entities that are detected in an HTML document.
 * They contain all entries from `XML_ENTITIES`.
 *
 * @see XML_ENTITIES
 * @see DOMParser.parseFromString
 * @see DOMImplementation.prototype.createHTMLDocument
 * @see https://html.spec.whatwg.org/#named-character-references WHATWG HTML(5) Spec
 * @see https://www.w3.org/TR/xml-entity-names/ W3C XML Entity Names
 * @see https://www.w3.org/TR/html4/sgml/entities.html W3C HTML4/SGML
 * @see https://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references#Character_entity_references_in_HTML Wikipedia (HTML)
 * @see https://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references#Entities_representing_special_characters_in_XHTML Wikpedia (XHTML)
 */
exports.HTML_ENTITIES = freeze({
       lt: '<',
       gt: '>',
       amp: '&',
       quot: '"',
       apos: "'",
       Agrave: "À",
       Aacute: "Á",
       Acirc: "Â",
       Atilde: "Ã",
       Auml: "Ä",
       Aring: "Å",
       AElig: "Æ",
       Ccedil: "Ç",
       Egrave: "È",
       Eacute: "É",
       Ecirc: "Ê",
       Euml: "Ë",
       Igrave: "Ì",
       Iacute: "Í",
       Icirc: "Î",
       Iuml: "Ï",
       ETH: "Ð",
       Ntilde: "Ñ",
       Ograve: "Ò",
       Oacute: "Ó",
       Ocirc: "Ô",
       Otilde: "Õ",
       Ouml: "Ö",
       Oslash: "Ø",
       Ugrave: "Ù",
       Uacute: "Ú",
       Ucirc: "Û",
       Uuml: "Ü",
       Yacute: "Ý",
       THORN: "Þ",
       szlig: "ß",
       agrave: "à",
       aacute: "á",
       acirc: "â",
       atilde: "ã",
       auml: "ä",
       aring: "å",
       aelig: "æ",
       ccedil: "ç",
       egrave: "è",
       eacute: "é",
       ecirc: "ê",
       euml: "ë",
       igrave: "ì",
       iacute: "í",
       icirc: "î",
       iuml: "ï",
       eth: "ð",
       ntilde: "ñ",
       ograve: "ò",
       oacute: "ó",
       ocirc: "ô",
       otilde: "õ",
       ouml: "ö",
       oslash: "ø",
       ugrave: "ù",
       uacute: "ú",
       ucirc: "û",
       uuml: "ü",
       yacute: "ý",
       thorn: "þ",
       yuml: "ÿ",
       nbsp: "\u00a0",
       iexcl: "¡",
       cent: "¢",
       pound: "£",
       curren: "¤",
       yen: "¥",
       brvbar: "¦",
       sect: "§",
       uml: "¨",
       copy: "©",
       ordf: "ª",
       laquo: "«",
       not: "¬",
       shy: "­­",
       reg: "®",
       macr: "¯",
       deg: "°",
       plusmn: "±",
       sup2: "²",
       sup3: "³",
       acute: "´",
       micro: "µ",
       para: "¶",
       middot: "·",
       cedil: "¸",
       sup1: "¹",
       ordm: "º",
       raquo: "»",
       frac14: "¼",
       frac12: "½",
       frac34: "¾",
       iquest: "¿",
       times: "×",
       divide: "÷",
       forall: "∀",
       part: "∂",
       exist: "∃",
       empty: "∅",
       nabla: "∇",
       isin: "∈",
       notin: "∉",
       ni: "∋",
       prod: "∏",
       sum: "∑",
       minus: "−",
       lowast: "∗",
       radic: "√",
       prop: "∝",
       infin: "∞",
       ang: "∠",
       and: "∧",
       or: "∨",
       cap: "∩",
       cup: "∪",
       'int': "∫",
       there4: "∴",
       sim: "∼",
       cong: "≅",
       asymp: "≈",
       ne: "≠",
       equiv: "≡",
       le: "≤",
       ge: "≥",
       sub: "⊂",
       sup: "⊃",
       nsub: "⊄",
       sube: "⊆",
       supe: "⊇",
       oplus: "⊕",
       otimes: "⊗",
       perp: "⊥",
       sdot: "⋅",
       Alpha: "Α",
       Beta: "Β",
       Gamma: "Γ",
       Delta: "Δ",
       Epsilon: "Ε",
       Zeta: "Ζ",
       Eta: "Η",
       Theta: "Θ",
       Iota: "Ι",
       Kappa: "Κ",
       Lambda: "Λ",
       Mu: "Μ",
       Nu: "Ν",
       Xi: "Ξ",
       Omicron: "Ο",
       Pi: "Π",
       Rho: "Ρ",
       Sigma: "Σ",
       Tau: "Τ",
       Upsilon: "Υ",
       Phi: "Φ",
       Chi: "Χ",
       Psi: "Ψ",
       Omega: "Ω",
       alpha: "α",
       beta: "β",
       gamma: "γ",
       delta: "δ",
       epsilon: "ε",
       zeta: "ζ",
       eta: "η",
       theta: "θ",
       iota: "ι",
       kappa: "κ",
       lambda: "λ",
       mu: "μ",
       nu: "ν",
       xi: "ξ",
       omicron: "ο",
       pi: "π",
       rho: "ρ",
       sigmaf: "ς",
       sigma: "σ",
       tau: "τ",
       upsilon: "υ",
       phi: "φ",
       chi: "χ",
       psi: "ψ",
       omega: "ω",
       thetasym: "ϑ",
       upsih: "ϒ",
       piv: "ϖ",
       OElig: "Œ",
       oelig: "œ",
       Scaron: "Š",
       scaron: "š",
       Yuml: "Ÿ",
       fnof: "ƒ",
       circ: "ˆ",
       tilde: "˜",
       ensp: " ",
       emsp: " ",
       thinsp: " ",
       zwnj: "‌",
       zwj: "‍",
       lrm: "‎",
       rlm: "‏",
       ndash: "–",
       mdash: "—",
       lsquo: "‘",
       rsquo: "’",
       sbquo: "‚",
       ldquo: "“",
       rdquo: "”",
       bdquo: "„",
       dagger: "†",
       Dagger: "‡",
       bull: "•",
       hellip: "…",
       permil: "‰",
       prime: "′",
       Prime: "″",
       lsaquo: "‹",
       rsaquo: "›",
       oline: "‾",
       euro: "€",
       trade: "™",
       larr: "←",
       uarr: "↑",
       rarr: "→",
       darr: "↓",
       harr: "↔",
       crarr: "↵",
       lceil: "⌈",
       rceil: "⌉",
       lfloor: "⌊",
       rfloor: "⌋",
       loz: "◊",
       spades: "♠",
       clubs: "♣",
       hearts: "♥",
       diams: "♦"
});

/**
 * @deprecated use `HTML_ENTITIES` instead
 * @see HTML_ENTITIES
 */
exports.entityMap = exports.HTML_ENTITIES


/***/ }),

/***/ "./node_modules/@xmldom/xmldom/lib/index.js":
/*!**************************************************!*\
  !*** ./node_modules/@xmldom/xmldom/lib/index.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var dom = __webpack_require__(/*! ./dom */ "./node_modules/@xmldom/xmldom/lib/dom.js")
exports.DOMImplementation = dom.DOMImplementation
exports.XMLSerializer = dom.XMLSerializer
exports.DOMParser = __webpack_require__(/*! ./dom-parser */ "./node_modules/@xmldom/xmldom/lib/dom-parser.js").DOMParser


/***/ }),

/***/ "./node_modules/@xmldom/xmldom/lib/sax.js":
/*!************************************************!*\
  !*** ./node_modules/@xmldom/xmldom/lib/sax.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var NAMESPACE = (__webpack_require__(/*! ./conventions */ "./node_modules/@xmldom/xmldom/lib/conventions.js").NAMESPACE);

//[4]   	NameStartChar	   ::=   	":" | [A-Z] | "_" | [a-z] | [#xC0-#xD6] | [#xD8-#xF6] | [#xF8-#x2FF] | [#x370-#x37D] | [#x37F-#x1FFF] | [#x200C-#x200D] | [#x2070-#x218F] | [#x2C00-#x2FEF] | [#x3001-#xD7FF] | [#xF900-#xFDCF] | [#xFDF0-#xFFFD] | [#x10000-#xEFFFF]
//[4a]   	NameChar	   ::=   	NameStartChar | "-" | "." | [0-9] | #xB7 | [#x0300-#x036F] | [#x203F-#x2040]
//[5]   	Name	   ::=   	NameStartChar (NameChar)*
var nameStartChar = /[A-Z_a-z\xC0-\xD6\xD8-\xF6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]///\u10000-\uEFFFF
var nameChar = new RegExp("[\\-\\.0-9"+nameStartChar.source.slice(1,-1)+"\\u00B7\\u0300-\\u036F\\u203F-\\u2040]");
var tagNamePattern = new RegExp('^'+nameStartChar.source+nameChar.source+'*(?:\:'+nameStartChar.source+nameChar.source+'*)?$');
//var tagNamePattern = /^[a-zA-Z_][\w\-\.]*(?:\:[a-zA-Z_][\w\-\.]*)?$/
//var handlers = 'resolveEntity,getExternalSubset,characters,endDocument,endElement,endPrefixMapping,ignorableWhitespace,processingInstruction,setDocumentLocator,skippedEntity,startDocument,startElement,startPrefixMapping,notationDecl,unparsedEntityDecl,error,fatalError,warning,attributeDecl,elementDecl,externalEntityDecl,internalEntityDecl,comment,endCDATA,endDTD,endEntity,startCDATA,startDTD,startEntity'.split(',')

//S_TAG,	S_ATTR,	S_EQ,	S_ATTR_NOQUOT_VALUE
//S_ATTR_SPACE,	S_ATTR_END,	S_TAG_SPACE, S_TAG_CLOSE
var S_TAG = 0;//tag name offerring
var S_ATTR = 1;//attr name offerring
var S_ATTR_SPACE=2;//attr name end and space offer
var S_EQ = 3;//=space?
var S_ATTR_NOQUOT_VALUE = 4;//attr value(no quot value only)
var S_ATTR_END = 5;//attr value end and no space(quot end)
var S_TAG_SPACE = 6;//(attr value end || tag end ) && (space offer)
var S_TAG_CLOSE = 7;//closed el<el />

/**
 * Creates an error that will not be caught by XMLReader aka the SAX parser.
 *
 * @param {string} message
 * @param {any?} locator Optional, can provide details about the location in the source
 * @constructor
 */
function ParseError(message, locator) {
	this.message = message
	this.locator = locator
	if(Error.captureStackTrace) Error.captureStackTrace(this, ParseError);
}
ParseError.prototype = new Error();
ParseError.prototype.name = ParseError.name

function XMLReader(){

}

XMLReader.prototype = {
	parse:function(source,defaultNSMap,entityMap){
		var domBuilder = this.domBuilder;
		domBuilder.startDocument();
		_copy(defaultNSMap ,defaultNSMap = {})
		parse(source,defaultNSMap,entityMap,
				domBuilder,this.errorHandler);
		domBuilder.endDocument();
	}
}
function parse(source,defaultNSMapCopy,entityMap,domBuilder,errorHandler){
	function fixedFromCharCode(code) {
		// String.prototype.fromCharCode does not supports
		// > 2 bytes unicode chars directly
		if (code > 0xffff) {
			code -= 0x10000;
			var surrogate1 = 0xd800 + (code >> 10)
				, surrogate2 = 0xdc00 + (code & 0x3ff);

			return String.fromCharCode(surrogate1, surrogate2);
		} else {
			return String.fromCharCode(code);
		}
	}
	function entityReplacer(a){
		var k = a.slice(1,-1);
		if (Object.hasOwnProperty.call(entityMap, k)) {
			return entityMap[k];
		}else if(k.charAt(0) === '#'){
			return fixedFromCharCode(parseInt(k.substr(1).replace('x','0x')))
		}else{
			errorHandler.error('entity not found:'+a);
			return a;
		}
	}
	function appendText(end){//has some bugs
		if(end>start){
			var xt = source.substring(start,end).replace(/&#?\w+;/g,entityReplacer);
			locator&&position(start);
			domBuilder.characters(xt,0,end-start);
			start = end
		}
	}
	function position(p,m){
		while(p>=lineEnd && (m = linePattern.exec(source))){
			lineStart = m.index;
			lineEnd = lineStart + m[0].length;
			locator.lineNumber++;
			//console.log('line++:',locator,startPos,endPos)
		}
		locator.columnNumber = p-lineStart+1;
	}
	var lineStart = 0;
	var lineEnd = 0;
	var linePattern = /.*(?:\r\n?|\n)|.*$/g
	var locator = domBuilder.locator;

	var parseStack = [{currentNSMap:defaultNSMapCopy}]
	var closeMap = {};
	var start = 0;
	while(true){
		try{
			var tagStart = source.indexOf('<',start);
			if(tagStart<0){
				if(!source.substr(start).match(/^\s*$/)){
					var doc = domBuilder.doc;
	    			var text = doc.createTextNode(source.substr(start));
	    			doc.appendChild(text);
	    			domBuilder.currentElement = text;
				}
				return;
			}
			if(tagStart>start){
				appendText(tagStart);
			}
			switch(source.charAt(tagStart+1)){
			case '/':
				var end = source.indexOf('>',tagStart+3);
				var tagName = source.substring(tagStart + 2, end).replace(/[ \t\n\r]+$/g, '');
				var config = parseStack.pop();
				if(end<0){

	        		tagName = source.substring(tagStart+2).replace(/[\s<].*/,'');
	        		errorHandler.error("end tag name: "+tagName+' is not complete:'+config.tagName);
	        		end = tagStart+1+tagName.length;
	        	}else if(tagName.match(/\s</)){
	        		tagName = tagName.replace(/[\s<].*/,'');
	        		errorHandler.error("end tag name: "+tagName+' maybe not complete');
	        		end = tagStart+1+tagName.length;
				}
				var localNSMap = config.localNSMap;
				var endMatch = config.tagName == tagName;
				var endIgnoreCaseMach = endMatch || config.tagName&&config.tagName.toLowerCase() == tagName.toLowerCase()
		        if(endIgnoreCaseMach){
		        	domBuilder.endElement(config.uri,config.localName,tagName);
					if(localNSMap){
						for (var prefix in localNSMap) {
							if (Object.prototype.hasOwnProperty.call(localNSMap, prefix)) {
								domBuilder.endPrefixMapping(prefix);
							}
						}
					}
					if(!endMatch){
		            	errorHandler.fatalError("end tag name: "+tagName+' is not match the current start tagName:'+config.tagName ); // No known test case
					}
		        }else{
		        	parseStack.push(config)
		        }

				end++;
				break;
				// end elment
			case '?':// <?...?>
				locator&&position(tagStart);
				end = parseInstruction(source,tagStart,domBuilder);
				break;
			case '!':// <!doctype,<![CDATA,<!--
				locator&&position(tagStart);
				end = parseDCC(source,tagStart,domBuilder,errorHandler);
				break;
			default:
				locator&&position(tagStart);
				var el = new ElementAttributes();
				var currentNSMap = parseStack[parseStack.length-1].currentNSMap;
				//elStartEnd
				var end = parseElementStartPart(source,tagStart,el,currentNSMap,entityReplacer,errorHandler);
				var len = el.length;


				if(!el.closed && fixSelfClosed(source,end,el.tagName,closeMap)){
					el.closed = true;
					if(!entityMap.nbsp){
						errorHandler.warning('unclosed xml attribute');
					}
				}
				if(locator && len){
					var locator2 = copyLocator(locator,{});
					//try{//attribute position fixed
					for(var i = 0;i<len;i++){
						var a = el[i];
						position(a.offset);
						a.locator = copyLocator(locator,{});
					}
					domBuilder.locator = locator2
					if(appendElement(el,domBuilder,currentNSMap)){
						parseStack.push(el)
					}
					domBuilder.locator = locator;
				}else{
					if(appendElement(el,domBuilder,currentNSMap)){
						parseStack.push(el)
					}
				}

				if (NAMESPACE.isHTML(el.uri) && !el.closed) {
					end = parseHtmlSpecialContent(source,end,el.tagName,entityReplacer,domBuilder)
				} else {
					end++;
				}
			}
		}catch(e){
			if (e instanceof ParseError) {
				throw e;
			}
			errorHandler.error('element parse error: '+e)
			end = -1;
		}
		if(end>start){
			start = end;
		}else{
			//TODO: 这里有可能sax回退，有位置错误风险
			appendText(Math.max(tagStart,start)+1);
		}
	}
}
function copyLocator(f,t){
	t.lineNumber = f.lineNumber;
	t.columnNumber = f.columnNumber;
	return t;
}

/**
 * @see #appendElement(source,elStartEnd,el,selfClosed,entityReplacer,domBuilder,parseStack);
 * @return end of the elementStartPart(end of elementEndPart for selfClosed el)
 */
function parseElementStartPart(source,start,el,currentNSMap,entityReplacer,errorHandler){

	/**
	 * @param {string} qname
	 * @param {string} value
	 * @param {number} startIndex
	 */
	function addAttribute(qname, value, startIndex) {
		if (el.attributeNames.hasOwnProperty(qname)) {
			errorHandler.fatalError('Attribute ' + qname + ' redefined')
		}
		el.addValue(
			qname,
			// @see https://www.w3.org/TR/xml/#AVNormalize
			// since the xmldom sax parser does not "interpret" DTD the following is not implemented:
			// - recursive replacement of (DTD) entity references
			// - trimming and collapsing multiple spaces into a single one for attributes that are not of type CDATA
			value.replace(/[\t\n\r]/g, ' ').replace(/&#?\w+;/g, entityReplacer),
			startIndex
		)
	}
	var attrName;
	var value;
	var p = ++start;
	var s = S_TAG;//status
	while(true){
		var c = source.charAt(p);
		switch(c){
		case '=':
			if(s === S_ATTR){//attrName
				attrName = source.slice(start,p);
				s = S_EQ;
			}else if(s === S_ATTR_SPACE){
				s = S_EQ;
			}else{
				//fatalError: equal must after attrName or space after attrName
				throw new Error('attribute equal must after attrName'); // No known test case
			}
			break;
		case '\'':
		case '"':
			if(s === S_EQ || s === S_ATTR //|| s == S_ATTR_SPACE
				){//equal
				if(s === S_ATTR){
					errorHandler.warning('attribute value must after "="')
					attrName = source.slice(start,p)
				}
				start = p+1;
				p = source.indexOf(c,start)
				if(p>0){
					value = source.slice(start, p);
					addAttribute(attrName, value, start-1);
					s = S_ATTR_END;
				}else{
					//fatalError: no end quot match
					throw new Error('attribute value no end \''+c+'\' match');
				}
			}else if(s == S_ATTR_NOQUOT_VALUE){
				value = source.slice(start, p);
				addAttribute(attrName, value, start);
				errorHandler.warning('attribute "'+attrName+'" missed start quot('+c+')!!');
				start = p+1;
				s = S_ATTR_END
			}else{
				//fatalError: no equal before
				throw new Error('attribute value must after "="'); // No known test case
			}
			break;
		case '/':
			switch(s){
			case S_TAG:
				el.setTagName(source.slice(start,p));
			case S_ATTR_END:
			case S_TAG_SPACE:
			case S_TAG_CLOSE:
				s =S_TAG_CLOSE;
				el.closed = true;
			case S_ATTR_NOQUOT_VALUE:
			case S_ATTR:
			case S_ATTR_SPACE:
				break;
			//case S_EQ:
			default:
				throw new Error("attribute invalid close char('/')") // No known test case
			}
			break;
		case ''://end document
			errorHandler.error('unexpected end of input');
			if(s == S_TAG){
				el.setTagName(source.slice(start,p));
			}
			return p;
		case '>':
			switch(s){
			case S_TAG:
				el.setTagName(source.slice(start,p));
			case S_ATTR_END:
			case S_TAG_SPACE:
			case S_TAG_CLOSE:
				break;//normal
			case S_ATTR_NOQUOT_VALUE://Compatible state
			case S_ATTR:
				value = source.slice(start,p);
				if(value.slice(-1) === '/'){
					el.closed  = true;
					value = value.slice(0,-1)
				}
			case S_ATTR_SPACE:
				if(s === S_ATTR_SPACE){
					value = attrName;
				}
				if(s == S_ATTR_NOQUOT_VALUE){
					errorHandler.warning('attribute "'+value+'" missed quot(")!');
					addAttribute(attrName, value, start)
				}else{
					if(!NAMESPACE.isHTML(currentNSMap['']) || !value.match(/^(?:disabled|checked|selected)$/i)){
						errorHandler.warning('attribute "'+value+'" missed value!! "'+value+'" instead!!')
					}
					addAttribute(value, value, start)
				}
				break;
			case S_EQ:
				throw new Error('attribute value missed!!');
			}
//			console.log(tagName,tagNamePattern,tagNamePattern.test(tagName))
			return p;
		/*xml space '\x20' | #x9 | #xD | #xA; */
		case '\u0080':
			c = ' ';
		default:
			if(c<= ' '){//space
				switch(s){
				case S_TAG:
					el.setTagName(source.slice(start,p));//tagName
					s = S_TAG_SPACE;
					break;
				case S_ATTR:
					attrName = source.slice(start,p)
					s = S_ATTR_SPACE;
					break;
				case S_ATTR_NOQUOT_VALUE:
					var value = source.slice(start, p);
					errorHandler.warning('attribute "'+value+'" missed quot(")!!');
					addAttribute(attrName, value, start)
				case S_ATTR_END:
					s = S_TAG_SPACE;
					break;
				//case S_TAG_SPACE:
				//case S_EQ:
				//case S_ATTR_SPACE:
				//	void();break;
				//case S_TAG_CLOSE:
					//ignore warning
				}
			}else{//not space
//S_TAG,	S_ATTR,	S_EQ,	S_ATTR_NOQUOT_VALUE
//S_ATTR_SPACE,	S_ATTR_END,	S_TAG_SPACE, S_TAG_CLOSE
				switch(s){
				//case S_TAG:void();break;
				//case S_ATTR:void();break;
				//case S_ATTR_NOQUOT_VALUE:void();break;
				case S_ATTR_SPACE:
					var tagName =  el.tagName;
					if (!NAMESPACE.isHTML(currentNSMap['']) || !attrName.match(/^(?:disabled|checked|selected)$/i)) {
						errorHandler.warning('attribute "'+attrName+'" missed value!! "'+attrName+'" instead2!!')
					}
					addAttribute(attrName, attrName, start);
					start = p;
					s = S_ATTR;
					break;
				case S_ATTR_END:
					errorHandler.warning('attribute space is required"'+attrName+'"!!')
				case S_TAG_SPACE:
					s = S_ATTR;
					start = p;
					break;
				case S_EQ:
					s = S_ATTR_NOQUOT_VALUE;
					start = p;
					break;
				case S_TAG_CLOSE:
					throw new Error("elements closed character '/' and '>' must be connected to");
				}
			}
		}//end outer switch
		//console.log('p++',p)
		p++;
	}
}
/**
 * @return true if has new namespace define
 */
function appendElement(el,domBuilder,currentNSMap){
	var tagName = el.tagName;
	var localNSMap = null;
	//var currentNSMap = parseStack[parseStack.length-1].currentNSMap;
	var i = el.length;
	while(i--){
		var a = el[i];
		var qName = a.qName;
		var value = a.value;
		var nsp = qName.indexOf(':');
		if(nsp>0){
			var prefix = a.prefix = qName.slice(0,nsp);
			var localName = qName.slice(nsp+1);
			var nsPrefix = prefix === 'xmlns' && localName
		}else{
			localName = qName;
			prefix = null
			nsPrefix = qName === 'xmlns' && ''
		}
		//can not set prefix,because prefix !== ''
		a.localName = localName ;
		//prefix == null for no ns prefix attribute
		if(nsPrefix !== false){//hack!!
			if(localNSMap == null){
				localNSMap = {}
				//console.log(currentNSMap,0)
				_copy(currentNSMap,currentNSMap={})
				//console.log(currentNSMap,1)
			}
			currentNSMap[nsPrefix] = localNSMap[nsPrefix] = value;
			a.uri = NAMESPACE.XMLNS
			domBuilder.startPrefixMapping(nsPrefix, value)
		}
	}
	var i = el.length;
	while(i--){
		a = el[i];
		var prefix = a.prefix;
		if(prefix){//no prefix attribute has no namespace
			if(prefix === 'xml'){
				a.uri = NAMESPACE.XML;
			}if(prefix !== 'xmlns'){
				a.uri = currentNSMap[prefix || '']

				//{console.log('###'+a.qName,domBuilder.locator.systemId+'',currentNSMap,a.uri)}
			}
		}
	}
	var nsp = tagName.indexOf(':');
	if(nsp>0){
		prefix = el.prefix = tagName.slice(0,nsp);
		localName = el.localName = tagName.slice(nsp+1);
	}else{
		prefix = null;//important!!
		localName = el.localName = tagName;
	}
	//no prefix element has default namespace
	var ns = el.uri = currentNSMap[prefix || ''];
	domBuilder.startElement(ns,localName,tagName,el);
	//endPrefixMapping and startPrefixMapping have not any help for dom builder
	//localNSMap = null
	if(el.closed){
		domBuilder.endElement(ns,localName,tagName);
		if(localNSMap){
			for (prefix in localNSMap) {
				if (Object.prototype.hasOwnProperty.call(localNSMap, prefix)) {
					domBuilder.endPrefixMapping(prefix);
				}
			}
		}
	}else{
		el.currentNSMap = currentNSMap;
		el.localNSMap = localNSMap;
		//parseStack.push(el);
		return true;
	}
}
function parseHtmlSpecialContent(source,elStartEnd,tagName,entityReplacer,domBuilder){
	if(/^(?:script|textarea)$/i.test(tagName)){
		var elEndStart =  source.indexOf('</'+tagName+'>',elStartEnd);
		var text = source.substring(elStartEnd+1,elEndStart);
		if(/[&<]/.test(text)){
			if(/^script$/i.test(tagName)){
				//if(!/\]\]>/.test(text)){
					//lexHandler.startCDATA();
					domBuilder.characters(text,0,text.length);
					//lexHandler.endCDATA();
					return elEndStart;
				//}
			}//}else{//text area
				text = text.replace(/&#?\w+;/g,entityReplacer);
				domBuilder.characters(text,0,text.length);
				return elEndStart;
			//}

		}
	}
	return elStartEnd+1;
}
function fixSelfClosed(source,elStartEnd,tagName,closeMap){
	//if(tagName in closeMap){
	var pos = closeMap[tagName];
	if(pos == null){
		//console.log(tagName)
		pos =  source.lastIndexOf('</'+tagName+'>')
		if(pos<elStartEnd){//忘记闭合
			pos = source.lastIndexOf('</'+tagName)
		}
		closeMap[tagName] =pos
	}
	return pos<elStartEnd;
	//}
}

function _copy (source, target) {
	for (var n in source) {
		if (Object.prototype.hasOwnProperty.call(source, n)) {
			target[n] = source[n];
		}
	}
}

function parseDCC(source,start,domBuilder,errorHandler){//sure start with '<!'
	var next= source.charAt(start+2)
	switch(next){
	case '-':
		if(source.charAt(start + 3) === '-'){
			var end = source.indexOf('-->',start+4);
			//append comment source.substring(4,end)//<!--
			if(end>start){
				domBuilder.comment(source,start+4,end-start-4);
				return end+3;
			}else{
				errorHandler.error("Unclosed comment");
				return -1;
			}
		}else{
			//error
			return -1;
		}
	default:
		if(source.substr(start+3,6) == 'CDATA['){
			var end = source.indexOf(']]>',start+9);
			domBuilder.startCDATA();
			domBuilder.characters(source,start+9,end-start-9);
			domBuilder.endCDATA()
			return end+3;
		}
		//<!DOCTYPE
		//startDTD(java.lang.String name, java.lang.String publicId, java.lang.String systemId)
		var matchs = split(source,start);
		var len = matchs.length;
		if(len>1 && /!doctype/i.test(matchs[0][0])){
			var name = matchs[1][0];
			var pubid = false;
			var sysid = false;
			if(len>3){
				if(/^public$/i.test(matchs[2][0])){
					pubid = matchs[3][0];
					sysid = len>4 && matchs[4][0];
				}else if(/^system$/i.test(matchs[2][0])){
					sysid = matchs[3][0];
				}
			}
			var lastMatch = matchs[len-1]
			domBuilder.startDTD(name, pubid, sysid);
			domBuilder.endDTD();

			return lastMatch.index+lastMatch[0].length
		}
	}
	return -1;
}



function parseInstruction(source,start,domBuilder){
	var end = source.indexOf('?>',start);
	if(end){
		var match = source.substring(start,end).match(/^<\?(\S*)\s*([\s\S]*?)\s*$/);
		if(match){
			var len = match[0].length;
			domBuilder.processingInstruction(match[1], match[2]) ;
			return end+2;
		}else{//error
			return -1;
		}
	}
	return -1;
}

function ElementAttributes(){
	this.attributeNames = {}
}
ElementAttributes.prototype = {
	setTagName:function(tagName){
		if(!tagNamePattern.test(tagName)){
			throw new Error('invalid tagName:'+tagName)
		}
		this.tagName = tagName
	},
	addValue:function(qName, value, offset) {
		if(!tagNamePattern.test(qName)){
			throw new Error('invalid attribute:'+qName)
		}
		this.attributeNames[qName] = this.length;
		this[this.length++] = {qName:qName,value:value,offset:offset}
	},
	length:0,
	getLocalName:function(i){return this[i].localName},
	getLocator:function(i){return this[i].locator},
	getQName:function(i){return this[i].qName},
	getURI:function(i){return this[i].uri},
	getValue:function(i){return this[i].value}
//	,getIndex:function(uri, localName)){
//		if(localName){
//
//		}else{
//			var qName = uri
//		}
//	},
//	getValue:function(){return this.getValue(this.getIndex.apply(this,arguments))},
//	getType:function(uri,localName){}
//	getType:function(i){},
}



function split(source,start){
	var match;
	var buf = [];
	var reg = /'[^']+'|"[^"]+"|[^\s<>\/=]+=?|(\/?\s*>|<)/g;
	reg.lastIndex = start;
	reg.exec(source);//skip <
	while(match = reg.exec(source)){
		buf.push(match);
		if(match[1])return buf;
	}
}

exports.XMLReader = XMLReader;
exports.ParseError = ParseError;


/***/ }),

/***/ "./node_modules/base64-js/index.js":
/*!*****************************************!*\
  !*** ./node_modules/base64-js/index.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}


/***/ }),

/***/ "./node_modules/buffer/index.js":
/*!**************************************!*\
  !*** ./node_modules/buffer/index.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



const base64 = __webpack_require__(/*! base64-js */ "./node_modules/base64-js/index.js")
const ieee754 = __webpack_require__(/*! ieee754 */ "./node_modules/ieee754/index.js")
const customInspectSymbol =
  (typeof Symbol === 'function' && typeof Symbol['for'] === 'function') // eslint-disable-line dot-notation
    ? Symbol['for']('nodejs.util.inspect.custom') // eslint-disable-line dot-notation
    : null

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

const K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    const arr = new Uint8Array(1)
    const proto = { foo: function () { return 42 } }
    Object.setPrototypeOf(proto, Uint8Array.prototype)
    Object.setPrototypeOf(arr, proto)
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

Object.defineProperty(Buffer.prototype, 'parent', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.buffer
  }
})

Object.defineProperty(Buffer.prototype, 'offset', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.byteOffset
  }
})

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('The value "' + length + '" is invalid for option "size"')
  }
  // Return an augmented `Uint8Array` instance
  const buf = new Uint8Array(length)
  Object.setPrototypeOf(buf, Buffer.prototype)
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new TypeError(
        'The "string" argument must be of type string. Received type number'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  if (ArrayBuffer.isView(value)) {
    return fromArrayView(value)
  }

  if (value == null) {
    throw new TypeError(
      'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
      'or Array-like Object. Received type ' + (typeof value)
    )
  }

  if (isInstance(value, ArrayBuffer) ||
      (value && isInstance(value.buffer, ArrayBuffer))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof SharedArrayBuffer !== 'undefined' &&
      (isInstance(value, SharedArrayBuffer) ||
      (value && isInstance(value.buffer, SharedArrayBuffer)))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'number') {
    throw new TypeError(
      'The "value" argument must not be of type number. Received type number'
    )
  }

  const valueOf = value.valueOf && value.valueOf()
  if (valueOf != null && valueOf !== value) {
    return Buffer.from(valueOf, encodingOrOffset, length)
  }

  const b = fromObject(value)
  if (b) return b

  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
      typeof value[Symbol.toPrimitive] === 'function') {
    return Buffer.from(value[Symbol.toPrimitive]('string'), encodingOrOffset, length)
  }

  throw new TypeError(
    'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
    'or Array-like Object. Received type ' + (typeof value)
  )
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Object.setPrototypeOf(Buffer.prototype, Uint8Array.prototype)
Object.setPrototypeOf(Buffer, Uint8Array)

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number')
  } else if (size < 0) {
    throw new RangeError('The value "' + size + '" is invalid for option "size"')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpreted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding)
  }

  const length = byteLength(string, encoding) | 0
  let buf = createBuffer(length)

  const actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  const length = array.length < 0 ? 0 : checked(array.length) | 0
  const buf = createBuffer(length)
  for (let i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayView (arrayView) {
  if (isInstance(arrayView, Uint8Array)) {
    const copy = new Uint8Array(arrayView)
    return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength)
  }
  return fromArrayLike(arrayView)
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds')
  }

  let buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  Object.setPrototypeOf(buf, Buffer.prototype)

  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    const len = checked(obj.length) | 0
    const buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj.length !== undefined) {
    if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
      return createBuffer(0)
    }
    return fromArrayLike(obj)
  }

  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
    return fromArrayLike(obj.data)
  }
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true &&
    b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
}

Buffer.compare = function compare (a, b) {
  if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength)
  if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength)
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError(
      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
    )
  }

  if (a === b) return 0

  let x = a.length
  let y = b.length

  for (let i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  let i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  const buffer = Buffer.allocUnsafe(length)
  let pos = 0
  for (i = 0; i < list.length; ++i) {
    let buf = list[i]
    if (isInstance(buf, Uint8Array)) {
      if (pos + buf.length > buffer.length) {
        if (!Buffer.isBuffer(buf)) buf = Buffer.from(buf)
        buf.copy(buffer, pos)
      } else {
        Uint8Array.prototype.set.call(
          buffer,
          buf,
          pos
        )
      }
    } else if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    } else {
      buf.copy(buffer, pos)
    }
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    throw new TypeError(
      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
      'Received type ' + typeof string
    )
  }

  const len = string.length
  const mustMatch = (arguments.length > 2 && arguments[2] === true)
  if (!mustMatch && len === 0) return 0

  // Use a for loop to avoid recursion
  let loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) {
          return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
        }
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  let loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coercion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  const i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  const len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (let i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  const len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (let i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  const len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (let i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  const length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.toLocaleString = Buffer.prototype.toString

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  let str = ''
  const max = exports.INSPECT_MAX_BYTES
  str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim()
  if (this.length > max) str += ' ... '
  return '<Buffer ' + str + '>'
}
if (customInspectSymbol) {
  Buffer.prototype[customInspectSymbol] = Buffer.prototype.inspect
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (isInstance(target, Uint8Array)) {
    target = Buffer.from(target, target.offset, target.byteLength)
  }
  if (!Buffer.isBuffer(target)) {
    throw new TypeError(
      'The "target" argument must be one of type Buffer or Uint8Array. ' +
      'Received type ' + (typeof target)
    )
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  let x = thisEnd - thisStart
  let y = end - start
  const len = Math.min(x, y)

  const thisCopy = this.slice(thisStart, thisEnd)
  const targetCopy = target.slice(start, end)

  for (let i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [val], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  let indexSize = 1
  let arrLength = arr.length
  let valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  let i
  if (dir) {
    let foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      let found = true
      for (let j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  const remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  const strLen = string.length

  if (length > strLen / 2) {
    length = strLen / 2
  }
  let i
  for (i = 0; i < length; ++i) {
    const parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  const remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  let loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
      case 'latin1':
      case 'binary':
        return asciiWrite(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  const res = []

  let i = start
  while (i < end) {
    const firstByte = buf[i]
    let codePoint = null
    let bytesPerSequence = (firstByte > 0xEF)
      ? 4
      : (firstByte > 0xDF)
          ? 3
          : (firstByte > 0xBF)
              ? 2
              : 1

    if (i + bytesPerSequence <= end) {
      let secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
const MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  const len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  let res = ''
  let i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  let ret = ''
  end = Math.min(buf.length, end)

  for (let i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  let ret = ''
  end = Math.min(buf.length, end)

  for (let i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  const len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  let out = ''
  for (let i = start; i < end; ++i) {
    out += hexSliceLookupTable[buf[i]]
  }
  return out
}

function utf16leSlice (buf, start, end) {
  const bytes = buf.slice(start, end)
  let res = ''
  // If bytes.length is odd, the last 8 bits must be ignored (same as node.js)
  for (let i = 0; i < bytes.length - 1; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  const len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  const newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  Object.setPrototypeOf(newBuf, Buffer.prototype)

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUintLE =
Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  let val = this[offset]
  let mul = 1
  let i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUintBE =
Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  let val = this[offset + --byteLength]
  let mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUint8 =
Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUint16LE =
Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUint16BE =
Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUint32LE =
Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUint32BE =
Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readBigUInt64LE = defineBigIntMethod(function readBigUInt64LE (offset) {
  offset = offset >>> 0
  validateNumber(offset, 'offset')
  const first = this[offset]
  const last = this[offset + 7]
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8)
  }

  const lo = first +
    this[++offset] * 2 ** 8 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 24

  const hi = this[++offset] +
    this[++offset] * 2 ** 8 +
    this[++offset] * 2 ** 16 +
    last * 2 ** 24

  return BigInt(lo) + (BigInt(hi) << BigInt(32))
})

Buffer.prototype.readBigUInt64BE = defineBigIntMethod(function readBigUInt64BE (offset) {
  offset = offset >>> 0
  validateNumber(offset, 'offset')
  const first = this[offset]
  const last = this[offset + 7]
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8)
  }

  const hi = first * 2 ** 24 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 8 +
    this[++offset]

  const lo = this[++offset] * 2 ** 24 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 8 +
    last

  return (BigInt(hi) << BigInt(32)) + BigInt(lo)
})

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  let val = this[offset]
  let mul = 1
  let i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  let i = byteLength
  let mul = 1
  let val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  const val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  const val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readBigInt64LE = defineBigIntMethod(function readBigInt64LE (offset) {
  offset = offset >>> 0
  validateNumber(offset, 'offset')
  const first = this[offset]
  const last = this[offset + 7]
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8)
  }

  const val = this[offset + 4] +
    this[offset + 5] * 2 ** 8 +
    this[offset + 6] * 2 ** 16 +
    (last << 24) // Overflow

  return (BigInt(val) << BigInt(32)) +
    BigInt(first +
    this[++offset] * 2 ** 8 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 24)
})

Buffer.prototype.readBigInt64BE = defineBigIntMethod(function readBigInt64BE (offset) {
  offset = offset >>> 0
  validateNumber(offset, 'offset')
  const first = this[offset]
  const last = this[offset + 7]
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8)
  }

  const val = (first << 24) + // Overflow
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 8 +
    this[++offset]

  return (BigInt(val) << BigInt(32)) +
    BigInt(this[++offset] * 2 ** 24 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 8 +
    last)
})

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUintLE =
Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    const maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  let mul = 1
  let i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUintBE =
Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    const maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  let i = byteLength - 1
  let mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUint8 =
Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUint16LE =
Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUint16BE =
Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUint32LE =
Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUint32BE =
Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function wrtBigUInt64LE (buf, value, offset, min, max) {
  checkIntBI(value, min, max, buf, offset, 7)

  let lo = Number(value & BigInt(0xffffffff))
  buf[offset++] = lo
  lo = lo >> 8
  buf[offset++] = lo
  lo = lo >> 8
  buf[offset++] = lo
  lo = lo >> 8
  buf[offset++] = lo
  let hi = Number(value >> BigInt(32) & BigInt(0xffffffff))
  buf[offset++] = hi
  hi = hi >> 8
  buf[offset++] = hi
  hi = hi >> 8
  buf[offset++] = hi
  hi = hi >> 8
  buf[offset++] = hi
  return offset
}

function wrtBigUInt64BE (buf, value, offset, min, max) {
  checkIntBI(value, min, max, buf, offset, 7)

  let lo = Number(value & BigInt(0xffffffff))
  buf[offset + 7] = lo
  lo = lo >> 8
  buf[offset + 6] = lo
  lo = lo >> 8
  buf[offset + 5] = lo
  lo = lo >> 8
  buf[offset + 4] = lo
  let hi = Number(value >> BigInt(32) & BigInt(0xffffffff))
  buf[offset + 3] = hi
  hi = hi >> 8
  buf[offset + 2] = hi
  hi = hi >> 8
  buf[offset + 1] = hi
  hi = hi >> 8
  buf[offset] = hi
  return offset + 8
}

Buffer.prototype.writeBigUInt64LE = defineBigIntMethod(function writeBigUInt64LE (value, offset = 0) {
  return wrtBigUInt64LE(this, value, offset, BigInt(0), BigInt('0xffffffffffffffff'))
})

Buffer.prototype.writeBigUInt64BE = defineBigIntMethod(function writeBigUInt64BE (value, offset = 0) {
  return wrtBigUInt64BE(this, value, offset, BigInt(0), BigInt('0xffffffffffffffff'))
})

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    const limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  let i = 0
  let mul = 1
  let sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    const limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  let i = byteLength - 1
  let mul = 1
  let sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeBigInt64LE = defineBigIntMethod(function writeBigInt64LE (value, offset = 0) {
  return wrtBigUInt64LE(this, value, offset, -BigInt('0x8000000000000000'), BigInt('0x7fffffffffffffff'))
})

Buffer.prototype.writeBigInt64BE = defineBigIntMethod(function writeBigInt64BE (value, offset = 0) {
  return wrtBigUInt64BE(this, value, offset, -BigInt('0x8000000000000000'), BigInt('0x7fffffffffffffff'))
})

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  const len = end - start

  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end)
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, end),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
    if (val.length === 1) {
      const code = val.charCodeAt(0)
      if ((encoding === 'utf8' && code < 128) ||
          encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255
  } else if (typeof val === 'boolean') {
    val = Number(val)
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  let i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    const bytes = Buffer.isBuffer(val)
      ? val
      : Buffer.from(val, encoding)
    const len = bytes.length
    if (len === 0) {
      throw new TypeError('The value "' + val +
        '" is invalid for argument "value"')
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// CUSTOM ERRORS
// =============

// Simplified versions from Node, changed for Buffer-only usage
const errors = {}
function E (sym, getMessage, Base) {
  errors[sym] = class NodeError extends Base {
    constructor () {
      super()

      Object.defineProperty(this, 'message', {
        value: getMessage.apply(this, arguments),
        writable: true,
        configurable: true
      })

      // Add the error code to the name to include it in the stack trace.
      this.name = `${this.name} [${sym}]`
      // Access the stack to generate the error message including the error code
      // from the name.
      this.stack // eslint-disable-line no-unused-expressions
      // Reset the name to the actual name.
      delete this.name
    }

    get code () {
      return sym
    }

    set code (value) {
      Object.defineProperty(this, 'code', {
        configurable: true,
        enumerable: true,
        value,
        writable: true
      })
    }

    toString () {
      return `${this.name} [${sym}]: ${this.message}`
    }
  }
}

E('ERR_BUFFER_OUT_OF_BOUNDS',
  function (name) {
    if (name) {
      return `${name} is outside of buffer bounds`
    }

    return 'Attempt to access memory outside buffer bounds'
  }, RangeError)
E('ERR_INVALID_ARG_TYPE',
  function (name, actual) {
    return `The "${name}" argument must be of type number. Received type ${typeof actual}`
  }, TypeError)
E('ERR_OUT_OF_RANGE',
  function (str, range, input) {
    let msg = `The value of "${str}" is out of range.`
    let received = input
    if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) {
      received = addNumericalSeparator(String(input))
    } else if (typeof input === 'bigint') {
      received = String(input)
      if (input > BigInt(2) ** BigInt(32) || input < -(BigInt(2) ** BigInt(32))) {
        received = addNumericalSeparator(received)
      }
      received += 'n'
    }
    msg += ` It must be ${range}. Received ${received}`
    return msg
  }, RangeError)

function addNumericalSeparator (val) {
  let res = ''
  let i = val.length
  const start = val[0] === '-' ? 1 : 0
  for (; i >= start + 4; i -= 3) {
    res = `_${val.slice(i - 3, i)}${res}`
  }
  return `${val.slice(0, i)}${res}`
}

// CHECK FUNCTIONS
// ===============

function checkBounds (buf, offset, byteLength) {
  validateNumber(offset, 'offset')
  if (buf[offset] === undefined || buf[offset + byteLength] === undefined) {
    boundsError(offset, buf.length - (byteLength + 1))
  }
}

function checkIntBI (value, min, max, buf, offset, byteLength) {
  if (value > max || value < min) {
    const n = typeof min === 'bigint' ? 'n' : ''
    let range
    if (byteLength > 3) {
      if (min === 0 || min === BigInt(0)) {
        range = `>= 0${n} and < 2${n} ** ${(byteLength + 1) * 8}${n}`
      } else {
        range = `>= -(2${n} ** ${(byteLength + 1) * 8 - 1}${n}) and < 2 ** ` +
                `${(byteLength + 1) * 8 - 1}${n}`
      }
    } else {
      range = `>= ${min}${n} and <= ${max}${n}`
    }
    throw new errors.ERR_OUT_OF_RANGE('value', range, value)
  }
  checkBounds(buf, offset, byteLength)
}

function validateNumber (value, name) {
  if (typeof value !== 'number') {
    throw new errors.ERR_INVALID_ARG_TYPE(name, 'number', value)
  }
}

function boundsError (value, length, type) {
  if (Math.floor(value) !== value) {
    validateNumber(value, type)
    throw new errors.ERR_OUT_OF_RANGE(type || 'offset', 'an integer', value)
  }

  if (length < 0) {
    throw new errors.ERR_BUFFER_OUT_OF_BOUNDS()
  }

  throw new errors.ERR_OUT_OF_RANGE(type || 'offset',
                                    `>= ${type ? 1 : 0} and <= ${length}`,
                                    value)
}

// HELPER FUNCTIONS
// ================

const INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0]
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  let codePoint
  const length = string.length
  let leadSurrogate = null
  const bytes = []

  for (let i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  const byteArray = []
  for (let i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  let c, hi, lo
  const byteArray = []
  for (let i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  let i
  for (i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance (obj, type) {
  return obj instanceof type ||
    (obj != null && obj.constructor != null && obj.constructor.name != null &&
      obj.constructor.name === type.name)
}
function numberIsNaN (obj) {
  // For IE11 support
  return obj !== obj // eslint-disable-line no-self-compare
}

// Create lookup table for `toString('hex')`
// See: https://github.com/feross/buffer/issues/219
const hexSliceLookupTable = (function () {
  const alphabet = '0123456789abcdef'
  const table = new Array(256)
  for (let i = 0; i < 16; ++i) {
    const i16 = i * 16
    for (let j = 0; j < 16; ++j) {
      table[i16 + j] = alphabet[i] + alphabet[j]
    }
  }
  return table
})()

// Return not function with Error if BigInt not supported
function defineBigIntMethod (fn) {
  return typeof BigInt === 'undefined' ? BufferBigIntNotDefined : fn
}

function BufferBigIntNotDefined () {
  throw new Error('BigInt not supported')
}


/***/ }),

/***/ "./node_modules/camunda-modeler-plugin-helpers/components.js":
/*!*******************************************************************!*\
  !*** ./node_modules/camunda-modeler-plugin-helpers/components.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Fill": () => (/* binding */ Fill),
/* harmony export */   "Modal": () => (/* binding */ Modal),
/* harmony export */   "NotCompatible": () => (/* binding */ NotCompatible),
/* harmony export */   "Overlay": () => (/* binding */ Overlay),
/* harmony export */   "Section": () => (/* binding */ Section),
/* harmony export */   "ToggleSwitch": () => (/* binding */ ToggleSwitch)
/* harmony export */ });
if (!window.components) {
  throw notCompatible('3.4');
}

function notCompatible(requiredVersion) {
  return new Error('Not compatible with Camunda Modeler < v' + requiredVersion);
}

const NotCompatible = function(requiredVersion) {
  return function NotCompatibleComponent() {
    throw notCompatible(requiredVersion);
  };
};

/**
 * Fill component. Set `slot` to "toolbar" to include in the top toolbar.
 * Use `group` and `priority=0` to place for correct ordering. The higher
 * the priority, the earlier the Fill is displayed within the group.
 *
 * @type {import('react').ComponentType<{ slot: string, group?: string, priority?: Number }>}
 *
 * @example
 *
 * import { Fill } from 'camunda-modeler-plugin-helpers/components';
 *
 * function CustomFill(props) {
 *   return (
 *     <Fill group="4_export" slot="toolbar" priority={100}>
 *       <button type="button" onClick={ props.openExportTool }>
 *         Open Export Tool
 *       </button>
 *     </Fill>
 *   );
 * }
 */
const Fill = window.components.Fill;

/**
 * Modal component.
 *
 * @type {import('react').ComponentType<{ onClose: Function }>}
 *
 * @example
 *
 * import { Modal } from 'camunda-modeler-plugin-helpers/components';
 *
 * function CustomModal(props) {
 *   return (
 *    <Modal onClose={ props.onClose }>
 *      <Modal.Title>
 *        Custom Modal
 *      </Modal.Title>
 *      <Modal.Body>
 *        Hello world!
 *      </Modal.Body>
 *      <Modal.Footer>
 *        <button type="button" onClick={ props.onClose }>
 *          Close
 *        </button>
 *      </Modal.Footer>
 *    </Modal>
 *   );
 * }
 */
const Modal = window.components.Modal;

/**
 * Overlay component.
 *
 * @type {import('react').ComponentType<{ 
 *  onClose: Function, 
 *  anchor: Node, 
 *  offset?: { top?: number, bottom?: number, left?: number, right?: number }, 
 *  maxWidth?: number | string,
 *  maxHeight?: number | string,
 *  minWidth?: number | string,
 *  minHeight?: number | string
 * }>}
 *
 * @example
 * 
 * import { Overlay } from 'camunda-modeler-plugin-helpers/components';
 *
 * function CustomOverlay(props) {
 *   return (
 *    <Overlay onClose={ props.onClose } anchor={ props.btn_ref } offset={ props.anchor }>
 *      <Overlay.Title>
 *        Custom Modal
 *      </Overlay.Title>
 *      <Overlay.Body>
 *        Hello world!
 *      </Overlay.Body>
 *      <Overlay.Footer>
 *        <button type="button" onClick={ props.onClose }>
 *          Close
 *        </button>
 *      </Overlay.Footer>
 *    </Overlay>
 *   );
 * }
 */
 const Overlay = window.components.Overlay || NotCompatible('5.0');

 /**
 * Section component.
 *
 * @type {import('react').ComponentType<{ maxHeight: Number | String, relativePos: Boolean } }>}
 *
 * @example
 * 
 * import { Section } from 'camunda-modeler-plugin-helpers/components';
 *
 * function CustomSection(props) {
 *   return (
 *    <Section maxHeight="240px">
 *     <Section.Header>
 *       Custom section
 *     </Section.Header>
 *     <Section.Body>
 *       Hello world!
 *     </Section.Body>
 *     <Section.Actions>
 *      <button type="button" onClick={ props.onClose }>
 *        Close
 *      </button>
 *     </Section.Actions>
 *    </Section>
 *   );
 * }
 */
const Section = window.components.Section || NotCompatible('5.0');

 /**
 * ToggleSwitch component.
 *
 * @type {import('react').ComponentType<{ id: string, name: string, label?: string, switcherLabel?: string, description?: string }>}
 *
 * @example
 * 
 * import { ToggleSwitch } from 'camunda-modeler-plugin-helpers/components';
 *
 * function CustomToggle(props) {
 *   return (
 *    <Formik initialValues={ initialValues } onSubmit={ this.onSubmit }>
 *      {() => (
 *        <Form>
 *          <Field
 *            component={ ToggleSwitch }
 *            switcherLabel="Switcher label"
 *            id={ id }
 *            name={ name }
 *            description="Toggle description"
 *          />
 *        </Form>
 *       )}
 *    </Formik>
 *   );
 * }
 */
const ToggleSwitch = window.components.ToggleSwitch || NotCompatible('5.0');

/***/ }),

/***/ "./node_modules/camunda-modeler-plugin-helpers/index.js":
/*!**************************************************************!*\
  !*** ./node_modules/camunda-modeler-plugin-helpers/index.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getModelerDirectory": () => (/* binding */ getModelerDirectory),
/* harmony export */   "getPluginsDirectory": () => (/* binding */ getPluginsDirectory),
/* harmony export */   "registerBpmnJSModdleExtension": () => (/* binding */ registerBpmnJSModdleExtension),
/* harmony export */   "registerBpmnJSPlugin": () => (/* binding */ registerBpmnJSPlugin),
/* harmony export */   "registerClientExtension": () => (/* binding */ registerClientExtension),
/* harmony export */   "registerClientPlugin": () => (/* binding */ registerClientPlugin),
/* harmony export */   "registerCloudBpmnJSModdleExtension": () => (/* binding */ registerCloudBpmnJSModdleExtension),
/* harmony export */   "registerCloudBpmnJSPlugin": () => (/* binding */ registerCloudBpmnJSPlugin),
/* harmony export */   "registerCloudDmnJSModdleExtension": () => (/* binding */ registerCloudDmnJSModdleExtension),
/* harmony export */   "registerCloudDmnJSPlugin": () => (/* binding */ registerCloudDmnJSPlugin),
/* harmony export */   "registerDmnJSModdleExtension": () => (/* binding */ registerDmnJSModdleExtension),
/* harmony export */   "registerDmnJSPlugin": () => (/* binding */ registerDmnJSPlugin),
/* harmony export */   "registerPlatformBpmnJSModdleExtension": () => (/* binding */ registerPlatformBpmnJSModdleExtension),
/* harmony export */   "registerPlatformBpmnJSPlugin": () => (/* binding */ registerPlatformBpmnJSPlugin),
/* harmony export */   "registerPlatformDmnJSModdleExtension": () => (/* binding */ registerPlatformDmnJSModdleExtension),
/* harmony export */   "registerPlatformDmnJSPlugin": () => (/* binding */ registerPlatformDmnJSPlugin)
/* harmony export */ });
/**
 * Validate and register a client plugin.
 *
 * @param {Object} plugin
 * @param {String} type
 */
function registerClientPlugin(plugin, type) {
  var plugins = window.plugins || [];
  window.plugins = plugins;

  if (!plugin) {
    throw new Error('plugin not specified');
  }

  if (!type) {
    throw new Error('type not specified');
  }

  plugins.push({
    plugin: plugin,
    type: type
  });
}

/**
 * Validate and register a client plugin.
 *
 * @param {import('react').ComponentType} extension
 *
 * @example
 *
 * import MyExtensionComponent from './MyExtensionComponent';
 *
 * registerClientExtension(MyExtensionComponent);
 */
function registerClientExtension(component) {
  registerClientPlugin(component, 'client');
}

/**
 * Validate and register a bpmn-js plugin.
 *
 * @param {Object} module
 *
 * @example
 *
 * import {
 *   registerBpmnJSPlugin
 * } from 'camunda-modeler-plugin-helpers';
 *
 * const BpmnJSModule = {
 *   __init__: [ 'myService' ],
 *   myService: [ 'type', ... ]
 * };
 *
 * registerBpmnJSPlugin(BpmnJSModule);
 */
function registerBpmnJSPlugin(module) {
  registerClientPlugin(module, 'bpmn.modeler.additionalModules');
}

/**
 * Validate and register a platform specific bpmn-js plugin.
 *
 * @param {Object} module
 *
 * @example
 *
 * import {
 *   registerPlatformBpmnJSPlugin
 * } from 'camunda-modeler-plugin-helpers';
 *
 * const BpmnJSModule = {
 *   __init__: [ 'myService' ],
 *   myService: [ 'type', ... ]
 * };
 *
 * registerPlatformBpmnJSPlugin(BpmnJSModule);
 */
function registerPlatformBpmnJSPlugin(module) {
  registerClientPlugin(module, 'bpmn.platform.modeler.additionalModules');
}

/**
 * Validate and register a cloud specific bpmn-js plugin.
 *
 * @param {Object} module
 *
 * @example
 *
 * import {
 *   registerCloudBpmnJSPlugin
 * } from 'camunda-modeler-plugin-helpers';
 *
 * const BpmnJSModule = {
 *   __init__: [ 'myService' ],
 *   myService: [ 'type', ... ]
 * };
 *
 * registerCloudBpmnJSPlugin(BpmnJSModule);
 */
function registerCloudBpmnJSPlugin(module) {
  registerClientPlugin(module, 'bpmn.cloud.modeler.additionalModules');
}

/**
 * Validate and register a bpmn-moddle extension plugin.
 *
 * @param {Object} descriptor
 *
 * @example
 * import {
 *   registerBpmnJSModdleExtension
 * } from 'camunda-modeler-plugin-helpers';
 *
 * var moddleDescriptor = {
 *   name: 'my descriptor',
 *   uri: 'http://example.my.company.localhost/schema/my-descriptor/1.0',
 *   prefix: 'mydesc',
 *
 *   ...
 * };
 *
 * registerBpmnJSModdleExtension(moddleDescriptor);
 */
function registerBpmnJSModdleExtension(descriptor) {
  registerClientPlugin(descriptor, 'bpmn.modeler.moddleExtension');
}

/**
 * Validate and register a platform specific bpmn-moddle extension plugin.
 *
 * @param {Object} descriptor
 *
 * @example
 * import {
 *   registerPlatformBpmnJSModdleExtension
 * } from 'camunda-modeler-plugin-helpers';
 *
 * var moddleDescriptor = {
 *   name: 'my descriptor',
 *   uri: 'http://example.my.company.localhost/schema/my-descriptor/1.0',
 *   prefix: 'mydesc',
 *
 *   ...
 * };
 *
 * registerPlatformBpmnJSModdleExtension(moddleDescriptor);
 */
function registerPlatformBpmnJSModdleExtension(descriptor) {
  registerClientPlugin(descriptor, 'bpmn.platform.modeler.moddleExtension');
}

/**
 * Validate and register a cloud specific bpmn-moddle extension plugin.
 *
 * @param {Object} descriptor
 *
 * @example
 * import {
 *   registerCloudBpmnJSModdleExtension
 * } from 'camunda-modeler-plugin-helpers';
 *
 * var moddleDescriptor = {
 *   name: 'my descriptor',
 *   uri: 'http://example.my.company.localhost/schema/my-descriptor/1.0',
 *   prefix: 'mydesc',
 *
 *   ...
 * };
 *
 * registerCloudBpmnJSModdleExtension(moddleDescriptor);
 */
function registerCloudBpmnJSModdleExtension(descriptor) {
  registerClientPlugin(descriptor, 'bpmn.cloud.modeler.moddleExtension');
}

/**
 * Validate and register a dmn-moddle extension plugin.
 *
 * @param {Object} descriptor
 *
 * @example
 * import {
 *   registerDmnJSModdleExtension
 * } from 'camunda-modeler-plugin-helpers';
 *
 * var moddleDescriptor = {
 *   name: 'my descriptor',
 *   uri: 'http://example.my.company.localhost/schema/my-descriptor/1.0',
 *   prefix: 'mydesc',
 *
 *   ...
 * };
 *
 * registerDmnJSModdleExtension(moddleDescriptor);
 */
function registerDmnJSModdleExtension(descriptor) {
  registerClientPlugin(descriptor, 'dmn.modeler.moddleExtension');
}

/**
 * Validate and register a cloud specific dmn-moddle extension plugin.
 *
 * @param {Object} descriptor
 *
 * @example
 * import {
 *   registerCloudDmnJSModdleExtension
 * } from 'camunda-modeler-plugin-helpers';
 *
 * var moddleDescriptor = {
 *   name: 'my descriptor',
 *   uri: 'http://example.my.company.localhost/schema/my-descriptor/1.0',
 *   prefix: 'mydesc',
 *
 *   ...
 * };
 *
 * registerCloudDmnJSModdleExtension(moddleDescriptor);
 */
function registerCloudDmnJSModdleExtension(descriptor) {
  registerClientPlugin(descriptor, 'dmn.cloud.modeler.moddleExtension');
}

/**
 * Validate and register a platform specific dmn-moddle extension plugin.
 *
 * @param {Object} descriptor
 *
 * @example
 * import {
 *   registerPlatformDmnJSModdleExtension
 * } from 'camunda-modeler-plugin-helpers';
 *
 * var moddleDescriptor = {
 *   name: 'my descriptor',
 *   uri: 'http://example.my.company.localhost/schema/my-descriptor/1.0',
 *   prefix: 'mydesc',
 *
 *   ...
 * };
 *
 * registerPlatformDmnJSModdleExtension(moddleDescriptor);
 */
function registerPlatformDmnJSModdleExtension(descriptor) {
  registerClientPlugin(descriptor, 'dmn.platform.modeler.moddleExtension');
}

/**
 * Validate and register a dmn-js plugin.
 *
 * @param {Object} module
 *
 * @example
 *
 * import {
 *   registerDmnJSPlugin
 * } from 'camunda-modeler-plugin-helpers';
 *
 * const DmnJSModule = {
 *   __init__: [ 'myService' ],
 *   myService: [ 'type', ... ]
 * };
 *
 * registerDmnJSPlugin(DmnJSModule, [ 'drd', 'literalExpression' ]);
 * registerDmnJSPlugin(DmnJSModule, 'drd')
 */
function registerDmnJSPlugin(module, components) {

  if (!Array.isArray(components)) {
    components = [ components ]
  }

  components.forEach(c => registerClientPlugin(module, `dmn.modeler.${c}.additionalModules`));
}

/**
 * Validate and register a cloud specific dmn-js plugin.
 *
 * @param {Object} module
 *
 * @example
 *
 * import {
 *   registerCloudDmnJSPlugin
 * } from 'camunda-modeler-plugin-helpers';
 *
 * const DmnJSModule = {
 *   __init__: [ 'myService' ],
 *   myService: [ 'type', ... ]
 * };
 *
 * registerCloudDmnJSPlugin(DmnJSModule, [ 'drd', 'literalExpression' ]);
 * registerCloudDmnJSPlugin(DmnJSModule, 'drd')
 */
function registerCloudDmnJSPlugin(module, components) {

  if (!Array.isArray(components)) {
    components = [ components ]
  }

  components.forEach(c => registerClientPlugin(module, `dmn.cloud.modeler.${c}.additionalModules`));
}

/**
 * Validate and register a platform specific dmn-js plugin.
 *
 * @param {Object} module
 *
 * @example
 *
 * import {
 *   registerPlatformDmnJSPlugin
 * } from 'camunda-modeler-plugin-helpers';
 *
 * const DmnJSModule = {
 *   __init__: [ 'myService' ],
 *   myService: [ 'type', ... ]
 * };
 *
 * registerPlatformDmnJSPlugin(DmnJSModule, [ 'drd', 'literalExpression' ]);
 * registerPlatformDmnJSPlugin(DmnJSModule, 'drd')
 */
function registerPlatformDmnJSPlugin(module, components) {

  if (!Array.isArray(components)) {
    components = [ components ]
  }

  components.forEach(c => registerClientPlugin(module, `dmn.platform.modeler.${c}.additionalModules`));
}

/**
 * Return the modeler directory, as a string.
 *
 * @deprecated Will be removed in future Camunda Modeler versions without replacement.
 *
 * @return {String}
 */
function getModelerDirectory() {
  return window.getModelerDirectory();
}

/**
 * Return the modeler plugin directory, as a string.
 *
 * @deprecated Will be removed in future Camunda Modeler versions without replacement.
 *
 * @return {String}
 */
function getPluginsDirectory() {
  return window.getPluginsDirectory();
}

/***/ }),

/***/ "./node_modules/camunda-modeler-plugin-helpers/react.js":
/*!**************************************************************!*\
  !*** ./node_modules/camunda-modeler-plugin-helpers/react.js ***!
  \**************************************************************/
/***/ ((module) => {

if (!window.react) {
  throw new Error('Not compatible with Camunda Modeler < 3.4');
}

/**
 * React object used by Camunda Modeler. Use it to create UI extension.
 *
 * @type {import('react')}
 */
module.exports = window.react;

/***/ }),

/***/ "./node_modules/easy-template-x/dist/es/easy-template-x.js":
/*!*****************************************************************!*\
  !*** ./node_modules/easy-template-x/dist/es/easy-template-x.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Base64": () => (/* binding */ Base64),
/* harmony export */   "Binary": () => (/* binding */ Binary),
/* harmony export */   "ContentPartType": () => (/* binding */ ContentPartType),
/* harmony export */   "DelimiterSearcher": () => (/* binding */ DelimiterSearcher),
/* harmony export */   "Delimiters": () => (/* binding */ Delimiters),
/* harmony export */   "Docx": () => (/* binding */ Docx),
/* harmony export */   "DocxParser": () => (/* binding */ DocxParser),
/* harmony export */   "ImagePlugin": () => (/* binding */ ImagePlugin),
/* harmony export */   "LOOP_CONTENT_TYPE": () => (/* binding */ LOOP_CONTENT_TYPE),
/* harmony export */   "LinkPlugin": () => (/* binding */ LinkPlugin),
/* harmony export */   "LoopPlugin": () => (/* binding */ LoopPlugin),
/* harmony export */   "MalformedFileError": () => (/* binding */ MalformedFileError),
/* harmony export */   "MaxXmlDepthError": () => (/* binding */ MaxXmlDepthError),
/* harmony export */   "MimeType": () => (/* binding */ MimeType),
/* harmony export */   "MimeTypeHelper": () => (/* binding */ MimeTypeHelper),
/* harmony export */   "MissingArgumentError": () => (/* binding */ MissingArgumentError),
/* harmony export */   "MissingCloseDelimiterError": () => (/* binding */ MissingCloseDelimiterError),
/* harmony export */   "MissingStartDelimiterError": () => (/* binding */ MissingStartDelimiterError),
/* harmony export */   "Path": () => (/* binding */ Path),
/* harmony export */   "PluginContent": () => (/* binding */ PluginContent),
/* harmony export */   "RawXmlPlugin": () => (/* binding */ RawXmlPlugin),
/* harmony export */   "Regex": () => (/* binding */ Regex),
/* harmony export */   "ScopeData": () => (/* binding */ ScopeData),
/* harmony export */   "TEXT_CONTENT_TYPE": () => (/* binding */ TEXT_CONTENT_TYPE),
/* harmony export */   "TEXT_NODE_NAME": () => (/* binding */ TEXT_NODE_NAME),
/* harmony export */   "TagDisposition": () => (/* binding */ TagDisposition),
/* harmony export */   "TagParser": () => (/* binding */ TagParser),
/* harmony export */   "TemplateCompiler": () => (/* binding */ TemplateCompiler),
/* harmony export */   "TemplateExtension": () => (/* binding */ TemplateExtension),
/* harmony export */   "TemplateHandler": () => (/* binding */ TemplateHandler),
/* harmony export */   "TemplateHandlerOptions": () => (/* binding */ TemplateHandlerOptions),
/* harmony export */   "TemplatePlugin": () => (/* binding */ TemplatePlugin),
/* harmony export */   "TextPlugin": () => (/* binding */ TextPlugin),
/* harmony export */   "UnclosedTagError": () => (/* binding */ UnclosedTagError),
/* harmony export */   "UnidentifiedFileTypeError": () => (/* binding */ UnidentifiedFileTypeError),
/* harmony export */   "UnknownContentTypeError": () => (/* binding */ UnknownContentTypeError),
/* harmony export */   "UnopenedTagError": () => (/* binding */ UnopenedTagError),
/* harmony export */   "UnsupportedFileTypeError": () => (/* binding */ UnsupportedFileTypeError),
/* harmony export */   "XmlDepthTracker": () => (/* binding */ XmlDepthTracker),
/* harmony export */   "XmlNode": () => (/* binding */ XmlNode),
/* harmony export */   "XmlNodeType": () => (/* binding */ XmlNodeType),
/* harmony export */   "XmlParser": () => (/* binding */ XmlParser),
/* harmony export */   "XmlPart": () => (/* binding */ XmlPart),
/* harmony export */   "Zip": () => (/* binding */ Zip),
/* harmony export */   "ZipObject": () => (/* binding */ ZipObject),
/* harmony export */   "createDefaultPlugins": () => (/* binding */ createDefaultPlugins),
/* harmony export */   "first": () => (/* binding */ first),
/* harmony export */   "inheritsFrom": () => (/* binding */ inheritsFrom),
/* harmony export */   "isNumber": () => (/* binding */ isNumber),
/* harmony export */   "isPromiseLike": () => (/* binding */ isPromiseLike),
/* harmony export */   "last": () => (/* binding */ last),
/* harmony export */   "pushMany": () => (/* binding */ pushMany),
/* harmony export */   "sha1": () => (/* binding */ sha1),
/* harmony export */   "stringValue": () => (/* binding */ stringValue),
/* harmony export */   "toDictionary": () => (/* binding */ toDictionary)
/* harmony export */ });
/* harmony import */ var _xmldom_xmldom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @xmldom/xmldom */ "./node_modules/@xmldom/xmldom/lib/index.js");
/* harmony import */ var lodash_get__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash.get */ "./node_modules/lodash.get/index.js");
/* harmony import */ var lodash_get__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_get__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var jszip__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! jszip */ "./node_modules/jszip/dist/jszip.min.js");
/* harmony import */ var jszip__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(jszip__WEBPACK_IMPORTED_MODULE_2__);
/* provided dependency */ var Buffer = __webpack_require__(/*! buffer */ "./node_modules/buffer/index.js")["Buffer"];




function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

class MalformedFileError extends Error {
  constructor(expectedFileType) {
    super(`Malformed file detected. Make sure the file is a valid ${expectedFileType} file.`);

    _defineProperty(this, "expectedFileType", void 0);

    this.expectedFileType = expectedFileType; // typescript hack: https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work

    Object.setPrototypeOf(this, MalformedFileError.prototype);
  }

}

class MaxXmlDepthError extends Error {
  constructor(maxDepth) {
    super(`XML maximum depth reached (max depth: ${maxDepth}).`);

    _defineProperty(this, "maxDepth", void 0);

    this.maxDepth = maxDepth; // typescript hack: https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work

    Object.setPrototypeOf(this, MaxXmlDepthError.prototype);
  }

}

class MissingArgumentError extends Error {
  constructor(argName) {
    super(`Argument '${argName}' is missing.`);

    _defineProperty(this, "argName", void 0);

    this.argName = argName; // typescript hack: https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work

    Object.setPrototypeOf(this, MissingArgumentError.prototype);
  }

}

class MissingCloseDelimiterError extends Error {
  constructor(openDelimiterText) {
    super(`Close delimiter is missing from '${openDelimiterText}'.`);

    _defineProperty(this, "openDelimiterText", void 0);

    this.openDelimiterText = openDelimiterText; // typescript hack: https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work

    Object.setPrototypeOf(this, MissingCloseDelimiterError.prototype);
  }

}

class MissingStartDelimiterError extends Error {
  constructor(closeDelimiterText) {
    super(`Open delimiter is missing from '${closeDelimiterText}'.`);

    _defineProperty(this, "closeDelimiterText", void 0);

    this.closeDelimiterText = closeDelimiterText; // typescript hack: https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work

    Object.setPrototypeOf(this, MissingStartDelimiterError.prototype);
  }

}

class UnclosedTagError extends Error {
  constructor(tagName) {
    super(`Tag '${tagName}' is never closed.`);

    _defineProperty(this, "tagName", void 0);

    this.tagName = tagName; // typescript hack: https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work

    Object.setPrototypeOf(this, UnclosedTagError.prototype);
  }

}

class UnidentifiedFileTypeError extends Error {
  constructor() {
    super(`The filetype for this file could not be identified, is this file corrupted?`); // typescript hack: https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work

    Object.setPrototypeOf(this, UnidentifiedFileTypeError.prototype);
  }

}

class UnknownContentTypeError extends Error {
  constructor(contentType, tagRawText, path) {
    super(`Content type '${contentType}' does not have a registered plugin to handle it.`);

    _defineProperty(this, "tagRawText", void 0);

    _defineProperty(this, "contentType", void 0);

    _defineProperty(this, "path", void 0);

    this.contentType = contentType;
    this.tagRawText = tagRawText;
    this.path = path; // typescript hack: https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work

    Object.setPrototypeOf(this, UnknownContentTypeError.prototype);
  }

}

class UnopenedTagError extends Error {
  constructor(tagName) {
    super(`Tag '${tagName}' is closed but was never opened.`);

    _defineProperty(this, "tagName", void 0);

    this.tagName = tagName; // typescript hack: https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work

    Object.setPrototypeOf(this, UnopenedTagError.prototype);
  }

}

class UnsupportedFileTypeError extends Error {
  constructor(fileType) {
    super(`Filetype "${fileType}" is not supported.`);

    _defineProperty(this, "fileType", void 0);

    this.fileType = fileType; // typescript hack: https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work

    Object.setPrototypeOf(this, UnsupportedFileTypeError.prototype);
  }

}

function pushMany(destArray, items) {
  Array.prototype.push.apply(destArray, items);
}
function first(array) {
  if (!array.length) return undefined;
  return array[0];
}
function last(array) {
  if (!array.length) return undefined;
  return array[array.length - 1];
}
function toDictionary(array, keySelector, valueSelector) {
  if (!array.length) return {};
  const res = {};
  array.forEach((item, index) => {
    const key = keySelector(item, index);
    const value = valueSelector ? valueSelector(item, index) : item;
    if (res[key]) throw new Error(`Key '${key}' already exists in the dictionary.`);
    res[key] = value;
  });
  return res;
}

class Base64 {
  static encode(str) {
    // browser
    if (typeof btoa !== 'undefined') return btoa(str); // node
    // https://stackoverflow.com/questions/23097928/node-js-btoa-is-not-defined-error#38446960

    return new Buffer(str, 'binary').toString('base64');
  }

}

function inheritsFrom(derived, base) {
  // https://stackoverflow.com/questions/14486110/how-to-check-if-a-javascript-class-inherits-another-without-creating-an-obj
  return derived === base || derived.prototype instanceof base;
}
function isPromiseLike(candidate) {
  return !!candidate && typeof candidate === 'object' && typeof candidate.then === 'function';
}

const Binary = {
  //
  // type detection
  //
  isBlob(binary) {
    return this.isBlobConstructor(binary.constructor);
  },

  isArrayBuffer(binary) {
    return this.isArrayBufferConstructor(binary.constructor);
  },

  isBuffer(binary) {
    return this.isBufferConstructor(binary.constructor);
  },

  isBlobConstructor(binaryType) {
    return typeof Blob !== 'undefined' && inheritsFrom(binaryType, Blob);
  },

  isArrayBufferConstructor(binaryType) {
    return typeof ArrayBuffer !== 'undefined' && inheritsFrom(binaryType, ArrayBuffer);
  },

  isBufferConstructor(binaryType) {
    return typeof Buffer !== 'undefined' && inheritsFrom(binaryType, Buffer);
  },

  //
  // utilities
  //
  toBase64(binary) {
    if (this.isBlob(binary)) {
      return new Promise(resolve => {
        const fileReader = new FileReader();

        fileReader.onload = function () {
          const base64 = Base64.encode(this.result);
          resolve(base64);
        };

        fileReader.readAsBinaryString(binary);
      });
    }

    if (this.isBuffer(binary)) {
      return Promise.resolve(binary.toString('base64'));
    }

    if (this.isArrayBuffer(binary)) {
      // https://stackoverflow.com/questions/9267899/arraybuffer-to-base64-encoded-string#42334410
      const binaryStr = new Uint8Array(binary).reduce((str, byte) => str + String.fromCharCode(byte), '');
      const base64 = Base64.encode(binaryStr);
      return Promise.resolve(base64);
    }

    throw new Error(`Binary type '${binary.constructor.name}' is not supported.`);
  }

};

function isNumber(value) {
  return Number.isFinite(value);
}

class Path {
  static getFilename(path) {
    const lastSlashIndex = path.lastIndexOf('/');
    return path.substr(lastSlashIndex + 1);
  }

  static getDirectory(path) {
    const lastSlashIndex = path.lastIndexOf('/');
    return path.substring(0, lastSlashIndex);
  }

  static combine(...parts) {
    return parts.filter(part => part === null || part === void 0 ? void 0 : part.trim()).join('/');
  }

}

class Regex {
  static escape(str) {
    // https://stackoverflow.com/questions/1144783/how-to-replace-all-occurrences-of-a-string-in-javascript
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
  }

}

/**
 * Secure Hash Algorithm (SHA1)
 *
 * Taken from here: http://www.webtoolkit.info/javascript-sha1.html
 *
 * Recommended here: https://stackoverflow.com/questions/6122571/simple-non-secure-hash-function-for-javascript#6122732
 */
function sha1(msg) {
  msg = utf8Encode(msg);
  const msgLength = msg.length;
  let i, j;
  const wordArray = [];

  for (i = 0; i < msgLength - 3; i += 4) {
    j = msg.charCodeAt(i) << 24 | msg.charCodeAt(i + 1) << 16 | msg.charCodeAt(i + 2) << 8 | msg.charCodeAt(i + 3);
    wordArray.push(j);
  }

  switch (msgLength % 4) {
    case 0:
      i = 0x080000000;
      break;

    case 1:
      i = msg.charCodeAt(msgLength - 1) << 24 | 0x0800000;
      break;

    case 2:
      i = msg.charCodeAt(msgLength - 2) << 24 | msg.charCodeAt(msgLength - 1) << 16 | 0x08000;
      break;

    case 3:
      i = msg.charCodeAt(msgLength - 3) << 24 | msg.charCodeAt(msgLength - 2) << 16 | msg.charCodeAt(msgLength - 1) << 8 | 0x80;
      break;
  }

  wordArray.push(i);

  while (wordArray.length % 16 != 14) {
    wordArray.push(0);
  }

  wordArray.push(msgLength >>> 29);
  wordArray.push(msgLength << 3 & 0x0ffffffff);
  const w = new Array(80);
  let H0 = 0x67452301;
  let H1 = 0xEFCDAB89;
  let H2 = 0x98BADCFE;
  let H3 = 0x10325476;
  let H4 = 0xC3D2E1F0;
  let A, B, C, D, E;
  let temp;

  for (let blockStart = 0; blockStart < wordArray.length; blockStart += 16) {
    for (i = 0; i < 16; i++) {
      w[i] = wordArray[blockStart + i];
    }

    for (i = 16; i <= 79; i++) {
      w[i] = rotateLeft(w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16], 1);
    }

    A = H0;
    B = H1;
    C = H2;
    D = H3;
    E = H4;

    for (i = 0; i <= 19; i++) {
      temp = rotateLeft(A, 5) + (B & C | ~B & D) + E + w[i] + 0x5A827999 & 0x0ffffffff;
      E = D;
      D = C;
      C = rotateLeft(B, 30);
      B = A;
      A = temp;
    }

    for (i = 20; i <= 39; i++) {
      temp = rotateLeft(A, 5) + (B ^ C ^ D) + E + w[i] + 0x6ED9EBA1 & 0x0ffffffff;
      E = D;
      D = C;
      C = rotateLeft(B, 30);
      B = A;
      A = temp;
    }

    for (i = 40; i <= 59; i++) {
      temp = rotateLeft(A, 5) + (B & C | B & D | C & D) + E + w[i] + 0x8F1BBCDC & 0x0ffffffff;
      E = D;
      D = C;
      C = rotateLeft(B, 30);
      B = A;
      A = temp;
    }

    for (i = 60; i <= 79; i++) {
      temp = rotateLeft(A, 5) + (B ^ C ^ D) + E + w[i] + 0xCA62C1D6 & 0x0ffffffff;
      E = D;
      D = C;
      C = rotateLeft(B, 30);
      B = A;
      A = temp;
    }

    H0 = H0 + A & 0x0ffffffff;
    H1 = H1 + B & 0x0ffffffff;
    H2 = H2 + C & 0x0ffffffff;
    H3 = H3 + D & 0x0ffffffff;
    H4 = H4 + E & 0x0ffffffff;
  }

  temp = cvtHex(H0) + cvtHex(H1) + cvtHex(H2) + cvtHex(H3) + cvtHex(H4);
  return temp.toLowerCase();
}

function rotateLeft(n, s) {
  const t4 = n << s | n >>> 32 - s;
  return t4;
}

function cvtHex(val) {
  let str = "";

  for (let i = 7; i >= 0; i--) {
    const v = val >>> i * 4 & 0x0f;
    str += v.toString(16);
  }

  return str;
}

function utf8Encode(str) {
  str = str.replace(/\r\n/g, "\n");
  let utfStr = "";

  for (let n = 0; n < str.length; n++) {
    const c = str.charCodeAt(n);

    if (c < 128) {
      utfStr += String.fromCharCode(c);
    } else if (c > 127 && c < 2048) {
      utfStr += String.fromCharCode(c >> 6 | 192);
      utfStr += String.fromCharCode(c & 63 | 128);
    } else {
      utfStr += String.fromCharCode(c >> 12 | 224);
      utfStr += String.fromCharCode(c >> 6 & 63 | 128);
      utfStr += String.fromCharCode(c & 63 | 128);
    }
  }

  return utfStr;
}

function stringValue(val) {
  if (val === null || val === undefined) {
    return '';
  }

  return val.toString();
}

class XmlDepthTracker {
  constructor(maxDepth) {
    this.maxDepth = maxDepth;

    _defineProperty(this, "depth", 0);
  }

  increment() {
    this.depth++;

    if (this.depth > this.maxDepth) {
      throw new MaxXmlDepthError(this.maxDepth);
    }
  }

  decrement() {
    this.depth--;
  }

}

let XmlNodeType;

(function (XmlNodeType) {
  XmlNodeType["Text"] = "Text";
  XmlNodeType["General"] = "General";
})(XmlNodeType || (XmlNodeType = {}));

const TEXT_NODE_NAME = '#text'; // see: https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeName

const XmlNode = {
  //
  // factories
  //
  createTextNode(text) {
    return {
      nodeType: XmlNodeType.Text,
      nodeName: TEXT_NODE_NAME,
      textContent: text
    };
  },

  createGeneralNode(name) {
    return {
      nodeType: XmlNodeType.General,
      nodeName: name
    };
  },

  //
  // serialization
  //

  /**
   * Encode string to make it safe to use inside xml tags.
   *
   * https://stackoverflow.com/questions/7918868/how-to-escape-xml-entities-in-javascript
   */
  encodeValue(str) {
    if (str === null || str === undefined) throw new MissingArgumentError("str");
    if (typeof str !== 'string') throw new TypeError(`Expected a string, got '${str.constructor.name}'.`);
    return str.replace(/[<>&'"]/g, c => {
      switch (c) {
        case '<':
          return '&lt;';

        case '>':
          return '&gt;';

        case '&':
          return '&amp;';

        case '\'':
          return '&apos;';

        case '"':
          return '&quot;';
      }

      return '';
    });
  },

  serialize(node) {
    if (this.isTextNode(node)) return this.encodeValue(node.textContent || ''); // attributes

    let attributes = '';

    if (node.attributes) {
      const attributeNames = Object.keys(node.attributes);

      if (attributeNames.length) {
        attributes = ' ' + attributeNames.map(name => `${name}="${this.encodeValue(node.attributes[name] || '')}"`).join(' ');
      }
    } // open tag


    const hasChildren = (node.childNodes || []).length > 0;
    const suffix = hasChildren ? '' : '/';
    const openTag = `<${node.nodeName}${attributes}${suffix}>`;
    let xml;

    if (hasChildren) {
      // child nodes
      const childrenXml = node.childNodes.map(child => this.serialize(child)).join(''); // close tag

      const closeTag = `</${node.nodeName}>`;
      xml = openTag + childrenXml + closeTag;
    } else {
      xml = openTag;
    }

    return xml;
  },

  /**
   * The conversion is always deep.
   */
  fromDomNode(domNode) {
    let xmlNode; // basic properties

    if (domNode.nodeType === domNode.TEXT_NODE) {
      xmlNode = this.createTextNode(domNode.textContent);
    } else {
      xmlNode = this.createGeneralNode(domNode.nodeName); // attributes

      if (domNode.nodeType === domNode.ELEMENT_NODE) {
        const attributes = domNode.attributes;

        if (attributes) {
          xmlNode.attributes = {};

          for (let i = 0; i < attributes.length; i++) {
            const curAttribute = attributes.item(i);
            xmlNode.attributes[curAttribute.name] = curAttribute.value;
          }
        }
      }
    } // children


    if (domNode.childNodes) {
      xmlNode.childNodes = [];
      let prevChild;

      for (let i = 0; i < domNode.childNodes.length; i++) {
        // clone child
        const domChild = domNode.childNodes.item(i);
        const curChild = this.fromDomNode(domChild); // set references

        xmlNode.childNodes.push(curChild);
        curChild.parentNode = xmlNode;

        if (prevChild) {
          prevChild.nextSibling = curChild;
        }

        prevChild = curChild;
      }
    }

    return xmlNode;
  },

  //
  // core functions
  //
  isTextNode(node) {
    if (node.nodeType === XmlNodeType.Text || node.nodeName === TEXT_NODE_NAME) {
      if (!(node.nodeType === XmlNodeType.Text && node.nodeName === TEXT_NODE_NAME)) {
        throw new Error(`Invalid text node. Type: '${node.nodeType}', Name: '${node.nodeName}'.`);
      }

      return true;
    }

    return false;
  },

  cloneNode(node, deep) {
    if (!node) throw new MissingArgumentError("node");

    if (!deep) {
      const clone = Object.assign({}, node);
      clone.parentNode = null;
      clone.childNodes = node.childNodes ? [] : null;
      clone.nextSibling = null;
      return clone;
    } else {
      const clone = cloneNodeDeep(node);
      clone.parentNode = null;
      return clone;
    }
  },

  /**
   * Insert the node as a new sibling, before the original node.
   *
   * * **Note**: It is more efficient to use the insertChild function if you
   *   already know the relevant index.
   */
  insertBefore(newNode, referenceNode) {
    if (!newNode) throw new MissingArgumentError("newNode");
    if (!referenceNode) throw new MissingArgumentError("referenceNode");
    if (!referenceNode.parentNode) throw new Error(`'${"referenceNode"}' has no parent`);
    const childNodes = referenceNode.parentNode.childNodes;
    const beforeNodeIndex = childNodes.indexOf(referenceNode);
    XmlNode.insertChild(referenceNode.parentNode, newNode, beforeNodeIndex);
  },

  /**
   * Insert the node as a new sibling, after the original node.
   *
   * * **Note**: It is more efficient to use the insertChild function if you
   *   already know the relevant index.
   */
  insertAfter(newNode, referenceNode) {
    if (!newNode) throw new MissingArgumentError("newNode");
    if (!referenceNode) throw new MissingArgumentError("referenceNode");
    if (!referenceNode.parentNode) throw new Error(`'${"referenceNode"}' has no parent`);
    const childNodes = referenceNode.parentNode.childNodes;
    const referenceNodeIndex = childNodes.indexOf(referenceNode);
    XmlNode.insertChild(referenceNode.parentNode, newNode, referenceNodeIndex + 1);
  },

  insertChild(parent, child, childIndex) {
    if (!parent) throw new MissingArgumentError("parent");
    if (XmlNode.isTextNode(parent)) throw new Error('Appending children to text nodes is forbidden');
    if (!child) throw new MissingArgumentError("child");
    if (!parent.childNodes) parent.childNodes = []; // revert to append

    if (childIndex === parent.childNodes.length) {
      XmlNode.appendChild(parent, child);
      return;
    }

    if (childIndex > parent.childNodes.length) throw new RangeError(`Child index ${childIndex} is out of range. Parent has only ${parent.childNodes.length} child nodes.`); // update references

    child.parentNode = parent;
    const childAfter = parent.childNodes[childIndex];
    child.nextSibling = childAfter;

    if (childIndex > 0) {
      const childBefore = parent.childNodes[childIndex - 1];
      childBefore.nextSibling = child;
    } // append


    parent.childNodes.splice(childIndex, 0, child);
  },

  appendChild(parent, child) {
    if (!parent) throw new MissingArgumentError("parent");
    if (XmlNode.isTextNode(parent)) throw new Error('Appending children to text nodes is forbidden');
    if (!child) throw new MissingArgumentError("child");
    if (!parent.childNodes) parent.childNodes = []; // update references

    if (parent.childNodes.length) {
      const currentLastChild = parent.childNodes[parent.childNodes.length - 1];
      currentLastChild.nextSibling = child;
    }

    child.nextSibling = null;
    child.parentNode = parent; // append

    parent.childNodes.push(child);
  },

  /**
   * Removes the node from it's parent.
   *
   * * **Note**: It is more efficient to call removeChild(parent, childIndex).
   */
  remove(node) {
    if (!node) throw new MissingArgumentError("node");
    if (!node.parentNode) throw new Error('Node has no parent');
    removeChild(node.parentNode, node);
  },

  removeChild,

  //
  // utility functions
  //

  /**
   * Gets the last direct child text node if it exists. Otherwise creates a
   * new text node, appends it to 'node' and return the newly created text
   * node.
   *
   * The function also makes sure the returned text node has a valid string
   * value.
   */
  lastTextChild(node) {
    if (XmlNode.isTextNode(node)) {
      return node;
    } // existing text nodes


    if (node.childNodes) {
      const allTextNodes = node.childNodes.filter(child => XmlNode.isTextNode(child));

      if (allTextNodes.length) {
        const lastTextNode = last(allTextNodes);
        if (!lastTextNode.textContent) lastTextNode.textContent = '';
        return lastTextNode;
      }
    } // create new text node


    const newTextNode = {
      nodeType: XmlNodeType.Text,
      nodeName: TEXT_NODE_NAME,
      textContent: ''
    };
    XmlNode.appendChild(node, newTextNode);
    return newTextNode;
  },

  /**
   * Remove sibling nodes between 'from' and 'to' excluding both.
   * Return the removed nodes.
   */
  removeSiblings(from, to) {
    if (from === to) return [];
    const removed = [];
    let lastRemoved;
    from = from.nextSibling;

    while (from !== to) {
      const removeMe = from;
      from = from.nextSibling;
      XmlNode.remove(removeMe);
      removed.push(removeMe);
      if (lastRemoved) lastRemoved.nextSibling = removeMe;
      lastRemoved = removeMe;
    }

    return removed;
  },

  /**
   * Split the original node into two sibling nodes. Returns both nodes.
   *
   * @param parent The node to split
   * @param child The node that marks the split position.
   * @param removeChild Should this method remove the child while splitting.
   *
   * @returns Two nodes - `left` and `right`. If the `removeChild` argument is
   * `false` then the original child node is the first child of `right`.
   */
  splitByChild(parent, child, removeChild) {
    if (child.parentNode != parent) throw new Error(`Node '${"child"}' is not a direct child of '${"parent"}'.`); // create childless clone 'left'

    const left = XmlNode.cloneNode(parent, false);

    if (parent.parentNode) {
      XmlNode.insertBefore(left, parent);
    }

    const right = parent; // move nodes from 'right' to 'left'

    let curChild = right.childNodes[0];

    while (curChild != child) {
      XmlNode.remove(curChild);
      XmlNode.appendChild(left, curChild);
      curChild = right.childNodes[0];
    } // remove child


    if (removeChild) {
      XmlNode.removeChild(right, 0);
    }

    return [left, right];
  },

  findParent(node, predicate) {
    while (node) {
      if (predicate(node)) return node;
      node = node.parentNode;
    }

    return null;
  },

  findParentByName(node, nodeName) {
    return XmlNode.findParent(node, n => n.nodeName === nodeName);
  },

  findChildByName(node, childName) {
    if (!node) return null;
    return (node.childNodes || []).find(child => child.nodeName === childName);
  },

  /**
   * Returns all siblings between 'firstNode' and 'lastNode' inclusive.
   */
  siblingsInRange(firstNode, lastNode) {
    if (!firstNode) throw new MissingArgumentError("firstNode");
    if (!lastNode) throw new MissingArgumentError("lastNode");
    const range = [];
    let curNode = firstNode;

    while (curNode && curNode !== lastNode) {
      range.push(curNode);
      curNode = curNode.nextSibling;
    }

    if (!curNode) throw new Error('Nodes are not siblings.');
    range.push(lastNode);
    return range;
  },

  /**
   * Recursively removes text nodes leaving only "general nodes".
   */
  removeEmptyTextNodes(node) {
    recursiveRemoveEmptyTextNodes(node);
  }

}; //
// overloaded functions
//

/**
 * Remove a child node from it's parent. Returns the removed child.
 *
 * * **Note:** Prefer calling with explicit index.
 */

function removeChild(parent, childOrIndex) {
  if (!parent) throw new MissingArgumentError("parent");
  if (childOrIndex === null || childOrIndex === undefined) throw new MissingArgumentError("childOrIndex");
  if (!parent.childNodes || !parent.childNodes.length) throw new Error('Parent node has node children'); // get child index

  let childIndex;

  if (typeof childOrIndex === 'number') {
    childIndex = childOrIndex;
  } else {
    childIndex = parent.childNodes.indexOf(childOrIndex);
    if (childIndex === -1) throw new Error('Specified child node is not a child of the specified parent');
  }

  if (childIndex >= parent.childNodes.length) throw new RangeError(`Child index ${childIndex} is out of range. Parent has only ${parent.childNodes.length} child nodes.`); // update references

  const child = parent.childNodes[childIndex];

  if (childIndex > 0) {
    const beforeChild = parent.childNodes[childIndex - 1];
    beforeChild.nextSibling = child.nextSibling;
  }

  child.parentNode = null;
  child.nextSibling = null; // remove and return

  return parent.childNodes.splice(childIndex, 1)[0];
} //
// private functions
//


function cloneNodeDeep(original) {
  const clone = {}; // basic properties

  clone.nodeType = original.nodeType;
  clone.nodeName = original.nodeName;

  if (XmlNode.isTextNode(original)) {
    clone.textContent = original.textContent;
  } else {
    const attributes = original.attributes;

    if (attributes) {
      clone.attributes = Object.assign({}, attributes);
    }
  } // children


  if (original.childNodes) {
    clone.childNodes = [];
    let prevChildClone;

    for (const child of original.childNodes) {
      // clone child
      const childClone = cloneNodeDeep(child); // set references

      clone.childNodes.push(childClone);
      childClone.parentNode = clone;

      if (prevChildClone) {
        prevChildClone.nextSibling = childClone;
      }

      prevChildClone = childClone;
    }
  }

  return clone;
}

function recursiveRemoveEmptyTextNodes(node) {
  if (!node.childNodes) return node;
  const oldChildren = node.childNodes;
  node.childNodes = [];

  for (const child of oldChildren) {
    if (XmlNode.isTextNode(child)) {
      // https://stackoverflow.com/questions/1921688/filtering-whitespace-only-strings-in-javascript#1921694
      if (child.textContent && child.textContent.match(/\S/)) {
        node.childNodes.push(child);
      }

      continue;
    }

    const strippedChild = recursiveRemoveEmptyTextNodes(child);
    node.childNodes.push(strippedChild);
  }

  return node;
}

class XmlParser {
  /**
   * We always use the DOMParser from 'xmldom', even in the browser since it
   * handles xml namespaces more forgivingly (required mainly by the
   * RawXmlPlugin).
   */
  parse(str) {
    const doc = this.domParse(str);
    return XmlNode.fromDomNode(doc.documentElement);
  }

  domParse(str) {
    if (str === null || str === undefined) throw new MissingArgumentError("str");
    return XmlParser.parser.parseFromString(str, "text/xml");
  }

  serialize(xmlNode) {
    return XmlParser.xmlHeader + XmlNode.serialize(xmlNode);
  }

}

_defineProperty(XmlParser, "xmlHeader", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');

_defineProperty(XmlParser, "parser", new _xmldom_xmldom__WEBPACK_IMPORTED_MODULE_0__.DOMParser());

class MatchState {
  constructor() {
    _defineProperty(this, "delimiterIndex", 0);

    _defineProperty(this, "openNodes", []);

    _defineProperty(this, "firstMatchIndex", -1);
  }

  reset() {
    this.delimiterIndex = 0;
    this.openNodes = [];
    this.firstMatchIndex = -1;
  }

}

class DelimiterSearcher {
  constructor(docxParser) {
    this.docxParser = docxParser;

    _defineProperty(this, "maxXmlDepth", 20);

    _defineProperty(this, "startDelimiter", "{");

    _defineProperty(this, "endDelimiter", "}");

    if (!docxParser) throw new MissingArgumentError("docxParser");
  }

  findDelimiters(node) {
    //
    // Performance note: 
    //
    // The search efficiency is o(m*n) where n is the text size and m is the
    // delimiter length. We could use a variation of the KMP algorithm here
    // to reduce it to o(m+n) but since our m is expected to be small
    // (delimiters defaults to 2 characters and even on custom inputs are
    // not expected to be much longer) it does not worth the extra
    // complexity and effort.
    //
    const delimiters = [];
    const match = new MatchState();
    const depth = new XmlDepthTracker(this.maxXmlDepth);
    let lookForOpenDelimiter = true;

    while (node) {
      // reset state on paragraph transition
      if (this.docxParser.isParagraphNode(node)) {
        match.reset();
      } // skip irrelevant nodes


      if (!this.shouldSearchNode(node)) {
        node = this.findNextNode(node, depth);
        continue;
      } // search delimiters in text nodes


      match.openNodes.push(node);
      let textIndex = 0;

      while (textIndex < node.textContent.length) {
        const delimiterPattern = lookForOpenDelimiter ? this.startDelimiter : this.endDelimiter; // char match

        const char = node.textContent[textIndex];

        if (char === delimiterPattern[match.delimiterIndex]) {
          // first match
          if (match.firstMatchIndex === -1) {
            match.firstMatchIndex = textIndex;
          } // full delimiter match


          if (match.delimiterIndex === delimiterPattern.length - 1) {
            // move all delimiters characters to the same text node
            if (match.openNodes.length > 1) {
              const firstNode = first(match.openNodes);
              const lastNode = last(match.openNodes);
              this.docxParser.joinTextNodesRange(firstNode, lastNode);
              textIndex += firstNode.textContent.length - node.textContent.length;
              node = firstNode;
            } // store delimiter


            const delimiterMark = this.createDelimiterMark(match, lookForOpenDelimiter);
            delimiters.push(delimiterMark); // update state

            lookForOpenDelimiter = !lookForOpenDelimiter;
            match.reset();

            if (textIndex < node.textContent.length - 1) {
              match.openNodes.push(node);
            }
          } else {
            match.delimiterIndex++;
          }
        } // no match
        else {
          //
          // go back to first open node
          //
          // Required for cases where the text has repeating
          // characters that are the same as a delimiter prefix.  
          // For instance:  
          // Delimiter is '{!' and template text contains the string '{{!'
          //
          if (match.firstMatchIndex !== -1) {
            node = first(match.openNodes);
            textIndex = match.firstMatchIndex;
          } // update state


          match.reset();

          if (textIndex < node.textContent.length - 1) {
            match.openNodes.push(node);
          }
        }

        textIndex++;
      }

      node = this.findNextNode(node, depth);
    }

    return delimiters;
  }

  shouldSearchNode(node) {
    if (!XmlNode.isTextNode(node)) return false;
    if (!node.textContent) return false;
    if (!node.parentNode) return false;
    if (!this.docxParser.isTextNode(node.parentNode)) return false;
    return true;
  }

  findNextNode(node, depth) {
    // children
    if (node.childNodes && node.childNodes.length) {
      depth.increment();
      return node.childNodes[0];
    } // siblings


    if (node.nextSibling) return node.nextSibling; // parent sibling

    while (node.parentNode) {
      if (node.parentNode.nextSibling) {
        depth.decrement();
        return node.parentNode.nextSibling;
      } // go up


      depth.decrement();
      node = node.parentNode;
    }

    return null;
  }

  createDelimiterMark(match, isOpenDelimiter) {
    return {
      index: match.firstMatchIndex,
      isOpen: isOpenDelimiter,
      xmlTextNode: match.openNodes[0]
    };
  }

}

class ScopeData {
  static defaultResolver(args) {
    let result;
    const lastKey = last(args.strPath);
    const curPath = args.strPath.slice();

    while (result === undefined && curPath.length) {
      curPath.pop();
      result = lodash_get__WEBPACK_IMPORTED_MODULE_1___default()(args.data, curPath.concat(lastKey));
    }

    return result;
  }

  constructor(data) {
    _defineProperty(this, "scopeDataResolver", void 0);

    _defineProperty(this, "allData", void 0);

    _defineProperty(this, "path", []);

    _defineProperty(this, "strPath", []);

    this.allData = data;
  }

  pathPush(pathPart) {
    this.path.push(pathPart);
    const strItem = isNumber(pathPart) ? pathPart.toString() : pathPart.name;
    this.strPath.push(strItem);
  }

  pathPop() {
    this.strPath.pop();
    return this.path.pop();
  }

  pathString() {
    return this.strPath.join(".");
  }

  getScopeData() {
    const args = {
      path: this.path,
      strPath: this.strPath,
      data: this.allData
    };

    if (this.scopeDataResolver) {
      return this.scopeDataResolver(args);
    }

    return ScopeData.defaultResolver(args);
  }

}

let TagDisposition;

(function (TagDisposition) {
  TagDisposition["Open"] = "Open";
  TagDisposition["Close"] = "Close";
  TagDisposition["SelfClosed"] = "SelfClosed";
})(TagDisposition || (TagDisposition = {}));

class TagParser {
  constructor(docParser, delimiters) {
    this.docParser = docParser;
    this.delimiters = delimiters;

    _defineProperty(this, "tagRegex", void 0);

    if (!docParser) throw new MissingArgumentError("docParser");
    if (!delimiters) throw new MissingArgumentError("delimiters");
    this.tagRegex = new RegExp(`^${Regex.escape(delimiters.tagStart)}(.*?)${Regex.escape(delimiters.tagEnd)}`, 'm');
  }

  parse(delimiters) {
    const tags = [];
    let openedTag;
    let openedDelimiter;

    for (let i = 0; i < delimiters.length; i++) {
      const delimiter = delimiters[i]; // close before open

      if (!openedTag && !delimiter.isOpen) {
        const closeTagText = delimiter.xmlTextNode.textContent;
        throw new MissingStartDelimiterError(closeTagText);
      } // open before close


      if (openedTag && delimiter.isOpen) {
        const openTagText = openedDelimiter.xmlTextNode.textContent;
        throw new MissingCloseDelimiterError(openTagText);
      } // valid open


      if (!openedTag && delimiter.isOpen) {
        openedTag = {};
        openedDelimiter = delimiter;
      } // valid close


      if (openedTag && !delimiter.isOpen) {
        // normalize the underlying xml structure
        // (make sure the tag's node only includes the tag's text)
        this.normalizeTagNodes(openedDelimiter, delimiter, i, delimiters);
        openedTag.xmlTextNode = openedDelimiter.xmlTextNode; // extract tag info from tag's text

        this.processTag(openedTag);
        tags.push(openedTag);
        openedTag = null;
        openedDelimiter = null;
      }
    }

    return tags;
  }
  /**
   * Consolidate all tag's text into a single text node.
   *
   * Example:
   *
   * Text node before: "some text {some tag} some more text"
   * Text nodes after: [ "some text ", "{some tag}", " some more text" ]
   */


  normalizeTagNodes(openDelimiter, closeDelimiter, closeDelimiterIndex, allDelimiters) {
    let startTextNode = openDelimiter.xmlTextNode;
    let endTextNode = closeDelimiter.xmlTextNode;
    const sameNode = startTextNode === endTextNode; // trim start

    if (openDelimiter.index > 0) {
      this.docParser.splitTextNode(startTextNode, openDelimiter.index, true);

      if (sameNode) {
        closeDelimiter.index -= openDelimiter.index;
      }
    } // trim end


    if (closeDelimiter.index < endTextNode.textContent.length - 1) {
      endTextNode = this.docParser.splitTextNode(endTextNode, closeDelimiter.index + this.delimiters.tagEnd.length, true);

      if (sameNode) {
        startTextNode = endTextNode;
      }
    } // join nodes


    if (!sameNode) {
      this.docParser.joinTextNodesRange(startTextNode, endTextNode);
      endTextNode = startTextNode;
    } // update offsets of next delimiters


    for (let i = closeDelimiterIndex + 1; i < allDelimiters.length; i++) {
      let updated = false;
      const curDelimiter = allDelimiters[i];

      if (curDelimiter.xmlTextNode === openDelimiter.xmlTextNode) {
        curDelimiter.index -= openDelimiter.index;
        updated = true;
      }

      if (curDelimiter.xmlTextNode === closeDelimiter.xmlTextNode) {
        curDelimiter.index -= closeDelimiter.index + this.delimiters.tagEnd.length;
        updated = true;
      }

      if (!updated) break;
    } // update references


    openDelimiter.xmlTextNode = startTextNode;
    closeDelimiter.xmlTextNode = endTextNode;
  }

  processTag(tag) {
    tag.rawText = tag.xmlTextNode.textContent;
    const tagParts = this.tagRegex.exec(tag.rawText);
    const tagContent = (tagParts[1] || '').trim();

    if (!tagContent || !tagContent.length) {
      tag.disposition = TagDisposition.SelfClosed;
      return;
    }

    if (tagContent.startsWith(this.delimiters.containerTagOpen)) {
      tag.disposition = TagDisposition.Open;
      tag.name = tagContent.slice(this.delimiters.containerTagOpen.length).trim();
    } else if (tagContent.startsWith(this.delimiters.containerTagClose)) {
      tag.disposition = TagDisposition.Close;
      tag.name = tagContent.slice(this.delimiters.containerTagClose.length).trim();
    } else {
      tag.disposition = TagDisposition.SelfClosed;
      tag.name = tagContent;
    }
  }

}

let MimeType;

(function (MimeType) {
  MimeType["Png"] = "image/png";
  MimeType["Jpeg"] = "image/jpeg";
  MimeType["Gif"] = "image/gif";
  MimeType["Bmp"] = "image/bmp";
  MimeType["Svg"] = "image/svg+xml";
})(MimeType || (MimeType = {}));

class MimeTypeHelper {
  static getDefaultExtension(mime) {
    switch (mime) {
      case MimeType.Png:
        return 'png';

      case MimeType.Jpeg:
        return 'jpg';

      case MimeType.Gif:
        return 'gif';

      case MimeType.Bmp:
        return 'bmp';

      case MimeType.Svg:
        return 'svg';

      default:
        throw new UnsupportedFileTypeError(mime);
    }
  }

  static getOfficeRelType(mime) {
    switch (mime) {
      case MimeType.Png:
      case MimeType.Jpeg:
      case MimeType.Gif:
      case MimeType.Bmp:
      case MimeType.Svg:
        return "http://schemas.openxmlformats.org/officeDocument/2006/relationships/image";

      default:
        throw new UnsupportedFileTypeError(mime);
    }
  }

}

/* eslint-disable @typescript-eslint/member-ordering */
class TemplatePlugin {
  constructor() {
    _defineProperty(this, "contentType", void 0);

    _defineProperty(this, "utilities", void 0);
  }

  /**
   * Called by the TemplateHandler at runtime.
   */
  setUtilities(utilities) {
    this.utilities = utilities;
  }
  /**
   * This method is called for each self-closing tag.
   * It should implement the specific document manipulation required by the tag.
   */


  simpleTagReplacements(tag, data, context) {// noop
  }
  /**
   * This method is called for each container tag. It should implement the
   * specific document manipulation required by the tag.
   *
   * @param tags All tags between the opening tag and closing tag (inclusive,
   * i.e. tags[0] is the opening tag and the last item in the tags array is
   * the closing tag).
   */


  containerTagReplacements(tags, data, context) {// noop
  }

}

/**
 * Apparently it is not that important for the ID to be unique...
 * Word displays two images correctly even if they both have the same ID.
 * Further more, Word will assign each a unique ID upon saving (it assigns
 * consecutive integers starting with 1).
 *
 * Note: The same principal applies to image names.
 *
 * Tested in Word v1908
 */
let nextImageId = 1;
class ImagePlugin extends TemplatePlugin {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "contentType", 'image');
  }

  async simpleTagReplacements(tag, data, context) {
    const wordTextNode = this.utilities.docxParser.containingTextNode(tag.xmlTextNode);
    const content = data.getScopeData();

    if (!content || !content.source) {
      XmlNode.remove(wordTextNode);
      return;
    } // add the image file into the archive


    const mediaFilePath = await context.docx.mediaFiles.add(content.source, content.format);
    const relType = MimeTypeHelper.getOfficeRelType(content.format);
    const relId = await context.currentPart.rels.add(mediaFilePath, relType);
    await context.docx.contentTypes.ensureContentType(content.format); // create the xml markup

    const imageId = nextImageId++;
    const imageXml = this.createMarkup(imageId, relId, content.width, content.height);
    XmlNode.insertAfter(imageXml, wordTextNode);
    XmlNode.remove(wordTextNode);
  }

  createMarkup(imageId, relId, width, height) {
    // http://officeopenxml.com/drwPicInline.php
    //
    // Performance note:
    //
    // I've tried to improve the markup generation performance by parsing
    // the string once and caching the result (and of course customizing it
    // per image) but it made no change whatsoever (in both cases 1000 items
    // loop takes around 8 seconds on my machine) so I'm sticking with this
    // approach which I find to be more readable.
    //
    const name = `Picture ${imageId}`;
    const markupText = `
            <w:drawing>
                <wp:inline distT="0" distB="0" distL="0" distR="0">
                    <wp:extent cx="${this.pixelsToEmu(width)}" cy="${this.pixelsToEmu(height)}"/>
                    <wp:effectExtent l="0" t="0" r="0" b="0"/>
                    <wp:docPr id="${imageId}" name="${name}"/>
                    <wp:cNvGraphicFramePr>
                        <a:graphicFrameLocks xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" noChangeAspect="1"/>
                    </wp:cNvGraphicFramePr>
                    <a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
                        <a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">
                            ${this.pictureMarkup(name, relId, width, height)}
                        </a:graphicData>
                    </a:graphic>
                </wp:inline>
            </w:drawing>
        `;
    const markupXml = this.utilities.xmlParser.parse(markupText);
    XmlNode.removeEmptyTextNodes(markupXml); // remove whitespace

    return markupXml;
  }

  pictureMarkup(name, relId, width, height) {
    // http://officeopenxml.com/drwPic.php
    // legend:
    // nvPicPr - non-visual picture properties - id, name, etc.
    // blipFill - binary large image (or) picture fill - image size, image fill, etc.
    // spPr - shape properties - frame size, frame fill, etc.
    return `
            <pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">
                <pic:nvPicPr>
                    <pic:cNvPr id="0" name="${name}"/>
                    <pic:cNvPicPr>
                        <a:picLocks noChangeAspect="1" noChangeArrowheads="1"/>
                    </pic:cNvPicPr>
                </pic:nvPicPr>
                <pic:blipFill>
                    <a:blip r:embed="${relId}">
                        <a:extLst>
                            <a:ext uri="{28A0092B-C50C-407E-A947-70E740481C1C}">
                                <a14:useLocalDpi xmlns:a14="http://schemas.microsoft.com/office/drawing/2010/main" val="0"/>
                            </a:ext>
                        </a:extLst>
                    </a:blip>
                    <a:srcRect/>
                    <a:stretch>
                        <a:fillRect/>
                    </a:stretch>
                </pic:blipFill>
                <pic:spPr bwMode="auto">
                    <a:xfrm>
                        <a:off x="0" y="0"/>
                        <a:ext cx="${this.pixelsToEmu(width)}" cy="${this.pixelsToEmu(height)}"/>
                    </a:xfrm>
                    <a:prstGeom prst="rect">
                        <a:avLst/>
                    </a:prstGeom>
                    <a:noFill/>
                    <a:ln>
                        <a:noFill/>
                    </a:ln>
                </pic:spPr>
            </pic:pic>
        `;
  }

  pixelsToEmu(pixels) {
    // https://stackoverflow.com/questions/20194403/openxml-distance-size-units
    // https://docs.microsoft.com/en-us/windows/win32/vml/msdn-online-vml-units#other-units-of-measurement
    // https://en.wikipedia.org/wiki/Office_Open_XML_file_formats#DrawingML
    // http://www.java2s.com/Code/CSharp/2D-Graphics/ConvertpixelstoEMUEMUtopixels.htm
    return Math.round(pixels * 9525);
  }

}

let ContentPartType;

(function (ContentPartType) {
  ContentPartType["MainDocument"] = "MainDocument";
  ContentPartType["DefaultHeader"] = "DefaultHeader";
  ContentPartType["FirstHeader"] = "FirstHeader";
  ContentPartType["EvenPagesHeader"] = "EvenPagesHeader";
  ContentPartType["DefaultFooter"] = "DefaultFooter";
  ContentPartType["FirstFooter"] = "FirstFooter";
  ContentPartType["EvenPagesFooter"] = "EvenPagesFooter";
})(ContentPartType || (ContentPartType = {}));

/**
 * http://officeopenxml.com/anatomyofOOXML.php
 */
class ContentTypesFile {
  constructor(zip, xmlParser) {
    this.zip = zip;
    this.xmlParser = xmlParser;

    _defineProperty(this, "addedNew", false);

    _defineProperty(this, "root", void 0);

    _defineProperty(this, "contentTypes", void 0);
  }

  async ensureContentType(mime) {
    // parse the content types file
    await this.parseContentTypesFile(); // already exists

    if (this.contentTypes[mime]) return; // add new

    const extension = MimeTypeHelper.getDefaultExtension(mime);
    const typeNode = XmlNode.createGeneralNode('Default');
    typeNode.attributes = {
      "Extension": extension,
      "ContentType": mime
    };
    this.root.childNodes.push(typeNode); // update state

    this.addedNew = true;
    this.contentTypes[mime] = true;
  }

  async count() {
    await this.parseContentTypesFile();
    return this.root.childNodes.filter(node => !XmlNode.isTextNode(node)).length;
  }
  /**
   * Save the Content Types file back to the zip.
   * Called automatically by the holding `Docx` before exporting.
   */


  async save() {
    // not change - no need to save
    if (!this.addedNew) return;
    const xmlContent = this.xmlParser.serialize(this.root);
    this.zip.setFile(ContentTypesFile.contentTypesFilePath, xmlContent);
  }

  async parseContentTypesFile() {
    if (this.root) return; // parse the xml file

    const contentTypesXml = await this.zip.getFile(ContentTypesFile.contentTypesFilePath).getContentText();
    this.root = this.xmlParser.parse(contentTypesXml); // build the content types lookup

    this.contentTypes = {};

    for (const node of this.root.childNodes) {
      if (node.nodeName !== 'Default') continue;
      const genNode = node;
      const contentTypeAttribute = genNode.attributes['ContentType'];
      if (!contentTypeAttribute) continue;
      this.contentTypes[contentTypeAttribute] = true;
    }
  }

}

_defineProperty(ContentTypesFile, "contentTypesFilePath", '[Content_Types].xml');

/**
 * Handles media files of the main document.
 */
class MediaFiles {
  constructor(zip) {
    this.zip = zip;

    _defineProperty(this, "hashes", void 0);

    _defineProperty(this, "files", new Map());

    _defineProperty(this, "nextFileId", 0);
  }
  /**
   * Returns the media file path.
   */


  async add(mediaFile, mime) {
    // check if already added
    if (this.files.has(mediaFile)) return this.files.get(mediaFile); // hash existing media files

    await this.hashMediaFiles(); // hash the new file
    // Note: Even though hashing the base64 string may seem inefficient
    // (requires extra step in some cases) in practice it is significantly
    // faster than hashing a 'binarystring'.

    const base64 = await Binary.toBase64(mediaFile);
    const hash = sha1(base64); // check if file already exists
    // note: this can be optimized by keeping both mapping by filename as well as by hash

    let path = Object.keys(this.hashes).find(p => this.hashes[p] === hash);
    if (path) return path; // generate unique media file name

    const extension = MimeTypeHelper.getDefaultExtension(mime);

    do {
      this.nextFileId++;
      path = `${MediaFiles.mediaDir}/media${this.nextFileId}.${extension}`;
    } while (this.hashes[path]); // add media to zip


    await this.zip.setFile(path, mediaFile); // add media to our lookups

    this.hashes[path] = hash;
    this.files.set(mediaFile, path); // return

    return path;
  }

  async count() {
    await this.hashMediaFiles();
    return Object.keys(this.hashes).length;
  }

  async hashMediaFiles() {
    if (this.hashes) return;
    this.hashes = {};

    for (const path of this.zip.listFiles()) {
      if (!path.startsWith(MediaFiles.mediaDir)) continue;
      const filename = Path.getFilename(path);
      if (!filename) continue;
      const fileData = await this.zip.getFile(path).getContentBase64();
      const fileHash = sha1(fileData);
      this.hashes[filename] = fileHash;
    }
  }

}

_defineProperty(MediaFiles, "mediaDir", 'word/media');

class Relationship {
  static fromXml(xml) {
    var _xml$attributes, _xml$attributes2, _xml$attributes3, _xml$attributes4;

    return new Relationship({
      id: (_xml$attributes = xml.attributes) === null || _xml$attributes === void 0 ? void 0 : _xml$attributes['Id'],
      type: (_xml$attributes2 = xml.attributes) === null || _xml$attributes2 === void 0 ? void 0 : _xml$attributes2['Type'],
      target: (_xml$attributes3 = xml.attributes) === null || _xml$attributes3 === void 0 ? void 0 : _xml$attributes3['Target'],
      targetMode: (_xml$attributes4 = xml.attributes) === null || _xml$attributes4 === void 0 ? void 0 : _xml$attributes4['TargetMode']
    });
  }

  constructor(initial) {
    _defineProperty(this, "id", void 0);

    _defineProperty(this, "type", void 0);

    _defineProperty(this, "target", void 0);

    _defineProperty(this, "targetMode", void 0);

    Object.assign(this, initial);
  }

  toXml() {
    const node = XmlNode.createGeneralNode('Relationship');
    node.attributes = {}; // set only non-empty attributes

    for (const propKey of Object.keys(this)) {
      const value = this[propKey];

      if (value && typeof value === 'string') {
        const attrName = propKey[0].toUpperCase() + propKey.substr(1);
        node.attributes[attrName] = value;
      }
    }

    return node;
  }

}

/**
 * Handles the relationship logic of a single docx "part".
 * http://officeopenxml.com/anatomyofOOXML.php
 */

class Rels {
  constructor(partPath, zip, xmlParser) {
    this.zip = zip;
    this.xmlParser = xmlParser;

    _defineProperty(this, "rels", void 0);

    _defineProperty(this, "relTargets", void 0);

    _defineProperty(this, "nextRelId", 0);

    _defineProperty(this, "partDir", void 0);

    _defineProperty(this, "relsFilePath", void 0);

    this.partDir = partPath && Path.getDirectory(partPath);
    const partFilename = partPath && Path.getFilename(partPath);
    this.relsFilePath = Path.combine(this.partDir, '_rels', `${partFilename !== null && partFilename !== void 0 ? partFilename : ''}.rels`);
  }
  /**
   * Returns the rel ID.
   */


  async add(relTarget, relType, relTargetMode) {
    // if relTarget is an internal file it should be relative to the part dir
    if (this.partDir && relTarget.startsWith(this.partDir)) {
      relTarget = relTarget.substr(this.partDir.length + 1);
    } // parse rels file


    await this.parseRelsFile(); // already exists?

    const relTargetKey = this.getRelTargetKey(relType, relTarget);
    let relId = this.relTargets[relTargetKey];
    if (relId) return relId; // create rel node

    relId = this.getNextRelId();
    const rel = new Relationship({
      id: relId,
      type: relType,
      target: relTarget,
      targetMode: relTargetMode
    }); // update lookups

    this.rels[relId] = rel;
    this.relTargets[relTargetKey] = relId; // return

    return relId;
  }

  async list() {
    await this.parseRelsFile();
    return Object.values(this.rels);
  }
  /**
   * Save the rels file back to the zip.
   * Called automatically by the holding `Docx` before exporting.
   */


  async save() {
    // not change - no need to save
    if (!this.rels) return; // create rels xml

    const root = this.createRootNode();
    root.childNodes = Object.values(this.rels).map(rel => rel.toXml()); // serialize and save

    const xmlContent = this.xmlParser.serialize(root);
    this.zip.setFile(this.relsFilePath, xmlContent);
  } //
  // private methods
  //


  getNextRelId() {
    let relId;

    do {
      this.nextRelId++;
      relId = 'rId' + this.nextRelId;
    } while (this.rels[relId]);

    return relId;
  }

  async parseRelsFile() {
    // already parsed
    if (this.rels) return; // parse xml

    let root;
    const relsFile = this.zip.getFile(this.relsFilePath);

    if (relsFile) {
      const xml = await relsFile.getContentText();
      root = this.xmlParser.parse(xml);
    } else {
      root = this.createRootNode();
    } // parse relationship nodes


    this.rels = {};
    this.relTargets = {};

    for (const relNode of root.childNodes) {
      const attributes = relNode.attributes;
      if (!attributes) continue;
      const idAttr = attributes['Id'];
      if (!idAttr) continue; // store rel

      const rel = Relationship.fromXml(relNode);
      this.rels[idAttr] = rel; // create rel target lookup

      const typeAttr = attributes['Type'];
      const targetAttr = attributes['Target'];

      if (typeAttr && targetAttr) {
        const relTargetKey = this.getRelTargetKey(typeAttr, targetAttr);
        this.relTargets[relTargetKey] = idAttr;
      }
    }
  }

  getRelTargetKey(type, target) {
    return `${type} - ${target}`;
  }

  createRootNode() {
    const root = XmlNode.createGeneralNode('Relationships');
    root.attributes = {
      'xmlns': 'http://schemas.openxmlformats.org/package/2006/relationships'
    };
    root.childNodes = [];
    return root;
  }

}

/**
 * Represents an xml file that is part of an OPC package.
 *
 * See: https://en.wikipedia.org/wiki/Open_Packaging_Conventions
 */

class XmlPart {
  constructor(path, zip, xmlParser) {
    this.path = path;
    this.zip = zip;
    this.xmlParser = xmlParser;

    _defineProperty(this, "rels", void 0);

    _defineProperty(this, "root", void 0);

    this.rels = new Rels(this.path, zip, xmlParser);
  } //
  // public methods
  //

  /**
   * Get the xml root node of the part.
   * Changes to the xml will be persisted to the underlying zip file.
   */


  async xmlRoot() {
    if (!this.root) {
      const xml = await this.zip.getFile(this.path).getContentText();
      this.root = this.xmlParser.parse(xml);
    }

    return this.root;
  }
  /**
   * Get the text content of the part.
   */


  async getText() {
    const xmlDocument = await this.xmlRoot(); // ugly but good enough...

    const xml = this.xmlParser.serialize(xmlDocument);
    const domDocument = this.xmlParser.domParse(xml);
    return domDocument.documentElement.textContent;
  }

  async saveChanges() {
    // save xml
    if (this.root) {
      const xmlRoot = await this.xmlRoot();
      const xmlContent = this.xmlParser.serialize(xmlRoot);
      this.zip.setFile(this.path, xmlContent);
    } // save rels


    await this.rels.save();
  }

}

/**
 * Represents a single docx file.
 */

class Docx {
  //
  // static methods
  //
  static async open(zip, xmlParser) {
    const mainDocumentPath = await Docx.getMainDocumentPath(zip, xmlParser);
    if (!mainDocumentPath) throw new MalformedFileError('docx');
    return new Docx(mainDocumentPath, zip, xmlParser);
  }

  static async getMainDocumentPath(zip, xmlParser) {
    var _relations$find;

    const rootPart = '';
    const rootRels = new Rels(rootPart, zip, xmlParser);
    const relations = await rootRels.list();
    return (_relations$find = relations.find(rel => rel.type == Docx.mainDocumentRelType)) === null || _relations$find === void 0 ? void 0 : _relations$find.target;
  } //
  // fields
  //


  /**
   * **Notice:** You should only use this property if there is no other way to
   * do what you need. Use with caution.
   */
  get rawZipFile() {
    return this.zip;
  } //
  // constructor
  //


  constructor(mainDocumentPath, zip, xmlParser) {
    this.zip = zip;
    this.xmlParser = xmlParser;

    _defineProperty(this, "mainDocument", void 0);

    _defineProperty(this, "mediaFiles", void 0);

    _defineProperty(this, "contentTypes", void 0);

    _defineProperty(this, "_parts", {});

    this.mainDocument = new XmlPart(mainDocumentPath, zip, xmlParser);
    this.mediaFiles = new MediaFiles(zip);
    this.contentTypes = new ContentTypesFile(zip, xmlParser);
  } //
  // public methods
  //


  async getContentPart(type) {
    switch (type) {
      case ContentPartType.MainDocument:
        return this.mainDocument;

      default:
        return await this.getHeaderOrFooter(type);
    }
  }
  /**
   * Returns the xml parts of the main document, headers and footers.
   */


  async getContentParts() {
    const partTypes = [ContentPartType.MainDocument, ContentPartType.DefaultHeader, ContentPartType.FirstHeader, ContentPartType.EvenPagesHeader, ContentPartType.DefaultFooter, ContentPartType.FirstFooter, ContentPartType.EvenPagesFooter];
    const parts = await Promise.all(partTypes.map(p => this.getContentPart(p)));
    return parts.filter(p => !!p);
  }

  async export(outputType) {
    await this.saveChanges();
    return await this.zip.export(outputType);
  } //
  // private methods
  //


  async getHeaderOrFooter(type) {
    var _sectionProps$childNo, _attributes;

    const nodeName = this.headerFooterNodeName(type);
    const nodeTypeAttribute = this.headerFooterType(type); // find the last section properties
    // see: http://officeopenxml.com/WPsection.php

    const docRoot = await this.mainDocument.xmlRoot();
    const body = docRoot.childNodes[0];
    const sectionProps = last(body.childNodes.filter(node => node.nodeType === XmlNodeType.General));
    if (sectionProps.nodeName != 'w:sectPr') return null; // find the header or footer reference

    const reference = (_sectionProps$childNo = sectionProps.childNodes) === null || _sectionProps$childNo === void 0 ? void 0 : _sectionProps$childNo.find(node => {
      var _node$attributes;

      return node.nodeType === XmlNodeType.General && node.nodeName === nodeName && ((_node$attributes = node.attributes) === null || _node$attributes === void 0 ? void 0 : _node$attributes['w:type']) === nodeTypeAttribute;
    });
    const relId = reference === null || reference === void 0 ? void 0 : (_attributes = reference.attributes) === null || _attributes === void 0 ? void 0 : _attributes['r:id'];
    if (!relId) return null; // return the XmlPart

    const rels = await this.mainDocument.rels.list();
    const relTarget = rels.find(r => r.id === relId).target;

    if (!this._parts[relTarget]) {
      const part = new XmlPart("word/" + relTarget, this.zip, this.xmlParser);
      this._parts[relTarget] = part;
    }

    return this._parts[relTarget];
  }

  headerFooterNodeName(contentPartType) {
    switch (contentPartType) {
      case ContentPartType.DefaultHeader:
      case ContentPartType.FirstHeader:
      case ContentPartType.EvenPagesHeader:
        return 'w:headerReference';

      case ContentPartType.DefaultFooter:
      case ContentPartType.FirstFooter:
      case ContentPartType.EvenPagesFooter:
        return 'w:footerReference';

      default:
        throw new Error(`Invalid content part type: '${contentPartType}'.`);
    }
  }

  headerFooterType(contentPartType) {
    // https://docs.microsoft.com/en-us/dotnet/api/documentformat.openxml.wordprocessing.headerfootervalues?view=openxml-2.8.1
    switch (contentPartType) {
      case ContentPartType.DefaultHeader:
      case ContentPartType.DefaultFooter:
        return 'default';

      case ContentPartType.FirstHeader:
      case ContentPartType.FirstFooter:
        return 'first';

      case ContentPartType.EvenPagesHeader:
      case ContentPartType.EvenPagesFooter:
        return 'even';

      default:
        throw new Error(`Invalid content part type: '${contentPartType}'.`);
    }
  }

  async saveChanges() {
    const parts = [this.mainDocument, ...Object.values(this._parts)];

    for (const part of parts) {
      await part.saveChanges();
    }

    await this.contentTypes.save();
  }

}

_defineProperty(Docx, "mainDocumentRelType", 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument');

class DocxParser {
  /*
   * Word markup intro:
   *
   * In Word text nodes are contained in "run" nodes (which specifies text
   * properties such as font and color). The "run" nodes in turn are
   * contained in paragraph nodes which is the core unit of content.
   *
   * Example:
   *
   * <w:p>    <-- paragraph
   *   <w:r>      <-- run
   *     <w:rPr>      <-- run properties
   *       <w:b/>     <-- bold
   *     </w:rPr>
   *     <w:t>This is text.</w:t>     <-- actual text
   *   </w:r>
   * </w:p>
   *
   * see: http://officeopenxml.com/WPcontentOverview.php
   */
  //
  // constructor
  //
  constructor(xmlParser) {
    this.xmlParser = xmlParser;
  } //
  // parse document
  //


  load(zip) {
    return Docx.open(zip, this.xmlParser);
  } //
  // content manipulation
  //

  /**
   * Split the text node into two text nodes, each with it's own wrapping <w:t> node.
   * Returns the newly created text node.
   *
   * @param textNode
   * @param splitIndex
   * @param addBefore Should the new node be added before or after the original node.
   */


  splitTextNode(textNode, splitIndex, addBefore) {
    let firstXmlTextNode;
    let secondXmlTextNode; // split nodes

    const wordTextNode = this.containingTextNode(textNode);
    const newWordTextNode = XmlNode.cloneNode(wordTextNode, true); // set space preserve to prevent display differences after splitting
    // (otherwise if there was a space in the middle of the text node and it
    // is now at the beginning or end of the text node it will be ignored)

    this.setSpacePreserveAttribute(wordTextNode);
    this.setSpacePreserveAttribute(newWordTextNode);

    if (addBefore) {
      // insert new node before existing one
      XmlNode.insertBefore(newWordTextNode, wordTextNode);
      firstXmlTextNode = XmlNode.lastTextChild(newWordTextNode);
      secondXmlTextNode = textNode;
    } else {
      // insert new node after existing one
      const curIndex = wordTextNode.parentNode.childNodes.indexOf(wordTextNode);
      XmlNode.insertChild(wordTextNode.parentNode, newWordTextNode, curIndex + 1);
      firstXmlTextNode = textNode;
      secondXmlTextNode = XmlNode.lastTextChild(newWordTextNode);
    } // edit text


    const firstText = firstXmlTextNode.textContent;
    const secondText = secondXmlTextNode.textContent;
    firstXmlTextNode.textContent = firstText.substring(0, splitIndex);
    secondXmlTextNode.textContent = secondText.substring(splitIndex);
    return addBefore ? firstXmlTextNode : secondXmlTextNode;
  }
  /**
   * Split the paragraph around the specified text node.
   *
   * @returns Two paragraphs - `left` and `right`. If the `removeTextNode` argument is
   * `false` then the original text node is the first text node of `right`.
   */


  splitParagraphByTextNode(paragraph, textNode, removeTextNode) {
    // input validation
    const containingParagraph = this.containingParagraphNode(textNode);
    if (containingParagraph != paragraph) throw new Error(`Node '${"textNode"}' is not a descendant of '${"paragraph"}'.`);
    const runNode = this.containingRunNode(textNode);
    const wordTextNode = this.containingTextNode(textNode); // create run clone

    const leftRun = XmlNode.cloneNode(runNode, false);
    const rightRun = runNode;
    XmlNode.insertBefore(leftRun, rightRun); // copy props from original run node (preserve style)

    const runProps = rightRun.childNodes.find(node => node.nodeName === DocxParser.RUN_PROPERTIES_NODE);

    if (runProps) {
      const leftRunProps = XmlNode.cloneNode(runProps, true);
      XmlNode.appendChild(leftRun, leftRunProps);
    } // move nodes from 'right' to 'left'


    const firstRunChildIndex = runProps ? 1 : 0;
    let curChild = rightRun.childNodes[firstRunChildIndex];

    while (curChild != wordTextNode) {
      XmlNode.remove(curChild);
      XmlNode.appendChild(leftRun, curChild);
      curChild = rightRun.childNodes[firstRunChildIndex];
    } // remove text node


    if (removeTextNode) {
      XmlNode.removeChild(rightRun, firstRunChildIndex);
    } // create paragraph clone


    const leftPara = XmlNode.cloneNode(containingParagraph, false);
    const rightPara = containingParagraph;
    XmlNode.insertBefore(leftPara, rightPara); // copy props from original paragraph (preserve style)

    const paragraphProps = rightPara.childNodes.find(node => node.nodeName === DocxParser.PARAGRAPH_PROPERTIES_NODE);

    if (paragraphProps) {
      const leftParagraphProps = XmlNode.cloneNode(paragraphProps, true);
      XmlNode.appendChild(leftPara, leftParagraphProps);
    } // move nodes from 'right' to 'left'


    const firstParaChildIndex = paragraphProps ? 1 : 0;
    curChild = rightPara.childNodes[firstParaChildIndex];

    while (curChild != rightRun) {
      XmlNode.remove(curChild);
      XmlNode.appendChild(leftPara, curChild);
      curChild = rightPara.childNodes[firstParaChildIndex];
    } // clean paragraphs - remove empty runs


    if (this.isEmptyRun(leftRun)) XmlNode.remove(leftRun);
    if (this.isEmptyRun(rightRun)) XmlNode.remove(rightRun);
    return [leftPara, rightPara];
  }
  /**
   * Move all text between the 'from' and 'to' nodes to the 'from' node.
   */


  joinTextNodesRange(from, to) {
    // find run nodes
    const firstRunNode = this.containingRunNode(from);
    const secondRunNode = this.containingRunNode(to);
    const paragraphNode = firstRunNode.parentNode;
    if (secondRunNode.parentNode !== paragraphNode) throw new Error('Can not join text nodes from separate paragraphs.'); // find "word text nodes"

    const firstWordTextNode = this.containingTextNode(from);
    const secondWordTextNode = this.containingTextNode(to);
    const totalText = []; // iterate runs

    let curRunNode = firstRunNode;

    while (curRunNode) {
      // iterate text nodes
      let curWordTextNode;

      if (curRunNode === firstRunNode) {
        curWordTextNode = firstWordTextNode;
      } else {
        curWordTextNode = this.firstTextNodeChild(curRunNode);
      }

      while (curWordTextNode) {
        if (curWordTextNode.nodeName !== DocxParser.TEXT_NODE) continue; // move text to first node

        const curXmlTextNode = XmlNode.lastTextChild(curWordTextNode);
        totalText.push(curXmlTextNode.textContent); // next text node

        const textToRemove = curWordTextNode;

        if (curWordTextNode === secondWordTextNode) {
          curWordTextNode = null;
        } else {
          curWordTextNode = curWordTextNode.nextSibling;
        } // remove current text node


        if (textToRemove !== firstWordTextNode) {
          XmlNode.remove(textToRemove);
        }
      } // next run


      const runToRemove = curRunNode;

      if (curRunNode === secondRunNode) {
        curRunNode = null;
      } else {
        curRunNode = curRunNode.nextSibling;
      } // remove current run


      if (!runToRemove.childNodes || !runToRemove.childNodes.length) {
        XmlNode.remove(runToRemove);
      }
    } // set the text content


    const firstXmlTextNode = XmlNode.lastTextChild(firstWordTextNode);
    firstXmlTextNode.textContent = totalText.join('');
  }
  /**
   * Take all runs from 'second' and move them to 'first'.
   */


  joinParagraphs(first, second) {
    if (first === second) return;
    let childIndex = 0;

    while (second.childNodes && childIndex < second.childNodes.length) {
      const curChild = second.childNodes[childIndex];

      if (curChild.nodeName === DocxParser.RUN_NODE) {
        XmlNode.removeChild(second, childIndex);
        XmlNode.appendChild(first, curChild);
      } else {
        childIndex++;
      }
    }
  }

  setSpacePreserveAttribute(node) {
    if (!node.attributes) {
      node.attributes = {};
    }

    if (!node.attributes['xml:space']) {
      node.attributes['xml:space'] = 'preserve';
    }
  } //
  // node queries
  //


  isTextNode(node) {
    return node.nodeName === DocxParser.TEXT_NODE;
  }

  isRunNode(node) {
    return node.nodeName === DocxParser.RUN_NODE;
  }

  isRunPropertiesNode(node) {
    return node.nodeName === DocxParser.RUN_PROPERTIES_NODE;
  }

  isTableCellNode(node) {
    return node.nodeName === DocxParser.TABLE_CELL_NODE;
  }

  isParagraphNode(node) {
    return node.nodeName === DocxParser.PARAGRAPH_NODE;
  }

  isListParagraph(paragraphNode) {
    const paragraphProperties = this.paragraphPropertiesNode(paragraphNode);
    const listNumberProperties = XmlNode.findChildByName(paragraphProperties, DocxParser.NUMBER_PROPERTIES_NODE);
    return !!listNumberProperties;
  }

  paragraphPropertiesNode(paragraphNode) {
    if (!this.isParagraphNode(paragraphNode)) throw new Error(`Expected paragraph node but received a '${paragraphNode.nodeName}' node.`);
    return XmlNode.findChildByName(paragraphNode, DocxParser.PARAGRAPH_PROPERTIES_NODE);
  }
  /**
   * Search for the first direct child **Word** text node (i.e. a <w:t> node).
   */


  firstTextNodeChild(node) {
    if (!node) return null;
    if (node.nodeName !== DocxParser.RUN_NODE) return null;
    if (!node.childNodes) return null;

    for (const child of node.childNodes) {
      if (child.nodeName === DocxParser.TEXT_NODE) return child;
    }

    return null;
  }
  /**
   * Search **upwards** for the first **Word** text node (i.e. a <w:t> node).
   */


  containingTextNode(node) {
    if (!node) return null;
    if (!XmlNode.isTextNode(node)) throw new Error(`'Invalid argument ${"node"}. Expected a XmlTextNode.`);
    return XmlNode.findParentByName(node, DocxParser.TEXT_NODE);
  }
  /**
   * Search **upwards** for the first run node.
   */


  containingRunNode(node) {
    return XmlNode.findParentByName(node, DocxParser.RUN_NODE);
  }
  /**
   * Search **upwards** for the first paragraph node.
   */


  containingParagraphNode(node) {
    return XmlNode.findParentByName(node, DocxParser.PARAGRAPH_NODE);
  }
  /**
   * Search **upwards** for the first "table row" node.
   */


  containingTableRowNode(node) {
    return XmlNode.findParentByName(node, DocxParser.TABLE_ROW_NODE);
  } //
  // advanced node queries
  //


  isEmptyTextNode(node) {
    var _node$childNodes;

    if (!this.isTextNode(node)) throw new Error(`Text node expected but '${node.nodeName}' received.`);
    if (!((_node$childNodes = node.childNodes) !== null && _node$childNodes !== void 0 && _node$childNodes.length)) return true;
    const xmlTextNode = node.childNodes[0];
    if (!XmlNode.isTextNode(xmlTextNode)) throw new Error("Invalid XML structure. 'w:t' node should contain a single text node only.");
    if (!xmlTextNode.textContent) return true;
    return false;
  }

  isEmptyRun(node) {
    if (!this.isRunNode(node)) throw new Error(`Run node expected but '${node.nodeName}' received.`);

    for (const child of (_node$childNodes2 = node.childNodes) !== null && _node$childNodes2 !== void 0 ? _node$childNodes2 : []) {
      var _node$childNodes2;

      if (this.isRunPropertiesNode(child)) continue;
      if (this.isTextNode(child) && this.isEmptyTextNode(child)) continue;
      return false;
    }

    return true;
  }

}

_defineProperty(DocxParser, "PARAGRAPH_NODE", 'w:p');

_defineProperty(DocxParser, "PARAGRAPH_PROPERTIES_NODE", 'w:pPr');

_defineProperty(DocxParser, "RUN_NODE", 'w:r');

_defineProperty(DocxParser, "RUN_PROPERTIES_NODE", 'w:rPr');

_defineProperty(DocxParser, "TEXT_NODE", 'w:t');

_defineProperty(DocxParser, "TABLE_ROW_NODE", 'w:tr');

_defineProperty(DocxParser, "TABLE_CELL_NODE", 'w:tc');

_defineProperty(DocxParser, "NUMBER_PROPERTIES_NODE", 'w:numPr');

class LinkPlugin extends TemplatePlugin {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "contentType", 'link');
  }

  async simpleTagReplacements(tag, data, context) {
    const wordTextNode = this.utilities.docxParser.containingTextNode(tag.xmlTextNode);
    const content = data.getScopeData();

    if (!content || !content.target) {
      XmlNode.remove(wordTextNode);
      return;
    } // add rel


    const relId = await context.currentPart.rels.add(content.target, LinkPlugin.linkRelType, 'External'); // generate markup

    const wordRunNode = this.utilities.docxParser.containingRunNode(wordTextNode);
    const linkMarkup = this.generateMarkup(content, relId, wordRunNode); // add to document

    this.insertHyperlinkNode(linkMarkup, wordRunNode, wordTextNode);
  }

  generateMarkup(content, relId, wordRunNode) {
    // http://officeopenxml.com/WPhyperlink.php
    const markupText = `
            <w:hyperlink r:id="${relId}" w:history="1">
                <w:r>
                    <w:t>${content.text || content.target}</w:t>
                </w:r>
            </w:hyperlink>
        `;
    const markupXml = this.utilities.xmlParser.parse(markupText);
    XmlNode.removeEmptyTextNodes(markupXml); // remove whitespace
    // copy props from original run node (preserve style)

    const runProps = wordRunNode.childNodes.find(node => node.nodeName === DocxParser.RUN_PROPERTIES_NODE);

    if (runProps) {
      const linkRunProps = XmlNode.cloneNode(runProps, true);
      markupXml.childNodes[0].childNodes.unshift(linkRunProps);
    }

    return markupXml;
  }

  insertHyperlinkNode(linkMarkup, tagRunNode, tagTextNode) {
    // Links are inserted at the 'run' level.
    // Therefor we isolate the link tag to it's own run (it is already
    // isolated to it's own text node), insert the link markup and remove
    // the run.
    let textNodesInRun = tagRunNode.childNodes.filter(node => node.nodeName === DocxParser.TEXT_NODE);

    if (textNodesInRun.length > 1) {
      const [runBeforeTag] = XmlNode.splitByChild(tagRunNode, tagTextNode, true);
      textNodesInRun = runBeforeTag.childNodes.filter(node => node.nodeName === DocxParser.TEXT_NODE);
      XmlNode.insertAfter(linkMarkup, runBeforeTag);

      if (textNodesInRun.length === 0) {
        XmlNode.remove(runBeforeTag);
      }
    } // already isolated
    else {
      XmlNode.insertAfter(linkMarkup, tagRunNode);
      XmlNode.remove(tagRunNode);
    }
  }

}

_defineProperty(LinkPlugin, "linkRelType", 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink');

class LoopListStrategy {
  constructor() {
    _defineProperty(this, "utilities", void 0);
  }

  setUtilities(utilities) {
    this.utilities = utilities;
  }

  isApplicable(openTag, closeTag) {
    const containingParagraph = this.utilities.docxParser.containingParagraphNode(openTag.xmlTextNode);
    return this.utilities.docxParser.isListParagraph(containingParagraph);
  }

  splitBefore(openTag, closeTag) {
    const firstParagraph = this.utilities.docxParser.containingParagraphNode(openTag.xmlTextNode);
    const lastParagraph = this.utilities.docxParser.containingParagraphNode(closeTag.xmlTextNode);
    const paragraphsToRepeat = XmlNode.siblingsInRange(firstParagraph, lastParagraph); // remove the loop tags

    XmlNode.remove(openTag.xmlTextNode);
    XmlNode.remove(closeTag.xmlTextNode);
    return {
      firstNode: firstParagraph,
      nodesToRepeat: paragraphsToRepeat,
      lastNode: lastParagraph
    };
  }

  mergeBack(paragraphGroups, firstParagraph, lastParagraphs) {
    for (const curParagraphsGroup of paragraphGroups) {
      for (const paragraph of curParagraphsGroup) {
        XmlNode.insertBefore(paragraph, lastParagraphs);
      }
    } // remove the old paragraphs


    XmlNode.remove(firstParagraph);

    if (firstParagraph !== lastParagraphs) {
      XmlNode.remove(lastParagraphs);
    }
  }

}

class LoopParagraphStrategy {
  constructor() {
    _defineProperty(this, "utilities", void 0);
  }

  setUtilities(utilities) {
    this.utilities = utilities;
  }

  isApplicable(openTag, closeTag) {
    return true;
  }

  splitBefore(openTag, closeTag) {
    // gather some info
    let firstParagraph = this.utilities.docxParser.containingParagraphNode(openTag.xmlTextNode);
    let lastParagraph = this.utilities.docxParser.containingParagraphNode(closeTag.xmlTextNode);
    const areSame = firstParagraph === lastParagraph; // split first paragraph

    let splitResult = this.utilities.docxParser.splitParagraphByTextNode(firstParagraph, openTag.xmlTextNode, true);
    firstParagraph = splitResult[0];
    let afterFirstParagraph = splitResult[1];
    if (areSame) lastParagraph = afterFirstParagraph; // split last paragraph

    splitResult = this.utilities.docxParser.splitParagraphByTextNode(lastParagraph, closeTag.xmlTextNode, true);
    const beforeLastParagraph = splitResult[0];
    lastParagraph = splitResult[1];
    if (areSame) afterFirstParagraph = beforeLastParagraph; // disconnect splitted paragraph from their parents

    XmlNode.remove(afterFirstParagraph);
    if (!areSame) XmlNode.remove(beforeLastParagraph); // extract all paragraphs in between

    let middleParagraphs;

    if (areSame) {
      middleParagraphs = [afterFirstParagraph];
    } else {
      const inBetween = XmlNode.removeSiblings(firstParagraph, lastParagraph);
      middleParagraphs = [afterFirstParagraph].concat(inBetween).concat(beforeLastParagraph);
    }

    return {
      firstNode: firstParagraph,
      nodesToRepeat: middleParagraphs,
      lastNode: lastParagraph
    };
  }

  mergeBack(middleParagraphs, firstParagraph, lastParagraph) {
    let mergeTo = firstParagraph;

    for (const curParagraphsGroup of middleParagraphs) {
      // merge first paragraphs
      this.utilities.docxParser.joinParagraphs(mergeTo, curParagraphsGroup[0]); // add middle and last paragraphs to the original document

      for (let i = 1; i < curParagraphsGroup.length; i++) {
        XmlNode.insertBefore(curParagraphsGroup[i], lastParagraph);
        mergeTo = curParagraphsGroup[i];
      }
    } // merge last paragraph


    this.utilities.docxParser.joinParagraphs(mergeTo, lastParagraph); // remove the old last paragraph (was merged into the new one)

    XmlNode.remove(lastParagraph);
  }

}

class LoopTableStrategy {
  constructor() {
    _defineProperty(this, "utilities", void 0);
  }

  setUtilities(utilities) {
    this.utilities = utilities;
  }

  isApplicable(openTag, closeTag) {
    const containingParagraph = this.utilities.docxParser.containingParagraphNode(openTag.xmlTextNode);
    if (!containingParagraph.parentNode) return false;
    return this.utilities.docxParser.isTableCellNode(containingParagraph.parentNode);
  }

  splitBefore(openTag, closeTag) {
    const firstRow = this.utilities.docxParser.containingTableRowNode(openTag.xmlTextNode);
    const lastRow = this.utilities.docxParser.containingTableRowNode(closeTag.xmlTextNode);
    const rowsToRepeat = XmlNode.siblingsInRange(firstRow, lastRow); // remove the loop tags

    XmlNode.remove(openTag.xmlTextNode);
    XmlNode.remove(closeTag.xmlTextNode);
    return {
      firstNode: firstRow,
      nodesToRepeat: rowsToRepeat,
      lastNode: lastRow
    };
  }

  mergeBack(rowGroups, firstRow, lastRow) {
    for (const curRowsGroup of rowGroups) {
      for (const row of curRowsGroup) {
        XmlNode.insertBefore(row, lastRow);
      }
    } // remove the old rows


    XmlNode.remove(firstRow);

    if (firstRow !== lastRow) {
      XmlNode.remove(lastRow);
    }
  }

}

const LOOP_CONTENT_TYPE = 'loop';
class LoopPlugin extends TemplatePlugin {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "contentType", LOOP_CONTENT_TYPE);

    _defineProperty(this, "loopStrategies", [new LoopTableStrategy(), new LoopListStrategy(), new LoopParagraphStrategy() // the default strategy
    ]);
  }

  setUtilities(utilities) {
    this.utilities = utilities;
    this.loopStrategies.forEach(strategy => strategy.setUtilities(utilities));
  }

  async containerTagReplacements(tags, data, context) {
    let value = data.getScopeData(); // Non array value - treat as a boolean condition.

    const isCondition = !Array.isArray(value);

    if (isCondition) {
      if (!!value) {
        value = [{}];
      } else {
        value = [];
      }
    } // vars


    const openTag = tags[0];
    const closeTag = last(tags); // select the suitable strategy

    const loopStrategy = this.loopStrategies.find(strategy => strategy.isApplicable(openTag, closeTag));
    if (!loopStrategy) throw new Error(`No loop strategy found for tag '${openTag.rawText}'.`); // prepare to loop

    const {
      firstNode,
      nodesToRepeat,
      lastNode
    } = loopStrategy.splitBefore(openTag, closeTag); // repeat (loop) the content

    const repeatedNodes = this.repeat(nodesToRepeat, value.length); // recursive compilation
    // (this step can be optimized in the future if we'll keep track of the
    // path to each token and use that to create new tokens instead of
    // search through the text again)

    const compiledNodes = await this.compile(isCondition, repeatedNodes, data, context); // merge back to the document

    loopStrategy.mergeBack(compiledNodes, firstNode, lastNode);
  }

  repeat(nodes, times) {
    if (!nodes.length || !times) return [];
    const allResults = [];

    for (let i = 0; i < times; i++) {
      const curResult = nodes.map(node => XmlNode.cloneNode(node, true));
      allResults.push(curResult);
    }

    return allResults;
  }

  async compile(isCondition, nodeGroups, data, context) {
    const compiledNodeGroups = []; // compile each node group with it's relevant data

    for (let i = 0; i < nodeGroups.length; i++) {
      // create dummy root node
      const curNodes = nodeGroups[i];
      const dummyRootNode = XmlNode.createGeneralNode('dummyRootNode');
      curNodes.forEach(node => XmlNode.appendChild(dummyRootNode, node)); // compile the new root

      const conditionTag = this.updatePathBefore(isCondition, data, i);
      await this.utilities.compiler.compile(dummyRootNode, data, context);
      this.updatePathAfter(isCondition, data, conditionTag); // disconnect from dummy root

      const curResult = [];

      while (dummyRootNode.childNodes && dummyRootNode.childNodes.length) {
        const child = XmlNode.removeChild(dummyRootNode, 0);
        curResult.push(child);
      }

      compiledNodeGroups.push(curResult);
    }

    return compiledNodeGroups;
  }

  updatePathBefore(isCondition, data, groupIndex) {
    // if it's a condition - don't go deeper in the path
    // (so we need to extract the already pushed condition tag)
    if (isCondition) {
      if (groupIndex > 0) {
        // should never happen - conditions should have at most one (synthetic) child...
        throw new Error(`Internal error: Unexpected group index ${groupIndex} for boolean condition at path "${data.pathString()}".`);
      }

      return data.pathPop();
    } // else, it's an array - push the current index


    data.pathPush(groupIndex);
    return null;
  }

  updatePathAfter(isCondition, data, conditionTag) {
    // reverse the "before" path operation
    if (isCondition) {
      data.pathPush(conditionTag);
    } else {
      data.pathPop();
    }
  }

}

class RawXmlPlugin extends TemplatePlugin {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "contentType", 'rawXml');
  }

  simpleTagReplacements(tag, data) {
    const value = data.getScopeData();
    const replaceNode = value !== null && value !== void 0 && value.replaceParagraph ? this.utilities.docxParser.containingParagraphNode(tag.xmlTextNode) : this.utilities.docxParser.containingTextNode(tag.xmlTextNode);

    if (typeof (value === null || value === void 0 ? void 0 : value.xml) === 'string') {
      const newNode = this.utilities.xmlParser.parse(value.xml);
      XmlNode.insertBefore(newNode, replaceNode);
    }

    XmlNode.remove(replaceNode);
  }

}

const TEXT_CONTENT_TYPE = 'text';
class TextPlugin extends TemplatePlugin {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "contentType", TEXT_CONTENT_TYPE);
  }

  /**
   * Replace the node text content with the specified value.
   */
  simpleTagReplacements(tag, data) {
    const value = data.getScopeData();
    const lines = stringValue(value).split('\n');

    if (lines.length < 2) {
      this.replaceSingleLine(tag.xmlTextNode, lines.length ? lines[0] : '');
    } else {
      this.replaceMultiLine(tag.xmlTextNode, lines);
    }
  }

  replaceSingleLine(textNode, text) {
    // set text
    textNode.textContent = text; // make sure leading and trailing whitespace are preserved

    const wordTextNode = this.utilities.docxParser.containingTextNode(textNode);
    this.utilities.docxParser.setSpacePreserveAttribute(wordTextNode);
  }

  replaceMultiLine(textNode, lines) {
    const runNode = this.utilities.docxParser.containingRunNode(textNode); // first line

    textNode.textContent = lines[0]; // other lines

    for (let i = 1; i < lines.length; i++) {
      // add line break
      const lineBreak = this.getLineBreak();
      XmlNode.appendChild(runNode, lineBreak); // add text

      const lineNode = this.createWordTextNode(lines[i]);
      XmlNode.appendChild(runNode, lineNode);
    }
  }

  getLineBreak() {
    return XmlNode.createGeneralNode('w:br');
  }

  createWordTextNode(text) {
    const wordTextNode = XmlNode.createGeneralNode(DocxParser.TEXT_NODE);
    wordTextNode.attributes = {};
    this.utilities.docxParser.setSpacePreserveAttribute(wordTextNode);
    wordTextNode.childNodes = [XmlNode.createTextNode(text)];
    return wordTextNode;
  }

}

function createDefaultPlugins() {
  return [new LoopPlugin(), new RawXmlPlugin(), new ImagePlugin(), new LinkPlugin(), new TextPlugin()];
}

const PluginContent = {
  isPluginContent(content) {
    return !!content && typeof content._type === 'string';
  }

};

/**
 * The TemplateCompiler works roughly the same way as a source code compiler.
 * It's main steps are:
 *
 * 1. find delimiters (lexical analysis) :: (Document) => DelimiterMark[]
 * 2. extract tags (syntax analysis) :: (DelimiterMark[]) => Tag[]
 * 3. perform document replace (code generation) :: (Tag[], data) => Document*
 *
 * see: https://en.wikipedia.org/wiki/Compiler
 */
class TemplateCompiler {
  constructor(delimiterSearcher, tagParser, plugins, options) {
    this.delimiterSearcher = delimiterSearcher;
    this.tagParser = tagParser;
    this.options = options;

    _defineProperty(this, "pluginsLookup", void 0);

    this.pluginsLookup = toDictionary(plugins, p => p.contentType);
  }
  /**
   * Compiles the template and performs the required replacements using the
   * specified data.
   */


  async compile(node, data, context) {
    const tags = this.parseTags(node);
    await this.doTagReplacements(tags, data, context);
  }

  parseTags(node) {
    const delimiters = this.delimiterSearcher.findDelimiters(node);
    const tags = this.tagParser.parse(delimiters);
    return tags;
  } //
  // private methods
  //


  async doTagReplacements(tags, data, context) {
    for (let tagIndex = 0; tagIndex < tags.length; tagIndex++) {
      const tag = tags[tagIndex];
      data.pathPush(tag);
      const contentType = this.detectContentType(tag, data);
      const plugin = this.pluginsLookup[contentType];

      if (!plugin) {
        throw new UnknownContentTypeError(contentType, tag.rawText, data.pathString());
      }

      if (tag.disposition === TagDisposition.SelfClosed) {
        await this.simpleTagReplacements(plugin, tag, data, context);
      } else if (tag.disposition === TagDisposition.Open) {
        // get all tags between the open and close tags
        const closingTagIndex = this.findCloseTagIndex(tagIndex, tag, tags);
        const scopeTags = tags.slice(tagIndex, closingTagIndex + 1);
        tagIndex = closingTagIndex; // replace container tag

        const job = plugin.containerTagReplacements(scopeTags, data, context);

        if (isPromiseLike(job)) {
          await job;
        }
      }

      data.pathPop();
    }
  }

  detectContentType(tag, data) {
    // explicit content type
    const scopeData = data.getScopeData();
    if (PluginContent.isPluginContent(scopeData)) return scopeData._type; // implicit - loop

    if (tag.disposition === TagDisposition.Open || tag.disposition === TagDisposition.Close) return this.options.containerContentType; // implicit - text

    return this.options.defaultContentType;
  }

  async simpleTagReplacements(plugin, tag, data, context) {
    if (this.options.skipEmptyTags && stringValue(data.getScopeData()) === '') {
      return;
    }

    const job = plugin.simpleTagReplacements(tag, data, context);

    if (isPromiseLike(job)) {
      await job;
    }
  }

  findCloseTagIndex(fromIndex, openTag, tags) {
    let openTags = 0;
    let i = fromIndex;

    for (; i < tags.length; i++) {
      const tag = tags[i];

      if (tag.disposition === TagDisposition.Open) {
        openTags++;
        continue;
      }

      if (tag.disposition == TagDisposition.Close) {
        openTags--;

        if (openTags === 0) {
          return i;
        }

        if (openTags < 0) {
          // As long as we don't change the input to
          // this method (fromIndex in particular) this
          // should never happen.
          throw new UnopenedTagError(tag.name);
        }

        continue;
      }
    }

    if (i === tags.length) {
      throw new UnclosedTagError(openTag.name);
    }

    return i;
  }

}

class TemplateExtension {
  constructor() {
    _defineProperty(this, "utilities", void 0);
  }

  /**
   * Called by the TemplateHandler at runtime.
   */
  setUtilities(utilities) {
    this.utilities = utilities;
  }

}

class JsZipHelper {
  static toJsZipOutputType(binaryOrType) {
    if (!binaryOrType) throw new MissingArgumentError("binaryOrType");
    let binaryType;

    if (typeof binaryOrType === 'function') {
      binaryType = binaryOrType;
    } else {
      binaryType = binaryOrType.constructor;
    }

    if (Binary.isBlobConstructor(binaryType)) return 'blob';
    if (Binary.isArrayBufferConstructor(binaryType)) return 'arraybuffer';
    if (Binary.isBufferConstructor(binaryType)) return 'nodebuffer';
    throw new Error(`Binary type '${binaryType.name}' is not supported.`);
  }

}

class ZipObject {
  get name() {
    return this.zipObject.name;
  }

  set name(value) {
    this.zipObject.name = value;
  }

  get isDirectory() {
    return this.zipObject.dir;
  }

  constructor(zipObject) {
    this.zipObject = zipObject;
  }

  getContentText() {
    return this.zipObject.async('text');
  }

  getContentBase64() {
    return this.zipObject.async('binarystring');
  }

  getContentBinary(outputType) {
    const zipOutputType = JsZipHelper.toJsZipOutputType(outputType);
    return this.zipObject.async(zipOutputType);
  }

}

class Zip {
  static async load(file) {
    const zip = await jszip__WEBPACK_IMPORTED_MODULE_2__.loadAsync(file);
    return new Zip(zip);
  }

  constructor(zip) {
    this.zip = zip;
  }

  getFile(path) {
    const internalZipObject = this.zip.files[path];
    if (!internalZipObject) return null;
    return new ZipObject(internalZipObject);
  }

  setFile(path, content) {
    this.zip.file(path, content);
  }

  isFileExist(path) {
    return !!this.zip.files[path];
  }

  listFiles() {
    return Object.keys(this.zip.files);
  }

  async export(outputType) {
    const zipOutputType = JsZipHelper.toJsZipOutputType(outputType);
    const output = await this.zip.generateAsync({
      type: zipOutputType,
      compression: "DEFLATE",
      compressionOptions: {
        level: 6 // between 1 (best speed) and 9 (best compression)

      }
    });
    return output;
  }

}

class Delimiters {
  constructor(initial) {
    _defineProperty(this, "tagStart", "{");

    _defineProperty(this, "tagEnd", "}");

    _defineProperty(this, "containerTagOpen", "#");

    _defineProperty(this, "containerTagClose", "/");

    Object.assign(this, initial);
    this.encodeAndValidate();
    if (this.containerTagOpen === this.containerTagClose) throw new Error(`${"containerTagOpen"} can not be equal to ${"containerTagClose"}`);
  }

  encodeAndValidate() {
    const keys = ['tagStart', 'tagEnd', 'containerTagOpen', 'containerTagClose'];

    for (const key of keys) {
      const value = this[key];
      if (!value) throw new Error(`${key} can not be empty.`);
      if (value !== value.trim()) throw new Error(`${key} can not contain leading or trailing whitespace.`);
    }
  }

}

class TemplateHandlerOptions {
  /**
   * Determines the behavior in case of an empty input data. If set to true
   * the tag will be left untouched, if set to false the tag will be replaced
   * by an empty string.
   *
   * Default: false
   */
  constructor(initial) {
    _defineProperty(this, "plugins", createDefaultPlugins());

    _defineProperty(this, "skipEmptyTags", false);

    _defineProperty(this, "defaultContentType", TEXT_CONTENT_TYPE);

    _defineProperty(this, "containerContentType", LOOP_CONTENT_TYPE);

    _defineProperty(this, "delimiters", new Delimiters());

    _defineProperty(this, "maxXmlDepth", 20);

    _defineProperty(this, "extensions", {});

    _defineProperty(this, "scopeDataResolver", void 0);

    Object.assign(this, initial);

    if (initial) {
      this.delimiters = new Delimiters(initial.delimiters);
    }

    if (!this.plugins.length) {
      throw new Error('Plugins list can not be empty');
    }
  }

}

class TemplateHandler {
  /**
   * Version number of the `easy-template-x` library.
   */
  constructor(options) {
    var _this$options$extensi, _this$options$extensi2, _this$options$extensi3, _this$options$extensi4;

    _defineProperty(this, "version", "3.0.4" );

    _defineProperty(this, "xmlParser", new XmlParser());

    _defineProperty(this, "docxParser", void 0);

    _defineProperty(this, "compiler", void 0);

    _defineProperty(this, "options", void 0);

    this.options = new TemplateHandlerOptions(options); //
    // this is the library's composition root
    //

    this.docxParser = new DocxParser(this.xmlParser);
    const delimiterSearcher = new DelimiterSearcher(this.docxParser);
    delimiterSearcher.startDelimiter = this.options.delimiters.tagStart;
    delimiterSearcher.endDelimiter = this.options.delimiters.tagEnd;
    delimiterSearcher.maxXmlDepth = this.options.maxXmlDepth;
    const tagParser = new TagParser(this.docxParser, this.options.delimiters);
    this.compiler = new TemplateCompiler(delimiterSearcher, tagParser, this.options.plugins, {
      skipEmptyTags: this.options.skipEmptyTags,
      defaultContentType: this.options.defaultContentType,
      containerContentType: this.options.containerContentType
    });
    this.options.plugins.forEach(plugin => {
      plugin.setUtilities({
        xmlParser: this.xmlParser,
        docxParser: this.docxParser,
        compiler: this.compiler
      });
    });
    const extensionUtilities = {
      xmlParser: this.xmlParser,
      docxParser: this.docxParser,
      tagParser,
      compiler: this.compiler
    };
    (_this$options$extensi = this.options.extensions) === null || _this$options$extensi === void 0 ? void 0 : (_this$options$extensi2 = _this$options$extensi.beforeCompilation) === null || _this$options$extensi2 === void 0 ? void 0 : _this$options$extensi2.forEach(extension => {
      extension.setUtilities(extensionUtilities);
    });
    (_this$options$extensi3 = this.options.extensions) === null || _this$options$extensi3 === void 0 ? void 0 : (_this$options$extensi4 = _this$options$extensi3.afterCompilation) === null || _this$options$extensi4 === void 0 ? void 0 : _this$options$extensi4.forEach(extension => {
      extension.setUtilities(extensionUtilities);
    });
  } //
  // public methods
  //


  async process(templateFile, data) {
    // load the docx file
    const docx = await this.loadDocx(templateFile); // prepare context

    const scopeData = new ScopeData(data);
    scopeData.scopeDataResolver = this.options.scopeDataResolver;
    const context = {
      docx,
      currentPart: null
    };
    const contentParts = await docx.getContentParts();

    for (const part of contentParts) {
      var _this$options$extensi5, _this$options$extensi6;

      context.currentPart = part; // extensions - before compilation

      await this.callExtensions((_this$options$extensi5 = this.options.extensions) === null || _this$options$extensi5 === void 0 ? void 0 : _this$options$extensi5.beforeCompilation, scopeData, context); // compilation (do replacements)

      const xmlRoot = await part.xmlRoot();
      await this.compiler.compile(xmlRoot, scopeData, context); // extensions - after compilation

      await this.callExtensions((_this$options$extensi6 = this.options.extensions) === null || _this$options$extensi6 === void 0 ? void 0 : _this$options$extensi6.afterCompilation, scopeData, context);
    } // export the result


    return docx.export(templateFile.constructor);
  }
  /**
   * Get the text content of a single part of the document.
   * If the part does not exists returns null.
   *
   * @param contentPart
   * The content part of which to get it's text content.
   * Defaults to `ContentPartType.MainDocument`.
   */


  async parseTags(templateFile, contentPart = ContentPartType.MainDocument) {
    const docx = await this.loadDocx(templateFile);
    const part = await docx.getContentPart(contentPart);
    const xmlRoot = await part.xmlRoot();
    return this.compiler.parseTags(xmlRoot);
  }
  /**
   * Get the text content of a single part of the document.
   * If the part does not exists returns null.
   *
   * @param contentPart
   * The content part of which to get it's text content.
   * Defaults to `ContentPartType.MainDocument`.
   */


  async getText(docxFile, contentPart = ContentPartType.MainDocument) {
    const docx = await this.loadDocx(docxFile);
    const part = await docx.getContentPart(contentPart);
    const text = await part.getText();
    return text;
  }
  /**
   * Get the xml root of a single part of the document.
   * If the part does not exists returns null.
   *
   * @param contentPart
   * The content part of which to get it's text content.
   * Defaults to `ContentPartType.MainDocument`.
   */


  async getXml(docxFile, contentPart = ContentPartType.MainDocument) {
    const docx = await this.loadDocx(docxFile);
    const part = await docx.getContentPart(contentPart);
    const xmlRoot = await part.xmlRoot();
    return xmlRoot;
  } //
  // private methods
  //


  async callExtensions(extensions, scopeData, context) {
    if (!extensions) return;

    for (const extension of extensions) {
      await extension.execute(scopeData, context);
    }
  }

  async loadDocx(file) {
    // load the zip file
    let zip;

    try {
      zip = await Zip.load(file);
    } catch (_unused) {
      throw new MalformedFileError('docx');
    } // load the docx file


    const docx = await this.docxParser.load(zip);
    return docx;
  }

}




/***/ }),

/***/ "./node_modules/ieee754/index.js":
/*!***************************************!*\
  !*** ./node_modules/ieee754/index.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports) => {

/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),

/***/ "./node_modules/jszip/dist/jszip.min.js":
/*!**********************************************!*\
  !*** ./node_modules/jszip/dist/jszip.min.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* provided dependency */ var Buffer = __webpack_require__(/*! buffer */ "./node_modules/buffer/index.js")["Buffer"];
/*!

JSZip v3.10.1 - A JavaScript class for generating and reading zip files
<http://stuartk.com/jszip>

(c) 2009-2016 Stuart Knightley <stuart [at] stuartk.com>
Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip/main/LICENSE.markdown.

JSZip uses the library pako released under the MIT license :
https://github.com/nodeca/pako/blob/main/LICENSE
*/

!function(e){if(true)module.exports=e();else {}}(function(){return function s(a,o,h){function u(r,e){if(!o[r]){if(!a[r]){var t=undefined;if(!e&&t)return require(r,!0);if(l)return l(r,!0);var n=new Error("Cannot find module '"+r+"'");throw n.code="MODULE_NOT_FOUND",n}var i=o[r]={exports:{}};a[r][0].call(i.exports,function(e){var t=a[r][1][e];return u(t||e)},i,i.exports,s,a,o,h)}return o[r].exports}for(var l=undefined,e=0;e<h.length;e++)u(h[e]);return u}({1:[function(e,t,r){"use strict";var d=e("./utils"),c=e("./support"),p="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";r.encode=function(e){for(var t,r,n,i,s,a,o,h=[],u=0,l=e.length,f=l,c="string"!==d.getTypeOf(e);u<e.length;)f=l-u,n=c?(t=e[u++],r=u<l?e[u++]:0,u<l?e[u++]:0):(t=e.charCodeAt(u++),r=u<l?e.charCodeAt(u++):0,u<l?e.charCodeAt(u++):0),i=t>>2,s=(3&t)<<4|r>>4,a=1<f?(15&r)<<2|n>>6:64,o=2<f?63&n:64,h.push(p.charAt(i)+p.charAt(s)+p.charAt(a)+p.charAt(o));return h.join("")},r.decode=function(e){var t,r,n,i,s,a,o=0,h=0,u="data:";if(e.substr(0,u.length)===u)throw new Error("Invalid base64 input, it looks like a data url.");var l,f=3*(e=e.replace(/[^A-Za-z0-9+/=]/g,"")).length/4;if(e.charAt(e.length-1)===p.charAt(64)&&f--,e.charAt(e.length-2)===p.charAt(64)&&f--,f%1!=0)throw new Error("Invalid base64 input, bad content length.");for(l=c.uint8array?new Uint8Array(0|f):new Array(0|f);o<e.length;)t=p.indexOf(e.charAt(o++))<<2|(i=p.indexOf(e.charAt(o++)))>>4,r=(15&i)<<4|(s=p.indexOf(e.charAt(o++)))>>2,n=(3&s)<<6|(a=p.indexOf(e.charAt(o++))),l[h++]=t,64!==s&&(l[h++]=r),64!==a&&(l[h++]=n);return l}},{"./support":30,"./utils":32}],2:[function(e,t,r){"use strict";var n=e("./external"),i=e("./stream/DataWorker"),s=e("./stream/Crc32Probe"),a=e("./stream/DataLengthProbe");function o(e,t,r,n,i){this.compressedSize=e,this.uncompressedSize=t,this.crc32=r,this.compression=n,this.compressedContent=i}o.prototype={getContentWorker:function(){var e=new i(n.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new a("data_length")),t=this;return e.on("end",function(){if(this.streamInfo.data_length!==t.uncompressedSize)throw new Error("Bug : uncompressed data size mismatch")}),e},getCompressedWorker:function(){return new i(n.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize",this.compressedSize).withStreamInfo("uncompressedSize",this.uncompressedSize).withStreamInfo("crc32",this.crc32).withStreamInfo("compression",this.compression)}},o.createWorkerFrom=function(e,t,r){return e.pipe(new s).pipe(new a("uncompressedSize")).pipe(t.compressWorker(r)).pipe(new a("compressedSize")).withStreamInfo("compression",t)},t.exports=o},{"./external":6,"./stream/Crc32Probe":25,"./stream/DataLengthProbe":26,"./stream/DataWorker":27}],3:[function(e,t,r){"use strict";var n=e("./stream/GenericWorker");r.STORE={magic:"\0\0",compressWorker:function(){return new n("STORE compression")},uncompressWorker:function(){return new n("STORE decompression")}},r.DEFLATE=e("./flate")},{"./flate":7,"./stream/GenericWorker":28}],4:[function(e,t,r){"use strict";var n=e("./utils");var o=function(){for(var e,t=[],r=0;r<256;r++){e=r;for(var n=0;n<8;n++)e=1&e?3988292384^e>>>1:e>>>1;t[r]=e}return t}();t.exports=function(e,t){return void 0!==e&&e.length?"string"!==n.getTypeOf(e)?function(e,t,r,n){var i=o,s=n+r;e^=-1;for(var a=n;a<s;a++)e=e>>>8^i[255&(e^t[a])];return-1^e}(0|t,e,e.length,0):function(e,t,r,n){var i=o,s=n+r;e^=-1;for(var a=n;a<s;a++)e=e>>>8^i[255&(e^t.charCodeAt(a))];return-1^e}(0|t,e,e.length,0):0}},{"./utils":32}],5:[function(e,t,r){"use strict";r.base64=!1,r.binary=!1,r.dir=!1,r.createFolders=!0,r.date=null,r.compression=null,r.compressionOptions=null,r.comment=null,r.unixPermissions=null,r.dosPermissions=null},{}],6:[function(e,t,r){"use strict";var n=null;n="undefined"!=typeof Promise?Promise:e("lie"),t.exports={Promise:n}},{lie:37}],7:[function(e,t,r){"use strict";var n="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Uint32Array,i=e("pako"),s=e("./utils"),a=e("./stream/GenericWorker"),o=n?"uint8array":"array";function h(e,t){a.call(this,"FlateWorker/"+e),this._pako=null,this._pakoAction=e,this._pakoOptions=t,this.meta={}}r.magic="\b\0",s.inherits(h,a),h.prototype.processChunk=function(e){this.meta=e.meta,null===this._pako&&this._createPako(),this._pako.push(s.transformTo(o,e.data),!1)},h.prototype.flush=function(){a.prototype.flush.call(this),null===this._pako&&this._createPako(),this._pako.push([],!0)},h.prototype.cleanUp=function(){a.prototype.cleanUp.call(this),this._pako=null},h.prototype._createPako=function(){this._pako=new i[this._pakoAction]({raw:!0,level:this._pakoOptions.level||-1});var t=this;this._pako.onData=function(e){t.push({data:e,meta:t.meta})}},r.compressWorker=function(e){return new h("Deflate",e)},r.uncompressWorker=function(){return new h("Inflate",{})}},{"./stream/GenericWorker":28,"./utils":32,pako:38}],8:[function(e,t,r){"use strict";function A(e,t){var r,n="";for(r=0;r<t;r++)n+=String.fromCharCode(255&e),e>>>=8;return n}function n(e,t,r,n,i,s){var a,o,h=e.file,u=e.compression,l=s!==O.utf8encode,f=I.transformTo("string",s(h.name)),c=I.transformTo("string",O.utf8encode(h.name)),d=h.comment,p=I.transformTo("string",s(d)),m=I.transformTo("string",O.utf8encode(d)),_=c.length!==h.name.length,g=m.length!==d.length,b="",v="",y="",w=h.dir,k=h.date,x={crc32:0,compressedSize:0,uncompressedSize:0};t&&!r||(x.crc32=e.crc32,x.compressedSize=e.compressedSize,x.uncompressedSize=e.uncompressedSize);var S=0;t&&(S|=8),l||!_&&!g||(S|=2048);var z=0,C=0;w&&(z|=16),"UNIX"===i?(C=798,z|=function(e,t){var r=e;return e||(r=t?16893:33204),(65535&r)<<16}(h.unixPermissions,w)):(C=20,z|=function(e){return 63&(e||0)}(h.dosPermissions)),a=k.getUTCHours(),a<<=6,a|=k.getUTCMinutes(),a<<=5,a|=k.getUTCSeconds()/2,o=k.getUTCFullYear()-1980,o<<=4,o|=k.getUTCMonth()+1,o<<=5,o|=k.getUTCDate(),_&&(v=A(1,1)+A(B(f),4)+c,b+="up"+A(v.length,2)+v),g&&(y=A(1,1)+A(B(p),4)+m,b+="uc"+A(y.length,2)+y);var E="";return E+="\n\0",E+=A(S,2),E+=u.magic,E+=A(a,2),E+=A(o,2),E+=A(x.crc32,4),E+=A(x.compressedSize,4),E+=A(x.uncompressedSize,4),E+=A(f.length,2),E+=A(b.length,2),{fileRecord:R.LOCAL_FILE_HEADER+E+f+b,dirRecord:R.CENTRAL_FILE_HEADER+A(C,2)+E+A(p.length,2)+"\0\0\0\0"+A(z,4)+A(n,4)+f+b+p}}var I=e("../utils"),i=e("../stream/GenericWorker"),O=e("../utf8"),B=e("../crc32"),R=e("../signature");function s(e,t,r,n){i.call(this,"ZipFileWorker"),this.bytesWritten=0,this.zipComment=t,this.zipPlatform=r,this.encodeFileName=n,this.streamFiles=e,this.accumulate=!1,this.contentBuffer=[],this.dirRecords=[],this.currentSourceOffset=0,this.entriesCount=0,this.currentFile=null,this._sources=[]}I.inherits(s,i),s.prototype.push=function(e){var t=e.meta.percent||0,r=this.entriesCount,n=this._sources.length;this.accumulate?this.contentBuffer.push(e):(this.bytesWritten+=e.data.length,i.prototype.push.call(this,{data:e.data,meta:{currentFile:this.currentFile,percent:r?(t+100*(r-n-1))/r:100}}))},s.prototype.openedSource=function(e){this.currentSourceOffset=this.bytesWritten,this.currentFile=e.file.name;var t=this.streamFiles&&!e.file.dir;if(t){var r=n(e,t,!1,this.currentSourceOffset,this.zipPlatform,this.encodeFileName);this.push({data:r.fileRecord,meta:{percent:0}})}else this.accumulate=!0},s.prototype.closedSource=function(e){this.accumulate=!1;var t=this.streamFiles&&!e.file.dir,r=n(e,t,!0,this.currentSourceOffset,this.zipPlatform,this.encodeFileName);if(this.dirRecords.push(r.dirRecord),t)this.push({data:function(e){return R.DATA_DESCRIPTOR+A(e.crc32,4)+A(e.compressedSize,4)+A(e.uncompressedSize,4)}(e),meta:{percent:100}});else for(this.push({data:r.fileRecord,meta:{percent:0}});this.contentBuffer.length;)this.push(this.contentBuffer.shift());this.currentFile=null},s.prototype.flush=function(){for(var e=this.bytesWritten,t=0;t<this.dirRecords.length;t++)this.push({data:this.dirRecords[t],meta:{percent:100}});var r=this.bytesWritten-e,n=function(e,t,r,n,i){var s=I.transformTo("string",i(n));return R.CENTRAL_DIRECTORY_END+"\0\0\0\0"+A(e,2)+A(e,2)+A(t,4)+A(r,4)+A(s.length,2)+s}(this.dirRecords.length,r,e,this.zipComment,this.encodeFileName);this.push({data:n,meta:{percent:100}})},s.prototype.prepareNextSource=function(){this.previous=this._sources.shift(),this.openedSource(this.previous.streamInfo),this.isPaused?this.previous.pause():this.previous.resume()},s.prototype.registerPrevious=function(e){this._sources.push(e);var t=this;return e.on("data",function(e){t.processChunk(e)}),e.on("end",function(){t.closedSource(t.previous.streamInfo),t._sources.length?t.prepareNextSource():t.end()}),e.on("error",function(e){t.error(e)}),this},s.prototype.resume=function(){return!!i.prototype.resume.call(this)&&(!this.previous&&this._sources.length?(this.prepareNextSource(),!0):this.previous||this._sources.length||this.generatedError?void 0:(this.end(),!0))},s.prototype.error=function(e){var t=this._sources;if(!i.prototype.error.call(this,e))return!1;for(var r=0;r<t.length;r++)try{t[r].error(e)}catch(e){}return!0},s.prototype.lock=function(){i.prototype.lock.call(this);for(var e=this._sources,t=0;t<e.length;t++)e[t].lock()},t.exports=s},{"../crc32":4,"../signature":23,"../stream/GenericWorker":28,"../utf8":31,"../utils":32}],9:[function(e,t,r){"use strict";var u=e("../compressions"),n=e("./ZipFileWorker");r.generateWorker=function(e,a,t){var o=new n(a.streamFiles,t,a.platform,a.encodeFileName),h=0;try{e.forEach(function(e,t){h++;var r=function(e,t){var r=e||t,n=u[r];if(!n)throw new Error(r+" is not a valid compression method !");return n}(t.options.compression,a.compression),n=t.options.compressionOptions||a.compressionOptions||{},i=t.dir,s=t.date;t._compressWorker(r,n).withStreamInfo("file",{name:e,dir:i,date:s,comment:t.comment||"",unixPermissions:t.unixPermissions,dosPermissions:t.dosPermissions}).pipe(o)}),o.entriesCount=h}catch(e){o.error(e)}return o}},{"../compressions":3,"./ZipFileWorker":8}],10:[function(e,t,r){"use strict";function n(){if(!(this instanceof n))return new n;if(arguments.length)throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");this.files=Object.create(null),this.comment=null,this.root="",this.clone=function(){var e=new n;for(var t in this)"function"!=typeof this[t]&&(e[t]=this[t]);return e}}(n.prototype=e("./object")).loadAsync=e("./load"),n.support=e("./support"),n.defaults=e("./defaults"),n.version="3.10.1",n.loadAsync=function(e,t){return(new n).loadAsync(e,t)},n.external=e("./external"),t.exports=n},{"./defaults":5,"./external":6,"./load":11,"./object":15,"./support":30}],11:[function(e,t,r){"use strict";var u=e("./utils"),i=e("./external"),n=e("./utf8"),s=e("./zipEntries"),a=e("./stream/Crc32Probe"),l=e("./nodejsUtils");function f(n){return new i.Promise(function(e,t){var r=n.decompressed.getContentWorker().pipe(new a);r.on("error",function(e){t(e)}).on("end",function(){r.streamInfo.crc32!==n.decompressed.crc32?t(new Error("Corrupted zip : CRC32 mismatch")):e()}).resume()})}t.exports=function(e,o){var h=this;return o=u.extend(o||{},{base64:!1,checkCRC32:!1,optimizedBinaryString:!1,createFolders:!1,decodeFileName:n.utf8decode}),l.isNode&&l.isStream(e)?i.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")):u.prepareContent("the loaded zip file",e,!0,o.optimizedBinaryString,o.base64).then(function(e){var t=new s(o);return t.load(e),t}).then(function(e){var t=[i.Promise.resolve(e)],r=e.files;if(o.checkCRC32)for(var n=0;n<r.length;n++)t.push(f(r[n]));return i.Promise.all(t)}).then(function(e){for(var t=e.shift(),r=t.files,n=0;n<r.length;n++){var i=r[n],s=i.fileNameStr,a=u.resolve(i.fileNameStr);h.file(a,i.decompressed,{binary:!0,optimizedBinaryString:!0,date:i.date,dir:i.dir,comment:i.fileCommentStr.length?i.fileCommentStr:null,unixPermissions:i.unixPermissions,dosPermissions:i.dosPermissions,createFolders:o.createFolders}),i.dir||(h.file(a).unsafeOriginalName=s)}return t.zipComment.length&&(h.comment=t.zipComment),h})}},{"./external":6,"./nodejsUtils":14,"./stream/Crc32Probe":25,"./utf8":31,"./utils":32,"./zipEntries":33}],12:[function(e,t,r){"use strict";var n=e("../utils"),i=e("../stream/GenericWorker");function s(e,t){i.call(this,"Nodejs stream input adapter for "+e),this._upstreamEnded=!1,this._bindStream(t)}n.inherits(s,i),s.prototype._bindStream=function(e){var t=this;(this._stream=e).pause(),e.on("data",function(e){t.push({data:e,meta:{percent:0}})}).on("error",function(e){t.isPaused?this.generatedError=e:t.error(e)}).on("end",function(){t.isPaused?t._upstreamEnded=!0:t.end()})},s.prototype.pause=function(){return!!i.prototype.pause.call(this)&&(this._stream.pause(),!0)},s.prototype.resume=function(){return!!i.prototype.resume.call(this)&&(this._upstreamEnded?this.end():this._stream.resume(),!0)},t.exports=s},{"../stream/GenericWorker":28,"../utils":32}],13:[function(e,t,r){"use strict";var i=e("readable-stream").Readable;function n(e,t,r){i.call(this,t),this._helper=e;var n=this;e.on("data",function(e,t){n.push(e)||n._helper.pause(),r&&r(t)}).on("error",function(e){n.emit("error",e)}).on("end",function(){n.push(null)})}e("../utils").inherits(n,i),n.prototype._read=function(){this._helper.resume()},t.exports=n},{"../utils":32,"readable-stream":16}],14:[function(e,t,r){"use strict";t.exports={isNode:"undefined"!=typeof Buffer,newBufferFrom:function(e,t){if(Buffer.from&&Buffer.from!==Uint8Array.from)return Buffer.from(e,t);if("number"==typeof e)throw new Error('The "data" argument must not be a number');return new Buffer(e,t)},allocBuffer:function(e){if(Buffer.alloc)return Buffer.alloc(e);var t=new Buffer(e);return t.fill(0),t},isBuffer:function(e){return Buffer.isBuffer(e)},isStream:function(e){return e&&"function"==typeof e.on&&"function"==typeof e.pause&&"function"==typeof e.resume}}},{}],15:[function(e,t,r){"use strict";function s(e,t,r){var n,i=u.getTypeOf(t),s=u.extend(r||{},f);s.date=s.date||new Date,null!==s.compression&&(s.compression=s.compression.toUpperCase()),"string"==typeof s.unixPermissions&&(s.unixPermissions=parseInt(s.unixPermissions,8)),s.unixPermissions&&16384&s.unixPermissions&&(s.dir=!0),s.dosPermissions&&16&s.dosPermissions&&(s.dir=!0),s.dir&&(e=g(e)),s.createFolders&&(n=_(e))&&b.call(this,n,!0);var a="string"===i&&!1===s.binary&&!1===s.base64;r&&void 0!==r.binary||(s.binary=!a),(t instanceof c&&0===t.uncompressedSize||s.dir||!t||0===t.length)&&(s.base64=!1,s.binary=!0,t="",s.compression="STORE",i="string");var o=null;o=t instanceof c||t instanceof l?t:p.isNode&&p.isStream(t)?new m(e,t):u.prepareContent(e,t,s.binary,s.optimizedBinaryString,s.base64);var h=new d(e,o,s);this.files[e]=h}var i=e("./utf8"),u=e("./utils"),l=e("./stream/GenericWorker"),a=e("./stream/StreamHelper"),f=e("./defaults"),c=e("./compressedObject"),d=e("./zipObject"),o=e("./generate"),p=e("./nodejsUtils"),m=e("./nodejs/NodejsStreamInputAdapter"),_=function(e){"/"===e.slice(-1)&&(e=e.substring(0,e.length-1));var t=e.lastIndexOf("/");return 0<t?e.substring(0,t):""},g=function(e){return"/"!==e.slice(-1)&&(e+="/"),e},b=function(e,t){return t=void 0!==t?t:f.createFolders,e=g(e),this.files[e]||s.call(this,e,null,{dir:!0,createFolders:t}),this.files[e]};function h(e){return"[object RegExp]"===Object.prototype.toString.call(e)}var n={load:function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},forEach:function(e){var t,r,n;for(t in this.files)n=this.files[t],(r=t.slice(this.root.length,t.length))&&t.slice(0,this.root.length)===this.root&&e(r,n)},filter:function(r){var n=[];return this.forEach(function(e,t){r(e,t)&&n.push(t)}),n},file:function(e,t,r){if(1!==arguments.length)return e=this.root+e,s.call(this,e,t,r),this;if(h(e)){var n=e;return this.filter(function(e,t){return!t.dir&&n.test(e)})}var i=this.files[this.root+e];return i&&!i.dir?i:null},folder:function(r){if(!r)return this;if(h(r))return this.filter(function(e,t){return t.dir&&r.test(e)});var e=this.root+r,t=b.call(this,e),n=this.clone();return n.root=t.name,n},remove:function(r){r=this.root+r;var e=this.files[r];if(e||("/"!==r.slice(-1)&&(r+="/"),e=this.files[r]),e&&!e.dir)delete this.files[r];else for(var t=this.filter(function(e,t){return t.name.slice(0,r.length)===r}),n=0;n<t.length;n++)delete this.files[t[n].name];return this},generate:function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},generateInternalStream:function(e){var t,r={};try{if((r=u.extend(e||{},{streamFiles:!1,compression:"STORE",compressionOptions:null,type:"",platform:"DOS",comment:null,mimeType:"application/zip",encodeFileName:i.utf8encode})).type=r.type.toLowerCase(),r.compression=r.compression.toUpperCase(),"binarystring"===r.type&&(r.type="string"),!r.type)throw new Error("No output type specified.");u.checkSupport(r.type),"darwin"!==r.platform&&"freebsd"!==r.platform&&"linux"!==r.platform&&"sunos"!==r.platform||(r.platform="UNIX"),"win32"===r.platform&&(r.platform="DOS");var n=r.comment||this.comment||"";t=o.generateWorker(this,r,n)}catch(e){(t=new l("error")).error(e)}return new a(t,r.type||"string",r.mimeType)},generateAsync:function(e,t){return this.generateInternalStream(e).accumulate(t)},generateNodeStream:function(e,t){return(e=e||{}).type||(e.type="nodebuffer"),this.generateInternalStream(e).toNodejsStream(t)}};t.exports=n},{"./compressedObject":2,"./defaults":5,"./generate":9,"./nodejs/NodejsStreamInputAdapter":12,"./nodejsUtils":14,"./stream/GenericWorker":28,"./stream/StreamHelper":29,"./utf8":31,"./utils":32,"./zipObject":35}],16:[function(e,t,r){"use strict";t.exports=e("stream")},{stream:void 0}],17:[function(e,t,r){"use strict";var n=e("./DataReader");function i(e){n.call(this,e);for(var t=0;t<this.data.length;t++)e[t]=255&e[t]}e("../utils").inherits(i,n),i.prototype.byteAt=function(e){return this.data[this.zero+e]},i.prototype.lastIndexOfSignature=function(e){for(var t=e.charCodeAt(0),r=e.charCodeAt(1),n=e.charCodeAt(2),i=e.charCodeAt(3),s=this.length-4;0<=s;--s)if(this.data[s]===t&&this.data[s+1]===r&&this.data[s+2]===n&&this.data[s+3]===i)return s-this.zero;return-1},i.prototype.readAndCheckSignature=function(e){var t=e.charCodeAt(0),r=e.charCodeAt(1),n=e.charCodeAt(2),i=e.charCodeAt(3),s=this.readData(4);return t===s[0]&&r===s[1]&&n===s[2]&&i===s[3]},i.prototype.readData=function(e){if(this.checkOffset(e),0===e)return[];var t=this.data.slice(this.zero+this.index,this.zero+this.index+e);return this.index+=e,t},t.exports=i},{"../utils":32,"./DataReader":18}],18:[function(e,t,r){"use strict";var n=e("../utils");function i(e){this.data=e,this.length=e.length,this.index=0,this.zero=0}i.prototype={checkOffset:function(e){this.checkIndex(this.index+e)},checkIndex:function(e){if(this.length<this.zero+e||e<0)throw new Error("End of data reached (data length = "+this.length+", asked index = "+e+"). Corrupted zip ?")},setIndex:function(e){this.checkIndex(e),this.index=e},skip:function(e){this.setIndex(this.index+e)},byteAt:function(){},readInt:function(e){var t,r=0;for(this.checkOffset(e),t=this.index+e-1;t>=this.index;t--)r=(r<<8)+this.byteAt(t);return this.index+=e,r},readString:function(e){return n.transformTo("string",this.readData(e))},readData:function(){},lastIndexOfSignature:function(){},readAndCheckSignature:function(){},readDate:function(){var e=this.readInt(4);return new Date(Date.UTC(1980+(e>>25&127),(e>>21&15)-1,e>>16&31,e>>11&31,e>>5&63,(31&e)<<1))}},t.exports=i},{"../utils":32}],19:[function(e,t,r){"use strict";var n=e("./Uint8ArrayReader");function i(e){n.call(this,e)}e("../utils").inherits(i,n),i.prototype.readData=function(e){this.checkOffset(e);var t=this.data.slice(this.zero+this.index,this.zero+this.index+e);return this.index+=e,t},t.exports=i},{"../utils":32,"./Uint8ArrayReader":21}],20:[function(e,t,r){"use strict";var n=e("./DataReader");function i(e){n.call(this,e)}e("../utils").inherits(i,n),i.prototype.byteAt=function(e){return this.data.charCodeAt(this.zero+e)},i.prototype.lastIndexOfSignature=function(e){return this.data.lastIndexOf(e)-this.zero},i.prototype.readAndCheckSignature=function(e){return e===this.readData(4)},i.prototype.readData=function(e){this.checkOffset(e);var t=this.data.slice(this.zero+this.index,this.zero+this.index+e);return this.index+=e,t},t.exports=i},{"../utils":32,"./DataReader":18}],21:[function(e,t,r){"use strict";var n=e("./ArrayReader");function i(e){n.call(this,e)}e("../utils").inherits(i,n),i.prototype.readData=function(e){if(this.checkOffset(e),0===e)return new Uint8Array(0);var t=this.data.subarray(this.zero+this.index,this.zero+this.index+e);return this.index+=e,t},t.exports=i},{"../utils":32,"./ArrayReader":17}],22:[function(e,t,r){"use strict";var n=e("../utils"),i=e("../support"),s=e("./ArrayReader"),a=e("./StringReader"),o=e("./NodeBufferReader"),h=e("./Uint8ArrayReader");t.exports=function(e){var t=n.getTypeOf(e);return n.checkSupport(t),"string"!==t||i.uint8array?"nodebuffer"===t?new o(e):i.uint8array?new h(n.transformTo("uint8array",e)):new s(n.transformTo("array",e)):new a(e)}},{"../support":30,"../utils":32,"./ArrayReader":17,"./NodeBufferReader":19,"./StringReader":20,"./Uint8ArrayReader":21}],23:[function(e,t,r){"use strict";r.LOCAL_FILE_HEADER="PK",r.CENTRAL_FILE_HEADER="PK",r.CENTRAL_DIRECTORY_END="PK",r.ZIP64_CENTRAL_DIRECTORY_LOCATOR="PK",r.ZIP64_CENTRAL_DIRECTORY_END="PK",r.DATA_DESCRIPTOR="PK\b"},{}],24:[function(e,t,r){"use strict";var n=e("./GenericWorker"),i=e("../utils");function s(e){n.call(this,"ConvertWorker to "+e),this.destType=e}i.inherits(s,n),s.prototype.processChunk=function(e){this.push({data:i.transformTo(this.destType,e.data),meta:e.meta})},t.exports=s},{"../utils":32,"./GenericWorker":28}],25:[function(e,t,r){"use strict";var n=e("./GenericWorker"),i=e("../crc32");function s(){n.call(this,"Crc32Probe"),this.withStreamInfo("crc32",0)}e("../utils").inherits(s,n),s.prototype.processChunk=function(e){this.streamInfo.crc32=i(e.data,this.streamInfo.crc32||0),this.push(e)},t.exports=s},{"../crc32":4,"../utils":32,"./GenericWorker":28}],26:[function(e,t,r){"use strict";var n=e("../utils"),i=e("./GenericWorker");function s(e){i.call(this,"DataLengthProbe for "+e),this.propName=e,this.withStreamInfo(e,0)}n.inherits(s,i),s.prototype.processChunk=function(e){if(e){var t=this.streamInfo[this.propName]||0;this.streamInfo[this.propName]=t+e.data.length}i.prototype.processChunk.call(this,e)},t.exports=s},{"../utils":32,"./GenericWorker":28}],27:[function(e,t,r){"use strict";var n=e("../utils"),i=e("./GenericWorker");function s(e){i.call(this,"DataWorker");var t=this;this.dataIsReady=!1,this.index=0,this.max=0,this.data=null,this.type="",this._tickScheduled=!1,e.then(function(e){t.dataIsReady=!0,t.data=e,t.max=e&&e.length||0,t.type=n.getTypeOf(e),t.isPaused||t._tickAndRepeat()},function(e){t.error(e)})}n.inherits(s,i),s.prototype.cleanUp=function(){i.prototype.cleanUp.call(this),this.data=null},s.prototype.resume=function(){return!!i.prototype.resume.call(this)&&(!this._tickScheduled&&this.dataIsReady&&(this._tickScheduled=!0,n.delay(this._tickAndRepeat,[],this)),!0)},s.prototype._tickAndRepeat=function(){this._tickScheduled=!1,this.isPaused||this.isFinished||(this._tick(),this.isFinished||(n.delay(this._tickAndRepeat,[],this),this._tickScheduled=!0))},s.prototype._tick=function(){if(this.isPaused||this.isFinished)return!1;var e=null,t=Math.min(this.max,this.index+16384);if(this.index>=this.max)return this.end();switch(this.type){case"string":e=this.data.substring(this.index,t);break;case"uint8array":e=this.data.subarray(this.index,t);break;case"array":case"nodebuffer":e=this.data.slice(this.index,t)}return this.index=t,this.push({data:e,meta:{percent:this.max?this.index/this.max*100:0}})},t.exports=s},{"../utils":32,"./GenericWorker":28}],28:[function(e,t,r){"use strict";function n(e){this.name=e||"default",this.streamInfo={},this.generatedError=null,this.extraStreamInfo={},this.isPaused=!0,this.isFinished=!1,this.isLocked=!1,this._listeners={data:[],end:[],error:[]},this.previous=null}n.prototype={push:function(e){this.emit("data",e)},end:function(){if(this.isFinished)return!1;this.flush();try{this.emit("end"),this.cleanUp(),this.isFinished=!0}catch(e){this.emit("error",e)}return!0},error:function(e){return!this.isFinished&&(this.isPaused?this.generatedError=e:(this.isFinished=!0,this.emit("error",e),this.previous&&this.previous.error(e),this.cleanUp()),!0)},on:function(e,t){return this._listeners[e].push(t),this},cleanUp:function(){this.streamInfo=this.generatedError=this.extraStreamInfo=null,this._listeners=[]},emit:function(e,t){if(this._listeners[e])for(var r=0;r<this._listeners[e].length;r++)this._listeners[e][r].call(this,t)},pipe:function(e){return e.registerPrevious(this)},registerPrevious:function(e){if(this.isLocked)throw new Error("The stream '"+this+"' has already been used.");this.streamInfo=e.streamInfo,this.mergeStreamInfo(),this.previous=e;var t=this;return e.on("data",function(e){t.processChunk(e)}),e.on("end",function(){t.end()}),e.on("error",function(e){t.error(e)}),this},pause:function(){return!this.isPaused&&!this.isFinished&&(this.isPaused=!0,this.previous&&this.previous.pause(),!0)},resume:function(){if(!this.isPaused||this.isFinished)return!1;var e=this.isPaused=!1;return this.generatedError&&(this.error(this.generatedError),e=!0),this.previous&&this.previous.resume(),!e},flush:function(){},processChunk:function(e){this.push(e)},withStreamInfo:function(e,t){return this.extraStreamInfo[e]=t,this.mergeStreamInfo(),this},mergeStreamInfo:function(){for(var e in this.extraStreamInfo)Object.prototype.hasOwnProperty.call(this.extraStreamInfo,e)&&(this.streamInfo[e]=this.extraStreamInfo[e])},lock:function(){if(this.isLocked)throw new Error("The stream '"+this+"' has already been used.");this.isLocked=!0,this.previous&&this.previous.lock()},toString:function(){var e="Worker "+this.name;return this.previous?this.previous+" -> "+e:e}},t.exports=n},{}],29:[function(e,t,r){"use strict";var h=e("../utils"),i=e("./ConvertWorker"),s=e("./GenericWorker"),u=e("../base64"),n=e("../support"),a=e("../external"),o=null;if(n.nodestream)try{o=e("../nodejs/NodejsStreamOutputAdapter")}catch(e){}function l(e,o){return new a.Promise(function(t,r){var n=[],i=e._internalType,s=e._outputType,a=e._mimeType;e.on("data",function(e,t){n.push(e),o&&o(t)}).on("error",function(e){n=[],r(e)}).on("end",function(){try{var e=function(e,t,r){switch(e){case"blob":return h.newBlob(h.transformTo("arraybuffer",t),r);case"base64":return u.encode(t);default:return h.transformTo(e,t)}}(s,function(e,t){var r,n=0,i=null,s=0;for(r=0;r<t.length;r++)s+=t[r].length;switch(e){case"string":return t.join("");case"array":return Array.prototype.concat.apply([],t);case"uint8array":for(i=new Uint8Array(s),r=0;r<t.length;r++)i.set(t[r],n),n+=t[r].length;return i;case"nodebuffer":return Buffer.concat(t);default:throw new Error("concat : unsupported type '"+e+"'")}}(i,n),a);t(e)}catch(e){r(e)}n=[]}).resume()})}function f(e,t,r){var n=t;switch(t){case"blob":case"arraybuffer":n="uint8array";break;case"base64":n="string"}try{this._internalType=n,this._outputType=t,this._mimeType=r,h.checkSupport(n),this._worker=e.pipe(new i(n)),e.lock()}catch(e){this._worker=new s("error"),this._worker.error(e)}}f.prototype={accumulate:function(e){return l(this,e)},on:function(e,t){var r=this;return"data"===e?this._worker.on(e,function(e){t.call(r,e.data,e.meta)}):this._worker.on(e,function(){h.delay(t,arguments,r)}),this},resume:function(){return h.delay(this._worker.resume,[],this._worker),this},pause:function(){return this._worker.pause(),this},toNodejsStream:function(e){if(h.checkSupport("nodestream"),"nodebuffer"!==this._outputType)throw new Error(this._outputType+" is not supported by this method");return new o(this,{objectMode:"nodebuffer"!==this._outputType},e)}},t.exports=f},{"../base64":1,"../external":6,"../nodejs/NodejsStreamOutputAdapter":13,"../support":30,"../utils":32,"./ConvertWorker":24,"./GenericWorker":28}],30:[function(e,t,r){"use strict";if(r.base64=!0,r.array=!0,r.string=!0,r.arraybuffer="undefined"!=typeof ArrayBuffer&&"undefined"!=typeof Uint8Array,r.nodebuffer="undefined"!=typeof Buffer,r.uint8array="undefined"!=typeof Uint8Array,"undefined"==typeof ArrayBuffer)r.blob=!1;else{var n=new ArrayBuffer(0);try{r.blob=0===new Blob([n],{type:"application/zip"}).size}catch(e){try{var i=new(self.BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||self.MSBlobBuilder);i.append(n),r.blob=0===i.getBlob("application/zip").size}catch(e){r.blob=!1}}}try{r.nodestream=!!e("readable-stream").Readable}catch(e){r.nodestream=!1}},{"readable-stream":16}],31:[function(e,t,s){"use strict";for(var o=e("./utils"),h=e("./support"),r=e("./nodejsUtils"),n=e("./stream/GenericWorker"),u=new Array(256),i=0;i<256;i++)u[i]=252<=i?6:248<=i?5:240<=i?4:224<=i?3:192<=i?2:1;u[254]=u[254]=1;function a(){n.call(this,"utf-8 decode"),this.leftOver=null}function l(){n.call(this,"utf-8 encode")}s.utf8encode=function(e){return h.nodebuffer?r.newBufferFrom(e,"utf-8"):function(e){var t,r,n,i,s,a=e.length,o=0;for(i=0;i<a;i++)55296==(64512&(r=e.charCodeAt(i)))&&i+1<a&&56320==(64512&(n=e.charCodeAt(i+1)))&&(r=65536+(r-55296<<10)+(n-56320),i++),o+=r<128?1:r<2048?2:r<65536?3:4;for(t=h.uint8array?new Uint8Array(o):new Array(o),i=s=0;s<o;i++)55296==(64512&(r=e.charCodeAt(i)))&&i+1<a&&56320==(64512&(n=e.charCodeAt(i+1)))&&(r=65536+(r-55296<<10)+(n-56320),i++),r<128?t[s++]=r:(r<2048?t[s++]=192|r>>>6:(r<65536?t[s++]=224|r>>>12:(t[s++]=240|r>>>18,t[s++]=128|r>>>12&63),t[s++]=128|r>>>6&63),t[s++]=128|63&r);return t}(e)},s.utf8decode=function(e){return h.nodebuffer?o.transformTo("nodebuffer",e).toString("utf-8"):function(e){var t,r,n,i,s=e.length,a=new Array(2*s);for(t=r=0;t<s;)if((n=e[t++])<128)a[r++]=n;else if(4<(i=u[n]))a[r++]=65533,t+=i-1;else{for(n&=2===i?31:3===i?15:7;1<i&&t<s;)n=n<<6|63&e[t++],i--;1<i?a[r++]=65533:n<65536?a[r++]=n:(n-=65536,a[r++]=55296|n>>10&1023,a[r++]=56320|1023&n)}return a.length!==r&&(a.subarray?a=a.subarray(0,r):a.length=r),o.applyFromCharCode(a)}(e=o.transformTo(h.uint8array?"uint8array":"array",e))},o.inherits(a,n),a.prototype.processChunk=function(e){var t=o.transformTo(h.uint8array?"uint8array":"array",e.data);if(this.leftOver&&this.leftOver.length){if(h.uint8array){var r=t;(t=new Uint8Array(r.length+this.leftOver.length)).set(this.leftOver,0),t.set(r,this.leftOver.length)}else t=this.leftOver.concat(t);this.leftOver=null}var n=function(e,t){var r;for((t=t||e.length)>e.length&&(t=e.length),r=t-1;0<=r&&128==(192&e[r]);)r--;return r<0?t:0===r?t:r+u[e[r]]>t?r:t}(t),i=t;n!==t.length&&(h.uint8array?(i=t.subarray(0,n),this.leftOver=t.subarray(n,t.length)):(i=t.slice(0,n),this.leftOver=t.slice(n,t.length))),this.push({data:s.utf8decode(i),meta:e.meta})},a.prototype.flush=function(){this.leftOver&&this.leftOver.length&&(this.push({data:s.utf8decode(this.leftOver),meta:{}}),this.leftOver=null)},s.Utf8DecodeWorker=a,o.inherits(l,n),l.prototype.processChunk=function(e){this.push({data:s.utf8encode(e.data),meta:e.meta})},s.Utf8EncodeWorker=l},{"./nodejsUtils":14,"./stream/GenericWorker":28,"./support":30,"./utils":32}],32:[function(e,t,a){"use strict";var o=e("./support"),h=e("./base64"),r=e("./nodejsUtils"),u=e("./external");function n(e){return e}function l(e,t){for(var r=0;r<e.length;++r)t[r]=255&e.charCodeAt(r);return t}e("setimmediate"),a.newBlob=function(t,r){a.checkSupport("blob");try{return new Blob([t],{type:r})}catch(e){try{var n=new(self.BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||self.MSBlobBuilder);return n.append(t),n.getBlob(r)}catch(e){throw new Error("Bug : can't construct the Blob.")}}};var i={stringifyByChunk:function(e,t,r){var n=[],i=0,s=e.length;if(s<=r)return String.fromCharCode.apply(null,e);for(;i<s;)"array"===t||"nodebuffer"===t?n.push(String.fromCharCode.apply(null,e.slice(i,Math.min(i+r,s)))):n.push(String.fromCharCode.apply(null,e.subarray(i,Math.min(i+r,s)))),i+=r;return n.join("")},stringifyByChar:function(e){for(var t="",r=0;r<e.length;r++)t+=String.fromCharCode(e[r]);return t},applyCanBeUsed:{uint8array:function(){try{return o.uint8array&&1===String.fromCharCode.apply(null,new Uint8Array(1)).length}catch(e){return!1}}(),nodebuffer:function(){try{return o.nodebuffer&&1===String.fromCharCode.apply(null,r.allocBuffer(1)).length}catch(e){return!1}}()}};function s(e){var t=65536,r=a.getTypeOf(e),n=!0;if("uint8array"===r?n=i.applyCanBeUsed.uint8array:"nodebuffer"===r&&(n=i.applyCanBeUsed.nodebuffer),n)for(;1<t;)try{return i.stringifyByChunk(e,r,t)}catch(e){t=Math.floor(t/2)}return i.stringifyByChar(e)}function f(e,t){for(var r=0;r<e.length;r++)t[r]=e[r];return t}a.applyFromCharCode=s;var c={};c.string={string:n,array:function(e){return l(e,new Array(e.length))},arraybuffer:function(e){return c.string.uint8array(e).buffer},uint8array:function(e){return l(e,new Uint8Array(e.length))},nodebuffer:function(e){return l(e,r.allocBuffer(e.length))}},c.array={string:s,array:n,arraybuffer:function(e){return new Uint8Array(e).buffer},uint8array:function(e){return new Uint8Array(e)},nodebuffer:function(e){return r.newBufferFrom(e)}},c.arraybuffer={string:function(e){return s(new Uint8Array(e))},array:function(e){return f(new Uint8Array(e),new Array(e.byteLength))},arraybuffer:n,uint8array:function(e){return new Uint8Array(e)},nodebuffer:function(e){return r.newBufferFrom(new Uint8Array(e))}},c.uint8array={string:s,array:function(e){return f(e,new Array(e.length))},arraybuffer:function(e){return e.buffer},uint8array:n,nodebuffer:function(e){return r.newBufferFrom(e)}},c.nodebuffer={string:s,array:function(e){return f(e,new Array(e.length))},arraybuffer:function(e){return c.nodebuffer.uint8array(e).buffer},uint8array:function(e){return f(e,new Uint8Array(e.length))},nodebuffer:n},a.transformTo=function(e,t){if(t=t||"",!e)return t;a.checkSupport(e);var r=a.getTypeOf(t);return c[r][e](t)},a.resolve=function(e){for(var t=e.split("/"),r=[],n=0;n<t.length;n++){var i=t[n];"."===i||""===i&&0!==n&&n!==t.length-1||(".."===i?r.pop():r.push(i))}return r.join("/")},a.getTypeOf=function(e){return"string"==typeof e?"string":"[object Array]"===Object.prototype.toString.call(e)?"array":o.nodebuffer&&r.isBuffer(e)?"nodebuffer":o.uint8array&&e instanceof Uint8Array?"uint8array":o.arraybuffer&&e instanceof ArrayBuffer?"arraybuffer":void 0},a.checkSupport=function(e){if(!o[e.toLowerCase()])throw new Error(e+" is not supported by this platform")},a.MAX_VALUE_16BITS=65535,a.MAX_VALUE_32BITS=-1,a.pretty=function(e){var t,r,n="";for(r=0;r<(e||"").length;r++)n+="\\x"+((t=e.charCodeAt(r))<16?"0":"")+t.toString(16).toUpperCase();return n},a.delay=function(e,t,r){setImmediate(function(){e.apply(r||null,t||[])})},a.inherits=function(e,t){function r(){}r.prototype=t.prototype,e.prototype=new r},a.extend=function(){var e,t,r={};for(e=0;e<arguments.length;e++)for(t in arguments[e])Object.prototype.hasOwnProperty.call(arguments[e],t)&&void 0===r[t]&&(r[t]=arguments[e][t]);return r},a.prepareContent=function(r,e,n,i,s){return u.Promise.resolve(e).then(function(n){return o.blob&&(n instanceof Blob||-1!==["[object File]","[object Blob]"].indexOf(Object.prototype.toString.call(n)))&&"undefined"!=typeof FileReader?new u.Promise(function(t,r){var e=new FileReader;e.onload=function(e){t(e.target.result)},e.onerror=function(e){r(e.target.error)},e.readAsArrayBuffer(n)}):n}).then(function(e){var t=a.getTypeOf(e);return t?("arraybuffer"===t?e=a.transformTo("uint8array",e):"string"===t&&(s?e=h.decode(e):n&&!0!==i&&(e=function(e){return l(e,o.uint8array?new Uint8Array(e.length):new Array(e.length))}(e))),e):u.Promise.reject(new Error("Can't read the data of '"+r+"'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"))})}},{"./base64":1,"./external":6,"./nodejsUtils":14,"./support":30,setimmediate:54}],33:[function(e,t,r){"use strict";var n=e("./reader/readerFor"),i=e("./utils"),s=e("./signature"),a=e("./zipEntry"),o=e("./support");function h(e){this.files=[],this.loadOptions=e}h.prototype={checkSignature:function(e){if(!this.reader.readAndCheckSignature(e)){this.reader.index-=4;var t=this.reader.readString(4);throw new Error("Corrupted zip or bug: unexpected signature ("+i.pretty(t)+", expected "+i.pretty(e)+")")}},isSignature:function(e,t){var r=this.reader.index;this.reader.setIndex(e);var n=this.reader.readString(4)===t;return this.reader.setIndex(r),n},readBlockEndOfCentral:function(){this.diskNumber=this.reader.readInt(2),this.diskWithCentralDirStart=this.reader.readInt(2),this.centralDirRecordsOnThisDisk=this.reader.readInt(2),this.centralDirRecords=this.reader.readInt(2),this.centralDirSize=this.reader.readInt(4),this.centralDirOffset=this.reader.readInt(4),this.zipCommentLength=this.reader.readInt(2);var e=this.reader.readData(this.zipCommentLength),t=o.uint8array?"uint8array":"array",r=i.transformTo(t,e);this.zipComment=this.loadOptions.decodeFileName(r)},readBlockZip64EndOfCentral:function(){this.zip64EndOfCentralSize=this.reader.readInt(8),this.reader.skip(4),this.diskNumber=this.reader.readInt(4),this.diskWithCentralDirStart=this.reader.readInt(4),this.centralDirRecordsOnThisDisk=this.reader.readInt(8),this.centralDirRecords=this.reader.readInt(8),this.centralDirSize=this.reader.readInt(8),this.centralDirOffset=this.reader.readInt(8),this.zip64ExtensibleData={};for(var e,t,r,n=this.zip64EndOfCentralSize-44;0<n;)e=this.reader.readInt(2),t=this.reader.readInt(4),r=this.reader.readData(t),this.zip64ExtensibleData[e]={id:e,length:t,value:r}},readBlockZip64EndOfCentralLocator:function(){if(this.diskWithZip64CentralDirStart=this.reader.readInt(4),this.relativeOffsetEndOfZip64CentralDir=this.reader.readInt(8),this.disksCount=this.reader.readInt(4),1<this.disksCount)throw new Error("Multi-volumes zip are not supported")},readLocalFiles:function(){var e,t;for(e=0;e<this.files.length;e++)t=this.files[e],this.reader.setIndex(t.localHeaderOffset),this.checkSignature(s.LOCAL_FILE_HEADER),t.readLocalPart(this.reader),t.handleUTF8(),t.processAttributes()},readCentralDir:function(){var e;for(this.reader.setIndex(this.centralDirOffset);this.reader.readAndCheckSignature(s.CENTRAL_FILE_HEADER);)(e=new a({zip64:this.zip64},this.loadOptions)).readCentralPart(this.reader),this.files.push(e);if(this.centralDirRecords!==this.files.length&&0!==this.centralDirRecords&&0===this.files.length)throw new Error("Corrupted zip or bug: expected "+this.centralDirRecords+" records in central dir, got "+this.files.length)},readEndOfCentral:function(){var e=this.reader.lastIndexOfSignature(s.CENTRAL_DIRECTORY_END);if(e<0)throw!this.isSignature(0,s.LOCAL_FILE_HEADER)?new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html"):new Error("Corrupted zip: can't find end of central directory");this.reader.setIndex(e);var t=e;if(this.checkSignature(s.CENTRAL_DIRECTORY_END),this.readBlockEndOfCentral(),this.diskNumber===i.MAX_VALUE_16BITS||this.diskWithCentralDirStart===i.MAX_VALUE_16BITS||this.centralDirRecordsOnThisDisk===i.MAX_VALUE_16BITS||this.centralDirRecords===i.MAX_VALUE_16BITS||this.centralDirSize===i.MAX_VALUE_32BITS||this.centralDirOffset===i.MAX_VALUE_32BITS){if(this.zip64=!0,(e=this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR))<0)throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");if(this.reader.setIndex(e),this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR),this.readBlockZip64EndOfCentralLocator(),!this.isSignature(this.relativeOffsetEndOfZip64CentralDir,s.ZIP64_CENTRAL_DIRECTORY_END)&&(this.relativeOffsetEndOfZip64CentralDir=this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_END),this.relativeOffsetEndOfZip64CentralDir<0))throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir),this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_END),this.readBlockZip64EndOfCentral()}var r=this.centralDirOffset+this.centralDirSize;this.zip64&&(r+=20,r+=12+this.zip64EndOfCentralSize);var n=t-r;if(0<n)this.isSignature(t,s.CENTRAL_FILE_HEADER)||(this.reader.zero=n);else if(n<0)throw new Error("Corrupted zip: missing "+Math.abs(n)+" bytes.")},prepareReader:function(e){this.reader=n(e)},load:function(e){this.prepareReader(e),this.readEndOfCentral(),this.readCentralDir(),this.readLocalFiles()}},t.exports=h},{"./reader/readerFor":22,"./signature":23,"./support":30,"./utils":32,"./zipEntry":34}],34:[function(e,t,r){"use strict";var n=e("./reader/readerFor"),s=e("./utils"),i=e("./compressedObject"),a=e("./crc32"),o=e("./utf8"),h=e("./compressions"),u=e("./support");function l(e,t){this.options=e,this.loadOptions=t}l.prototype={isEncrypted:function(){return 1==(1&this.bitFlag)},useUTF8:function(){return 2048==(2048&this.bitFlag)},readLocalPart:function(e){var t,r;if(e.skip(22),this.fileNameLength=e.readInt(2),r=e.readInt(2),this.fileName=e.readData(this.fileNameLength),e.skip(r),-1===this.compressedSize||-1===this.uncompressedSize)throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");if(null===(t=function(e){for(var t in h)if(Object.prototype.hasOwnProperty.call(h,t)&&h[t].magic===e)return h[t];return null}(this.compressionMethod)))throw new Error("Corrupted zip : compression "+s.pretty(this.compressionMethod)+" unknown (inner file : "+s.transformTo("string",this.fileName)+")");this.decompressed=new i(this.compressedSize,this.uncompressedSize,this.crc32,t,e.readData(this.compressedSize))},readCentralPart:function(e){this.versionMadeBy=e.readInt(2),e.skip(2),this.bitFlag=e.readInt(2),this.compressionMethod=e.readString(2),this.date=e.readDate(),this.crc32=e.readInt(4),this.compressedSize=e.readInt(4),this.uncompressedSize=e.readInt(4);var t=e.readInt(2);if(this.extraFieldsLength=e.readInt(2),this.fileCommentLength=e.readInt(2),this.diskNumberStart=e.readInt(2),this.internalFileAttributes=e.readInt(2),this.externalFileAttributes=e.readInt(4),this.localHeaderOffset=e.readInt(4),this.isEncrypted())throw new Error("Encrypted zip are not supported");e.skip(t),this.readExtraFields(e),this.parseZIP64ExtraField(e),this.fileComment=e.readData(this.fileCommentLength)},processAttributes:function(){this.unixPermissions=null,this.dosPermissions=null;var e=this.versionMadeBy>>8;this.dir=!!(16&this.externalFileAttributes),0==e&&(this.dosPermissions=63&this.externalFileAttributes),3==e&&(this.unixPermissions=this.externalFileAttributes>>16&65535),this.dir||"/"!==this.fileNameStr.slice(-1)||(this.dir=!0)},parseZIP64ExtraField:function(){if(this.extraFields[1]){var e=n(this.extraFields[1].value);this.uncompressedSize===s.MAX_VALUE_32BITS&&(this.uncompressedSize=e.readInt(8)),this.compressedSize===s.MAX_VALUE_32BITS&&(this.compressedSize=e.readInt(8)),this.localHeaderOffset===s.MAX_VALUE_32BITS&&(this.localHeaderOffset=e.readInt(8)),this.diskNumberStart===s.MAX_VALUE_32BITS&&(this.diskNumberStart=e.readInt(4))}},readExtraFields:function(e){var t,r,n,i=e.index+this.extraFieldsLength;for(this.extraFields||(this.extraFields={});e.index+4<i;)t=e.readInt(2),r=e.readInt(2),n=e.readData(r),this.extraFields[t]={id:t,length:r,value:n};e.setIndex(i)},handleUTF8:function(){var e=u.uint8array?"uint8array":"array";if(this.useUTF8())this.fileNameStr=o.utf8decode(this.fileName),this.fileCommentStr=o.utf8decode(this.fileComment);else{var t=this.findExtraFieldUnicodePath();if(null!==t)this.fileNameStr=t;else{var r=s.transformTo(e,this.fileName);this.fileNameStr=this.loadOptions.decodeFileName(r)}var n=this.findExtraFieldUnicodeComment();if(null!==n)this.fileCommentStr=n;else{var i=s.transformTo(e,this.fileComment);this.fileCommentStr=this.loadOptions.decodeFileName(i)}}},findExtraFieldUnicodePath:function(){var e=this.extraFields[28789];if(e){var t=n(e.value);return 1!==t.readInt(1)?null:a(this.fileName)!==t.readInt(4)?null:o.utf8decode(t.readData(e.length-5))}return null},findExtraFieldUnicodeComment:function(){var e=this.extraFields[25461];if(e){var t=n(e.value);return 1!==t.readInt(1)?null:a(this.fileComment)!==t.readInt(4)?null:o.utf8decode(t.readData(e.length-5))}return null}},t.exports=l},{"./compressedObject":2,"./compressions":3,"./crc32":4,"./reader/readerFor":22,"./support":30,"./utf8":31,"./utils":32}],35:[function(e,t,r){"use strict";function n(e,t,r){this.name=e,this.dir=r.dir,this.date=r.date,this.comment=r.comment,this.unixPermissions=r.unixPermissions,this.dosPermissions=r.dosPermissions,this._data=t,this._dataBinary=r.binary,this.options={compression:r.compression,compressionOptions:r.compressionOptions}}var s=e("./stream/StreamHelper"),i=e("./stream/DataWorker"),a=e("./utf8"),o=e("./compressedObject"),h=e("./stream/GenericWorker");n.prototype={internalStream:function(e){var t=null,r="string";try{if(!e)throw new Error("No output type specified.");var n="string"===(r=e.toLowerCase())||"text"===r;"binarystring"!==r&&"text"!==r||(r="string"),t=this._decompressWorker();var i=!this._dataBinary;i&&!n&&(t=t.pipe(new a.Utf8EncodeWorker)),!i&&n&&(t=t.pipe(new a.Utf8DecodeWorker))}catch(e){(t=new h("error")).error(e)}return new s(t,r,"")},async:function(e,t){return this.internalStream(e).accumulate(t)},nodeStream:function(e,t){return this.internalStream(e||"nodebuffer").toNodejsStream(t)},_compressWorker:function(e,t){if(this._data instanceof o&&this._data.compression.magic===e.magic)return this._data.getCompressedWorker();var r=this._decompressWorker();return this._dataBinary||(r=r.pipe(new a.Utf8EncodeWorker)),o.createWorkerFrom(r,e,t)},_decompressWorker:function(){return this._data instanceof o?this._data.getContentWorker():this._data instanceof h?this._data:new i(this._data)}};for(var u=["asText","asBinary","asNodeBuffer","asUint8Array","asArrayBuffer"],l=function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},f=0;f<u.length;f++)n.prototype[u[f]]=l;t.exports=n},{"./compressedObject":2,"./stream/DataWorker":27,"./stream/GenericWorker":28,"./stream/StreamHelper":29,"./utf8":31}],36:[function(e,l,t){(function(t){"use strict";var r,n,e=t.MutationObserver||t.WebKitMutationObserver;if(e){var i=0,s=new e(u),a=t.document.createTextNode("");s.observe(a,{characterData:!0}),r=function(){a.data=i=++i%2}}else if(t.setImmediate||void 0===t.MessageChannel)r="document"in t&&"onreadystatechange"in t.document.createElement("script")?function(){var e=t.document.createElement("script");e.onreadystatechange=function(){u(),e.onreadystatechange=null,e.parentNode.removeChild(e),e=null},t.document.documentElement.appendChild(e)}:function(){setTimeout(u,0)};else{var o=new t.MessageChannel;o.port1.onmessage=u,r=function(){o.port2.postMessage(0)}}var h=[];function u(){var e,t;n=!0;for(var r=h.length;r;){for(t=h,h=[],e=-1;++e<r;)t[e]();r=h.length}n=!1}l.exports=function(e){1!==h.push(e)||n||r()}}).call(this,"undefined"!=typeof __webpack_require__.g?__webpack_require__.g:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],37:[function(e,t,r){"use strict";var i=e("immediate");function u(){}var l={},s=["REJECTED"],a=["FULFILLED"],n=["PENDING"];function o(e){if("function"!=typeof e)throw new TypeError("resolver must be a function");this.state=n,this.queue=[],this.outcome=void 0,e!==u&&d(this,e)}function h(e,t,r){this.promise=e,"function"==typeof t&&(this.onFulfilled=t,this.callFulfilled=this.otherCallFulfilled),"function"==typeof r&&(this.onRejected=r,this.callRejected=this.otherCallRejected)}function f(t,r,n){i(function(){var e;try{e=r(n)}catch(e){return l.reject(t,e)}e===t?l.reject(t,new TypeError("Cannot resolve promise with itself")):l.resolve(t,e)})}function c(e){var t=e&&e.then;if(e&&("object"==typeof e||"function"==typeof e)&&"function"==typeof t)return function(){t.apply(e,arguments)}}function d(t,e){var r=!1;function n(e){r||(r=!0,l.reject(t,e))}function i(e){r||(r=!0,l.resolve(t,e))}var s=p(function(){e(i,n)});"error"===s.status&&n(s.value)}function p(e,t){var r={};try{r.value=e(t),r.status="success"}catch(e){r.status="error",r.value=e}return r}(t.exports=o).prototype.finally=function(t){if("function"!=typeof t)return this;var r=this.constructor;return this.then(function(e){return r.resolve(t()).then(function(){return e})},function(e){return r.resolve(t()).then(function(){throw e})})},o.prototype.catch=function(e){return this.then(null,e)},o.prototype.then=function(e,t){if("function"!=typeof e&&this.state===a||"function"!=typeof t&&this.state===s)return this;var r=new this.constructor(u);this.state!==n?f(r,this.state===a?e:t,this.outcome):this.queue.push(new h(r,e,t));return r},h.prototype.callFulfilled=function(e){l.resolve(this.promise,e)},h.prototype.otherCallFulfilled=function(e){f(this.promise,this.onFulfilled,e)},h.prototype.callRejected=function(e){l.reject(this.promise,e)},h.prototype.otherCallRejected=function(e){f(this.promise,this.onRejected,e)},l.resolve=function(e,t){var r=p(c,t);if("error"===r.status)return l.reject(e,r.value);var n=r.value;if(n)d(e,n);else{e.state=a,e.outcome=t;for(var i=-1,s=e.queue.length;++i<s;)e.queue[i].callFulfilled(t)}return e},l.reject=function(e,t){e.state=s,e.outcome=t;for(var r=-1,n=e.queue.length;++r<n;)e.queue[r].callRejected(t);return e},o.resolve=function(e){if(e instanceof this)return e;return l.resolve(new this(u),e)},o.reject=function(e){var t=new this(u);return l.reject(t,e)},o.all=function(e){var r=this;if("[object Array]"!==Object.prototype.toString.call(e))return this.reject(new TypeError("must be an array"));var n=e.length,i=!1;if(!n)return this.resolve([]);var s=new Array(n),a=0,t=-1,o=new this(u);for(;++t<n;)h(e[t],t);return o;function h(e,t){r.resolve(e).then(function(e){s[t]=e,++a!==n||i||(i=!0,l.resolve(o,s))},function(e){i||(i=!0,l.reject(o,e))})}},o.race=function(e){var t=this;if("[object Array]"!==Object.prototype.toString.call(e))return this.reject(new TypeError("must be an array"));var r=e.length,n=!1;if(!r)return this.resolve([]);var i=-1,s=new this(u);for(;++i<r;)a=e[i],t.resolve(a).then(function(e){n||(n=!0,l.resolve(s,e))},function(e){n||(n=!0,l.reject(s,e))});var a;return s}},{immediate:36}],38:[function(e,t,r){"use strict";var n={};(0,e("./lib/utils/common").assign)(n,e("./lib/deflate"),e("./lib/inflate"),e("./lib/zlib/constants")),t.exports=n},{"./lib/deflate":39,"./lib/inflate":40,"./lib/utils/common":41,"./lib/zlib/constants":44}],39:[function(e,t,r){"use strict";var a=e("./zlib/deflate"),o=e("./utils/common"),h=e("./utils/strings"),i=e("./zlib/messages"),s=e("./zlib/zstream"),u=Object.prototype.toString,l=0,f=-1,c=0,d=8;function p(e){if(!(this instanceof p))return new p(e);this.options=o.assign({level:f,method:d,chunkSize:16384,windowBits:15,memLevel:8,strategy:c,to:""},e||{});var t=this.options;t.raw&&0<t.windowBits?t.windowBits=-t.windowBits:t.gzip&&0<t.windowBits&&t.windowBits<16&&(t.windowBits+=16),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new s,this.strm.avail_out=0;var r=a.deflateInit2(this.strm,t.level,t.method,t.windowBits,t.memLevel,t.strategy);if(r!==l)throw new Error(i[r]);if(t.header&&a.deflateSetHeader(this.strm,t.header),t.dictionary){var n;if(n="string"==typeof t.dictionary?h.string2buf(t.dictionary):"[object ArrayBuffer]"===u.call(t.dictionary)?new Uint8Array(t.dictionary):t.dictionary,(r=a.deflateSetDictionary(this.strm,n))!==l)throw new Error(i[r]);this._dict_set=!0}}function n(e,t){var r=new p(t);if(r.push(e,!0),r.err)throw r.msg||i[r.err];return r.result}p.prototype.push=function(e,t){var r,n,i=this.strm,s=this.options.chunkSize;if(this.ended)return!1;n=t===~~t?t:!0===t?4:0,"string"==typeof e?i.input=h.string2buf(e):"[object ArrayBuffer]"===u.call(e)?i.input=new Uint8Array(e):i.input=e,i.next_in=0,i.avail_in=i.input.length;do{if(0===i.avail_out&&(i.output=new o.Buf8(s),i.next_out=0,i.avail_out=s),1!==(r=a.deflate(i,n))&&r!==l)return this.onEnd(r),!(this.ended=!0);0!==i.avail_out&&(0!==i.avail_in||4!==n&&2!==n)||("string"===this.options.to?this.onData(h.buf2binstring(o.shrinkBuf(i.output,i.next_out))):this.onData(o.shrinkBuf(i.output,i.next_out)))}while((0<i.avail_in||0===i.avail_out)&&1!==r);return 4===n?(r=a.deflateEnd(this.strm),this.onEnd(r),this.ended=!0,r===l):2!==n||(this.onEnd(l),!(i.avail_out=0))},p.prototype.onData=function(e){this.chunks.push(e)},p.prototype.onEnd=function(e){e===l&&("string"===this.options.to?this.result=this.chunks.join(""):this.result=o.flattenChunks(this.chunks)),this.chunks=[],this.err=e,this.msg=this.strm.msg},r.Deflate=p,r.deflate=n,r.deflateRaw=function(e,t){return(t=t||{}).raw=!0,n(e,t)},r.gzip=function(e,t){return(t=t||{}).gzip=!0,n(e,t)}},{"./utils/common":41,"./utils/strings":42,"./zlib/deflate":46,"./zlib/messages":51,"./zlib/zstream":53}],40:[function(e,t,r){"use strict";var c=e("./zlib/inflate"),d=e("./utils/common"),p=e("./utils/strings"),m=e("./zlib/constants"),n=e("./zlib/messages"),i=e("./zlib/zstream"),s=e("./zlib/gzheader"),_=Object.prototype.toString;function a(e){if(!(this instanceof a))return new a(e);this.options=d.assign({chunkSize:16384,windowBits:0,to:""},e||{});var t=this.options;t.raw&&0<=t.windowBits&&t.windowBits<16&&(t.windowBits=-t.windowBits,0===t.windowBits&&(t.windowBits=-15)),!(0<=t.windowBits&&t.windowBits<16)||e&&e.windowBits||(t.windowBits+=32),15<t.windowBits&&t.windowBits<48&&0==(15&t.windowBits)&&(t.windowBits|=15),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new i,this.strm.avail_out=0;var r=c.inflateInit2(this.strm,t.windowBits);if(r!==m.Z_OK)throw new Error(n[r]);this.header=new s,c.inflateGetHeader(this.strm,this.header)}function o(e,t){var r=new a(t);if(r.push(e,!0),r.err)throw r.msg||n[r.err];return r.result}a.prototype.push=function(e,t){var r,n,i,s,a,o,h=this.strm,u=this.options.chunkSize,l=this.options.dictionary,f=!1;if(this.ended)return!1;n=t===~~t?t:!0===t?m.Z_FINISH:m.Z_NO_FLUSH,"string"==typeof e?h.input=p.binstring2buf(e):"[object ArrayBuffer]"===_.call(e)?h.input=new Uint8Array(e):h.input=e,h.next_in=0,h.avail_in=h.input.length;do{if(0===h.avail_out&&(h.output=new d.Buf8(u),h.next_out=0,h.avail_out=u),(r=c.inflate(h,m.Z_NO_FLUSH))===m.Z_NEED_DICT&&l&&(o="string"==typeof l?p.string2buf(l):"[object ArrayBuffer]"===_.call(l)?new Uint8Array(l):l,r=c.inflateSetDictionary(this.strm,o)),r===m.Z_BUF_ERROR&&!0===f&&(r=m.Z_OK,f=!1),r!==m.Z_STREAM_END&&r!==m.Z_OK)return this.onEnd(r),!(this.ended=!0);h.next_out&&(0!==h.avail_out&&r!==m.Z_STREAM_END&&(0!==h.avail_in||n!==m.Z_FINISH&&n!==m.Z_SYNC_FLUSH)||("string"===this.options.to?(i=p.utf8border(h.output,h.next_out),s=h.next_out-i,a=p.buf2string(h.output,i),h.next_out=s,h.avail_out=u-s,s&&d.arraySet(h.output,h.output,i,s,0),this.onData(a)):this.onData(d.shrinkBuf(h.output,h.next_out)))),0===h.avail_in&&0===h.avail_out&&(f=!0)}while((0<h.avail_in||0===h.avail_out)&&r!==m.Z_STREAM_END);return r===m.Z_STREAM_END&&(n=m.Z_FINISH),n===m.Z_FINISH?(r=c.inflateEnd(this.strm),this.onEnd(r),this.ended=!0,r===m.Z_OK):n!==m.Z_SYNC_FLUSH||(this.onEnd(m.Z_OK),!(h.avail_out=0))},a.prototype.onData=function(e){this.chunks.push(e)},a.prototype.onEnd=function(e){e===m.Z_OK&&("string"===this.options.to?this.result=this.chunks.join(""):this.result=d.flattenChunks(this.chunks)),this.chunks=[],this.err=e,this.msg=this.strm.msg},r.Inflate=a,r.inflate=o,r.inflateRaw=function(e,t){return(t=t||{}).raw=!0,o(e,t)},r.ungzip=o},{"./utils/common":41,"./utils/strings":42,"./zlib/constants":44,"./zlib/gzheader":47,"./zlib/inflate":49,"./zlib/messages":51,"./zlib/zstream":53}],41:[function(e,t,r){"use strict";var n="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Int32Array;r.assign=function(e){for(var t=Array.prototype.slice.call(arguments,1);t.length;){var r=t.shift();if(r){if("object"!=typeof r)throw new TypeError(r+"must be non-object");for(var n in r)r.hasOwnProperty(n)&&(e[n]=r[n])}}return e},r.shrinkBuf=function(e,t){return e.length===t?e:e.subarray?e.subarray(0,t):(e.length=t,e)};var i={arraySet:function(e,t,r,n,i){if(t.subarray&&e.subarray)e.set(t.subarray(r,r+n),i);else for(var s=0;s<n;s++)e[i+s]=t[r+s]},flattenChunks:function(e){var t,r,n,i,s,a;for(t=n=0,r=e.length;t<r;t++)n+=e[t].length;for(a=new Uint8Array(n),t=i=0,r=e.length;t<r;t++)s=e[t],a.set(s,i),i+=s.length;return a}},s={arraySet:function(e,t,r,n,i){for(var s=0;s<n;s++)e[i+s]=t[r+s]},flattenChunks:function(e){return[].concat.apply([],e)}};r.setTyped=function(e){e?(r.Buf8=Uint8Array,r.Buf16=Uint16Array,r.Buf32=Int32Array,r.assign(r,i)):(r.Buf8=Array,r.Buf16=Array,r.Buf32=Array,r.assign(r,s))},r.setTyped(n)},{}],42:[function(e,t,r){"use strict";var h=e("./common"),i=!0,s=!0;try{String.fromCharCode.apply(null,[0])}catch(e){i=!1}try{String.fromCharCode.apply(null,new Uint8Array(1))}catch(e){s=!1}for(var u=new h.Buf8(256),n=0;n<256;n++)u[n]=252<=n?6:248<=n?5:240<=n?4:224<=n?3:192<=n?2:1;function l(e,t){if(t<65537&&(e.subarray&&s||!e.subarray&&i))return String.fromCharCode.apply(null,h.shrinkBuf(e,t));for(var r="",n=0;n<t;n++)r+=String.fromCharCode(e[n]);return r}u[254]=u[254]=1,r.string2buf=function(e){var t,r,n,i,s,a=e.length,o=0;for(i=0;i<a;i++)55296==(64512&(r=e.charCodeAt(i)))&&i+1<a&&56320==(64512&(n=e.charCodeAt(i+1)))&&(r=65536+(r-55296<<10)+(n-56320),i++),o+=r<128?1:r<2048?2:r<65536?3:4;for(t=new h.Buf8(o),i=s=0;s<o;i++)55296==(64512&(r=e.charCodeAt(i)))&&i+1<a&&56320==(64512&(n=e.charCodeAt(i+1)))&&(r=65536+(r-55296<<10)+(n-56320),i++),r<128?t[s++]=r:(r<2048?t[s++]=192|r>>>6:(r<65536?t[s++]=224|r>>>12:(t[s++]=240|r>>>18,t[s++]=128|r>>>12&63),t[s++]=128|r>>>6&63),t[s++]=128|63&r);return t},r.buf2binstring=function(e){return l(e,e.length)},r.binstring2buf=function(e){for(var t=new h.Buf8(e.length),r=0,n=t.length;r<n;r++)t[r]=e.charCodeAt(r);return t},r.buf2string=function(e,t){var r,n,i,s,a=t||e.length,o=new Array(2*a);for(r=n=0;r<a;)if((i=e[r++])<128)o[n++]=i;else if(4<(s=u[i]))o[n++]=65533,r+=s-1;else{for(i&=2===s?31:3===s?15:7;1<s&&r<a;)i=i<<6|63&e[r++],s--;1<s?o[n++]=65533:i<65536?o[n++]=i:(i-=65536,o[n++]=55296|i>>10&1023,o[n++]=56320|1023&i)}return l(o,n)},r.utf8border=function(e,t){var r;for((t=t||e.length)>e.length&&(t=e.length),r=t-1;0<=r&&128==(192&e[r]);)r--;return r<0?t:0===r?t:r+u[e[r]]>t?r:t}},{"./common":41}],43:[function(e,t,r){"use strict";t.exports=function(e,t,r,n){for(var i=65535&e|0,s=e>>>16&65535|0,a=0;0!==r;){for(r-=a=2e3<r?2e3:r;s=s+(i=i+t[n++]|0)|0,--a;);i%=65521,s%=65521}return i|s<<16|0}},{}],44:[function(e,t,r){"use strict";t.exports={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8}},{}],45:[function(e,t,r){"use strict";var o=function(){for(var e,t=[],r=0;r<256;r++){e=r;for(var n=0;n<8;n++)e=1&e?3988292384^e>>>1:e>>>1;t[r]=e}return t}();t.exports=function(e,t,r,n){var i=o,s=n+r;e^=-1;for(var a=n;a<s;a++)e=e>>>8^i[255&(e^t[a])];return-1^e}},{}],46:[function(e,t,r){"use strict";var h,c=e("../utils/common"),u=e("./trees"),d=e("./adler32"),p=e("./crc32"),n=e("./messages"),l=0,f=4,m=0,_=-2,g=-1,b=4,i=2,v=8,y=9,s=286,a=30,o=19,w=2*s+1,k=15,x=3,S=258,z=S+x+1,C=42,E=113,A=1,I=2,O=3,B=4;function R(e,t){return e.msg=n[t],t}function T(e){return(e<<1)-(4<e?9:0)}function D(e){for(var t=e.length;0<=--t;)e[t]=0}function F(e){var t=e.state,r=t.pending;r>e.avail_out&&(r=e.avail_out),0!==r&&(c.arraySet(e.output,t.pending_buf,t.pending_out,r,e.next_out),e.next_out+=r,t.pending_out+=r,e.total_out+=r,e.avail_out-=r,t.pending-=r,0===t.pending&&(t.pending_out=0))}function N(e,t){u._tr_flush_block(e,0<=e.block_start?e.block_start:-1,e.strstart-e.block_start,t),e.block_start=e.strstart,F(e.strm)}function U(e,t){e.pending_buf[e.pending++]=t}function P(e,t){e.pending_buf[e.pending++]=t>>>8&255,e.pending_buf[e.pending++]=255&t}function L(e,t){var r,n,i=e.max_chain_length,s=e.strstart,a=e.prev_length,o=e.nice_match,h=e.strstart>e.w_size-z?e.strstart-(e.w_size-z):0,u=e.window,l=e.w_mask,f=e.prev,c=e.strstart+S,d=u[s+a-1],p=u[s+a];e.prev_length>=e.good_match&&(i>>=2),o>e.lookahead&&(o=e.lookahead);do{if(u[(r=t)+a]===p&&u[r+a-1]===d&&u[r]===u[s]&&u[++r]===u[s+1]){s+=2,r++;do{}while(u[++s]===u[++r]&&u[++s]===u[++r]&&u[++s]===u[++r]&&u[++s]===u[++r]&&u[++s]===u[++r]&&u[++s]===u[++r]&&u[++s]===u[++r]&&u[++s]===u[++r]&&s<c);if(n=S-(c-s),s=c-S,a<n){if(e.match_start=t,o<=(a=n))break;d=u[s+a-1],p=u[s+a]}}}while((t=f[t&l])>h&&0!=--i);return a<=e.lookahead?a:e.lookahead}function j(e){var t,r,n,i,s,a,o,h,u,l,f=e.w_size;do{if(i=e.window_size-e.lookahead-e.strstart,e.strstart>=f+(f-z)){for(c.arraySet(e.window,e.window,f,f,0),e.match_start-=f,e.strstart-=f,e.block_start-=f,t=r=e.hash_size;n=e.head[--t],e.head[t]=f<=n?n-f:0,--r;);for(t=r=f;n=e.prev[--t],e.prev[t]=f<=n?n-f:0,--r;);i+=f}if(0===e.strm.avail_in)break;if(a=e.strm,o=e.window,h=e.strstart+e.lookahead,u=i,l=void 0,l=a.avail_in,u<l&&(l=u),r=0===l?0:(a.avail_in-=l,c.arraySet(o,a.input,a.next_in,l,h),1===a.state.wrap?a.adler=d(a.adler,o,l,h):2===a.state.wrap&&(a.adler=p(a.adler,o,l,h)),a.next_in+=l,a.total_in+=l,l),e.lookahead+=r,e.lookahead+e.insert>=x)for(s=e.strstart-e.insert,e.ins_h=e.window[s],e.ins_h=(e.ins_h<<e.hash_shift^e.window[s+1])&e.hash_mask;e.insert&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[s+x-1])&e.hash_mask,e.prev[s&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=s,s++,e.insert--,!(e.lookahead+e.insert<x)););}while(e.lookahead<z&&0!==e.strm.avail_in)}function Z(e,t){for(var r,n;;){if(e.lookahead<z){if(j(e),e.lookahead<z&&t===l)return A;if(0===e.lookahead)break}if(r=0,e.lookahead>=x&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+x-1])&e.hash_mask,r=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart),0!==r&&e.strstart-r<=e.w_size-z&&(e.match_length=L(e,r)),e.match_length>=x)if(n=u._tr_tally(e,e.strstart-e.match_start,e.match_length-x),e.lookahead-=e.match_length,e.match_length<=e.max_lazy_match&&e.lookahead>=x){for(e.match_length--;e.strstart++,e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+x-1])&e.hash_mask,r=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart,0!=--e.match_length;);e.strstart++}else e.strstart+=e.match_length,e.match_length=0,e.ins_h=e.window[e.strstart],e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+1])&e.hash_mask;else n=u._tr_tally(e,0,e.window[e.strstart]),e.lookahead--,e.strstart++;if(n&&(N(e,!1),0===e.strm.avail_out))return A}return e.insert=e.strstart<x-1?e.strstart:x-1,t===f?(N(e,!0),0===e.strm.avail_out?O:B):e.last_lit&&(N(e,!1),0===e.strm.avail_out)?A:I}function W(e,t){for(var r,n,i;;){if(e.lookahead<z){if(j(e),e.lookahead<z&&t===l)return A;if(0===e.lookahead)break}if(r=0,e.lookahead>=x&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+x-1])&e.hash_mask,r=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart),e.prev_length=e.match_length,e.prev_match=e.match_start,e.match_length=x-1,0!==r&&e.prev_length<e.max_lazy_match&&e.strstart-r<=e.w_size-z&&(e.match_length=L(e,r),e.match_length<=5&&(1===e.strategy||e.match_length===x&&4096<e.strstart-e.match_start)&&(e.match_length=x-1)),e.prev_length>=x&&e.match_length<=e.prev_length){for(i=e.strstart+e.lookahead-x,n=u._tr_tally(e,e.strstart-1-e.prev_match,e.prev_length-x),e.lookahead-=e.prev_length-1,e.prev_length-=2;++e.strstart<=i&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+x-1])&e.hash_mask,r=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart),0!=--e.prev_length;);if(e.match_available=0,e.match_length=x-1,e.strstart++,n&&(N(e,!1),0===e.strm.avail_out))return A}else if(e.match_available){if((n=u._tr_tally(e,0,e.window[e.strstart-1]))&&N(e,!1),e.strstart++,e.lookahead--,0===e.strm.avail_out)return A}else e.match_available=1,e.strstart++,e.lookahead--}return e.match_available&&(n=u._tr_tally(e,0,e.window[e.strstart-1]),e.match_available=0),e.insert=e.strstart<x-1?e.strstart:x-1,t===f?(N(e,!0),0===e.strm.avail_out?O:B):e.last_lit&&(N(e,!1),0===e.strm.avail_out)?A:I}function M(e,t,r,n,i){this.good_length=e,this.max_lazy=t,this.nice_length=r,this.max_chain=n,this.func=i}function H(){this.strm=null,this.status=0,this.pending_buf=null,this.pending_buf_size=0,this.pending_out=0,this.pending=0,this.wrap=0,this.gzhead=null,this.gzindex=0,this.method=v,this.last_flush=-1,this.w_size=0,this.w_bits=0,this.w_mask=0,this.window=null,this.window_size=0,this.prev=null,this.head=null,this.ins_h=0,this.hash_size=0,this.hash_bits=0,this.hash_mask=0,this.hash_shift=0,this.block_start=0,this.match_length=0,this.prev_match=0,this.match_available=0,this.strstart=0,this.match_start=0,this.lookahead=0,this.prev_length=0,this.max_chain_length=0,this.max_lazy_match=0,this.level=0,this.strategy=0,this.good_match=0,this.nice_match=0,this.dyn_ltree=new c.Buf16(2*w),this.dyn_dtree=new c.Buf16(2*(2*a+1)),this.bl_tree=new c.Buf16(2*(2*o+1)),D(this.dyn_ltree),D(this.dyn_dtree),D(this.bl_tree),this.l_desc=null,this.d_desc=null,this.bl_desc=null,this.bl_count=new c.Buf16(k+1),this.heap=new c.Buf16(2*s+1),D(this.heap),this.heap_len=0,this.heap_max=0,this.depth=new c.Buf16(2*s+1),D(this.depth),this.l_buf=0,this.lit_bufsize=0,this.last_lit=0,this.d_buf=0,this.opt_len=0,this.static_len=0,this.matches=0,this.insert=0,this.bi_buf=0,this.bi_valid=0}function G(e){var t;return e&&e.state?(e.total_in=e.total_out=0,e.data_type=i,(t=e.state).pending=0,t.pending_out=0,t.wrap<0&&(t.wrap=-t.wrap),t.status=t.wrap?C:E,e.adler=2===t.wrap?0:1,t.last_flush=l,u._tr_init(t),m):R(e,_)}function K(e){var t=G(e);return t===m&&function(e){e.window_size=2*e.w_size,D(e.head),e.max_lazy_match=h[e.level].max_lazy,e.good_match=h[e.level].good_length,e.nice_match=h[e.level].nice_length,e.max_chain_length=h[e.level].max_chain,e.strstart=0,e.block_start=0,e.lookahead=0,e.insert=0,e.match_length=e.prev_length=x-1,e.match_available=0,e.ins_h=0}(e.state),t}function Y(e,t,r,n,i,s){if(!e)return _;var a=1;if(t===g&&(t=6),n<0?(a=0,n=-n):15<n&&(a=2,n-=16),i<1||y<i||r!==v||n<8||15<n||t<0||9<t||s<0||b<s)return R(e,_);8===n&&(n=9);var o=new H;return(e.state=o).strm=e,o.wrap=a,o.gzhead=null,o.w_bits=n,o.w_size=1<<o.w_bits,o.w_mask=o.w_size-1,o.hash_bits=i+7,o.hash_size=1<<o.hash_bits,o.hash_mask=o.hash_size-1,o.hash_shift=~~((o.hash_bits+x-1)/x),o.window=new c.Buf8(2*o.w_size),o.head=new c.Buf16(o.hash_size),o.prev=new c.Buf16(o.w_size),o.lit_bufsize=1<<i+6,o.pending_buf_size=4*o.lit_bufsize,o.pending_buf=new c.Buf8(o.pending_buf_size),o.d_buf=1*o.lit_bufsize,o.l_buf=3*o.lit_bufsize,o.level=t,o.strategy=s,o.method=r,K(e)}h=[new M(0,0,0,0,function(e,t){var r=65535;for(r>e.pending_buf_size-5&&(r=e.pending_buf_size-5);;){if(e.lookahead<=1){if(j(e),0===e.lookahead&&t===l)return A;if(0===e.lookahead)break}e.strstart+=e.lookahead,e.lookahead=0;var n=e.block_start+r;if((0===e.strstart||e.strstart>=n)&&(e.lookahead=e.strstart-n,e.strstart=n,N(e,!1),0===e.strm.avail_out))return A;if(e.strstart-e.block_start>=e.w_size-z&&(N(e,!1),0===e.strm.avail_out))return A}return e.insert=0,t===f?(N(e,!0),0===e.strm.avail_out?O:B):(e.strstart>e.block_start&&(N(e,!1),e.strm.avail_out),A)}),new M(4,4,8,4,Z),new M(4,5,16,8,Z),new M(4,6,32,32,Z),new M(4,4,16,16,W),new M(8,16,32,32,W),new M(8,16,128,128,W),new M(8,32,128,256,W),new M(32,128,258,1024,W),new M(32,258,258,4096,W)],r.deflateInit=function(e,t){return Y(e,t,v,15,8,0)},r.deflateInit2=Y,r.deflateReset=K,r.deflateResetKeep=G,r.deflateSetHeader=function(e,t){return e&&e.state?2!==e.state.wrap?_:(e.state.gzhead=t,m):_},r.deflate=function(e,t){var r,n,i,s;if(!e||!e.state||5<t||t<0)return e?R(e,_):_;if(n=e.state,!e.output||!e.input&&0!==e.avail_in||666===n.status&&t!==f)return R(e,0===e.avail_out?-5:_);if(n.strm=e,r=n.last_flush,n.last_flush=t,n.status===C)if(2===n.wrap)e.adler=0,U(n,31),U(n,139),U(n,8),n.gzhead?(U(n,(n.gzhead.text?1:0)+(n.gzhead.hcrc?2:0)+(n.gzhead.extra?4:0)+(n.gzhead.name?8:0)+(n.gzhead.comment?16:0)),U(n,255&n.gzhead.time),U(n,n.gzhead.time>>8&255),U(n,n.gzhead.time>>16&255),U(n,n.gzhead.time>>24&255),U(n,9===n.level?2:2<=n.strategy||n.level<2?4:0),U(n,255&n.gzhead.os),n.gzhead.extra&&n.gzhead.extra.length&&(U(n,255&n.gzhead.extra.length),U(n,n.gzhead.extra.length>>8&255)),n.gzhead.hcrc&&(e.adler=p(e.adler,n.pending_buf,n.pending,0)),n.gzindex=0,n.status=69):(U(n,0),U(n,0),U(n,0),U(n,0),U(n,0),U(n,9===n.level?2:2<=n.strategy||n.level<2?4:0),U(n,3),n.status=E);else{var a=v+(n.w_bits-8<<4)<<8;a|=(2<=n.strategy||n.level<2?0:n.level<6?1:6===n.level?2:3)<<6,0!==n.strstart&&(a|=32),a+=31-a%31,n.status=E,P(n,a),0!==n.strstart&&(P(n,e.adler>>>16),P(n,65535&e.adler)),e.adler=1}if(69===n.status)if(n.gzhead.extra){for(i=n.pending;n.gzindex<(65535&n.gzhead.extra.length)&&(n.pending!==n.pending_buf_size||(n.gzhead.hcrc&&n.pending>i&&(e.adler=p(e.adler,n.pending_buf,n.pending-i,i)),F(e),i=n.pending,n.pending!==n.pending_buf_size));)U(n,255&n.gzhead.extra[n.gzindex]),n.gzindex++;n.gzhead.hcrc&&n.pending>i&&(e.adler=p(e.adler,n.pending_buf,n.pending-i,i)),n.gzindex===n.gzhead.extra.length&&(n.gzindex=0,n.status=73)}else n.status=73;if(73===n.status)if(n.gzhead.name){i=n.pending;do{if(n.pending===n.pending_buf_size&&(n.gzhead.hcrc&&n.pending>i&&(e.adler=p(e.adler,n.pending_buf,n.pending-i,i)),F(e),i=n.pending,n.pending===n.pending_buf_size)){s=1;break}s=n.gzindex<n.gzhead.name.length?255&n.gzhead.name.charCodeAt(n.gzindex++):0,U(n,s)}while(0!==s);n.gzhead.hcrc&&n.pending>i&&(e.adler=p(e.adler,n.pending_buf,n.pending-i,i)),0===s&&(n.gzindex=0,n.status=91)}else n.status=91;if(91===n.status)if(n.gzhead.comment){i=n.pending;do{if(n.pending===n.pending_buf_size&&(n.gzhead.hcrc&&n.pending>i&&(e.adler=p(e.adler,n.pending_buf,n.pending-i,i)),F(e),i=n.pending,n.pending===n.pending_buf_size)){s=1;break}s=n.gzindex<n.gzhead.comment.length?255&n.gzhead.comment.charCodeAt(n.gzindex++):0,U(n,s)}while(0!==s);n.gzhead.hcrc&&n.pending>i&&(e.adler=p(e.adler,n.pending_buf,n.pending-i,i)),0===s&&(n.status=103)}else n.status=103;if(103===n.status&&(n.gzhead.hcrc?(n.pending+2>n.pending_buf_size&&F(e),n.pending+2<=n.pending_buf_size&&(U(n,255&e.adler),U(n,e.adler>>8&255),e.adler=0,n.status=E)):n.status=E),0!==n.pending){if(F(e),0===e.avail_out)return n.last_flush=-1,m}else if(0===e.avail_in&&T(t)<=T(r)&&t!==f)return R(e,-5);if(666===n.status&&0!==e.avail_in)return R(e,-5);if(0!==e.avail_in||0!==n.lookahead||t!==l&&666!==n.status){var o=2===n.strategy?function(e,t){for(var r;;){if(0===e.lookahead&&(j(e),0===e.lookahead)){if(t===l)return A;break}if(e.match_length=0,r=u._tr_tally(e,0,e.window[e.strstart]),e.lookahead--,e.strstart++,r&&(N(e,!1),0===e.strm.avail_out))return A}return e.insert=0,t===f?(N(e,!0),0===e.strm.avail_out?O:B):e.last_lit&&(N(e,!1),0===e.strm.avail_out)?A:I}(n,t):3===n.strategy?function(e,t){for(var r,n,i,s,a=e.window;;){if(e.lookahead<=S){if(j(e),e.lookahead<=S&&t===l)return A;if(0===e.lookahead)break}if(e.match_length=0,e.lookahead>=x&&0<e.strstart&&(n=a[i=e.strstart-1])===a[++i]&&n===a[++i]&&n===a[++i]){s=e.strstart+S;do{}while(n===a[++i]&&n===a[++i]&&n===a[++i]&&n===a[++i]&&n===a[++i]&&n===a[++i]&&n===a[++i]&&n===a[++i]&&i<s);e.match_length=S-(s-i),e.match_length>e.lookahead&&(e.match_length=e.lookahead)}if(e.match_length>=x?(r=u._tr_tally(e,1,e.match_length-x),e.lookahead-=e.match_length,e.strstart+=e.match_length,e.match_length=0):(r=u._tr_tally(e,0,e.window[e.strstart]),e.lookahead--,e.strstart++),r&&(N(e,!1),0===e.strm.avail_out))return A}return e.insert=0,t===f?(N(e,!0),0===e.strm.avail_out?O:B):e.last_lit&&(N(e,!1),0===e.strm.avail_out)?A:I}(n,t):h[n.level].func(n,t);if(o!==O&&o!==B||(n.status=666),o===A||o===O)return 0===e.avail_out&&(n.last_flush=-1),m;if(o===I&&(1===t?u._tr_align(n):5!==t&&(u._tr_stored_block(n,0,0,!1),3===t&&(D(n.head),0===n.lookahead&&(n.strstart=0,n.block_start=0,n.insert=0))),F(e),0===e.avail_out))return n.last_flush=-1,m}return t!==f?m:n.wrap<=0?1:(2===n.wrap?(U(n,255&e.adler),U(n,e.adler>>8&255),U(n,e.adler>>16&255),U(n,e.adler>>24&255),U(n,255&e.total_in),U(n,e.total_in>>8&255),U(n,e.total_in>>16&255),U(n,e.total_in>>24&255)):(P(n,e.adler>>>16),P(n,65535&e.adler)),F(e),0<n.wrap&&(n.wrap=-n.wrap),0!==n.pending?m:1)},r.deflateEnd=function(e){var t;return e&&e.state?(t=e.state.status)!==C&&69!==t&&73!==t&&91!==t&&103!==t&&t!==E&&666!==t?R(e,_):(e.state=null,t===E?R(e,-3):m):_},r.deflateSetDictionary=function(e,t){var r,n,i,s,a,o,h,u,l=t.length;if(!e||!e.state)return _;if(2===(s=(r=e.state).wrap)||1===s&&r.status!==C||r.lookahead)return _;for(1===s&&(e.adler=d(e.adler,t,l,0)),r.wrap=0,l>=r.w_size&&(0===s&&(D(r.head),r.strstart=0,r.block_start=0,r.insert=0),u=new c.Buf8(r.w_size),c.arraySet(u,t,l-r.w_size,r.w_size,0),t=u,l=r.w_size),a=e.avail_in,o=e.next_in,h=e.input,e.avail_in=l,e.next_in=0,e.input=t,j(r);r.lookahead>=x;){for(n=r.strstart,i=r.lookahead-(x-1);r.ins_h=(r.ins_h<<r.hash_shift^r.window[n+x-1])&r.hash_mask,r.prev[n&r.w_mask]=r.head[r.ins_h],r.head[r.ins_h]=n,n++,--i;);r.strstart=n,r.lookahead=x-1,j(r)}return r.strstart+=r.lookahead,r.block_start=r.strstart,r.insert=r.lookahead,r.lookahead=0,r.match_length=r.prev_length=x-1,r.match_available=0,e.next_in=o,e.input=h,e.avail_in=a,r.wrap=s,m},r.deflateInfo="pako deflate (from Nodeca project)"},{"../utils/common":41,"./adler32":43,"./crc32":45,"./messages":51,"./trees":52}],47:[function(e,t,r){"use strict";t.exports=function(){this.text=0,this.time=0,this.xflags=0,this.os=0,this.extra=null,this.extra_len=0,this.name="",this.comment="",this.hcrc=0,this.done=!1}},{}],48:[function(e,t,r){"use strict";t.exports=function(e,t){var r,n,i,s,a,o,h,u,l,f,c,d,p,m,_,g,b,v,y,w,k,x,S,z,C;r=e.state,n=e.next_in,z=e.input,i=n+(e.avail_in-5),s=e.next_out,C=e.output,a=s-(t-e.avail_out),o=s+(e.avail_out-257),h=r.dmax,u=r.wsize,l=r.whave,f=r.wnext,c=r.window,d=r.hold,p=r.bits,m=r.lencode,_=r.distcode,g=(1<<r.lenbits)-1,b=(1<<r.distbits)-1;e:do{p<15&&(d+=z[n++]<<p,p+=8,d+=z[n++]<<p,p+=8),v=m[d&g];t:for(;;){if(d>>>=y=v>>>24,p-=y,0===(y=v>>>16&255))C[s++]=65535&v;else{if(!(16&y)){if(0==(64&y)){v=m[(65535&v)+(d&(1<<y)-1)];continue t}if(32&y){r.mode=12;break e}e.msg="invalid literal/length code",r.mode=30;break e}w=65535&v,(y&=15)&&(p<y&&(d+=z[n++]<<p,p+=8),w+=d&(1<<y)-1,d>>>=y,p-=y),p<15&&(d+=z[n++]<<p,p+=8,d+=z[n++]<<p,p+=8),v=_[d&b];r:for(;;){if(d>>>=y=v>>>24,p-=y,!(16&(y=v>>>16&255))){if(0==(64&y)){v=_[(65535&v)+(d&(1<<y)-1)];continue r}e.msg="invalid distance code",r.mode=30;break e}if(k=65535&v,p<(y&=15)&&(d+=z[n++]<<p,(p+=8)<y&&(d+=z[n++]<<p,p+=8)),h<(k+=d&(1<<y)-1)){e.msg="invalid distance too far back",r.mode=30;break e}if(d>>>=y,p-=y,(y=s-a)<k){if(l<(y=k-y)&&r.sane){e.msg="invalid distance too far back",r.mode=30;break e}if(S=c,(x=0)===f){if(x+=u-y,y<w){for(w-=y;C[s++]=c[x++],--y;);x=s-k,S=C}}else if(f<y){if(x+=u+f-y,(y-=f)<w){for(w-=y;C[s++]=c[x++],--y;);if(x=0,f<w){for(w-=y=f;C[s++]=c[x++],--y;);x=s-k,S=C}}}else if(x+=f-y,y<w){for(w-=y;C[s++]=c[x++],--y;);x=s-k,S=C}for(;2<w;)C[s++]=S[x++],C[s++]=S[x++],C[s++]=S[x++],w-=3;w&&(C[s++]=S[x++],1<w&&(C[s++]=S[x++]))}else{for(x=s-k;C[s++]=C[x++],C[s++]=C[x++],C[s++]=C[x++],2<(w-=3););w&&(C[s++]=C[x++],1<w&&(C[s++]=C[x++]))}break}}break}}while(n<i&&s<o);n-=w=p>>3,d&=(1<<(p-=w<<3))-1,e.next_in=n,e.next_out=s,e.avail_in=n<i?i-n+5:5-(n-i),e.avail_out=s<o?o-s+257:257-(s-o),r.hold=d,r.bits=p}},{}],49:[function(e,t,r){"use strict";var I=e("../utils/common"),O=e("./adler32"),B=e("./crc32"),R=e("./inffast"),T=e("./inftrees"),D=1,F=2,N=0,U=-2,P=1,n=852,i=592;function L(e){return(e>>>24&255)+(e>>>8&65280)+((65280&e)<<8)+((255&e)<<24)}function s(){this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new I.Buf16(320),this.work=new I.Buf16(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0}function a(e){var t;return e&&e.state?(t=e.state,e.total_in=e.total_out=t.total=0,e.msg="",t.wrap&&(e.adler=1&t.wrap),t.mode=P,t.last=0,t.havedict=0,t.dmax=32768,t.head=null,t.hold=0,t.bits=0,t.lencode=t.lendyn=new I.Buf32(n),t.distcode=t.distdyn=new I.Buf32(i),t.sane=1,t.back=-1,N):U}function o(e){var t;return e&&e.state?((t=e.state).wsize=0,t.whave=0,t.wnext=0,a(e)):U}function h(e,t){var r,n;return e&&e.state?(n=e.state,t<0?(r=0,t=-t):(r=1+(t>>4),t<48&&(t&=15)),t&&(t<8||15<t)?U:(null!==n.window&&n.wbits!==t&&(n.window=null),n.wrap=r,n.wbits=t,o(e))):U}function u(e,t){var r,n;return e?(n=new s,(e.state=n).window=null,(r=h(e,t))!==N&&(e.state=null),r):U}var l,f,c=!0;function j(e){if(c){var t;for(l=new I.Buf32(512),f=new I.Buf32(32),t=0;t<144;)e.lens[t++]=8;for(;t<256;)e.lens[t++]=9;for(;t<280;)e.lens[t++]=7;for(;t<288;)e.lens[t++]=8;for(T(D,e.lens,0,288,l,0,e.work,{bits:9}),t=0;t<32;)e.lens[t++]=5;T(F,e.lens,0,32,f,0,e.work,{bits:5}),c=!1}e.lencode=l,e.lenbits=9,e.distcode=f,e.distbits=5}function Z(e,t,r,n){var i,s=e.state;return null===s.window&&(s.wsize=1<<s.wbits,s.wnext=0,s.whave=0,s.window=new I.Buf8(s.wsize)),n>=s.wsize?(I.arraySet(s.window,t,r-s.wsize,s.wsize,0),s.wnext=0,s.whave=s.wsize):(n<(i=s.wsize-s.wnext)&&(i=n),I.arraySet(s.window,t,r-n,i,s.wnext),(n-=i)?(I.arraySet(s.window,t,r-n,n,0),s.wnext=n,s.whave=s.wsize):(s.wnext+=i,s.wnext===s.wsize&&(s.wnext=0),s.whave<s.wsize&&(s.whave+=i))),0}r.inflateReset=o,r.inflateReset2=h,r.inflateResetKeep=a,r.inflateInit=function(e){return u(e,15)},r.inflateInit2=u,r.inflate=function(e,t){var r,n,i,s,a,o,h,u,l,f,c,d,p,m,_,g,b,v,y,w,k,x,S,z,C=0,E=new I.Buf8(4),A=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];if(!e||!e.state||!e.output||!e.input&&0!==e.avail_in)return U;12===(r=e.state).mode&&(r.mode=13),a=e.next_out,i=e.output,h=e.avail_out,s=e.next_in,n=e.input,o=e.avail_in,u=r.hold,l=r.bits,f=o,c=h,x=N;e:for(;;)switch(r.mode){case P:if(0===r.wrap){r.mode=13;break}for(;l<16;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}if(2&r.wrap&&35615===u){E[r.check=0]=255&u,E[1]=u>>>8&255,r.check=B(r.check,E,2,0),l=u=0,r.mode=2;break}if(r.flags=0,r.head&&(r.head.done=!1),!(1&r.wrap)||(((255&u)<<8)+(u>>8))%31){e.msg="incorrect header check",r.mode=30;break}if(8!=(15&u)){e.msg="unknown compression method",r.mode=30;break}if(l-=4,k=8+(15&(u>>>=4)),0===r.wbits)r.wbits=k;else if(k>r.wbits){e.msg="invalid window size",r.mode=30;break}r.dmax=1<<k,e.adler=r.check=1,r.mode=512&u?10:12,l=u=0;break;case 2:for(;l<16;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}if(r.flags=u,8!=(255&r.flags)){e.msg="unknown compression method",r.mode=30;break}if(57344&r.flags){e.msg="unknown header flags set",r.mode=30;break}r.head&&(r.head.text=u>>8&1),512&r.flags&&(E[0]=255&u,E[1]=u>>>8&255,r.check=B(r.check,E,2,0)),l=u=0,r.mode=3;case 3:for(;l<32;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}r.head&&(r.head.time=u),512&r.flags&&(E[0]=255&u,E[1]=u>>>8&255,E[2]=u>>>16&255,E[3]=u>>>24&255,r.check=B(r.check,E,4,0)),l=u=0,r.mode=4;case 4:for(;l<16;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}r.head&&(r.head.xflags=255&u,r.head.os=u>>8),512&r.flags&&(E[0]=255&u,E[1]=u>>>8&255,r.check=B(r.check,E,2,0)),l=u=0,r.mode=5;case 5:if(1024&r.flags){for(;l<16;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}r.length=u,r.head&&(r.head.extra_len=u),512&r.flags&&(E[0]=255&u,E[1]=u>>>8&255,r.check=B(r.check,E,2,0)),l=u=0}else r.head&&(r.head.extra=null);r.mode=6;case 6:if(1024&r.flags&&(o<(d=r.length)&&(d=o),d&&(r.head&&(k=r.head.extra_len-r.length,r.head.extra||(r.head.extra=new Array(r.head.extra_len)),I.arraySet(r.head.extra,n,s,d,k)),512&r.flags&&(r.check=B(r.check,n,d,s)),o-=d,s+=d,r.length-=d),r.length))break e;r.length=0,r.mode=7;case 7:if(2048&r.flags){if(0===o)break e;for(d=0;k=n[s+d++],r.head&&k&&r.length<65536&&(r.head.name+=String.fromCharCode(k)),k&&d<o;);if(512&r.flags&&(r.check=B(r.check,n,d,s)),o-=d,s+=d,k)break e}else r.head&&(r.head.name=null);r.length=0,r.mode=8;case 8:if(4096&r.flags){if(0===o)break e;for(d=0;k=n[s+d++],r.head&&k&&r.length<65536&&(r.head.comment+=String.fromCharCode(k)),k&&d<o;);if(512&r.flags&&(r.check=B(r.check,n,d,s)),o-=d,s+=d,k)break e}else r.head&&(r.head.comment=null);r.mode=9;case 9:if(512&r.flags){for(;l<16;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}if(u!==(65535&r.check)){e.msg="header crc mismatch",r.mode=30;break}l=u=0}r.head&&(r.head.hcrc=r.flags>>9&1,r.head.done=!0),e.adler=r.check=0,r.mode=12;break;case 10:for(;l<32;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}e.adler=r.check=L(u),l=u=0,r.mode=11;case 11:if(0===r.havedict)return e.next_out=a,e.avail_out=h,e.next_in=s,e.avail_in=o,r.hold=u,r.bits=l,2;e.adler=r.check=1,r.mode=12;case 12:if(5===t||6===t)break e;case 13:if(r.last){u>>>=7&l,l-=7&l,r.mode=27;break}for(;l<3;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}switch(r.last=1&u,l-=1,3&(u>>>=1)){case 0:r.mode=14;break;case 1:if(j(r),r.mode=20,6!==t)break;u>>>=2,l-=2;break e;case 2:r.mode=17;break;case 3:e.msg="invalid block type",r.mode=30}u>>>=2,l-=2;break;case 14:for(u>>>=7&l,l-=7&l;l<32;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}if((65535&u)!=(u>>>16^65535)){e.msg="invalid stored block lengths",r.mode=30;break}if(r.length=65535&u,l=u=0,r.mode=15,6===t)break e;case 15:r.mode=16;case 16:if(d=r.length){if(o<d&&(d=o),h<d&&(d=h),0===d)break e;I.arraySet(i,n,s,d,a),o-=d,s+=d,h-=d,a+=d,r.length-=d;break}r.mode=12;break;case 17:for(;l<14;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}if(r.nlen=257+(31&u),u>>>=5,l-=5,r.ndist=1+(31&u),u>>>=5,l-=5,r.ncode=4+(15&u),u>>>=4,l-=4,286<r.nlen||30<r.ndist){e.msg="too many length or distance symbols",r.mode=30;break}r.have=0,r.mode=18;case 18:for(;r.have<r.ncode;){for(;l<3;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}r.lens[A[r.have++]]=7&u,u>>>=3,l-=3}for(;r.have<19;)r.lens[A[r.have++]]=0;if(r.lencode=r.lendyn,r.lenbits=7,S={bits:r.lenbits},x=T(0,r.lens,0,19,r.lencode,0,r.work,S),r.lenbits=S.bits,x){e.msg="invalid code lengths set",r.mode=30;break}r.have=0,r.mode=19;case 19:for(;r.have<r.nlen+r.ndist;){for(;g=(C=r.lencode[u&(1<<r.lenbits)-1])>>>16&255,b=65535&C,!((_=C>>>24)<=l);){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}if(b<16)u>>>=_,l-=_,r.lens[r.have++]=b;else{if(16===b){for(z=_+2;l<z;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}if(u>>>=_,l-=_,0===r.have){e.msg="invalid bit length repeat",r.mode=30;break}k=r.lens[r.have-1],d=3+(3&u),u>>>=2,l-=2}else if(17===b){for(z=_+3;l<z;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}l-=_,k=0,d=3+(7&(u>>>=_)),u>>>=3,l-=3}else{for(z=_+7;l<z;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}l-=_,k=0,d=11+(127&(u>>>=_)),u>>>=7,l-=7}if(r.have+d>r.nlen+r.ndist){e.msg="invalid bit length repeat",r.mode=30;break}for(;d--;)r.lens[r.have++]=k}}if(30===r.mode)break;if(0===r.lens[256]){e.msg="invalid code -- missing end-of-block",r.mode=30;break}if(r.lenbits=9,S={bits:r.lenbits},x=T(D,r.lens,0,r.nlen,r.lencode,0,r.work,S),r.lenbits=S.bits,x){e.msg="invalid literal/lengths set",r.mode=30;break}if(r.distbits=6,r.distcode=r.distdyn,S={bits:r.distbits},x=T(F,r.lens,r.nlen,r.ndist,r.distcode,0,r.work,S),r.distbits=S.bits,x){e.msg="invalid distances set",r.mode=30;break}if(r.mode=20,6===t)break e;case 20:r.mode=21;case 21:if(6<=o&&258<=h){e.next_out=a,e.avail_out=h,e.next_in=s,e.avail_in=o,r.hold=u,r.bits=l,R(e,c),a=e.next_out,i=e.output,h=e.avail_out,s=e.next_in,n=e.input,o=e.avail_in,u=r.hold,l=r.bits,12===r.mode&&(r.back=-1);break}for(r.back=0;g=(C=r.lencode[u&(1<<r.lenbits)-1])>>>16&255,b=65535&C,!((_=C>>>24)<=l);){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}if(g&&0==(240&g)){for(v=_,y=g,w=b;g=(C=r.lencode[w+((u&(1<<v+y)-1)>>v)])>>>16&255,b=65535&C,!(v+(_=C>>>24)<=l);){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}u>>>=v,l-=v,r.back+=v}if(u>>>=_,l-=_,r.back+=_,r.length=b,0===g){r.mode=26;break}if(32&g){r.back=-1,r.mode=12;break}if(64&g){e.msg="invalid literal/length code",r.mode=30;break}r.extra=15&g,r.mode=22;case 22:if(r.extra){for(z=r.extra;l<z;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}r.length+=u&(1<<r.extra)-1,u>>>=r.extra,l-=r.extra,r.back+=r.extra}r.was=r.length,r.mode=23;case 23:for(;g=(C=r.distcode[u&(1<<r.distbits)-1])>>>16&255,b=65535&C,!((_=C>>>24)<=l);){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}if(0==(240&g)){for(v=_,y=g,w=b;g=(C=r.distcode[w+((u&(1<<v+y)-1)>>v)])>>>16&255,b=65535&C,!(v+(_=C>>>24)<=l);){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}u>>>=v,l-=v,r.back+=v}if(u>>>=_,l-=_,r.back+=_,64&g){e.msg="invalid distance code",r.mode=30;break}r.offset=b,r.extra=15&g,r.mode=24;case 24:if(r.extra){for(z=r.extra;l<z;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}r.offset+=u&(1<<r.extra)-1,u>>>=r.extra,l-=r.extra,r.back+=r.extra}if(r.offset>r.dmax){e.msg="invalid distance too far back",r.mode=30;break}r.mode=25;case 25:if(0===h)break e;if(d=c-h,r.offset>d){if((d=r.offset-d)>r.whave&&r.sane){e.msg="invalid distance too far back",r.mode=30;break}p=d>r.wnext?(d-=r.wnext,r.wsize-d):r.wnext-d,d>r.length&&(d=r.length),m=r.window}else m=i,p=a-r.offset,d=r.length;for(h<d&&(d=h),h-=d,r.length-=d;i[a++]=m[p++],--d;);0===r.length&&(r.mode=21);break;case 26:if(0===h)break e;i[a++]=r.length,h--,r.mode=21;break;case 27:if(r.wrap){for(;l<32;){if(0===o)break e;o--,u|=n[s++]<<l,l+=8}if(c-=h,e.total_out+=c,r.total+=c,c&&(e.adler=r.check=r.flags?B(r.check,i,c,a-c):O(r.check,i,c,a-c)),c=h,(r.flags?u:L(u))!==r.check){e.msg="incorrect data check",r.mode=30;break}l=u=0}r.mode=28;case 28:if(r.wrap&&r.flags){for(;l<32;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}if(u!==(4294967295&r.total)){e.msg="incorrect length check",r.mode=30;break}l=u=0}r.mode=29;case 29:x=1;break e;case 30:x=-3;break e;case 31:return-4;case 32:default:return U}return e.next_out=a,e.avail_out=h,e.next_in=s,e.avail_in=o,r.hold=u,r.bits=l,(r.wsize||c!==e.avail_out&&r.mode<30&&(r.mode<27||4!==t))&&Z(e,e.output,e.next_out,c-e.avail_out)?(r.mode=31,-4):(f-=e.avail_in,c-=e.avail_out,e.total_in+=f,e.total_out+=c,r.total+=c,r.wrap&&c&&(e.adler=r.check=r.flags?B(r.check,i,c,e.next_out-c):O(r.check,i,c,e.next_out-c)),e.data_type=r.bits+(r.last?64:0)+(12===r.mode?128:0)+(20===r.mode||15===r.mode?256:0),(0==f&&0===c||4===t)&&x===N&&(x=-5),x)},r.inflateEnd=function(e){if(!e||!e.state)return U;var t=e.state;return t.window&&(t.window=null),e.state=null,N},r.inflateGetHeader=function(e,t){var r;return e&&e.state?0==(2&(r=e.state).wrap)?U:((r.head=t).done=!1,N):U},r.inflateSetDictionary=function(e,t){var r,n=t.length;return e&&e.state?0!==(r=e.state).wrap&&11!==r.mode?U:11===r.mode&&O(1,t,n,0)!==r.check?-3:Z(e,t,n,n)?(r.mode=31,-4):(r.havedict=1,N):U},r.inflateInfo="pako inflate (from Nodeca project)"},{"../utils/common":41,"./adler32":43,"./crc32":45,"./inffast":48,"./inftrees":50}],50:[function(e,t,r){"use strict";var D=e("../utils/common"),F=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],N=[16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78],U=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0],P=[16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64];t.exports=function(e,t,r,n,i,s,a,o){var h,u,l,f,c,d,p,m,_,g=o.bits,b=0,v=0,y=0,w=0,k=0,x=0,S=0,z=0,C=0,E=0,A=null,I=0,O=new D.Buf16(16),B=new D.Buf16(16),R=null,T=0;for(b=0;b<=15;b++)O[b]=0;for(v=0;v<n;v++)O[t[r+v]]++;for(k=g,w=15;1<=w&&0===O[w];w--);if(w<k&&(k=w),0===w)return i[s++]=20971520,i[s++]=20971520,o.bits=1,0;for(y=1;y<w&&0===O[y];y++);for(k<y&&(k=y),b=z=1;b<=15;b++)if(z<<=1,(z-=O[b])<0)return-1;if(0<z&&(0===e||1!==w))return-1;for(B[1]=0,b=1;b<15;b++)B[b+1]=B[b]+O[b];for(v=0;v<n;v++)0!==t[r+v]&&(a[B[t[r+v]]++]=v);if(d=0===e?(A=R=a,19):1===e?(A=F,I-=257,R=N,T-=257,256):(A=U,R=P,-1),b=y,c=s,S=v=E=0,l=-1,f=(C=1<<(x=k))-1,1===e&&852<C||2===e&&592<C)return 1;for(;;){for(p=b-S,_=a[v]<d?(m=0,a[v]):a[v]>d?(m=R[T+a[v]],A[I+a[v]]):(m=96,0),h=1<<b-S,y=u=1<<x;i[c+(E>>S)+(u-=h)]=p<<24|m<<16|_|0,0!==u;);for(h=1<<b-1;E&h;)h>>=1;if(0!==h?(E&=h-1,E+=h):E=0,v++,0==--O[b]){if(b===w)break;b=t[r+a[v]]}if(k<b&&(E&f)!==l){for(0===S&&(S=k),c+=y,z=1<<(x=b-S);x+S<w&&!((z-=O[x+S])<=0);)x++,z<<=1;if(C+=1<<x,1===e&&852<C||2===e&&592<C)return 1;i[l=E&f]=k<<24|x<<16|c-s|0}}return 0!==E&&(i[c+E]=b-S<<24|64<<16|0),o.bits=k,0}},{"../utils/common":41}],51:[function(e,t,r){"use strict";t.exports={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"}},{}],52:[function(e,t,r){"use strict";var i=e("../utils/common"),o=0,h=1;function n(e){for(var t=e.length;0<=--t;)e[t]=0}var s=0,a=29,u=256,l=u+1+a,f=30,c=19,_=2*l+1,g=15,d=16,p=7,m=256,b=16,v=17,y=18,w=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],k=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],x=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7],S=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],z=new Array(2*(l+2));n(z);var C=new Array(2*f);n(C);var E=new Array(512);n(E);var A=new Array(256);n(A);var I=new Array(a);n(I);var O,B,R,T=new Array(f);function D(e,t,r,n,i){this.static_tree=e,this.extra_bits=t,this.extra_base=r,this.elems=n,this.max_length=i,this.has_stree=e&&e.length}function F(e,t){this.dyn_tree=e,this.max_code=0,this.stat_desc=t}function N(e){return e<256?E[e]:E[256+(e>>>7)]}function U(e,t){e.pending_buf[e.pending++]=255&t,e.pending_buf[e.pending++]=t>>>8&255}function P(e,t,r){e.bi_valid>d-r?(e.bi_buf|=t<<e.bi_valid&65535,U(e,e.bi_buf),e.bi_buf=t>>d-e.bi_valid,e.bi_valid+=r-d):(e.bi_buf|=t<<e.bi_valid&65535,e.bi_valid+=r)}function L(e,t,r){P(e,r[2*t],r[2*t+1])}function j(e,t){for(var r=0;r|=1&e,e>>>=1,r<<=1,0<--t;);return r>>>1}function Z(e,t,r){var n,i,s=new Array(g+1),a=0;for(n=1;n<=g;n++)s[n]=a=a+r[n-1]<<1;for(i=0;i<=t;i++){var o=e[2*i+1];0!==o&&(e[2*i]=j(s[o]++,o))}}function W(e){var t;for(t=0;t<l;t++)e.dyn_ltree[2*t]=0;for(t=0;t<f;t++)e.dyn_dtree[2*t]=0;for(t=0;t<c;t++)e.bl_tree[2*t]=0;e.dyn_ltree[2*m]=1,e.opt_len=e.static_len=0,e.last_lit=e.matches=0}function M(e){8<e.bi_valid?U(e,e.bi_buf):0<e.bi_valid&&(e.pending_buf[e.pending++]=e.bi_buf),e.bi_buf=0,e.bi_valid=0}function H(e,t,r,n){var i=2*t,s=2*r;return e[i]<e[s]||e[i]===e[s]&&n[t]<=n[r]}function G(e,t,r){for(var n=e.heap[r],i=r<<1;i<=e.heap_len&&(i<e.heap_len&&H(t,e.heap[i+1],e.heap[i],e.depth)&&i++,!H(t,n,e.heap[i],e.depth));)e.heap[r]=e.heap[i],r=i,i<<=1;e.heap[r]=n}function K(e,t,r){var n,i,s,a,o=0;if(0!==e.last_lit)for(;n=e.pending_buf[e.d_buf+2*o]<<8|e.pending_buf[e.d_buf+2*o+1],i=e.pending_buf[e.l_buf+o],o++,0===n?L(e,i,t):(L(e,(s=A[i])+u+1,t),0!==(a=w[s])&&P(e,i-=I[s],a),L(e,s=N(--n),r),0!==(a=k[s])&&P(e,n-=T[s],a)),o<e.last_lit;);L(e,m,t)}function Y(e,t){var r,n,i,s=t.dyn_tree,a=t.stat_desc.static_tree,o=t.stat_desc.has_stree,h=t.stat_desc.elems,u=-1;for(e.heap_len=0,e.heap_max=_,r=0;r<h;r++)0!==s[2*r]?(e.heap[++e.heap_len]=u=r,e.depth[r]=0):s[2*r+1]=0;for(;e.heap_len<2;)s[2*(i=e.heap[++e.heap_len]=u<2?++u:0)]=1,e.depth[i]=0,e.opt_len--,o&&(e.static_len-=a[2*i+1]);for(t.max_code=u,r=e.heap_len>>1;1<=r;r--)G(e,s,r);for(i=h;r=e.heap[1],e.heap[1]=e.heap[e.heap_len--],G(e,s,1),n=e.heap[1],e.heap[--e.heap_max]=r,e.heap[--e.heap_max]=n,s[2*i]=s[2*r]+s[2*n],e.depth[i]=(e.depth[r]>=e.depth[n]?e.depth[r]:e.depth[n])+1,s[2*r+1]=s[2*n+1]=i,e.heap[1]=i++,G(e,s,1),2<=e.heap_len;);e.heap[--e.heap_max]=e.heap[1],function(e,t){var r,n,i,s,a,o,h=t.dyn_tree,u=t.max_code,l=t.stat_desc.static_tree,f=t.stat_desc.has_stree,c=t.stat_desc.extra_bits,d=t.stat_desc.extra_base,p=t.stat_desc.max_length,m=0;for(s=0;s<=g;s++)e.bl_count[s]=0;for(h[2*e.heap[e.heap_max]+1]=0,r=e.heap_max+1;r<_;r++)p<(s=h[2*h[2*(n=e.heap[r])+1]+1]+1)&&(s=p,m++),h[2*n+1]=s,u<n||(e.bl_count[s]++,a=0,d<=n&&(a=c[n-d]),o=h[2*n],e.opt_len+=o*(s+a),f&&(e.static_len+=o*(l[2*n+1]+a)));if(0!==m){do{for(s=p-1;0===e.bl_count[s];)s--;e.bl_count[s]--,e.bl_count[s+1]+=2,e.bl_count[p]--,m-=2}while(0<m);for(s=p;0!==s;s--)for(n=e.bl_count[s];0!==n;)u<(i=e.heap[--r])||(h[2*i+1]!==s&&(e.opt_len+=(s-h[2*i+1])*h[2*i],h[2*i+1]=s),n--)}}(e,t),Z(s,u,e.bl_count)}function X(e,t,r){var n,i,s=-1,a=t[1],o=0,h=7,u=4;for(0===a&&(h=138,u=3),t[2*(r+1)+1]=65535,n=0;n<=r;n++)i=a,a=t[2*(n+1)+1],++o<h&&i===a||(o<u?e.bl_tree[2*i]+=o:0!==i?(i!==s&&e.bl_tree[2*i]++,e.bl_tree[2*b]++):o<=10?e.bl_tree[2*v]++:e.bl_tree[2*y]++,s=i,u=(o=0)===a?(h=138,3):i===a?(h=6,3):(h=7,4))}function V(e,t,r){var n,i,s=-1,a=t[1],o=0,h=7,u=4;for(0===a&&(h=138,u=3),n=0;n<=r;n++)if(i=a,a=t[2*(n+1)+1],!(++o<h&&i===a)){if(o<u)for(;L(e,i,e.bl_tree),0!=--o;);else 0!==i?(i!==s&&(L(e,i,e.bl_tree),o--),L(e,b,e.bl_tree),P(e,o-3,2)):o<=10?(L(e,v,e.bl_tree),P(e,o-3,3)):(L(e,y,e.bl_tree),P(e,o-11,7));s=i,u=(o=0)===a?(h=138,3):i===a?(h=6,3):(h=7,4)}}n(T);var q=!1;function J(e,t,r,n){P(e,(s<<1)+(n?1:0),3),function(e,t,r,n){M(e),n&&(U(e,r),U(e,~r)),i.arraySet(e.pending_buf,e.window,t,r,e.pending),e.pending+=r}(e,t,r,!0)}r._tr_init=function(e){q||(function(){var e,t,r,n,i,s=new Array(g+1);for(n=r=0;n<a-1;n++)for(I[n]=r,e=0;e<1<<w[n];e++)A[r++]=n;for(A[r-1]=n,n=i=0;n<16;n++)for(T[n]=i,e=0;e<1<<k[n];e++)E[i++]=n;for(i>>=7;n<f;n++)for(T[n]=i<<7,e=0;e<1<<k[n]-7;e++)E[256+i++]=n;for(t=0;t<=g;t++)s[t]=0;for(e=0;e<=143;)z[2*e+1]=8,e++,s[8]++;for(;e<=255;)z[2*e+1]=9,e++,s[9]++;for(;e<=279;)z[2*e+1]=7,e++,s[7]++;for(;e<=287;)z[2*e+1]=8,e++,s[8]++;for(Z(z,l+1,s),e=0;e<f;e++)C[2*e+1]=5,C[2*e]=j(e,5);O=new D(z,w,u+1,l,g),B=new D(C,k,0,f,g),R=new D(new Array(0),x,0,c,p)}(),q=!0),e.l_desc=new F(e.dyn_ltree,O),e.d_desc=new F(e.dyn_dtree,B),e.bl_desc=new F(e.bl_tree,R),e.bi_buf=0,e.bi_valid=0,W(e)},r._tr_stored_block=J,r._tr_flush_block=function(e,t,r,n){var i,s,a=0;0<e.level?(2===e.strm.data_type&&(e.strm.data_type=function(e){var t,r=4093624447;for(t=0;t<=31;t++,r>>>=1)if(1&r&&0!==e.dyn_ltree[2*t])return o;if(0!==e.dyn_ltree[18]||0!==e.dyn_ltree[20]||0!==e.dyn_ltree[26])return h;for(t=32;t<u;t++)if(0!==e.dyn_ltree[2*t])return h;return o}(e)),Y(e,e.l_desc),Y(e,e.d_desc),a=function(e){var t;for(X(e,e.dyn_ltree,e.l_desc.max_code),X(e,e.dyn_dtree,e.d_desc.max_code),Y(e,e.bl_desc),t=c-1;3<=t&&0===e.bl_tree[2*S[t]+1];t--);return e.opt_len+=3*(t+1)+5+5+4,t}(e),i=e.opt_len+3+7>>>3,(s=e.static_len+3+7>>>3)<=i&&(i=s)):i=s=r+5,r+4<=i&&-1!==t?J(e,t,r,n):4===e.strategy||s===i?(P(e,2+(n?1:0),3),K(e,z,C)):(P(e,4+(n?1:0),3),function(e,t,r,n){var i;for(P(e,t-257,5),P(e,r-1,5),P(e,n-4,4),i=0;i<n;i++)P(e,e.bl_tree[2*S[i]+1],3);V(e,e.dyn_ltree,t-1),V(e,e.dyn_dtree,r-1)}(e,e.l_desc.max_code+1,e.d_desc.max_code+1,a+1),K(e,e.dyn_ltree,e.dyn_dtree)),W(e),n&&M(e)},r._tr_tally=function(e,t,r){return e.pending_buf[e.d_buf+2*e.last_lit]=t>>>8&255,e.pending_buf[e.d_buf+2*e.last_lit+1]=255&t,e.pending_buf[e.l_buf+e.last_lit]=255&r,e.last_lit++,0===t?e.dyn_ltree[2*r]++:(e.matches++,t--,e.dyn_ltree[2*(A[r]+u+1)]++,e.dyn_dtree[2*N(t)]++),e.last_lit===e.lit_bufsize-1},r._tr_align=function(e){P(e,2,3),L(e,m,z),function(e){16===e.bi_valid?(U(e,e.bi_buf),e.bi_buf=0,e.bi_valid=0):8<=e.bi_valid&&(e.pending_buf[e.pending++]=255&e.bi_buf,e.bi_buf>>=8,e.bi_valid-=8)}(e)}},{"../utils/common":41}],53:[function(e,t,r){"use strict";t.exports=function(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg="",this.state=null,this.data_type=2,this.adler=0}},{}],54:[function(e,t,r){(function(e){!function(r,n){"use strict";if(!r.setImmediate){var i,s,t,a,o=1,h={},u=!1,l=r.document,e=Object.getPrototypeOf&&Object.getPrototypeOf(r);e=e&&e.setTimeout?e:r,i="[object process]"==={}.toString.call(r.process)?function(e){process.nextTick(function(){c(e)})}:function(){if(r.postMessage&&!r.importScripts){var e=!0,t=r.onmessage;return r.onmessage=function(){e=!1},r.postMessage("","*"),r.onmessage=t,e}}()?(a="setImmediate$"+Math.random()+"$",r.addEventListener?r.addEventListener("message",d,!1):r.attachEvent("onmessage",d),function(e){r.postMessage(a+e,"*")}):r.MessageChannel?((t=new MessageChannel).port1.onmessage=function(e){c(e.data)},function(e){t.port2.postMessage(e)}):l&&"onreadystatechange"in l.createElement("script")?(s=l.documentElement,function(e){var t=l.createElement("script");t.onreadystatechange=function(){c(e),t.onreadystatechange=null,s.removeChild(t),t=null},s.appendChild(t)}):function(e){setTimeout(c,0,e)},e.setImmediate=function(e){"function"!=typeof e&&(e=new Function(""+e));for(var t=new Array(arguments.length-1),r=0;r<t.length;r++)t[r]=arguments[r+1];var n={callback:e,args:t};return h[o]=n,i(o),o++},e.clearImmediate=f}function f(e){delete h[e]}function c(e){if(u)setTimeout(c,0,e);else{var t=h[e];if(t){u=!0;try{!function(e){var t=e.callback,r=e.args;switch(r.length){case 0:t();break;case 1:t(r[0]);break;case 2:t(r[0],r[1]);break;case 3:t(r[0],r[1],r[2]);break;default:t.apply(n,r)}}(t)}finally{f(e),u=!1}}}}function d(e){e.source===r&&"string"==typeof e.data&&0===e.data.indexOf(a)&&c(+e.data.slice(a.length))}}("undefined"==typeof self?void 0===e?this:e:self)}).call(this,"undefined"!=typeof __webpack_require__.g?__webpack_require__.g:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}]},{},[10])(10)});

/***/ }),

/***/ "./node_modules/lodash.get/index.js":
/*!******************************************!*\
  !*** ./node_modules/lodash.get/index.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** `Object#toString` result references. */
var funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    symbolTag = '[object Symbol]';

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/,
    reLeadingDot = /^\./,
    rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof __webpack_require__.g == 'object' && __webpack_require__.g && __webpack_require__.g.Object === Object && __webpack_require__.g;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Symbol = root.Symbol,
    splice = arrayProto.splice;

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map'),
    nativeCreate = getNative(Object, 'create');

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  return getMapData(this, key)['delete'](key);
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  getMapData(this, key).set(key, value);
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = isKey(path, object) ? [path] : castPath(path);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value) {
  return isArray(value) ? value : stringToPath(value);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoize(function(string) {
  string = toString(string);

  var result = [];
  if (reLeadingDot.test(string)) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result);
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}

// Assign cache to `_.memoize`.
memoize.Cache = MapCache;

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

module.exports = get;


/***/ }),

/***/ "./resources/word-file.svg":
/*!*********************************!*\
  !*** ./resources/word-file.svg ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/camunda-modeler-plugin-helpers/react.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (({
  styles = {},
  ...props
}) => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", _extends({
  xmlns: "http://www.w3.org/2000/svg",
  width: "16",
  height: "16"
}, props), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
  d: "M9.332 2l-8 1.332v9.336l8 1.332v-1.332H14a.67.67 0 00.668-.668V4A.67.67 0 0014 3.332H9.332zM8 3.574v8.852l-5.332-.887V4.461zm1.332 1.094h4V6h-4zM3 5.668l.867 4.664h.86l.566-2.492c.027-.14.047-.313.059-.524h.011c.008.192.024.368.051.524l.55 2.492h.829l.875-4.664h-.91l-.301 2.148c-.023.18-.039.352-.047.52h-.008a5.408 5.408 0 00-.054-.496l-.371-2.172H4.8l-.395 2.176c-.039.199-.062.386-.066.547h-.02a3.602 3.602 0 00-.043-.536L3.97 5.668zm6.332 1.664h4v1.336h-4zm0 2.668h4v1.332h-4zm0 0"
})));

/***/ }),

/***/ "./node_modules/saxen/dist/index.esm.js":
/*!**********************************************!*\
  !*** ./node_modules/saxen/dist/index.esm.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Parser": () => (/* binding */ Parser),
/* harmony export */   "decode": () => (/* binding */ decodeEntities)
/* harmony export */ });
var fromCharCode = String.fromCharCode;

var hasOwnProperty = Object.prototype.hasOwnProperty;

var ENTITY_PATTERN = /&#(\d+);|&#x([0-9a-f]+);|&(\w+);/ig;

var ENTITY_MAPPING = {
  'amp': '&',
  'apos': '\'',
  'gt': '>',
  'lt': '<',
  'quot': '"'
};

// map UPPERCASE variants of supported special chars
Object.keys(ENTITY_MAPPING).forEach(function(k) {
  ENTITY_MAPPING[k.toUpperCase()] = ENTITY_MAPPING[k];
});


function replaceEntities(_, d, x, z) {

  // reserved names, i.e. &nbsp;
  if (z) {
    if (hasOwnProperty.call(ENTITY_MAPPING, z)) {
      return ENTITY_MAPPING[z];
    } else {

      // fall back to original value
      return '&' + z + ';';
    }
  }

  // decimal encoded char
  if (d) {
    return fromCharCode(d);
  }

  // hex encoded char
  return fromCharCode(parseInt(x, 16));
}


/**
 * A basic entity decoder that can decode a minimal
 * sub-set of reserved names (&amp;) as well as
 * hex (&#xaaf;) and decimal (&#1231;) encoded characters.
 *
 * @param {string} str
 *
 * @return {string} decoded string
 */
function decodeEntities(s) {
  if (s.length > 3 && s.indexOf('&') !== -1) {
    return s.replace(ENTITY_PATTERN, replaceEntities);
  }

  return s;
}

var XSI_URI = 'http://www.w3.org/2001/XMLSchema-instance';
var XSI_PREFIX = 'xsi';
var XSI_TYPE = 'xsi:type';

var NON_WHITESPACE_OUTSIDE_ROOT_NODE = 'non-whitespace outside of root node';

function error(msg) {
  return new Error(msg);
}

function missingNamespaceForPrefix(prefix) {
  return 'missing namespace for prefix <' + prefix + '>';
}

function getter(getFn) {
  return {
    'get': getFn,
    'enumerable': true
  };
}

function cloneNsMatrix(nsMatrix) {
  var clone = {}, key;
  for (key in nsMatrix) {
    clone[key] = nsMatrix[key];
  }
  return clone;
}

function uriPrefix(prefix) {
  return prefix + '$uri';
}

function buildNsMatrix(nsUriToPrefix) {
  var nsMatrix = {},
      uri,
      prefix;

  for (uri in nsUriToPrefix) {
    prefix = nsUriToPrefix[uri];
    nsMatrix[prefix] = prefix;
    nsMatrix[uriPrefix(prefix)] = uri;
  }

  return nsMatrix;
}

function noopGetContext() {
  return { 'line': 0, 'column': 0 };
}

function throwFunc(err) {
  throw err;
}

/**
 * Creates a new parser with the given options.
 *
 * @constructor
 *
 * @param  {!Object<string, ?>=} options
 */
function Parser(options) {

  if (!this) {
    return new Parser(options);
  }

  var proxy = options && options['proxy'];

  var onText,
      onOpenTag,
      onCloseTag,
      onCDATA,
      onError = throwFunc,
      onWarning,
      onComment,
      onQuestion,
      onAttention;

  var getContext = noopGetContext;

  /**
   * Do we need to parse the current elements attributes for namespaces?
   *
   * @type {boolean}
   */
  var maybeNS = false;

  /**
   * Do we process namespaces at all?
   *
   * @type {boolean}
   */
  var isNamespace = false;

  /**
   * The caught error returned on parse end
   *
   * @type {Error}
   */
  var returnError = null;

  /**
   * Should we stop parsing?
   *
   * @type {boolean}
   */
  var parseStop = false;

  /**
   * A map of { uri: prefix } used by the parser.
   *
   * This map will ensure we can normalize prefixes during processing;
   * for each uri, only one prefix will be exposed to the handlers.
   *
   * @type {!Object<string, string>}}
   */
  var nsUriToPrefix;

  /**
   * Handle parse error.
   *
   * @param  {string|Error} err
   */
  function handleError(err) {
    if (!(err instanceof Error)) {
      err = error(err);
    }

    returnError = err;

    onError(err, getContext);
  }

  /**
   * Handle parse error.
   *
   * @param  {string|Error} err
   */
  function handleWarning(err) {

    if (!onWarning) {
      return;
    }

    if (!(err instanceof Error)) {
      err = error(err);
    }

    onWarning(err, getContext);
  }

  /**
   * Register parse listener.
   *
   * @param  {string}   name
   * @param  {Function} cb
   *
   * @return {Parser}
   */
  this['on'] = function(name, cb) {

    if (typeof cb !== 'function') {
      throw error('required args <name, cb>');
    }

    switch (name) {
    case 'openTag': onOpenTag = cb; break;
    case 'text': onText = cb; break;
    case 'closeTag': onCloseTag = cb; break;
    case 'error': onError = cb; break;
    case 'warn': onWarning = cb; break;
    case 'cdata': onCDATA = cb; break;
    case 'attention': onAttention = cb; break; // <!XXXXX zzzz="eeee">
    case 'question': onQuestion = cb; break; // <? ....  ?>
    case 'comment': onComment = cb; break;
    default:
      throw error('unsupported event: ' + name);
    }

    return this;
  };

  /**
   * Set the namespace to prefix mapping.
   *
   * @example
   *
   * parser.ns({
   *   'http://foo': 'foo',
   *   'http://bar': 'bar'
   * });
   *
   * @param  {!Object<string, string>} nsMap
   *
   * @return {Parser}
   */
  this['ns'] = function(nsMap) {

    if (typeof nsMap === 'undefined') {
      nsMap = {};
    }

    if (typeof nsMap !== 'object') {
      throw error('required args <nsMap={}>');
    }

    var _nsUriToPrefix = {}, k;

    for (k in nsMap) {
      _nsUriToPrefix[k] = nsMap[k];
    }

    // FORCE default mapping for schema instance
    _nsUriToPrefix[XSI_URI] = XSI_PREFIX;

    isNamespace = true;
    nsUriToPrefix = _nsUriToPrefix;

    return this;
  };

  /**
   * Parse xml string.
   *
   * @param  {string} xml
   *
   * @return {Error} returnError, if not thrown
   */
  this['parse'] = function(xml) {
    if (typeof xml !== 'string') {
      throw error('required args <xml=string>');
    }

    returnError = null;

    parse(xml);

    getContext = noopGetContext;
    parseStop = false;

    return returnError;
  };

  /**
   * Stop parsing.
   */
  this['stop'] = function() {
    parseStop = true;
  };

  /**
   * Parse string, invoking configured listeners on element.
   *
   * @param  {string} xml
   */
  function parse(xml) {
    var nsMatrixStack = isNamespace ? [] : null,
        nsMatrix = isNamespace ? buildNsMatrix(nsUriToPrefix) : null,
        _nsMatrix,
        nodeStack = [],
        anonymousNsCount = 0,
        tagStart = false,
        tagEnd = false,
        i = 0, j = 0,
        x, y, q, w, v,
        xmlns,
        elementName,
        _elementName,
        elementProxy
        ;

    var attrsString = '',
        attrsStart = 0,
        cachedAttrs // false = parsed with errors, null = needs parsing
        ;

    /**
     * Parse attributes on demand and returns the parsed attributes.
     *
     * Return semantics: (1) `false` on attribute parse error,
     * (2) object hash on extracted attrs.
     *
     * @return {boolean|Object}
     */
    function getAttrs() {
      if (cachedAttrs !== null) {
        return cachedAttrs;
      }

      var nsUri,
          nsUriPrefix,
          nsName,
          defaultAlias = isNamespace && nsMatrix['xmlns'],
          attrList = isNamespace && maybeNS ? [] : null,
          i = attrsStart,
          s = attrsString,
          l = s.length,
          hasNewMatrix,
          newalias,
          value,
          alias,
          name,
          attrs = {},
          seenAttrs = {},
          skipAttr,
          w,
          j;

      parseAttr:
      for (; i < l; i++) {
        skipAttr = false;
        w = s.charCodeAt(i);

        if (w === 32 || (w < 14 && w > 8)) { // WHITESPACE={ \f\n\r\t\v}
          continue;
        }

        // wait for non whitespace character
        if (w < 65 || w > 122 || (w > 90 && w < 97)) {
          if (w !== 95 && w !== 58) { // char 95"_" 58":"
            handleWarning('illegal first char attribute name');
            skipAttr = true;
          }
        }

        // parse attribute name
        for (j = i + 1; j < l; j++) {
          w = s.charCodeAt(j);

          if (
            w > 96 && w < 123 ||
            w > 64 && w < 91 ||
            w > 47 && w < 59 ||
            w === 46 || // '.'
            w === 45 || // '-'
            w === 95 // '_'
          ) {
            continue;
          }

          // unexpected whitespace
          if (w === 32 || (w < 14 && w > 8)) { // WHITESPACE
            handleWarning('missing attribute value');
            i = j;

            continue parseAttr;
          }

          // expected "="
          if (w === 61) { // "=" == 61
            break;
          }

          handleWarning('illegal attribute name char');
          skipAttr = true;
        }

        name = s.substring(i, j);

        if (name === 'xmlns:xmlns') {
          handleWarning('illegal declaration of xmlns');
          skipAttr = true;
        }

        w = s.charCodeAt(j + 1);

        if (w === 34) { // '"'
          j = s.indexOf('"', i = j + 2);

          if (j === -1) {
            j = s.indexOf('\'', i);

            if (j !== -1) {
              handleWarning('attribute value quote missmatch');
              skipAttr = true;
            }
          }

        } else if (w === 39) { // "'"
          j = s.indexOf('\'', i = j + 2);

          if (j === -1) {
            j = s.indexOf('"', i);

            if (j !== -1) {
              handleWarning('attribute value quote missmatch');
              skipAttr = true;
            }
          }

        } else {
          handleWarning('missing attribute value quotes');
          skipAttr = true;

          // skip to next space
          for (j = j + 1; j < l; j++) {
            w = s.charCodeAt(j + 1);

            if (w === 32 || (w < 14 && w > 8)) { // WHITESPACE
              break;
            }
          }

        }

        if (j === -1) {
          handleWarning('missing closing quotes');

          j = l;
          skipAttr = true;
        }

        if (!skipAttr) {
          value = s.substring(i, j);
        }

        i = j;

        // ensure SPACE follows attribute
        // skip illegal content otherwise
        // example a="b"c
        for (; j + 1 < l; j++) {
          w = s.charCodeAt(j + 1);

          if (w === 32 || (w < 14 && w > 8)) { // WHITESPACE
            break;
          }

          // FIRST ILLEGAL CHAR
          if (i === j) {
            handleWarning('illegal character after attribute end');
            skipAttr = true;
          }
        }

        // advance cursor to next attribute
        i = j + 1;

        if (skipAttr) {
          continue parseAttr;
        }

        // check attribute re-declaration
        if (name in seenAttrs) {
          handleWarning('attribute <' + name + '> already defined');
          continue;
        }

        seenAttrs[name] = true;

        if (!isNamespace) {
          attrs[name] = value;
          continue;
        }

        // try to extract namespace information
        if (maybeNS) {
          newalias = (
            name === 'xmlns'
              ? 'xmlns'
              : (name.charCodeAt(0) === 120 && name.substr(0, 6) === 'xmlns:')
                ? name.substr(6)
                : null
          );

          // handle xmlns(:alias) assignment
          if (newalias !== null) {
            nsUri = decodeEntities(value);
            nsUriPrefix = uriPrefix(newalias);

            alias = nsUriToPrefix[nsUri];

            if (!alias) {

              // no prefix defined or prefix collision
              if (
                (newalias === 'xmlns') ||
                (nsUriPrefix in nsMatrix && nsMatrix[nsUriPrefix] !== nsUri)
              ) {

                // alocate free ns prefix
                do {
                  alias = 'ns' + (anonymousNsCount++);
                } while (typeof nsMatrix[alias] !== 'undefined');
              } else {
                alias = newalias;
              }

              nsUriToPrefix[nsUri] = alias;
            }

            if (nsMatrix[newalias] !== alias) {
              if (!hasNewMatrix) {
                nsMatrix = cloneNsMatrix(nsMatrix);
                hasNewMatrix = true;
              }

              nsMatrix[newalias] = alias;
              if (newalias === 'xmlns') {
                nsMatrix[uriPrefix(alias)] = nsUri;
                defaultAlias = alias;
              }

              nsMatrix[nsUriPrefix] = nsUri;
            }

            // expose xmlns(:asd)="..." in attributes
            attrs[name] = value;
            continue;
          }

          // collect attributes until all namespace
          // declarations are processed
          attrList.push(name, value);
          continue;

        } /** end if (maybeNs) */

        // handle attributes on element without
        // namespace declarations
        w = name.indexOf(':');
        if (w === -1) {
          attrs[name] = value;
          continue;
        }

        // normalize ns attribute name
        if (!(nsName = nsMatrix[name.substring(0, w)])) {
          handleWarning(missingNamespaceForPrefix(name.substring(0, w)));
          continue;
        }

        name = defaultAlias === nsName
          ? name.substr(w + 1)
          : nsName + name.substr(w);

        // end: normalize ns attribute name

        // normalize xsi:type ns attribute value
        if (name === XSI_TYPE) {
          w = value.indexOf(':');

          if (w !== -1) {
            nsName = value.substring(0, w);

            // handle default prefixes, i.e. xs:String gracefully
            nsName = nsMatrix[nsName] || nsName;
            value = nsName + value.substring(w);
          } else {
            value = defaultAlias + ':' + value;
          }
        }

        // end: normalize xsi:type ns attribute value

        attrs[name] = value;
      }


      // handle deferred, possibly namespaced attributes
      if (maybeNS) {

        // normalize captured attributes
        for (i = 0, l = attrList.length; i < l; i++) {

          name = attrList[i++];
          value = attrList[i];

          w = name.indexOf(':');

          if (w !== -1) {

            // normalize ns attribute name
            if (!(nsName = nsMatrix[name.substring(0, w)])) {
              handleWarning(missingNamespaceForPrefix(name.substring(0, w)));
              continue;
            }

            name = defaultAlias === nsName
              ? name.substr(w + 1)
              : nsName + name.substr(w);

            // end: normalize ns attribute name

            // normalize xsi:type ns attribute value
            if (name === XSI_TYPE) {
              w = value.indexOf(':');

              if (w !== -1) {
                nsName = value.substring(0, w);

                // handle default prefixes, i.e. xs:String gracefully
                nsName = nsMatrix[nsName] || nsName;
                value = nsName + value.substring(w);
              } else {
                value = defaultAlias + ':' + value;
              }
            }

            // end: normalize xsi:type ns attribute value
          }

          attrs[name] = value;
        }

        // end: normalize captured attributes
      }

      return cachedAttrs = attrs;
    }

    /**
     * Extract the parse context { line, column, part }
     * from the current parser position.
     *
     * @return {Object} parse context
     */
    function getParseContext() {
      var splitsRe = /(\r\n|\r|\n)/g;

      var line = 0;
      var column = 0;
      var startOfLine = 0;
      var endOfLine = j;
      var match;
      var data;

      while (i >= startOfLine) {

        match = splitsRe.exec(xml);

        if (!match) {
          break;
        }

        // end of line = (break idx + break chars)
        endOfLine = match[0].length + match.index;

        if (endOfLine > i) {
          break;
        }

        // advance to next line
        line += 1;

        startOfLine = endOfLine;
      }

      // EOF errors
      if (i == -1) {
        column = endOfLine;
        data = xml.substring(j);
      } else

      // start errors
      if (j === 0) {
        data = xml.substring(j, i);
      }

      // other errors
      else {
        column = i - startOfLine;
        data = (j == -1 ? xml.substring(i) : xml.substring(i, j + 1));
      }

      return {
        'data': data,
        'line': line,
        'column': column
      };
    }

    getContext = getParseContext;


    if (proxy) {
      elementProxy = Object.create({}, {
        'name': getter(function() {
          return elementName;
        }),
        'originalName': getter(function() {
          return _elementName;
        }),
        'attrs': getter(getAttrs),
        'ns': getter(function() {
          return nsMatrix;
        })
      });
    }

    // actual parse logic
    while (j !== -1) {

      if (xml.charCodeAt(j) === 60) { // "<"
        i = j;
      } else {
        i = xml.indexOf('<', j);
      }

      // parse end
      if (i === -1) {
        if (nodeStack.length) {
          return handleError('unexpected end of file');
        }

        if (j === 0) {
          return handleError('missing start tag');
        }

        if (j < xml.length) {
          if (xml.substring(j).trim()) {
            handleWarning(NON_WHITESPACE_OUTSIDE_ROOT_NODE);
          }
        }

        return;
      }

      // parse text
      if (j !== i) {

        if (nodeStack.length) {
          if (onText) {
            onText(xml.substring(j, i), decodeEntities, getContext);

            if (parseStop) {
              return;
            }
          }
        } else {
          if (xml.substring(j, i).trim()) {
            handleWarning(NON_WHITESPACE_OUTSIDE_ROOT_NODE);

            if (parseStop) {
              return;
            }
          }
        }
      }

      w = xml.charCodeAt(i+1);

      // parse comments + CDATA
      if (w === 33) { // "!"
        q = xml.charCodeAt(i+2);

        // CDATA section
        if (q === 91 && xml.substr(i + 3, 6) === 'CDATA[') { // 91 == "["
          j = xml.indexOf(']]>', i);
          if (j === -1) {
            return handleError('unclosed cdata');
          }

          if (onCDATA) {
            onCDATA(xml.substring(i + 9, j), getContext);
            if (parseStop) {
              return;
            }
          }

          j += 3;
          continue;
        }

        // comment
        if (q === 45 && xml.charCodeAt(i + 3) === 45) { // 45 == "-"
          j = xml.indexOf('-->', i);
          if (j === -1) {
            return handleError('unclosed comment');
          }


          if (onComment) {
            onComment(xml.substring(i + 4, j), decodeEntities, getContext);
            if (parseStop) {
              return;
            }
          }

          j += 3;
          continue;
        }
      }

      // parse question <? ... ?>
      if (w === 63) { // "?"
        j = xml.indexOf('?>', i);
        if (j === -1) {
          return handleError('unclosed question');
        }

        if (onQuestion) {
          onQuestion(xml.substring(i, j + 2), getContext);
          if (parseStop) {
            return;
          }
        }

        j += 2;
        continue;
      }

      // find matching closing tag for attention or standard tags
      // for that we must skip through attribute values
      // (enclosed in single or double quotes)
      for (x = i + 1; ; x++) {
        v = xml.charCodeAt(x);
        if (isNaN(v)) {
          j = -1;
          return handleError('unclosed tag');
        }

        // [10] AttValue ::= '"' ([^<&"] | Reference)* '"' | "'" ([^<&'] | Reference)* "'"
        // skips the quoted string
        // (double quotes) does not appear in a literal enclosed by (double quotes)
        // (single quote) does not appear in a literal enclosed by (single quote)
        if (v === 34) { //  '"'
          q = xml.indexOf('"', x + 1);
          x = q !== -1 ? q : x;
        } else if (v === 39) { // "'"
          q = xml.indexOf("'", x + 1);
          x = q !== -1 ? q : x;
        } else if (v === 62) { // '>'
          j = x;
          break;
        }
      }


      // parse attention <! ...>
      // previously comment and CDATA have already been parsed
      if (w === 33) { // "!"

        if (onAttention) {
          onAttention(xml.substring(i, j + 1), decodeEntities, getContext);
          if (parseStop) {
            return;
          }
        }

        j += 1;
        continue;
      }

      // don't process attributes;
      // there are none
      cachedAttrs = {};

      // if (xml.charCodeAt(i+1) === 47) { // </...
      if (w === 47) { // </...
        tagStart = false;
        tagEnd = true;

        if (!nodeStack.length) {
          return handleError('missing open tag');
        }

        // verify open <-> close tag match
        x = elementName = nodeStack.pop();
        q = i + 2 + x.length;

        if (xml.substring(i + 2, q) !== x) {
          return handleError('closing tag mismatch');
        }

        // verify chars in close tag
        for (; q < j; q++) {
          w = xml.charCodeAt(q);

          if (w === 32 || (w > 8 && w < 14)) { // \f\n\r\t\v space
            continue;
          }

          return handleError('close tag');
        }

      } else {
        if (xml.charCodeAt(j - 1) === 47) { // .../>
          x = elementName = xml.substring(i + 1, j - 1);

          tagStart = true;
          tagEnd = true;

        } else {
          x = elementName = xml.substring(i + 1, j);

          tagStart = true;
          tagEnd = false;
        }

        if (!(w > 96 && w < 123 || w > 64 && w < 91 || w === 95 || w === 58)) { // char 95"_" 58":"
          return handleError('illegal first char nodeName');
        }

        for (q = 1, y = x.length; q < y; q++) {
          w = x.charCodeAt(q);

          if (w > 96 && w < 123 || w > 64 && w < 91 || w > 47 && w < 59 || w === 45 || w === 95 || w == 46) {
            continue;
          }

          if (w === 32 || (w < 14 && w > 8)) { // \f\n\r\t\v space
            elementName = x.substring(0, q);

            // maybe there are attributes
            cachedAttrs = null;
            break;
          }

          return handleError('invalid nodeName');
        }

        if (!tagEnd) {
          nodeStack.push(elementName);
        }
      }

      if (isNamespace) {

        _nsMatrix = nsMatrix;

        if (tagStart) {

          // remember old namespace
          // unless we're self-closing
          if (!tagEnd) {
            nsMatrixStack.push(_nsMatrix);
          }

          if (cachedAttrs === null) {

            // quick check, whether there may be namespace
            // declarations on the node; if that is the case
            // we need to eagerly parse the node attributes
            if ((maybeNS = x.indexOf('xmlns', q) !== -1)) {
              attrsStart = q;
              attrsString = x;

              getAttrs();

              maybeNS = false;
            }
          }
        }

        _elementName = elementName;

        w = elementName.indexOf(':');
        if (w !== -1) {
          xmlns = nsMatrix[elementName.substring(0, w)];

          // prefix given; namespace must exist
          if (!xmlns) {
            return handleError('missing namespace on <' + _elementName + '>');
          }

          elementName = elementName.substr(w + 1);
        } else {
          xmlns = nsMatrix['xmlns'];

          // if no default namespace is defined,
          // we'll import the element as anonymous.
          //
          // it is up to users to correct that to the document defined
          // targetNamespace, or whatever their undersanding of the
          // XML spec mandates.
        }

        // adjust namespace prefixs as configured
        if (xmlns) {
          elementName = xmlns + ':' + elementName;
        }

      }

      if (tagStart) {
        attrsStart = q;
        attrsString = x;

        if (onOpenTag) {
          if (proxy) {
            onOpenTag(elementProxy, decodeEntities, tagEnd, getContext);
          } else {
            onOpenTag(elementName, getAttrs, decodeEntities, tagEnd, getContext);
          }

          if (parseStop) {
            return;
          }
        }

      }

      if (tagEnd) {

        if (onCloseTag) {
          onCloseTag(proxy ? elementProxy : elementName, decodeEntities, tagStart, getContext);

          if (parseStop) {
            return;
          }
        }

        // restore old namespace
        if (isNamespace) {
          if (!tagStart) {
            nsMatrix = nsMatrixStack.pop();
          } else {
            nsMatrix = _nsMatrix;
          }
        }
      }

      j += 1;
    }
  } /** end parse */

}




/***/ }),

/***/ "./client/constants.ts":
/*!*****************************!*\
  !*** ./client/constants.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BUTTON_SELECT_TEMPLATE": () => (/* binding */ BUTTON_SELECT_TEMPLATE),
/* harmony export */   "DOC_HELP_ACTIVITY_ASSIGNEE_LABEL": () => (/* binding */ DOC_HELP_ACTIVITY_ASSIGNEE_LABEL),
/* harmony export */   "DOC_HELP_ACTIVITY_ASSIGNEE_PLACEHOLDER": () => (/* binding */ DOC_HELP_ACTIVITY_ASSIGNEE_PLACEHOLDER),
/* harmony export */   "DOC_HELP_ACTIVITY_DESCRIPTION_LABEL": () => (/* binding */ DOC_HELP_ACTIVITY_DESCRIPTION_LABEL),
/* harmony export */   "DOC_HELP_ACTIVITY_DESCRIPTION_PLACEHOLDER": () => (/* binding */ DOC_HELP_ACTIVITY_DESCRIPTION_PLACEHOLDER),
/* harmony export */   "DOC_HELP_ACTIVITY_NAME_LABEL": () => (/* binding */ DOC_HELP_ACTIVITY_NAME_LABEL),
/* harmony export */   "DOC_HELP_ACTIVITY_NAME_PLACEHOLDER": () => (/* binding */ DOC_HELP_ACTIVITY_NAME_PLACEHOLDER),
/* harmony export */   "DOC_HELP_ACTIVITY_ORDER_LABEL": () => (/* binding */ DOC_HELP_ACTIVITY_ORDER_LABEL),
/* harmony export */   "DOC_HELP_ACTIVITY_ORDER_PLACEHOLDER": () => (/* binding */ DOC_HELP_ACTIVITY_ORDER_PLACEHOLDER),
/* harmony export */   "DOC_HELP_ACTIVITY_TYPE_LABEL": () => (/* binding */ DOC_HELP_ACTIVITY_TYPE_LABEL),
/* harmony export */   "DOC_HELP_ACTIVITY_TYPE_PLACEHOLDER": () => (/* binding */ DOC_HELP_ACTIVITY_TYPE_PLACEHOLDER),
/* harmony export */   "DOC_HELP_PROCESS_ID_LABEL": () => (/* binding */ DOC_HELP_PROCESS_ID_LABEL),
/* harmony export */   "DOC_HELP_PROCESS_ID_PLACEHOLDER": () => (/* binding */ DOC_HELP_PROCESS_ID_PLACEHOLDER),
/* harmony export */   "DOC_HELP_PROCESS_IS_EXECUTABLE_LABEL": () => (/* binding */ DOC_HELP_PROCESS_IS_EXECUTABLE_LABEL),
/* harmony export */   "DOC_HELP_PROCESS_IS_EXECUTABLE_PLACEHOLDER": () => (/* binding */ DOC_HELP_PROCESS_IS_EXECUTABLE_PLACEHOLDER),
/* harmony export */   "DOC_HELP_PROCESS_NAME_LABEL": () => (/* binding */ DOC_HELP_PROCESS_NAME_LABEL),
/* harmony export */   "DOC_HELP_PROCESS_NAME_PLACEHOLDER": () => (/* binding */ DOC_HELP_PROCESS_NAME_PLACEHOLDER),
/* harmony export */   "MODAL_TITLE": () => (/* binding */ MODAL_TITLE),
/* harmony export */   "SECTION_HEADER_IMPORT_TEMPLATE": () => (/* binding */ SECTION_HEADER_IMPORT_TEMPLATE)
/* harmony export */ });
/* eslint-disable no-template-curly-in-string */
const MODAL_TITLE = 'Document generator - available placeholders';
const BUTTON_SELECT_TEMPLATE = 'Select template file';
const SECTION_HEADER_IMPORT_TEMPLATE = 'Generate process documentation (docx)';
// DOCUMENTATION HELP TABLE placeholders
const DOC_HELP_PROCESS_NAME_LABEL = 'Process name';
const DOC_HELP_PROCESS_NAME_PLACEHOLDER = '{processName}';
const DOC_HELP_PROCESS_ID_LABEL = 'Process id';
const DOC_HELP_PROCESS_ID_PLACEHOLDER = '{processId}';
const DOC_HELP_PROCESS_IS_EXECUTABLE_LABEL = 'Is executable';
const DOC_HELP_PROCESS_IS_EXECUTABLE_PLACEHOLDER = '{processIsExecutable}';
const DOC_HELP_ACTIVITY_NAME_LABEL = 'Actitvity name';
const DOC_HELP_ACTIVITY_NAME_PLACEHOLDER = '{name}';
const DOC_HELP_ACTIVITY_DESCRIPTION_LABEL = 'Description';
const DOC_HELP_ACTIVITY_DESCRIPTION_PLACEHOLDER = '{description}';
const DOC_HELP_ACTIVITY_ASSIGNEE_LABEL = 'Description';
const DOC_HELP_ACTIVITY_ASSIGNEE_PLACEHOLDER = '{executor}';
const DOC_HELP_ACTIVITY_ORDER_LABEL = 'Order';
const DOC_HELP_ACTIVITY_ORDER_PLACEHOLDER = '{order}';
const DOC_HELP_ACTIVITY_TYPE_LABEL = 'Type';
const DOC_HELP_ACTIVITY_TYPE_PLACEHOLDER = '{type}';


/***/ }),

/***/ "./client/document-generator-plugin.tsx":
/*!**********************************************!*\
  !*** ./client/document-generator-plugin.tsx ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DocumentGeneratorPlugin)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/camunda-modeler-plugin-helpers/react.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var camunda_modeler_plugin_helpers_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! camunda-modeler-plugin-helpers/components */ "./node_modules/camunda-modeler-plugin-helpers/components.js");
/* harmony import */ var _resources_word_file_svg__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../resources/word-file.svg */ "./resources/word-file.svg");
/* harmony import */ var _generator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../generator */ "./generator/index.ts");
/* harmony import */ var _generate_doc_setup_view__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./generate-doc-setup-view */ "./client/generate-doc-setup-view.tsx");
/* harmony import */ var _modal_generate_doc_help__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./modal/generate-doc-help */ "./client/modal/generate-doc-help.tsx");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

// @ts-expect-error import

// @ts-expect-error import





const defaultState = {
    activeTab: { type: '' },
    configOpen: false,
    modalOpen: false,
    modalDocHelpOpen: false,
    inputFile: undefined
};
const ENCODING_UTF8 = 'utf8';
const LOAD_TEMPLATE_EVENT = 'documentation-generator-plugin:loadTemplate';
const OPEN_HELP_MODAL_EVENT = 'documentation-generator-plugin:openHelpModal';
const FILTER_DOCX = {
    name: 'Word file',
    encoding: ENCODING_UTF8,
    extensions: ['docx']
};
class DocumentGeneratorPlugin extends react__WEBPACK_IMPORTED_MODULE_0__.PureComponent {
    constructor(props) {
        super(props);
        this.state = defaultState;
        this._buttonRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.createRef)();
    }
    componentDidMount() {
        const { 
        // @ts-expect-error props
        subscribe } = this.props;
        subscribe(LOAD_TEMPLATE_EVENT, () => {
            this.openModal();
        });
        subscribe(OPEN_HELP_MODAL_EVENT, () => {
            this.openDocHelpModal();
        });
        subscribe('app.activeTabChanged', (event) => {
            this.setState({ activeTab: event.activeTab });
        });
    }
    handleDocumentGenerationSuccess(exportPath) {
        this.props.displayNotification({
            type: 'success',
            title: 'Document generation succeeded!',
            content: react__WEBPACK_IMPORTED_MODULE_0__.createElement(GenerationSuccess, { exportPath: exportPath }),
            duration: 10000
        });
    }
    handleDocumentGenerationError(error) {
        this.props.displayNotification({
            type: 'error',
            title: 'Document generation failed',
            content: 'See the log for further details.',
            duration: 10000
        });
        this.props.log({
            category: 'document-generator-error',
            message: error.message
        });
    }
    /**
       * Generates word document for process definition
       *
       * @returns {Promise<object>}
       */
    generateDocument(templateFile) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // (0) save tab contents
                const savedTab = yield this.props.triggerAction('save-tab', { tab: this.state.activeTab });
                // (1) ask user were to export the file
                const exportPath = yield this.props._getGlobal('dialog').showSaveFileDialog({
                    file: savedTab.file,
                    title: `Save ${savedTab.name} as ...`,
                    filters: [
                        FILTER_DOCX
                    ]
                });
                if (exportPath == null) {
                    return false;
                }
                const fileSystem = this.props._getGlobal('fileSystem');
                // 1. read template file
                const { contents } = yield fileSystem.readFile(templateFile.path, { encoding: false });
                const doc = yield (0,_generator__WEBPACK_IMPORTED_MODULE_3__.generateWordDocumentationFromBpmn)({ bpmnXml: savedTab.file.contents }, contents);
                // 3. save output
                yield fileSystem.writeFile(exportPath, { contents: doc });
                this.handleDocumentGenerationSuccess(exportPath);
            }
            catch (error) {
                console.log(error);
                this.handleDocumentGenerationError(error);
            }
            return true;
        });
    }
    openModal() {
        this.setState({ modalOpen: true });
    }
    handleConfigClosed(details) {
        if (!this.state.modalDocHelpOpen) {
            this.setState({ modalOpen: false });
        }
        if ((details === null || details === void 0 ? void 0 : details.inputFile) !== undefined) {
            void this.generateDocument(details === null || details === void 0 ? void 0 : details.inputFile);
        }
    }
    openDocHelpModal() {
        this.setState({ modalDocHelpOpen: true });
    }
    handleDocHelpModalClosed() {
        this.setState({ modalDocHelpOpen: false });
    }
    render() {
        const initValues = {
            inputFile: this.state.inputFile
        };
        return react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null,
            isBPMN(this.state.activeTab) && (react__WEBPACK_IMPORTED_MODULE_0__.createElement(camunda_modeler_plugin_helpers_components__WEBPACK_IMPORTED_MODULE_1__.Fill, { slot: "tab-actions" },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("button", { ref: this._buttonRef, title: "Generate process definition documentation as Word doc", className: "btn btn--tab-action", onClick: this.openModal.bind(this) },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_resources_word_file_svg__WEBPACK_IMPORTED_MODULE_2__["default"], null)))),
            (Boolean(this.state.modalOpen)) && (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_generate_doc_setup_view__WEBPACK_IMPORTED_MODULE_4__["default"], { anchor: this._buttonRef.current, onClose: this.handleConfigClosed.bind(this), onDocHelp: this.openDocHelpModal.bind(this), initValues: initValues })),
            (Boolean(this.state.modalDocHelpOpen)) && (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_modal_generate_doc_help__WEBPACK_IMPORTED_MODULE_5__["default"], { onClose: this.handleDocHelpModalClosed.bind(this) })));
    }
}
// Helpers
const GenerationSuccess = (props) => {
    return react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", null, 'Word documentation was generated.'),
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", null, 'Find your generated Word file at "' + props.exportPath + '".'));
};
const isBPMN = (tab) => {
    return tab.type === 'cloud-bpmn';
};


/***/ }),

/***/ "./client/generate-doc-setup-view.tsx":
/*!********************************************!*\
  !*** ./client/generate-doc-setup-view.tsx ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ GenerateDocSetupView)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/camunda-modeler-plugin-helpers/react.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var camunda_modeler_plugin_helpers_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! camunda-modeler-plugin-helpers/components */ "./node_modules/camunda-modeler-plugin-helpers/components.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants */ "./client/constants.ts");

// @ts-expect-error import



const OVERLAY_OFFSET = { top: 0, right: 0 };
function GenerateDocSetupView(props) {
    const [inputFile, setInputFile] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(props.initValues.inputFile);
    const [chosenFileText, setChosenFileText] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('No file selected.');
    const handleInputFileClick = () => {
        const realInput = document.getElementById('inputFile');
        if (realInput !== null) {
            realInput.click();
        }
    };
    const handleInputFileChange = (event) => {
        const file = event.target !== null ? event.target.files[0] : null;
        if (file == null) {
            return;
        }
        setInputFile(file);
        setChosenFileText(file.name);
    };
    const handleSubmit = () => { props.onClose({ inputFile }); };
    return react__WEBPACK_IMPORTED_MODULE_0__.createElement(camunda_modeler_plugin_helpers_components__WEBPACK_IMPORTED_MODULE_1__.Overlay, { offset: OVERLAY_OFFSET, anchor: props.anchor, onClose: props.onClose },
        react__WEBPACK_IMPORTED_MODULE_0__.createElement(camunda_modeler_plugin_helpers_components__WEBPACK_IMPORTED_MODULE_1__.Section, { width: "400px" },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(camunda_modeler_plugin_helpers_components__WEBPACK_IMPORTED_MODULE_1__.Section.Header, null,
                _constants__WEBPACK_IMPORTED_MODULE_2__.SECTION_HEADER_IMPORT_TEMPLATE,
                " ",
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { onClick: props.onDocHelp }, " ?")),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(camunda_modeler_plugin_helpers_components__WEBPACK_IMPORTED_MODULE_1__.Section.Body, null,
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("form", { id: "select-file", className: "import-form" },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("fieldset", null,
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: "fields" },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: "form-group" },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: "file-input" },
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("button", { type: "button", className: "btn btn-primary", onClick: handleInputFileClick }, _constants__WEBPACK_IMPORTED_MODULE_2__.BUTTON_SELECT_TEMPLATE)),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("input", { type: "file", id: "inputFile", accept: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", className: "form-control", name: "inputFile", onChange: handleInputFileChange }))))))),
        chosenFileText !== 'No file selected.'
            ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null,
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(camunda_modeler_plugin_helpers_components__WEBPACK_IMPORTED_MODULE_1__.Section, { maxHeight: "400px" },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(camunda_modeler_plugin_helpers_components__WEBPACK_IMPORTED_MODULE_1__.Section.Body, null,
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("form", { id: "import-form", className: "import-form", onSubmit: handleSubmit }, react__WEBPACK_IMPORTED_MODULE_0__.createElement(camunda_modeler_plugin_helpers_components__WEBPACK_IMPORTED_MODULE_1__.Section, { key: "document" },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement(camunda_modeler_plugin_helpers_components__WEBPACK_IMPORTED_MODULE_1__.Section.Header, null, "Template configuration"),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement(camunda_modeler_plugin_helpers_components__WEBPACK_IMPORTED_MODULE_1__.Section.Body, null,
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("fieldset", null,
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: "fields" },
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: "form-group" },
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("label", null, "Name"),
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", null, chosenFileText))))))))),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(camunda_modeler_plugin_helpers_components__WEBPACK_IMPORTED_MODULE_1__.Section, null,
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(camunda_modeler_plugin_helpers_components__WEBPACK_IMPORTED_MODULE_1__.Section.Body, null,
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(camunda_modeler_plugin_helpers_components__WEBPACK_IMPORTED_MODULE_1__.Section.Actions, null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("button", { type: "submit", className: "btn btn-primary", form: "import-form" }, "Generater doc"))))))
            : null);
}


/***/ }),

/***/ "./client/modal/generate-doc-help.tsx":
/*!********************************************!*\
  !*** ./client/modal/generate-doc-help.tsx ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ GenerateDocHelp)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/camunda-modeler-plugin-helpers/react.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var camunda_modeler_plugin_helpers_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! camunda-modeler-plugin-helpers/components */ "./node_modules/camunda-modeler-plugin-helpers/components.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../constants */ "./client/constants.ts");

// @ts-expect-error import


function GenerateDocHelp(props) {
    // eslint-disable-next-line react/prop-types
    const { 
    // eslint-disable-next-line react/prop-types
    onClose } = props;
    return react__WEBPACK_IMPORTED_MODULE_0__.createElement(camunda_modeler_plugin_helpers_components__WEBPACK_IMPORTED_MODULE_1__.Modal, { className: "todo", onClose: onClose },
        react__WEBPACK_IMPORTED_MODULE_0__.createElement(camunda_modeler_plugin_helpers_components__WEBPACK_IMPORTED_MODULE_1__.Modal.Title, null, _constants__WEBPACK_IMPORTED_MODULE_2__.MODAL_TITLE),
        react__WEBPACK_IMPORTED_MODULE_0__.createElement(camunda_modeler_plugin_helpers_components__WEBPACK_IMPORTED_MODULE_1__.Modal.Body, null,
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", null, "The following special template placeholders can be used in documentation template."),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("h3", null, "Process placeholders"),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("table", null,
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("tbody", { className: "keyboard-shortcuts" },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("tr", { key: "key" },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("td", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("b", null, _constants__WEBPACK_IMPORTED_MODULE_2__.DOC_HELP_PROCESS_NAME_LABEL)),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("td", { className: "binding" }, _constants__WEBPACK_IMPORTED_MODULE_2__.DOC_HELP_PROCESS_NAME_PLACEHOLDER)),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("tr", { key: "key" },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("td", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("b", null, _constants__WEBPACK_IMPORTED_MODULE_2__.DOC_HELP_PROCESS_ID_LABEL)),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("td", { className: "binding" }, _constants__WEBPACK_IMPORTED_MODULE_2__.DOC_HELP_PROCESS_ID_PLACEHOLDER)),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("tr", { key: "key" },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("td", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("b", null, _constants__WEBPACK_IMPORTED_MODULE_2__.DOC_HELP_PROCESS_IS_EXECUTABLE_LABEL)),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("td", { className: "binding" }, _constants__WEBPACK_IMPORTED_MODULE_2__.DOC_HELP_PROCESS_IS_EXECUTABLE_PLACEHOLDER)))),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("h3", null, "Activities placeholders"),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", null,
                "Activities elements collection is available under ",
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("i", null, "activities"),
                " placeholder. Each item contains the following properties"),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("table", null,
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("tbody", { className: "keyboard-shortcuts" },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("tr", { key: "key" },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("td", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("b", null, _constants__WEBPACK_IMPORTED_MODULE_2__.DOC_HELP_ACTIVITY_NAME_LABEL)),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("td", { className: "binding" }, _constants__WEBPACK_IMPORTED_MODULE_2__.DOC_HELP_ACTIVITY_NAME_PLACEHOLDER)),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("tr", { key: "key" },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("td", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("b", null, _constants__WEBPACK_IMPORTED_MODULE_2__.DOC_HELP_ACTIVITY_ORDER_LABEL)),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("td", { className: "binding" }, _constants__WEBPACK_IMPORTED_MODULE_2__.DOC_HELP_ACTIVITY_ORDER_PLACEHOLDER)),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("tr", { key: "key" },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("td", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("b", null, _constants__WEBPACK_IMPORTED_MODULE_2__.DOC_HELP_ACTIVITY_DESCRIPTION_LABEL)),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("td", { className: "binding" }, _constants__WEBPACK_IMPORTED_MODULE_2__.DOC_HELP_ACTIVITY_DESCRIPTION_PLACEHOLDER)),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("tr", { key: "key" },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("td", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("b", null, _constants__WEBPACK_IMPORTED_MODULE_2__.DOC_HELP_ACTIVITY_ASSIGNEE_LABEL)),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("td", { className: "binding" }, _constants__WEBPACK_IMPORTED_MODULE_2__.DOC_HELP_ACTIVITY_ASSIGNEE_PLACEHOLDER)),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("tr", { key: "key" },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("td", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("b", null, _constants__WEBPACK_IMPORTED_MODULE_2__.DOC_HELP_ACTIVITY_TYPE_LABEL)),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("td", { className: "binding" }, _constants__WEBPACK_IMPORTED_MODULE_2__.DOC_HELP_ACTIVITY_TYPE_PLACEHOLDER))))),
        react__WEBPACK_IMPORTED_MODULE_0__.createElement(camunda_modeler_plugin_helpers_components__WEBPACK_IMPORTED_MODULE_1__.Modal.Footer, null,
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: "buttonDiv" },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("button", { className: "btn btn-primary", onClick: onClose }, "Close"))));
}


/***/ }),

/***/ "./generator/bpmn-json-generator.ts":
/*!******************************************!*\
  !*** ./generator/bpmn-json-generator.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "buildJsonFromBpmnXml": () => (/* binding */ buildJsonFromBpmnXml)
/* harmony export */ });
/* harmony import */ var bpmn_moddle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! bpmn-moddle */ "./node_modules/bpmn-moddle/dist/index.esm.js");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// @ts-expect-error import

const moddle = new bpmn_moddle__WEBPACK_IMPORTED_MODULE_0__["default"]();
const buildJsonFromBpmnXml = (bpmnFile) => __awaiter(void 0, void 0, void 0, function* () {
    const bpmnJson = yield moddle.fromXML(bpmnFile.bpmnXml);
    return getAllProcessDefinitions(bpmnJson.rootElement);
});
function getAllProcessDefinitions(processDefinition) {
    return processDefinition.rootElements.filter((rootElement) => rootElement.$type === 'bpmn:Process');
}


/***/ }),

/***/ "./generator/index.ts":
/*!****************************!*\
  !*** ./generator/index.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "generateWordDocumentationFromBpmn": () => (/* binding */ generateWordDocumentationFromBpmn)
/* harmony export */ });
/* harmony import */ var _bpmn_json_generator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./bpmn-json-generator */ "./generator/bpmn-json-generator.ts");
/* harmony import */ var _word_document_generator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./word-document-generator */ "./generator/word-document-generator.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


const generateWordDocumentationFromBpmn = (bpmnFile, template) => __awaiter(void 0, void 0, void 0, function* () {
    const processDiagrams = yield (0,_bpmn_json_generator__WEBPACK_IMPORTED_MODULE_0__.buildJsonFromBpmnXml)(bpmnFile);
    const wordDocument = (0,_word_document_generator__WEBPACK_IMPORTED_MODULE_1__.generateWord)(processDiagrams[0], template);
    return yield wordDocument;
});


/***/ }),

/***/ "./generator/word-document-generator.ts":
/*!**********************************************!*\
  !*** ./generator/word-document-generator.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "generateWord": () => (/* binding */ generateWord)
/* harmony export */ });
/* harmony import */ var easy_template_x__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! easy-template-x */ "./node_modules/easy-template-x/dist/es/easy-template-x.js");
/* provided dependency */ var Buffer = __webpack_require__(/*! buffer */ "./node_modules/buffer/index.js")["Buffer"];
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

function getFlowElementExecutor(flowElement) {
    let executor = '';
    if (flowElement.$type === 'bpmn:UserTask' && flowElement.extensionElements !== undefined && flowElement.extensionElements.$type === 'bpmn:ExtensionElements') {
        executor = flowElement.extensionElements.values.filter(extElem => extElem.$type === 'zeebe:assignmentDefinition').map(extElem => extElem.assignee).join(',');
    }
    return executor;
}
function getExtensionElementType(flowElement) {
    let executor = '';
    if (flowElement.$type === 'bpmn:ServiceTask') {
        executor += flowElement.extensionElements.values.filter(extElem => extElem.$type === 'zeebe:taskDefinition').map(extElem => extElem.type).join(',');
    }
    return executor;
}
function getCallActivity(flowElement) {
    let executor = '';
    if (flowElement.$type === 'bpmn:CallActivity') {
        executor += flowElement.extensionElements.values.filter(extElem => extElem.$type === 'zeebe:calledElement').map(extElem => extElem.processId).join(',');
    }
    return executor;
}
function getBoundary(flowElement) {
    let executor = '';
    if (flowElement.$type === 'bpmn:BoundaryEvent') {
        executor += flowElement.eventDefinitions.filter(extElem => extElem.$type === 'bpmn:ErrorEventDefinition').map(extElem => extElem.id).join(',');
        executor += flowElement.eventDefinitions.filter(extElem => extElem.$type === 'bpmn:MessageEventDefinition').map(extElem => extElem.id).join(',');
    }
    return executor;
}
function getGateway(flowElement) {
    var _a, _b;
    let executor = '';
    if (flowElement.$type === 'bpmn:ExclusiveGateway' || flowElement.$type === 'bpmn:ParallelGateway') {
        if (((_a = flowElement.incoming) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            executor += "Incoming: \n ";
            flowElement.incoming.forEach(function (_value, i) {
                var _a;
                executor += (i + 1) + ": " + flowElement.incoming[i].id + " \n ";
                if (flowElement.incoming[i].conditionExpression !== undefined && flowElement.outgoing[i].conditionExpression !== null)
                    executor += " \n " + ((_a = flowElement.incoming[i]) === null || _a === void 0 ? void 0 : _a.conditionExpression.body) + " \n \n";
                else {
                    executor += " condition: none" + " \n ";
                }
            });
        }
        if (((_b = flowElement.outgoing) === null || _b === void 0 ? void 0 : _b.length) > 0) {
            executor += "Decisions : \n";
            flowElement.outgoing.forEach(function (_value, i) {
                var _a;
                executor += (i + 1) + ": " + flowElement.outgoing[i].id + " \n ";
                if (flowElement.outgoing[i].conditionExpression !== undefined && flowElement.outgoing[i].conditionExpression !== null)
                    executor += "condition" + ((_a = flowElement.outgoing[i]) === null || _a === void 0 ? void 0 : _a.conditionExpression.body) + " \n \n";
                else
                    executor += "condition: none (default flow)" + " \n ";
            });
        }
    }
    return executor;
}
function generateWord(processDiagram, template) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const processElements = processDiagram.flowElements.filter(flowElement => (flowElement === null || flowElement === void 0 ? void 0 : flowElement.name) !== undefined && (flowElement === null || flowElement === void 0 ? void 0 : flowElement.name) !== '').map((flowElement, index) => ({
            order: index + 1,
            id: flowElement.id,
            name: flowElement.name,
            description: (flowElement.documentation !== undefined && flowElement.documentation.length > 0) ? flowElement.documentation[0].text : '',
            executor: getFlowElementExecutor(flowElement),
            type: getExtensionElementType(flowElement),
            call: getCallActivity(flowElement),
        }));
        const CallActivites = processDiagram.flowElements.filter(flowElement => (flowElement === null || flowElement === void 0 ? void 0 : flowElement.name) !== undefined && (flowElement === null || flowElement === void 0 ? void 0 : flowElement.name) !== '' && getCallActivity(flowElement) !== '').map((flowElement, index) => ({
            order: index + 1,
            id: flowElement.id,
            name: flowElement.name,
            description: (flowElement.documentation !== undefined && flowElement.documentation.length > 0) ? flowElement.documentation[0].text : '',
            executor: getFlowElementExecutor(flowElement),
            type: getExtensionElementType(flowElement),
            call: getCallActivity(flowElement)
        }));
        const JobWorkers = processDiagram.flowElements.filter(flowElement => (flowElement === null || flowElement === void 0 ? void 0 : flowElement.name) !== undefined && (flowElement === null || flowElement === void 0 ? void 0 : flowElement.name) !== '' && getExtensionElementType(flowElement) !== '').map((flowElement, index) => ({
            order: index + 1,
            id: flowElement.id,
            name: flowElement.name,
            description: (flowElement.documentation !== undefined && flowElement.documentation.length > 0) ? flowElement.documentation[0].text : '',
            executor: getFlowElementExecutor(flowElement),
            type: getExtensionElementType(flowElement),
            call: getCallActivity(flowElement)
        }));
        const GateWays = processDiagram.flowElements.filter(flowElement => (flowElement === null || flowElement === void 0 ? void 0 : flowElement.name) !== undefined && (flowElement === null || flowElement === void 0 ? void 0 : flowElement.name) !== '' && getGateway(flowElement) !== '').map((flowElement, index) => ({
            order: index + 1,
            id: flowElement.id,
            name: flowElement.name,
            description: (flowElement.documentation !== undefined && flowElement.documentation.length > 0) ? flowElement.documentation[0].text : '',
            incoming: getGateway(flowElement)
        }));
        const Lanes = (_b = (_a = processDiagram.laneSet) === null || _a === void 0 ? void 0 : _a.lane) === null || _b === void 0 ? void 0 : _b.filter(flowElement => (flowElement === null || flowElement === void 0 ? void 0 : flowElement.name) !== undefined && (flowElement === null || flowElement === void 0 ? void 0 : flowElement.name) !== '').map((flowElement, index) => ({
            order: index + 1,
            id: flowElement.id,
            name: flowElement.name,
            description: ""
        }));
        const Boundaries = processDiagram.flowElements.filter(flowElement => getBoundary(flowElement) !== '').map((flowElement, index) => ({
            order: index + 1,
            id: flowElement.id,
            name: flowElement.name,
            description: (flowElement.documentation !== undefined && flowElement.documentation.length > 0) ? flowElement.documentation[0].text : '',
            boundary: getBoundary(flowElement)
        }));
        // process the template
        const handler = new easy_template_x__WEBPACK_IMPORTED_MODULE_0__.TemplateHandler();
        const data = {
            processName: (processDiagram.name !== undefined) ? processDiagram.name : '',
            processId: (processDiagram.id !== undefined) ? processDiagram.name : '',
            processIsExecutable: (processDiagram.isExecutable !== undefined) ? processDiagram.isExecutable : '',
            processDocumentation: processDiagram.documentation !== undefined && processDiagram.documentation.length === 1 ? processDiagram.documentation[0].text : '',
            activities: processElements,
            callActivities: CallActivites,
            jobWorkers: JobWorkers,
            gateWays: GateWays,
            lanes: Lanes,
            boundaries: Boundaries
        };
        const doc = yield handler.process(Buffer.from(template), data);
        return doc;
    });
}


/***/ }),

/***/ "./node_modules/bpmn-moddle/dist/index.esm.js":
/*!****************************************************!*\
  !*** ./node_modules/bpmn-moddle/dist/index.esm.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ simple)
/* harmony export */ });
/* harmony import */ var min_dash__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! min-dash */ "./node_modules/min-dash/dist/index.esm.js");
/* harmony import */ var moddle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! moddle */ "./node_modules/moddle/dist/index.esm.js");
/* harmony import */ var moddle_xml__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! moddle-xml */ "./node_modules/moddle-xml/dist/index.esm.js");




/**
 * A sub class of {@link Moddle} with support for import and export of BPMN 2.0 xml files.
 *
 * @class BpmnModdle
 * @extends Moddle
 *
 * @param {Object|Array} packages to use for instantiating the model
 * @param {Object} [options] additional options to pass over
 */
function BpmnModdle(packages, options) {
  moddle__WEBPACK_IMPORTED_MODULE_0__.Moddle.call(this, packages, options);
}

BpmnModdle.prototype = Object.create(moddle__WEBPACK_IMPORTED_MODULE_0__.Moddle.prototype);

/**
 * The fromXML result.
 *
 * @typedef {Object} ParseResult
 *
 * @property {ModdleElement} rootElement
 * @property {Array<Object>} references
 * @property {Array<Error>} warnings
 * @property {Object} elementsById - a mapping containing each ID -> ModdleElement
 */

/**
 * The fromXML error.
 *
 * @typedef {Error} ParseError
 *
 * @property {Array<Error>} warnings
 */

/**
 * Instantiates a BPMN model tree from a given xml string.
 *
 * @param {String}   xmlStr
 * @param {String}   [typeName='bpmn:Definitions'] name of the root element
 * @param {Object}   [options]  options to pass to the underlying reader
 *
 * @returns {Promise<ParseResult, ParseError>}
 */
BpmnModdle.prototype.fromXML = function(xmlStr, typeName, options) {

  if (!(0,min_dash__WEBPACK_IMPORTED_MODULE_1__.isString)(typeName)) {
    options = typeName;
    typeName = 'bpmn:Definitions';
  }

  var reader = new moddle_xml__WEBPACK_IMPORTED_MODULE_2__.Reader((0,min_dash__WEBPACK_IMPORTED_MODULE_1__.assign)({ model: this, lax: true }, options));
  var rootHandler = reader.handler(typeName);

  return reader.fromXML(xmlStr, rootHandler);
};


/**
 * The toXML result.
 *
 * @typedef {Object} SerializationResult
 *
 * @property {String} xml
 */

/**
 * Serializes a BPMN 2.0 object tree to XML.
 *
 * @param {String}   element    the root element, typically an instance of `bpmn:Definitions`
 * @param {Object}   [options]  to pass to the underlying writer
 *
 * @returns {Promise<SerializationResult, Error>}
 */
BpmnModdle.prototype.toXML = function(element, options) {

  var writer = new moddle_xml__WEBPACK_IMPORTED_MODULE_2__.Writer(options);

  return new Promise(function(resolve, reject) {
    try {
      var result = writer.toXML(element);

      return resolve({
        xml: result
      });
    } catch (err) {
      return reject(err);
    }
  });
};

var name$5 = "BPMN20";
var uri$5 = "http://www.omg.org/spec/BPMN/20100524/MODEL";
var prefix$5 = "bpmn";
var associations$5 = [
];
var types$5 = [
	{
		name: "Interface",
		superClass: [
			"RootElement"
		],
		properties: [
			{
				name: "name",
				isAttr: true,
				type: "String"
			},
			{
				name: "operations",
				type: "Operation",
				isMany: true
			},
			{
				name: "implementationRef",
				isAttr: true,
				type: "String"
			}
		]
	},
	{
		name: "Operation",
		superClass: [
			"BaseElement"
		],
		properties: [
			{
				name: "name",
				isAttr: true,
				type: "String"
			},
			{
				name: "inMessageRef",
				type: "Message",
				isReference: true
			},
			{
				name: "outMessageRef",
				type: "Message",
				isReference: true
			},
			{
				name: "errorRef",
				type: "Error",
				isMany: true,
				isReference: true
			},
			{
				name: "implementationRef",
				isAttr: true,
				type: "String"
			}
		]
	},
	{
		name: "EndPoint",
		superClass: [
			"RootElement"
		]
	},
	{
		name: "Auditing",
		superClass: [
			"BaseElement"
		]
	},
	{
		name: "GlobalTask",
		superClass: [
			"CallableElement"
		],
		properties: [
			{
				name: "resources",
				type: "ResourceRole",
				isMany: true
			}
		]
	},
	{
		name: "Monitoring",
		superClass: [
			"BaseElement"
		]
	},
	{
		name: "Performer",
		superClass: [
			"ResourceRole"
		]
	},
	{
		name: "Process",
		superClass: [
			"FlowElementsContainer",
			"CallableElement"
		],
		properties: [
			{
				name: "processType",
				type: "ProcessType",
				isAttr: true
			},
			{
				name: "isClosed",
				isAttr: true,
				type: "Boolean"
			},
			{
				name: "auditing",
				type: "Auditing"
			},
			{
				name: "monitoring",
				type: "Monitoring"
			},
			{
				name: "properties",
				type: "Property",
				isMany: true
			},
			{
				name: "laneSets",
				isMany: true,
				replaces: "FlowElementsContainer#laneSets",
				type: "LaneSet"
			},
			{
				name: "flowElements",
				isMany: true,
				replaces: "FlowElementsContainer#flowElements",
				type: "FlowElement"
			},
			{
				name: "artifacts",
				type: "Artifact",
				isMany: true
			},
			{
				name: "resources",
				type: "ResourceRole",
				isMany: true
			},
			{
				name: "correlationSubscriptions",
				type: "CorrelationSubscription",
				isMany: true
			},
			{
				name: "supports",
				type: "Process",
				isMany: true,
				isReference: true
			},
			{
				name: "definitionalCollaborationRef",
				type: "Collaboration",
				isAttr: true,
				isReference: true
			},
			{
				name: "isExecutable",
				isAttr: true,
				type: "Boolean"
			}
		]
	},
	{
		name: "LaneSet",
		superClass: [
			"BaseElement"
		],
		properties: [
			{
				name: "lanes",
				type: "Lane",
				isMany: true
			},
			{
				name: "name",
				isAttr: true,
				type: "String"
			}
		]
	},
	{
		name: "Lane",
		superClass: [
			"BaseElement"
		],
		properties: [
			{
				name: "name",
				isAttr: true,
				type: "String"
			},
			{
				name: "partitionElementRef",
				type: "BaseElement",
				isAttr: true,
				isReference: true
			},
			{
				name: "partitionElement",
				type: "BaseElement"
			},
			{
				name: "flowNodeRef",
				type: "FlowNode",
				isMany: true,
				isReference: true
			},
			{
				name: "childLaneSet",
				type: "LaneSet",
				xml: {
					serialize: "xsi:type"
				}
			}
		]
	},
	{
		name: "GlobalManualTask",
		superClass: [
			"GlobalTask"
		]
	},
	{
		name: "ManualTask",
		superClass: [
			"Task"
		]
	},
	{
		name: "UserTask",
		superClass: [
			"Task"
		],
		properties: [
			{
				name: "renderings",
				type: "Rendering",
				isMany: true
			},
			{
				name: "implementation",
				isAttr: true,
				type: "String"
			}
		]
	},
	{
		name: "Rendering",
		superClass: [
			"BaseElement"
		]
	},
	{
		name: "HumanPerformer",
		superClass: [
			"Performer"
		]
	},
	{
		name: "PotentialOwner",
		superClass: [
			"HumanPerformer"
		]
	},
	{
		name: "GlobalUserTask",
		superClass: [
			"GlobalTask"
		],
		properties: [
			{
				name: "implementation",
				isAttr: true,
				type: "String"
			},
			{
				name: "renderings",
				type: "Rendering",
				isMany: true
			}
		]
	},
	{
		name: "Gateway",
		isAbstract: true,
		superClass: [
			"FlowNode"
		],
		properties: [
			{
				name: "gatewayDirection",
				type: "GatewayDirection",
				"default": "Unspecified",
				isAttr: true
			}
		]
	},
	{
		name: "EventBasedGateway",
		superClass: [
			"Gateway"
		],
		properties: [
			{
				name: "instantiate",
				"default": false,
				isAttr: true,
				type: "Boolean"
			},
			{
				name: "eventGatewayType",
				type: "EventBasedGatewayType",
				isAttr: true,
				"default": "Exclusive"
			}
		]
	},
	{
		name: "ComplexGateway",
		superClass: [
			"Gateway"
		],
		properties: [
			{
				name: "activationCondition",
				type: "Expression",
				xml: {
					serialize: "xsi:type"
				}
			},
			{
				name: "default",
				type: "SequenceFlow",
				isAttr: true,
				isReference: true
			}
		]
	},
	{
		name: "ExclusiveGateway",
		superClass: [
			"Gateway"
		],
		properties: [
			{
				name: "default",
				type: "SequenceFlow",
				isAttr: true,
				isReference: true
			}
		]
	},
	{
		name: "InclusiveGateway",
		superClass: [
			"Gateway"
		],
		properties: [
			{
				name: "default",
				type: "SequenceFlow",
				isAttr: true,
				isReference: true
			}
		]
	},
	{
		name: "ParallelGateway",
		superClass: [
			"Gateway"
		]
	},
	{
		name: "RootElement",
		isAbstract: true,
		superClass: [
			"BaseElement"
		]
	},
	{
		name: "Relationship",
		superClass: [
			"BaseElement"
		],
		properties: [
			{
				name: "type",
				isAttr: true,
				type: "String"
			},
			{
				name: "direction",
				type: "RelationshipDirection",
				isAttr: true
			},
			{
				name: "source",
				isMany: true,
				isReference: true,
				type: "Element"
			},
			{
				name: "target",
				isMany: true,
				isReference: true,
				type: "Element"
			}
		]
	},
	{
		name: "BaseElement",
		isAbstract: true,
		properties: [
			{
				name: "id",
				isAttr: true,
				type: "String",
				isId: true
			},
			{
				name: "documentation",
				type: "Documentation",
				isMany: true
			},
			{
				name: "extensionDefinitions",
				type: "ExtensionDefinition",
				isMany: true,
				isReference: true
			},
			{
				name: "extensionElements",
				type: "ExtensionElements"
			}
		]
	},
	{
		name: "Extension",
		properties: [
			{
				name: "mustUnderstand",
				"default": false,
				isAttr: true,
				type: "Boolean"
			},
			{
				name: "definition",
				type: "ExtensionDefinition",
				isAttr: true,
				isReference: true
			}
		]
	},
	{
		name: "ExtensionDefinition",
		properties: [
			{
				name: "name",
				isAttr: true,
				type: "String"
			},
			{
				name: "extensionAttributeDefinitions",
				type: "ExtensionAttributeDefinition",
				isMany: true
			}
		]
	},
	{
		name: "ExtensionAttributeDefinition",
		properties: [
			{
				name: "name",
				isAttr: true,
				type: "String"
			},
			{
				name: "type",
				isAttr: true,
				type: "String"
			},
			{
				name: "isReference",
				"default": false,
				isAttr: true,
				type: "Boolean"
			},
			{
				name: "extensionDefinition",
				type: "ExtensionDefinition",
				isAttr: true,
				isReference: true
			}
		]
	},
	{
		name: "ExtensionElements",
		properties: [
			{
				name: "valueRef",
				isAttr: true,
				isReference: true,
				type: "Element"
			},
			{
				name: "values",
				type: "Element",
				isMany: true
			},
			{
				name: "extensionAttributeDefinition",
				type: "ExtensionAttributeDefinition",
				isAttr: true,
				isReference: true
			}
		]
	},
	{
		name: "Documentation",
		superClass: [
			"BaseElement"
		],
		properties: [
			{
				name: "text",
				type: "String",
				isBody: true
			},
			{
				name: "textFormat",
				"default": "text/plain",
				isAttr: true,
				type: "String"
			}
		]
	},
	{
		name: "Event",
		isAbstract: true,
		superClass: [
			"FlowNode",
			"InteractionNode"
		],
		properties: [
			{
				name: "properties",
				type: "Property",
				isMany: true
			}
		]
	},
	{
		name: "IntermediateCatchEvent",
		superClass: [
			"CatchEvent"
		]
	},
	{
		name: "IntermediateThrowEvent",
		superClass: [
			"ThrowEvent"
		]
	},
	{
		name: "EndEvent",
		superClass: [
			"ThrowEvent"
		]
	},
	{
		name: "StartEvent",
		superClass: [
			"CatchEvent"
		],
		properties: [
			{
				name: "isInterrupting",
				"default": true,
				isAttr: true,
				type: "Boolean"
			}
		]
	},
	{
		name: "ThrowEvent",
		isAbstract: true,
		superClass: [
			"Event"
		],
		properties: [
			{
				name: "dataInputs",
				type: "DataInput",
				isMany: true
			},
			{
				name: "dataInputAssociations",
				type: "DataInputAssociation",
				isMany: true
			},
			{
				name: "inputSet",
				type: "InputSet"
			},
			{
				name: "eventDefinitions",
				type: "EventDefinition",
				isMany: true
			},
			{
				name: "eventDefinitionRef",
				type: "EventDefinition",
				isMany: true,
				isReference: true
			}
		]
	},
	{
		name: "CatchEvent",
		isAbstract: true,
		superClass: [
			"Event"
		],
		properties: [
			{
				name: "parallelMultiple",
				isAttr: true,
				type: "Boolean",
				"default": false
			},
			{
				name: "dataOutputs",
				type: "DataOutput",
				isMany: true
			},
			{
				name: "dataOutputAssociations",
				type: "DataOutputAssociation",
				isMany: true
			},
			{
				name: "outputSet",
				type: "OutputSet"
			},
			{
				name: "eventDefinitions",
				type: "EventDefinition",
				isMany: true
			},
			{
				name: "eventDefinitionRef",
				type: "EventDefinition",
				isMany: true,
				isReference: true
			}
		]
	},
	{
		name: "BoundaryEvent",
		superClass: [
			"CatchEvent"
		],
		properties: [
			{
				name: "cancelActivity",
				"default": true,
				isAttr: true,
				type: "Boolean"
			},
			{
				name: "attachedToRef",
				type: "Activity",
				isAttr: true,
				isReference: true
			}
		]
	},
	{
		name: "EventDefinition",
		isAbstract: true,
		superClass: [
			"RootElement"
		]
	},
	{
		name: "CancelEventDefinition",
		superClass: [
			"EventDefinition"
		]
	},
	{
		name: "ErrorEventDefinition",
		superClass: [
			"EventDefinition"
		],
		properties: [
			{
				name: "errorRef",
				type: "Error",
				isAttr: true,
				isReference: true
			}
		]
	},
	{
		name: "TerminateEventDefinition",
		superClass: [
			"EventDefinition"
		]
	},
	{
		name: "EscalationEventDefinition",
		superClass: [
			"EventDefinition"
		],
		properties: [
			{
				name: "escalationRef",
				type: "Escalation",
				isAttr: true,
				isReference: true
			}
		]
	},
	{
		name: "Escalation",
		properties: [
			{
				name: "structureRef",
				type: "ItemDefinition",
				isAttr: true,
				isReference: true
			},
			{
				name: "name",
				isAttr: true,
				type: "String"
			},
			{
				name: "escalationCode",
				isAttr: true,
				type: "String"
			}
		],
		superClass: [
			"RootElement"
		]
	},
	{
		name: "CompensateEventDefinition",
		superClass: [
			"EventDefinition"
		],
		properties: [
			{
				name: "waitForCompletion",
				isAttr: true,
				type: "Boolean",
				"default": true
			},
			{
				name: "activityRef",
				type: "Activity",
				isAttr: true,
				isReference: true
			}
		]
	},
	{
		name: "TimerEventDefinition",
		superClass: [
			"EventDefinition"
		],
		properties: [
			{
				name: "timeDate",
				type: "Expression",
				xml: {
					serialize: "xsi:type"
				}
			},
			{
				name: "timeCycle",
				type: "Expression",
				xml: {
					serialize: "xsi:type"
				}
			},
			{
				name: "timeDuration",
				type: "Expression",
				xml: {
					serialize: "xsi:type"
				}
			}
		]
	},
	{
		name: "LinkEventDefinition",
		superClass: [
			"EventDefinition"
		],
		properties: [
			{
				name: "name",
				isAttr: true,
				type: "String"
			},
			{
				name: "target",
				type: "LinkEventDefinition",
				isAttr: true,
				isReference: true
			},
			{
				name: "source",
				type: "LinkEventDefinition",
				isMany: true,
				isReference: true
			}
		]
	},
	{
		name: "MessageEventDefinition",
		superClass: [
			"EventDefinition"
		],
		properties: [
			{
				name: "messageRef",
				type: "Message",
				isAttr: true,
				isReference: true
			},
			{
				name: "operationRef",
				type: "Operation",
				isAttr: true,
				isReference: true
			}
		]
	},
	{
		name: "ConditionalEventDefinition",
		superClass: [
			"EventDefinition"
		],
		properties: [
			{
				name: "condition",
				type: "Expression",
				xml: {
					serialize: "xsi:type"
				}
			}
		]
	},
	{
		name: "SignalEventDefinition",
		superClass: [
			"EventDefinition"
		],
		properties: [
			{
				name: "signalRef",
				type: "Signal",
				isAttr: true,
				isReference: true
			}
		]
	},
	{
		name: "Signal",
		superClass: [
			"RootElement"
		],
		properties: [
			{
				name: "structureRef",
				type: "ItemDefinition",
				isAttr: true,
				isReference: true
			},
			{
				name: "name",
				isAttr: true,
				type: "String"
			}
		]
	},
	{
		name: "ImplicitThrowEvent",
		superClass: [
			"ThrowEvent"
		]
	},
	{
		name: "DataState",
		superClass: [
			"BaseElement"
		],
		properties: [
			{
				name: "name",
				isAttr: true,
				type: "String"
			}
		]
	},
	{
		name: "ItemAwareElement",
		superClass: [
			"BaseElement"
		],
		properties: [
			{
				name: "itemSubjectRef",
				type: "ItemDefinition",
				isAttr: true,
				isReference: true
			},
			{
				name: "dataState",
				type: "DataState"
			}
		]
	},
	{
		name: "DataAssociation",
		superClass: [
			"BaseElement"
		],
		properties: [
			{
				name: "sourceRef",
				type: "ItemAwareElement",
				isMany: true,
				isReference: true
			},
			{
				name: "targetRef",
				type: "ItemAwareElement",
				isReference: true
			},
			{
				name: "transformation",
				type: "FormalExpression",
				xml: {
					serialize: "property"
				}
			},
			{
				name: "assignment",
				type: "Assignment",
				isMany: true
			}
		]
	},
	{
		name: "DataInput",
		superClass: [
			"ItemAwareElement"
		],
		properties: [
			{
				name: "name",
				isAttr: true,
				type: "String"
			},
			{
				name: "isCollection",
				"default": false,
				isAttr: true,
				type: "Boolean"
			},
			{
				name: "inputSetRef",
				type: "InputSet",
				isMany: true,
				isVirtual: true,
				isReference: true
			},
			{
				name: "inputSetWithOptional",
				type: "InputSet",
				isMany: true,
				isVirtual: true,
				isReference: true
			},
			{
				name: "inputSetWithWhileExecuting",
				type: "InputSet",
				isMany: true,
				isVirtual: true,
				isReference: true
			}
		]
	},
	{
		name: "DataOutput",
		superClass: [
			"ItemAwareElement"
		],
		properties: [
			{
				name: "name",
				isAttr: true,
				type: "String"
			},
			{
				name: "isCollection",
				"default": false,
				isAttr: true,
				type: "Boolean"
			},
			{
				name: "outputSetRef",
				type: "OutputSet",
				isMany: true,
				isVirtual: true,
				isReference: true
			},
			{
				name: "outputSetWithOptional",
				type: "OutputSet",
				isMany: true,
				isVirtual: true,
				isReference: true
			},
			{
				name: "outputSetWithWhileExecuting",
				type: "OutputSet",
				isMany: true,
				isVirtual: true,
				isReference: true
			}
		]
	},
	{
		name: "InputSet",
		superClass: [
			"BaseElement"
		],
		properties: [
			{
				name: "name",
				isAttr: true,
				type: "String"
			},
			{
				name: "dataInputRefs",
				type: "DataInput",
				isMany: true,
				isReference: true
			},
			{
				name: "optionalInputRefs",
				type: "DataInput",
				isMany: true,
				isReference: true
			},
			{
				name: "whileExecutingInputRefs",
				type: "DataInput",
				isMany: true,
				isReference: true
			},
			{
				name: "outputSetRefs",
				type: "OutputSet",
				isMany: true,
				isReference: true
			}
		]
	},
	{
		name: "OutputSet",
		superClass: [
			"BaseElement"
		],
		properties: [
			{
				name: "dataOutputRefs",
				type: "DataOutput",
				isMany: true,
				isReference: true
			},
			{
				name: "name",
				isAttr: true,
				type: "String"
			},
			{
				name: "inputSetRefs",
				type: "InputSet",
				isMany: true,
				isReference: true
			},
			{
				name: "optionalOutputRefs",
				type: "DataOutput",
				isMany: true,
				isReference: true
			},
			{
				name: "whileExecutingOutputRefs",
				type: "DataOutput",
				isMany: true,
				isReference: true
			}
		]
	},
	{
		name: "Property",
		superClass: [
			"ItemAwareElement"
		],
		properties: [
			{
				name: "name",
				isAttr: true,
				type: "String"
			}
		]
	},
	{
		name: "DataInputAssociation",
		superClass: [
			"DataAssociation"
		]
	},
	{
		name: "DataOutputAssociation",
		superClass: [
			"DataAssociation"
		]
	},
	{
		name: "InputOutputSpecification",
		superClass: [
			"BaseElement"
		],
		properties: [
			{
				name: "dataInputs",
				type: "DataInput",
				isMany: true
			},
			{
				name: "dataOutputs",
				type: "DataOutput",
				isMany: true
			},
			{
				name: "inputSets",
				type: "InputSet",
				isMany: true
			},
			{
				name: "outputSets",
				type: "OutputSet",
				isMany: true
			}
		]
	},
	{
		name: "DataObject",
		superClass: [
			"FlowElement",
			"ItemAwareElement"
		],
		properties: [
			{
				name: "isCollection",
				"default": false,
				isAttr: true,
				type: "Boolean"
			}
		]
	},
	{
		name: "InputOutputBinding",
		properties: [
			{
				name: "inputDataRef",
				type: "InputSet",
				isAttr: true,
				isReference: true
			},
			{
				name: "outputDataRef",
				type: "OutputSet",
				isAttr: true,
				isReference: true
			},
			{
				name: "operationRef",
				type: "Operation",
				isAttr: true,
				isReference: true
			}
		]
	},
	{
		name: "Assignment",
		superClass: [
			"BaseElement"
		],
		properties: [
			{
				name: "from",
				type: "Expression",
				xml: {
					serialize: "xsi:type"
				}
			},
			{
				name: "to",
				type: "Expression",
				xml: {
					serialize: "xsi:type"
				}
			}
		]
	},
	{
		name: "DataStore",
		superClass: [
			"RootElement",
			"ItemAwareElement"
		],
		properties: [
			{
				name: "name",
				isAttr: true,
				type: "String"
			},
			{
				name: "capacity",
				isAttr: true,
				type: "Integer"
			},
			{
				name: "isUnlimited",
				"default": true,
				isAttr: true,
				type: "Boolean"
			}
		]
	},
	{
		name: "DataStoreReference",
		superClass: [
			"ItemAwareElement",
			"FlowElement"
		],
		properties: [
			{
				name: "dataStoreRef",
				type: "DataStore",
				isAttr: true,
				isReference: true
			}
		]
	},
	{
		name: "DataObjectReference",
		superClass: [
			"ItemAwareElement",
			"FlowElement"
		],
		properties: [
			{
				name: "dataObjectRef",
				type: "DataObject",
				isAttr: true,
				isReference: true
			}
		]
	},
	{
		name: "ConversationLink",
		superClass: [
			"BaseElement"
		],
		properties: [
			{
				name: "sourceRef",
				type: "InteractionNode",
				isAttr: true,
				isReference: true
			},
			{
				name: "targetRef",
				type: "InteractionNode",
				isAttr: true,
				isReference: true
			},
			{
				name: "name",
				isAttr: true,
				type: "String"
			}
		]
	},
	{
		name: "ConversationAssociation",
		superClass: [
			"BaseElement"
		],
		properties: [
			{
				name: "innerConversationNodeRef",
				type: "ConversationNode",
				isAttr: true,
				isReference: true
			},
			{
				name: "outerConversationNodeRef",
				type: "ConversationNode",
				isAttr: true,
				isReference: true
			}
		]
	},
	{
		name: "CallConversation",
		superClass: [
			"ConversationNode"
		],
		properties: [
			{
				name: "calledCollaborationRef",
				type: "Collaboration",
				isAttr: true,
				isReference: true
			},
			{
				name: "participantAssociations",
				type: "ParticipantAssociation",
				isMany: true
			}
		]
	},
	{
		name: "Conversation",
		superClass: [
			"ConversationNode"
		]
	},
	{
		name: "SubConversation",
		superClass: [
			"ConversationNode"
		],
		properties: [
			{
				name: "conversationNodes",
				type: "ConversationNode",
				isMany: true
			}
		]
	},
	{
		name: "ConversationNode",
		isAbstract: true,
		superClass: [
			"InteractionNode",
			"BaseElement"
		],
		properties: [
			{
				name: "name",
				isAttr: true,
				type: "String"
			},
			{
				name: "participantRef",
				type: "Participant",
				isMany: true,
				isReference: true
			},
			{
				name: "messageFlowRefs",
				type: "MessageFlow",
				isMany: true,
				isReference: true
			},
			{
				name: "correlationKeys",
				type: "CorrelationKey",
				isMany: true
			}
		]
	},
	{
		name: "GlobalConversation",
		superClass: [
			"Collaboration"
		]
	},
	{
		name: "PartnerEntity",
		superClass: [
			"RootElement"
		],
		properties: [
			{
				name: "name",
				isAttr: true,
				type: "String"
			},
			{
				name: "participantRef",
				type: "Participant",
				isMany: true,
				isReference: true
			}
		]
	},
	{
		name: "PartnerRole",
		superClass: [
			"RootElement"
		],
		properties: [
			{
				name: "name",
				isAttr: true,
				type: "String"
			},
			{
				name: "participantRef",
				type: "Participant",
				isMany: true,
				isReference: true
			}
		]
	},
	{
		name: "CorrelationProperty",
		superClass: [
			"RootElement"
		],
		properties: [
			{
				name: "correlationPropertyRetrievalExpression",
				type: "CorrelationPropertyRetrievalExpression",
				isMany: true
			},
			{
				name: "name",
				isAttr: true,
				type: "String"
			},
			{
				name: "type",
				type: "ItemDefinition",
				isAttr: true,
				isReference: true
			}
		]
	},
	{
		name: "Error",
		superClass: [
			"RootElement"
		],
		properties: [
			{
				name: "structureRef",
				type: "ItemDefinition",
				isAttr: true,
				isReference: true
			},
			{
				name: "name",
				isAttr: true,
				type: "String"
			},
			{
				name: "errorCode",
				isAttr: true,
				type: "String"
			}
		]
	},
	{
		name: "CorrelationKey",
		superClass: [
			"BaseElement"
		],
		properties: [
			{
				name: "correlationPropertyRef",
				type: "CorrelationProperty",
				isMany: true,
				isReference: true
			},
			{
				name: "name",
				isAttr: true,
				type: "String"
			}
		]
	},
	{
		name: "Expression",
		superClass: [
			"BaseElement"
		],
		isAbstract: false,
		properties: [
			{
				name: "body",
				isBody: true,
				type: "String"
			}
		]
	},
	{
		name: "FormalExpression",
		superClass: [
			"Expression"
		],
		properties: [
			{
				name: "language",
				isAttr: true,
				type: "String"
			},
			{
				name: "evaluatesToTypeRef",
				type: "ItemDefinition",
				isAttr: true,
				isReference: true
			}
		]
	},
	{
		name: "Message",
		superClass: [
			"RootElement"
		],
		properties: [
			{
				name: "name",
				isAttr: true,
				type: "String"
			},
			{
				name: "itemRef",
				type: "ItemDefinition",
				isAttr: true,
				isReference: true
			}
		]
	},
	{
		name: "ItemDefinition",
		superClass: [
			"RootElement"
		],
		properties: [
			{
				name: "itemKind",
				type: "ItemKind",
				isAttr: true
			},
			{
				name: "structureRef",
				isAttr: true,
				type: "String"
			},
			{
				name: "isCollection",
				"default": false,
				isAttr: true,
				type: "Boolean"
			},
			{
				name: "import",
				type: "Import",
				isAttr: true,
				isReference: true
			}
		]
	},
	{
		name: "FlowElement",
		isAbstract: true,
		superClass: [
			"BaseElement"
		],
		properties: [
			{
				name: "name",
				isAttr: true,
				type: "String"
			},
			{
				name: "auditing",
				type: "Auditing"
			},
			{
				name: "monitoring",
				type: "Monitoring"
			},
			{
				name: "categoryValueRef",
				type: "CategoryValue",
				isMany: true,
				isReference: true
			}
		]
	},
	{
		name: "SequenceFlow",
		superClass: [
			"FlowElement"
		],
		properties: [
			{
				name: "isImmediate",
				isAttr: true,
				type: "Boolean"
			},
			{
				name: "conditionExpression",
				type: "Expression",
				xml: {
					serialize: "xsi:type"
				}
			},
			{
				name: "sourceRef",
				type: "FlowNode",
				isAttr: true,
				isReference: true
			},
			{
				name: "targetRef",
				type: "FlowNode",
				isAttr: true,
				isReference: true
			}
		]
	},
	{
		name: "FlowElementsContainer",
		isAbstract: true,
		superClass: [
			"BaseElement"
		],
		properties: [
			{
				name: "laneSets",
				type: "LaneSet",
				isMany: true
			},
			{
				name: "flowElements",
				type: "FlowElement",
				isMany: true
			}
		]
	},
	{
		name: "CallableElement",
		isAbstract: true,
		superClass: [
			"RootElement"
		],
		properties: [
			{
				name: "name",
				isAttr: true,
				type: "String"
			},
			{
				name: "ioSpecification",
				type: "InputOutputSpecification",
				xml: {
					serialize: "property"
				}
			},
			{
				name: "supportedInterfaceRef",
				type: "Interface",
				isMany: true,
				isReference: true
			},
			{
				name: "ioBinding",
				type: "InputOutputBinding",
				isMany: true,
				xml: {
					serialize: "property"
				}
			}
		]
	},
	{
		name: "FlowNode",
		isAbstract: true,
		superClass: [
			"FlowElement"
		],
		properties: [
			{
				name: "incoming",
				type: "SequenceFlow",
				isMany: true,
				isReference: true
			},
			{
				name: "outgoing",
				type: "SequenceFlow",
				isMany: true,
				isReference: true
			},
			{
				name: "lanes",
				type: "Lane",
				isMany: true,
				isVirtual: true,
				isReference: true
			}
		]
	},
	{
		name: "CorrelationPropertyRetrievalExpression",
		superClass: [
			"BaseElement"
		],
		properties: [
			{
				name: "messagePath",
				type: "FormalExpression"
			},
			{
				name: "messageRef",
				type: "Message",
				isAttr: true,
				isReference: true
			}
		]
	},
	{
		name: "CorrelationPropertyBinding",
		superClass: [
			"BaseElement"
		],
		properties: [
			{
				name: "dataPath",
				type: "FormalExpression"
			},
			{
				name: "correlationPropertyRef",
				type: "CorrelationProperty",
				isAttr: true,
				isReference: true
			}
		]
	},
	{
		name: "Resource",
		superClass: [
			"RootElement"
		],
		properties: [
			{
				name: "name",
				isAttr: true,
				type: "String"
			},
			{
				name: "resourceParameters",
				type: "ResourceParameter",
				isMany: true
			}
		]
	},
	{
		name: "ResourceParameter",
		superClass: [
			"BaseElement"
		],
		properties: [
			{
				name: "name",
				isAttr: true,
				type: "String"
			},
			{
				name: "isRequired",
				isAttr: true,
				type: "Boolean"
			},
			{
				name: "type",
				type: "ItemDefinition",
				isAttr: true,
				isReference: true
			}
		]
	},
	{
		name: "CorrelationSubscription",
		superClass: [
			"BaseElement"
		],
		properties: [
			{
				name: "correlationKeyRef",
				type: "CorrelationKey",
				isAttr: true,
				isReference: true
			},
			{
				name: "correlationPropertyBinding",
				type: "CorrelationPropertyBinding",
				isMany: true
			}
		]
	},
	{
		name: "MessageFlow",
		superClass: [
			"BaseElement"
		],
		properties: [
			{
				name: "name",
				isAttr: true,
				type: "String"
			},
			{
				name: "sourceRef",
				type: "InteractionNode",
				isAttr: true,
				isReference: true
			},
			{
				name: "targetRef",
				type: "InteractionNode",
				isAttr: true,
				isReference: true
			},
			{
				name: "messageRef",
				type: "Message",
				isAttr: true,
				isReference: true
			}
		]
	},
	{
		name: "MessageFlowAssociation",
		superClass: [
			"BaseElement"
		],
		properties: [
			{
				name: "innerMessageFlowRef",
				type: "MessageFlow",
				isAttr: true,
				isReference: true
			},
			{
				name: "outerMessageFlowRef",
				type: "MessageFlow",
				isAttr: true,
				isReference: true
			}
		]
	},
	{
		name: "InteractionNode",
		isAbstract: true,
		properties: [
			{
				name: "incomingConversationLinks",
				type: "ConversationLink",
				isMany: true,
				isVirtual: true,
				isReference: true
			},
			{
				name: "outgoingConversationLinks",
				type: "ConversationLink",
				isMany: true,
				isVirtual: true,
				isReference: true
			}
		]
	},
	{
		name: "Participant",
		superClass: [
			"InteractionNode",
			"BaseElement"
		],
		properties: [
			{
				name: "name",
				isAttr: true,
				type: "String"
			},
			{
				name: "interfaceRef",
				type: "Interface",
				isMany: true,
				isReference: true
			},
			{
				name: "participantMultiplicity",
				type: "ParticipantMultiplicity"
			},
			{
				name: "endPointRefs",
				type: "EndPoint",
				isMany: true,
				isReference: true
			},
			{
				name: "processRef",
				type: "Process",
				isAttr: true,
				isReference: true
			}
		]
	},
	{
		name: "ParticipantAssociation",
		superClass: [
			"BaseElement"
		],
		properties: [
			{
				name: "innerParticipantRef",
				type: "Participant",
				isAttr: true,
				isReference: true
			},
			{
				name: "outerParticipantRef",
				type: "Participant",
				isAttr: true,
				isReference: true
			}
		]
	},
	{
		name: "ParticipantMultiplicity",
		properties: [
			{
				name: "minimum",
				"default": 0,
				isAttr: true,
				type: "Integer"
			},
			{
				name: "maximum",
				"default": 1,
				isAttr: true,
				type: "Integer"
			}
		],
		superClass: [
			"BaseElement"
		]
	},
	{
		name: "Collaboration",
		superClass: [
			"RootElement"
		],
		properties: [
			{
				name: "name",
				isAttr: true,
				type: "String"
			},
			{
				name: "isClosed",
				isAttr: true,
				type: "Boolean"
			},
			{
				name: "participants",
				type: "Participant",
				isMany: true
			},
			{
				name: "messageFlows",
				type: "MessageFlow",
				isMany: true
			},
			{
				name: "artifacts",
				type: "Artifact",
				isMany: true
			},
			{
				name: "conversations",
				type: "ConversationNode",
				isMany: true
			},
			{
				name: "conversationAssociations",
				type: "ConversationAssociation"
			},
			{
				name: "participantAssociations",
				type: "ParticipantAssociation",
				isMany: true
			},
			{
				name: "messageFlowAssociations",
				type: "MessageFlowAssociation",
				isMany: true
			},
			{
				name: "correlationKeys",
				type: "CorrelationKey",
				isMany: true
			},
			{
				name: "choreographyRef",
				type: "Choreography",
				isMany: true,
				isReference: true
			},
			{
				name: "conversationLinks",
				type: "ConversationLink",
				isMany: true
			}
		]
	},
	{
		name: "ChoreographyActivity",
		isAbstract: true,
		superClass: [
			"FlowNode"
		],
		properties: [
			{
				name: "participantRef",
				type: "Participant",
				isMany: true,
				isReference: true
			},
			{
				name: "initiatingParticipantRef",
				type: "Participant",
				isAttr: true,
				isReference: true
			},
			{
				name: "correlationKeys",
				type: "CorrelationKey",
				isMany: true
			},
			{
				name: "loopType",
				type: "ChoreographyLoopType",
				"default": "None",
				isAttr: true
			}
		]
	},
	{
		name: "CallChoreography",
		superClass: [
			"ChoreographyActivity"
		],
		properties: [
			{
				name: "calledChoreographyRef",
				type: "Choreography",
				isAttr: true,
				isReference: true
			},
			{
				name: "participantAssociations",
				type: "ParticipantAssociation",
				isMany: true
			}
		]
	},
	{
		name: "SubChoreography",
		superClass: [
			"ChoreographyActivity",
			"FlowElementsContainer"
		],
		properties: [
			{
				name: "artifacts",
				type: "Artifact",
				isMany: true
			}
		]
	},
	{
		name: "ChoreographyTask",
		superClass: [
			"ChoreographyActivity"
		],
		properties: [
			{
				name: "messageFlowRef",
				type: "MessageFlow",
				isMany: true,
				isReference: true
			}
		]
	},
	{
		name: "Choreography",
		superClass: [
			"Collaboration",
			"FlowElementsContainer"
		]
	},
	{
		name: "GlobalChoreographyTask",
		superClass: [
			"Choreography"
		],
		properties: [
			{
				name: "initiatingParticipantRef",
				type: "Participant",
				isAttr: true,
				isReference: true
			}
		]
	},
	{
		name: "TextAnnotation",
		superClass: [
			"Artifact"
		],
		properties: [
			{
				name: "text",
				type: "String"
			},
			{
				name: "textFormat",
				"default": "text/plain",
				isAttr: true,
				type: "String"
			}
		]
	},
	{
		name: "Group",
		superClass: [
			"Artifact"
		],
		properties: [
			{
				name: "categoryValueRef",
				type: "CategoryValue",
				isAttr: true,
				isReference: true
			}
		]
	},
	{
		name: "Association",
		superClass: [
			"Artifact"
		],
		properties: [
			{
				name: "associationDirection",
				type: "AssociationDirection",
				isAttr: true
			},
			{
				name: "sourceRef",
				type: "BaseElement",
				isAttr: true,
				isReference: true
			},
			{
				name: "targetRef",
				type: "BaseElement",
				isAttr: true,
				isReference: true
			}
		]
	},
	{
		name: "Category",
		superClass: [
			"RootElement"
		],
		properties: [
			{
				name: "categoryValue",
				type: "CategoryValue",
				isMany: true
			},
			{
				name: "name",
				isAttr: true,
				type: "String"
			}
		]
	},
	{
		name: "Artifact",
		isAbstract: true,
		superClass: [
			"BaseElement"
		]
	},
	{
		name: "CategoryValue",
		superClass: [
			"BaseElement"
		],
		properties: [
			{
				name: "categorizedFlowElements",
				type: "FlowElement",
				isMany: true,
				isVirtual: true,
				isReference: true
			},
			{
				name: "value",
				isAttr: true,
				type: "String"
			}
		]
	},
	{
		name: "Activity",
		isAbstract: true,
		superClass: [
			"FlowNode"
		],
		properties: [
			{
				name: "isForCompensation",
				"default": false,
				isAttr: true,
				type: "Boolean"
			},
			{
				name: "default",
				type: "SequenceFlow",
				isAttr: true,
				isReference: true
			},
			{
				name: "ioSpecification",
				type: "InputOutputSpecification",
				xml: {
					serialize: "property"
				}
			},
			{
				name: "boundaryEventRefs",
				type: "BoundaryEvent",
				isMany: true,
				isReference: true
			},
			{
				name: "properties",
				type: "Property",
				isMany: true
			},
			{
				name: "dataInputAssociations",
				type: "DataInputAssociation",
				isMany: true
			},
			{
				name: "dataOutputAssociations",
				type: "DataOutputAssociation",
				isMany: true
			},
			{
				name: "startQuantity",
				"default": 1,
				isAttr: true,
				type: "Integer"
			},
			{
				name: "resources",
				type: "ResourceRole",
				isMany: true
			},
			{
				name: "completionQuantity",
				"default": 1,
				isAttr: true,
				type: "Integer"
			},
			{
				name: "loopCharacteristics",
				type: "LoopCharacteristics"
			}
		]
	},
	{
		name: "ServiceTask",
		superClass: [
			"Task"
		],
		properties: [
			{
				name: "implementation",
				isAttr: true,
				type: "String"
			},
			{
				name: "operationRef",
				type: "Operation",
				isAttr: true,
				isReference: true
			}
		]
	},
	{
		name: "SubProcess",
		superClass: [
			"Activity",
			"FlowElementsContainer",
			"InteractionNode"
		],
		properties: [
			{
				name: "triggeredByEvent",
				"default": false,
				isAttr: true,
				type: "Boolean"
			},
			{
				name: "artifacts",
				type: "Artifact",
				isMany: true
			}
		]
	},
	{
		name: "LoopCharacteristics",
		isAbstract: true,
		superClass: [
			"BaseElement"
		]
	},
	{
		name: "MultiInstanceLoopCharacteristics",
		superClass: [
			"LoopCharacteristics"
		],
		properties: [
			{
				name: "isSequential",
				"default": false,
				isAttr: true,
				type: "Boolean"
			},
			{
				name: "behavior",
				type: "MultiInstanceBehavior",
				"default": "All",
				isAttr: true
			},
			{
				name: "loopCardinality",
				type: "Expression",
				xml: {
					serialize: "xsi:type"
				}
			},
			{
				name: "loopDataInputRef",
				type: "ItemAwareElement",
				isReference: true
			},
			{
				name: "loopDataOutputRef",
				type: "ItemAwareElement",
				isReference: true
			},
			{
				name: "inputDataItem",
				type: "DataInput",
				xml: {
					serialize: "property"
				}
			},
			{
				name: "outputDataItem",
				type: "DataOutput",
				xml: {
					serialize: "property"
				}
			},
			{
				name: "complexBehaviorDefinition",
				type: "ComplexBehaviorDefinition",
				isMany: true
			},
			{
				name: "completionCondition",
				type: "Expression",
				xml: {
					serialize: "xsi:type"
				}
			},
			{
				name: "oneBehaviorEventRef",
				type: "EventDefinition",
				isAttr: true,
				isReference: true
			},
			{
				name: "noneBehaviorEventRef",
				type: "EventDefinition",
				isAttr: true,
				isReference: true
			}
		]
	},
	{
		name: "StandardLoopCharacteristics",
		superClass: [
			"LoopCharacteristics"
		],
		properties: [
			{
				name: "testBefore",
				"default": false,
				isAttr: true,
				type: "Boolean"
			},
			{
				name: "loopCondition",
				type: "Expression",
				xml: {
					serialize: "xsi:type"
				}
			},
			{
				name: "loopMaximum",
				type: "Integer",
				isAttr: true
			}
		]
	},
	{
		name: "CallActivity",
		superClass: [
			"Activity",
			"InteractionNode"
		],
		properties: [
			{
				name: "calledElement",
				type: "String",
				isAttr: true
			}
		]
	},
	{
		name: "Task",
		superClass: [
			"Activity",
			"InteractionNode"
		]
	},
	{
		name: "SendTask",
		superClass: [
			"Task"
		],
		properties: [
			{
				name: "implementation",
				isAttr: true,
				type: "String"
			},
			{
				name: "operationRef",
				type: "Operation",
				isAttr: true,
				isReference: true
			},
			{
				name: "messageRef",
				type: "Message",
				isAttr: true,
				isReference: true
			}
		]
	},
	{
		name: "ReceiveTask",
		superClass: [
			"Task"
		],
		properties: [
			{
				name: "implementation",
				isAttr: true,
				type: "String"
			},
			{
				name: "instantiate",
				"default": false,
				isAttr: true,
				type: "Boolean"
			},
			{
				name: "operationRef",
				type: "Operation",
				isAttr: true,
				isReference: true
			},
			{
				name: "messageRef",
				type: "Message",
				isAttr: true,
				isReference: true
			}
		]
	},
	{
		name: "ScriptTask",
		superClass: [
			"Task"
		],
		properties: [
			{
				name: "scriptFormat",
				isAttr: true,
				type: "String"
			},
			{
				name: "script",
				type: "String"
			}
		]
	},
	{
		name: "BusinessRuleTask",
		superClass: [
			"Task"
		],
		properties: [
			{
				name: "implementation",
				isAttr: true,
				type: "String"
			}
		]
	},
	{
		name: "AdHocSubProcess",
		superClass: [
			"SubProcess"
		],
		properties: [
			{
				name: "completionCondition",
				type: "Expression",
				xml: {
					serialize: "xsi:type"
				}
			},
			{
				name: "ordering",
				type: "AdHocOrdering",
				isAttr: true
			},
			{
				name: "cancelRemainingInstances",
				"default": true,
				isAttr: true,
				type: "Boolean"
			}
		]
	},
	{
		name: "Transaction",
		superClass: [
			"SubProcess"
		],
		properties: [
			{
				name: "protocol",
				isAttr: true,
				type: "String"
			},
			{
				name: "method",
				isAttr: true,
				type: "String"
			}
		]
	},
	{
		name: "GlobalScriptTask",
		superClass: [
			"GlobalTask"
		],
		properties: [
			{
				name: "scriptLanguage",
				isAttr: true,
				type: "String"
			},
			{
				name: "script",
				isAttr: true,
				type: "String"
			}
		]
	},
	{
		name: "GlobalBusinessRuleTask",
		superClass: [
			"GlobalTask"
		],
		properties: [
			{
				name: "implementation",
				isAttr: true,
				type: "String"
			}
		]
	},
	{
		name: "ComplexBehaviorDefinition",
		superClass: [
			"BaseElement"
		],
		properties: [
			{
				name: "condition",
				type: "FormalExpression"
			},
			{
				name: "event",
				type: "ImplicitThrowEvent"
			}
		]
	},
	{
		name: "ResourceRole",
		superClass: [
			"BaseElement"
		],
		properties: [
			{
				name: "resourceRef",
				type: "Resource",
				isReference: true
			},
			{
				name: "resourceParameterBindings",
				type: "ResourceParameterBinding",
				isMany: true
			},
			{
				name: "resourceAssignmentExpression",
				type: "ResourceAssignmentExpression"
			},
			{
				name: "name",
				isAttr: true,
				type: "String"
			}
		]
	},
	{
		name: "ResourceParameterBinding",
		properties: [
			{
				name: "expression",
				type: "Expression",
				xml: {
					serialize: "xsi:type"
				}
			},
			{
				name: "parameterRef",
				type: "ResourceParameter",
				isAttr: true,
				isReference: true
			}
		],
		superClass: [
			"BaseElement"
		]
	},
	{
		name: "ResourceAssignmentExpression",
		properties: [
			{
				name: "expression",
				type: "Expression",
				xml: {
					serialize: "xsi:type"
				}
			}
		],
		superClass: [
			"BaseElement"
		]
	},
	{
		name: "Import",
		properties: [
			{
				name: "importType",
				isAttr: true,
				type: "String"
			},
			{
				name: "location",
				isAttr: true,
				type: "String"
			},
			{
				name: "namespace",
				isAttr: true,
				type: "String"
			}
		]
	},
	{
		name: "Definitions",
		superClass: [
			"BaseElement"
		],
		properties: [
			{
				name: "name",
				isAttr: true,
				type: "String"
			},
			{
				name: "targetNamespace",
				isAttr: true,
				type: "String"
			},
			{
				name: "expressionLanguage",
				"default": "http://www.w3.org/1999/XPath",
				isAttr: true,
				type: "String"
			},
			{
				name: "typeLanguage",
				"default": "http://www.w3.org/2001/XMLSchema",
				isAttr: true,
				type: "String"
			},
			{
				name: "imports",
				type: "Import",
				isMany: true
			},
			{
				name: "extensions",
				type: "Extension",
				isMany: true
			},
			{
				name: "rootElements",
				type: "RootElement",
				isMany: true
			},
			{
				name: "diagrams",
				isMany: true,
				type: "bpmndi:BPMNDiagram"
			},
			{
				name: "exporter",
				isAttr: true,
				type: "String"
			},
			{
				name: "relationships",
				type: "Relationship",
				isMany: true
			},
			{
				name: "exporterVersion",
				isAttr: true,
				type: "String"
			}
		]
	}
];
var enumerations$3 = [
	{
		name: "ProcessType",
		literalValues: [
			{
				name: "None"
			},
			{
				name: "Public"
			},
			{
				name: "Private"
			}
		]
	},
	{
		name: "GatewayDirection",
		literalValues: [
			{
				name: "Unspecified"
			},
			{
				name: "Converging"
			},
			{
				name: "Diverging"
			},
			{
				name: "Mixed"
			}
		]
	},
	{
		name: "EventBasedGatewayType",
		literalValues: [
			{
				name: "Parallel"
			},
			{
				name: "Exclusive"
			}
		]
	},
	{
		name: "RelationshipDirection",
		literalValues: [
			{
				name: "None"
			},
			{
				name: "Forward"
			},
			{
				name: "Backward"
			},
			{
				name: "Both"
			}
		]
	},
	{
		name: "ItemKind",
		literalValues: [
			{
				name: "Physical"
			},
			{
				name: "Information"
			}
		]
	},
	{
		name: "ChoreographyLoopType",
		literalValues: [
			{
				name: "None"
			},
			{
				name: "Standard"
			},
			{
				name: "MultiInstanceSequential"
			},
			{
				name: "MultiInstanceParallel"
			}
		]
	},
	{
		name: "AssociationDirection",
		literalValues: [
			{
				name: "None"
			},
			{
				name: "One"
			},
			{
				name: "Both"
			}
		]
	},
	{
		name: "MultiInstanceBehavior",
		literalValues: [
			{
				name: "None"
			},
			{
				name: "One"
			},
			{
				name: "All"
			},
			{
				name: "Complex"
			}
		]
	},
	{
		name: "AdHocOrdering",
		literalValues: [
			{
				name: "Parallel"
			},
			{
				name: "Sequential"
			}
		]
	}
];
var xml$1 = {
	tagAlias: "lowerCase",
	typePrefix: "t"
};
var BpmnPackage = {
	name: name$5,
	uri: uri$5,
	prefix: prefix$5,
	associations: associations$5,
	types: types$5,
	enumerations: enumerations$3,
	xml: xml$1
};

var name$4 = "BPMNDI";
var uri$4 = "http://www.omg.org/spec/BPMN/20100524/DI";
var prefix$4 = "bpmndi";
var types$4 = [
	{
		name: "BPMNDiagram",
		properties: [
			{
				name: "plane",
				type: "BPMNPlane",
				redefines: "di:Diagram#rootElement"
			},
			{
				name: "labelStyle",
				type: "BPMNLabelStyle",
				isMany: true
			}
		],
		superClass: [
			"di:Diagram"
		]
	},
	{
		name: "BPMNPlane",
		properties: [
			{
				name: "bpmnElement",
				isAttr: true,
				isReference: true,
				type: "bpmn:BaseElement",
				redefines: "di:DiagramElement#modelElement"
			}
		],
		superClass: [
			"di:Plane"
		]
	},
	{
		name: "BPMNShape",
		properties: [
			{
				name: "bpmnElement",
				isAttr: true,
				isReference: true,
				type: "bpmn:BaseElement",
				redefines: "di:DiagramElement#modelElement"
			},
			{
				name: "isHorizontal",
				isAttr: true,
				type: "Boolean"
			},
			{
				name: "isExpanded",
				isAttr: true,
				type: "Boolean"
			},
			{
				name: "isMarkerVisible",
				isAttr: true,
				type: "Boolean"
			},
			{
				name: "label",
				type: "BPMNLabel"
			},
			{
				name: "isMessageVisible",
				isAttr: true,
				type: "Boolean"
			},
			{
				name: "participantBandKind",
				type: "ParticipantBandKind",
				isAttr: true
			},
			{
				name: "choreographyActivityShape",
				type: "BPMNShape",
				isAttr: true,
				isReference: true
			}
		],
		superClass: [
			"di:LabeledShape"
		]
	},
	{
		name: "BPMNEdge",
		properties: [
			{
				name: "label",
				type: "BPMNLabel"
			},
			{
				name: "bpmnElement",
				isAttr: true,
				isReference: true,
				type: "bpmn:BaseElement",
				redefines: "di:DiagramElement#modelElement"
			},
			{
				name: "sourceElement",
				isAttr: true,
				isReference: true,
				type: "di:DiagramElement",
				redefines: "di:Edge#source"
			},
			{
				name: "targetElement",
				isAttr: true,
				isReference: true,
				type: "di:DiagramElement",
				redefines: "di:Edge#target"
			},
			{
				name: "messageVisibleKind",
				type: "MessageVisibleKind",
				isAttr: true,
				"default": "initiating"
			}
		],
		superClass: [
			"di:LabeledEdge"
		]
	},
	{
		name: "BPMNLabel",
		properties: [
			{
				name: "labelStyle",
				type: "BPMNLabelStyle",
				isAttr: true,
				isReference: true,
				redefines: "di:DiagramElement#style"
			}
		],
		superClass: [
			"di:Label"
		]
	},
	{
		name: "BPMNLabelStyle",
		properties: [
			{
				name: "font",
				type: "dc:Font"
			}
		],
		superClass: [
			"di:Style"
		]
	}
];
var enumerations$2 = [
	{
		name: "ParticipantBandKind",
		literalValues: [
			{
				name: "top_initiating"
			},
			{
				name: "middle_initiating"
			},
			{
				name: "bottom_initiating"
			},
			{
				name: "top_non_initiating"
			},
			{
				name: "middle_non_initiating"
			},
			{
				name: "bottom_non_initiating"
			}
		]
	},
	{
		name: "MessageVisibleKind",
		literalValues: [
			{
				name: "initiating"
			},
			{
				name: "non_initiating"
			}
		]
	}
];
var associations$4 = [
];
var BpmnDiPackage = {
	name: name$4,
	uri: uri$4,
	prefix: prefix$4,
	types: types$4,
	enumerations: enumerations$2,
	associations: associations$4
};

var name$3 = "DC";
var uri$3 = "http://www.omg.org/spec/DD/20100524/DC";
var prefix$3 = "dc";
var types$3 = [
	{
		name: "Boolean"
	},
	{
		name: "Integer"
	},
	{
		name: "Real"
	},
	{
		name: "String"
	},
	{
		name: "Font",
		properties: [
			{
				name: "name",
				type: "String",
				isAttr: true
			},
			{
				name: "size",
				type: "Real",
				isAttr: true
			},
			{
				name: "isBold",
				type: "Boolean",
				isAttr: true
			},
			{
				name: "isItalic",
				type: "Boolean",
				isAttr: true
			},
			{
				name: "isUnderline",
				type: "Boolean",
				isAttr: true
			},
			{
				name: "isStrikeThrough",
				type: "Boolean",
				isAttr: true
			}
		]
	},
	{
		name: "Point",
		properties: [
			{
				name: "x",
				type: "Real",
				"default": "0",
				isAttr: true
			},
			{
				name: "y",
				type: "Real",
				"default": "0",
				isAttr: true
			}
		]
	},
	{
		name: "Bounds",
		properties: [
			{
				name: "x",
				type: "Real",
				"default": "0",
				isAttr: true
			},
			{
				name: "y",
				type: "Real",
				"default": "0",
				isAttr: true
			},
			{
				name: "width",
				type: "Real",
				isAttr: true
			},
			{
				name: "height",
				type: "Real",
				isAttr: true
			}
		]
	}
];
var associations$3 = [
];
var DcPackage = {
	name: name$3,
	uri: uri$3,
	prefix: prefix$3,
	types: types$3,
	associations: associations$3
};

var name$2 = "DI";
var uri$2 = "http://www.omg.org/spec/DD/20100524/DI";
var prefix$2 = "di";
var types$2 = [
	{
		name: "DiagramElement",
		isAbstract: true,
		properties: [
			{
				name: "id",
				isAttr: true,
				isId: true,
				type: "String"
			},
			{
				name: "extension",
				type: "Extension"
			},
			{
				name: "owningDiagram",
				type: "Diagram",
				isReadOnly: true,
				isVirtual: true,
				isReference: true
			},
			{
				name: "owningElement",
				type: "DiagramElement",
				isReadOnly: true,
				isVirtual: true,
				isReference: true
			},
			{
				name: "modelElement",
				isReadOnly: true,
				isVirtual: true,
				isReference: true,
				type: "Element"
			},
			{
				name: "style",
				type: "Style",
				isReadOnly: true,
				isVirtual: true,
				isReference: true
			},
			{
				name: "ownedElement",
				type: "DiagramElement",
				isReadOnly: true,
				isMany: true,
				isVirtual: true
			}
		]
	},
	{
		name: "Node",
		isAbstract: true,
		superClass: [
			"DiagramElement"
		]
	},
	{
		name: "Edge",
		isAbstract: true,
		superClass: [
			"DiagramElement"
		],
		properties: [
			{
				name: "source",
				type: "DiagramElement",
				isReadOnly: true,
				isVirtual: true,
				isReference: true
			},
			{
				name: "target",
				type: "DiagramElement",
				isReadOnly: true,
				isVirtual: true,
				isReference: true
			},
			{
				name: "waypoint",
				isUnique: false,
				isMany: true,
				type: "dc:Point",
				xml: {
					serialize: "xsi:type"
				}
			}
		]
	},
	{
		name: "Diagram",
		isAbstract: true,
		properties: [
			{
				name: "id",
				isAttr: true,
				isId: true,
				type: "String"
			},
			{
				name: "rootElement",
				type: "DiagramElement",
				isReadOnly: true,
				isVirtual: true
			},
			{
				name: "name",
				isAttr: true,
				type: "String"
			},
			{
				name: "documentation",
				isAttr: true,
				type: "String"
			},
			{
				name: "resolution",
				isAttr: true,
				type: "Real"
			},
			{
				name: "ownedStyle",
				type: "Style",
				isReadOnly: true,
				isMany: true,
				isVirtual: true
			}
		]
	},
	{
		name: "Shape",
		isAbstract: true,
		superClass: [
			"Node"
		],
		properties: [
			{
				name: "bounds",
				type: "dc:Bounds"
			}
		]
	},
	{
		name: "Plane",
		isAbstract: true,
		superClass: [
			"Node"
		],
		properties: [
			{
				name: "planeElement",
				type: "DiagramElement",
				subsettedProperty: "DiagramElement-ownedElement",
				isMany: true
			}
		]
	},
	{
		name: "LabeledEdge",
		isAbstract: true,
		superClass: [
			"Edge"
		],
		properties: [
			{
				name: "ownedLabel",
				type: "Label",
				isReadOnly: true,
				subsettedProperty: "DiagramElement-ownedElement",
				isMany: true,
				isVirtual: true
			}
		]
	},
	{
		name: "LabeledShape",
		isAbstract: true,
		superClass: [
			"Shape"
		],
		properties: [
			{
				name: "ownedLabel",
				type: "Label",
				isReadOnly: true,
				subsettedProperty: "DiagramElement-ownedElement",
				isMany: true,
				isVirtual: true
			}
		]
	},
	{
		name: "Label",
		isAbstract: true,
		superClass: [
			"Node"
		],
		properties: [
			{
				name: "bounds",
				type: "dc:Bounds"
			}
		]
	},
	{
		name: "Style",
		isAbstract: true,
		properties: [
			{
				name: "id",
				isAttr: true,
				isId: true,
				type: "String"
			}
		]
	},
	{
		name: "Extension",
		properties: [
			{
				name: "values",
				isMany: true,
				type: "Element"
			}
		]
	}
];
var associations$2 = [
];
var xml = {
	tagAlias: "lowerCase"
};
var DiPackage = {
	name: name$2,
	uri: uri$2,
	prefix: prefix$2,
	types: types$2,
	associations: associations$2,
	xml: xml
};

var name$1 = "bpmn.io colors for BPMN";
var uri$1 = "http://bpmn.io/schema/bpmn/biocolor/1.0";
var prefix$1 = "bioc";
var types$1 = [
	{
		name: "ColoredShape",
		"extends": [
			"bpmndi:BPMNShape"
		],
		properties: [
			{
				name: "stroke",
				isAttr: true,
				type: "String"
			},
			{
				name: "fill",
				isAttr: true,
				type: "String"
			}
		]
	},
	{
		name: "ColoredEdge",
		"extends": [
			"bpmndi:BPMNEdge"
		],
		properties: [
			{
				name: "stroke",
				isAttr: true,
				type: "String"
			},
			{
				name: "fill",
				isAttr: true,
				type: "String"
			}
		]
	}
];
var enumerations$1 = [
];
var associations$1 = [
];
var BiocPackage = {
	name: name$1,
	uri: uri$1,
	prefix: prefix$1,
	types: types$1,
	enumerations: enumerations$1,
	associations: associations$1
};

var name = "BPMN in Color";
var uri = "http://www.omg.org/spec/BPMN/non-normative/color/1.0";
var prefix = "color";
var types = [
	{
		name: "ColoredLabel",
		"extends": [
			"bpmndi:BPMNLabel"
		],
		properties: [
			{
				name: "color",
				isAttr: true,
				type: "String"
			}
		]
	},
	{
		name: "ColoredShape",
		"extends": [
			"bpmndi:BPMNShape"
		],
		properties: [
			{
				name: "background-color",
				isAttr: true,
				type: "String"
			},
			{
				name: "border-color",
				isAttr: true,
				type: "String"
			}
		]
	},
	{
		name: "ColoredEdge",
		"extends": [
			"bpmndi:BPMNEdge"
		],
		properties: [
			{
				name: "border-color",
				isAttr: true,
				type: "String"
			}
		]
	}
];
var enumerations = [
];
var associations = [
];
var BpmnInColorPackage = {
	name: name,
	uri: uri,
	prefix: prefix,
	types: types,
	enumerations: enumerations,
	associations: associations
};

var packages = {
  bpmn: BpmnPackage,
  bpmndi: BpmnDiPackage,
  dc: DcPackage,
  di: DiPackage,
  bioc: BiocPackage,
  color: BpmnInColorPackage
};

function simple(additionalPackages, options) {
  var pks = (0,min_dash__WEBPACK_IMPORTED_MODULE_1__.assign)({}, packages, additionalPackages);

  return new BpmnModdle(pks, options);
}




/***/ }),

/***/ "./node_modules/min-dash/dist/index.esm.js":
/*!*************************************************!*\
  !*** ./node_modules/min-dash/dist/index.esm.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "assign": () => (/* binding */ assign),
/* harmony export */   "bind": () => (/* binding */ bind),
/* harmony export */   "debounce": () => (/* binding */ debounce),
/* harmony export */   "ensureArray": () => (/* binding */ ensureArray),
/* harmony export */   "every": () => (/* binding */ every),
/* harmony export */   "filter": () => (/* binding */ filter),
/* harmony export */   "find": () => (/* binding */ find),
/* harmony export */   "findIndex": () => (/* binding */ findIndex),
/* harmony export */   "flatten": () => (/* binding */ flatten),
/* harmony export */   "forEach": () => (/* binding */ forEach),
/* harmony export */   "get": () => (/* binding */ get),
/* harmony export */   "groupBy": () => (/* binding */ groupBy),
/* harmony export */   "has": () => (/* binding */ has),
/* harmony export */   "isArray": () => (/* binding */ isArray),
/* harmony export */   "isDefined": () => (/* binding */ isDefined),
/* harmony export */   "isFunction": () => (/* binding */ isFunction),
/* harmony export */   "isNil": () => (/* binding */ isNil),
/* harmony export */   "isNumber": () => (/* binding */ isNumber),
/* harmony export */   "isObject": () => (/* binding */ isObject),
/* harmony export */   "isString": () => (/* binding */ isString),
/* harmony export */   "isUndefined": () => (/* binding */ isUndefined),
/* harmony export */   "keys": () => (/* binding */ keys),
/* harmony export */   "map": () => (/* binding */ map),
/* harmony export */   "matchPattern": () => (/* binding */ matchPattern),
/* harmony export */   "merge": () => (/* binding */ merge),
/* harmony export */   "omit": () => (/* binding */ omit),
/* harmony export */   "pick": () => (/* binding */ pick),
/* harmony export */   "reduce": () => (/* binding */ reduce),
/* harmony export */   "set": () => (/* binding */ set),
/* harmony export */   "size": () => (/* binding */ size),
/* harmony export */   "some": () => (/* binding */ some),
/* harmony export */   "sortBy": () => (/* binding */ sortBy),
/* harmony export */   "throttle": () => (/* binding */ throttle),
/* harmony export */   "unionBy": () => (/* binding */ unionBy),
/* harmony export */   "uniqueBy": () => (/* binding */ uniqueBy),
/* harmony export */   "values": () => (/* binding */ values),
/* harmony export */   "without": () => (/* binding */ without)
/* harmony export */ });
/**
 * Flatten array, one level deep.
 *
 * @param {Array<?>} arr
 *
 * @return {Array<?>}
 */
function flatten(arr) {
  return Array.prototype.concat.apply([], arr);
}

const nativeToString = Object.prototype.toString;
const nativeHasOwnProperty = Object.prototype.hasOwnProperty;

function isUndefined(obj) {
  return obj === undefined;
}

function isDefined(obj) {
  return obj !== undefined;
}

function isNil(obj) {
  return obj == null;
}

function isArray(obj) {
  return nativeToString.call(obj) === '[object Array]';
}

function isObject(obj) {
  return nativeToString.call(obj) === '[object Object]';
}

function isNumber(obj) {
  return nativeToString.call(obj) === '[object Number]';
}

function isFunction(obj) {
  const tag = nativeToString.call(obj);

  return (
    tag === '[object Function]' ||
    tag === '[object AsyncFunction]' ||
    tag === '[object GeneratorFunction]' ||
    tag === '[object AsyncGeneratorFunction]' ||
    tag === '[object Proxy]'
  );
}

function isString(obj) {
  return nativeToString.call(obj) === '[object String]';
}


/**
 * Ensure collection is an array.
 *
 * @param {Object} obj
 */
function ensureArray(obj) {

  if (isArray(obj)) {
    return;
  }

  throw new Error('must supply array');
}

/**
 * Return true, if target owns a property with the given key.
 *
 * @param {Object} target
 * @param {String} key
 *
 * @return {Boolean}
 */
function has(target, key) {
  return nativeHasOwnProperty.call(target, key);
}

/**
 * Find element in collection.
 *
 * @param  {Array|Object} collection
 * @param  {Function|Object} matcher
 *
 * @return {Object}
 */
function find(collection, matcher) {

  matcher = toMatcher(matcher);

  let match;

  forEach(collection, function(val, key) {
    if (matcher(val, key)) {
      match = val;

      return false;
    }
  });

  return match;

}


/**
 * Find element index in collection.
 *
 * @param  {Array|Object} collection
 * @param  {Function} matcher
 *
 * @return {Object}
 */
function findIndex(collection, matcher) {

  matcher = toMatcher(matcher);

  let idx = isArray(collection) ? -1 : undefined;

  forEach(collection, function(val, key) {
    if (matcher(val, key)) {
      idx = key;

      return false;
    }
  });

  return idx;
}


/**
 * Find element in collection.
 *
 * @param  {Array|Object} collection
 * @param  {Function} matcher
 *
 * @return {Array} result
 */
function filter(collection, matcher) {

  let result = [];

  forEach(collection, function(val, key) {
    if (matcher(val, key)) {
      result.push(val);
    }
  });

  return result;
}


/**
 * Iterate over collection; returning something
 * (non-undefined) will stop iteration.
 *
 * @param  {Array|Object} collection
 * @param  {Function} iterator
 *
 * @return {Object} return result that stopped the iteration
 */
function forEach(collection, iterator) {

  let val,
      result;

  if (isUndefined(collection)) {
    return;
  }

  const convertKey = isArray(collection) ? toNum : identity;

  for (let key in collection) {

    if (has(collection, key)) {
      val = collection[key];

      result = iterator(val, convertKey(key));

      if (result === false) {
        return val;
      }
    }
  }
}

/**
 * Return collection without element.
 *
 * @param  {Array} arr
 * @param  {Function} matcher
 *
 * @return {Array}
 */
function without(arr, matcher) {

  if (isUndefined(arr)) {
    return [];
  }

  ensureArray(arr);

  matcher = toMatcher(matcher);

  return arr.filter(function(el, idx) {
    return !matcher(el, idx);
  });

}


/**
 * Reduce collection, returning a single result.
 *
 * @param  {Object|Array} collection
 * @param  {Function} iterator
 * @param  {Any} result
 *
 * @return {Any} result returned from last iterator
 */
function reduce(collection, iterator, result) {

  forEach(collection, function(value, idx) {
    result = iterator(result, value, idx);
  });

  return result;
}


/**
 * Return true if every element in the collection
 * matches the criteria.
 *
 * @param  {Object|Array} collection
 * @param  {Function} matcher
 *
 * @return {Boolean}
 */
function every(collection, matcher) {

  return !!reduce(collection, function(matches, val, key) {
    return matches && matcher(val, key);
  }, true);
}


/**
 * Return true if some elements in the collection
 * match the criteria.
 *
 * @param  {Object|Array} collection
 * @param  {Function} matcher
 *
 * @return {Boolean}
 */
function some(collection, matcher) {

  return !!find(collection, matcher);
}


/**
 * Transform a collection into another collection
 * by piping each member through the given fn.
 *
 * @param  {Object|Array}   collection
 * @param  {Function} fn
 *
 * @return {Array} transformed collection
 */
function map(collection, fn) {

  let result = [];

  forEach(collection, function(val, key) {
    result.push(fn(val, key));
  });

  return result;
}


/**
 * Get the collections keys.
 *
 * @param  {Object|Array} collection
 *
 * @return {Array}
 */
function keys(collection) {
  return collection && Object.keys(collection) || [];
}


/**
 * Shorthand for `keys(o).length`.
 *
 * @param  {Object|Array} collection
 *
 * @return {Number}
 */
function size(collection) {
  return keys(collection).length;
}


/**
 * Get the values in the collection.
 *
 * @param  {Object|Array} collection
 *
 * @return {Array}
 */
function values(collection) {
  return map(collection, (val) => val);
}


/**
 * Group collection members by attribute.
 *
 * @param  {Object|Array} collection
 * @param  {Function} extractor
 *
 * @return {Object} map with { attrValue => [ a, b, c ] }
 */
function groupBy(collection, extractor, grouped = {}) {

  extractor = toExtractor(extractor);

  forEach(collection, function(val) {
    let discriminator = extractor(val) || '_';

    let group = grouped[discriminator];

    if (!group) {
      group = grouped[discriminator] = [];
    }

    group.push(val);
  });

  return grouped;
}


function uniqueBy(extractor, ...collections) {

  extractor = toExtractor(extractor);

  let grouped = {};

  forEach(collections, (c) => groupBy(c, extractor, grouped));

  let result = map(grouped, function(val, key) {
    return val[0];
  });

  return result;
}


const unionBy = uniqueBy;



/**
 * Sort collection by criteria.
 *
 * @param  {Object|Array} collection
 * @param  {String|Function} extractor
 *
 * @return {Array}
 */
function sortBy(collection, extractor) {

  extractor = toExtractor(extractor);

  let sorted = [];

  forEach(collection, function(value, key) {
    let disc = extractor(value, key);

    let entry = {
      d: disc,
      v: value
    };

    for (var idx = 0; idx < sorted.length; idx++) {
      let { d } = sorted[idx];

      if (disc < d) {
        sorted.splice(idx, 0, entry);
        return;
      }
    }

    // not inserted, append (!)
    sorted.push(entry);
  });

  return map(sorted, (e) => e.v);
}


/**
 * Create an object pattern matcher.
 *
 * @example
 *
 * const matcher = matchPattern({ id: 1 });
 *
 * let element = find(elements, matcher);
 *
 * @param  {Object} pattern
 *
 * @return {Function} matcherFn
 */
function matchPattern(pattern) {

  return function(el) {

    return every(pattern, function(val, key) {
      return el[key] === val;
    });

  };
}


function toExtractor(extractor) {
  return isFunction(extractor) ? extractor : (e) => {
    return e[extractor];
  };
}


function toMatcher(matcher) {
  return isFunction(matcher) ? matcher : (e) => {
    return e === matcher;
  };
}


function identity(arg) {
  return arg;
}

function toNum(arg) {
  return Number(arg);
}

/**
 * Debounce fn, calling it only once if the given time
 * elapsed between calls.
 *
 * Lodash-style the function exposes methods to `#clear`
 * and `#flush` to control internal behavior.
 *
 * @param  {Function} fn
 * @param  {Number} timeout
 *
 * @return {Function} debounced function
 */
function debounce(fn, timeout) {

  let timer;

  let lastArgs;
  let lastThis;

  let lastNow;

  function fire(force) {

    let now = Date.now();

    let scheduledDiff = force ? 0 : (lastNow + timeout) - now;

    if (scheduledDiff > 0) {
      return schedule(scheduledDiff);
    }

    fn.apply(lastThis, lastArgs);

    clear();
  }

  function schedule(timeout) {
    timer = setTimeout(fire, timeout);
  }

  function clear() {
    if (timer) {
      clearTimeout(timer);
    }

    timer = lastNow = lastArgs = lastThis = undefined;
  }

  function flush() {
    if (timer) {
      fire(true);
    }

    clear();
  }

  function callback(...args) {
    lastNow = Date.now();

    lastArgs = args;
    lastThis = this;

    // ensure an execution is scheduled
    if (!timer) {
      schedule(timeout);
    }
  }

  callback.flush = flush;
  callback.cancel = clear;

  return callback;
}

/**
 * Throttle fn, calling at most once
 * in the given interval.
 *
 * @param  {Function} fn
 * @param  {Number} interval
 *
 * @return {Function} throttled function
 */
function throttle(fn, interval) {
  let throttling = false;

  return function(...args) {

    if (throttling) {
      return;
    }

    fn(...args);
    throttling = true;

    setTimeout(() => {
      throttling = false;
    }, interval);
  };
}

/**
 * Bind function against target <this>.
 *
 * @param  {Function} fn
 * @param  {Object}   target
 *
 * @return {Function} bound function
 */
function bind(fn, target) {
  return fn.bind(target);
}

/**
 * Convenience wrapper for `Object.assign`.
 *
 * @param {Object} target
 * @param {...Object} others
 *
 * @return {Object} the target
 */
function assign(target, ...others) {
  return Object.assign(target, ...others);
}

/**
 * Sets a nested property of a given object to the specified value.
 *
 * This mutates the object and returns it.
 *
 * @param {Object} target The target of the set operation.
 * @param {(string|number)[]} path The path to the nested value.
 * @param {any} value The value to set.
 */
function set(target, path, value) {

  let currentTarget = target;

  forEach(path, function(key, idx) {

    if (typeof key !== 'number' && typeof key !== 'string') {
      throw new Error('illegal key type: ' + typeof key + '. Key should be of type number or string.');
    }

    if (key === 'constructor') {
      throw new Error('illegal key: constructor');
    }

    if (key === '__proto__') {
      throw new Error('illegal key: __proto__');
    }

    let nextKey = path[idx + 1];
    let nextTarget = currentTarget[key];

    if (isDefined(nextKey) && isNil(nextTarget)) {
      nextTarget = currentTarget[key] = isNaN(+nextKey) ? {} : [];
    }

    if (isUndefined(nextKey)) {
      if (isUndefined(value)) {
        delete currentTarget[key];
      } else {
        currentTarget[key] = value;
      }
    } else {
      currentTarget = nextTarget;
    }
  });

  return target;
}


/**
 * Gets a nested property of a given object.
 *
 * @param {Object} target The target of the get operation.
 * @param {(string|number)[]} path The path to the nested value.
 * @param {any} [defaultValue] The value to return if no value exists.
 */
function get(target, path, defaultValue) {

  let currentTarget = target;

  forEach(path, function(key) {

    // accessing nil property yields <undefined>
    if (isNil(currentTarget)) {
      currentTarget = undefined;

      return false;
    }

    currentTarget = currentTarget[key];
  });

  return isUndefined(currentTarget) ? defaultValue : currentTarget;
}

/**
 * Pick given properties from the target object.
 *
 * @param {Object} target
 * @param {Array} properties
 *
 * @return {Object} target
 */
function pick(target, properties) {

  let result = {};

  let obj = Object(target);

  forEach(properties, function(prop) {

    if (prop in obj) {
      result[prop] = target[prop];
    }
  });

  return result;
}

/**
 * Pick all target properties, excluding the given ones.
 *
 * @param {Object} target
 * @param {Array} properties
 *
 * @return {Object} target
 */
function omit(target, properties) {

  let result = {};

  let obj = Object(target);

  forEach(obj, function(prop, key) {

    if (properties.indexOf(key) === -1) {
      result[key] = prop;
    }
  });

  return result;
}

/**
 * Recursively merge `...sources` into given target.
 *
 * Does support merging objects; does not support merging arrays.
 *
 * @param {Object} target
 * @param {...Object} sources
 *
 * @return {Object} the target
 */
function merge(target, ...sources) {

  if (!sources.length) {
    return target;
  }

  forEach(sources, function(source) {

    // skip non-obj sources, i.e. null
    if (!source || !isObject(source)) {
      return;
    }

    forEach(source, function(sourceVal, key) {

      if (key === '__proto__') {
        return;
      }

      let targetVal = target[key];

      if (isObject(sourceVal)) {

        if (!isObject(targetVal)) {

          // override target[key] with object
          targetVal = {};
        }

        target[key] = merge(targetVal, sourceVal);
      } else {
        target[key] = sourceVal;
      }

    });
  });

  return target;
}




/***/ }),

/***/ "./node_modules/moddle-xml/dist/index.esm.js":
/*!***************************************************!*\
  !*** ./node_modules/moddle-xml/dist/index.esm.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Reader": () => (/* binding */ Reader),
/* harmony export */   "Writer": () => (/* binding */ Writer)
/* harmony export */ });
/* harmony import */ var min_dash__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! min-dash */ "./node_modules/min-dash/dist/index.esm.js");
/* harmony import */ var saxen__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! saxen */ "./node_modules/saxen/dist/index.esm.js");
/* harmony import */ var moddle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! moddle */ "./node_modules/moddle/dist/index.esm.js");




function hasLowerCaseAlias(pkg) {
  return pkg.xml && pkg.xml.tagAlias === 'lowerCase';
}

var DEFAULT_NS_MAP = {
  'xsi': 'http://www.w3.org/2001/XMLSchema-instance',
  'xml': 'http://www.w3.org/XML/1998/namespace'
};

var XSI_TYPE = 'xsi:type';

function serializeFormat(element) {
  return element.xml && element.xml.serialize;
}

function serializeAsType(element) {
  return serializeFormat(element) === XSI_TYPE;
}

function serializeAsProperty(element) {
  return serializeFormat(element) === 'property';
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function aliasToName(aliasNs, pkg) {

  if (!hasLowerCaseAlias(pkg)) {
    return aliasNs.name;
  }

  return aliasNs.prefix + ':' + capitalize(aliasNs.localName);
}

function prefixedToName(nameNs, pkg) {

  var name = nameNs.name,
      localName = nameNs.localName;

  var typePrefix = pkg.xml && pkg.xml.typePrefix;

  if (typePrefix && localName.indexOf(typePrefix) === 0) {
    return nameNs.prefix + ':' + localName.slice(typePrefix.length);
  } else {
    return name;
  }
}

function normalizeXsiTypeName(name, model) {

  var nameNs = (0,moddle__WEBPACK_IMPORTED_MODULE_1__.parseNameNS)(name);
  var pkg = model.getPackage(nameNs.prefix);

  return prefixedToName(nameNs, pkg);
}

function error(message) {
  return new Error(message);
}

/**
 * Get the moddle descriptor for a given instance or type.
 *
 * @param  {ModdleElement|Function} element
 *
 * @return {Object} the moddle descriptor
 */
function getModdleDescriptor(element) {
  return element.$descriptor;
}


/**
 * A parse context.
 *
 * @class
 *
 * @param {Object} options
 * @param {ElementHandler} options.rootHandler the root handler for parsing a document
 * @param {boolean} [options.lax=false] whether or not to ignore invalid elements
 */
function Context(options) {

  /**
   * @property {ElementHandler} rootHandler
   */

  /**
   * @property {Boolean} lax
   */

  (0,min_dash__WEBPACK_IMPORTED_MODULE_2__.assign)(this, options);

  this.elementsById = {};
  this.references = [];
  this.warnings = [];

  /**
   * Add an unresolved reference.
   *
   * @param {Object} reference
   */
  this.addReference = function(reference) {
    this.references.push(reference);
  };

  /**
   * Add a processed element.
   *
   * @param {ModdleElement} element
   */
  this.addElement = function(element) {

    if (!element) {
      throw error('expected element');
    }

    var elementsById = this.elementsById;

    var descriptor = getModdleDescriptor(element);

    var idProperty = descriptor.idProperty,
        id;

    if (idProperty) {
      id = element.get(idProperty.name);

      if (id) {

        // for QName validation as per http://www.w3.org/TR/REC-xml/#NT-NameChar
        if (!/^([a-z][\w-.]*:)?[a-z_][\w-.]*$/i.test(id)) {
          throw new Error('illegal ID <' + id + '>');
        }

        if (elementsById[id]) {
          throw error('duplicate ID <' + id + '>');
        }

        elementsById[id] = element;
      }
    }
  };

  /**
   * Add an import warning.
   *
   * @param {Object} warning
   * @param {String} warning.message
   * @param {Error} [warning.error]
   */
  this.addWarning = function(warning) {
    this.warnings.push(warning);
  };
}

function BaseHandler() {}

BaseHandler.prototype.handleEnd = function() {};
BaseHandler.prototype.handleText = function() {};
BaseHandler.prototype.handleNode = function() {};


/**
 * A simple pass through handler that does nothing except for
 * ignoring all input it receives.
 *
 * This is used to ignore unknown elements and
 * attributes.
 */
function NoopHandler() { }

NoopHandler.prototype = Object.create(BaseHandler.prototype);

NoopHandler.prototype.handleNode = function() {
  return this;
};

function BodyHandler() {}

BodyHandler.prototype = Object.create(BaseHandler.prototype);

BodyHandler.prototype.handleText = function(text) {
  this.body = (this.body || '') + text;
};

function ReferenceHandler(property, context) {
  this.property = property;
  this.context = context;
}

ReferenceHandler.prototype = Object.create(BodyHandler.prototype);

ReferenceHandler.prototype.handleNode = function(node) {

  if (this.element) {
    throw error('expected no sub nodes');
  } else {
    this.element = this.createReference(node);
  }

  return this;
};

ReferenceHandler.prototype.handleEnd = function() {
  this.element.id = this.body;
};

ReferenceHandler.prototype.createReference = function(node) {
  return {
    property: this.property.ns.name,
    id: ''
  };
};

function ValueHandler(propertyDesc, element) {
  this.element = element;
  this.propertyDesc = propertyDesc;
}

ValueHandler.prototype = Object.create(BodyHandler.prototype);

ValueHandler.prototype.handleEnd = function() {

  var value = this.body || '',
      element = this.element,
      propertyDesc = this.propertyDesc;

  value = (0,moddle__WEBPACK_IMPORTED_MODULE_1__.coerceType)(propertyDesc.type, value);

  if (propertyDesc.isMany) {
    element.get(propertyDesc.name).push(value);
  } else {
    element.set(propertyDesc.name, value);
  }
};


function BaseElementHandler() {}

BaseElementHandler.prototype = Object.create(BodyHandler.prototype);

BaseElementHandler.prototype.handleNode = function(node) {
  var parser = this,
      element = this.element;

  if (!element) {
    element = this.element = this.createElement(node);

    this.context.addElement(element);
  } else {
    parser = this.handleChild(node);
  }

  return parser;
};

/**
 * @class Reader.ElementHandler
 *
 */
function ElementHandler(model, typeName, context) {
  this.model = model;
  this.type = model.getType(typeName);
  this.context = context;
}

ElementHandler.prototype = Object.create(BaseElementHandler.prototype);

ElementHandler.prototype.addReference = function(reference) {
  this.context.addReference(reference);
};

ElementHandler.prototype.handleText = function(text) {

  var element = this.element,
      descriptor = getModdleDescriptor(element),
      bodyProperty = descriptor.bodyProperty;

  if (!bodyProperty) {
    throw error('unexpected body text <' + text + '>');
  }

  BodyHandler.prototype.handleText.call(this, text);
};

ElementHandler.prototype.handleEnd = function() {

  var value = this.body,
      element = this.element,
      descriptor = getModdleDescriptor(element),
      bodyProperty = descriptor.bodyProperty;

  if (bodyProperty && value !== undefined) {
    value = (0,moddle__WEBPACK_IMPORTED_MODULE_1__.coerceType)(bodyProperty.type, value);
    element.set(bodyProperty.name, value);
  }
};

/**
 * Create an instance of the model from the given node.
 *
 * @param  {Element} node the xml node
 */
ElementHandler.prototype.createElement = function(node) {
  var attributes = node.attributes,
      Type = this.type,
      descriptor = getModdleDescriptor(Type),
      context = this.context,
      instance = new Type({}),
      model = this.model,
      propNameNs;

  (0,min_dash__WEBPACK_IMPORTED_MODULE_2__.forEach)(attributes, function(value, name) {

    var prop = descriptor.propertiesByName[name],
        values;

    if (prop && prop.isReference) {

      if (!prop.isMany) {
        context.addReference({
          element: instance,
          property: prop.ns.name,
          id: value
        });
      } else {

        // IDREFS: parse references as whitespace-separated list
        values = value.split(' ');

        (0,min_dash__WEBPACK_IMPORTED_MODULE_2__.forEach)(values, function(v) {
          context.addReference({
            element: instance,
            property: prop.ns.name,
            id: v
          });
        });
      }

    } else {
      if (prop) {
        value = (0,moddle__WEBPACK_IMPORTED_MODULE_1__.coerceType)(prop.type, value);
      } else
      if (name !== 'xmlns') {
        propNameNs = (0,moddle__WEBPACK_IMPORTED_MODULE_1__.parseNameNS)(name, descriptor.ns.prefix);

        // check whether attribute is defined in a well-known namespace
        // if that is the case we emit a warning to indicate potential misuse
        if (model.getPackage(propNameNs.prefix)) {

          context.addWarning({
            message: 'unknown attribute <' + name + '>',
            element: instance,
            property: name,
            value: value
          });
        }
      }

      instance.set(name, value);
    }
  });

  return instance;
};

ElementHandler.prototype.getPropertyForNode = function(node) {

  var name = node.name;
  var nameNs = (0,moddle__WEBPACK_IMPORTED_MODULE_1__.parseNameNS)(name);

  var type = this.type,
      model = this.model,
      descriptor = getModdleDescriptor(type);

  var propertyName = nameNs.name,
      property = descriptor.propertiesByName[propertyName],
      elementTypeName,
      elementType;

  // search for properties by name first

  if (property && !property.isAttr) {

    if (serializeAsType(property)) {
      elementTypeName = node.attributes[XSI_TYPE];

      // xsi type is optional, if it does not exists the
      // default type is assumed
      if (elementTypeName) {

        // take possible type prefixes from XML
        // into account, i.e.: xsi:type="t{ActualType}"
        elementTypeName = normalizeXsiTypeName(elementTypeName, model);

        elementType = model.getType(elementTypeName);

        return (0,min_dash__WEBPACK_IMPORTED_MODULE_2__.assign)({}, property, {
          effectiveType: getModdleDescriptor(elementType).name
        });
      }
    }

    // search for properties by name first
    return property;
  }

  var pkg = model.getPackage(nameNs.prefix);

  if (pkg) {
    elementTypeName = aliasToName(nameNs, pkg);
    elementType = model.getType(elementTypeName);

    // search for collection members later
    property = (0,min_dash__WEBPACK_IMPORTED_MODULE_2__.find)(descriptor.properties, function(p) {
      return !p.isVirtual && !p.isReference && !p.isAttribute && elementType.hasType(p.type);
    });

    if (property) {
      return (0,min_dash__WEBPACK_IMPORTED_MODULE_2__.assign)({}, property, {
        effectiveType: getModdleDescriptor(elementType).name
      });
    }
  } else {

    // parse unknown element (maybe extension)
    property = (0,min_dash__WEBPACK_IMPORTED_MODULE_2__.find)(descriptor.properties, function(p) {
      return !p.isReference && !p.isAttribute && p.type === 'Element';
    });

    if (property) {
      return property;
    }
  }

  throw error('unrecognized element <' + nameNs.name + '>');
};

ElementHandler.prototype.toString = function() {
  return 'ElementDescriptor[' + getModdleDescriptor(this.type).name + ']';
};

ElementHandler.prototype.valueHandler = function(propertyDesc, element) {
  return new ValueHandler(propertyDesc, element);
};

ElementHandler.prototype.referenceHandler = function(propertyDesc) {
  return new ReferenceHandler(propertyDesc, this.context);
};

ElementHandler.prototype.handler = function(type) {
  if (type === 'Element') {
    return new GenericElementHandler(this.model, type, this.context);
  } else {
    return new ElementHandler(this.model, type, this.context);
  }
};

/**
 * Handle the child element parsing
 *
 * @param  {Element} node the xml node
 */
ElementHandler.prototype.handleChild = function(node) {
  var propertyDesc, type, element, childHandler;

  propertyDesc = this.getPropertyForNode(node);
  element = this.element;

  type = propertyDesc.effectiveType || propertyDesc.type;

  if ((0,moddle__WEBPACK_IMPORTED_MODULE_1__.isSimpleType)(type)) {
    return this.valueHandler(propertyDesc, element);
  }

  if (propertyDesc.isReference) {
    childHandler = this.referenceHandler(propertyDesc).handleNode(node);
  } else {
    childHandler = this.handler(type).handleNode(node);
  }

  var newElement = childHandler.element;

  // child handles may decide to skip elements
  // by not returning anything
  if (newElement !== undefined) {

    if (propertyDesc.isMany) {
      element.get(propertyDesc.name).push(newElement);
    } else {
      element.set(propertyDesc.name, newElement);
    }

    if (propertyDesc.isReference) {
      (0,min_dash__WEBPACK_IMPORTED_MODULE_2__.assign)(newElement, {
        element: element
      });

      this.context.addReference(newElement);
    } else {

      // establish child -> parent relationship
      newElement.$parent = element;
    }
  }

  return childHandler;
};

/**
 * An element handler that performs special validation
 * to ensure the node it gets initialized with matches
 * the handlers type (namespace wise).
 *
 * @param {Moddle} model
 * @param {String} typeName
 * @param {Context} context
 */
function RootElementHandler(model, typeName, context) {
  ElementHandler.call(this, model, typeName, context);
}

RootElementHandler.prototype = Object.create(ElementHandler.prototype);

RootElementHandler.prototype.createElement = function(node) {

  var name = node.name,
      nameNs = (0,moddle__WEBPACK_IMPORTED_MODULE_1__.parseNameNS)(name),
      model = this.model,
      type = this.type,
      pkg = model.getPackage(nameNs.prefix),
      typeName = pkg && aliasToName(nameNs, pkg) || name;

  // verify the correct namespace if we parse
  // the first element in the handler tree
  //
  // this ensures we don't mistakenly import wrong namespace elements
  if (!type.hasType(typeName)) {
    throw error('unexpected element <' + node.originalName + '>');
  }

  return ElementHandler.prototype.createElement.call(this, node);
};


function GenericElementHandler(model, typeName, context) {
  this.model = model;
  this.context = context;
}

GenericElementHandler.prototype = Object.create(BaseElementHandler.prototype);

GenericElementHandler.prototype.createElement = function(node) {

  var name = node.name,
      ns = (0,moddle__WEBPACK_IMPORTED_MODULE_1__.parseNameNS)(name),
      prefix = ns.prefix,
      uri = node.ns[prefix + '$uri'],
      attributes = node.attributes;

  return this.model.createAny(name, uri, attributes);
};

GenericElementHandler.prototype.handleChild = function(node) {

  var handler = new GenericElementHandler(this.model, 'Element', this.context).handleNode(node),
      element = this.element;

  var newElement = handler.element,
      children;

  if (newElement !== undefined) {
    children = element.$children = element.$children || [];
    children.push(newElement);

    // establish child -> parent relationship
    newElement.$parent = element;
  }

  return handler;
};

GenericElementHandler.prototype.handleEnd = function() {
  if (this.body) {
    this.element.$body = this.body;
  }
};

/**
 * A reader for a meta-model
 *
 * @param {Object} options
 * @param {Model} options.model used to read xml files
 * @param {Boolean} options.lax whether to make parse errors warnings
 */
function Reader(options) {

  if (options instanceof moddle__WEBPACK_IMPORTED_MODULE_1__.Moddle) {
    options = {
      model: options
    };
  }

  (0,min_dash__WEBPACK_IMPORTED_MODULE_2__.assign)(this, { lax: false }, options);
}

/**
 * The fromXML result.
 *
 * @typedef {Object} ParseResult
 *
 * @property {ModdleElement} rootElement
 * @property {Array<Object>} references
 * @property {Array<Error>} warnings
 * @property {Object} elementsById - a mapping containing each ID -> ModdleElement
 */

/**
 * The fromXML result.
 *
 * @typedef {Error} ParseError
 *
 * @property {Array<Error>} warnings
 */

/**
 * Parse the given XML into a moddle document tree.
 *
 * @param {String} xml
 * @param {ElementHandler|Object} options or rootHandler
 *
 * @returns {Promise<ParseResult, ParseError>}
 */
Reader.prototype.fromXML = function(xml, options, done) {

  var rootHandler = options.rootHandler;

  if (options instanceof ElementHandler) {

    // root handler passed via (xml, { rootHandler: ElementHandler }, ...)
    rootHandler = options;
    options = {};
  } else {
    if (typeof options === 'string') {

      // rootHandler passed via (xml, 'someString', ...)
      rootHandler = this.handler(options);
      options = {};
    } else if (typeof rootHandler === 'string') {

      // rootHandler passed via (xml, { rootHandler: 'someString' }, ...)
      rootHandler = this.handler(rootHandler);
    }
  }

  var model = this.model,
      lax = this.lax;

  var context = new Context((0,min_dash__WEBPACK_IMPORTED_MODULE_2__.assign)({}, options, { rootHandler: rootHandler })),
      parser = new saxen__WEBPACK_IMPORTED_MODULE_0__.Parser({ proxy: true }),
      stack = createStack();

  rootHandler.context = context;

  // push root handler
  stack.push(rootHandler);


  /**
   * Handle error.
   *
   * @param  {Error} err
   * @param  {Function} getContext
   * @param  {boolean} lax
   *
   * @return {boolean} true if handled
   */
  function handleError(err, getContext, lax) {

    var ctx = getContext();

    var line = ctx.line,
        column = ctx.column,
        data = ctx.data;

    // we receive the full context data here,
    // for elements trim down the information
    // to the tag name, only
    if (data.charAt(0) === '<' && data.indexOf(' ') !== -1) {
      data = data.slice(0, data.indexOf(' ')) + '>';
    }

    var message =
      'unparsable content ' + (data ? data + ' ' : '') + 'detected\n\t' +
        'line: ' + line + '\n\t' +
        'column: ' + column + '\n\t' +
        'nested error: ' + err.message;

    if (lax) {
      context.addWarning({
        message: message,
        error: err
      });

      return true;
    } else {
      throw error(message);
    }
  }

  function handleWarning(err, getContext) {

    // just like handling errors in <lax=true> mode
    return handleError(err, getContext, true);
  }

  /**
   * Resolve collected references on parse end.
   */
  function resolveReferences() {

    var elementsById = context.elementsById;
    var references = context.references;

    var i, r;

    for (i = 0; (r = references[i]); i++) {
      var element = r.element;
      var reference = elementsById[r.id];
      var property = getModdleDescriptor(element).propertiesByName[r.property];

      if (!reference) {
        context.addWarning({
          message: 'unresolved reference <' + r.id + '>',
          element: r.element,
          property: r.property,
          value: r.id
        });
      }

      if (property.isMany) {
        var collection = element.get(property.name),
            idx = collection.indexOf(r);

        // we replace an existing place holder (idx != -1) or
        // append to the collection instead
        if (idx === -1) {
          idx = collection.length;
        }

        if (!reference) {

          // remove unresolvable reference
          collection.splice(idx, 1);
        } else {

          // add or update reference in collection
          collection[idx] = reference;
        }
      } else {
        element.set(property.name, reference);
      }
    }
  }

  function handleClose() {
    stack.pop().handleEnd();
  }

  var PREAMBLE_START_PATTERN = /^<\?xml /i;

  var ENCODING_PATTERN = / encoding="([^"]+)"/i;

  var UTF_8_PATTERN = /^utf-8$/i;

  function handleQuestion(question) {

    if (!PREAMBLE_START_PATTERN.test(question)) {
      return;
    }

    var match = ENCODING_PATTERN.exec(question);
    var encoding = match && match[1];

    if (!encoding || UTF_8_PATTERN.test(encoding)) {
      return;
    }

    context.addWarning({
      message:
        'unsupported document encoding <' + encoding + '>, ' +
        'falling back to UTF-8'
    });
  }

  function handleOpen(node, getContext) {
    var handler = stack.peek();

    try {
      stack.push(handler.handleNode(node));
    } catch (err) {

      if (handleError(err, getContext, lax)) {
        stack.push(new NoopHandler());
      }
    }
  }

  function handleCData(text, getContext) {

    try {
      stack.peek().handleText(text);
    } catch (err) {
      handleWarning(err, getContext);
    }
  }

  function handleText(text, getContext) {

    // strip whitespace only nodes, i.e. before
    // <!CDATA[ ... ]> sections and in between tags

    if (!text.trim()) {
      return;
    }

    handleCData(text, getContext);
  }

  var uriMap = model.getPackages().reduce(function(uriMap, p) {
    uriMap[p.uri] = p.prefix;

    return uriMap;
  }, {
    'http://www.w3.org/XML/1998/namespace': 'xml' // add default xml ns
  });
  parser
    .ns(uriMap)
    .on('openTag', function(obj, decodeStr, selfClosing, getContext) {

      // gracefully handle unparsable attributes (attrs=false)
      var attrs = obj.attrs || {};

      var decodedAttrs = Object.keys(attrs).reduce(function(d, key) {
        var value = decodeStr(attrs[key]);

        d[key] = value;

        return d;
      }, {});

      var node = {
        name: obj.name,
        originalName: obj.originalName,
        attributes: decodedAttrs,
        ns: obj.ns
      };

      handleOpen(node, getContext);
    })
    .on('question', handleQuestion)
    .on('closeTag', handleClose)
    .on('cdata', handleCData)
    .on('text', function(text, decodeEntities, getContext) {
      handleText(decodeEntities(text), getContext);
    })
    .on('error', handleError)
    .on('warn', handleWarning);

  // async XML parsing to make sure the execution environment
  // (node or brower) is kept responsive and that certain optimization
  // strategies can kick in.
  return new Promise(function(resolve, reject) {

    var err;

    try {
      parser.parse(xml);

      resolveReferences();
    } catch (e) {
      err = e;
    }

    var rootElement = rootHandler.element;

    if (!err && !rootElement) {
      err = error('failed to parse document as <' + rootHandler.type.$descriptor.name + '>');
    }

    var warnings = context.warnings;
    var references = context.references;
    var elementsById = context.elementsById;

    if (err) {
      err.warnings = warnings;

      return reject(err);
    } else {
      return resolve({
        rootElement: rootElement,
        elementsById: elementsById,
        references: references,
        warnings: warnings
      });
    }
  });
};

Reader.prototype.handler = function(name) {
  return new RootElementHandler(this.model, name);
};


// helpers //////////////////////////

function createStack() {
  var stack = [];

  Object.defineProperty(stack, 'peek', {
    value: function() {
      return this[this.length - 1];
    }
  });

  return stack;
}

var XML_PREAMBLE = '<?xml version="1.0" encoding="UTF-8"?>\n';

var ESCAPE_ATTR_CHARS = /<|>|'|"|&|\n\r|\n/g;
var ESCAPE_CHARS = /<|>|&/g;


function Namespaces(parent) {

  var prefixMap = {};
  var uriMap = {};
  var used = {};

  var wellknown = [];
  var custom = [];

  // API

  this.byUri = function(uri) {
    return uriMap[uri] || (
      parent && parent.byUri(uri)
    );
  };

  this.add = function(ns, isWellknown) {

    uriMap[ns.uri] = ns;

    if (isWellknown) {
      wellknown.push(ns);
    } else {
      custom.push(ns);
    }

    this.mapPrefix(ns.prefix, ns.uri);
  };

  this.uriByPrefix = function(prefix) {
    return prefixMap[prefix || 'xmlns'];
  };

  this.mapPrefix = function(prefix, uri) {
    prefixMap[prefix || 'xmlns'] = uri;
  };

  this.getNSKey = function(ns) {
    return (ns.prefix !== undefined) ? (ns.uri + '|' + ns.prefix) : ns.uri;
  };

  this.logUsed = function(ns) {

    var uri = ns.uri;
    var nsKey = this.getNSKey(ns);

    used[nsKey] = this.byUri(uri);

    // Inform parent recursively about the usage of this NS
    if (parent) {
      parent.logUsed(ns);
    }
  };

  this.getUsed = function(ns) {

    function isUsed(ns) {
      var nsKey = self.getNSKey(ns);

      return used[nsKey];
    }

    var self = this;

    var allNs = [].concat(wellknown, custom);

    return allNs.filter(isUsed);
  };

}

function lower(string) {
  return string.charAt(0).toLowerCase() + string.slice(1);
}

function nameToAlias(name, pkg) {
  if (hasLowerCaseAlias(pkg)) {
    return lower(name);
  } else {
    return name;
  }
}

function inherits(ctor, superCtor) {
  ctor.super_ = superCtor;
  ctor.prototype = Object.create(superCtor.prototype, {
    constructor: {
      value: ctor,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
}

function nsName(ns) {
  if ((0,min_dash__WEBPACK_IMPORTED_MODULE_2__.isString)(ns)) {
    return ns;
  } else {
    return (ns.prefix ? ns.prefix + ':' : '') + ns.localName;
  }
}

function getNsAttrs(namespaces) {

  return namespaces.getUsed().filter(function(ns) {

    // do not serialize built in <xml> namespace
    return ns.prefix !== 'xml';
  }).map(function(ns) {
    var name = 'xmlns' + (ns.prefix ? ':' + ns.prefix : '');
    return { name: name, value: ns.uri };
  });

}

function getElementNs(ns, descriptor) {
  if (descriptor.isGeneric) {
    return (0,min_dash__WEBPACK_IMPORTED_MODULE_2__.assign)({ localName: descriptor.ns.localName }, ns);
  } else {
    return (0,min_dash__WEBPACK_IMPORTED_MODULE_2__.assign)({ localName: nameToAlias(descriptor.ns.localName, descriptor.$pkg) }, ns);
  }
}

function getPropertyNs(ns, descriptor) {
  return (0,min_dash__WEBPACK_IMPORTED_MODULE_2__.assign)({ localName: descriptor.ns.localName }, ns);
}

function getSerializableProperties(element) {
  var descriptor = element.$descriptor;

  return (0,min_dash__WEBPACK_IMPORTED_MODULE_2__.filter)(descriptor.properties, function(p) {
    var name = p.name;

    if (p.isVirtual) {
      return false;
    }

    // do not serialize defaults
    if (!(0,min_dash__WEBPACK_IMPORTED_MODULE_2__.has)(element, name)) {
      return false;
    }

    var value = element[name];

    // do not serialize default equals
    if (value === p.default) {
      return false;
    }

    // do not serialize null properties
    if (value === null) {
      return false;
    }

    return p.isMany ? value.length : true;
  });
}

var ESCAPE_ATTR_MAP = {
  '\n': '#10',
  '\n\r': '#10',
  '"': '#34',
  '\'': '#39',
  '<': '#60',
  '>': '#62',
  '&': '#38'
};

var ESCAPE_MAP = {
  '<': 'lt',
  '>': 'gt',
  '&': 'amp'
};

function escape(str, charPattern, replaceMap) {

  // ensure we are handling strings here
  str = (0,min_dash__WEBPACK_IMPORTED_MODULE_2__.isString)(str) ? str : '' + str;

  return str.replace(charPattern, function(s) {
    return '&' + replaceMap[s] + ';';
  });
}

/**
 * Escape a string attribute to not contain any bad values (line breaks, '"', ...)
 *
 * @param {String} str the string to escape
 * @return {String} the escaped string
 */
function escapeAttr(str) {
  return escape(str, ESCAPE_ATTR_CHARS, ESCAPE_ATTR_MAP);
}

function escapeBody(str) {
  return escape(str, ESCAPE_CHARS, ESCAPE_MAP);
}

function filterAttributes(props) {
  return (0,min_dash__WEBPACK_IMPORTED_MODULE_2__.filter)(props, function(p) { return p.isAttr; });
}

function filterContained(props) {
  return (0,min_dash__WEBPACK_IMPORTED_MODULE_2__.filter)(props, function(p) { return !p.isAttr; });
}


function ReferenceSerializer(tagName) {
  this.tagName = tagName;
}

ReferenceSerializer.prototype.build = function(element) {
  this.element = element;
  return this;
};

ReferenceSerializer.prototype.serializeTo = function(writer) {
  writer
    .appendIndent()
    .append('<' + this.tagName + '>' + this.element.id + '</' + this.tagName + '>')
    .appendNewLine();
};

function BodySerializer() {}

BodySerializer.prototype.serializeValue =
BodySerializer.prototype.serializeTo = function(writer) {
  writer.append(
    this.escape
      ? escapeBody(this.value)
      : this.value
  );
};

BodySerializer.prototype.build = function(prop, value) {
  this.value = value;

  if (prop.type === 'String' && value.search(ESCAPE_CHARS) !== -1) {
    this.escape = true;
  }

  return this;
};

function ValueSerializer(tagName) {
  this.tagName = tagName;
}

inherits(ValueSerializer, BodySerializer);

ValueSerializer.prototype.serializeTo = function(writer) {

  writer
    .appendIndent()
    .append('<' + this.tagName + '>');

  this.serializeValue(writer);

  writer
    .append('</' + this.tagName + '>')
    .appendNewLine();
};

function ElementSerializer(parent, propertyDescriptor) {
  this.body = [];
  this.attrs = [];

  this.parent = parent;
  this.propertyDescriptor = propertyDescriptor;
}

ElementSerializer.prototype.build = function(element) {
  this.element = element;

  var elementDescriptor = element.$descriptor,
      propertyDescriptor = this.propertyDescriptor;

  var otherAttrs,
      properties;

  var isGeneric = elementDescriptor.isGeneric;

  if (isGeneric) {
    otherAttrs = this.parseGeneric(element);
  } else {
    otherAttrs = this.parseNsAttributes(element);
  }

  if (propertyDescriptor) {
    this.ns = this.nsPropertyTagName(propertyDescriptor);
  } else {
    this.ns = this.nsTagName(elementDescriptor);
  }

  // compute tag name
  this.tagName = this.addTagName(this.ns);

  if (!isGeneric) {
    properties = getSerializableProperties(element);

    this.parseAttributes(filterAttributes(properties));
    this.parseContainments(filterContained(properties));
  }

  this.parseGenericAttributes(element, otherAttrs);

  return this;
};

ElementSerializer.prototype.nsTagName = function(descriptor) {
  var effectiveNs = this.logNamespaceUsed(descriptor.ns);
  return getElementNs(effectiveNs, descriptor);
};

ElementSerializer.prototype.nsPropertyTagName = function(descriptor) {
  var effectiveNs = this.logNamespaceUsed(descriptor.ns);
  return getPropertyNs(effectiveNs, descriptor);
};

ElementSerializer.prototype.isLocalNs = function(ns) {
  return ns.uri === this.ns.uri;
};

/**
 * Get the actual ns attribute name for the given element.
 *
 * @param {Object} element
 * @param {Boolean} [element.inherited=false]
 *
 * @return {Object} nsName
 */
ElementSerializer.prototype.nsAttributeName = function(element) {

  var ns;

  if ((0,min_dash__WEBPACK_IMPORTED_MODULE_2__.isString)(element)) {
    ns = (0,moddle__WEBPACK_IMPORTED_MODULE_1__.parseNameNS)(element);
  } else {
    ns = element.ns;
  }

  // return just local name for inherited attributes
  if (element.inherited) {
    return { localName: ns.localName };
  }

  // parse + log effective ns
  var effectiveNs = this.logNamespaceUsed(ns);

  // LOG ACTUAL namespace use
  this.getNamespaces().logUsed(effectiveNs);

  // strip prefix if same namespace like parent
  if (this.isLocalNs(effectiveNs)) {
    return { localName: ns.localName };
  } else {
    return (0,min_dash__WEBPACK_IMPORTED_MODULE_2__.assign)({ localName: ns.localName }, effectiveNs);
  }
};

ElementSerializer.prototype.parseGeneric = function(element) {

  var self = this,
      body = this.body;

  var attributes = [];

  (0,min_dash__WEBPACK_IMPORTED_MODULE_2__.forEach)(element, function(val, key) {

    var nonNsAttr;

    if (key === '$body') {
      body.push(new BodySerializer().build({ type: 'String' }, val));
    } else
    if (key === '$children') {
      (0,min_dash__WEBPACK_IMPORTED_MODULE_2__.forEach)(val, function(child) {
        body.push(new ElementSerializer(self).build(child));
      });
    } else
    if (key.indexOf('$') !== 0) {
      nonNsAttr = self.parseNsAttribute(element, key, val);

      if (nonNsAttr) {
        attributes.push({ name: key, value: val });
      }
    }
  });

  return attributes;
};

ElementSerializer.prototype.parseNsAttribute = function(element, name, value) {
  var model = element.$model;

  var nameNs = (0,moddle__WEBPACK_IMPORTED_MODULE_1__.parseNameNS)(name);

  var ns;

  // parse xmlns:foo="http://foo.bar"
  if (nameNs.prefix === 'xmlns') {
    ns = { prefix: nameNs.localName, uri: value };
  }

  // parse xmlns="http://foo.bar"
  if (!nameNs.prefix && nameNs.localName === 'xmlns') {
    ns = { uri: value };
  }

  if (!ns) {
    return {
      name: name,
      value: value
    };
  }

  if (model && model.getPackage(value)) {

    // register well known namespace
    this.logNamespace(ns, true, true);
  } else {

    // log custom namespace directly as used
    var actualNs = this.logNamespaceUsed(ns, true);

    this.getNamespaces().logUsed(actualNs);
  }
};


/**
 * Parse namespaces and return a list of left over generic attributes
 *
 * @param  {Object} element
 * @return {Array<Object>}
 */
ElementSerializer.prototype.parseNsAttributes = function(element, attrs) {
  var self = this;

  var genericAttrs = element.$attrs;

  var attributes = [];

  // parse namespace attributes first
  // and log them. push non namespace attributes to a list
  // and process them later
  (0,min_dash__WEBPACK_IMPORTED_MODULE_2__.forEach)(genericAttrs, function(value, name) {

    var nonNsAttr = self.parseNsAttribute(element, name, value);

    if (nonNsAttr) {
      attributes.push(nonNsAttr);
    }
  });

  return attributes;
};

ElementSerializer.prototype.parseGenericAttributes = function(element, attributes) {

  var self = this;

  (0,min_dash__WEBPACK_IMPORTED_MODULE_2__.forEach)(attributes, function(attr) {

    // do not serialize xsi:type attribute
    // it is set manually based on the actual implementation type
    if (attr.name === XSI_TYPE) {
      return;
    }

    try {
      self.addAttribute(self.nsAttributeName(attr.name), attr.value);
    } catch (e) {
      /* global console */

      console.warn(
        'missing namespace information for ',
        attr.name, '=', attr.value, 'on', element,
        e);
    }
  });
};

ElementSerializer.prototype.parseContainments = function(properties) {

  var self = this,
      body = this.body,
      element = this.element;

  (0,min_dash__WEBPACK_IMPORTED_MODULE_2__.forEach)(properties, function(p) {
    var value = element.get(p.name),
        isReference = p.isReference,
        isMany = p.isMany;

    if (!isMany) {
      value = [ value ];
    }

    if (p.isBody) {
      body.push(new BodySerializer().build(p, value[0]));
    } else
    if ((0,moddle__WEBPACK_IMPORTED_MODULE_1__.isSimpleType)(p.type)) {
      (0,min_dash__WEBPACK_IMPORTED_MODULE_2__.forEach)(value, function(v) {
        body.push(new ValueSerializer(self.addTagName(self.nsPropertyTagName(p))).build(p, v));
      });
    } else
    if (isReference) {
      (0,min_dash__WEBPACK_IMPORTED_MODULE_2__.forEach)(value, function(v) {
        body.push(new ReferenceSerializer(self.addTagName(self.nsPropertyTagName(p))).build(v));
      });
    } else {

      // allow serialization via type
      // rather than element name
      var asType = serializeAsType(p),
          asProperty = serializeAsProperty(p);

      (0,min_dash__WEBPACK_IMPORTED_MODULE_2__.forEach)(value, function(v) {
        var serializer;

        if (asType) {
          serializer = new TypeSerializer(self, p);
        } else
        if (asProperty) {
          serializer = new ElementSerializer(self, p);
        } else {
          serializer = new ElementSerializer(self);
        }

        body.push(serializer.build(v));
      });
    }
  });
};

ElementSerializer.prototype.getNamespaces = function(local) {

  var namespaces = this.namespaces,
      parent = this.parent,
      parentNamespaces;

  if (!namespaces) {
    parentNamespaces = parent && parent.getNamespaces();

    if (local || !parentNamespaces) {
      this.namespaces = namespaces = new Namespaces(parentNamespaces);
    } else {
      namespaces = parentNamespaces;
    }
  }

  return namespaces;
};

ElementSerializer.prototype.logNamespace = function(ns, wellknown, local) {
  var namespaces = this.getNamespaces(local);

  var nsUri = ns.uri,
      nsPrefix = ns.prefix;

  var existing = namespaces.byUri(nsUri);

  if (!existing || local) {
    namespaces.add(ns, wellknown);
  }

  namespaces.mapPrefix(nsPrefix, nsUri);

  return ns;
};

ElementSerializer.prototype.logNamespaceUsed = function(ns, local) {
  var element = this.element,
      model = element.$model,
      namespaces = this.getNamespaces(local);

  // ns may be
  //
  //   * prefix only
  //   * prefix:uri
  //   * localName only

  var prefix = ns.prefix,
      uri = ns.uri,
      newPrefix, idx,
      wellknownUri;

  // handle anonymous namespaces (elementForm=unqualified), cf. #23
  if (!prefix && !uri) {
    return { localName: ns.localName };
  }

  wellknownUri = DEFAULT_NS_MAP[prefix] || model && (model.getPackage(prefix) || {}).uri;

  uri = uri || wellknownUri || namespaces.uriByPrefix(prefix);

  if (!uri) {
    throw new Error('no namespace uri given for prefix <' + prefix + '>');
  }

  ns = namespaces.byUri(uri);

  if (!ns) {
    newPrefix = prefix;
    idx = 1;

    // find a prefix that is not mapped yet
    while (namespaces.uriByPrefix(newPrefix)) {
      newPrefix = prefix + '_' + idx++;
    }

    ns = this.logNamespace({ prefix: newPrefix, uri: uri }, wellknownUri === uri);
  }

  if (prefix) {
    namespaces.mapPrefix(prefix, uri);
  }

  return ns;
};

ElementSerializer.prototype.parseAttributes = function(properties) {
  var self = this,
      element = this.element;

  (0,min_dash__WEBPACK_IMPORTED_MODULE_2__.forEach)(properties, function(p) {

    var value = element.get(p.name);

    if (p.isReference) {

      if (!p.isMany) {
        value = value.id;
      }
      else {
        var values = [];
        (0,min_dash__WEBPACK_IMPORTED_MODULE_2__.forEach)(value, function(v) {
          values.push(v.id);
        });

        // IDREFS is a whitespace-separated list of references.
        value = values.join(' ');
      }

    }

    self.addAttribute(self.nsAttributeName(p), value);
  });
};

ElementSerializer.prototype.addTagName = function(nsTagName) {
  var actualNs = this.logNamespaceUsed(nsTagName);

  this.getNamespaces().logUsed(actualNs);

  return nsName(nsTagName);
};

ElementSerializer.prototype.addAttribute = function(name, value) {
  var attrs = this.attrs;

  if ((0,min_dash__WEBPACK_IMPORTED_MODULE_2__.isString)(value)) {
    value = escapeAttr(value);
  }

  // de-duplicate attributes
  // https://github.com/bpmn-io/moddle-xml/issues/66
  var idx = (0,min_dash__WEBPACK_IMPORTED_MODULE_2__.findIndex)(attrs, function(element) {
    return (
      element.name.localName === name.localName &&
      element.name.uri === name.uri &&
      element.name.prefix === name.prefix
    );
  });

  var attr = { name: name, value: value };

  if (idx !== -1) {
    attrs.splice(idx, 1, attr);
  } else {
    attrs.push(attr);
  }
};

ElementSerializer.prototype.serializeAttributes = function(writer) {
  var attrs = this.attrs,
      namespaces = this.namespaces;

  if (namespaces) {
    attrs = getNsAttrs(namespaces).concat(attrs);
  }

  (0,min_dash__WEBPACK_IMPORTED_MODULE_2__.forEach)(attrs, function(a) {
    writer
      .append(' ')
      .append(nsName(a.name)).append('="').append(a.value).append('"');
  });
};

ElementSerializer.prototype.serializeTo = function(writer) {
  var firstBody = this.body[0],
      indent = firstBody && firstBody.constructor !== BodySerializer;

  writer
    .appendIndent()
    .append('<' + this.tagName);

  this.serializeAttributes(writer);

  writer.append(firstBody ? '>' : ' />');

  if (firstBody) {

    if (indent) {
      writer
        .appendNewLine()
        .indent();
    }

    (0,min_dash__WEBPACK_IMPORTED_MODULE_2__.forEach)(this.body, function(b) {
      b.serializeTo(writer);
    });

    if (indent) {
      writer
        .unindent()
        .appendIndent();
    }

    writer.append('</' + this.tagName + '>');
  }

  writer.appendNewLine();
};

/**
 * A serializer for types that handles serialization of data types
 */
function TypeSerializer(parent, propertyDescriptor) {
  ElementSerializer.call(this, parent, propertyDescriptor);
}

inherits(TypeSerializer, ElementSerializer);

TypeSerializer.prototype.parseNsAttributes = function(element) {

  // extracted attributes
  var attributes = ElementSerializer.prototype.parseNsAttributes.call(this, element);

  var descriptor = element.$descriptor;

  // only serialize xsi:type if necessary
  if (descriptor.name === this.propertyDescriptor.type) {
    return attributes;
  }

  var typeNs = this.typeNs = this.nsTagName(descriptor);
  this.getNamespaces().logUsed(this.typeNs);

  // add xsi:type attribute to represent the elements
  // actual type

  var pkg = element.$model.getPackage(typeNs.uri),
      typePrefix = (pkg.xml && pkg.xml.typePrefix) || '';

  this.addAttribute(
    this.nsAttributeName(XSI_TYPE),
    (typeNs.prefix ? typeNs.prefix + ':' : '') + typePrefix + descriptor.ns.localName
  );

  return attributes;
};

TypeSerializer.prototype.isLocalNs = function(ns) {
  return ns.uri === (this.typeNs || this.ns).uri;
};

function SavingWriter() {
  this.value = '';

  this.write = function(str) {
    this.value += str;
  };
}

function FormatingWriter(out, format) {

  var indent = [ '' ];

  this.append = function(str) {
    out.write(str);

    return this;
  };

  this.appendNewLine = function() {
    if (format) {
      out.write('\n');
    }

    return this;
  };

  this.appendIndent = function() {
    if (format) {
      out.write(indent.join('  '));
    }

    return this;
  };

  this.indent = function() {
    indent.push('');
    return this;
  };

  this.unindent = function() {
    indent.pop();
    return this;
  };
}

/**
 * A writer for meta-model backed document trees
 *
 * @param {Object} options output options to pass into the writer
 */
function Writer(options) {

  options = (0,min_dash__WEBPACK_IMPORTED_MODULE_2__.assign)({ format: false, preamble: true }, options || {});

  function toXML(tree, writer) {
    var internalWriter = writer || new SavingWriter();
    var formatingWriter = new FormatingWriter(internalWriter, options.format);

    if (options.preamble) {
      formatingWriter.append(XML_PREAMBLE);
    }

    new ElementSerializer().build(tree).serializeTo(formatingWriter);

    if (!writer) {
      return internalWriter.value;
    }
  }

  return {
    toXML: toXML
  };
}


//# sourceMappingURL=index.esm.js.map


/***/ }),

/***/ "./node_modules/moddle/dist/index.esm.js":
/*!***********************************************!*\
  !*** ./node_modules/moddle/dist/index.esm.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Moddle": () => (/* binding */ Moddle),
/* harmony export */   "coerceType": () => (/* binding */ coerceType),
/* harmony export */   "isBuiltInType": () => (/* binding */ isBuiltIn),
/* harmony export */   "isSimpleType": () => (/* binding */ isSimple),
/* harmony export */   "parseNameNS": () => (/* binding */ parseName)
/* harmony export */ });
/* harmony import */ var min_dash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! min-dash */ "./node_modules/min-dash/dist/index.esm.js");


/**
 * Moddle base element.
 */
function Base() { }

Base.prototype.get = function(name) {
  return this.$model.properties.get(this, name);
};

Base.prototype.set = function(name, value) {
  this.$model.properties.set(this, name, value);
};

/**
 * A model element factory.
 *
 * @param {Moddle} model
 * @param {Properties} properties
 */
function Factory(model, properties) {
  this.model = model;
  this.properties = properties;
}


Factory.prototype.createType = function(descriptor) {

  var model = this.model;

  var props = this.properties,
      prototype = Object.create(Base.prototype);

  // initialize default values
  (0,min_dash__WEBPACK_IMPORTED_MODULE_0__.forEach)(descriptor.properties, function(p) {
    if (!p.isMany && p.default !== undefined) {
      prototype[p.name] = p.default;
    }
  });

  props.defineModel(prototype, model);
  props.defineDescriptor(prototype, descriptor);

  var name = descriptor.ns.name;

  /**
   * The new type constructor
   */
  function ModdleElement(attrs) {
    props.define(this, '$type', { value: name, enumerable: true });
    props.define(this, '$attrs', { value: {} });
    props.define(this, '$parent', { writable: true });

    (0,min_dash__WEBPACK_IMPORTED_MODULE_0__.forEach)(attrs, (0,min_dash__WEBPACK_IMPORTED_MODULE_0__.bind)(function(val, key) {
      this.set(key, val);
    }, this));
  }

  ModdleElement.prototype = prototype;

  ModdleElement.hasType = prototype.$instanceOf = this.model.hasType;

  // static links
  props.defineModel(ModdleElement, model);
  props.defineDescriptor(ModdleElement, descriptor);

  return ModdleElement;
};

/**
 * Built-in moddle types
 */
var BUILTINS = {
  String: true,
  Boolean: true,
  Integer: true,
  Real: true,
  Element: true
};

/**
 * Converters for built in types from string representations
 */
var TYPE_CONVERTERS = {
  String: function(s) { return s; },
  Boolean: function(s) { return s === 'true'; },
  Integer: function(s) { return parseInt(s, 10); },
  Real: function(s) { return parseFloat(s); }
};

/**
 * Convert a type to its real representation
 */
function coerceType(type, value) {

  var converter = TYPE_CONVERTERS[type];

  if (converter) {
    return converter(value);
  } else {
    return value;
  }
}

/**
 * Return whether the given type is built-in
 */
function isBuiltIn(type) {
  return !!BUILTINS[type];
}

/**
 * Return whether the given type is simple
 */
function isSimple(type) {
  return !!TYPE_CONVERTERS[type];
}

/**
 * Parses a namespaced attribute name of the form (ns:)localName to an object,
 * given a default prefix to assume in case no explicit namespace is given.
 *
 * @param {String} name
 * @param {String} [defaultPrefix] the default prefix to take, if none is present.
 *
 * @return {Object} the parsed name
 */
function parseName(name, defaultPrefix) {
  var parts = name.split(/:/),
      localName, prefix;

  // no prefix (i.e. only local name)
  if (parts.length === 1) {
    localName = name;
    prefix = defaultPrefix;
  } else

  // prefix + local name
  if (parts.length === 2) {
    localName = parts[1];
    prefix = parts[0];
  } else {
    throw new Error('expected <prefix:localName> or <localName>, got ' + name);
  }

  name = (prefix ? prefix + ':' : '') + localName;

  return {
    name: name,
    prefix: prefix,
    localName: localName
  };
}

/**
 * A utility to build element descriptors.
 */
function DescriptorBuilder(nameNs) {
  this.ns = nameNs;
  this.name = nameNs.name;
  this.allTypes = [];
  this.allTypesByName = {};
  this.properties = [];
  this.propertiesByName = {};
}


DescriptorBuilder.prototype.build = function() {
  return (0,min_dash__WEBPACK_IMPORTED_MODULE_0__.pick)(this, [
    'ns',
    'name',
    'allTypes',
    'allTypesByName',
    'properties',
    'propertiesByName',
    'bodyProperty',
    'idProperty'
  ]);
};

/**
 * Add property at given index.
 *
 * @param {Object} p
 * @param {Number} [idx]
 * @param {Boolean} [validate=true]
 */
DescriptorBuilder.prototype.addProperty = function(p, idx, validate) {

  if (typeof idx === 'boolean') {
    validate = idx;
    idx = undefined;
  }

  this.addNamedProperty(p, validate !== false);

  var properties = this.properties;

  if (idx !== undefined) {
    properties.splice(idx, 0, p);
  } else {
    properties.push(p);
  }
};


DescriptorBuilder.prototype.replaceProperty = function(oldProperty, newProperty, replace) {
  var oldNameNs = oldProperty.ns;

  var props = this.properties,
      propertiesByName = this.propertiesByName,
      rename = oldProperty.name !== newProperty.name;

  if (oldProperty.isId) {
    if (!newProperty.isId) {
      throw new Error(
        'property <' + newProperty.ns.name + '> must be id property ' +
        'to refine <' + oldProperty.ns.name + '>');
    }

    this.setIdProperty(newProperty, false);
  }

  if (oldProperty.isBody) {

    if (!newProperty.isBody) {
      throw new Error(
        'property <' + newProperty.ns.name + '> must be body property ' +
        'to refine <' + oldProperty.ns.name + '>');
    }

    // TODO: Check compatibility
    this.setBodyProperty(newProperty, false);
  }

  // validate existence and get location of old property
  var idx = props.indexOf(oldProperty);
  if (idx === -1) {
    throw new Error('property <' + oldNameNs.name + '> not found in property list');
  }

  // remove old property
  props.splice(idx, 1);

  // replacing the named property is intentional
  //
  //  * validate only if this is a "rename" operation
  //  * add at specific index unless we "replace"
  //
  this.addProperty(newProperty, replace ? undefined : idx, rename);

  // make new property available under old name
  propertiesByName[oldNameNs.name] = propertiesByName[oldNameNs.localName] = newProperty;
};


DescriptorBuilder.prototype.redefineProperty = function(p, targetPropertyName, replace) {

  var nsPrefix = p.ns.prefix;
  var parts = targetPropertyName.split('#');

  var name = parseName(parts[0], nsPrefix);
  var attrName = parseName(parts[1], name.prefix).name;

  var redefinedProperty = this.propertiesByName[attrName];
  if (!redefinedProperty) {
    throw new Error('refined property <' + attrName + '> not found');
  } else {
    this.replaceProperty(redefinedProperty, p, replace);
  }

  delete p.redefines;
};

DescriptorBuilder.prototype.addNamedProperty = function(p, validate) {
  var ns = p.ns,
      propsByName = this.propertiesByName;

  if (validate) {
    this.assertNotDefined(p, ns.name);
    this.assertNotDefined(p, ns.localName);
  }

  propsByName[ns.name] = propsByName[ns.localName] = p;
};

DescriptorBuilder.prototype.removeNamedProperty = function(p) {
  var ns = p.ns,
      propsByName = this.propertiesByName;

  delete propsByName[ns.name];
  delete propsByName[ns.localName];
};

DescriptorBuilder.prototype.setBodyProperty = function(p, validate) {

  if (validate && this.bodyProperty) {
    throw new Error(
      'body property defined multiple times ' +
      '(<' + this.bodyProperty.ns.name + '>, <' + p.ns.name + '>)');
  }

  this.bodyProperty = p;
};

DescriptorBuilder.prototype.setIdProperty = function(p, validate) {

  if (validate && this.idProperty) {
    throw new Error(
      'id property defined multiple times ' +
      '(<' + this.idProperty.ns.name + '>, <' + p.ns.name + '>)');
  }

  this.idProperty = p;
};

DescriptorBuilder.prototype.assertNotTrait = function(typeDescriptor) {

  const _extends = typeDescriptor.extends || [];

  if (_extends.length) {
    throw new Error(
      `cannot create <${ typeDescriptor.name }> extending <${ typeDescriptor.extends }>`
    );
  }
};

DescriptorBuilder.prototype.assertNotDefined = function(p, name) {
  var propertyName = p.name,
      definedProperty = this.propertiesByName[propertyName];

  if (definedProperty) {
    throw new Error(
      'property <' + propertyName + '> already defined; ' +
      'override of <' + definedProperty.definedBy.ns.name + '#' + definedProperty.ns.name + '> by ' +
      '<' + p.definedBy.ns.name + '#' + p.ns.name + '> not allowed without redefines');
  }
};

DescriptorBuilder.prototype.hasProperty = function(name) {
  return this.propertiesByName[name];
};

DescriptorBuilder.prototype.addTrait = function(t, inherited) {

  if (inherited) {
    this.assertNotTrait(t);
  }

  var typesByName = this.allTypesByName,
      types = this.allTypes;

  var typeName = t.name;

  if (typeName in typesByName) {
    return;
  }

  (0,min_dash__WEBPACK_IMPORTED_MODULE_0__.forEach)(t.properties, (0,min_dash__WEBPACK_IMPORTED_MODULE_0__.bind)(function(p) {

    // clone property to allow extensions
    p = (0,min_dash__WEBPACK_IMPORTED_MODULE_0__.assign)({}, p, {
      name: p.ns.localName,
      inherited: inherited
    });

    Object.defineProperty(p, 'definedBy', {
      value: t
    });

    var replaces = p.replaces,
        redefines = p.redefines;

    // add replace/redefine support
    if (replaces || redefines) {
      this.redefineProperty(p, replaces || redefines, replaces);
    } else {
      if (p.isBody) {
        this.setBodyProperty(p);
      }
      if (p.isId) {
        this.setIdProperty(p);
      }
      this.addProperty(p);
    }
  }, this));

  types.push(t);
  typesByName[typeName] = t;
};

/**
 * A registry of Moddle packages.
 *
 * @param {Array<Package>} packages
 * @param {Properties} properties
 */
function Registry(packages, properties) {
  this.packageMap = {};
  this.typeMap = {};

  this.packages = [];

  this.properties = properties;

  (0,min_dash__WEBPACK_IMPORTED_MODULE_0__.forEach)(packages, (0,min_dash__WEBPACK_IMPORTED_MODULE_0__.bind)(this.registerPackage, this));
}


Registry.prototype.getPackage = function(uriOrPrefix) {
  return this.packageMap[uriOrPrefix];
};

Registry.prototype.getPackages = function() {
  return this.packages;
};


Registry.prototype.registerPackage = function(pkg) {

  // copy package
  pkg = (0,min_dash__WEBPACK_IMPORTED_MODULE_0__.assign)({}, pkg);

  var pkgMap = this.packageMap;

  ensureAvailable(pkgMap, pkg, 'prefix');
  ensureAvailable(pkgMap, pkg, 'uri');

  // register types
  (0,min_dash__WEBPACK_IMPORTED_MODULE_0__.forEach)(pkg.types, (0,min_dash__WEBPACK_IMPORTED_MODULE_0__.bind)(function(descriptor) {
    this.registerType(descriptor, pkg);
  }, this));

  pkgMap[pkg.uri] = pkgMap[pkg.prefix] = pkg;
  this.packages.push(pkg);
};


/**
 * Register a type from a specific package with us
 */
Registry.prototype.registerType = function(type, pkg) {

  type = (0,min_dash__WEBPACK_IMPORTED_MODULE_0__.assign)({}, type, {
    superClass: (type.superClass || []).slice(),
    extends: (type.extends || []).slice(),
    properties: (type.properties || []).slice(),
    meta: (0,min_dash__WEBPACK_IMPORTED_MODULE_0__.assign)((type.meta || {}))
  });

  var ns = parseName(type.name, pkg.prefix),
      name = ns.name,
      propertiesByName = {};

  // parse properties
  (0,min_dash__WEBPACK_IMPORTED_MODULE_0__.forEach)(type.properties, (0,min_dash__WEBPACK_IMPORTED_MODULE_0__.bind)(function(p) {

    // namespace property names
    var propertyNs = parseName(p.name, ns.prefix),
        propertyName = propertyNs.name;

    // namespace property types
    if (!isBuiltIn(p.type)) {
      p.type = parseName(p.type, propertyNs.prefix).name;
    }

    (0,min_dash__WEBPACK_IMPORTED_MODULE_0__.assign)(p, {
      ns: propertyNs,
      name: propertyName
    });

    propertiesByName[propertyName] = p;
  }, this));

  // update ns + name
  (0,min_dash__WEBPACK_IMPORTED_MODULE_0__.assign)(type, {
    ns: ns,
    name: name,
    propertiesByName: propertiesByName
  });

  (0,min_dash__WEBPACK_IMPORTED_MODULE_0__.forEach)(type.extends, (0,min_dash__WEBPACK_IMPORTED_MODULE_0__.bind)(function(extendsName) {
    var extended = this.typeMap[extendsName];

    extended.traits = extended.traits || [];
    extended.traits.push(name);
  }, this));

  // link to package
  this.definePackage(type, pkg);

  // register
  this.typeMap[name] = type;
};


/**
 * Traverse the type hierarchy from bottom to top,
 * calling iterator with (type, inherited) for all elements in
 * the inheritance chain.
 *
 * @param {Object} nsName
 * @param {Function} iterator
 * @param {Boolean} [trait=false]
 */
Registry.prototype.mapTypes = function(nsName, iterator, trait) {

  var type = isBuiltIn(nsName.name) ? { name: nsName.name } : this.typeMap[nsName.name];

  var self = this;

  /**
   * Traverse the selected super type or trait
   *
   * @param {String} cls
   * @param {Boolean} [trait=false]
   */
  function traverse(cls, trait) {
    var parentNs = parseName(cls, isBuiltIn(cls) ? '' : nsName.prefix);
    self.mapTypes(parentNs, iterator, trait);
  }

  /**
   * Traverse the selected trait.
   *
   * @param {String} cls
   */
  function traverseTrait(cls) {
    return traverse(cls, true);
  }

  /**
   * Traverse the selected super type
   *
   * @param {String} cls
   */
  function traverseSuper(cls) {
    return traverse(cls, false);
  }

  if (!type) {
    throw new Error('unknown type <' + nsName.name + '>');
  }

  (0,min_dash__WEBPACK_IMPORTED_MODULE_0__.forEach)(type.superClass, trait ? traverseTrait : traverseSuper);

  // call iterator with (type, inherited=!trait)
  iterator(type, !trait);

  (0,min_dash__WEBPACK_IMPORTED_MODULE_0__.forEach)(type.traits, traverseTrait);
};


/**
 * Returns the effective descriptor for a type.
 *
 * @param  {String} type the namespaced name (ns:localName) of the type
 *
 * @return {Descriptor} the resulting effective descriptor
 */
Registry.prototype.getEffectiveDescriptor = function(name) {

  var nsName = parseName(name);

  var builder = new DescriptorBuilder(nsName);

  this.mapTypes(nsName, function(type, inherited) {
    builder.addTrait(type, inherited);
  });

  var descriptor = builder.build();

  // define package link
  this.definePackage(descriptor, descriptor.allTypes[descriptor.allTypes.length - 1].$pkg);

  return descriptor;
};


Registry.prototype.definePackage = function(target, pkg) {
  this.properties.define(target, '$pkg', { value: pkg });
};



// helpers ////////////////////////////

function ensureAvailable(packageMap, pkg, identifierKey) {

  var value = pkg[identifierKey];

  if (value in packageMap) {
    throw new Error('package with ' + identifierKey + ' <' + value + '> already defined');
  }
}

/**
 * A utility that gets and sets properties of model elements.
 *
 * @param {Model} model
 */
function Properties(model) {
  this.model = model;
}


/**
 * Sets a named property on the target element.
 * If the value is undefined, the property gets deleted.
 *
 * @param {Object} target
 * @param {String} name
 * @param {Object} value
 */
Properties.prototype.set = function(target, name, value) {

  if (!(0,min_dash__WEBPACK_IMPORTED_MODULE_0__.isString)(name) || !name.length) {
    throw new TypeError('property name must be a non-empty string');
  }

  var property = this.getProperty(target, name);

  var propertyName = property && property.name;

  if (isUndefined(value)) {

    // unset the property, if the specified value is undefined;
    // delete from $attrs (for extensions) or the target itself
    if (property) {
      delete target[propertyName];
    } else {
      delete target.$attrs[stripGlobal(name)];
    }
  } else {

    // set the property, defining well defined properties on the fly
    // or simply updating them in target.$attrs (for extensions)
    if (property) {
      if (propertyName in target) {
        target[propertyName] = value;
      } else {
        defineProperty(target, property, value);
      }
    } else {
      target.$attrs[stripGlobal(name)] = value;
    }
  }
};

/**
 * Returns the named property of the given element
 *
 * @param  {Object} target
 * @param  {String} name
 *
 * @return {Object}
 */
Properties.prototype.get = function(target, name) {

  var property = this.getProperty(target, name);

  if (!property) {
    return target.$attrs[stripGlobal(name)];
  }

  var propertyName = property.name;

  // check if access to collection property and lazily initialize it
  if (!target[propertyName] && property.isMany) {
    defineProperty(target, property, []);
  }

  return target[propertyName];
};


/**
 * Define a property on the target element
 *
 * @param  {Object} target
 * @param  {String} name
 * @param  {Object} options
 */
Properties.prototype.define = function(target, name, options) {

  if (!options.writable) {

    var value = options.value;

    // use getters for read-only variables to support ES6 proxies
    // cf. https://github.com/bpmn-io/internal-docs/issues/386
    options = (0,min_dash__WEBPACK_IMPORTED_MODULE_0__.assign)({}, options, {
      get: function() { return value; }
    });

    delete options.value;
  }

  Object.defineProperty(target, name, options);
};


/**
 * Define the descriptor for an element
 */
Properties.prototype.defineDescriptor = function(target, descriptor) {
  this.define(target, '$descriptor', { value: descriptor });
};

/**
 * Define the model for an element
 */
Properties.prototype.defineModel = function(target, model) {
  this.define(target, '$model', { value: model });
};

/**
 * Return property with the given name on the element.
 *
 * @param {any} target
 * @param {string} name
 *
 * @return {object | null} property
 */
Properties.prototype.getProperty = function(target, name) {

  var model = this.model;

  var property = model.getPropertyDescriptor(target, name);

  if (property) {
    return property;
  }

  if (name.includes(':')) {
    return null;
  }

  const strict = model.config.strict;

  if (typeof strict !== 'undefined') {
    const error = new TypeError(`unknown property <${ name }> on <${ target.$type }>`);

    if (strict) {
      throw error;
    } else {

      // eslint-disable-next-line no-undef
      typeof console !== 'undefined' && console.warn(error);
    }
  }

  return null;
};

function isUndefined(val) {
  return typeof val === 'undefined';
}

function defineProperty(target, property, value) {
  Object.defineProperty(target, property.name, {
    enumerable: !property.isReference,
    writable: true,
    value: value,
    configurable: true
  });
}

function stripGlobal(name) {
  return name.replace(/^:/, '');
}

// Moddle implementation /////////////////////////////////////////////////

/**
 * @class Moddle
 *
 * A model that can be used to create elements of a specific type.
 *
 * @example
 *
 * var Moddle = require('moddle');
 *
 * var pkg = {
 *   name: 'mypackage',
 *   prefix: 'my',
 *   types: [
 *     { name: 'Root' }
 *   ]
 * };
 *
 * var moddle = new Moddle([pkg]);
 *
 * @param {Array<Package>} packages the packages to contain
 *
 * @param { { strict?: boolean } } [config] moddle configuration
 */
function Moddle(packages, config = {}) {

  this.properties = new Properties(this);

  this.factory = new Factory(this, this.properties);
  this.registry = new Registry(packages, this.properties);

  this.typeCache = {};

  this.config = config;
}


/**
 * Create an instance of the specified type.
 *
 * @method Moddle#create
 *
 * @example
 *
 * var foo = moddle.create('my:Foo');
 * var bar = moddle.create('my:Bar', { id: 'BAR_1' });
 *
 * @param  {String|Object} descriptor the type descriptor or name know to the model
 * @param  {Object} attrs   a number of attributes to initialize the model instance with
 * @return {Object}         model instance
 */
Moddle.prototype.create = function(descriptor, attrs) {
  var Type = this.getType(descriptor);

  if (!Type) {
    throw new Error('unknown type <' + descriptor + '>');
  }

  return new Type(attrs);
};


/**
 * Returns the type representing a given descriptor
 *
 * @method Moddle#getType
 *
 * @example
 *
 * var Foo = moddle.getType('my:Foo');
 * var foo = new Foo({ 'id' : 'FOO_1' });
 *
 * @param  {String|Object} descriptor the type descriptor or name know to the model
 * @return {Object}         the type representing the descriptor
 */
Moddle.prototype.getType = function(descriptor) {

  var cache = this.typeCache;

  var name = (0,min_dash__WEBPACK_IMPORTED_MODULE_0__.isString)(descriptor) ? descriptor : descriptor.ns.name;

  var type = cache[name];

  if (!type) {
    descriptor = this.registry.getEffectiveDescriptor(name);
    type = cache[name] = this.factory.createType(descriptor);
  }

  return type;
};


/**
 * Creates an any-element type to be used within model instances.
 *
 * This can be used to create custom elements that lie outside the meta-model.
 * The created element contains all the meta-data required to serialize it
 * as part of meta-model elements.
 *
 * @method Moddle#createAny
 *
 * @example
 *
 * var foo = moddle.createAny('vendor:Foo', 'http://vendor', {
 *   value: 'bar'
 * });
 *
 * var container = moddle.create('my:Container', 'http://my', {
 *   any: [ foo ]
 * });
 *
 * // go ahead and serialize the stuff
 *
 *
 * @param  {String} name  the name of the element
 * @param  {String} nsUri the namespace uri of the element
 * @param  {Object} [properties] a map of properties to initialize the instance with
 * @return {Object} the any type instance
 */
Moddle.prototype.createAny = function(name, nsUri, properties) {

  var nameNs = parseName(name);

  var element = {
    $type: name,
    $instanceOf: function(type) {
      return type === this.$type;
    }
  };

  var descriptor = {
    name: name,
    isGeneric: true,
    ns: {
      prefix: nameNs.prefix,
      localName: nameNs.localName,
      uri: nsUri
    }
  };

  this.properties.defineDescriptor(element, descriptor);
  this.properties.defineModel(element, this);
  this.properties.define(element, '$parent', { enumerable: false, writable: true });
  this.properties.define(element, '$instanceOf', { enumerable: false, writable: true });

  (0,min_dash__WEBPACK_IMPORTED_MODULE_0__.forEach)(properties, function(a, key) {
    if ((0,min_dash__WEBPACK_IMPORTED_MODULE_0__.isObject)(a) && a.value !== undefined) {
      element[a.name] = a.value;
    } else {
      element[key] = a;
    }
  });

  return element;
};

/**
 * Returns a registered package by uri or prefix
 *
 * @return {Object} the package
 */
Moddle.prototype.getPackage = function(uriOrPrefix) {
  return this.registry.getPackage(uriOrPrefix);
};

/**
 * Returns a snapshot of all known packages
 *
 * @return {Object} the package
 */
Moddle.prototype.getPackages = function() {
  return this.registry.getPackages();
};

/**
 * Returns the descriptor for an element
 */
Moddle.prototype.getElementDescriptor = function(element) {
  return element.$descriptor;
};

/**
 * Returns true if the given descriptor or instance
 * represents the given type.
 *
 * May be applied to this, if element is omitted.
 */
Moddle.prototype.hasType = function(element, type) {
  if (type === undefined) {
    type = element;
    element = this;
  }

  var descriptor = element.$model.getElementDescriptor(element);

  return (type in descriptor.allTypesByName);
};

/**
 * Returns the descriptor of an elements named property
 */
Moddle.prototype.getPropertyDescriptor = function(element, property) {
  return this.getElementDescriptor(element).propertiesByName[property];
};

/**
 * Returns a mapped type's descriptor
 */
Moddle.prototype.getTypeDescriptor = function(type) {
  return this.registry.typeMap[type];
};


//# sourceMappingURL=index.esm.js.map


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!*************************!*\
  !*** ./client/index.ts ***!
  \*************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var camunda_modeler_plugin_helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! camunda-modeler-plugin-helpers */ "./node_modules/camunda-modeler-plugin-helpers/index.js");
/* harmony import */ var _document_generator_plugin__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./document-generator-plugin */ "./client/document-generator-plugin.tsx");
// @ts-expect-error import


(0,camunda_modeler_plugin_helpers__WEBPACK_IMPORTED_MODULE_0__.registerClientExtension)(_document_generator_plugin__WEBPACK_IMPORTED_MODULE_1__["default"]);

})();

/******/ })()
;
//# sourceMappingURL=client.js.map