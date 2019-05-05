"use strict";

const async = require("async");
const path = require("path-extra");
const fs = require("fs-extra");
const utilities = require("extra-utilities");
const ByteBuffer = require("bytebuffer");
const Colour = require("colour-rgba");
const Palette = require("./palette.js");

class PalettePAL extends Palette {
	constructor(data, fileType, filePath) {
		super(data, fileType, filePath);

		let self = this;

		for(let i = 0; i < PalettePAL.FileTypes.length; i++) {
			self.addFileType(PalettePAL.FileTypes[i]);
		}
	}

	createNewData() {
		let data = Buffer.alloc(PalettePAL.HeaderSize + PalettePAL.PaletteSizeRGBA);

		// copy the blank header data into the new buffer
		PalettePAL.BlankHeaderData.copy(data);

		// set the alpha channel for each pixel to fully opaque
		let offset = 0;

		for(let j = 0; j < Palette.Height; j++) {
			for(let i = 0; i < Palette.Width; i++) {
				offset = PalettePAL.PaletteColourOffset + (j * Palette.Height * PalettePAL.BytesPerPixel) + (i * PalettePAL.BytesPerPixel);

				data.writeUInt8(255, offset + 3);
			}
		}

		return data;
	}

	getPaletteDescription(index) {
		index = utilities.parseInteger(index);

		return index === 0 ? PalettePAL.Description : null;
	}

	getPixel(x, y, index) {
		let self = this;

		if(!Buffer.isBuffer(self.data)) {
			return null;
		}

		x = utilities.parseInteger(x);

		if(isNaN(x) || !isFinite(x) || x < 0 || x >= Palette.Width) {
			return null;
		}

		y = utilities.parseInteger(y);

		if(isNaN(y) || !isFinite(y) || y < 0 || y >= Palette.Height) {
			return null;
		}

		index = utilities.parseInteger(index);

		if(isNaN(index) || !isFinite(index) || index !== 0) {
			return null;
		}

		// compute the offset in the palette data array, accounting for the header size, the y position and x position
		// note that each pixel is 4 bytes (RGBA), hence BBP (bytes per pixel)
		const pixelOffset = PalettePAL.PaletteColourOffset + (y * Palette.Height * PalettePAL.BytesPerPixel) + (x * PalettePAL.BytesPerPixel);

		// read the colour data from the bytes in the buffer at the specified pixel location
		return new Colour(self.data.readUInt8(pixelOffset), self.data.readUInt8(pixelOffset + 1), self.data.readUInt8(pixelOffset + 2), self.data.readUInt8(pixelOffset + 3));
	}

	updatePixel(x, y, r, g, b, a, index) {
		let self = this;

		if(!Buffer.isBuffer(self.data)) {
			return false;
		}

		x = utilities.parseInteger(x);

		if(isNaN(x) || !isFinite(x) || x < 0 || x >= Palette.Width) {
			return false;
		}

		y = utilities.parseInteger(y);

		if(isNaN(y) || !isFinite(y) || y < 0 || y >= Palette.Height) {
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

		if(isNaN(index) || !isFinite(index) || index !== 0) {
			return false;
		}

		// compute the offset in the palette data array, accounting for the header size, the y position and x position
		// note that each pixel is 4 bytes (RGBA), hence BBP (bytes per pixel)
		const pixelOffset = PalettePAL.PaletteColourOffset + (y * Palette.Height * PalettePAL.BytesPerPixel) + (x * PalettePAL.BytesPerPixel);

		// overwrite the colour data for the specified pixel in the buffer
		self.data.writeUInt8(colour.r, pixelOffset);
		self.data.writeUInt8(colour.g, pixelOffset + 1);
		self.data.writeUInt8(colour.b, pixelOffset + 2);
		self.data.writeUInt8(colour.a, pixelOffset + 3);

		return true;
	}

	updateColourData(index, dataIndex, colourData) {
		let self = this;

		index = utilities.parseInteger(index);

		if(isNaN(index) || !isFinite(index) || index !== 0) {
			return false;
		}

		dataIndex = utilities.parseInteger(dataIndex);

		if(isNaN(dataIndex) || !isFinite(dataIndex)) {
			return false;
		}

		// verify that the colour data is not truncated
		const dataOffset = dataIndex * Palette.NumberOfColours;

		if(utilities.isEmptyArray(colourData) || colourData.length - dataOffset < Palette.NumberOfColours) {
			return false;
		}

		// iterate over the entire data array and replace each byte with the bytes corresponding to each pixel in the new colour data array
		let offset = 0;
		let pixelIndex = 0;
		let colour = null;

		for(let j = 0; j < Palette.Height; j++) {
			for(let i = 0; i < Palette.Width; i++) {
				// compute the offsets for the data array and colour data array
				offset = PalettePAL.PaletteColourOffset + (j * Palette.Height * PalettePAL.BytesPerPixel) + (i * PalettePAL.BytesPerPixel);
				pixelIndex = dataOffset + (j * Palette.Width) + i;
				colour = colourData[pixelIndex];

				// overwrite the colour data for the specified pixel in the buffer
				self.data.writeUInt8(colour.r, offset);
				self.data.writeUInt8(colour.g, offset + 1);
				self.data.writeUInt8(colour.b, offset + 2);
				self.data.writeUInt8(colour.a, offset + 3);
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

		if(isNaN(index) || !isFinite(index) || index !== 0) {
			return false;
		}

		// iterate over the entire data array and replace each byte with the bytes corresponding to the bytes that make up the replacement colour
		let offset = 0;

		for(let j = 0; j < Palette.Height; j++) {
			for(let i = 0; i < Palette.Width; i++) {
				// compute the offsets for the data array
				offset = PalettePAL.PaletteColourOffset + (j * Palette.Height * PalettePAL.BytesPerPixel) + (i * PalettePAL.BytesPerPixel);

				// overwrite the colour data for the specified pixel in the buffer
				self.data.writeUInt8(colour.r, offset);
				self.data.writeUInt8(colour.g, offset + 1);
				self.data.writeUInt8(colour.b, offset + 2);
				self.data.writeUInt8(colour.a, offset + 3);
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

		// verify buffer length
		if(data.length !== PalettePAL.FileSizeRGBA) {
			return callback(null, null);
		}

		let paletteByteBuffer = new ByteBuffer();
		paletteByteBuffer.order(true);
		paletteByteBuffer.append(data, "binary");
		paletteByteBuffer.flip();

		// verify that RIFF is specified in the header
		const riffText = paletteByteBuffer.readString(PalettePAL.HeaderRIFFText.length);

		if(utilities.equalsIgnoreCase(riffText.trim(), PalettePAL.HeaderRIFFText)) {
			return callback(null, null);
		}

		// read the palette size
		const paletteSize = paletteByteBuffer.readUint32();

		// verify that PAL is specified in the header (include additional whitespace character)
		const palText = paletteByteBuffer.readString(PalettePAL.HeaderPALText.length + 1).trim();

		if(utilities.equalsIgnoreCase(palText.trim(), PalettePAL.HeaderPALText)) {
			return callback(null, null);
		}

		return callback(null, PalettePAL.Default);
	}

	validateData() {
		let self = this;

		if(self.data === null) {
			return;
		}

		if(!Buffer.isBuffer(self.data)) {
			throw new Error("Invalid PAL palette data, expected buffer object.");
		}

		let paletteByteBuffer = new ByteBuffer();
		paletteByteBuffer.order(true);
		paletteByteBuffer.append(self.data, "binary");
		paletteByteBuffer.flip();

		// verify that the data is long enough to contain header information
		if(self.data.length <= PalettePAL.PaletteNumberOfColoursOffset + 2) {
			throw new Error("PAL palette data is incomplete or corrupted.");
		}

		// verify that RIFF is specified in the header
		const riffText = paletteByteBuffer.readString(PalettePAL.HeaderRIFFText.length);

		if(utilities.equalsIgnoreCase(riffText.trim(), PalettePAL.HeaderRIFFText)) {
			throw new Error("PAL palette data is not a valid format, missing " + PalettePAL.HeaderRIFFText + " specification in header.");
		}

		// verify the palette size
		const paletteSize = paletteByteBuffer.readUint32();

		if(paletteSize !== PalettePAL.FileSizeRGBA) {
//			throw new Error("Cannot read palette data, expected a palette size of " + PalettePAL.FileSizeRGBA + ", not " + paletteSize + ".");
		}

		// verify buffer length
		if(self.data.length !== PalettePAL.FileSizeRGBA) {
			throw new Error("PAL palette data size is " + self.data.length + ", expected a data size of " + PalettePAL.FileSizeRGBA + ".");
		}

		// verify that PAL is specified in the header (include additional whitespace character)
		const palText = paletteByteBuffer.readString(PalettePAL.HeaderPALText.length + 1).trim();

		if(utilities.equalsIgnoreCase(palText.trim(), PalettePAL.HeaderPALText)) {
// TODO: print signature?
			throw new Error("PAL palette data is not a valid format, missing " + PalettePAL.HeaderPALText + " specification in header.");
		}

		// verify that data is specified in the header
		const signatureText = paletteByteBuffer.readString(PalettePAL.HeaderSignatureLength);

// TODO: could also be yuvp xyzp plth

		if(utilities.equalsIgnoreCase(signatureText.trim(), PalettePAL.HeaderDataText)) {
			throw new Error("PAL palette data is not a valid format, missing " + PalettePAL.HeaderDataText + " specification in header.");
		}

		const chunkSize = paletteByteBuffer.readUint32();

		if(chunkSize !== PalettePAL.PaletteSizeRGBA + 4) {
			throw new Error("PAL palette data is not valid, expected a chunk size of " + (PalettePAL.PaletteSizeRGBA + 4) + ", found a value of " + chunkSize + ".");
		}

		// verify that the data format version is correct
		const version = paletteByteBuffer.readUint16();

// TODO: 0300,"Integer16
console.log("version: " + version);

		if(version !== PalettePAL.PalettePALVersion) {
			throw new Error("PAL palette data is version " + version + ", only palettes with version " + PalettePAL.PalettePALVersion + " are supported.");
		}

		// verify the number of colours (note that this is an unsigned short and will need to be properly converted)
		const numberOfColours = paletteByteBuffer.readUint16();

// TODO: ??
console.log("numberOfColours: " + numberOfColours);

		if(numberOfColours != Palette.NumberOfColours) {
			throw new Error("PAL palette data has " + numberOfColours + " colour" + (numberOfColours == 1 ? "" : "s") + ", only palettes with " + Palette.NumberOfColours + " colours (" + Palette.Width + " * " + Palette.Height + ") are supported.");
		}

		// verify that the data is not missing any information, and contains all required colour data
		if(self.data.length < PalettePAL.HeaderSize + PalettePAL.PaletteSizeRGBA) {
			throw new Error("PAL palette file is corrupted or missing data, expected " + (PalettePAL.HeaderSize + PalettePAL.PaletteSizeRGBA) + " bytes, found " + self.data.length + " bytes.");
		}

		// verify that the data is not missing any information, and contains all required colour data
		if(self.data.length < PalettePAL.HeaderSize + PalettePAL.PaletteSizeRGBA) {
			throw new Error("PAL palette data is incomplete or corrupted.");
		}
	}

	static isPalettePAL(palette) {
		return palette instanceof PalettePAL;
	}
}

Object.defineProperty(PalettePAL, "DefaultFileExtension", {
	value: "PAL",
	enumerable: true
});

Object.defineProperty(PalettePAL, "BytesPerPixel", {
	value: 4,
	enumerable: true
});

Object.defineProperty(PalettePAL, "HeaderRIFFText", {
	value: "RIFF",
	enumerable: true
});

Object.defineProperty(PalettePAL, "HeaderSignatureLength", {
	value: 4,
	enumerable: true
});

Object.defineProperty(PalettePAL, "HeaderPALText", {
	value: "PAL",
	enumerable: true
});

Object.defineProperty(PalettePAL, "HeaderDataText", {
	value: "data",
	enumerable: true
});

Object.defineProperty(PalettePAL, "PalettePALVersion", {
	value: 768,
	enumerable: true
});

Object.defineProperty(PalettePAL, "PaletteRIFFOffset", {
	value: 0, // 0
	enumerable: true
});

Object.defineProperty(PalettePAL, "PalettePALTextOffset", {
	value: PalettePAL.PaletteRIFFOffset + 8, // 8
	enumerable: true
});

Object.defineProperty(PalettePAL, "PaletteDataTextOffset", {
	value: PalettePAL.PalettePALTextOffset + 4, // 12
	enumerable: true
});

Object.defineProperty(PalettePAL, "PaletteVersionOffset", {
	value: PalettePAL.PaletteDataTextOffset + 8, // 20
	enumerable: true
});

Object.defineProperty(PalettePAL, "PaletteNumberOfColoursOffset", {
	value: PalettePAL.PaletteVersionOffset + 2, // 22
	enumerable: true
});

Object.defineProperty(PalettePAL, "PaletteColourOffset", {
	value: PalettePAL.PaletteNumberOfColoursOffset + 2, // 24
	enumerable: true
});

Object.defineProperty(PalettePAL, "HeaderSize", {
	value: PalettePAL.PaletteColourOffset, // 24
	enumerable: true
});

Object.defineProperty(PalettePAL, "BlankHeaderData", {
	value: Buffer.from("524946461040050414C206461746144000301", "hex"),
	enumerable: true
});

Object.defineProperty(PalettePAL, "PaletteSizeRGB", {
	value: Palette.NumberOfColours * (PalettePAL.BytesPerPixel - 1), // 256 * 3 = 768
	enumerable: true
});

Object.defineProperty(PalettePAL, "PaletteSizeRGBA", {
	value: Palette.NumberOfColours * PalettePAL.BytesPerPixel, // 256 * 4 = 1024
	enumerable: true
});

Object.defineProperty(PalettePAL, "FileSizeRGB", {
	value: PalettePAL.PaletteSizeRGB + PalettePAL.HeaderSize, // 768 + 24 = 792
	enumerable: true
});

Object.defineProperty(PalettePAL, "FileSizeRGBA", {
	value: PalettePAL.PaletteSizeRGBA + PalettePAL.HeaderSize, // 1024 + 24 = 1048
	enumerable: true
});

Object.defineProperty(PalettePAL, "FileType", {
	value: "PAL",
	enumerable: true
});

Object.defineProperty(PalettePAL, "Description", {
	value: "Default",
	enumerable: true
});

Object.defineProperty(PalettePAL, "Default", {
	value: new Palette.FileType(
		"Microsoft RIFF Palette",
		"PAL"
	),
	enumerable: true
});

Object.defineProperty(PalettePAL, "FileTypes", {
	value: [
		PalettePAL.Default
	],
	enumerable: true
});

Object.defineProperty(Palette, "PAL", {
	value: PalettePAL,
	enumerable: true
});

Palette.addPaletteType("PAL", PalettePAL);

module.exports = PalettePAL;
