"use strict";

const utilities = require("extra-utilities");
const Palette = require("./palette.js");

class PaletteType {
	constructor(name, paletteSubclass) {
		let self = this;

		let _properties = {
			name: null,
			paletteSubclass: null
		};

		Object.defineProperty(self, "name", {
			enumerable: true,
			get() {
				return _properties.name;
			},
			set(value) {
				_properties.name = utilities.trimString(value);
			}
		});

		Object.defineProperty(self, "paletteSubclass", {
			enumerable: true,
			get() {
				return _properties.paletteSubclass;
			},
			set(value) {
				if(value instanceof Function && value.prototype instanceof Palette) {
					_properties.paletteSubclass = value;
				}
				else {
					_properties.paletteSubclass = null;
				}
			}
		});

		self.name = name;
		self.paletteSubclass = paletteSubclass;
	}

	equals(value) {
		let self = this;

		if(!self.isValid() || !PaletteType.isValid(value)) {
			return false;
		}

		return utilities.stringEqualsIgnoreCase(self.name, value.name);
	}

	toString() {
		let self = this;

		return self.name;
	}

	static isPaletteType(value) {
		return value instanceof PaletteType;
	}

	isValid() {
		let self = this;

		return utilities.isNonEmptyString(self.name) &&
			   self.paletteSubclass instanceof Function &&
			   self.paletteSubclass.prototype instanceof Palette;
	}

	static isValid(value) {
		return PaletteType.isPaletteType(value) &&
			   value.isValid();
	}
}

Object.defineProperty(Palette, "Type", {
	value: PaletteType,
	enumerable: true
});

module.exports = PaletteType;
