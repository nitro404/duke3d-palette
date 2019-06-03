"use strict";

const async = require("async");
const path = require("path-extra");
const fs = require("fs-extra");
const utilities = require("extra-utilities");
const ByteBuffer = require("bytebuffer");
const Colour = require("colour-rgba");
const Palette = require("./palette.js");

class PaletteDAT extends Palette {
	constructor(data, fileType, filePath) {
		super(data, fileType, filePath);

		let self = this;

		for(let i = 0; i < PaletteDAT.DATFileType.FileTypes.length; i++) {
			self.addFileType(PaletteDAT.DATFileType.FileTypes[i]);
		}

		if(Buffer.isBuffer(self.data) && Palette.FileType.isValid(self.fileType)) {
			if(self.data.length !== self.fileType.size) {
				throw new Error(self.fileType.name + " DAT data size of " + self.data.length + " does not match expected size of " + self.fileType.size + ".");
			}
		}
	}

	createNewData() {
		throw new TypeError("Cannot create new DAT palette data buffer!");
	}

	numberOfSubPalettes() {
		let self = this;

		return self.fileType.numberOfSubPalettes();
	}

	getPaletteDescription(index) {
		let self = this;

		return self.fileType.getDescription(index);
	}

	getPixel(x, y, index) {
		let self = this;

		if(!Buffer.isBuffer(self.data)) {
			return null;
		}

		if(!PaletteDAT.DATFileType.isValid(self.fileType)) {
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

		if(isNaN(index) || index < 0 || index >= self.numberOfSubPalettes()) {
			return null;
		}

		// calculate the offset in the palette data array
		// account for the offset in each DAT type,
		// the index representing the local sub palette,
		// the x and y position of the pixel
		// and the number of bytes per pixel (3)
		const pixelOffset = self.fileType.offset + (index * PaletteDAT.PaletteSizeRGB) + (y * Palette.Height * PaletteDAT.BytesPerPixel) + (x * PaletteDAT.BytesPerPixel);

		// read the colour data from the bytes in the buffer at the specified pixel location and scale it upwards by the colour scale
		return new Colour(
			self.data.readUInt8(pixelOffset) * PaletteDAT.ColourScale,
			self.data.readUInt8(pixelOffset + 1) * PaletteDAT.ColourScale,
			self.data.readUInt8(pixelOffset + 2) * PaletteDAT.ColourScale
		);
	}

	updatePixel(x, y, r, g, b, a, index) {
		let self = this;

		if(!Buffer.isBuffer(self.data)) {
			return false;
		}

		if(!PaletteDAT.DATFileType.isValid(self.fileType)) {
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

		if(isNaN(index) || index < 0 || index >= self.numberOfSubPalettes()) {
			return null;
		}

		// calculate the offset in the palette data array
		// account for the offset in each DAT type,
		// the index representing the selected local sub palette,
		// the x and y position of the pixel
		// and the number of bytes per pixel (3)
		const pixelOffset = self.fileType.offset + (self.index * PaletteDAT.PaletteSizeRGB) + (y * Palette.Height * PaletteDAT.BytesPerPixel) + (x * PaletteDAT.BytesPerPixel);

		// overwrite the colour data for the specified pixel in the buffer
		self.data.writeUInt8(Math.floor(colour.r / PaletteDAT.ColourScale), pixelOffset);
		self.data.writeUInt8(Math.floor(colour.g / PaletteDAT.ColourScale), pixelOffset + 1);
		self.data.writeUInt8(Math.floor(colour.b / PaletteDAT.ColourScale), pixelOffset + 2);

		return true;
	}

	updateColourData(index, dataIndex, colourData) {
		let self = this;

		if(!PaletteDAT.DATFileType.isValid(self.fileType)) {
			return false;
		}

		index = utilities.parseInteger(index);

		if(isNaN(index) || index < 0 || index >= self.numberOfSubPalettes()) {
			return null;
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

		// iterate over the section of the data array corresponding to the specified sub-palette
		// and replace each pixel with the specified information in the new colour data array at the corresponding
		// offset to that of the sub-palette in the external colour data
		let offset = 0;
		let pixelIndex = 0;
		let colour = null;

		for(let j = 0; j < Palette.Height; j++) {
			for(let i = 0; i < Palette.Width; i++) {
				// calculate the offset in the palette data array
				// account for the offset in each DAT type,
				// the index representing the selected local sub palette,
				// the x and y position of the pixel
				// and the number of bytes per pixel (3)
				offset = self.fileType.offset + (self.index * PaletteDAT.PaletteSizeRGB) + (j * Palette.Height * PaletteDAT.BytesPerPixel) + (i * PaletteDAT.BytesPerPixel);

				// calculate the index in the colour data array corresponding
				// to the pixel to be replaced in the local palette data array
				pixelIndex = dataOffset + (j * Palette.Width) + i;
				colour = colourData[pixelIndex];

				// overwrite the colour data for the specified pixel in the buffer
				self.data.writeUInt8(Math.floor(colour.r / PaletteDAT.ColourScale), offset);
				self.data.writeUInt8(Math.floor(colour.g / PaletteDAT.ColourScale), offset + 1);
				self.data.writeUInt8(Math.floor(colour.b / PaletteDAT.ColourScale), offset + 2);
			}
		}

		return true;
	}

	fillWithColour(r, g, b, a, index) {
		let self = this;

		if(!PaletteDAT.DATFileType.isValid(self.fileType)) {
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

		if(isNaN(index) || index >= self.numberOfSubPalettes()) {
			return null;
		}

		// iterate over all local palette data for all sub-palettes and
		// replace it with the corresponding colour value
		let offset = 0;

		for(let p = (index < 0 ? 0 : index); p < (index < 0 ? self.numberOfSubPalettes() : index + 1); p++) {
			for(let j = 0; j < Palette.Height; j++) {
				for(let i = 0; i < Palette.Width; i++) {
					// calculate the offset in the palette data array
					// account for the offset in each DAT type,
					// the index representing the current local sub palette,
					// the x and y position of the pixel
					// and the number of bytes per pixel (3)
					offset = self.fileType.offset + (p * PaletteDAT.PaletteSizeRGB) + (j * Palette.Height * PaletteDAT.BytesPerPixel) + (i * PaletteDAT.BytesPerPixel);

					// divide each colour channel for the specified colour by the colour scale and convert it to a byte
					self.data.writeUInt8(Math.floor(colour.r / PaletteDAT.ColourScale), offset);
					self.data.writeUInt8(Math.floor(colour.g / PaletteDAT.ColourScale), offset + 1);
					self.data.writeUInt8(Math.floor(colour.b / PaletteDAT.ColourScale), offset + 2);
				}
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

		for(let i = 0; i < PaletteDAT.DATFileType.FileTypes.length; i++) {
			if(PaletteDAT.DATFileType.FileTypes[i].size === data.length) {
				return callback(null, PaletteDAT.DATFileType.FileTypes[i]);
			}
		}

		return callback(null, null);
	}

	validateData() {
		let self = this;

		if(!Buffer.isBuffer(self.data)) {
			throw new Error("Invalid DAT palette data, expected buffer object.");
		}

		if(!PaletteDAT.DATFileType.isValid(self.fileType)) {
			throw new Error("Invalid palette DAT type, expected valid DAT type object.");
		}

		// verify that the data is not missing any information, and contains all required colour data
		if(self.data.length < self.fileType.size) {
			throw new Error("DAT palette data is incomplete or corrupted.");
		}
	}

	static isPaletteDAT(palette) {
		return palette instanceof PaletteDAT;
	}
}

Object.defineProperty(PaletteDAT, "DefaultFileExtension", {
	value: "DAT",
	enumerable: true
});

Object.defineProperty(PaletteDAT, "BytesPerPixel", {
	value: 3,
	enumerable: true
});

Object.defineProperty(PaletteDAT, "ColourScale", {
	value: 4,
	enumerable: true
});

Object.defineProperty(PaletteDAT, "PaletteSizeRGB", {
	value: Palette.NumberOfColours * PaletteDAT.BytesPerPixel, // 256 * 3 = 768
	enumerable: true
});

Object.defineProperty(PaletteDAT, "FileType", {
	value: "DAT",
	enumerable: true
});

Object.defineProperty(Palette, "DAT", {
	value: PaletteDAT,
	enumerable: true
});

Palette.addPaletteType("DAT", PaletteDAT);

module.exports = PaletteDAT;
