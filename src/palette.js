"use strict";

const async = require("async");
const path = require("path-extra");
const fs = require("fs-extra");
const utilities = require("extra-utilities");
const ByteBuffer = require("bytebuffer");
const Colour = require("colour-rgba");

class PaletteProperties {
	constructor() {
		let self = this;

		let _properties = {
			types: []
		};

		Object.defineProperty(self, "types", {
			enumerable: true,
			get() {
				return _properties.types;
			}
		});
	}
}

class Palette {
	constructor(data, fileType, filePath) {
		let self = this;

		// prevent abstract palette from being instantiated directly
		if(new.target === Palette) {
			throw new TypeError(Palette.name + " is an abstract class and cannot be instantiated directly!");
		}

		// verify that the palette subclass has implemented all required static functions
		for(let i = 0; i < Palette.StaticFunctions.length; i++) {
			const staticFunctionName = Palette.StaticFunctions[i];

			if(!utilities.isFunction(new.target[staticFunctionName])) {
				throw new TypeError(Palette.name + " subclass " + new.target.name + " must implement static function: \"" + staticFunctionName + "\".");
			}
		}

		// verify that the palette subclass has overridden all required abstract prototype functions
		for(let i = 0; i < Palette.AbstractFunctions.length; i++) {
			const abstractFunctionName = Palette.AbstractFunctions[i];

			if(self[abstractFunctionName] === Palette.prototype[abstractFunctionName]) {
				throw new TypeError(Palette.name + " subclass " + new.target.name + " must implement abstract function: \"" + abstractFunctionName + "\".");
			}
		}

		let _properties = {
			paletteSubclass: new.target,
			fileTypes: [],
			fileType: Palette.FileType.Invalid
		};

		Object.defineProperty(self, "paletteSubclass", {
			enumerable: false,
			get() {
				return _properties.paletteSubclass;
			}
		});

		Object.defineProperty(self, "fileTypes", {
			enumerable: true,
			get() {
				return _properties.fileTypes;
			}
		});

		Object.defineProperty(self, "fileType", {
			enumerable: true,
			get() {
				return _properties.fileType;
			},
			set(value) {
				if(Palette.FileType.isValid(value)) {
					_properties.fileType = value;
				}
				else {
					_properties.fileType = Palette.FileType.Invalid;
				}
			}
		});

		Object.defineProperty(self, "filePath", {
			enumerable: true,
			get() {
				return _properties.filePath;
			},
			set(filePath) {
				const previousFilePath = _properties.filePath;

				_properties.filePath = utilities.trimString(filePath);

				if(utilities.isFunction(self.onFilePathChanged) && _properties.filePath !== previousFilePath) {
					self.onFilePathChanged(_properties.filePath);
				}
			}
		});

		Object.defineProperty(self, "data", {
			enumerable: true,
			get() {
				return _properties.data;
			},
			set(data) {
				const previousData = _properties.data;

				if(ByteBuffer.isByteBuffer(data)) {
					_properties.data = data.toBuffer();
				}
				else if(Buffer.isBuffer(data) || Array.isArray(data) || typeof data === "string") {
					_properties.data = Buffer.from(data);
				}
				else {
					_properties.data = self.createNewData();
				}

				if(_properties.data !== null) {
					self.validateData();

					if(utilities.isFunction(self.onDataChanged) && _properties.data !== previousData) {
						self.onDataChanged(_properties.data);
					}
				}
			}
		});

		self.fileType = fileType;
		self.filePath = filePath;
		self.data = data;
	}

	abstractFunction() {
		let self = this;

		throw new TypeError(Palette.name + " function is abstract and must be implemented in " + self.paletteSubclass.name + "!");
	}

	static isExtendedBy(paletteSubclass) {
		if(!(paletteSubclass instanceof Object)) {
			return false;
		}

		let paletteSubclassPrototype = null;

		if(paletteSubclass instanceof Function) {
			paletteSubclassPrototype = paletteSubclass.prototype;
		}
		else {
			paletteSubclassPrototype = paletteSubclass.constructor.prototype;
		}

		return paletteSubclassPrototype instanceof Palette;
	}

	static numberOfPaletteTypes() {
		return Palette.types.length;
	}

	static hasPaletteType(type) {
		return Palette.indexOfPaletteType() !== -1;
	}

	static indexOfPaletteType(type) {
		let typeName = null;

		if(utilities.isObjectStrict(type)) {
			typeName = utilities.trimString(type.name);
		}
		else if(typeof type === "string") {
			typeName = utilities.trimString(type);
		}

		if(utilities.isEmptyString(typeName)) {
			return -1;
		}

		for(let i = 0; i < Palette.types.length; i++) {
			if(utilities.stringEqualsIgnoreCase(Palette.types[i].name, typeName)) {
				return i;
			}
		}

		return -1;
	}

	static getPaletteType(type) {
		const typeIndex = Palette.indexOfPaletteType(type);

		if(typeIndex === -1) {
			return null;
		}

		return Palette.types[typeIndex];
	}

	static addPaletteType(type, paletteSubclass) {
		let typeInfo = null;

		if(Palette.Type.isPaletteType(type)) {
			typeInfo = type;
		}
		else {
			typeInfo = new Palette.Type(type, paletteSubclass);
		}

		if(!typeInfo.isValid()) {
			console.error(Palette.name + " tried to add an invalid palette type!");
			return false;
		}

		const existingPaletteType = Palette.getPaletteType(typeInfo);

		if(utilities.isValid(existingPaletteType)) {
			console.warn(Palette.name + " already has a " + existingPaletteType.name + " palette type!");
			return false;
		}

		Palette.types.push(typeInfo);
	}

	static removePaletteType(type) {
		const typeIndex = Palette.indexOfPaletteType(type);

		if(typeIndex === -1) {
			return false;
		}

		return Palette.types.splice(typeIndex, 1);
	}

	static clearPaletteTypes() {
		Palette.types.length = 0;
	}

	createNewData() {
		let self = this;

		self.abstractFunction();
	}

	getFileName() {
		let self = this;

		if(utilities.isEmptyString(self.filePath)) {
			return null;
		}

		return utilities.getFileName(self.filePath);
	}

	getExtension() {
		let self = this;

		return utilities.getFileExtension(self.filePath);
	}

	numberOfFileTypes() {
		let self = this;

		return self.fileTypes.length;
	}

	hasFileType(fileType) {
		let self = this;

		return self.indexOfFileType() !== -1;
	}

	indexOfFileType(fileType) {
		let self = this;

		let fileTypeName = null;

		if(utilities.isObjectStrict(fileType)) {
			fileTypeName = utilities.trimString(fileType.name);
		}
		else if(typeof fileType === "string") {
			fileTypeName = utilities.trimString(fileType);
		}

		if(utilities.isEmptyString(fileTypeName)) {
			return -1;
		}

		for(let i = 0; i < self.fileTypes.length; i++) {
			if(utilities.stringEqualsIgnoreCase(self.fileTypes[i].name, fileTypeName)) {
				return i;
			}
		}

		return -1;
	}

	getFileType(fileType) {
		let self = this;

		const fileTypeIndex = self.indexOfFileType(fileType);

		if(fileTypeIndex === -1) {
			return null;
		}

		return self.fileTypes[fileTypeIndex];
	}

	addFileType(fileType) {
		let self = this;

		let fileTypeInfo = null;

		if(Palette.FileType.isPaletteFileType(fileType)) {
			fileTypeInfo = fileType;
		}
		else {
			fileTypeInfo = new Palette.FileType(fileType);
		}

		if(!fileTypeInfo.isValid()) {
			console.error(self.paletteSubclass.name + " tried to add an invalid palette file type!");
			return false;
		}

		const existingFileType = self.getFileType(fileTypeInfo);

		if(utilities.isValid(existingFileType)) {
			console.warn(self.paletteSubclass.name + " already has a " + existingFileType.name + " palette file type!");
			return false;
		}

		self.fileTypes.push(fileTypeInfo);
	}

	removeFileType(fileType) {
		let self = this;

		const fileTypeIndex = self.indexOfFileType(fileType);

		if(fileTypeIndex === -1) {
			return false;
		}

		return self.fileTypes.splice(fileTypeIndex, 1);
	}

	clearFileTypes() {
		let self = this;

		self.fileTypes.length = 0;
	}

	numberOfSubPalettes() {
		return 1;
	}

	getPaletteDescription(index) {
		let self = this;

		self.abstractFunction();
	}

	getPaletteDescriptions() {
		let self = this;

		let paletteDescriptions = [];

		for(let i = 0; i < self.numberOfSubPalettes(); i++) {
			paletteDescriptions.push(self.getPaletteDescription(i));
		}

		return paletteDescriptions;
	}

	getPaletteDescriptionsAsString() {
		let self = this;

		let paletteDescriptions = "";

		for(let i = 0; i < self.numberOfSubPalettes(); i++) {
			if(paletteDescriptions.length !== 0) {
				paletteDescriptions += ", ";
			}

			paletteDescriptions += self.getPaletteDescription(i);
		}

		return paletteDescriptions;
	}

	getPixel(x, y, index) {
		let self = this;

		self.abstractFunction();
	}

	lookupPixel(value, index) {
		let self = this;

		const newValue = utilities.parseInteger(value);

		if(isNaN(newValue) || newValue < 0 || newValue > 255) {
			return null;
		}

		return self.getPixel(newValue % Palette.Width, Math.floor(newValue / Palette.Width), index);
	}

	updatePixel(x, y, r, g, b, a, index) {
		let self = this;

		self.abstractFunction();
	}

	getColourData(index) {
		let self = this;

		index = utilities.parseInteger(index);

		if(isNaN(index) || index < 0 || index >= self.numberOfSubPalettes()) {
			return null;
		}

		// iterate over the entire palette and convert each piece of data to a Colour object
		let colourData = [];

		for(let j = 0; j < Palette.Height; j++) {
			for(let i = 0; i < Palette.Width; i++) {
				colourData[(j * Palette.Width) + i] = self.getPixel(i, j, index);
			}
		}

		return colourData;
	}

	getAllColourData() {
		let self = this;

		let colourData = [];

		for(let i = 0; i < self.numberOfSubPalettes(); i++) {
			Array.prototype.push.apply(colourData, self.getColourData(i));
		}

		return colourData;
	}

	updateColourData(index, dataIndex, colourData) {
		let self = this;

		self.abstractFunction();
	}

	updateAllColourData(colourData) {
		let self = this;

		return self.updateColourData(0, 0, colourData);
	}

	fillWithColour(r, g, b, a, index) {
		let self = this;

		self.abstractFunction();
	}

	fillAllWithColour(r, g, b, a) {
		let self = this;

		return self.fillWithColor(r, g, b, a, -1);
	}

	static determinePaletteType(data, callback) {
		if(!utilities.isFunction(callback)) {
			throw new Error("Missing or invalid callback function!");
		}

		if(!Buffer.isBuffer(data)) {
			return callback(null, false);
		}

		return async.detectSeries(
			Palette.types,
			function(paletteType, callback) {
				return paletteType.paletteSubclass.getFileTypeForData(
					data,
					function(error, fileType) {
						if(error) {
							return callback(error);
						}

						if(utilities.isValid(fileType)) {
							return callback({
								type: paletteType,
								fileType: fileType
							});
						}

						return callback(null, false);
					}
				);
			},
			function(result) {
				if(utilities.isObjectStrict(result)) {
					return callback(null, result.type, result.fileType);
				}
				else if(utilities.isError(result)) {
					return callback(result);
				}

				return callback(null, null);
			}
		);
	}

	static readFrom(filePath, callback) {
		if(!utilities.isFunction(callback)) {
			throw new Error("Missing or invalid callback function!");
		}

		if(utilities.isEmptyString(filePath)) {
			return callback(new Error("Missing or invalid palette file path."));
		}

		return async.waterfall(
			[
				function(callback) {
					return fs.readFile(
						filePath,
						function(error, data) {
							if(error) {
								if(error.code === "ENOENT") {
									return callback(new Error("Palette file does not exist!"));
								}
								if(error.code === "EISDIR") {
									return callback(new Error("Palette file path is not a file!"));
								}
								else {
									return callback(new Error("Failed to read palette file with error code: " + error.code));
								}
							}

							return callback(null, data);
						}
					);
				},
				function(data, callback) {
					return Palette.determinePaletteType(
						data,
						function(error, paletteType, paletteFileType) {
							if(error) {
								return callback(error);
							}

							if(!Palette.Type.isPaletteType(paletteType)) {
								return callback(new Error("Unable to determine palette type."));
							}

							return callback(null, data, paletteType, paletteFileType);
						}
					);
				},
				function(data, paletteType, paletteFileType, callback) {
					return callback(null, new paletteType.paletteSubclass(data, paletteFileType, filePath));
				}
			],
			function(error, palette) {
				if(error) {
					return callback(error);
				}

				return callback(null, palette);
			}
		);
	}

	writeTo(filePath, callback) {
		let self = this;

		if(!utilities.isFunction(callback)) {
			throw new Error("Missing or invalid callback function!");
		}

		if(utilities.isEmptyString(filePath)) {
			return callback(new Error("Must specify file path to save to."));
		}

		if(!Buffer.isBuffer(self.data) || self.data.length === 0) {
			return callback(new Error("Palette does not contain any data to write to file."));
		}

		const outputDirectory = utilities.getFilePath(filePath);

		return async.waterfall(
			[
				function(callback) {
					if(utilities.isNonEmptyString(outputDirectory)) {
						fs.ensureDirSync(outputDirectory);
					}

					return fs.writeFile(
						filePath,
						self.data,
						function(error) {
							if(error) {
								return callback(error);
							}

							return callback();
						}
					);
				}
			],
			function(error) {
				if(error) {
					return callback(error);
				}

				return callback(null, filePath);
			}
		);
	}

	save() {
		let self = this;

		self.writeTo(self.filePath);
	}

	equals(value) {
		let self = this;

		if(!Palette.isPalette(value)) {
			return false;
		}

		if(self.data === null && value.data === null) {
			return true;
		}
		else if(self.data === null && value.data !== null) {
			return false;
		}
		else if(self.data !== null && value.data === null) {
			return false;
		}

		return self.data.equals(value.data);
	}

	toString() {
		let self = this;

		return self.paletteSubclass.name + (utilities.isNonEmptyString(self.filePath) ? " (" + utilities.getFileName(self.filePath) + ")" : "");
	}

	static isPalette(palette) {
		return palette instanceof Palette;
	}

	validateData() {
		let self = this;

		self.abstractFunction();
	}

	isValid() {
		let self = this;

		if(!Palette.FileType.isValid(self.fileType)) {
			return false;
		}

		let validFileType = false;

		for(let i = 0; i < self.fileTypes.length; i++) {
			if(self.fileTypes[i] === self.fileType) {
				validFileType = true;
				break;
			}
		}

		return validFileType &&
			   Buffer.isBuffer(self.data);
	}

	static isValid(palette) {
		return Palette.isPalette(palette) &&
			   palette.isValid();
	}
}

Object.defineProperty(Palette, "properties", {
	value: new PaletteProperties(),
	enumerable: false
});

Object.defineProperty(Palette, "StaticFunctions", {
	value: [
		"getFileTypeForData"
	],
	enumerable: true
});

Object.defineProperty(Palette, "AbstractFunctions", {
	value: [
		"createNewData",
		"getPaletteDescription",
		"getPixel",
		"updatePixel",
		"updateColourData",
		"fillWithColour",
		"validateData"
	],
	enumerable: true
});

Object.defineProperty(Palette, "Width", {
	value: 16,
	enumerable: true
});

Object.defineProperty(Palette, "Height", {
	value: 16,
	enumerable: true
});

Object.defineProperty(Palette, "NumberOfColours", {
	value: Palette.Width * Palette.Height, // 256
	enumerable: true
});

Object.defineProperty(Palette, "Colour", {
	value: Colour,
	enumerable: true
});

Object.defineProperty(Palette, "types", {
	enumerable: true,
	get() {
		return Palette.properties.types;
	}
});

module.exports = Palette;
