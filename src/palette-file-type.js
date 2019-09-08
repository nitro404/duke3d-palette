"use strict";

const utilities = require("extra-utilities");
const Palette = require("./palette.js");

class PaletteFileTypeProperties {
	constructor() {
		const self = this;

		let _properties = {
			idCounter: 0
		};

		Object.defineProperty(self, "idCounter", {
			enumerable: true,
			get() {
				return _properties.idCounter;
			},
			set(value) {
				const newIDCounter = utilities.parseInteger(value);

				if(!isNaN(newIDCounter) && newIDCounter > _properties.idCounter) {
					_properties.idCounter = newIDCounter;
				}
			}
		});
	}
}

class PaletteFileType {
	constructor(id, name, extension) {
		const self = this;

		if(typeof id === "string") {
			extension = name;
			name = id;
			id = NaN;
		}

		let _properties = {
			id: NaN
		};

		Object.defineProperty(self, "id", {
			enumerable: true,
			get() {
				return _properties.id;
			},
			set(value) {
				let newID = utilities.parseInteger(value);

				// only allow negative special values to be set manually
				if(!isNaN(newID) && newID < 0) {
					_properties.id = newID;
				}
			}
		});

		Object.defineProperty(self, "name", {
			enumerable: true,
			get() {
				return _properties.name;
			},
			set(value) {
				_properties.name = utilities.trimString(value);
			}
		});

		Object.defineProperty(self, "extension", {
			enumerable: true,
			get() {
				return _properties.extension;
			},
			set(value) {
				let extension = utilities.trimString(value);

				if(utilities.isNonEmptyString(extension)) {
					extension = extension.toUpperCase();
				}

				_properties.extension = extension;
			}
		});

		self.id = id;
		self.name = name;
		self.extension = extension;

		if(isNaN(self.id)) {
			_properties.id = PaletteFileType.idCounter++;
		}
	}

	static isExtendedBy(paletteFileTypeSubclass) {
		if(!(paletteFileTypeSubclass instanceof Object)) {
			return false;
		}

		let paletteFileTypeSubclassPrototype = null;

		if(paletteFileTypeSubclass instanceof Function) {
			paletteFileTypeSubclassPrototype = paletteFileTypeSubclass.prototype;
		}
		else {
			paletteFileTypeSubclassPrototype = paletteFileTypeSubclass.constructor.prototype;
		}

		return paletteFileTypeSubclassPrototype instanceof PaletteFileType;
	}

	equals(value) {
		const self = this;

		if(!self.isValid() || !PaletteFileType.isValid(value)) {
			return false;
		}

		return utilities.equalsIgnoreCase(self.name, value.name) &&
			   utilities.equalsIgnoreCase(self.extension, value.extension);
	}

	toString() {
		const self = this;

		return self.name + " (" + self.extension + ")";
	}

	static isPaletteFileType(value) {
		return value instanceof PaletteFileType;
	}

	isValid() {
		const self = this;

		return self.id >= 0 &&
			   utilities.isNonEmptyString(self.name) &&
			   utilities.isNonEmptyString(self.extension);
	}

	static isValid(value) {
		return PaletteFileType.isPaletteFileType(value) &&
			   value.isValid();
	}
}

Object.defineProperty(PaletteFileType, "Invalid", {
	value: new PaletteFileType(
		-1,
		"Invalid"
	),
	enumerable: true
});

Object.defineProperty(Palette, "FileType", {
	value: PaletteFileType,
	enumerable: true
});

Object.defineProperty(PaletteFileType, "properties", {
	value: new PaletteFileTypeProperties(),
	enumerable: false
});

Object.defineProperty(PaletteFileType, "idCounter", {
	enumerable: true,
	get() {
		return PaletteFileType.properties.idCounter;
	},
	set(value) {
		PaletteFileType.properties.idCounter = value;
	}
});

module.exports = PaletteFileType;
