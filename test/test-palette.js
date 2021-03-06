"use strict";

const async = require("async");
const path = require("path-extra");
const fs = require("fs-extra");
const utilities = require("extra-utilities");
const ByteBuffer = require("bytebuffer");
const Colour = require("colour-rgba");
const Palette = require("../index.js");
const PaletteACT = require("../src/palette-act.js");
const PalettePAL = require("../src/palette-pal.js");
const PaletteDAT = require("../src/palette-dat.js");
const PaletteIMG = require("../src/palette-img.js");
const chai = require("chai");
const sinon = require("sinon");
const expect = chai.expect;

describe("Duke3D", function() {
	describe("Palette", function() {
		it("should be a function", function() {
			expect(Palette).to.be.an.instanceof(Function);
		});

		class PaletteTest extends Palette {
			constructor(data, fileType, filePath) {
				super(data, fileType, filePath);
			}

			createNewData() { }
			getPaletteDescription() { }
			getPixel() { }
			updatePixel() { }
			updateColourData() { }
			fillWithColour() { }
			validateData() { }
			static getFileTypeForData() { }
		}

		const paletteTestFileType = new Palette.FileType("Binary", "BIN");

		it("should have a function property named Colour", function() {
			expect(Palette.Colour).to.be.an.instanceof(Function);
			expect(Palette.Colour).to.equal(Colour);
		});

		it("should have a function property named ACT", function() {
			expect(Palette.ACT).to.be.an.instanceof(Function);
			expect(Palette.ACT).to.equal(PaletteACT);
		});

		it("should have a function property named DAT", function() {
			expect(Palette.DAT).to.be.an.instanceof(Function);
			expect(Palette.DAT).to.equal(PaletteDAT);
		});

		it("should have a function property named IMG", function() {
			expect(Palette.IMG).to.be.an.instanceof(Function);
			expect(Palette.IMG).to.equal(PaletteIMG);
		});

		it("should have a function property named PAL", function() {
			expect(Palette.PAL).to.be.an.instanceof(Function);
			expect(Palette.PAL).to.equal(PalettePAL);
		});

		it("should have a Width integer property with a value of 16", function() {
			expect(Palette.Width).to.be.a("number");
			expect(Palette.Width).to.equal(16);
		});

		it("should have a Height integer property with a value of 16", function() {
			expect(Palette.Height).to.be.a("number");
			expect(Palette.Height).to.equal(16);
		});

		it("should have a NumberOfColours integer property with a value of 256", function() {
			expect(Palette.NumberOfColours).to.be.a("number");
			expect(Palette.NumberOfColours).to.equal(256);
		});

		it("should have a types array property", function() {
			expect(Palette.types).to.be.an.instanceof(Array);
		});

		describe("constructor", function() {
			it("should not be instantiable and should throw an error if the constructor is invoked", function() {
				expect(function() { new Palette(); }).to.throw();
			});

			it("should throw an error if an abstract static function is not implemented in a subclass", function() {
				class PaletteTestAbstractStatic extends Palette {
					constructor(data, fileType, filePath) {
						super(data, fileType, filePath);
					}

					createNewData() { }
					getPaletteDescription() { }
					getPixel() { }
					updatePixel() { }
					updateColourData() { }
					fillWithColour() { }
					validateData() { }
				}

				expect(function() { new PaletteTestAbstractStatic(); }).to.throw();
			});

			it("should throw an error if an abstract member function is not implemented in a subclass", function() {
				class PaletteTestAbstractMember extends Palette {
					constructor(data, fileType, filePath) {
						super(data, fileType, filePath);
					}

					static getFileTypeForData() { }
				}

				expect(function() { new PaletteTestAbstractMember(); }).to.throw();
			});

			it("should allow a valid palette subclass to be instantiated if all abstract features are implemented", function() {
				let paletteTest = null;

				expect(function() { paletteTest = new PaletteTest("", paletteTestFileType, "Test.BIN"); }).to.not.throw();
				expect(paletteTest.paletteSubclass).to.equal(PaletteTest);
				expect(paletteTest.data.equals(Buffer.from(""))).to.equal(true);
				expect(paletteTest.fileType).to.equal(paletteTestFileType);
				expect(paletteTest.filePath).to.equal("Test.BIN");
			});
		});

		describe("getters / setters", function() {
			describe("paletteSubclass", function() {
				it("should get populated with the palette subclass on instantiation", function() {
					expect(new Palette.ACT().paletteSubclass).to.equal(Palette.ACT);
					expect(new Palette.IMG().paletteSubclass).to.equal(Palette.IMG);
				});

				it("should be read-only", function() {
					const testPalette = new Palette.ACT();

					expect(function() { testPalette.paletteSubclass = "Virus"; }).to.throw(TypeError);
				});
			});

			describe("fileTypes", function() {
				it("should be an empty array by default", function() {
					const testPalette = new PaletteTest("", paletteTestFileType, "default.BIN");

					expect(testPalette.fileTypes).to.be.an("array").that.is.empty;
				});

				it("should be read-only", function() {
					const testPalette = new PaletteTest("", paletteTestFileType, "default.BIN");

					expect(function() { testPalette.fileTypes = []; }).to.throw(TypeError);
				});
			});

			describe("fileType", function() {
				it("should allow valid file types to be assigned", function() {
					const paletteTest = new PaletteTest("", paletteTestFileType, "Data.BIN");
					const testFileType = new Palette.FileType("Test", "TEST");

					expect(paletteTest.fileType).to.equal(paletteTestFileType);

					paletteTest.fileType = testFileType;

					expect(paletteTest.fileType).to.equal(testFileType);
				});

				it("should assign the special invalid file type when invalid file types are assigned", function() {
					const paletteTest = new PaletteTest("", paletteTestFileType, "Data.BIN");
					const invalidFileType = new Palette.FileType(-32, "Test", "TEST");

					paletteTest.fileType = invalidFileType;

					expect(paletteTest.fileType).to.not.equal(invalidFileType);
					expect(paletteTest.fileType).to.equal(Palette.FileType.Invalid);
				});
			});

			describe("filePath", function() {
				it("should allow valid strings to be assigned", function() {
					const paletteTest = new PaletteTest("", paletteTestFileType, "Example.BIN");

					paletteTest.filePath = "Valid.BIN";

					expect(paletteTest.filePath).to.equal("Valid.BIN");
				});

				it("should trim string values assigned to it", function() {
					const paletteTest = new PaletteTest("", paletteTestFileType, "Example.BIN");

					paletteTest.filePath = "  data/EXAMPLE.BIN\t";

					expect(paletteTest.filePath).to.equal("data/EXAMPLE.BIN");
				});

				it("should assign a value of null when invalid values are provided", function() {
					const paletteTest = new PaletteTest("", paletteTestFileType, "Telepathy.BIN");

					paletteTest.filePath = { };

					expect(paletteTest.filePath).to.equal(null);

					paletteTest.filePath = NaN;

					expect(paletteTest.filePath).to.equal(null);
				});

				it("should invoke onFilePathChanged function with the new path value if it is different", function() {
					class PaletteTestFilePathChanged extends Palette {
						constructor(data, fileType, filePath) {
							super(data, fileType, filePath);
						}

						onFilePathChanged() { }
						createNewData() { }
						getPaletteDescription() { }
						getPixel() { }
						updatePixel() { }
						updateColourData() { }
						fillWithColour() { }
						validateData() { }
						static getFileTypeForData() { }
					}

					const paletteTest = new PaletteTestFilePathChanged("", paletteTestFileType, "Test.BIN");

					sinon.spy(paletteTest, "onFilePathChanged");

					paletteTest.filePath = "Test2.BIN";

					expect(paletteTest.onFilePathChanged.calledOnce).to.equal(true);
					expect(paletteTest.onFilePathChanged.firstCall.calledWithExactly("Test2.BIN")).to.equal(true);

					paletteTest.onFilePathChanged.restore();
				});
			});

			describe("data", function() {
				it("should accept ByteBuffer values", function() {
					const paletteTest = new PaletteTest("", paletteTestFileType, "Testing.BIN");
					const byteBuffer = new ByteBuffer("With No Head");

					paletteTest.data = byteBuffer;

					expect(paletteTest.data).to.deep.equal(byteBuffer.toBuffer());
				});

				it("should accept Buffer values", function() {
					const paletteTest = new PaletteTest("", paletteTestFileType, "Testing.BIN");
					const buffer = Buffer.from("The Edge of Sanity");

					paletteTest.data = buffer;

					expect(paletteTest.data).to.deep.equal(buffer);
				});

				it("should accept array values", function() {
					const paletteTest = new PaletteTest("", paletteTestFileType, "Testing.BIN");

					paletteTest.data = [65, 66, 67];

					expect(paletteTest.data).to.deep.equal(Buffer.from("ABC"));
				});

				it("should accept string values", function() {
					const paletteTest = new PaletteTest("", paletteTestFileType, "Testing.BIN");

					paletteTest.data = "Seizure";

					expect(paletteTest.data).to.deep.equal(Buffer.from("Seizure"));
				});

				it("should invoke createNewData if no data or invalid data is provided", function() {
					const paletteTest = new PaletteTest("", paletteTestFileType, "Testing.BIN");

					sinon.spy(paletteTest, "createNewData");

					paletteTest.data = null;

					expect(paletteTest.createNewData.calledOnce).to.equal(true);
					expect(paletteTest.createNewData.firstCall.calledWithExactly()).to.equal(true);

					paletteTest.createNewData.restore();
				});

				it("should invoke validateData if there is any data assigned to the object", function() {
					const paletteTest = new PaletteTest("", paletteTestFileType, "Test.BIN");

					sinon.spy(paletteTest, "validateData");

					paletteTest.data = Buffer.from("VALIDATION");

					expect(paletteTest.validateData.calledOnce).to.equal(true);
					expect(paletteTest.validateData.firstCall.calledWithExactly()).to.equal(true);

					paletteTest.validateData.restore();
				});

				it("should invoke onDataChanged function with the new data value if it is different", function() {
					class PaletteTestDataChanged extends Palette {
						constructor(data, fileType, filePath) {
							super(data, fileType, filePath);
						}

						onDataChanged() { }
						createNewData() { }
						getPaletteDescription() { }
						getPixel() { }
						updatePixel() { }
						updateColourData() { }
						fillWithColour() { }
						validateData() { }
						static getFileTypeForData() { }
					}

					const paletteTest = new PaletteTestDataChanged("", paletteTestFileType, "Test.BIN");

					sinon.spy(paletteTest, "onDataChanged");

					paletteTest.data = Buffer.from("TESTING");

					expect(paletteTest.onDataChanged.calledOnce).to.equal(true);
					expect(paletteTest.onDataChanged.firstCall.calledWithExactly(paletteTest.data)).to.equal(true);

					paletteTest.onDataChanged.restore();
				});
			});
		});

		describe("abstractFunction", function() {
			it("should be invoked and throw an error when a member function is not overridden in a subclass", function() {
				const paletteTestFunctions = { };

				for(let i = 0; i < Palette.AbstractFunctions.length; i++) {
					const abstractFunctionName = Palette.AbstractFunctions[i];

					paletteTestFunctions[abstractFunctionName] = PaletteTest.prototype[abstractFunctionName];
				}

				for(let i = 0; i < Palette.AbstractFunctions.length; i++) {
					const paletteTest = new PaletteTest();
					const abstractFunctionName = Palette.AbstractFunctions[i];

					PaletteTest.prototype[abstractFunctionName] = Palette.prototype[abstractFunctionName];

					sinon.spy(paletteTest, "abstractFunction");

					expect(function() { paletteTest[abstractFunctionName](); }).to.throw();

					PaletteTest.prototype[abstractFunctionName] = paletteTestFunctions[abstractFunctionName];

					expect(paletteTest.abstractFunction.calledOnce).to.equal(true);

					paletteTest.abstractFunction.restore();
				}
			});
		});

		describe("static isExtendedBy", function() {
			it("should be a function", function() {
				expect(Palette.isExtendedBy).to.be.an.instanceof(Function);
			});

			it("should return true for a valid class that extends Palette", function() {
				expect(Palette.isExtendedBy(PaletteTest)).to.equal(true);
			});

			it("should return false for a valid class that does not extend Palette", function() {
				class TestClass { }

				expect(Palette.isExtendedBy(TestClass)).to.equal(false);
			});

			it("should return true for an object instance of a valid class that extends Palette", function() {
				const testPalette = new PaletteTest();

				expect(Palette.isExtendedBy(testPalette)).to.equal(true);
			});

			it("should return false for Palette", function() {
				expect(Palette.isExtendedBy(Palette)).to.equal(false);
			});

			it("should return false for non-object values", function() {
				expect(Palette.isExtendedBy(null)).to.equal(false);
			});
		});

		describe("static numberOfPaletteTypes", function() {
			it("should be a function", function() {
				expect(Palette.numberOfPaletteTypes).to.be.an.instanceof(Function);
			});

			it("should have a default value of 4", function() {
				expect(Palette.numberOfPaletteTypes()).to.equal(4);
			});
		});

		describe("static hasPaletteType", function() {
			it("should be a function", function() {
				expect(Palette.hasPaletteType).to.be.an.instanceof(Function);
			});

			it("should return true for a strict object with a valid name property", function() {
				expect(Palette.hasPaletteType({ name: "ACT" })).to.equal(true);
			});

			it("should case insensitively return true for a strict object with a valid name property", function() {
				expect(Palette.hasPaletteType({ name: "aCt" })).to.equal(true);
			});

			it("should return true for a valid string", function() {
				expect(Palette.hasPaletteType("ACT")).to.equal(true);
			});

			it("should case insensitively return true for a valid string", function() {
				expect(Palette.hasPaletteType("aCt")).to.equal(true);
			});

			it("should return false for a strict object with an invalid name property", function() {
				expect(Palette.hasPaletteType({ name: "No" })).to.equal(false);
				expect(Palette.hasPaletteType({ })).to.equal(false);
			});

			it("should return false for an empty or invalid string", function() {
				expect(Palette.hasPaletteType()).to.equal(false);
				expect(Palette.hasPaletteType("")).to.equal(false);
				expect(Palette.hasPaletteType(" ")).to.equal(false);
				expect(Palette.hasPaletteType("\t")).to.equal(false);
				expect(Palette.hasPaletteType("No")).to.equal(false);
			});
		});

		describe("static indexOfPaletteType", function() {
			it("should be a function", function() {
				expect(Palette.indexOfPaletteType).to.be.an.instanceof(Function);
			});

			it("should return the index of a palette type using a strict object with a valid name property", function() {
				const paletteTypeIndex = Palette.indexOfPaletteType({ name: "ACT" });

				expect(paletteTypeIndex).to.be.a("number");
				expect(paletteTypeIndex).to.not.equal(-1);
			});

			it("should case insensitively return the index of a palette type using a strict object with a valid name property", function() {
				const paletteTypeIndex = Palette.indexOfPaletteType({ name: "aCt" });

				expect(paletteTypeIndex).to.be.a("number");
				expect(paletteTypeIndex).to.not.equal(-1);
			});

			it("should return the index of a palette type using a valid string", function() {
				const paletteTypeIndex = Palette.indexOfPaletteType("ACT");

				expect(paletteTypeIndex).to.be.a("number");
				expect(paletteTypeIndex).to.not.equal(-1);
			});

			it("should case insensitively return the index of a palette type using a valid string", function() {
				const paletteTypeIndex = Palette.indexOfPaletteType("aCt");

				expect(paletteTypeIndex).to.be.a("number");
				expect(paletteTypeIndex).to.not.equal(-1);
			});

			it("should return -1 for a strict object with an invalid name property", function() {
				expect(Palette.indexOfPaletteType({ name: "No" })).to.equal(-1);
				expect(Palette.indexOfPaletteType({ })).to.equal(-1);
			});

			it("should return -1 for an empty or invalid string", function() {
				expect(Palette.indexOfPaletteType()).to.equal(-1);
				expect(Palette.indexOfPaletteType("")).to.equal(-1);
				expect(Palette.indexOfPaletteType(" ")).to.equal(-1);
				expect(Palette.indexOfPaletteType("\t")).to.equal(-1);
				expect(Palette.indexOfPaletteType("No")).to.equal(-1);
			});
		});

		describe("static getPaletteType", function() {
			it("should be a function", function() {
				expect(Palette.getPaletteType).to.be.an.instanceof(Function);
			});

			it("should return null for invalid palette type indexes", function() {
				expect(Palette.getPaletteType(-1)).to.be.null;
				expect(Palette.getPaletteType(80)).to.be.null;
			});

			it("should return a palette type at a valid index", function() {
				expect(Palette.getPaletteType(0)).to.equal(Palette.types[0]);
			});

			it("should return a palette type using a strict object with a valid name property", function() {
				expect(Palette.getPaletteType({ name: "ACT" })).to.be.an.instanceof(Palette.Type);
			});

			it("should case insensitively return a palette type using a strict object with a valid name property", function() {
				expect(Palette.getPaletteType({ name: "aCt" })).to.be.an.instanceof(Palette.Type);
			});

			it("should return a palette type using a valid string", function() {
				expect(Palette.getPaletteType("ACT")).to.be.an.instanceof(Palette.Type);
			});

			it("should case insensitively return a palette type using a valid string", function() {
				expect(Palette.getPaletteType("aCt")).to.be.an.instanceof(Palette.Type);
			});

			it("should return null for a strict object with an invalid name property", function() {
				expect(Palette.getPaletteType({ name: "Missing" })).to.equal(null);
				expect(Palette.getPaletteType({ })).to.equal(null);
			});

			it("should return null for an empty or invalid string", function() {
				expect(Palette.getPaletteType()).to.equal(null);
				expect(Palette.getPaletteType("")).to.equal(null);
				expect(Palette.getPaletteType(" ")).to.equal(null);
				expect(Palette.getPaletteType("\t")).to.equal(null);
				expect(Palette.getPaletteType("Missing")).to.equal(null);
			});
		});

		describe("static addPaletteType", function() {
			it("should be a function", function() {
				expect(Palette.addPaletteType).to.be.an.instanceof(Function);
			});

			it("should throw an error for invalid palette types", function() {
				expect(function() { Palette.addPaletteType(null, null); }).to.throw(Error);
				expect(function() { Palette.addPaletteType("TEST", null); }).to.throw(Error);
				expect(function() { Palette.addPaletteType(null, PaletteTest); }).to.throw(Error);
				expect(function() { Palette.addPaletteType(new Palette.Type(null, null)); }).to.throw(Error);
				expect(function() { Palette.addPaletteType(new Palette.Type("TEST", null)); }).to.throw(Error);
				expect(function() { Palette.addPaletteType(new Palette.Type(null, PaletteTest)); }).to.throw(Error);
			});

			it("should throw an error for palette types with duplicate names", function() {
				expect(function() { Palette.addPaletteType("TEST", PaletteTest); }).to.not.throw();
				expect(function() { Palette.addPaletteType("TEST", PaletteTest); }).to.throw(Error);

				Palette.removePaletteType("TEST");
			});

			it("should add a valid palette type", function() {
				const previousNumberOfPalettes = Palette.numberOfPaletteTypes();

				expect(Palette.hasPaletteType("TEST")).to.be.false;

				expect(function() { Palette.addPaletteType(new Palette.Type("TEST", PaletteTest)); }).to.not.throw();

				expect(Palette.numberOfPaletteTypes()).to.equal(previousNumberOfPalettes + 1);
				expect(Palette.hasPaletteType("TEST")).to.be.true;

				Palette.removePaletteType("TEST");
			});

			it("should create and add a new palette type when a type and subclass are provided", function() {
				const previousNumberOfPalettes = Palette.numberOfPaletteTypes();

				expect(Palette.hasPaletteType("TEST")).to.be.false;

				expect(function() { Palette.addPaletteType("TEST", PaletteTest); }).to.not.throw();

				expect(Palette.numberOfPaletteTypes()).to.equal(previousNumberOfPalettes + 1);
				expect(Palette.hasPaletteType("TEST")).to.be.true;

				Palette.removePaletteType("TEST");
			});
		});

		describe("static removePaletteType", function() {
			it("should be a function", function() {
				expect(Palette.removePaletteType).to.be.an.instanceof(Function);
			});

			it("should return null for palette types that do not exist", function() {
				const previousNumberOfPalettes = Palette.numberOfPaletteTypes();

				expect(Palette.removePaletteType("TEST")).to.be.null;

				expect(Palette.numberOfPaletteTypes()).to.equal(previousNumberOfPalettes);
			});

			it("should remove a palette type by index and return it", function() {
				const previousNumberOfPalettes = Palette.numberOfPaletteTypes();
				const testPaletteType = new Palette.Type("TEST", PaletteTest);

				Palette.addPaletteType(testPaletteType);

				const testPaletteTypeIndex = Palette.indexOfPaletteType(testPaletteType);

				expect(Palette.hasPaletteType("TEST")).to.be.true;
				expect(Palette.numberOfPaletteTypes()).to.equal(previousNumberOfPalettes + 1);

				expect(Palette.removePaletteType(testPaletteTypeIndex)).to.equal(testPaletteType);

				expect(Palette.hasPaletteType("TEST")).to.be.false;
				expect(Palette.numberOfPaletteTypes()).to.equal(previousNumberOfPalettes);
			});

			it("should remove a palette type by name and return it", function() {
				const previousNumberOfPalettes = Palette.numberOfPaletteTypes();
				const testPaletteType = new Palette.Type("TEST", PaletteTest);

				Palette.addPaletteType(testPaletteType);

				expect(Palette.hasPaletteType("TEST")).to.be.true;
				expect(Palette.numberOfPaletteTypes()).to.equal(previousNumberOfPalettes + 1);

				expect(Palette.removePaletteType("TEST")).to.equal(testPaletteType);

				expect(Palette.hasPaletteType("TEST")).to.be.false;
				expect(Palette.numberOfPaletteTypes()).to.equal(previousNumberOfPalettes);
			});

			it("should remove a palette type by value and return it", function() {
				const previousNumberOfPalettes = Palette.numberOfPaletteTypes();
				const testPaletteType = new Palette.Type("TEST", PaletteTest);

				Palette.addPaletteType(testPaletteType);

				expect(Palette.hasPaletteType("TEST")).to.be.true;
				expect(Palette.numberOfPaletteTypes()).to.equal(previousNumberOfPalettes + 1);

				expect(Palette.removePaletteType(testPaletteType)).to.equal(testPaletteType);

				expect(Palette.hasPaletteType("TEST")).to.be.false;
				expect(Palette.numberOfPaletteTypes()).to.equal(previousNumberOfPalettes);
			});
		});

		describe("static clearPaletteTypes", function() {
			it("should be a function", function() {
				expect(Palette.clearPaletteTypes).to.be.an.instanceof(Function);
			});

			it("should remove all palette types", function() {
				const previousPaletteTypes = [...Palette.types];
				const previousNumberOfPaletteTypes = Palette.numberOfPaletteTypes();

				Palette.clearPaletteTypes();

				expect(Palette.numberOfPaletteTypes()).to.equal(0);

				for(let i = 0; i < previousPaletteTypes.length; i++) {
					Palette.addPaletteType(previousPaletteTypes[i]);
				}
			});
		});

		describe("createNewData", function() {
			it("should be a function", function() {
				expect(Palette.prototype.createNewData).to.be.an.instanceof(Function);
			});

			it("should be abstract and throw an error if invoked directly", function() {
				expect(function() { Palette.prototype.createNewData(); }).to.throw();
			});
		});

		describe("getFileName", function() {
			it("should be a function", function() {
				expect(Palette.prototype.getFileName).to.be.an.instanceof(Function);
			});

			it("should return null if the file path is empty or null", function() {
				const testPalette = new PaletteTest("", paletteTestFileType, "");

				expect(testPalette.getFileName()).to.equal(null);

				testPalette.filePath = null;

				expect(testPalette.getFileName()).to.equal(null);
			});

			it("should extract the file name from a valid file path", function() {
				const testPalette = new PaletteTest("", paletteTestFileType, "VALID.BIN");

				expect(testPalette.getFileName()).to.equal("VALID.BIN");

				testPalette.filePath = "some/path/to/FILE.BIN";

				expect(testPalette.getFileName()).to.equal("FILE.BIN");
			});
		});

		describe("getFileExtension", function() {
			it("should be a function", function() {
				expect(Palette.prototype.getFileExtension).to.be.an.instanceof(Function);
			});

			it("should return an empty string if the file path is empty", function() {
				const testPalette = new PaletteTest("", paletteTestFileType, "");

				expect(testPalette.getFileExtension()).to.be.a("string").that.is.empty;
			});

			it("should return bull if the file path is null", function() {
				const testPalette = new PaletteTest("", paletteTestFileType, "");

				testPalette.filePath = null;

				expect(testPalette.getFileExtension()).to.equal(null);
			});

			it("should extract the file extension from a valid file path", function() {
				const testPalette = new PaletteTest("", paletteTestFileType, "VALID.BIN");

				expect(testPalette.getFileExtension()).to.equal("BIN");

				testPalette.filePath = "some/path/to/FILE.EXE";

				expect(testPalette.getFileExtension()).to.equal("EXE");
			});
		});

		describe("numberOfFileTypes", function() {
			it("should be a function", function() {
				expect(Palette.prototype.numberOfFileTypes).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("hasFileType", function() {
			it("should be a function", function() {
				expect(Palette.prototype.hasFileType).to.be.an.instanceof(Function);
			});

			// TODO: actually needs testing elsewhere
		});

		describe("indexOfFileType", function() {
			it("should be a function", function() {
				expect(Palette.prototype.indexOfFileType).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("getFileType", function() {
			it("should be a function", function() {
				expect(Palette.prototype.getFileType).to.be.an.instanceof(Function);
			});

			// index

			// TODO
		});

		describe("addFileType", function() {
			it("should be a function", function() {
				expect(Palette.prototype.addFileType).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("removeFileType", function() {
			it("should be a function", function() {
				expect(Palette.prototype.removeFileType).to.be.an.instanceof(Function);
			});

			// index

			// TODO
		});

		describe("clearFileTypes", function() {
			it("should be a function", function() {
				expect(Palette.prototype.clearFileTypes).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("numberOfSubPalettes", function() {
			it("should be a function", function() {
				expect(Palette.prototype.numberOfSubPalettes).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("getPaletteDescription", function() {
			it("should be a function", function() {
				expect(Palette.prototype.getPaletteDescription).to.be.an.instanceof(Function);
			});

			it("should be abstract and throw an error if invoked directly", function() {
				expect(function() { Palette.prototype.getPaletteDescription(); }).to.throw();
			});
		});

		describe("getPaletteDescriptions", function() {
			it("should be a function", function() {
				expect(Palette.prototype.getPaletteDescriptions).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("getPaletteDescriptionsAsString", function() {
			it("should be a function", function() {
				expect(Palette.prototype.getPaletteDescriptionsAsString).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("getPixel", function() {
			it("should be a function", function() {
				expect(Palette.prototype.getPixel).to.be.an.instanceof(Function);
			});

			it("should be abstract and throw an error if invoked directly", function() {
				expect(function() { Palette.prototype.getPixel(); }).to.throw();
			});
		});

		describe("lookupPixel", function() {
			it("should be a function", function() {
				expect(Palette.prototype.lookupPixel).to.be.an.instanceof(Function);
			});

			it("should return null for invalid lookup values", function() {
				const testPalette = new PaletteTest("", paletteTestFileType, "DATA.BIN");

				expect(testPalette.lookupPixel(-Infinity, 0)).to.equal(null);
			});

			it("should return null for lookup values that are negative or exceed the palette size", function() {
				const testPalette = new PaletteTest("", paletteTestFileType, "DATA.BIN");

				expect(testPalette.lookupPixel(-1, 0)).to.equal(null);
				expect(testPalette.lookupPixel(Palette.NumberOfColours, 0)).to.equal(null);
			});

			it("should invoke getPixel with the correct x / y co-ordinates and index values", function() {
				const testPalette = new PaletteTest("", paletteTestFileType, "DATA.BIN");

				sinon.stub(testPalette, "getPixel").callsFake(function(x, y, index) {
					return null;
				});

				for(let i = 0; i < 256; i++) {
					expect(function() { testPalette.lookupPixel(i, i + 1000); }).to.not.throw();
					expect(testPalette.getPixel.callCount).to.equal(i + 1);
					expect(testPalette.getPixel.getCall(i).calledWithExactly(i % 16, Math.floor(i / 16), i + 1000)).to.equal(true);
				}

				testPalette.getPixel.restore();
			});
		});

		describe("updatePixel", function() {
			it("should be a function", function() {
				expect(Palette.prototype.updatePixel).to.be.an.instanceof(Function);
			});

			it("should be abstract and throw an error if invoked directly", function() {
				expect(function() { Palette.prototype.updatePixel(); }).to.throw();
			});
		});

		describe("getColourData", function() {
			it("should be a function", function() {
				expect(Palette.prototype.getColourData).to.be.an.instanceof(Function);
			});

			it("should return null for invalid indexes", function() {
				const testPalette = new PaletteTest("", paletteTestFileType, "DATA.BIN");

				expect(testPalette.getColourData(Infinity)).to.equal(null);
			});

			it("should return null for indexes that are negative or exceed the number of sub palettes", function() {
				const testPalette = new PaletteTest("", paletteTestFileType, "DATA.BIN");

				expect(testPalette.getColourData(-1)).to.equal(null);
				expect(testPalette.getColourData(1)).to.equal(null);
			});

			it("should correctly obtain all of the pixels in a palette as an array of colour objects", function() {
				const testPalette = new PaletteTest("", paletteTestFileType, "DATA.BIN");

				sinon.stub(testPalette, "getPixel").callsFake(function(x, y, index) {
					return new Colour(x, y, index);
				});

				const colourData = testPalette.getColourData(0);

				expect(colourData).to.be.an("array").that.is.not.empty;
				expect(colourData.length).to.equal(256);

				for(let i = 0; i < colourData.length; i++) {
					expect(colourData[i]).to.be.an.instanceof(Colour);
				}

				expect(testPalette.getPixel.callCount).to.equal(256);

				for(let i = 0; i < testPalette.getPixel.callCount; i++) {
					expect(testPalette.getPixel.getCall(i).calledWithExactly(i % 16, Math.floor(i / 16), 0)).to.equal(true);
				}

				testPalette.getPixel.restore();
			});
		});

		describe("getAllColourData", function() {
			it("should be a function", function() {
				expect(Palette.prototype.getAllColourData).to.be.an.instanceof(Function);
			});

			it("should correctly obtain all of the pixels for multiple sub-palettes as an array of colour objects", function() {
				const testPalette = new PaletteTest("", paletteTestFileType, "DATA.BIN");

				sinon.stub(testPalette, "numberOfSubPalettes").callsFake(function() {
					return 2;
				});

				sinon.stub(testPalette, "getPixel").callsFake(function(x, y, index) {
					return new Colour(x, y, index);
				});

				const colourData = testPalette.getAllColourData();

				expect(colourData).to.be.an("array").that.is.not.empty;
				expect(colourData.length).to.equal(512);

				for(let i = 0; i < colourData.length; i++) {
					expect(colourData[i]).to.be.an.instanceof(Colour);
				}

				expect(testPalette.getPixel.callCount).to.equal(512);

				let c = 0;

				for(let i = 0; i < 2; i++) {
					for(let j = 0; j < 256; j++) {
						expect(testPalette.getPixel.getCall(c++).calledWithExactly(j % 16, Math.floor(j / 16), i)).to.equal(true);
					}
				}

				testPalette.getPixel.restore();
				testPalette.numberOfSubPalettes.restore();
			});
		});

		describe("updateColourData", function() {
			it("should be a function", function() {
				expect(Palette.prototype.updateColourData).to.be.an.instanceof(Function);
			});

			it("should be abstract and throw an error if invoked directly", function() {
				expect(function() { Palette.prototype.updateColourData(); }).to.throw();
			});
		});

		describe("updateAllColourData", function() {
			it("should be a function", function() {
				expect(Palette.prototype.updateAllColourData).to.be.an.instanceof(Function);
			});

			it("should correctly invoke updateColourData with the correct index, data index and colour data values", function() {
				const testPalette = new PaletteTest("", paletteTestFileType, "DATA.BIN");

				sinon.stub(testPalette, "updateColourData").callsFake(function() { });

				testPalette.updateAllColourData([Colour.Pink]);

				expect(testPalette.updateColourData.calledOnce).to.equal(true);
				expect(testPalette.updateColourData.firstCall.calledWithExactly(0, 0, [Colour.Pink])).to.equal(true);

				testPalette.updateColourData.restore();
			});
		});

		describe("fillWithColour", function() {
			it("should be a function", function() {
				expect(Palette.prototype.fillWithColour).to.be.an.instanceof(Function);
			});

			it("should be abstract and throw an error if invoked directly", function() {
				expect(function() { Palette.prototype.fillWithColour(); }).to.throw();
			});
		});

		describe("fillAllWithColour", function() {
			it("should be a function", function() {
				expect(Palette.prototype.fillAllWithColour).to.be.an.instanceof(Function);
			});

			it("should correctly invoke fillWithColour with the correct r, g, b, a and index values", function() {
				const testPalette = new PaletteTest("", paletteTestFileType, "DATA.BIN");

				sinon.stub(testPalette, "fillWithColour").callsFake(function() { });

				testPalette.fillAllWithColour(4, 2, 0, 69);

				expect(testPalette.fillWithColour.calledOnce).to.equal(true);
				expect(testPalette.fillWithColour.firstCall.calledWithExactly(4, 2, 0, 69, -1)).to.equal(true);

				testPalette.fillWithColour.restore();
			});
		});

		describe("static determinePaletteType", function() {
			it("should be a function", function() {
				expect(Palette.determinePaletteType).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("static deserialize", function() {
			it("should be a function", function() {
				expect(Palette.deserialize).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("static readFrom", function() {
			it("should be a function", function() {
				expect(Palette.readFrom).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("writeTo", function() {
			it("should be a function", function() {
				expect(Palette.prototype.writeTo).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("save", function() {
			it("should be a function", function() {
				expect(Palette.prototype.save).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("equals", function() {
			it("should be a function", function() {
				expect(Palette.prototype.equals).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("toString", function() {
			it("should be a function", function() {
				expect(Palette.prototype.toString).to.be.an.instanceof(Function);
			});

			it("should correctly stringify palette instances with no file path", function() {
				const testPalette = new PaletteTest("FAKE DATA", paletteTestFileType);

				expect(testPalette.toString()).to.equal("PaletteTest");
			});

			it("should correctly stringify palette instances with a valid file path", function() {
				const testPalette = new PaletteTest("PREMIUM PRICES", paletteTestFileType, "data/PATH.BIN");

				expect(testPalette.toString()).to.equal("PaletteTest (PATH.BIN)");
			});
		});

		describe("static isPalette", function() {
			it("should be a function", function() {
				expect(Palette.isPalette).to.be.an.instanceof(Function);
			});

			it("should return true for instances of Palette", function() {
				expect(Palette.isPalette(new PaletteTest("data", paletteTestFileType, "TRUE.BIN"))).to.equal(true);
			});

			it("should return false for invalid values", function() {
				expect(Palette.isPalette(null)).to.equal(false);
				expect(Palette.isPalette({ })).to.equal(false);
			});
		});

		describe("validateData", function() {
			it("should be a function", function() {
				expect(Palette.prototype.validateData).to.be.an.instanceof(Function);
			});

			it("should be abstract and throw an error if invoked directly", function() {
				expect(function() { Palette.prototype.validateData(); }).to.throw();
			});
		});

		describe("isValid", function() {
			it("should be a function", function() {
				expect(Palette.prototype.isValid).to.be.an.instanceof(Function);
			});

			it("should return true for valid palettes", function() {
				const testPalette = new PaletteTest("VALID", paletteTestFileType, "VALID.BIN");
				testPalette.addFileType(paletteTestFileType);

				expect(testPalette.isValid()).to.equal(true);
			});

			it("should return false if the file type is invalid", function() {
				const testPalette = new PaletteTest("", new Palette.FileType(-69, "U", "WOT"), "DATA.BIN");

				expect(testPalette.isValid()).to.equal(false);
			});

			it("should return false if the file type is not in the list of supported file types for the corresponding palette type", function() {
				const testPalette = new PaletteTest("", paletteTestFileType, "OK.BIN");

				expect(testPalette.isValid()).to.equal(false);

				testPalette.addFileType(new Palette.FileType("Uuuuuuuuu", "UUU"));

				expect(testPalette.isValid()).to.equal(false);
			});

			it("should return false if the data value is null", function() {
				const testPalette = new PaletteTest(null, paletteTestFileType, "NULL.BIN");
				testPalette.addFileType(paletteTestFileType);

				expect(testPalette.isValid()).to.equal(false);
			});
		});

		describe("static isValid", function() {
			it("should be a function", function() {
				expect(Palette.isValid).to.be.an.instanceof(Function);
			});

			it("should return true for valid palettes", function() {
				const testPalette = new PaletteTest("VALID", paletteTestFileType, "VALID.BIN");
				testPalette.addFileType(paletteTestFileType);

				expect(Palette.isValid(testPalette)).to.equal(true);
			});

			it("should return false if the file type is invalid", function() {
				const testPalette = new PaletteTest("", new Palette.FileType(-69, "U", "WOT"), "DATA.BIN");

				expect(Palette.isValid(testPalette)).to.equal(false);
			});

			it("should return false if the file type is not in the list of supported file types for the corresponding palette type", function() {
				const testPalette = new PaletteTest("", paletteTestFileType, "OK.BIN");

				expect(Palette.isValid(testPalette)).to.equal(false);

				testPalette.addFileType(new Palette.FileType("Uuuuuuuuu", "UUU"));

				expect(Palette.isValid(testPalette)).to.equal(false);
			});

			it("should return false if the data value is null", function() {
				const testPalette = new PaletteTest(null, paletteTestFileType, "NULL.BIN");
				testPalette.addFileType(paletteTestFileType);

				expect(Palette.isValid(testPalette)).to.equal(false);
			});

			it("should return false for invalid values", function() {
				expect(Palette.isValid(null)).to.equal(false);
				expect(Palette.isValid({ })).to.equal(false);
			});
		});
	});
});
