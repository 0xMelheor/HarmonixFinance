const { expect } = require("chai");
const { ethers } = require("hardhat");
const { expectRevert } = require('@openzeppelin/test-helpers');
const { accounts, contract } = require('@openzeppelin/test-environment');


describe("Harmonix Vault", function () {
    beforeEach(async function () {
        // system creates the vault, user owns the key, user1 is a different user
        [system, user, user1, outsider, sushiSystem] = await ethers.getSigners();

        MasterChef = await ethers.getContractFactory("MasterChef");
        SushiToken = await ethers.getContractFactory("SushiToken");
        LP = await ethers.getContractFactory("ERC20Mock");
        Vault = await ethers.getContractFactory("Vault");
        Strategy = await ethers.getContractFactory("IdleStrategy");
        HarmonixKey = await ethers.getContractFactory("HarmonixKey");

        // launch DEX
        sushi = await SushiToken.deploy();
        await sushi.deployed();
        chef = await MasterChef.deploy(sushi.address, sushiSystem.address, 1000, 0, 1000);
        await chef.deployed();
        await sushi.transferOwnership(chef.address);

        // launch pool


        // launch compounder
        lp = await LP.deploy("LPToken", "LP", system.address, 10000);
        await lp.deployed();
        vault = await Vault.deploy(
            "Awesome Investment!",
            lp.address
        );
        await vault.deployed();
        strategy = await Strategy.deploy(
            lp.address,
            vault.address,
            system.address,
            chef.address,
            1000,
            1000,
            lp.address
        );
        await strategy.deployed();
        await vault.addStrategy(strategy.address);

        v0 = vault.connect(user);
        v1 = vault.connect(user1);
        v2 = vault.connect(outsider);
    });

    it("reports correct vault identity", async function () {
        expect(await vault.name() == "Awesome Investment!");
        expect(await vault.symbol() == "HMXV");
    });

    it("vault refuses to interact with user without key", async function () {
        await lp.transfer(user.address, 100);
        await expectRevert(
            v0.approve(vault.address, 100),
            "no active keys"
        );
    });

    it("creating account results in user obtaining an NFT and interactions to succeed", async function () {
        await vault.setActiveStrategy(strategy.address);
        await lp.transfer(user.address, 100);
        await v0.createAccount();
        await lp.connect(user).approve(vault.address, 100);
        await v0.deposit(lp.address, 100);
    });

    it("can't deposit to vault with no active strategy", async function () {
        await lp.transfer(user.address, 100);
        await v0.createAccount();
        await lp.connect(user).approve(vault.address, 100);
        await expectRevert(
            v0.deposit(lp.address, 100),
            "Vault::no active strategy"
        );
    });

    it("can't deposit unsupported token", async function () {
        await vault.setActiveStrategy(strategy.address);
        const lp1 = await LP.deploy("Another Token", "LP", user.address, 10000);
        await lp1.deployed();
        await v0.createAccount();
        await lp1.connect(user).approve(vault.address, 100);
        await expectRevert(
            v0.deposit(lp1.address, 100),
            "Vault::deposit, token not supported"
        );
    });
});