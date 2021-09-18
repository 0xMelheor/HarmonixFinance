const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("Harmonix Vault Key", function () {

  beforeEach(async function () {
    const Token = await ethers.getContractFactory("HarmonixKey");
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

  it("can generate random name", async function () {
    console.log(await token.generateName())
  });

})
