"use strict";

const async = require("async");
const path = require("path-extra");
const fs = require("fs-extra");
const utilities = require("extra-utilities");
const ByteBuffer = require("bytebuffer");
const Colour = require("colour-rgba");
const Palette = require("./palette.js");

class PaletteACT extends Palette {
	constructor(data, fileType, filePath) {
		super(data, fileType, filePath);

		let self = this;

		for(let i = 0; i < PaletteACT.FileTypes.length; i++) {
			self.addFileType(PaletteACT.FileTypes[i]);
		}
	}

	createNewData() {
		return Buffer.alloc(PaletteACT.PaletteSizeRGB);
	}

	getPaletteDescription(index) {
		index = utilities.parseInteger(index);

		return index === 0 ? PaletteACT.Description : null;
	}

	getPixel(x, y, index) {
		let self = this;

		if(!Buffer.isBuffer(self.data)) {
			return null;
		}

		x = utilities.parseInteger(x);

		if(isNaN(x) || x < 0 || x >= Palette.Width) {
			return null;
		}

		y = utilities.parseInteger(y);

		if(isNaN(y) || y < 0 || y >= Palette.Height) {
			return null;
		}

		index = utilities.parseInteger(index);

		if(isNaN(index) || index !== 0) {
			return null;
		}

		// compute the offset in the palette data array, accounting for the the y position and x position
		// note that each pixel is 3 bytes (RGB), hence BBP (bytes per pixel)
		const pixelOffset = (y * Palette.Height * PaletteACT.BytesPerPixel) + (x * PaletteACT.BytesPerPixel);

		// read the colour data from the bytes in the buffer at the specified pixel location
		return new Colour(self.data.readUInt8(pixelOffset), self.data.readUInt8(pixelOffset + 1), self.data.readUInt8(pixelOffset + 2));
	}

	updatePixel(x, y, r, g, b, a, index) {
		let self = this;

		if(!Buffer.isBuffer(self.data)) {
			return false;
		}

		x = utilities.parseInteger(x);

		if(isNaN(x) || x < 0 || x >= Palette.Width) {
			return false;
		}

		y = utilities.parseInteger(y);

		if(isNaN(y) || y < 0 || y >= Palette.Height) {
			return false;
		}

		let colour;

		if(Colour.isColour(r)) {
			colour = new Colour(r);
			index = g;
		}
		else {
			colour = new Colour(r, g, b, a);
		}

		index = utilities.parseInteger(index);

		if(isNaN(index) || index !== 0) {
			return false;
		}

		// compute the offset in the palette data array, accounting for the the y position and x position
		// note that each pixel is 3 bytes (RGB), hence BBP (bytes per pixel)
		const pixelOffset = (y * Palette.Height * PaletteACT.BytesPerPixel) + (x * PaletteACT.BytesPerPixel);

		// overwrite the colour data for the specified pixel in the buffer
		self.data.writeUInt8(colour.r, pixelOffset);
		self.data.writeUInt8(colour.g, pixelOffset + 1);
		self.data.writeUInt8(colour.b, pixelOffset + 2);

		return true;
	}

	updateColourData(index, dataIndex, colourData) {
		let self = this;

		index = utilities.parseInteger(index);

		if(isNaN(index) || index !== 0) {
			return false;
		}

		dataIndex = utilities.parseInteger(dataIndex);

		if(isNaN(dataIndex)) {
			return false;
		}

		// verify that the colour data is not truncated
		const dataOffset = dataIndex * Palette.NumberOfColours;

		if(utilities.isEmptyArray(colourData) || colourData.length - dataOffset < Palette.NumberOfColours) {
			return false;
		}

		// iterate over the entire data array and replace each byte with
		// the bytes corresponding to each pixel in the new colour data array
		let offset = 0;
		let pixelIndex = 0;
		let colour = null;

		for(let j = 0; j < Palette.Height; j++) {
			for(let i = 0; i < Palette.Width; i++) {
				// compute the offsets for the data array and colour data array
				offset = (j * Palette.Height * PaletteACT.BytesPerPixel) + (i * PaletteACT.BytesPerPixel);
				pixelIndex = dataOffset + (j * Palette.Width) + i;
				colour = colourData[pixelIndex];

				// overwrite the colour data for the specified pixel in the buffer
				self.data.writeUInt8(colour.r, offset);
				self.data.writeUInt8(colour.g, offset + 1);
				self.data.writeUInt8(colour.b, offset + 2);
			}
		}

		return true;
	}

	fillWithColour(r, g, b, a, index) {
		let self = this;

		let colour;

		if(Colour.isColour(r)) {
			colour = new Colour(r);
			index = g;
		}
		else {
			colour = new Colour(r, g, b, a);
		}

		index = utilities.parseInteger(index);

		if(isNaN(index) || index !== 0) {
			return false;
		}

		// iterate over the entire data array and replace each byte with the bytes corresponding to the bytes that make up the replacement colour
		let offset = 0;

		for(let j = 0; j < Palette.Height; j++) {
			for(let i = 0; i < Palette.Width; i++) {
				// compute the offsets for the data array
				offset = (j * Palette.Height * PaletteACT.BytesPerPixel) + (i * PaletteACT.BytesPerPixel);

				// overwrite the colour data for the specified pixel in the buffer
				self.data.writeUInt8(colour.r, offset);
				self.data.writeUInt8(colour.g, offset + 1);
				self.data.writeUInt8(colour.b, offset + 2);
			}
		}

		return true;
	}

	static getFileTypeForData(data, callback) {
		if(!utilities.isFunction(callback)) {
			throw new Error("Missing or invalid callback function!");
		}

		if(!Buffer.isBuffer(data)) {
			return callback(null, null);
		}

		if(data.length === PaletteACT.PaletteSizeRGB) {
			return callback(null, PaletteACT.Default);
		}

		return callback(null, null);
	}

	validateData() {
		let self = this;

		if(!Buffer.isBuffer(self.data)) {
			throw new Error("Invalid ACT palette data, expected buffer object.");
		}

		// verify that the data is not missing any information, and contains all required colour data
		if(self.data.length !== PaletteACT.PaletteSizeRGB) {
			throw new Error("ACT palette data is incomplete or corrupted.");
		}
	}

	static isPaletteACT(palette) {
		return palette instanceof PaletteACT;
	}
}

Object.defineProperty(PaletteACT, "DefaultFileExtension", {
	value: "ACT",
	enumerable: true
});

Object.defineProperty(PaletteACT, "BytesPerPixel", {
	value: 3,
	enumerable: true
});

Object.defineProperty(PaletteACT, "PaletteSizeRGB", {
	value: Palette.NumberOfColours * PaletteACT.BytesPerPixel, // 256 * 3 = 768
	enumerable: true
});

Object.defineProperty(PaletteACT, "FileType", {
	value: "ACT",
	enumerable: true
});

Object.defineProperty(PaletteACT, "Description", {
	value: "Default",
	enumerable: true
});

Object.defineProperty(PaletteACT, "Default", {
	value: new Palette.FileType(
		"Adobe Color Table",
		"ACT"
	),
	enumerable: true
});

Object.defineProperty(PaletteACT, "FileTypes", {
	value: [
		PaletteACT.Default
	],
	enumerable: true
});

Object.defineProperty(Palette, "ACT", {
	value: PaletteACT,
	enumerable: true
});

Palette.addPaletteType("ACT", PaletteACT);

module.exports = PaletteACT;
