"use strict";

const async = require("async");
const path = require("path-extra");
const fs = require("fs-extra");
const utilities = require("extra-utilities");
const ByteBuffer = require("bytebuffer");
const Colour = require("colour-rgba");
const Palette = require("../index.js");
const PaletteFileType = Palette.FileType;
const PaletteDATFileType = Palette.DAT.DATFileType;
const chai = require("chai");
const expect = chai.expect;

describe("Duke3D", function() {
	describe("Palette", function() {
		describe("DAT", function() {
			describe("DATFileType", function() {
				it("should extend PaletteFileType", function() {
					expect(Palette.FileType.isExtendedBy(PaletteDATFileType)).to.equal(true);
				});

				describe("constructor", function() {
					it("should allow new PaletteFileType instances to be created", function() {
						const testFileType = new PaletteDATFileType("PreEmptive", "Strike", ["Mutant", "Battalions"], 0, 1);

						expect(testFileType).to.be.an.instanceof(PaletteFileType);
						expect(testFileType).to.be.an.instanceof(PaletteDATFileType);
						expect(testFileType.id).to.be.a("number").that.is.greaterThan(0);
						expect(testFileType.name).to.equal("PreEmptive");
						expect(testFileType.extension).to.equal("STRIKE");
						expect(testFileType.descriptions).to.deep.equal(["Mutant", "Battalions"]);
						expect(testFileType.offset).to.equal(0);
						expect(testFileType.size).to.equal(1);
					});

					it("should allow a negative id to be specified for the first argument", function() {
						const testFileType = new PaletteDATFileType(-420, "Terror", "Fakt", ["Cold", "Steel", "World"], 1, 5);

						expect(testFileType).to.be.an.instanceof(PaletteFileType);
						expect(testFileType).to.be.an.instanceof(PaletteDATFileType);
						expect(testFileType.id).to.equal(-420);
						expect(testFileType.name).to.equal("Terror");
						expect(testFileType.extension).to.equal("FAKT");
						expect(testFileType.descriptions).to.deep.equal(["Cold", "Steel", "World"]);
						expect(testFileType.offset).to.equal(1);
						expect(testFileType.size).to.equal(5);
					});
				});

				describe("descriptions", function() {
					it("should replace any existing descriptions when assigning an array of strings", function() {
						const fileType = new PaletteDATFileType("Stuff", "DAT", ["and", "things"], 0, 0);

						expect(fileType.descriptions).to.deep.equal(["and", "things"]);

						fileType.descriptions = ["not", "sure"];

						expect(fileType.descriptions).to.deep.equal(["not", "sure"]);
					});

					it("should ignore invalid values and trim strings when assigning an array of values", function() {
						const fileType = new PaletteDATFileType("Invalid", "DAT", ["hey"], 0, 0);

						expect(fileType.descriptions).to.deep.equal(["hey"]);

						fileType.descriptions = ["yes", null, { }, " u", "\twot", 4];

						expect(fileType.descriptions).to.deep.equal(["yes", "u", "wot"]);
					});

					it("should not assign any new values for non-array values", function() {
						const fileType = new PaletteDATFileType("Uhh", "DAT", ["hi"], 0, 0);

						expect(fileType.descriptions).to.deep.equal(["hi"]);

						fileType.descriptions = Infinity;

						expect(fileType.descriptions).to.deep.equal([]);
					});
				});

				describe("offset", function() {
					it("should allow valid integers to be assigned to it", function() {
						const fileType = new PaletteDATFileType("Test", "DAT", [], 0, 0);

						expect(fileType.offset).to.equal(0);

						fileType.offset = 1;

						expect(fileType.offset).to.equal(1);
					});

					it("should format number values as integers when assigning", function() {
						const fileType = new PaletteDATFileType("Test", "DAT", [], 0, 0);

						expect(fileType.offset).to.equal(0);

						fileType.offset = 1.337;

						expect(fileType.offset).to.equal(1);

						fileType.offset = "3.141592654";

						expect(fileType.offset).to.equal(3);

						fileType.offset = "420";

						expect(fileType.offset).to.equal(420);
					});

					it("should assign a value of NaN for invalid or negative values", function() {
						const invalidValues = [null, NaN, -Infinity, Infinity, -1, -2, -1000, { }, [], "no", "-1", "test"];

						for(let i = 0; i < invalidValues.length; i++) {
							const fileType = new PaletteDATFileType("Test", "DAT", [], 0, 0);

							fileType.offset = invalidValues[i];

							expect(fileType.offset).to.be.NaN;
						}
					});
				});

				describe("size", function() {
					it("should allow valid integers to be assigned to it", function() {
						const fileType = new PaletteDATFileType("Alternative", "DAT", [], 0, 0);

						expect(fileType.size).to.equal(0);

						fileType.size = 1;

						expect(fileType.size).to.equal(1);
					});

					it("should format number values as integers when assigning", function() {
						const fileType = new PaletteDATFileType("Alternative", "DAT", [], 0, 0);

						expect(fileType.size).to.equal(0);

						fileType.size = 1.337;

						expect(fileType.size).to.equal(1);

						fileType.size = "3.141592654";

						expect(fileType.size).to.equal(3);

						fileType.size = "420";

						expect(fileType.size).to.equal(420);
					});

					it("should assign a value of NaN for invalid or negative values", function() {
						const invalidValues = [null, NaN, -Infinity, Infinity, -1, -2, -1000, { }, [], "no", "-1", "test"];

						for(let i = 0; i < invalidValues.length; i++) {
							const fileType = new PaletteDATFileType("Test", "DAT", [], 0, 0);

							fileType.size = invalidValues[i];

							expect(fileType.size).to.be.NaN;
						}
					});
				});

				describe("numberOfSubPalettes", function() {
					it("should be a function", function() {
						expect(PaletteDATFileType.prototype.numberOfSubPalettes).to.be.an.instanceof(Function);
					});

					it("should match the number of descriptions in the file type", function() {
						expect(new PaletteDATFileType("Dogfart", "Catpuke", ["G", "O", "T", "T", "E", "M"], 6, 9).numberOfSubPalettes()).to.equal(6);
					});
				});

				describe("numberOfDescriptions", function() {
					it("should be a function", function() {
						expect(PaletteDATFileType.prototype.numberOfDescriptions).to.be.an.instanceof(Function);
					});


					it("should match the number of descriptions in the file type", function() {
						expect(new PaletteDATFileType("Dude", "GETUP", ["G", "E", "T", "S", "M", "O", "K", "E", "D", "L", "I", "K", "E", "T", "H", "I", "S", "B", "L", "U", "N", "T"], 6, 9).numberOfDescriptions()).to.equal(22);
					});
				});

				describe("getDescription", function() {
					it("should be a function", function() {
						expect(PaletteDATFileType.prototype.getDescription).to.be.an.instanceof(Function);
					});

					it("should return the description at the specified index in the file type", function() {
						const fileType = new PaletteDATFileType("Some", "Thing", ["One", "Two", "Three"], 634, 687498);
						expect(fileType.getDescription(0)).to.equal("One");
						expect(fileType.getDescription(1)).to.equal("Two");
						expect(fileType.getDescription(2)).to.equal("Three");
					});

					it("should return null for invalid description index values", function() {
						const fileType = new PaletteDATFileType("John", "Madden", ["Football"], 44, 88);
						expect(fileType.getDescription(NaN)).to.equal(null);
						expect(fileType.getDescription(Infinity)).to.equal(null);
						expect(fileType.getDescription(null)).to.equal(null);
						expect(fileType.getDescription(-1)).to.equal(null);
						expect(fileType.getDescription(1)).to.equal(null);
					});
				});

				describe("static isPaletteDATFileType", function() {
					it("should be a function", function() {
						expect(PaletteDATFileType.isPaletteDATFileType).to.be.an.instanceof(Function);
					});

					it("should return true for instances of PaletteDATFileType", function() {
						expect(PaletteDATFileType.isPaletteDATFileType(new PaletteDATFileType("entity", "AK47", ["prefab"], 1234, 5678))).to.equal(true);
					});

					it("should return false for invalid values", function() {
						expect(PaletteDATFileType.isPaletteDATFileType(null)).to.equal(false);
						expect(PaletteDATFileType.isPaletteDATFileType({ })).to.equal(false);
					});
				});

				describe("isValid", function() {
					it("should be a function", function() {
						expect(PaletteDATFileType.prototype.isValid).to.be.an.instanceof(Function);
					});

					it("should return true for valid instances of PaletteDATFileType", function() {
						expect(new PaletteDATFileType("Party", "Snoozer", ["CYNCO"], 0, 1).isValid()).to.equal(true);
					});

					it("should return false for invalid instances of PaletteDATFileType", function() {
						expect(new PaletteDATFileType(-8675309, "DIAMOND", "EYES", ["Test"], 2, 3).isValid()).to.equal(false);
					});

					it("should return false for file types with an empty description", function() {
						const fileType = new PaletteDATFileType("Empty", "Description", ["Here"], 0, 1);

						expect(fileType.isValid()).to.equal(true);

						fileType.descriptions.push("");

						expect(fileType.isValid()).to.equal(false);
					});
				});

				describe("static isValid", function() {
					it("should be a function", function() {
						expect(PaletteDATFileType.isValid).to.be.an.instanceof(Function);
					});

					it("should be a function", function() {
						expect(PaletteDATFileType.isValid).to.be.an.instanceof(Function);
					});

					it("should return true for valid instances of PaletteDATFileType", function() {
						expect(PaletteDATFileType.isValid(new PaletteDATFileType("Los", "Pollos", ["Hermanos"], 32, 64))).to.equal(true);
					});

					it("should return false for invalid instances of PaletteDATFileType", function() {
						expect(PaletteDATFileType.isValid(new PaletteDATFileType(-1337, "Vamonos", "Pest", ["!"], 420, 9000))).to.equal(false);
					});

					it("should return false for invalid values", function() {
						expect(PaletteDATFileType.isValid(null)).to.equal(false);
						expect(PaletteDATFileType.isValid({ })).to.equal(false);
					});
				});

				describe("Palette", function() {
					it("should be an instance of PaletteDATFileType", function() {
						expect(PaletteDATFileType.isPaletteDATFileType(PaletteDATFileType.Palette)).to.equal(true);
					});

					describe("id", function() {
						it("should equal 0", function() {
							expect(PaletteDATFileType.Palette.id).to.equal(0);
						});
					});

					describe("name", function() {
						it("should equal 'Palette'", function() {
							expect(PaletteDATFileType.Palette.name).to.equal("Palette");
						});
					});

					describe("extension", function() {
						it("should equal 'DAT'", function() {
							expect(PaletteDATFileType.Palette.extension).to.equal("DAT");
						});
					});

					describe("descriptions", function() {
						it("should be an array with the string 'Normal'", function() {
							expect(PaletteDATFileType.Palette.descriptions).to.be.an("array").that.is.not.empty;
							expect(PaletteDATFileType.Palette.descriptions.length).to.equal(1);
							expect(PaletteDATFileType.Palette.descriptions[0]).to.equal("Normal");
						});
					});

					describe("offset", function() {
						it("should equal 0", function() {
							expect(PaletteDATFileType.Palette.offset).to.equal(0);
						});
					});

					describe("size", function() {
						it("should equal 82690", function() {
							expect(PaletteDATFileType.Palette.size).to.equal(82690);
						});
					});
				});

				describe("Lookup", function() {
					it("should be an instance of PaletteDATFileType", function() {
						expect(PaletteDATFileType.isPaletteDATFileType(PaletteDATFileType.Palette)).to.equal(true);
					});

					describe("id", function() {
						it("should equal 0", function() {
							expect(PaletteDATFileType.Lookup.id).to.equal(1);
						});
					});

					describe("name", function() {
						it("should equal 'Lookup'", function() {
							expect(PaletteDATFileType.Lookup.name).to.equal("Lookup");
						});
					});

					describe("extension", function() {
						it("should equal 'DAT'", function() {
							expect(PaletteDATFileType.Lookup.extension).to.equal("DAT");
						});
					});

					describe("descriptions", function() {
						it("should be an array with 5 strings: 'Underwater', 'Night Vision', 'Title Screen', '3D Realms Logo' and 'Episode 1 Ending Animation'", function() {
							expect(PaletteDATFileType.Lookup.descriptions).to.be.an("array").that.is.not.empty;
							expect(PaletteDATFileType.Lookup.descriptions.length).to.equal(5);
							expect(PaletteDATFileType.Lookup.descriptions[0]).to.equal("Underwater");
							expect(PaletteDATFileType.Lookup.descriptions[1]).to.equal("Night Vision");
							expect(PaletteDATFileType.Lookup.descriptions[2]).to.equal("Title Screen");
							expect(PaletteDATFileType.Lookup.descriptions[3]).to.equal("3D Realms Logo");
							expect(PaletteDATFileType.Lookup.descriptions[4]).to.equal("Episode 1 Ending Animation");
						});
					});

					describe("offset", function() {
						it("should equal 6426", function() {
							expect(PaletteDATFileType.Lookup.offset).to.equal(6426);
						});
					});

					describe("size", function() {
						it("should equal 10266", function() {
							expect(PaletteDATFileType.Lookup.size).to.equal(10266);
						});
					});
				});

				describe("FileTypes", function() {
					it("should be an array containing Palette and Lookup DAT file type instances", function() {
						expect(PaletteDATFileType.FileTypes).to.be.an("array").that.is.not.empty;
						expect(PaletteDATFileType.FileTypes.length).to.equal(2);
						expect(PaletteDATFileType.FileTypes[0]).to.equal(PaletteDATFileType.Palette);
						expect(PaletteDATFileType.FileTypes[1]).to.equal(PaletteDATFileType.Lookup);
					});
				});
			});
		});
	});
});
