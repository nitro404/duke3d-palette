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

		it("should be a function", function() {
			expect(Palette).to.be.an.instanceof(Function);
		});

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

				expect(function() { paletteTest = new PaletteTest(Buffer.from(""), paletteTestFileType, "Test.BIN"); }).to.not.throw();
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
				// TODO
			});

			describe("fileType", function() {
				// TODO
			});

			describe("filePath", function() {
				it("should allow valid strings to be assigned", function() {
					const paletteTest = new PaletteTest(Buffer.from(""), paletteTestFileType, "Example.BIN");

					paletteTest.filePath = "Valid.BIN";

					expect(paletteTest.filePath).to.equal("Valid.BIN");
				});

				it("should trim string values assigned to it", function() {
					const paletteTest = new PaletteTest(Buffer.from(""), paletteTestFileType, "Example.BIN");

					paletteTest.filePath = "  data/EXAMPLE.BIN\t";

					expect(paletteTest.filePath).to.equal("data/EXAMPLE.BIN");
				});

				it("should assign a value of null when invalid values are provided", function() {
					const paletteTest = new PaletteTest(Buffer.from(""), paletteTestFileType, "Telepathy.BIN");

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

					const paletteTest = new PaletteTestFilePathChanged(Buffer.from(""), paletteTestFileType, "Test.BIN");

					sinon.spy(paletteTest, "onFilePathChanged");

					paletteTest.filePath = "Test2.BIN";

					expect(paletteTest.onFilePathChanged.calledOnce).to.equal(true);
					expect(paletteTest.onFilePathChanged.firstCall.calledWithExactly("Test2.BIN")).to.equal(true);

					paletteTest.onFilePathChanged.restore();
				});
			});

			describe("data", function() {
				it("should accept ByteBuffer values", function() {
					const paletteTest = new PaletteTest(Buffer.from(""), paletteTestFileType, "Testing.BIN");
					const byteBuffer = new ByteBuffer("With No Head");

					paletteTest.data = byteBuffer;

					expect(paletteTest.data).to.deep.equal(byteBuffer.toBuffer());
				});

				it("should accept Buffer values", function() {
					const paletteTest = new PaletteTest(Buffer.from(""), paletteTestFileType, "Testing.BIN");
					const buffer = Buffer.from("The Edge of Sanity");

					paletteTest.data = buffer;

					expect(paletteTest.data).to.deep.equal(buffer);
				});

				it("should accept array values", function() {
					const paletteTest = new PaletteTest(Buffer.from(""), paletteTestFileType, "Testing.BIN");

					paletteTest.data = [65, 66, 67];

					expect(paletteTest.data).to.deep.equal(Buffer.from("ABC"));
				});

				it("should accept string values", function() {
					const paletteTest = new PaletteTest(Buffer.from(""), paletteTestFileType, "Testing.BIN");

					paletteTest.data = "Seizure";

					expect(paletteTest.data).to.deep.equal(Buffer.from("Seizure"));
				});

				it("should invoke createNewData if no data or invalid data is provided", function() {
					const paletteTest = new PaletteTest(Buffer.from(""), paletteTestFileType, "Testing.BIN");

					sinon.spy(paletteTest, "createNewData");

					paletteTest.data = null;

					expect(paletteTest.createNewData.calledOnce).to.equal(true);
					expect(paletteTest.createNewData.firstCall.calledWithExactly()).to.equal(true);

					paletteTest.createNewData.restore();
				});

				it("should invoke validateData if there is any data assigned to the object", function() {
					const paletteTest = new PaletteTest(Buffer.from(""), paletteTestFileType, "Test.BIN");

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

					const paletteTest = new PaletteTestDataChanged(Buffer.from(""), paletteTestFileType, "Test.BIN");

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

			// TODO
		});

		describe("static numberOfPaletteTypes", function() {
			it("should be a function", function() {
				expect(Palette.numberOfPaletteTypes).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("static hasPaletteType", function() {
			it("should be a function", function() {
				expect(Palette.hasPaletteType).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("static indexOfPaletteType", function() {
			it("should be a function", function() {
				expect(Palette.indexOfPaletteType).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("static getPaletteType", function() {
			it("should be a function", function() {
				expect(Palette.getPaletteType).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("static addPaletteType", function() {
			it("should be a function", function() {
				expect(Palette.addPaletteType).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("static removePaletteType", function() {
			it("should be a function", function() {
				expect(Palette.removePaletteType).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("static clearPaletteTypes", function() {
			it("should be a function", function() {
				expect(Palette.clearPaletteTypes).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("createNewData", function() {
			it("should be a function", function() {
				expect(Palette.prototype.createNewData).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("getFileName", function() {
			it("should be a function", function() {
				expect(Palette.prototype.getFileName).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("getExtension", function() {
			it("should be a function", function() {
				expect(Palette.prototype.getExtension).to.be.an.instanceof(Function);
			});

			// TODO
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

			// TODO
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

			// TODO
		});

		describe("lookupPixel", function() {
			it("should be a function", function() {
				expect(Palette.prototype.lookupPixel).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("updatePixel", function() {
			it("should be a function", function() {
				expect(Palette.prototype.updatePixel).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("getColourData", function() {
			it("should be a function", function() {
				expect(Palette.prototype.getColourData).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("getAllColourData", function() {
			it("should be a function", function() {
				expect(Palette.prototype.getAllColourData).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("updateColourData", function() {
			it("should be a function", function() {
				expect(Palette.prototype.updateColourData).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("updateAllColourData", function() {
			it("should be a function", function() {
				expect(Palette.prototype.updateAllColourData).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("fillWithColour", function() {
			it("should be a function", function() {
				expect(Palette.prototype.fillWithColour).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("fillAllWithColour", function() {
			it("should be a function", function() {
				expect(Palette.prototype.fillAllWithColour).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("static determinePaletteType", function() {
			it("should be a function", function() {
				expect(Palette.determinePaletteType).to.be.an.instanceof(Function);
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

			// TODO
		});

		describe("static isPalette", function() {
			it("should be a function", function() {
				expect(Palette.isPalette).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("validateData", function() {
			it("should be a function", function() {
				expect(Palette.prototype.validateData).to.be.an.instanceof(Function);
			});

			
			// TODO
		});

		describe("isValid", function() {
			it("should be a function", function() {
				expect(Palette.prototype.isValid).to.be.an.instanceof(Function);
			});

			// TODO
		});

		describe("static isValid", function() {
			it("should be a function", function() {
				expect(Palette.isValid).to.be.an.instanceof(Function);
			});

			// TODO
		});
	});
});
