"use strict";

const async = require("async");
const path = require("path-extra");
const fs = require("fs-extra");
const utilities = require("extra-utilities");
const ByteBuffer = require("bytebuffer");
const Palette = require("../index.js");
const chai = require("chai");
const expect = chai.expect;

class PaletteA extends Palette {
	constructor(data, filePath) {
		super(data, filePath);
	}

	createNewData() { }
	numberOfFileTypes() { }
	getFileType() { }
	indexOfFileType() { }
	getPaletteDescription() { }
	getPixel() { }
	updatePixel() { }
	updateColourData() { }
	fillWithColor() { }
	validateData() { }
}

class PaletteB extends Palette {
	constructor(data, filePath) {
		super(data, filePath);
	}

// TODO: abstract stuff is now different
}

const originalValidateDataFunction = PaletteB.prototype.validateData;
PaletteB.prototype.validateData = function validateData() { };

const originalCreateNewDataFunction = PaletteB.prototype.createNewData;
PaletteB.prototype.createNewData = function createNewData() { };

let testPaletteA = null;
//let testPaletteB = null;

describe("Duke3D", function() {
	describe("Palette", function() {
		before(function() {
			testPaletteA = new PaletteA();
//			testPaletteB = new PaletteB();
		});

		it("should be a function", function() {
			expect(Palette).to.be.an.instanceof(Function);
		});

		it("should have a function property named Colour", function() {
			expect(Palette.Colour).to.be.an.instanceof(Function);
		});

		it("should have a function property named ACT", function() {
			expect(Palette.ACT).to.be.an.instanceof(Function);
		});

		it("should have a function property named DAT", function() {
			expect(Palette.DAT).to.be.an.instanceof(Function);
		});

		it("should have a function property named IMG", function() {
			expect(Palette.IMG).to.be.an.instanceof(Function);
		});

		it("should have a function property named PAL", function() {
			expect(Palette.PAL).to.be.an.instanceof(Function);
		});

		it("should have a Width integer property with a value of 16", function() {
			expect(Palette.Width).to.be.a("number");
			expect(Palette.Width).to.equal(16);
		});

		it("should have a Height integer property with a value of 16", function() {
			expect(Palette.Height).to.be.a("number");
			expect(Palette.Height).to.equal(16);
		});

		it("should have a NumberOfColours integer property with a value of 256", function() {
			expect(Palette.NumberOfColours).to.be.a("number");
			expect(Palette.NumberOfColours).to.equal(256);
		});

		it("should not be instantiable and should throw an error if the constructor is invoked", function() {
			expect(function() { new Palette(); }).to.throw();
		});

		describe("setters", function() {
			describe("filePath", function() {
				// TODO
			});

			describe("data", function() {
				// TODO
			});
		});

		describe("createNewData", function() {
			it("should be a function", function() {
				expect(Palette.prototype.createNewData).to.be.an.instanceof(Function);
			});

			it("is abstract and should throw an error when unimplemented in a subclass", function() {
				PaletteB.prototype.validateData = originalCreateNewDataFunction;

				expect(function() { testPaletteB.validateData(); }).to.throw();
			});
		});

		describe("getFilePath", function() {
			it("should be a function", function() {
				expect(Palette.prototype.getFilePath).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("getFileName", function() {
			it("should be a function", function() {
				expect(Palette.prototype.getFileName).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("getExtension", function() {
			it("should be a function", function() {
				expect(Palette.prototype.getExtension).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("setFilePath", function() {
			it("should be a function", function() {
				expect(Palette.prototype.setFilePath).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("getData", function() {
			it("should be a function", function() {
				expect(Palette.prototype.getData).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("getDataSize", function() {
			it("should be a function", function() {
				expect(Palette.prototype.getDataSize).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("setData", function() {
			it("should be a function", function() {
				expect(Palette.prototype.setData).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("clearData", function() {
			it("should be a function", function() {
				expect(Palette.prototype.clearData).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("getType", function() {
			it("should be a function", function() {
				expect(Palette.prototype.getType).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("numberOfFileTypes", function() {
			it("should be a function", function() {
				expect(Palette.prototype.numberOfFileTypes).to.be.an.instanceof(Function);
			});

			it("is abstract and should throw an error when unimplemented in a subclass", function() {
				expect(function() { testPaletteA.numberOfFileTypes(); }).to.throw();
			});
		});

		describe("getFileType", function() {
			it("should be a function", function() {
				expect(Palette.prototype.getFileType).to.be.an.instanceof(Function);
			});

			it("is abstract and should throw an error when unimplemented in a subclass", function() {
				expect(function() { testPaletteA.getFileType(); }).to.throw();
			});
		});

		describe("hasFileType", function() {
			it("should be a function", function() {
				expect(Palette.prototype.hasFileType).to.be.an.instanceof(Function);
			});

			// TODO: actually needs testing elsewhere
		});

		describe("indexOfFileType", function() {
			it("should be a function", function() {
				expect(Palette.prototype.indexOfFileType).to.be.an.instanceof(Function);
			});

			it("is abstract and should throw an error when unimplemented in a subclass", function() {
				expect(function() { testPaletteA.getFileType(); }).to.throw();
			});
		});

		describe("getDefaultFileType", function() {
			it("should be a function", function() {
				expect(Palette.prototype.getDefaultFileType).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("numberOfPalettes", function() {
			it("should be a function", function() {
				expect(Palette.prototype.numberOfPalettes).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("getPaletteDescription", function() {
			it("should be a function", function() {
				expect(Palette.prototype.getPaletteDescription).to.be.an.instanceof(Function);
			});

			it("is abstract and should throw an error when unimplemented in a subclass", function() {
				expect(function() { testPaletteA.getPaletteDescription(); }).to.throw();
			});
		});

		describe("getPaletteDescriptionsAsString", function() {
			it("should be a function", function() {
				expect(Palette.prototype.getPaletteDescriptionsAsString).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("getPaletteDescriptions", function() {
			it("should be a function", function() {
				expect(Palette.prototype.getPaletteDescriptions).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("getPixel", function() {
			it("should be a function", function() {
				expect(Palette.prototype.getPixel).to.be.an.instanceof(Function);
			});

			it("is abstract and should throw an error when unimplemented in a subclass", function() {
				expect(function() { testPaletteA.getPixel(); }).to.throw();
			});
		});

		describe("updatePixel", function() {
			it("should be a function", function() {
				expect(Palette.prototype.updatePixel).to.be.an.instanceof(Function);
			});

			it("is abstract and should throw an error when unimplemented in a subclass", function() {
				expect(function() { testPaletteA.updatePixel(); }).to.throw();
			});
		});

		describe("getColourData", function() {
			it("should be a function", function() {
				expect(Palette.prototype.getColourData).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("getAllColourData", function() {
			it("should be a function", function() {
				expect(Palette.prototype.getAllColourData).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("updateColourData", function() {
			it("should be a function", function() {
				expect(Palette.prototype.updateColourData).to.be.an.instanceof(Function);
			});

			it("is abstract and should throw an error when unimplemented in a subclass", function() {
				expect(function() { testPaletteA.updateColourData(); }).to.throw();
			});
		});

		describe("updateAllColourData", function() {
			it("should be a function", function() {
				expect(Palette.prototype.updateAllColourData).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("fillWithColor", function() {
			it("should be a function", function() {
				expect(Palette.prototype.fillWithColor).to.be.an.instanceof(Function);
			});

			it("is abstract and should throw an error when unimplemented in a subclass", function() {
				expect(function() { testPaletteA.fillWithColor(); }).to.throw();
			});
		});

		describe("fillAllWithColour", function() {
			it("should be a function", function() {
				expect(Palette.prototype.fillAllWithColour).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("static readFrom", function() {
			it("should be a function", function() {
				expect(Palette.readFrom).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("writeTo", function() {
			it("should be a function", function() {
				expect(Palette.prototype.writeTo).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("save", function() {
			it("should be a function", function() {
				expect(Palette.prototype.save).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("equals", function() {
			it("should be a function", function() {
				expect(Palette.prototype.equals).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("toString", function() {
			it("should be a function", function() {
				expect(Palette.prototype.toString).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("static isPalette", function() {
			it("should be a function", function() {
				expect(Palette.isPalette).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("validateData", function() {
			it("should be a function", function() {
				expect(Palette.prototype.validateData).to.be.an.instanceof(Function);
			});

			it("is abstract and should throw an error when unimplemented in a subclass", function() {
				PaletteB.prototype.validateData = originalValidateDataFunction;

				expect(function() { testPaletteB.validateData(); }).to.throw();
			});
		});

		describe("isValid", function() {
			it("should be a function", function() {
				expect(Palette.prototype.isValid).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("static isValid", function() {
			it("should be a function", function() {
				expect(Palette.isValid).to.be.an.instanceof(Function);
			});

			// TODO
		});
	});
});
