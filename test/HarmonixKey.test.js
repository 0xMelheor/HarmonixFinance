const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("Harmonix Vault Key", function () {

  beforeEach(async function () {
    const Token = await ethers.getContractFactory("HarmonixKeyMock");
    token = await Token.deploy();
    await token.deployed();
    [owner, other, other1] = await ethers.getSigners();
    tokenOther = token.connect(other);
    tokenOther1 = token.connect(other1);
  });

  it("has correct name and symbol", async function () {
    expect(await token.name()).to.equal("Harmonix Vault Key");
    expect(await token.symbol()).to.equal("HMXKEY");
  });

  it("can generate random token name", async function () {
    await token.generateName()
    await token.generateName()
    let name1 = await token.generatedNames(0)
    let name2 = await token.generatedNames(1)
    console.log(name1)
    console.log(name2)
    expect(name1).to.have.lengthOf.above(10);
    expect(name2).to.have.lengthOf.above(10);
    expect(name1).to.not.eql(name2);
  });

  it("can generate unique non-consecutive ID", async function () {
    await token.generateID()
    await token.generateID()
    let id1 = await token.generatedIDs(0)
    let id2 = await token.generatedIDs(1)
    console.log(id1)
    console.log(id2)
    expect(id1).to.have.lengthOf.above(10);
    expect(id2).to.have.lengthOf.above(10);
    expect(id1).to.not.eql(id2);
    expect(id1.add(1)).to.not.eql(id2);
  });
})
