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

// TODO: check super

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

			describe("numberOfFileTypes", function() {
				it("should be a function", function() {
					expect(PaletteACT.prototype.numberOfFileTypes).to.be.an.instanceof(Function);
				});

				// TODO
			});

			describe("getFileType", function() {
				it("should be a function", function() {
					expect(PaletteACT.prototype.getFileType).to.be.an.instanceof(Function);
				});

				// TODO
			});

			describe("indexOfFileType", function() {
				it("should be a function", function() {
					expect(PaletteACT.prototype.indexOfFileType).to.be.an.instanceof(Function);
				});

				// TODO
			});

			describe("getPaletteDescription", function() {
				it("should be a function", function() {
					expect(PaletteACT.prototype.getPaletteDescription).to.be.an.instanceof(Function);
				});

				// TODO
			});

			describe("getPixel", function() {
				it("should be a function", function() {
					expect(PaletteACT.prototype.getPixel).to.be.an.instanceof(Function);
				});

				// TODO
			});

			describe("updatePixel", function() {
				it("should be a function", function() {
					expect(PaletteACT.prototype.updatePixel).to.be.an.instanceof(Function);
				});

				// TODO
			});

			describe("updateColourData", function() {
				it("should be a function", function() {
					expect(PaletteACT.prototype.updateColourData).to.be.an.instanceof(Function);
				});

				// TODO
			});

			describe("fillWithColor", function() {
				it("should be a function", function() {
					expect(PaletteACT.prototype.fillWithColor).to.be.an.instanceof(Function);
				});

				// TODO
			});

			describe("validateData", function() {
				it("should be a function", function() {
					expect(PaletteACT.prototype.validateData).to.be.an.instanceof(Function);
				});

				// TODO
			});
		});
	});
});
