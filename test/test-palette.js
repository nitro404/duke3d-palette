"use strict";

const async = require("async");
const path = require("path-extra");
const fs = require("fs-extra");
const utilities = require("extra-utilities");
const ByteBuffer = require("bytebuffer");
const Colour = require("colour-rgba");
const Palette = require("../index.js");
const PaletteACT = require("../src/palette-act.js");
const PalettePAL = require("../src/palette-pal.js");
const PaletteDAT = require("../src/palette-dat.js");
const PaletteIMG = require("../src/palette-img.js");
const chai = require("chai");
const expect = chai.expect;

describe("Duke3D", function() {
	describe("Palette", function() {
		it("should be a function", function() {
			expect(Palette).to.be.an.instanceof(Function);
		});

		it("should have a function property named Colour", function() {
			expect(Palette.Colour).to.be.an.instanceof(Function);
			expect(Palette.Colour).to.equal(Colour);
		});

		it("should have a function property named ACT", function() {
			expect(Palette.ACT).to.be.an.instanceof(Function);
			expect(Palette.ACT).to.equal(PaletteACT);
		});

		it("should have a function property named DAT", function() {
			expect(Palette.DAT).to.be.an.instanceof(Function);
			expect(Palette.DAT).to.equal(PaletteDAT);
		});

		it("should have a function property named IMG", function() {
			expect(Palette.IMG).to.be.an.instanceof(Function);
			expect(Palette.IMG).to.equal(PaletteIMG);
		});

		it("should have a function property named PAL", function() {
			expect(Palette.PAL).to.be.an.instanceof(Function);
			expect(Palette.PAL).to.equal(PalettePAL);
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

		it("should have a types array property", function() {
			expect(Palette.types).to.be.an.instanceof(Array);
		});

		it("should not be instantiable and should throw an error if the constructor is invoked", function() {
			expect(function() { new Palette(); }).to.throw();
		});

		describe("getters / setters", function() {
			describe("paletteSubclass", function() {
				// TODO
			});

			describe("fileTypes", function() {
				// TODO
			});

			describe("fileType", function() {
				// TODO
			});

			describe("filePath", function() {
				// TODO
			});

			describe("data", function() {
				// TODO
			});
		});

		describe("static isExtendedBy", function() {
			it("should be a function", function() {
				expect(Palette.isExtendedBy).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("static numberOfPaletteTypes", function() {
			it("should be a function", function() {
				expect(Palette.numberOfPaletteTypes).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("static hasPaletteType", function() {
			it("should be a function", function() {
				expect(Palette.hasPaletteType).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("static indexOfPaletteType", function() {
			it("should be a function", function() {
				expect(Palette.indexOfPaletteType).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("static getPaletteType", function() {
			it("should be a function", function() {
				expect(Palette.getPaletteType).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("static addPaletteType", function() {
			it("should be a function", function() {
				expect(Palette.addPaletteType).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("static removePaletteType", function() {
			it("should be a function", function() {
				expect(Palette.removePaletteType).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("static clearPaletteTypes", function() {
			it("should be a function", function() {
				expect(Palette.clearPaletteTypes).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("createNewData", function() {
			it("should be a function", function() {
				expect(Palette.prototype.createNewData).to.be.an.instanceof(Function);
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

		describe("numberOfFileTypes", function() {
			it("should be a function", function() {
				expect(Palette.prototype.numberOfFileTypes).to.be.an.instanceof(Function);
			});

			// TODO
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

			// TODO
		});

		describe("getFileType", function() {
			it("should be a function", function() {
				expect(Palette.prototype.getFileType).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("addFileType", function() {
			it("should be a function", function() {
				expect(Palette.prototype.addFileType).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("removeFileType", function() {
			it("should be a function", function() {
				expect(Palette.prototype.removeFileType).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("clearFileTypes", function() {
			it("should be a function", function() {
				expect(Palette.prototype.clearFileTypes).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("numberOfSubPalettes", function() {
			it("should be a function", function() {
				expect(Palette.prototype.numberOfSubPalettes).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("getPaletteDescription", function() {
			it("should be a function", function() {
				expect(Palette.prototype.getPaletteDescription).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("getPaletteDescriptions", function() {
			it("should be a function", function() {
				expect(Palette.prototype.getPaletteDescriptions).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("getPaletteDescriptionsAsString", function() {
			it("should be a function", function() {
				expect(Palette.prototype.getPaletteDescriptionsAsString).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("getPixel", function() {
			it("should be a function", function() {
				expect(Palette.prototype.getPixel).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("lookupPixel", function() {
			it("should be a function", function() {
				expect(Palette.prototype.lookupPixel).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("updatePixel", function() {
			it("should be a function", function() {
				expect(Palette.prototype.updatePixel).to.be.an.instanceof(Function);
			});

			// TODO
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

			// TODO
		});

		describe("updateAllColourData", function() {
			it("should be a function", function() {
				expect(Palette.prototype.updateAllColourData).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("fillWithColour", function() {
			it("should be a function", function() {
				expect(Palette.prototype.fillWithColour).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("fillAllWithColour", function() {
			it("should be a function", function() {
				expect(Palette.prototype.fillAllWithColour).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("static determinePaletteType", function() {
			it("should be a function", function() {
				expect(Palette.determinePaletteType).to.be.an.instanceof(Function);
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

			
			// TODO
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
