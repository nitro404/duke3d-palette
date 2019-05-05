"use strict";

const utilities = require("extra-utilities");
const Jimp = require("jimp");
const PaletteFileType = require("./palette-file-type.js");
const PaletteIMG = require("./palette-img.js");

class PaletteIMGFileType extends PaletteFileType {
	constructor(id, name, extension, mimeType) {
		if(typeof id === "string") {
			mimeType = extension;
			extension = name;
			name = id;
			id = NaN;
		}

		super(id, name, extension);

		let self = this;

		let _properties = { };

		Object.defineProperty(self, "mimeType", {
			enumerable: true,
			get() {
				return _properties.mimeType;
			},
			set(value) {
				_properties.mimeType = utilities.trimString(value);
			}
		});

		self.mimeType = mimeType;
	}

	static isPaletteIMGFileType(value) {
		return value instanceof PaletteIMGFileType;
	}

	isValid() {
		let self = this;

		return super.isValid() &&
			   utilities.isNonEmptyString(self.mimeType);
	}

	static isValid(value) {
		return PaletteIMGFileType.isPaletteFileType(value) &&
			   value.isValid();
	}
}

Object.defineProperty(PaletteIMG, "IMGFileType", {
	value: PaletteIMGFileType,
	enumerable: true
});

Object.defineProperty(PaletteIMGFileType, "BMP", {
	value: new PaletteIMG.IMGFileType(
		"Bitmap",
		"BMP",
		Jimp.MIME_BMP
	),
	enumerable: true
});

Object.defineProperty(PaletteIMGFileType, "PNG", {
	value: new PaletteIMG.IMGFileType(
		"Portable Network Graphics",
		"PNG",
		Jimp.MIME_PNG
	),
	enumerable: true
});

Object.defineProperty(PaletteIMGFileType, "FileTypes", {
	value: [
		PaletteIMGFileType.BMP,
		PaletteIMGFileType.PNG
	],
	enumerable: true
});

module.exports = PaletteIMGFileType;
