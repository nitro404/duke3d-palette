"use strict";

const async = require("async");
const path = require("path-extra");
const fs = require("fs-extra");
const utilities = require("extra-utilities");
const ByteBuffer = require("bytebuffer");
const Jimp = require("jimp");
const Colour = require("colour-rgba");
const Palette = require("../index.js");
const PaletteFileType = Palette.FileType;
const PaletteIMGFileType = Palette.IMG.IMGFileType;
const chai = require("chai");
const expect = chai.expect;

describe("Duke3D", function() {
	describe("Palette", function() {
		describe("IMG", function() {
			describe("IMGFileType", function() {
				it("should extend PaletteFileType", function() {
					expect(Palette.FileType.isExtendedBy(PaletteIMGFileType)).to.equal(true);
				});

				describe("constructor", function() {
					it("should allow new PaletteFileType instances to be created", function() {
						const testFileType = new PaletteIMGFileType("Winter", "Sun", "beautiful/death");

						expect(testFileType).to.be.an.instanceof(PaletteFileType);
						expect(testFileType).to.be.an.instanceof(PaletteIMGFileType);
						expect(testFileType.id).to.be.a("number").that.is.greaterThan(0);
						expect(testFileType.name).to.equal("Winter");
						expect(testFileType.extension).to.equal("SUN");
						expect(testFileType.mimeType).to.equal("beautiful/death");
					});

					it("should allow a negative id to be specified for the first argument", function() {
						const testFileType = new PaletteIMGFileType(-1337, "The", "Operative", "dead/beat");

						expect(testFileType).to.be.an.instanceof(PaletteFileType);
						expect(testFileType).to.be.an.instanceof(PaletteIMGFileType);
						expect(testFileType.id).to.equal(-1337);
						expect(testFileType.name).to.equal("The");
						expect(testFileType.extension).to.equal("OPERATIVE");
						expect(testFileType.mimeType).to.equal("dead/beat");
					});
				});

				describe("mimeType", function() {
					it("should allow string values to be assigned to it", function() {
						const testFileType = new PaletteIMGFileType("Door", "Stuck", "in/valid");

						expect(testFileType.mimeType).to.equal("in/valid");

						testFileType.mimeType = "cant/make+it";

						expect(testFileType.mimeType).to.equal("cant/make+it");
					});

					it("should trim string values assigned to it", function() {
						const testFileType = new PaletteIMGFileType("dog", "fart", "cat/puke");

						expect(testFileType.mimeType).to.equal("cat/puke");

						testFileType.mimeType = "\tsPaCiNg  ";

						expect(testFileType.mimeType).to.equal("sPaCiNg");
					});

					it("should default to null for invalid values", function() {
						const testFileType = new PaletteIMGFileType("y", "u", "do/dis");

						expect(testFileType.mimeType).to.equal("do/dis");

						testFileType.mimeType = NaN;

						expect(testFileType.mimeType).to.equal(null);
					});
				});

				describe("static isPaletteIMGFileType", function() {
					it("should be a function", function() {
						expect(PaletteIMGFileType.isPaletteIMGFileType).to.be.an.instanceof(Function);
					});

					it("should return true for instances of PaletteIMGFileType", function() {
						expect(PaletteIMGFileType.isPaletteIMGFileType(new PaletteIMGFileType("Door", "Stuck", "help/door+stuck"))).to.equal(true);
					});

					it("should return false for invalid values", function() {
						expect(PaletteIMGFileType.isPaletteIMGFileType(null)).to.equal(false);
						expect(PaletteIMGFileType.isPaletteIMGFileType({ })).to.equal(false);
					});
				});

				describe("isValid", function() {
					it("should be a function", function() {
						expect(PaletteIMGFileType.prototype.isValid).to.be.an.instanceof(Function);
					});

					it("should return true for valid instances of PaletteIMGFileType", function() {
						expect(new PaletteIMGFileType("Ayy", "lmao", "application/ayy+lmao").isValid()).to.equal(true);
					});

					it("should return false for invalid instances of PaletteIMGFileType", function() {
						expect(new PaletteIMGFileType(-3, "Rocket", "Skates", "audio/rocket+skates").isValid()).to.equal(false);
					});
				});

				describe("static isValid", function() {
					it("should be a function", function() {
						expect(PaletteIMGFileType.isValid).to.be.an.instanceof(Function);
					});

					it("should be a function", function() {
						expect(PaletteIMGFileType.isValid).to.be.an.instanceof(Function);
					});

					it("should return true for valid instances of PaletteIMGFileType", function() {
						expect(PaletteIMGFileType.isValid(new PaletteIMGFileType("Can't", "MakeIt", "help/cant+make+it"))).to.equal(true);
					});

					it("should return false for invalid instances of PaletteIMGFileType", function() {
						expect(PaletteIMGFileType.isValid(new PaletteIMGFileType(-8008, "de", "dust2", "bsp/de_dust2"))).to.equal(false);
					});

					it("should return false for invalid values", function() {
						expect(PaletteIMGFileType.isValid(null)).to.equal(false);
						expect(PaletteIMGFileType.isValid({ })).to.equal(false);
					});
				});

				describe("BMP", function() {
					it("should be an instance of PaletteIMGFileType", function() {
						expect(PaletteIMGFileType.isPaletteIMGFileType(PaletteIMGFileType.BMP)).to.equal(true);
					});

					describe("id", function() {
						it("should equal 0", function() {
							expect(PaletteIMGFileType.BMP.id).to.equal(2);
						});
					});

					describe("name", function() {
						it("should equal 'Bitmap'", function() {
							expect(PaletteIMGFileType.BMP.name).to.equal("Bitmap");
						});
					});

					describe("extension", function() {
						it("should equal 'BMP'", function() {
							expect(PaletteIMGFileType.BMP.extension).to.equal("BMP");
						});
					});

					describe("mimeType", function() {
						it("should equal '" + Jimp.MIME_BMP + "'", function() {
							expect(PaletteIMGFileType.BMP.mimeType).to.equal(Jimp.MIME_BMP);
						});
					});
				});

				describe("PNG", function() {
					it("should be an instance of PaletteIMGFileType", function() {
						expect(PaletteIMGFileType.isPaletteIMGFileType(PaletteIMGFileType.PNG)).to.equal(true);
					});

					describe("id", function() {
						it("should equal 0", function() {
							expect(PaletteIMGFileType.PNG.id).to.equal(3);
						});
					});

					describe("name", function() {
						it("should equal 'Portable Network Graphics'", function() {
							expect(PaletteIMGFileType.PNG.name).to.equal("Portable Network Graphics");
						});
					});

					describe("extension", function() {
						it("should equal 'PNG'", function() {
							expect(PaletteIMGFileType.PNG.extension).to.equal("PNG");
						});
					});

					describe("mimeType", function() {
						it("should equal '" + Jimp.MIME_PNG + "'", function() {
							expect(PaletteIMGFileType.PNG.mimeType).to.equal(Jimp.MIME_PNG);
						});
					});
				});

				describe("FileTypes", function() {
					it("should be an array containing BMP and PNG IMG file type instances", function() {
						expect(PaletteIMGFileType.FileTypes).to.be.an("array").that.is.not.empty;
						expect(PaletteIMGFileType.FileTypes.length).to.equal(2);
						expect(PaletteIMGFileType.FileTypes[0]).to.equal(PaletteIMGFileType.BMP);
						expect(PaletteIMGFileType.FileTypes[1]).to.equal(PaletteIMGFileType.PNG);
					});
				});
			});
		});
	});
});
