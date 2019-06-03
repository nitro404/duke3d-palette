"use strict";

const async = require("async");
const path = require("path-extra");
const fs = require("fs-extra");
const utilities = require("extra-utilities");
const ByteBuffer = require("bytebuffer");
const Colour = require("colour-rgba");
const Palette = require("../index.js");
const PalettePAL = Palette.PAL;
const chai = require("chai");
const expect = chai.expect;

describe("Duke3D", function() {
	describe("Palette", function() {
		describe("PAL", function() {
			it("should be a function", function() {
				expect(PalettePAL).to.be.an.instanceof(Function);
			});

			it("should extend Palette", function() {
				expect(PalettePAL.prototype).to.be.an.instanceof(Palette);
			});

			it("should have a DefaultFileExtension string property with a value of PAL", function() {
				expect(PalettePAL.DefaultFileExtension).to.be.a("string");
				expect(PalettePAL.DefaultFileExtension).to.equal("PAL");
			});

			it("should have a BytesPerPixel integer property with a value of 4", function() {
				expect(PalettePAL.BytesPerPixel).to.be.a("number");
				expect(PalettePAL.BytesPerPixel).to.equal(4);
			});

			it("should have a HeaderRIFFText string property with a value of RIFF", function() {
				expect(PalettePAL.HeaderRIFFText).to.be.a("string");
				expect(PalettePAL.HeaderRIFFText).to.equal("RIFF");
			});

			it("should have a HeaderSignatureLength integer property with a value of 4", function() {
				expect(PalettePAL.HeaderSignatureLength).to.be.a("number");
				expect(PalettePAL.HeaderSignatureLength).to.equal(4);
			});

			it("should have a HeaderDataText string property with a value of data", function() {
				expect(PalettePAL.HeaderDataText).to.be.a("string");
				expect(PalettePAL.HeaderDataText).to.equal("data");
			});

// TODO: wrong?:
			/*it("should have a PalettePALVersion integer property with a value of 768", function() {
				expect(PalettePAL.PalettePALVersion).to.be.a("number");
				expect(PalettePAL.PalettePALVersion).to.equal(768);
			});*/

			it("should have a PaletteRIFFOffset integer property with a value of 0", function() {
				expect(PalettePAL.PaletteRIFFOffset).to.be.a("number");
				expect(PalettePAL.PaletteRIFFOffset).to.equal(0);
			});

			it("should have a PalettePALTextOffset integer property with a value of 8", function() {
				expect(PalettePAL.PalettePALTextOffset).to.be.a("number");
				expect(PalettePAL.PalettePALTextOffset).to.equal(8);
			});

			it("should have a PaletteDataTextOffset integer property with a value of 12", function() {
				expect(PalettePAL.PaletteDataTextOffset).to.be.a("number");
				expect(PalettePAL.PaletteDataTextOffset).to.equal(12);
			});

			it("should have a PaletteVersionOffset integer property with a value of 20", function() {
				expect(PalettePAL.PaletteVersionOffset).to.be.a("number");
				expect(PalettePAL.PaletteVersionOffset).to.equal(20);
			});

			it("should have a PaletteNumberOfColoursOffset integer property with a value of 22", function() {
				expect(PalettePAL.PaletteNumberOfColoursOffset).to.be.a("number");
				expect(PalettePAL.PaletteNumberOfColoursOffset).to.equal(22);
			});

			it("should have a PaletteColourOffset integer property with a value of 24", function() {
				expect(PalettePAL.PaletteColourOffset).to.be.a("number");
				expect(PalettePAL.PaletteColourOffset).to.equal(24);
			});

			it("should have a HeaderSize integer property with a value of 24", function() {
				expect(PalettePAL.HeaderSize).to.be.a("number");
				expect(PalettePAL.HeaderSize).to.equal(24);
			});

			it("should have a BLANK_HEADER_DATA buffer property with a hex string value of 524946461040050414C206461746144000301", function() {
				expect(PalettePAL.BlankHeaderData).to.be.an.instanceof(Buffer);
				expect(PalettePAL.BlankHeaderData).to.deep.equal(Buffer.from("524946461040050414C206461746144000301", "hex"));
			});

			it("should have a PaletteSizeRGB integer property with a value of 768", function() {
				expect(PalettePAL.PaletteSizeRGB).to.be.a("number");
				expect(PalettePAL.PaletteSizeRGB).to.equal(768);
			});

			it("should have a PaletteSizeRGBA integer property with a value of 1024", function() {
				expect(PalettePAL.PaletteSizeRGBA).to.be.a("number");
				expect(PalettePAL.PaletteSizeRGBA).to.equal(1024);
			});

			it("should have a FileSizeRGB integer property with a value of 792", function() {
				expect(PalettePAL.FileSizeRGB).to.be.a("number");
				expect(PalettePAL.FileSizeRGB).to.equal(792);
			});

			it("should have a FileSizeRGBA integer property with a value of 1048", function() {
				expect(PalettePAL.FileSizeRGBA).to.be.a("number");
				expect(PalettePAL.FileSizeRGBA).to.equal(1048);
			});

			it("should have a FileType string property with a value of PAL", function() {
				expect(PalettePAL.FileType).to.be.a("string");
				expect(PalettePAL.FileType).to.equal("PAL");
			});

			it("should have a Description string property with a value of Default", function() {
				expect(PalettePAL.Description).to.be.a("string");
				expect(PalettePAL.Description).to.equal("Default");
			});

			describe("createNewData", function() {
				it("should be a function", function() {
					expect(PalettePAL.prototype.createNewData).to.be.an.instanceof(Function);
				});

				it("should be overridden", function() {
					expect(PalettePAL.prototype.createNewData).to.not.equal(Palette.prototype.createNewData);
				});

				// TODO
			});

			describe("getPaletteDescription", function() {
				it("should be a function", function() {
					expect(PalettePAL.prototype.getPaletteDescription).to.be.an.instanceof(Function);
				});

				it("should be overridden", function() {
					expect(PalettePAL.prototype.getPaletteDescription).to.not.equal(Palette.prototype.getPaletteDescription);
				});

// TODO: cannot allocate?

				/*it("should return the correct value for valid indexes", function() {
					expect(new PalettePAL().getPaletteDescription(0)).to.equal("Default");
				});

				it("should return null for invalid indexes", function() {
					const palette = new PalettePAL();
					const invalidIndexes = [null, -1, 1];

					expect(palette.getPaletteDescription()).to.equal(null);

					for(let i = 0; i < invalidIndexes.length; i++) {
						expect(palette.getPaletteDescription(invalidIndexes[i])).to.equal(null);
					}
				});*/
			});

			describe("getPixel", function() {
				it("should be a function", function() {
					expect(PalettePAL.prototype.getPixel).to.be.an.instanceof(Function);
				});

				it("should be overridden", function() {
					expect(PalettePAL.prototype.getPixel).to.not.equal(Palette.prototype.getPixel);
				});

				// TODO
			});

			describe("updatePixel", function() {
				it("should be a function", function() {
					expect(PalettePAL.prototype.updatePixel).to.be.an.instanceof(Function);
				});

				it("should be overridden", function() {
					expect(PalettePAL.prototype.updatePixel).to.not.equal(Palette.prototype.updatePixel);
				});

				// TODO
			});

			describe("updateColourData", function() {
				it("should be a function", function() {
					expect(PalettePAL.prototype.updateColourData).to.be.an.instanceof(Function);
				});

				it("should be overridden", function() {
					expect(PalettePAL.prototype.updateColourData).to.not.equal(Palette.prototype.updateColourData);
				});

				// TODO
			});

			describe("fillWithColour", function() {
				it("should be a function", function() {
					expect(PalettePAL.prototype.fillWithColour).to.be.an.instanceof(Function);
				});

				it("should be overridden", function() {
					expect(PalettePAL.prototype.fillWithColour).to.not.equal(Palette.prototype.fillWithColour);
				});

				// TODO
			});

			describe("static getFileTypeForData", function() {
				it("should be a function", function() {
					expect(PalettePAL.getFileTypeForData).to.be.an.instanceof(Function);
				});

				// TODO
			});

			describe("validateData", function() {
				it("should be a function", function() {
					expect(PalettePAL.prototype.validateData).to.be.an.instanceof(Function);
				});

				// TODO
			});

			describe("static isPalettePAL", function() {
				it("should be a function", function() {
					expect(PalettePAL.isPalettePAL).to.be.an.instanceof(Function);
				});

				// TODO
			});
		});
	});
});
