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

// TODO: check super

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

			describe("numberOfFileTypes", function() {
				it("should be a function", function() {
					expect(PaletteDAT.prototype.numberOfFileTypes).to.be.an.instanceof(Function);
				});

				// TODO
			});

			describe("getFileType", function() {
				it("should be a function", function() {
					expect(PaletteDAT.prototype.getFileType).to.be.an.instanceof(Function);
				});

				// TODO
			});

			describe("indexOfFileType", function() {
				it("should be a function", function() {
					expect(PaletteDAT.prototype.indexOfFileType).to.be.an.instanceof(Function);
				});

				// TODO
			});

			describe("getPaletteDescription", function() {
				it("should be a function", function() {
					expect(PaletteDAT.prototype.getPaletteDescription).to.be.an.instanceof(Function);
				});

				// TODO
			});

			describe("getPixel", function() {
				it("should be a function", function() {
					expect(PaletteDAT.prototype.getPixel).to.be.an.instanceof(Function);
				});

				// TODO
			});

			describe("updatePixel", function() {
				it("should be a function", function() {
					expect(PaletteDAT.prototype.updatePixel).to.be.an.instanceof(Function);
				});

				// TODO
			});

			describe("updateColourData", function() {
				it("should be a function", function() {
					expect(PaletteDAT.prototype.updateColourData).to.be.an.instanceof(Function);
				});

				// TODO
			});

			describe("fillWithColour", function() {
				it("should be a function", function() {
					expect(PaletteDAT.prototype.fillWithColour).to.be.an.instanceof(Function);
				});

				// TODO
			});

			describe("validateData", function() {
				it("should be a function", function() {
					expect(PaletteDAT.prototype.validateData).to.be.an.instanceof(Function);
				});

				// TODO
			});
		});
	});
});
