// Sources flattened with hardhat v2.6.4 https://hardhat.org

// File contracts/util/MintAccess.sol

// SPDX-License-Identifier: GPL
pragma solidity ^0.8.0;

contract MintAccess {

    address public governance;
    mapping(address => bool) public minters;

    event AddMinter(address indexed minter);
    event RemoveMinter(address indexed minter);

    constructor() {
        governance = msg.sender;
    }

    modifier onlyGov {
        require(msg.sender == governance, "!governance");
        _;
    }

    modifier onlyMinter {
        require(minters[msg.sender], "!minter");
        _;
    }

    function setGovernance(address _governance) public onlyGov {
        governance = _governance;
    }

    function addMinter(address _minter) virtual public onlyGov {
        minters[_minter] = true;
        emit AddMinter(_minter);
    }

    function removeMinter(address _minter) virtual public onlyGov {
        minters[_minter] = false;
        emit RemoveMinter(_minter);
    }
}
