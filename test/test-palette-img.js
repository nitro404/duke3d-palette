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

// TODO: check super

			it("should have a Description string property with a value of Default", function() {
				expect(PaletteIMG.Description).to.be.a("string");
				expect(PaletteIMG.Description).to.equal("Default");
			});

			describe("numberOfFileTypes", function() {
				it("should be a function", function() {
					expect(PaletteIMG.prototype.numberOfFileTypes).to.be.an.instanceof(Function);
				});

				// TODO
			});

			describe("getFileType", function() {
				it("should be a function", function() {
					expect(PaletteIMG.prototype.getFileType).to.be.an.instanceof(Function);
				});

				// TODO
			});

			describe("indexOfFileType", function() {
				it("should be a function", function() {
					expect(PaletteIMG.prototype.indexOfFileType).to.be.an.instanceof(Function);
				});

				// TODO
			});

			describe("getPaletteDescription", function() {
				it("should be a function", function() {
					expect(PaletteIMG.prototype.getPaletteDescription).to.be.an.instanceof(Function);
				});

				// TODO
			});

			describe("getPixel", function() {
				it("should be a function", function() {
					expect(PaletteIMG.prototype.getPixel).to.be.an.instanceof(Function);
				});

				// TODO
			});

			describe("updatePixel", function() {
				it("should be a function", function() {
					expect(PaletteIMG.prototype.updatePixel).to.be.an.instanceof(Function);
				});

				// TODO
			});

			describe("updateColourData", function() {
				it("should be a function", function() {
					expect(PaletteIMG.prototype.updateColourData).to.be.an.instanceof(Function);
				});

				// TODO
			});

			describe("fillWithColour", function() {
				it("should be a function", function() {
					expect(PaletteIMG.prototype.fillWithColour).to.be.an.instanceof(Function);
				});

				// TODO
			});

			describe("validateData", function() {
				it("should be a function", function() {
					expect(PaletteIMG.prototype.validateData).to.be.an.instanceof(Function);
				});

				// TODO
			});
		});
	});
});
