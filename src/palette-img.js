"use strict";

const async = require("async");
const path = require("path-extra");
const fs = require("fs-extra");
const utilities = require("extra-utilities");
const Jimp = require("jimp");
const ByteBuffer = require("bytebuffer");
const Colour = require("colour-rgba");
const Palette = require("./palette.js");

class PaletteIMG extends Palette {
	constructor(data, fileType, filePath) {
		super(data, fileType, filePath);

		let self = this;

		let _properties = {
			updatingData: false,
			updatingImage: false,
			image: PaletteIMG.createNewImage()
		};

		for(let i = 0; i < PaletteIMG.IMGFileType.FileTypes.length; i++) {
			self.addFileType(PaletteIMG.IMGFileType.FileTypes[i]);
		}

		Object.defineProperty(self, "updatingData", {
			enumerable: false,
			get() {
				return _properties.updatingData;
			},
			set(updatingData) {
				_properties.updatingData = utilities.parseBoolean(updatingData, false);
			}
		});

		Object.defineProperty(self, "updatingImage", {
			enumerable: false,
			get() {
				return _properties.updatingImage;
			},
			set(updatingImage) {
				_properties.updatingImage = utilities.parseBoolean(updatingImage, false);
			}
		});

		Object.defineProperty(self, "image", {
			enumerable: true,
			get() {
				return _properties.image;
			},
			set(image) {
				const previousImage = _properties.image;

				if(image instanceof Jimp) {
					_properties.image = image;
				}
				else {
					_properties.image = PaletteIMG.createNewImage();
				}

				if(_properties.image !== previousImage) {
					self.onImageChanged(_properties.image);
				}
			}
		});
	}

	static getFileTypeForMimeType(mimeType) {
		const formattedMimeType = utilities.trimString(mimeType, "").toLowerCase();

		if(utilities.isEmptyString(formattedMimeType)) {
			return Palette.FileType.Invalid;
		}

		for(let i = 0; i < PaletteIMG.IMGFileType.FileTypes.length; i++) {
			if(PaletteIMG.IMGFileType.FileTypes[i].mimeType === formattedMimeType) {
				return PaletteIMG.IMGFileType.FileTypes[i];
			}
		}

		return Palette.FileType.Invalid;
	}

	createNewData() {
		let self = this;

		// create a new 16x16 jimp image instance with an opaque black background
		self.image = PaletteIMG.createNewImage();

		return null;
	}

	static createNewImage() {
		return new Jimp(Palette.Width, Palette.Height, Colour.Black.pack());
	}

	getPaletteDescription(index) {
		index = utilities.parseInteger(index);

		return index === 0 ? PaletteIMG.Description : null;
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

		return Colour.unpack(self.image.getPixelColour(x, y));
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

		self.image.setPixelColour(colour.pack(), x, y);
		self.onImageUpdated(self.image);

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

		// iterate over the entire data array and replace each pixel colour with a packed
		// value containing the colour data for the pixel in the new colour data array
		let pixelIndex = 0;

		for(let j = 0; j < Palette.Height; j++) {
			for(let i = 0; i < Palette.Width; i++) {
				// compute the pixel index in the colour data array
				pixelIndex = dataOffset + (j * Palette.Width) + i;

				self.image.setPixelColour(colourData[pixelIndex].pack(), i, j);
			}
		}

		self.onImageUpdated(self.image);

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

		const packedColourValue = colour.pack();

		// iterate over the entire image and replace each pixel with the packed colour value that makes up the replacement colour
		for(let j = 0; j < Palette.Height; j++) {
			for(let i = 0; i < Palette.Width; i++) {
				self.image.setPixelColour(packedColourValue, i, j);
			}
		}

		self.onImageUpdated(self.image);

		return true;
	}

	static getFileTypeForData(data, callback) {
		if(!utilities.isFunction(callback)) {
			throw new Error("Missing or invalid callback function!");
		}

		if(!Buffer.isBuffer(data)) {
			return callback(null, null);
		}

		Jimp.create(
			data,
			function(error, image) {
				if(error) {
					return callback(null, null);
				}

				const fileType = PaletteIMG.getFileTypeForMimeType(image.getMIME());

				if(!fileType.isValid()) {
					return callback(null, null);
				}

				return callback(null, fileType);
			}
		);
	}

	writeTo(filePath, callback) {
		let self = this;

		// delay writing of data until buffer has finished being retrieved from jimp image
		if(self.updatingData) {
			return setTimeout(function() {
				return self.writeTo(filePath, callback);
			});
		}

		return super.writeTo(filePath, callback);
	}

	validateData() {
		let self = this;

		if(self.updatingData) {
			return setTimeout(function() {
				return self.validateData();
			});
		}

		if(!Buffer.isBuffer(self.data)) {
			throw new Error("Invalid palette data, expected buffer object.");
		}

		if(self.updatingImage || self.image === undefined) {
			return setTimeout(function() {
				return self.validateData();
			});
		}

		if(self.image !== null && !(self.image instanceof Jimp)) {
			throw new Error("Invalid image, expected Jimp object.");
		}
	}

	onDataChanged(data) {
		let self = this;

		if(self.updatingData) {
			return;
		}

		self.updateImage();
	}

	onImageChanged(image) {
		let self = this;

		self.updateData();
	}

	onImageUpdated(image) {
		let self = this;

		self.updateData();
	}

	updateData() {
		let self = this;

		if(self.updatingData) {
			return;
		}

		self.updatingData = true;

		if(!(self.image instanceof Jimp)) {
			self.updatingData = false;
			return;
		}

		self.image.getBuffer(
			self.fileType.mimeType,
			function(error, buffer) {
				if(error) {
					self.updatingData = false;

					throw error;
				}

				self.data = buffer;

				self.updatingData = false;
			}
		);
	}

	updateImage() {
		let self = this;

		if(self.updatingImage) {
			return;
		}

		self.updatingImage = true;

		if(!Buffer.isBuffer(self.data)) {
			self.updatingImage = false;
			return;
		}

		Jimp.create(
			self.data,
			function(error, image) {
				if(error) {
					self.updatingImage = false;
					throw error;
				}

				if(image.getWidth() != Palette.Width) {
					self.updatingImage = false;
					throw new Error("Invalid image palette width: " + image.getWidth() + ", expected " + Palette.Width + ".");
				}

				if(image.getHeight() != Palette.Height) {
					self.updatingImage = false;
					throw new Error("Invalid image palette height: " + image.getHeight() + ", expected " + Palette.Height + ".");
				}

				self.image = image;

				self.updatingImage = false;
			}
		);
	}

	equals(value) {
		let self = this;

		if(!PaletteIMG.isPaletteIMG(value)) {
			return false;
		}

		if(self.image === null && value.image === null) {
			return true;
		}
		else if(self.image === null && value.image !== null) {
			return false;
		}
		else if(self.image !== null && value.image === null) {
			return false;
		}

		return Jimp.diff(self.image, value.image).percent === 0;
	}

	static isPaletteIMG(palette) {
		return palette instanceof PaletteIMG;
	}
}

Object.defineProperty(PaletteIMG, "Description", {
	value: "Default",
	enumerable: true
});

Object.defineProperty(Palette, "IMG", {
	value: PaletteIMG,
	enumerable: true
});

Palette.addPaletteType("IMG", PaletteIMG);

module.exports = PaletteIMG;
