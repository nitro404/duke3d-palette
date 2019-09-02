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
			describe("constructor", function() {
				it("should allow new PaletteFileType instances to be created", function() {
					const testFileType = new PaletteFileType("Rocket", "Skates");

					expect(testFileType).to.be.an.instanceof(PaletteFileType);
					expect(testFileType.id).to.be.a("number").that.is.greaterThan(0);
					expect(testFileType.name).to.equal("Rocket");
					expect(testFileType.extension).to.equal("SKATES");
				});

				it("should allow a negative id to be specified for the first argument", function() {
					const testFileType = new PaletteFileType(-69, "Lyrical", "Fluctuation");

					expect(testFileType).to.be.an.instanceof(PaletteFileType);
					expect(testFileType.id).to.equal(-69);
					expect(testFileType.name).to.equal("Lyrical");
					expect(testFileType.extension).to.equal("FLUCTUATION");
				});
			});

			describe("properties", function() {
				describe("idCounter", function() {
					it("should not allow numbers less than itself to be assigned to it", function() {
						const previousIDCounterValue = PaletteFileType.properties.idCounter;

						PaletteFileType.properties.idCounter = PaletteFileType.properties.idCounter - 1;

						expect(PaletteFileType.properties.idCounter).to.equal(previousIDCounterValue);
					});
				});
			});

			describe("id", function() {
				it("should be automatically assigned from a serial counter for each instance", function() {
					const testFileType = new PaletteFileType("Aphex", "Twin");

					expect(testFileType.id).to.be.a("number").that.is.greaterThan(0);
					expect(new PaletteFileType("Richard", "James").id).to.equal(testFileType.id + 1);
				});

				it("should only be settable to the desired value when it is negative", function() {
					const testFileType = new PaletteFileType(-1, "soccer", "practice");

					expect(testFileType.id).to.not.equal(-42);

					testFileType.id = -42;

					expect(testFileType.id).to.equal(-42);

					testFileType.id = 69;

					expect(testFileType.id).to.not.equal(69);
				});

				it("should be automatically assigned when an invalid id is specified", function() {
					const testFileType = new PaletteFileType(null, "Ayy", "Lmao");

					expect(testFileType.id).to.be.a("number").that.is.greaterThan(0);
				});

				it("should not be modifyable when an invalid id is specified", function() {
					const testFileType = new PaletteFileType([], "Tommy", "Cash");

					const previousID = testFileType.id;

					testFileType.id = Infinity;

					expect(testFileType.id).to.equal(previousID);
				});
			});

			describe("name", function() {
				it("should allow string values to be assigned to it", function() {
					const testFileType = new PaletteFileType("File", "Type");

					testFileType.name = "No";

					expect(testFileType.name).to.equal("No");
				});

				it("should trim string values assigned to it", function() {
					const testFileType = new PaletteFileType("Please", "Ignore");

					testFileType.name = " wHiTe sPaCe\t";

					expect(testFileType.name).to.equal("wHiTe sPaCe");
				});

				it("should default to null for invalid values", function() {
					const testFileType = new PaletteFileType("What's", "This?");

					testFileType.name = NaN;

					expect(testFileType.name).to.equal(null);
				});
			});

			describe("extension", function() {
				it("should allow string values to be assigned to it", function() {
					const testFileType = new PaletteFileType("Sample", "Extension");

					testFileType.extension = "EXT";

					expect(testFileType.extension).to.equal("EXT");
				});

				it("should trim string values assigned to it", function() {
					const testFileType = new PaletteFileType("123", "456");

					testFileType.extension = "\t\t.  \t  ";

					expect(testFileType.extension).to.equal(".");
				});

				it("should default to null for invalid values", function() {
					const testFileType = new PaletteFileType("NOT", "SURE");

					testFileType.extension = NaN;

					expect(testFileType.extension).to.equal(null);
				});

				it("should convert values to uppercase", function() {
					const testFileType = new PaletteFileType("404", "Not Found");

					testFileType.extension = "lower";

					expect(testFileType.extension).to.equal("LOWER");
				});
			});

			describe("static isExtendedBy", function() {
				it("should be a function", function() {
					expect(PaletteFileType.isExtendedBy).to.be.an.instanceof(Function);
				});

				it("should return true for a valid class that extends PaletteFileType", function() {
					class PoolInTheBack extends PaletteFileType {
						constructor() {
							super();
						}
					}

					expect(PaletteFileType.isExtendedBy(PoolInTheBack)).to.equal(true);
				});

				it("should return false for a valid class that does not extend PaletteFileType", function() {
					class TestClass { }

					expect(PaletteFileType.isExtendedBy(TestClass)).to.equal(false);
				});

				it("should return true for an object instance of a valid class that extends PaletteFileType", function() {
					class PoolInTheBack extends PaletteFileType {
						constructor() {
							super();
						}
					}

					const freePool = new PoolInTheBack();

					expect(PaletteFileType.isExtendedBy(freePool)).to.equal(true);
				});

				it("should return false for PaletteFileType", function() {
					expect(PaletteFileType.isExtendedBy(PaletteFileType)).to.equal(false);
				});

				it("should return false for an object instance of PaletteFileType", function() {
					const paletteFileType = new PaletteFileType();

					expect(PaletteFileType.isExtendedBy(paletteFileType)).to.equal(false);
				});

				it("should return false for non-object values", function() {
					expect(PaletteFileType.isExtendedBy(null)).to.equal(false);
				});
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
