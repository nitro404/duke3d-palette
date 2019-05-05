"use strict";

const utilities = require("extra-utilities");
const PaletteFileType = require("./palette-file-type.js");
const PaletteDAT = require("./palette-dat.js");

class PaletteDATFileType extends PaletteFileType {
	constructor(id, name, extension, descriptions, offset, size) {
		if(typeof id === "string") {
			size = offset;
			offset = descriptions;
			descriptions = extension;
			extension = name;
			name = id;
			id = NaN;
		}

		super(id, name, extension);

		let self = this;

		let _properties = {
			descriptions: []
		};

		Object.defineProperty(self, "descriptions", {
			enumerable: true,
			get() {
				return _properties.descriptions;
			},
			set(value) {
				_properties.descriptions.length = 0;

				if(Array.isArray(value)) {
					for(let i = 0; i < value.length; i++) {
						const formattedDescription = utilities.trimString(value[i]);

						if(formattedDescription === null) {
							continue;
						}

						_properties.descriptions.push(formattedDescription);
					}
				}
			}
		});

		Object.defineProperty(self, "offset", {
			enumerable: true,
			get() {
				return _properties.offset;
			},
			set(value) {
				_properties.offset = utilities.parseInteger(value);

				if(_properties.offset < 0) {
					_properties.offset = NaN;
				}
			}
		});

		Object.defineProperty(self, "size", {
			enumerable: true,
			get() {
				return _properties.size;
			},
			set(value) {
				_properties.size = utilities.parseInteger(value);

				if(_properties.size < 0) {
					_properties.size = NaN;
				}
			}
		});

		self.descriptions = descriptions;
		self.offset = offset;
		self.size = size;
	}

	numberOfSubPalettes() {
		let self = this;

		return self.descriptions.length;
	}

	numberOfDescriptions() {
		let self = this;

		return self.descriptions.length;
	}

	getDescription(index) {
		let self = this;

		index = utilities.parseInteger(index);

		if(isNaN(index) || index < 0 || index >= self.descriptions.length) {
			return null;
		}

		// return a description of the corresponding sub-palette for each DAT type
		return self.descriptions[index];
	}

	static isPaletteDATFileType(value) {
		return value instanceof PaletteDATFileType;
	}

	isValid() {
		let self = this;

		for(let i = 0; i < self.descriptions.length; i++) {
			if(utilities.isEmptyString(self.descriptions[i])) {
				return false;
			}
		}

		return super.isValid() &&
			   self.descriptions.length !== 0 &&
			   !isNaN(self.offset) &&
			   !isNaN(self.size);
	}

	static isValid(value) {
		return PaletteDATFileType.isPaletteFileType(value) &&
			   value.isValid();
	}
}

Object.defineProperty(PaletteDAT, "DATFileType", {
	value: PaletteDATFileType,
	enumerable: true
});

Object.defineProperty(PaletteDATFileType, "Palette", {
	value: new PaletteDATFileType(
		"Palette",
		"DAT",
		["Normal"],
		0,
		82690
	),
	enumerable: true
});

Object.defineProperty(PaletteDATFileType, "Lookup", {
	value: new PaletteDATFileType(
		"Lookup",
		"DAT",
		["Underwater", "Night Vision", "Title Screen", "3D Realms Logo", "Episode 1 Ending Animation"],
		6426,
		10266
	),
	enumerable: true
});

Object.defineProperty(PaletteDATFileType, "FileTypes", {
	value: [
		PaletteDATFileType.Palette,
		PaletteDATFileType.Lookup
	],
	enumerable: true
});

module.exports = PaletteDATFileType;
