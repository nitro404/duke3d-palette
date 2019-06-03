"use strict";

const async = require("async");
const path = require("path-extra");
const fs = require("fs-extra");
const utilities = require("extra-utilities");
const ByteBuffer = require("bytebuffer");
const Colour = require("colour-rgba");
const Jimp = require("jimp");
const Palette = require("../index.js");
const PaletteIMG = Palette.IMG;
const chai = require("chai");
const expect = chai.expect;

describe("Duke3D", function() {
	describe("Palette", function() {
		describe("IMG", function() {
			it("should be a function", function() {
				expect(PaletteIMG).to.be.an.instanceof(Function);
			});

			it("should extend Palette", function() {
				expect(PaletteIMG.prototype).to.be.an.instanceof(Palette);
			});

			it("should have a Description string property with a value of Default", function() {
				expect(PaletteIMG.Description).to.be.a("string");
				expect(PaletteIMG.Description).to.equal("Default");
			});

			describe("static getFileTypeForMimeType", function() {
				it("should be a function", function() {
					expect(PaletteIMG.getFileTypeForMimeType).to.be.an.instanceof(Function);
				});

				// TODO
			});

			describe("createNewData", function() {
				it("should be a function", function() {
					expect(PaletteIMG.prototype.createNewData).to.be.an.instanceof(Function);
				});

				it("should be overridden", function() {
					expect(PaletteIMG.prototype.createNewData).to.not.equal(Palette.prototype.createNewData);
				});

				// TODO
			});

			describe("static createNewImage", function() {
				it("should be a function", function() {
					expect(PaletteIMG.createNewImage).to.be.an.instanceof(Function);
				});

				// TODO
			});

			describe("getPaletteDescription", function() {
				it("should be a function", function() {
					expect(PaletteIMG.prototype.getPaletteDescription).to.be.an.instanceof(Function);
				});

				it("should be overridden", function() {
					expect(PaletteIMG.prototype.getPaletteDescription).to.not.equal(Palette.prototype.getPaletteDescription);
				});

				it("should return the correct value for valid indexes", function() {
					expect(new PaletteIMG().getPaletteDescription(0)).to.equal("Default");
				});

				it("should return null for invalid indexes", function() {
					const palette = new PaletteIMG();
					const invalidIndexes = [null, -1, 1];

					expect(palette.getPaletteDescription()).to.equal(null);

					for(let i = 0; i < invalidIndexes.length; i++) {
						expect(palette.getPaletteDescription(invalidIndexes[i])).to.equal(null);
					}
				});
			});

			describe("getPixel", function() {
				it("should be a function", function() {
					expect(PaletteIMG.prototype.getPixel).to.be.an.instanceof(Function);
				});

				it("should be overridden", function() {
					expect(PaletteIMG.prototype.getPixel).to.not.equal(Palette.prototype.getPixel);
				});

// TODO: fails because data is null?
/*
				it("should return the correct value for a valid pixel", function() {
					const testPalette = new PaletteIMG();
					testPalette.updatePixel(4, 2, 255, 0, 0, 255, 0);

					expect(testPalette.getPixel(4, 2, 0).equals(Colour.Red)).to.equal(true);
				});

				it("should return null for any invalid arguments", function() {
					const invalidArguments = [NaN, Infinity, -Infinity, null, " ", -1, Palette.Width, Palette.Height];
					const testPalette = new PaletteIMG();

					for(let i = 0; i < invalidArguments.length; i++) {
						expect(testPalette.getPixel(invalidArguments[i], 1, 0)).to.equal(null);
						expect(testPalette.getPixel(2, invalidArguments[i], 0)).to.equal(null);
						expect(testPalette.getPixel(6, 9, invalidArguments[i])).to.equal(null);
					}

					expect(testPalette.getPixel(3, 4, 1)).to.equal(null);
				});
*/
			});

			describe("updatePixel", function() {
				it("should be a function", function() {
					expect(PaletteIMG.prototype.updatePixel).to.be.an.instanceof(Function);
				});

				it("should be overridden", function() {
					expect(PaletteIMG.prototype.updatePixel).to.not.equal(Palette.prototype.updatePixel);
				});

				// TODO
			});

			describe("updateColourData", function() {
				it("should be a function", function() {
					expect(PaletteIMG.prototype.updateColourData).to.be.an.instanceof(Function);
				});

				it("should be overridden", function() {
					expect(PaletteIMG.prototype.updateColourData).to.not.equal(Palette.prototype.updateColourData);
				});

				// TODO
			});

			describe("fillWithColour", function() {
				it("should be a function", function() {
					expect(PaletteIMG.prototype.fillWithColour).to.be.an.instanceof(Function);
				});

				it("should be overridden", function() {
					expect(PaletteIMG.prototype.fillWithColour).to.not.equal(Palette.prototype.fillWithColour);
				});

				// TODO
			});

			describe("static getFileTypeForData", function() {
				it("should be a function", function() {
					expect(PaletteIMG.getFileTypeForData).to.be.an.instanceof(Function);
				});

				// TODO
			});

			describe("writeTo", function() {
				it("should be a function", function() {
					expect(PaletteIMG.prototype.writeTo).to.be.an.instanceof(Function);
				});

				it("should be overridden", function() {
					expect(PaletteIMG.prototype.writeTo).to.not.equal(Palette.prototype.writeTo);
				});

				// TODO
			});

			describe("validateData", function() {
				it("should be a function", function() {
					expect(PaletteIMG.prototype.validateData).to.be.an.instanceof(Function);
				});

				it("should be overridden", function() {
					expect(PaletteIMG.prototype.validateData).to.not.equal(Palette.prototype.validateData);
				});

				// TODO
			});

			describe("onDataChanged", function() {
				it("should be a function", function() {
					expect(PaletteIMG.prototype.onDataChanged).to.be.an.instanceof(Function);
				});
			});

			describe("onImageChanged", function() {
				it("should be a function", function() {
					expect(PaletteIMG.prototype.onImageChanged).to.be.an.instanceof(Function);
				});
			});

			describe("onImageUpdated", function() {
				it("should be a function", function() {
					expect(PaletteIMG.prototype.onImageUpdated).to.be.an.instanceof(Function);
				});
			});

			describe("updateData", function() {
				it("should be a function", function() {
					expect(PaletteIMG.prototype.updateData).to.be.an.instanceof(Function);
				});
			});

			describe("updateImage", function() {
				it("should be a function", function() {
					expect(PaletteIMG.prototype.updateImage).to.be.an.instanceof(Function);
				});
			});

			describe("equals", function() {
				it("should be a function", function() {
					expect(PaletteIMG.prototype.equals).to.be.an.instanceof(Function);
				});

				it("should be overridden", function() {
					expect(PaletteIMG.prototype.equals).to.not.equal(Palette.prototype.equals);
				});

				// TODO
			});

			describe("static isPaletteIMG", function() {
				it("should be a function", function() {
					expect(PaletteIMG.isPaletteIMG).to.be.an.instanceof(Function);
				});

				// TODO
			});
		});
	});
});
