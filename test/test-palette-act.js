"use strict";

const async = require("async");
const path = require("path-extra");
const fs = require("fs-extra");
const utilities = require("extra-utilities");
const ByteBuffer = require("bytebuffer");
const Colour = require("colour-rgba");
const Palette = require("../index.js");
const PaletteACT = Palette.ACT;
const chai = require("chai");
const expect = chai.expect;

describe("Duke3D", function() {
	describe("Palette", function() {
		describe("ACT", function() {
			it("should be a function", function() {
				expect(PaletteACT).to.be.an.instanceof(Function);
			});

			it("should extend Palette", function() {
				expect(PaletteACT.prototype).to.be.an.instanceof(Palette);
			});

			it("should have a DefaultFileExtension string property with a value of ACT", function() {
				expect(PaletteACT.DefaultFileExtension).to.be.a("string");
				expect(PaletteACT.DefaultFileExtension).to.equal("ACT");
			});

			it("should have a BytesPerPixel integer property with a value of 3", function() {
				expect(PaletteACT.BytesPerPixel).to.be.a("number");
				expect(PaletteACT.BytesPerPixel).to.equal(3);
			});

			it("should have a PaletteSizeRGB integer property with a value of 768", function() {
				expect(PaletteACT.PaletteSizeRGB).to.be.a("number");
				expect(PaletteACT.PaletteSizeRGB).to.equal(768);
			});

			it("should have a FileType string property with a value of ACT", function() {
				expect(PaletteACT.FileType).to.be.a("string");
				expect(PaletteACT.FileType).to.equal("ACT");
			});

			it("should have a Description string property with a value of Default", function() {
				expect(PaletteACT.Description).to.be.a("string");
				expect(PaletteACT.Description).to.equal("Default");
			});

			describe("createNewData", function() {
				it("should be a function", function() {
					expect(PaletteACT.prototype.createNewData).to.be.an.instanceof(Function);
				});

				it("should be overridden", function() {
					expect(PaletteACT.prototype.createNewData).to.not.equal(Palette.prototype.createNewData);
				});

				it("should allocate an empty black palette data buffer with a length of 768 bytes", function() {
					const newData = new PaletteACT().createNewData();

					expect(newData).to.be.an.instanceof(Buffer);
					expect(newData.length).to.equal(768);

					for(let i = 0; i < newData.length; i++) {
						expect(newData[i]).to.equal(0);
					}
				});
			});

			describe("getPaletteDescription", function() {
				it("should be a function", function() {
					expect(PaletteACT.prototype.getPaletteDescription).to.be.an.instanceof(Function);
				});

				it("should be overridden", function() {
					expect(PaletteACT.prototype.getPaletteDescription).to.not.equal(Palette.prototype.getPaletteDescription);
				});

				it("should return the correct value for valid indexes", function() {
					expect(new PaletteACT().getPaletteDescription(0)).to.equal("Default");
				});

				it("should return null for invalid indexes", function() {
					const testPalette = new PaletteACT();
					const invalidIndexes = [null, -1, 1];

					expect(testPalette.getPaletteDescription()).to.equal(null);

					for(let i = 0; i < invalidIndexes.length; i++) {
						expect(testPalette.getPaletteDescription(invalidIndexes[i])).to.equal(null);
					}
				});
			});

			describe("getPixel", function() {
				it("should be a function", function() {
					expect(PaletteACT.prototype.getPixel).to.be.an.instanceof(Function);
				});

				it("should be overridden", function() {
					expect(PaletteACT.prototype.getPixel).to.not.equal(Palette.prototype.getPixel);
				});

				it("should return the correct value for a valid pixel at a specified location", function() {
					const testPalette = new PaletteACT();
					testPalette.updatePixel(4, 2, 255, 0, 0, 255, 0);

					expect(testPalette.getPixel(4, 2, 0).equals(Colour.Red)).to.equal(true);
				});

				it("should return null for any invalid arguments", function() {
					const invalidArguments = [NaN, Infinity, -Infinity, null, " ", -1, Palette.Width, Palette.Height];
					const testPalette = new PaletteACT();

					for(let i = 0; i < invalidArguments.length; i++) {
						expect(testPalette.getPixel(invalidArguments[i], 1, 0)).to.equal(null);
						expect(testPalette.getPixel(2, invalidArguments[i], 0)).to.equal(null);
						expect(testPalette.getPixel(6, 9, invalidArguments[i])).to.equal(null);
					}

					expect(testPalette.getPixel(3, 4, 1)).to.equal(null);
				});
			});

			describe("updatePixel", function() {
				it("should be a function", function() {
					expect(PaletteACT.prototype.updatePixel).to.be.an.instanceof(Function);
				});

				it("should be overridden", function() {
					expect(PaletteACT.prototype.updatePixel).to.not.equal(Palette.prototype.updatePixel);
				});

				it("should correctly update pixels with new colour values at a specified location", function() {
					const testPalette = new PaletteACT();

					expect(testPalette.updatePixel(9, 9, 0, 0, 255, 255, 0)).to.equal(true);
					expect(testPalette.getPixel(9, 9, 0).equals(Colour.Blue)).to.equal(true);
				});

				it("should correctly update pixels with a new colour object at a specified location", function() {
					const testPalette = new PaletteACT();

					expect(testPalette.updatePixel(8, 8, Colour.Yellow, 0)).to.equal(true);
					expect(testPalette.getPixel(8, 8, 0).equals(Colour.Yellow)).to.equal(true);
				});

				it("should return false for any invalid arguments", function() {
					const invalidArguments = [NaN, Infinity, -Infinity, null, " ", -1, Palette.Width, Palette.Height];
					const testPalette = new PaletteACT();

					for(let i = 0; i < invalidArguments.length; i++) {
						expect(testPalette.updatePixel(invalidArguments[i], 0, 0)).to.equal(false);
						expect(testPalette.updatePixel(0, invalidArguments[i], 0)).to.equal(false);
						expect(testPalette.updatePixel(0, 0, 0, 0, 0, 0, invalidArguments[i])).to.equal(false);
					}

					expect(testPalette.updatePixel(0, 0, 0, 0, 0, 0, 1)).to.equal(false);
				});
			});

			describe("updateColourData", function() {
				it("should be a function", function() {
					expect(PaletteACT.prototype.updateColourData).to.be.an.instanceof(Function);
				});

				it("should be overridden", function() {
					expect(PaletteACT.prototype.updateColourData).to.not.equal(Palette.prototype.updateColourData);
				});

				it("should return false for any invalid arguments", function() {
					const invalidArguments = [NaN, Infinity, -Infinity, null, " ", -1];
					const testPalette = new PaletteACT();

					for(let i = 0; i < invalidArguments.length; i++) {
						expect(testPalette.updateColourData(invalidArguments[i], 0, [])).to.equal(false);
						expect(testPalette.updateColourData(0, invalidArguments[i], [])).to.equal(false);
					}

					expect(testPalette.updateColourData(1, 0, [])).to.equal(false);
					expect(testPalette.updateColourData(0, 0, [Colour.Transparent])).to.equal(false);
				});

				// TODO
			});

			describe("fillWithColour", function() {
				it("should be a function", function() {
					expect(PaletteACT.prototype.fillWithColour).to.be.an.instanceof(Function);
				});

				it("should be overridden", function() {
					expect(PaletteACT.prototype.fillWithColour).to.not.equal(Palette.prototype.fillWithColour);
				});

				it("should return false for any invalid arguments", function() {
					const invalidArguments = [NaN, Infinity, -Infinity, null, " ", -1];
					const testPalette = new PaletteACT();

					for(let i = 0; i < invalidArguments.length; i++) {
						expect(testPalette.fillWithColour(0, 0, 0, 0, invalidArguments[i])).to.equal(false);
						expect(testPalette.fillWithColour(Colour.Pink, invalidArguments[i])).to.equal(false);
					}

					expect(testPalette.fillWithColour(255, 255, 255, 255, 1)).to.equal(false);
					expect(testPalette.fillWithColour(Colour.Teal, 1)).to.equal(false);
				});

				// TODO
			});

			describe("static getFileTypeForData", function() {
				it("should be a function", function() {
					expect(PaletteACT.getFileTypeForData).to.be.an.instanceof(Function);
				});

				it("should return the default ACT file type for valid ACT data buffers", function(callback) {
					PaletteACT.getFileTypeForData(Buffer.alloc(768), function(error, fileType) {
						expect(error).to.equal(null);
						expect(fileType).to.equal(PaletteACT.Default);

						return callback();
					});
				});

				it("should return null for non-buffer data arguments", function(callback) {
					PaletteACT.getFileTypeForData([], function(error, fileType) {
						expect(error).to.equal(null);
						expect(fileType).to.equal(null);

						return callback();
					});
				});

				it("should return null for data buffers with invalid lengths", function(callback) {
					return async.waterfall(
						[
							function(callback) {
								PaletteACT.getFileTypeForData(Buffer.alloc(767), function(error, fileType) {
									expect(error).to.equal(null);
									expect(fileType).to.equal(null);

									return callback();
								});
							},
							function(callback) {
								PaletteACT.getFileTypeForData(Buffer.alloc(769), function(error, fileType) {
									expect(error).to.equal(null);
									expect(fileType).to.equal(null);

									return callback();
								});
							}
						],
						function(error) {
							expect(error).to.be.undefined;

							return callback();
						}
					);
				});

				it("should throw an error when no callback function is provided", function() {
					expect(function() { PaletteACT.getFileTypeForData(); }).to.throw();
				});

				// TODO
			});

			describe("validateData", function() {
				it("should be a function", function() {
					expect(PaletteACT.prototype.validateData).to.be.an.instanceof(Function);
				});

				it("should be overridden", function() {
					expect(PaletteACT.prototype.validateData).to.not.equal(Palette.prototype.validateData);
				});

				it("should return true for ACT palettes created from data buffers with valid lengths", function() {
					expect(function() { new PaletteACT(Buffer.alloc(768)).validateData(); }).to.not.throw();
				});

				it("should return false for ACT palettes created from data buffers with invalid lengths", function() {
					expect(function() { new PaletteACT(Buffer.alloc(767)).validateData(); }).to.throw();
					expect(function() { new PaletteACT(Buffer.alloc(769)).validateData(); }).to.throw();
				});
			});

			describe("static isPaletteACT", function() {
				it("should be a function", function() {
					expect(PaletteACT.isPaletteACT).to.be.an.instanceof(Function);
				});

				it("should return true for instances of ACT palettes", function() {
					expect(PaletteACT.isPaletteACT(new PaletteACT())).to.equal(true);
				});

				it("should return false for non-ACT palettes and invalid values", function() {
					expect(PaletteACT.isPaletteACT(null)).to.equal(false);
					expect(PaletteACT.isPaletteACT(new Palette.IMG())).to.equal(false);
				});
			});
		});
	});
});
