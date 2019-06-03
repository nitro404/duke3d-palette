"use strict";

const async = require("async");
const path = require("path-extra");
const fs = require("fs-extra");
const utilities = require("extra-utilities");
const ByteBuffer = require("bytebuffer");
const Colour = require("colour-rgba");
const Palette = require("../index.js");
const PaletteDAT = Palette.DAT;
const chai = require("chai");
const expect = chai.expect;

describe("Duke3D", function() {
	describe("Palette", function() {
		describe("DAT", function() {
			it("should be a function", function() {
				expect(PaletteDAT).to.be.an.instanceof(Function);
			});

			it("should extend Palette", function() {
				expect(PaletteDAT.prototype).to.be.an.instanceof(Palette);
			});

			it("should have a DefaultFileExtension string property with a value of DAT", function() {
				expect(PaletteDAT.DefaultFileExtension).to.be.a("string");
				expect(PaletteDAT.DefaultFileExtension).to.equal("DAT");
			});

			it("should have a BytesPerPixel integer property with a value of 3", function() {
				expect(PaletteDAT.BytesPerPixel).to.be.a("number");
				expect(PaletteDAT.BytesPerPixel).to.equal(3);
			});

			it("should have a ColourScale integer property with a value of 4", function() {
				expect(PaletteDAT.ColourScale).to.be.a("number");
				expect(PaletteDAT.ColourScale).to.equal(4);
			});

			it("should have a PaletteSizeRGB integer property with a value of 768", function() {
				expect(PaletteDAT.PaletteSizeRGB).to.be.a("number");
				expect(PaletteDAT.PaletteSizeRGB).to.equal(768);
			});

			it("should have a FileType string property with a value of DAT", function() {
				expect(PaletteDAT.FileType).to.be.a("string");
				expect(PaletteDAT.FileType).to.equal("DAT");
			});

			describe("createNewData", function() {
				it("should be a function", function() {
					expect(PaletteDAT.prototype.createNewData).to.be.an.instanceof(Function);
				});

				it("should be overridden", function() {
					expect(PaletteDAT.prototype.createNewData).to.not.equal(Palette.prototype.createNewData);
				});

				// TODO
			});

			describe("numberOfSubPalettes", function() {
				it("should be a function", function() {
					expect(PaletteDAT.prototype.numberOfSubPalettes).to.be.an.instanceof(Function);
				});

				it("should be overridden", function() {
					expect(PaletteDAT.prototype.numberOfSubPalettes).to.not.equal(Palette.prototype.numberOfSubPalettes);
				});

				// TODO
			});

			describe("getPaletteDescription", function() {
				it("should be a function", function() {
					expect(PaletteDAT.prototype.getPaletteDescription).to.be.an.instanceof(Function);
				});

				it("should be overridden", function() {
					expect(PaletteDAT.prototype.getPaletteDescription).to.not.equal(Palette.prototype.getPaletteDescription);
				});

// TODO: cannot allocate

/*
				it("should return the correct value for valid indexes", function() {
					expect(new PaletteDAT().getPaletteDescription(0)).to.equal("Default");
				});

				it("should return null for invalid indexes", function() {
					const palette = new PaletteDAT();
					const invalidIndexes = [null, -1, 1];

					expect(palette.getPaletteDescription()).to.equal(null);

					for(let i = 0; i < invalidIndexes.length; i++) {
						expect(palette.getPaletteDescription(invalidIndexes[i])).to.equal(null);
					}
				});
*/
			});

			describe("getPixel", function() {
				it("should be a function", function() {
					expect(PaletteDAT.prototype.getPixel).to.be.an.instanceof(Function);
				});

				it("should be overridden", function() {
					expect(PaletteDAT.prototype.getPixel).to.not.equal(Palette.prototype.getPixel);
				});

				// TODO
			});

			describe("updatePixel", function() {
				it("should be a function", function() {
					expect(PaletteDAT.prototype.updatePixel).to.be.an.instanceof(Function);
				});

				it("should be overridden", function() {
					expect(PaletteDAT.prototype.updatePixel).to.not.equal(Palette.prototype.updatePixel);
				});

				// TODO
			});

			describe("updateColourData", function() {
				it("should be a function", function() {
					expect(PaletteDAT.prototype.updateColourData).to.be.an.instanceof(Function);
				});

				it("should be overridden", function() {
					expect(PaletteDAT.prototype.updateColourData).to.not.equal(Palette.prototype.updateColourData);
				});

				// TODO
			});

			describe("fillWithColour", function() {
				it("should be a function", function() {
					expect(PaletteDAT.prototype.fillWithColour).to.be.an.instanceof(Function);
				});

				it("should be overridden", function() {
					expect(PaletteDAT.prototype.fillWithColour).to.not.equal(Palette.prototype.fillWithColour);
				});

				// TODO
			});

			describe("static getFileTypeForData", function() {
				it("should be a function", function() {
					expect(PaletteDAT.getFileTypeForData).to.be.an.instanceof(Function);
				});

				// TODO
			});

			describe("validateData", function() {
				it("should be a function", function() {
					expect(PaletteDAT.prototype.validateData).to.be.an.instanceof(Function);
				});

				it("should be overridden", function() {
					expect(PaletteDAT.prototype.validateData).to.not.equal(Palette.prototype.validateData);
				});

				// TODO
			});

			describe("static isPaletteDAT", function() {
				it("should be a function", function() {
					expect(PaletteDAT.isPaletteDAT).to.be.an.instanceof(Function);
				});

				// TODO
			});
		});
	});
});
