const { expect } = require("chai");
const { ethers } = require("hardhat");
const { expectRevert } = require('@openzeppelin/test-helpers');


describe("Harmonix Unlock Helper", function () {
    beforeEach(async function () {
        Unlock = await ethers.getContractFactory("UnlockMock");
        HarmonixKey = await ethers.getContractFactory("HarmonixKey");

        vault = await Unlock.deploy();
        await vault.deployed();

        // system creates the vault, user owns the key, user1 is a different user
        [system, user, user1] = await ethers.getSigners();
        v0 = vault.connect(user);
        v1 = vault.connect(user1);
    });

    it("can identify user's key without needing ID", async function () {
        await vault.mintKey(user.address);
        expect(await vault.getKey(user.address) == await vault.generatedKeys(0));
    });

    it("selects first key when multiple keys are available", async function () {
        await vault.mintKey(user.address);
        await vault.mintKey(user.address);
        expect(await vault.getKey(user.address) == await vault.generatedKeys(0));
    });

    it("reports error when no keys are available", async function () {
        await expectRevert(
            vault.getKey(user.address),
            "no active keys"
        );
    });

    it("allows deactivating key", async function () {
        await vault.mintKey(user.address);
        keyID = await vault.generatedKeys(0);
        expect(await vault.getKey(user.address) == keyID);

        const address = await v0.getKeyContract();
        const key = await HarmonixKey.attach(address);
        const k0 = key.connect(user);

        expect(await key.isActive(keyID) == false); // others can't see user key as active (only vault contract can)
        expect(await k0.isActive(keyID) == true);   // user can see own key as active

        k0.deactivate(keyID);

        expect(await key.isActive(keyID) == false); // others can't see the difference
        expect(await k0.isActive(keyID) == false);  // user can see own key deactivated

        // system treats deactivated key as no key
        await expectRevert(
            vault.getKey(user.address),
            "no active keys"
        );
    });

    it("allows reactivating key", async function () {
        await vault.mintKey(user.address);
        keyID = await vault.generatedKeys(0);
        expect(await vault.getKey(user.address) == keyID);

        const address = await v0.getKeyContract();
        const key = await HarmonixKey.attach(address);
        const k0 = key.connect(user);

        expect(await k0.isActive(keyID) == true);

        k0.deactivate(keyID);
        expect(await k0.isActive(keyID) == false);

        // system no longer sees key
        await expectRevert(
            vault.getKey(user.address),
            "no active keys"
        );

        k0.activate(keyID);
        expect(await k0.isActive(keyID) == true);

        // system sees the key again
        expect(await vault.getKey(user.address) == keyID);
    });

    it("skips deactivated keys when multiple keys are available", async function () {
        await vault.mintKey(user.address);
        await vault.mintKey(user.address);
        keyID = await vault.generatedKeys(0);
        expect(await vault.getKey(user.address) == keyID);

        const address = await v0.getKeyContract();
        const key = await HarmonixKey.attach(address);
        const k0 = key.connect(user);
        k0.deactivate(keyID);

        expect(await vault.getKey(user.address) == await vault.generatedKeys(1));
    });

    it("handles multiple users without mixing up keys", async function () {
        await vault.mintKey(user.address);
        await vault.mintKey(user1.address);
        keyID = await vault.generatedKeys(0);
        keyID1 = await vault.generatedKeys(1);
        expect(await vault.getKey(user.address) == keyID);
        expect(await vault.getKey(user1.address) == keyID1);

        const address = await v0.getKeyContract();
        const key = await HarmonixKey.attach(address);
        const k0 = key.connect(user);
        k0.deactivate(keyID);

        await expectRevert(
            vault.getKey(user.address),
            "no active keys"
        );
        expect(await vault.getKey(user1.address) == keyID1);
    });

    it("users can trade keys", async function () {
        await vault.mintKey(user.address);
        await vault.mintKey(user1.address);
        keyID = await vault.generatedKeys(0);
        keyID1 = await vault.generatedKeys(1);
        expect(await vault.getKey(user.address) == keyID);
        expect(await vault.getKey(user1.address) == keyID1);

        const address = await v0.getKeyContract();
        const key = await HarmonixKey.attach(address);
        const k0 = key.connect(user);
        k0.transferFrom(user.address, user1.address, keyID);

        // user has no keys, user1 has 2 keys
        await expectRevert(
            vault.getKey(user.address),
            "no active keys"
        );
        expect(await vault.getKey(user1.address) == keyID);

        const k1 = key.connect(user1);
        k1.transferFrom(user1.address, user.address, keyID1);

        // users swapped keys
        expect(await vault.getKey(user.address) == keyID1);
        expect(await vault.getKey(user1.address) == keyID);
    });
});