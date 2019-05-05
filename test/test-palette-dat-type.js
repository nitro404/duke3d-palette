"use strict";

const utilities = require("extra-utilities");
const Palette = require("../index.js");
const PaletteDATType = Palette.DAT.DATType;
const chai = require("chai");
const expect = chai.expect;

let testDATType = null;

describe("Duke3D", function() {
	describe("Palette", function() {
		describe("DAT", function() {
			describe("Type", function() {
				before(function() {
					testDATType = new PaletteDATType("Door", "Stuck", ["Can't", "Make", "It"], 42069, 8675309);
				});

				it("should be a function", function() {
					expect(PaletteDATType).to.be.a("function");
				});

				it("should contain an invalid dat type instance property", function() {
					expect(PaletteDATType.Invalid).to.be.an.instanceof(PaletteDATType);
					expect(PaletteDATType.Invalid.id).to.equal("Invalid");
					expect(PaletteDATType.Invalid.name).to.equal("Invalid");
					expect(PaletteDATType.Invalid.value).to.equal(-1);
					expect(PaletteDATType.Invalid.descriptions).to.deep.equal([]);
					expect(PaletteDATType.Invalid.offset).to.be.NaN;
					expect(PaletteDATType.Invalid.size).to.be.NaN;
				});

				it("should contain a palette dat type instance property", function() {
					expect(PaletteDATType.Palette).to.be.an.instanceof(PaletteDATType);
					expect(PaletteDATType.Palette.id).to.equal("Palette");
					expect(PaletteDATType.Palette.name).to.equal("Palette");
					expect(PaletteDATType.Palette.value).to.equal(0);
					expect(PaletteDATType.Palette.descriptions).to.deep.equal(["Normal"]);
					expect(PaletteDATType.Palette.offset).to.equal(0);
					expect(PaletteDATType.Palette.size).to.equal(82690);
				});

				it("should contain a lookup dat type instance property", function() {
					expect(PaletteDATType.Lookup).to.be.an.instanceof(PaletteDATType);
					expect(PaletteDATType.Lookup.id).to.equal("Lookup");
					expect(PaletteDATType.Lookup.name).to.equal("Lookup");
					expect(PaletteDATType.Lookup.value).to.equal(1);
					expect(PaletteDATType.Lookup.descriptions).to.deep.equal(["Underwater", "Night Vision", "Title Screen", "3D Realms Logo", "Episode 1 Ending Animation"]);
					expect(PaletteDATType.Lookup.offset).to.equal(6426);
					expect(PaletteDATType.Lookup.size).to.equal(10266);
				});

				it("should allow for instantiation of new dat types", function() {
					expect(testDATType).to.be.an.instanceof(PaletteDATType);
					expect(testDATType.id).to.equal("Door");
					expect(testDATType.name).to.equal("Stuck");
					expect(testDATType.value).to.equal(2);
					expect(testDATType.descriptions).to.deep.equal(["Can't", "Make", "It"]);
					expect(testDATType.offset).to.equal(42069);
					expect(testDATType.size).to.equal(8675309);
				});

				describe("setters", function() {
					describe("id", function() {
						it("should change the id of a dat type instance", function() {
							const newID = "NICE";
							testDATType.id = newID;
							expect(testDATType.id).to.equal(newID);
						});

						it("should trim the id value before assigning it to the dat type instance", function() {
							testDATType.id = " NICE\t";
							expect(testDATType.id).to.equal("NICE");
						});

						it("should assign an empty string for any invalid id values", function() {
							testDATType.id = null;
							expect(testDATType.id).to.equal("");

							testDATType.id = NaN;
							expect(testDATType.id).to.equal("");

							testDATType.id = " \t ";
							expect(testDATType.id).to.equal("");
						});
					});

					describe("name", function() {
						it("should change the name of a dat type instance", function() {
							const newID = "MEME";
							testDATType.name = newID;
							expect(testDATType.name).to.equal(newID);
						});

						it("should trim the name value before assigning it to the dat type instance", function() {
							testDATType.name = "\tMEME ";
							expect(testDATType.name).to.equal("MEME");
						});

						it("should assign an empty string for any invalid name values", function() {
							testDATType.name = null;
							expect(testDATType.name).to.equal("");

							testDATType.name = NaN;
							expect(testDATType.name).to.equal("");

							testDATType.name = "\t \t";
							expect(testDATType.name).to.equal("");
						});
					});

					describe("value", function() {
						it("should override any positive numbers assigned to it", function() {
							testDATType.value = 69;
							expect(testDATType.value).to.equal(3);
						});

						it("should override any invalid values assigned to it", function() {
							testDATType.value = NaN;
							expect(testDATType.value).to.equal(4);

							testDATType.value = -Infinity;
							expect(testDATType.value).to.equal(5);
						});

						it("should allow special negative values to be assigned to it", function() {
							testDATType.value = -2;
							expect(testDATType.value).to.equal(-2);

							testDATType.value = -420;
							expect(testDATType.value).to.equal(-420);
						});
					});

					describe("descriptions", function() {
						it("should format any arrays assigned to it by trimming strings and omitting non-string values", function() {
							testDATType.descriptions = ["u", null, " wot", NaN, "\tm8\t", []];
							expect(testDATType.descriptions).to.deep.equal(["u", "wot", "m8"]);
						});

						it("should change the descriptions to an empty array for any invalid or empty values", function() {
							testDATType.descriptions = null;
							expect(testDATType.descriptions).to.deep.equal([]);

							testDATType.descriptions = NaN;
							expect(testDATType.descriptions).to.deep.equal([]);

							testDATType.descriptions = "[\"no\"]";
							expect(testDATType.descriptions).to.deep.equal([]);

							testDATType.descriptions = { };
							expect(testDATType.descriptions).to.deep.equal([]);

							testDATType.descriptions = [];
							expect(testDATType.descriptions).to.deep.equal([]);
						});
					});

					describe("offset", function() {
						it("should change the offset of a dat type instance", function() {
							testDATType.offset = 420;
							expect(testDATType.offset).to.equal(420);

							testDATType.offset = "69";
							expect(testDATType.offset).to.equal(69);
						});

						it("should change the offset of a dat type instance to NaN for any invalid values", function() {
							testDATType.offset = null;
							expect(testDATType.offset).to.be.NaN;

							testDATType.offset = Infinity;
							expect(testDATType.offset).to.be.NaN;
						});

						it("should change the offset of a dat type instance to NaN for any negative values", function() {
							testDATType.offset = -1337;
							expect(testDATType.offset).to.be.NaN;
						});
					});

					describe("size", function() {
						it("should change the size of a dat type instance", function() {
							testDATType.size = 8008135;
							expect(testDATType.size).to.equal(8008135);

							testDATType.size = "1337";
							expect(testDATType.size).to.equal(1337);
						});

						it("should change the size of a dat type instance to NaN for any invalid values", function() {
							testDATType.size = null;
							expect(testDATType.size).to.be.NaN;

							testDATType.size = -Infinity;
							expect(testDATType.size).to.be.NaN;
						});

						it("should change the size of a dat type instance to NaN for any negative values", function() {
							testDATType.size = -1999;
							expect(testDATType.size).to.be.NaN;
						});
					});
				});

				describe("numberOfSubPalettes", function() {
					it("should be a function", function() {
						expect(PaletteDATType.prototype.numberOfSubPalettes).to.be.an.instanceof(Function);
					});

					it("should return the correct value representing the number of sub-palettes", function() {
						expect(PaletteDATType.Invalid.numberOfSubPalettes()).to.equal(0);
						expect(PaletteDATType.Palette.numberOfSubPalettes()).to.equal(1);
						expect(PaletteDATType.Lookup.numberOfSubPalettes()).to.equal(5);
					});
				});

				describe("getDescription", function() {
					it("should be a function", function() {
						expect(PaletteDATType.prototype.getDescription).to.be.an.instanceof(Function);
					});

					it("should return the correct description for the specified index", function() {
						expect(PaletteDATType.Palette.getDescription(0)).to.equal("Normal");
						expect(PaletteDATType.Lookup.getDescription(0)).to.equal("Underwater");
						expect(PaletteDATType.Lookup.getDescription(1)).to.equal("Night Vision");
						expect(PaletteDATType.Lookup.getDescription(2)).to.equal("Title Screen");
						expect(PaletteDATType.Lookup.getDescription(3)).to.equal("3D Realms Logo");
						expect(PaletteDATType.Lookup.getDescription(4)).to.equal("Episode 1 Ending Animation");
					});

					it("should return null for invalid indexes or dat types with no sub-palettes", function() {
						expect(PaletteDATType.Palette.getDescription(NaN)).to.equal(null);
						expect(PaletteDATType.Palette.getDescription(-Infinity)).to.equal(null);
						expect(PaletteDATType.Palette.getDescription(1)).to.equal(null);
						expect(PaletteDATType.Lookup.getDescription(-1)).to.equal(null);
						expect(PaletteDATType.Lookup.getDescription(5)).to.equal(null);
					});
				});

				describe("static numberOfTypes", function() {
					it("should be a function", function() {
						expect(PaletteDATType.numberOfTypes).to.be.an.instanceof(Function);
					});

					it("should return the correct number of dat types", function() {
						expect(PaletteDATType.numberOfTypes()).to.equal(2);
					});
				});

				describe("static parseFrom", function() {
					it("should be a function", function() {
						expect(PaletteDATType.parseFrom).to.be.an.instanceof(Function);
					});

					it("should return the invalid dat type for invalid values", function() {
						expect(PaletteDATType.parseFrom(null)).to.deep.equal(PaletteDATType.Invalid);
						expect(PaletteDATType.parseFrom(Infinity)).to.deep.equal(PaletteDATType.Invalid);
						expect(PaletteDATType.parseFrom({ })).to.deep.equal(PaletteDATType.Invalid);
						expect(PaletteDATType.parseFrom({ value: 1 })).to.deep.equal(PaletteDATType.Invalid);
					});

					it("should parse a dat type from a valid dat type", function() {
						expect(PaletteDATType.parseFrom(PaletteDATType.Lookup)).to.deep.equal(PaletteDATType.Lookup);
					});

					it("should return the invalid dat type for invalid integer values", function() {
						expect(PaletteDATType.parseFrom(-2)).to.deep.equal(PaletteDATType.Invalid);
						expect(PaletteDATType.parseFrom(2)).to.deep.equal(PaletteDATType.Invalid);
					});

					it("should parse a dat type from a valid integer value", function() {
						expect(PaletteDATType.parseFrom(1)).to.deep.equal(PaletteDATType.Lookup);
					});

					it("should return the invalid dat type for invalid string values", function() {
						expect(PaletteDATType.parseFrom("")).to.deep.equal(PaletteDATType.Invalid);
						expect(PaletteDATType.parseFrom(" ")).to.deep.equal(PaletteDATType.Invalid);
						expect(PaletteDATType.parseFrom("\t")).to.deep.equal(PaletteDATType.Invalid);
						expect(PaletteDATType.parseFrom("-2")).to.deep.equal(PaletteDATType.Invalid);
						expect(PaletteDATType.parseFrom("2")).to.deep.equal(PaletteDATType.Invalid);
						expect(PaletteDATType.parseFrom("door")).to.deep.equal(PaletteDATType.Invalid);
					});

					it("should parse a dat type from a valid string integer value", function() {
						expect(PaletteDATType.parseFrom("0")).to.deep.equal(PaletteDATType.Palette);
						expect(PaletteDATType.parseFrom("1")).to.deep.equal(PaletteDATType.Lookup);
					});

					it("should parse a dat type from a valid id string", function() {
						expect(PaletteDATType.parseFrom("Palette")).to.deep.equal(PaletteDATType.Palette);
						expect(PaletteDATType.parseFrom("Lookup")).to.deep.equal(PaletteDATType.Lookup);
					});

					it("should parse a dat type from a valid name string case insensitively", function() {
						expect(PaletteDATType.parseFrom("PaLeTtE")).to.deep.equal(PaletteDATType.Palette);
						expect(PaletteDATType.parseFrom("LoOkUp")).to.deep.equal(PaletteDATType.Lookup);
					});
				});

				describe("equals", function() {
					it("should be a function", function() {
						expect(PaletteDATType.prototype.equals).to.be.an.instanceof(Function);
					});

					it("should return false for non-dat type values", function() {
						expect(PaletteDATType.Lookup.equals(null)).to.equal(false);
						expect(PaletteDATType.Lookup.equals(NaN)).to.equal(false);
						expect(PaletteDATType.Lookup.equals({ })).to.equal(false);
						expect(PaletteDATType.Lookup.equals([])).to.equal(false);
					});

					it("should return true for dat types with the same value", function() {
						expect(PaletteDATType.Lookup.equals(PaletteDATType.Lookup)).to.equal(true);
					});

					it("should return false for dat types with different values", function() {
						expect(PaletteDATType.Lookup.equals(PaletteDATType.Palette)).to.equal(false);
					});
				});

				describe("toString", function() {
					it("should be a function", function() {
						expect(PaletteDATType.prototype.toString).to.be.an.instanceof(Function);
					});

					it("should return a string representation using the name value", function() {
						expect(PaletteDATType.Invalid.toString()).to.equal("Invalid");
						expect(PaletteDATType.Lookup.toString()).to.equal("Lookup");
						expect(PaletteDATType.Palette.toString()).to.equal("Palette");
					});
				});

				describe("static isPaletteDATType", function() {
					it("should be a function", function() {
						expect(PaletteDATType.isPaletteDATType).to.be.an.instanceof(Function);
					});

					it("should return true for dat type instances", function() {
						expect(PaletteDATType.isPaletteDATType(PaletteDATType.Invalid)).to.equal(true);
						expect(PaletteDATType.isPaletteDATType(PaletteDATType.Lookup)).to.equal(true);
						expect(PaletteDATType.isPaletteDATType(PaletteDATType.Palette)).to.equal(true);
					});

					it("should return false for non-dat type values", function() {
						expect(PaletteDATType.isPaletteDATType(null)).to.equal(false);
						expect(PaletteDATType.isPaletteDATType(-Infinity)).to.equal(false);
						expect(PaletteDATType.isPaletteDATType({ })).to.equal(false);
						expect(PaletteDATType.isPaletteDATType([])).to.equal(false);
					});
				});

				describe("isValid", function() {
					before(function() {
						testDATType.value = 3;
						testDATType.id = "id";
						testDATType.name = "name";
						testDATType.descriptions = ["description"];
						testDATType.offset = 0;
						testDATType.size = 1;
					});

					it("should be a function", function() {
						expect(PaletteDATType.prototype.isValid).to.be.an.instanceof(Function);
					});

					it("should return true for valid dat type values", function() {
						expect(PaletteDATType.Lookup.isValid()).to.equal(true);
						expect(PaletteDATType.Palette.isValid()).to.equal(true);
					});

					it("should return false for invalid dat type values", function() {
						expect(PaletteDATType.Invalid.isValid()).to.equal(false);
					});

					it("should return false for dat types with negative values", function() {
						expect(testDATType.isValid()).to.equal(true);

						testDATType.value = -2008;
						expect(testDATType.isValid()).to.equal(false);

						testDATType.value = 4;
						expect(testDATType.isValid()).to.equal(true);
					});

					it("should return false for dat types with empty id values", function() {
						testDATType.id = null;
						expect(testDATType.isValid()).to.equal(false);

						testDATType.id = "id";
						expect(testDATType.isValid()).to.equal(true);
					});

					it("should return false for dat types with empty name values", function() {
						testDATType.name = null;
						expect(testDATType.isValid()).to.equal(false);

						testDATType.name = "name";
						expect(testDATType.isValid()).to.equal(true);
					});

					it("should return false for dat types with no descriptions", function() {
						testDATType.descriptions = [];
						expect(testDATType.isValid()).to.equal(false);

						testDATType.descriptions = ["description"];
						expect(testDATType.isValid()).to.equal(true);
					});

					it("should return false for dat types with invalid offset values", function() {
						testDATType.offset = NaN;
						expect(testDATType.isValid()).to.equal(false);

						testDATType.offset = 0;
						expect(testDATType.isValid()).to.equal(true);
					});

					it("should return false for dat types with invalid size values", function() {
						testDATType.size = NaN;
						expect(testDATType.isValid()).to.equal(false);

						testDATType.size = 1;
						expect(testDATType.isValid()).to.equal(true);
					});
				});

				describe("static isValid", function() {
					it("should be a function", function() {
						expect(PaletteDATType.isValid).to.be.an.instanceof(Function);
					});

					it("should return true for valid dat type values", function() {
						expect(PaletteDATType.isValid(PaletteDATType.Lookup)).to.equal(true);
						expect(PaletteDATType.isValid(PaletteDATType.Palette)).to.equal(true);
					});

					it("should return false for invalid dat type values", function() {
						expect(PaletteDATType.isValid(null)).to.equal(false);
						expect(PaletteDATType.isValid(NaN)).to.equal(false);
						expect(PaletteDATType.isValid({ })).to.equal(false);
						expect(PaletteDATType.isValid([])).to.equal(false);
						expect(PaletteDATType.isValid(PaletteDATType.Invalid)).to.equal(false);
					});
				});
			});
		});
	});
});
