"use strict";

const async = require("async");
const path = require("path-extra");
const fs = require("fs-extra");
const utilities = require("extra-utilities");
const ByteBuffer = require("bytebuffer");
const Colour = require("colour-rgba");
const Palette = require("../index.js");
const PaletteType = Palette.Type;
const chai = require("chai");
const expect = chai.expect;

describe("Duke3D", function() {
	describe("Palette", function() {
		describe("Type", function() {
			describe("constructor", function() {
				it("should allow new PaletteType instances to be created", function() {
					const testType = new PaletteType("Zebra", Palette.ACT);

					expect(testType).to.be.an.instanceof(PaletteType);
					expect(testType.name).to.equal("Zebra");
					expect(testType.paletteSubclass).to.equal(Palette.ACT);
				});
			});

			describe("name", function() {
				it("should allow string values to be assigned to it", function() {
					const testType = new PaletteType("Palette", Palette.DAT);

					testType.name = "WAT";

					expect(testType.name).to.equal("WAT");
				});

				it("should trim string values assigned to it", function() {
					const testType = new PaletteType("Please", "Ignore");

					testType.name = "\t\tUhHhHH    ";

					expect(testType.name).to.equal("UhHhHH");
				});

				it("should default to null for invalid values", function() {
					const testType = new PaletteType("Whalebones", Palette.IMG);

					testType.name = -Infinity;

					expect(testType.name).to.equal(null);
				});
			});

			describe("paletteSubclass", function() {
				it("should allow valid values to be assigned to it", function() {
					const testType = new PaletteType("Palette", Palette.DAT);

					testType.paletteSubclass = Palette.IMG;

					expect(testType.paletteSubclass).to.equal(Palette.IMG);
				});

				it("should default to null for invalid values", function() {
					const testType = new PaletteType("Spider Cider", Palette.DAT);

					testType.paletteSubclass = { };

					expect(testType.paletteSubclass).to.equal(null);
				});
			});

			describe("equals", function() {
				it("should be a function", function() {
					expect(PaletteType.prototype.equals).to.be.an.instanceof(Function);
				});

				it("should return false when comparing an invalid PaletteType", function() {
					expect(new PaletteType("", null).equals(new PaletteType("", null))).to.equal(false);
				});

				it("should return false when comparing to an invalid PaletteType", function() {
					expect(new PaletteType("Lookup", Palette.DAT).equals(new PaletteType("Invalid", null))).to.equal(false);
				});

				it("should return false when comparing two PaletteType with different names", function() {
					expect(new PaletteType("Example", Palette.DAT).equals(new PaletteType("Unexample", Palette.DAT))).to.equal(false);
				});

				it("should return true when comparing two PaletteType with the same name and different palette subclasses", function() {
					expect(new PaletteType("sametie.exe", Palette.ACT).equals(new PaletteType("sametie.exe", Palette.DAT))).to.equal(true);
				});

				it("should return true when comparing two matching PaletteTypes", function() {
					expect(new PaletteType("Rabbit Habbits", Palette.IMG).equals(new PaletteType("Rabbit Habbits", Palette.IMG))).to.equal(true);
				});

				it("should return true when comparing two matching PaletteTypes with names in different cases", function() {
					expect(new PaletteType("Prodeus", Palette.DAT).equals(new PaletteType("PRODEUS", Palette.DAT))).to.equal(true);
				});
			});

			describe("toString", function() {
				it("should be a function", function() {
					expect(PaletteType.prototype.toString).to.be.an.instanceof(Function);
				});

				it("should correctly return a string representation of a valid PaletteType", function() {
					expect(new PaletteType("Dude Get Up", Palette.IMG).toString()).to.equal("Dude Get Up");
				});
			});

			describe("static isPaletteType", function() {
				it("should be a function", function() {
					expect(PaletteType.isPaletteType).to.be.an.instanceof(Function);
				});

				it("should return true for instances of PaletteType", function() {
					expect(PaletteType.isPaletteType(new PaletteType("Tizen", Palette.ACT))).to.equal(true);
				});

				it("should return false for invalid values", function() {
					expect(PaletteType.isPaletteType(null)).to.equal(false);
					expect(PaletteType.isPaletteType({ })).to.equal(false);
				});
			});

			describe("isValid", function() {
				it("should be a function", function() {
					expect(PaletteType.prototype.isValid).to.be.an.instanceof(Function);
				});

				it("should return true for valid instances of PaletteType", function() {
					expect(new PaletteType("Doot", Palette.DAT).isValid()).to.equal(true);
				});

				it("should return false for invalid instances of PaletteType", function() {
					expect(new PaletteType("", Palette.ACT).isValid()).to.equal(false);
					expect(new PaletteType("Fake", null).isValid()).to.equal(false);
				});
			});

			describe("static isValid", function() {
				it("should be a function", function() {
					expect(PaletteType.isValid).to.be.an.instanceof(Function);
				});

				it("should return true for valid instances of PaletteType", function() {
					expect(PaletteType.isValid(new PaletteType("Gustavo", Palette.IMG))).to.equal(true);
				});

				it("should return false for invalid instances of PaletteType", function() {
					expect(PaletteType.isValid(new PaletteType("", Palette.DAT))).to.equal(false);
					expect(PaletteType.isValid(new PaletteType("Mike", null))).to.equal(false);
				});

				it("should return false for invalid values", function() {
					expect(PaletteType.isValid(null)).to.equal(false);
					expect(PaletteType.isValid({ })).to.equal(false);
				});
			});
		});
	});
});
