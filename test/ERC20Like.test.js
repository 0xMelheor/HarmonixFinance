const { expect } = require("chai");
const { ethers } = require("hardhat");
const { expectRevert } = require('@openzeppelin/test-helpers');


describe("Harmonix ERC20 Doppelganger That Keeps Info Private", function () {
    beforeEach(async function () {
        Token = await ethers.getContractFactory("ERC20LikeMock");
        HarmonixKey = await ethers.getContractFactory("HarmonixKey");

        token = await Token.deploy(
            "Foobarium",
            "FOO"
        );
        await token.deployed();

        // system creates the vault, user owns the key, user1 is a different user
        [system, user, user1, user2] = await ethers.getSigners();
        t0 = token.connect(user);
        t1 = token.connect(user1);
        t2 = token.connect(user2);
    });

    it("reports correct token identity", async function () {
        expect(await token.name() == "Foobarium");
        expect(await token.symbol() == "FOO");
    })

    it("can't mint to address that doesn't have key", async function () {
        await expectRevert(
            token.mint(user.address, 100),
            "no active keys"
        );
    });

    it("can mint to address that has key", async function () {
        await token.mintKey(user.address);
        await token.mint(user.address, 100);
    });

    it("minting affects balances but they're not visible to outsiders", async function () {
        await token.mintKey(user.address);

        // everyone sees the balance as zero
        expect(await token.totalSupply()).to.equal(0);
        expect(await token.balanceOf(user.address)).to.equal(0);    // system
        expect(await t0.balanceOf(user.address)).to.equal(0);       // user
        expect(await t1.balanceOf(user.address)).to.equal(0);       // outsider

        // can only be called internally by the contract
        await token.mint(user.address, 100);

        // user sees their own balance but not others
        expect(await token.totalSupply()).to.equal(100);
        expect(await token.balanceOf(user.address)).to.equal(100);  // system
        expect(await t0.balanceOf(user.address)).to.equal(100);     // user
        expect(await t1.balanceOf(user.address)).to.equal(0);       // outsider
    });

    it("can burn shares after they're no longer needed", async function () {
        await token.mintKey(user.address);
        await token.mint(user.address, 100);

        expect(await token.totalSupply()).to.equal(100);
        expect(await token.balanceOf(user.address)).to.equal(100);

        // can only be called internally by the contract
        await token.burn(user.address, 50);

        // final state
        expect(await token.totalSupply()).to.equal(50);
        expect(await token.balanceOf(user.address)).to.equal(50);
    });

    it("balances of other users are not visible to account holders either", async function () {
        await token.mintKey(user.address);
        await token.mint(user.address, 100);

        await token.mintKey(user1.address);
        await token.mint(user1.address, 25);

        expect(await token.totalSupply()).to.equal(125);

        // only system and user can see balance of user
        expect(await token.balanceOf(user.address)).to.equal(100);
        expect(await t0.balanceOf(user.address)).to.equal(100);
        expect(await t1.balanceOf(user.address)).to.equal(0);
        expect(await t2.balanceOf(user.address)).to.equal(0);

        // only system and user1 can see balance of user1
        expect(await token.balanceOf(user1.address)).to.equal(25);
        expect(await t0.balanceOf(user1.address)).to.equal(0);
        expect(await t1.balanceOf(user1.address)).to.equal(25);
        expect(await t2.balanceOf(user1.address)).to.equal(0);
    });

    it("key holder can change visibility so others can see their balance", async function () {
        await token.mintKey(user.address);
        await token.mint(user.address, 100);

        await token.mintKey(user1.address);
        await token.mint(user1.address, 25);

        expect(await token.totalSupply()).to.equal(125);

        // user changes key to visible
        keyID = await token.generatedKeys(0);
        const address = await token.getKeyContract();
        const key = await HarmonixKey.attach(address);
        const k0 = key.connect(user);
        k0.show(keyID);

        // everyone can see user balance
        expect(await token.balanceOf(user.address)).to.equal(100);
        expect(await t0.balanceOf(user.address)).to.equal(100);
        expect(await t1.balanceOf(user.address)).to.equal(100);
        expect(await t2.balanceOf(user.address)).to.equal(100);

        // only system and user1 can see balance of user1
        expect(await token.balanceOf(user1.address)).to.equal(25);
        expect(await t0.balanceOf(user1.address)).to.equal(0);
        expect(await t1.balanceOf(user1.address)).to.equal(25);
        expect(await t2.balanceOf(user1.address)).to.equal(0);

        k0.hide(keyID);

        // outsiders can't see balance anymore
        expect(await token.balanceOf(user.address)).to.equal(100);
        expect(await t0.balanceOf(user.address)).to.equal(100);
        expect(await t1.balanceOf(user.address)).to.equal(0);
        expect(await t2.balanceOf(user.address)).to.equal(0);
    });

    it("only users owning a key can send/receive transactions", async function () {
        await token.mintKey(user.address);
        await token.mint(user.address, 100);
        await expectRevert(
            t1.transfer(user.address, 50), // user1 (sender) doesn't have key (or 50 shares)
            "no active keys"
        );
        await expectRevert(
            t0.transfer(user1.address, 50), // user1 (recipient) doesn't have key
            "no active keys"
        );

        await token.mintKey(user1.address);

        // recipient still has nothing to send, but can now receive
        await expectRevert(
            t1.transfer(user.address, 50), // user1 (sender) doesn't have 50 shares
            "ERC20: transfer amount exceeds balance"
        );
        await t0.transfer(user1.address, 50);
        await t1.transfer(user.address, 25);

        // final state
        expect(await token.totalSupply()).to.equal(100);
        expect(await token.balanceOf(user.address)).to.equal(75);
        expect(await token.balanceOf(user1.address)).to.equal(25);
    });

    it("fetching balance of user without key throws an error", async function () {
        await expectRevert(
            token.balanceOf(user.address),
            "no active keys"
        );
        await token.mintKey(user.address);
        expect(await token.balanceOf(user.address)).to.equal(0);
    })

    it("deactivating key makes user unable to send/receive transactions", async function () {
        await token.mintKey(user.address);
        await token.mint(user.address, 100);
        await token.mintKey(user1.address);

        // can send shares over
        await t0.transfer(user1.address, 50);
        await t1.transfer(user.address, 25);

        // current state
        expect(await token.totalSupply()).to.equal(100);
        expect(await token.balanceOf(user.address)).to.equal(75);
        expect(await token.balanceOf(user1.address)).to.equal(25);

        // user deactivates key
        keyID = await token.generatedKeys(0);
        const address = await token.getKeyContract();
        const key = await HarmonixKey.attach(address);
        const k0 = key.connect(user);
        k0.deactivate(keyID);

        // user can't send or receive funds anymore
        await expectRevert(
            t1.transfer(user.address, 10),
            "no active keys"
        );
        await expectRevert(
            t0.transfer(user1.address, 5),
            "no active keys"
        );

        // balance no longer visible for user, still visible for user1
        await expectRevert(
            token.balanceOf(user.address),
            "no active keys"
        );
        expect(await token.balanceOf(user1.address)).to.equal(25);
        expect(await token.totalSupply()).to.equal(100);

        k0.activate(keyID);
        
        // balance stays intact after activation
        expect(await token.balanceOf(user.address)).to.equal(75);

        // transfers work again
        await t0.transfer(user1.address, 10);
        await t1.transfer(user.address, 5);

        // final state
        expect(await token.totalSupply()).to.equal(100);
        expect(await token.balanceOf(user.address)).to.equal(70);
        expect(await token.balanceOf(user1.address)).to.equal(30);
    });

    it("system can't make transfers without approval from user", async function () {
        await token.mintKey(user.address);
        await token.mintKey(user1.address);
        await token.mint(user.address, 100);

        // no approval
        await expectRevert(
            token.transferFrom(user.address, user1.address, 50),
            "ERC20: transfer amount exceeds allowance"
        );
    });

    it("system can make transfers up to amount approved by user", async function () {
        await token.mintKey(user.address);
        await token.mintKey(user1.address);
        await token.mint(user.address, 100);

        // approved to spend 50 shares
        await t0.approve(system.address, 50)
        await expectRevert(
            token.transferFrom(user.address, user1.address, 75), // only 50 approved
            "ERC20: transfer amount exceeds allowance"
        );
        await token.transferFrom(user.address, user1.address, 25); // ok

        // current state
        expect(await token.totalSupply()).to.equal(100);
        expect(await token.balanceOf(user.address)).to.equal(75);
        expect(await token.balanceOf(user1.address)).to.equal(25);

        await token.transferFrom(user.address, user1.address, 25); // still ok
        await expectRevert(
            token.transferFrom(user.address, user1.address, 1), // not ok
            "ERC20: transfer amount exceeds allowance"
        );

        // final state
        expect(await token.totalSupply()).to.equal(100);
        expect(await token.balanceOf(user.address)).to.equal(50);
        expect(await token.balanceOf(user1.address)).to.equal(50);
    });

    it("allowance can be increased/decreased by user", async function () {
        await token.mintKey(user.address);
        await token.mintKey(user1.address);
        await token.mint(user.address, 100);

        // approve
        await expectRevert(
            token.transferFrom(user.address, user1.address, 40),
            "ERC20: transfer amount exceeds allowance"
        );
        await t0.approve(system.address, 50);
        await token.transferFrom(user.address, user1.address, 40);

        // current state
        expect(await token.totalSupply()).to.equal(100);
        expect(await token.balanceOf(user.address)).to.equal(60);
        expect(await token.balanceOf(user1.address)).to.equal(40);

        // increase
        await t0.decreaseAllowance(system.address, 10);
        await expectRevert(
            token.transferFrom(user.address, user1.address, 10),
            "ERC20: transfer amount exceeds allowance"
        );

        // decrease
        await t0.increaseAllowance(system.address, 30);
        await token.transferFrom(user.address, user1.address, 30);

        // final state
        expect(await token.totalSupply()).to.equal(100);
        expect(await token.balanceOf(user.address)).to.equal(30);
        expect(await token.balanceOf(user1.address)).to.equal(70);
    })
});