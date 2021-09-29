const { expect } = require("chai");
const { ethers } = require("hardhat");
const { expectRevert } = require('@openzeppelin/test-helpers');


describe("Harmonix Vault", function () {
    beforeEach(async function () {
        Vault = await ethers.getContractFactory("Vault");
        HarmonixKey = await ethers.getContractFactory("HarmonixKey");

        vault = await Vault.deploy(
            "Awesome Investment!"
        );
        await vault.deployed();

        // system creates the vault, user owns the key, user1 is a different user
        [system, user, user1, outsider] = await ethers.getSigners();
        v0 = vault.connect(user);
        v1 = vault.connect(user1);
        v2 = vault.connect(outsider);
    });

    it("reports correct token identity", async function () {
        expect(await vault.name() == "Awesome Investment!");
        expect(await vault.symbol() == "HMXV");
    })
});