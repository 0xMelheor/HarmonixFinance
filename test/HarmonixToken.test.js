const { expect } = require("chai");
const { ethers } = require("hardhat");
const { expectRevert } = require('@openzeppelin/test-helpers');
const { accounts, contract } = require('@openzeppelin/test-environment');

async function increaseTime(seconds) {
    return ethers.provider.send('evm_increaseTime', [seconds])
}

describe("Harmonix Token", function () {

  const cap = ethers.utils.parseEther('100,000,000'.replace(/,/g, ''));
  const TIMELOCK = 2 * 24 * 60 * 60;

  let token;
  let owner;
  let other;
  let tokenOther;
  let other1;
  let tokenOther1;

  beforeEach(async function () {
    const Token = await ethers.getContractFactory("HMX");
    token = await Token.deploy();
    await token.deployed();
    [owner, other, other1] = await ethers.getSigners();
    tokenOther = token.connect(other);
    tokenOther1 = token.connect(other1);
  });

  it("has correct name and symbol", async function () {
    expect(await token.name()).to.equal("Harmonix");
    expect(await token.symbol()).to.equal("HMX");
  });

  it("has a max cap", async function () {
    expect(await token.cap()).to.equal(cap);
  });

  it("initial governance matches owner", async function () {
    expect(await token.governance()).to.equal(owner.address);
  });

  it("can't mint without permission from governance", async function () {
    await expectRevert(
      token.scheduleMint(100, { from: owner.address }),
      "!minter"
    );
  });

  it("governance can add minter", async function () {
    await token.addMinter(other.address, { from: owner.address });
    await tokenOther.scheduleMint(100, { from: other.address });
  });

  it("fires AddMinter event", async function () {
    await expect(
      token.addMinter(other.address, { from: owner.address })
    ).to.emit(token, "AddMinter").withArgs(other.address);
  });

  it("fires MintScheduled event", async function () {
    await token.addMinter(other.address, { from: owner.address });
    await expect(
      tokenOther.scheduleMint(100, { from: other.address })
    ).to.emit(token, "MintScheduled").withArgs(other.address, 100);
  });

  it("others can't add minter", async function () {
    await expectRevert(
      tokenOther.addMinter(owner.address, { from: other.address }),
      "!governance"
    )
  });

  it("governance can remove minter", async function () {
    await token.addMinter(other.address, { from: owner.address });
    await tokenOther.scheduleMint(100, { from: other.address });
    await token.removeMinter(other.address, { from: owner.address });
    await expectRevert(
      tokenOther.scheduleMint(100, { from: other.address }),
      "!minter"
    )
  });

  it("fires RemoveMinter event", async function () {
    await token.addMinter(other.address, { from: owner.address });
    await expect(
      token.removeMinter(other.address, { from: owner.address })
    ).to.emit(token, "RemoveMinter").withArgs(other.address);
  });

  it("can't mint without approval", async function () {
    await token.addMinter(other.address, { from: owner.address });
    await expectRevert(
      tokenOther.mint(other.address, 100, { from: other.address }),
      "!approved"
    );
  });

  it("can't request approval over cap", async function () {
    await token.addMinter(other.address, { from: owner.address });
    await expectRevert(
      tokenOther.scheduleMint(cap.add(1), { from: other.address }),
      "ERC20Capped: cap exceeded"
    )
  });

  it("can't mint before timelock", async function () {
    await token.addMinter(other.address, { from: owner.address });
    await tokenOther.scheduleMint(100, { from: other.address });
    await expectRevert(
      tokenOther.mint(other.address, 100, { from: other.address }),
      "timelock"
    )
  });

  it("can mint after timelock", async function () {
    await token.addMinter(other.address, { from: owner.address });
    await tokenOther.scheduleMint(100, { from: other.address });
    await increaseTime(TIMELOCK);
    await tokenOther.mint(other.address, 100, { from: other.address });
  });

  it("can't mint over approved limit", async function () {
    await token.addMinter(other.address, { from: owner.address });
    await tokenOther.scheduleMint(100, { from: other.address });
    await increaseTime(TIMELOCK);
    await expectRevert(
      tokenOther.mint(other.address, 1000, { from: other.address }),
      ">amount"
    )
  });

  it("can mint repeatedly until approved limit", async function () {
    await token.addMinter(other.address, { from: owner.address });
    await tokenOther.scheduleMint(100, { from: other.address });
    await increaseTime(TIMELOCK);
    await tokenOther.mint(other.address, 70, { from: other.address });
    await tokenOther.mint(other.address, 20, { from: other.address });
    await expectRevert(
      tokenOther.mint(other.address, 11, { from: other.address }),
      ">amount"
    )
    await tokenOther.mint(other.address, 10, { from: other.address });
  });

  it("can't schedule mint over cap", async function () {
    await token.addMinter(other.address, { from: owner.address });
    await expectRevert(
      tokenOther.scheduleMint(cap.add(1), { from: other.address }),
      "ERC20Capped: cap exceeded"
    )
  });

  it("can't mint over cap", async function () {
    await token.addMinter(other.address, { from: owner.address });
    await token.addMinter(other1.address, { from: owner.address });
    await tokenOther.scheduleMint(cap, { from: other.address });
    await tokenOther1.scheduleMint(cap, { from: other1.address });
    await increaseTime(TIMELOCK);
    await tokenOther.mint(other.address, cap.sub(100), { from: other.address });
    await expectRevert(
      tokenOther1.mint(other1.address, 200, { from: other1.address }),
      "ERC20Capped: cap exceeded"
    )
    await tokenOther1.mint(other.address, 100, { from: other1.address });
  });

  it("can't mint scheduled mint after losing priviledges", async function () {
    await token.addMinter(other.address, { from: owner.address });
    await tokenOther.scheduleMint(100, { from: other.address });
    await token.removeMinter(other.address, { from: owner.address });
    await increaseTime(TIMELOCK);
    await expectRevert(
      tokenOther.mint(other.address, 100, { from: other.address }),
      "!minter"
    )
  });

  it("can cancel mint", async function() {
    await token.addMinter(other.address, { from: owner.address });
    await tokenOther.scheduleMint(100, { from: other.address });
    await tokenOther.cancelMint({ from: other.address });
    await increaseTime(TIMELOCK);
    await expectRevert(
      tokenOther.mint(other.address, 100, { from: other.address }),
      "!approved"
    );
  });

  it("cancelled mint fires event", async function () {
    await token.addMinter(other.address, { from: owner.address });
    await tokenOther.scheduleMint(100, { from: other.address });
    await expect(
      tokenOther.cancelMint({ from: other.address })
    ).to.emit(token, "MintCancelled").withArgs(other.address);
  });

  it("governance can be reassigned", async function () {
    await token.setGovernance(other.address, { from: owner.address });
    await tokenOther.addMinter(owner.address, { from: other.address });
    await expectRevert(
      token.addMinter(owner.address, { from: owner.address }),
      "!governance"
    )
  });

  it("governance can't be taken back", async function () {
    await token.setGovernance(other.address, { from: owner.address });
    await expectRevert(
      token.setGovernance(owner.address, { from: owner.address }),
      "!governance"
    )
  });

  it("governance can be given back", async function () {
    await token.setGovernance(other.address, { from: owner.address });
    await tokenOther.setGovernance(owner.address, { from: other.address });
    await token.addMinter(owner.address, { from: owner.address });
  });
});
