const { expect } = require("chai");
const { ethers } = require("hardhat");
const { expectRevert } = require('@openzeppelin/test-helpers');


describe("Harmonix Vault Cell", function () {
    beforeEach(async function () {
        VaultKey = await ethers.getContractFactory("HarmonixKey");
        VaultCell = await ethers.getContractFactory("VaultCell");

        key = await VaultKey.deploy();
        await key.deployed();

        // vault = await VaultCell.deploy(key.address);
        // await vault.deployed();

        // system creates the vault, user owns the key, user1 is a different user
        [system, user, user1] = await ethers.getSigners();
        k0 = key.connect(user);
        // v0 = vault.connect(user);

        k1 = key.connect(user1);
        // v1 = vault.connect(user1);
    });

    it("vault key can only be assigned once", async function () {
        vault = await VaultCell.deploy(key.address);
        await vault.deployed();
        let tx = await key.mint(user.address);
        let receipt = await tx.wait();

        // grab ID from last event
        let keyID = receipt.events[0].args.tokenId;
        
        await vault.assignKey(keyID);
        await expectRevert(
            vault.assignKey(keyID),
            "key already exists"
        );
    });

    it("system can check assigned key when hidden", async function () {
        vault = await VaultCell.deploy(key.address);
        await vault.deployed();
        let tx = await key.mint(user.address);
        let receipt = await tx.wait();

        // grab ID from last event
        let keyID = receipt.events[0].args.tokenId;
        
        await vault.assignKey(keyID);
        expect(await vault.checkKey(keyID) == true);
    });

    it("owner can check assigned key when hidden", async function () {
        vault = await VaultCell.deploy(key.address);
        await vault.deployed();
        const v0 = vault.connect(user);

        let tx = await key.mint(user.address);
        let receipt = await tx.wait();
        let keyID = receipt.events[0].args.tokenId;
        
        await vault.assignKey(keyID);
        expect(await v0.checkKey(keyID) == true);
    });

    it("others can't see assigned key when hidden", async function () {
        vault = await VaultCell.deploy(key.address);
        await vault.deployed();
        const v1 = vault.connect(user1);

        let tx = await key.mint(user.address);
        let receipt = await tx.wait();
        let keyID = receipt.events[0].args.tokenId;
        
        await vault.assignKey(keyID);
        expect(await v1.checkKey(keyID) == false);
    });

    it("owner can unhide key so others can see vault data", async function () {
        vault = await VaultCell.deploy(key.address);
        await vault.deployed();
        const v1 = vault.connect(user1);

        let tx = await key.mint(user.address);
        let receipt = await tx.wait();
        let keyID = receipt.events[0].args.tokenId;
        
        await vault.assignKey(keyID);
        await k0.show(keyID);
        expect(await v1.checkKey(keyID) == true);
    });

    it("only owner can unhide key", async function () {
        vault = await VaultCell.deploy(key.address);
        await vault.deployed();
        const v1 = vault.connect(user1);

        let tx = await key.mint(user.address);
        let receipt = await tx.wait();
        let keyID = receipt.events[0].args.tokenId;
        
        await vault.assignKey(keyID);

        // other users can't unhide key
        await k1.show(keyID);
        expect(await v1.checkKey(keyID) == false);

        // system can't unhide key
        await key.show(keyID);
        expect(await v1.checkKey(keyID) == false);
    });

    it("key can be hidden again", async function () {
        vault = await VaultCell.deploy(key.address);
        await vault.deployed();
        const v1 = vault.connect(user1);

        let tx = await key.mint(user.address);
        let receipt = await tx.wait();
        let keyID = receipt.events[0].args.tokenId;
        
        await vault.assignKey(keyID);

        // hidden
        expect(await v1.checkKey(keyID) == false);

        // visible
        await k0.show(keyID);
        expect(await v1.checkKey(keyID) == true);

        // hidden
        await k0.hide(keyID);
        expect(await v1.checkKey(keyID) == false);
    });

    it("only owner can hide key", async function () {
        vault = await VaultCell.deploy(key.address);
        await vault.deployed();
        const v1 = vault.connect(user1);

        let tx = await key.mint(user.address);
        let receipt = await tx.wait();
        let keyID = receipt.events[0].args.tokenId;
        
        await vault.assignKey(keyID);

        // hidden
        expect(await v1.checkKey(keyID) == false);

        // visible
        await k0.show(keyID);
        expect(await v1.checkKey(keyID) == true);

        // still visible
        await key.hide(keyID);
        expect(await v1.checkKey(keyID) == true);

        // still visible
        await k1.hide(keyID);
        expect(await v1.checkKey(keyID) == true);
    });
});