"use strict";

const async = require("async");
const path = require("path-extra");
const fs = require("fs-extra");
const utilities = require("extra-utilities");
const ByteBuffer = require("bytebuffer");
const Colour = require("colour-rgba");
const Palette = require("../index.js");
const PaletteFileType = Palette.FileType;
const chai = require("chai");
const expect = chai.expect;

describe("Duke3D", function() {
	describe("Palette", function() {
		describe("FileType", function() {
// TODO: getter/setter

			describe("static isExtendedBy", function() {
				it("should be a function", function() {
					expect(PaletteFileType.isExtendedBy).to.be.an.instanceof(Function);
				});

				// TODO
			});

			describe("equals", function() {
				it("should be a function", function() {
					expect(PaletteFileType.prototype.equals).to.be.an.instanceof(Function);
				});

				it("should return false when comparing an invalid PaletteFileType", function() {
					expect(new PaletteFileType(-8, "Free Real Estate", "FRE").equals(new PaletteFileType("Free Real Estate", "FRE"))).to.equal(false);
				});

				it("should return false when comparing to an invalid PaletteFileType", function() {
					expect(new PaletteFileType("Jim Boonie", "NMK").equals(new PaletteFileType(-4, "Jim Boonie", "NMK"))).to.equal(false);
				});

				it("should return false when comparing two PaletteFileType with different extensions", function() {
					expect(new PaletteFileType("Discount Prices", "TH").equals(new PaletteFileType("Discount Prices", "EW"))).to.equal(false);
				});

				it("should return false when comparing two PaletteFileType with different names", function() {
					expect(new PaletteFileType("Premium Prices", "HRY").equals(new PaletteFileType("Crap Prices", "HRY"))).to.equal(false);
				});

				it("should return true when comparing two matching PaletteFileTypes", function() {
					expect(new PaletteFileType("Sunday Scaries", "PB").equals(new PaletteFileType("Sunday Scaries", "PB"))).to.equal(true);
				});
			});

			describe("toString", function() {
				it("should be a function", function() {
					expect(PaletteFileType.prototype.toString).to.be.an.instanceof(Function);
				});

				it("should correctly return a string representation of a valid PaletteFileType", function() {
					expect(new PaletteFileType("Door", "STUCK").toString()).to.equal("Door (" + "STUCK" + ")");
				});
			});

			describe("static isPaletteFileType", function() {
				it("should be a function", function() {
					expect(PaletteFileType.isPaletteFileType).to.be.an.instanceof(Function);
				});

				it("should return true for instances of PaletteFileType", function() {
					expect(PaletteFileType.isPaletteFileType(new PaletteFileType("Widget", "WGT"))).to.equal(true);
				});

				it("should return false for invalid values", function() {
					expect(PaletteFileType.isPaletteFileType(null)).to.equal(false);
					expect(PaletteFileType.isPaletteFileType({ })).to.equal(false);
				});
			});

			describe("isValid", function() {
				it("should be a function", function() {
					expect(PaletteFileType.prototype.isValid).to.be.an.instanceof(Function);
				});

				it("should return true for valid instances of PaletteFileType", function() {
					expect(new PaletteFileType("Same", "TIE").isValid()).to.equal(true);
				});

				it("should return false for invalid instances of PaletteFileType", function() {
					expect(new PaletteFileType(-69, "Nope", "AVI").isValid()).to.equal(false);
				});
			});

			describe("static isValid", function() {
				it("should be a function", function() {
					expect(PaletteFileType.isValid).to.be.an.instanceof(Function);
				});

				it("should return true for valid instances of PaletteFileType", function() {
					expect(PaletteFileType.isValid(new PaletteFileType("Nice", "Meme"))).to.equal(true);
				});

				it("should return false for invalid instances of PaletteFileType", function() {
					expect(PaletteFileType.isValid(new PaletteFileType(-420, "U", "WOT"))).to.equal(false);
				});

				it("should return false for invalid values", function() {
					expect(PaletteFileType.isValid(null)).to.equal(false);
					expect(PaletteFileType.isValid({ })).to.equal(false);
				});
			});
		});
	});
});
