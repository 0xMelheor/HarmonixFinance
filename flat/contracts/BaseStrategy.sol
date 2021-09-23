// Sources flattened with hardhat v2.6.4 https://hardhat.org

// File @openzeppelin/contracts/token/ERC20/IERC20.sol@v4.3.2

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

/**
 * @dev Interface of the ERC20 standard as defined in the EIP.
 */
interface IERC20 {
    /**
     * @dev Returns the amount of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves `amount` tokens from the caller's account to `recipient`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address recipient, uint256 amount) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 amount) external returns (bool);

    /**
     * @dev Moves `amount` tokens from `sender` to `recipient` using the
     * allowance mechanism. `amount` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);

    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);
}


// File @openzeppelin/contracts/interfaces/IERC20.sol@v4.3.2

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;


// File @openzeppelin/contracts/utils/Context.sol@v4.3.2

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

/**
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }
}


// File @openzeppelin/contracts/security/Pausable.sol@v4.3.2

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

/**
 * @dev Contract module which allows children to implement an emergency stop
 * mechanism that can be triggered by an authorized account.
 *
 * This module is used through inheritance. It will make available the
 * modifiers `whenNotPaused` and `whenPaused`, which can be applied to
 * the functions of your contract. Note that they will not be pausable by
 * simply including this module, only once the modifiers are put in place.
 */
abstract contract Pausable is Context {
    /**
     * @dev Emitted when the pause is triggered by `account`.
     */
    event Paused(address account);

    /**
     * @dev Emitted when the pause is lifted by `account`.
     */
    event Unpaused(address account);

    bool private _paused;

    /**
     * @dev Initializes the contract in unpaused state.
     */
    constructor() {
        _paused = false;
    }

    /**
     * @dev Returns true if the contract is paused, and false otherwise.
     */
    function paused() public view virtual returns (bool) {
        return _paused;
    }

    /**
     * @dev Modifier to make a function callable only when the contract is not paused.
     *
     * Requirements:
     *
     * - The contract must not be paused.
     */
    modifier whenNotPaused() {
        require(!paused(), "Pausable: paused");
        _;
    }

    /**
     * @dev Modifier to make a function callable only when the contract is paused.
     *
     * Requirements:
     *
     * - The contract must be paused.
     */
    modifier whenPaused() {
        require(paused(), "Pausable: not paused");
        _;
    }

    /**
     * @dev Triggers stopped state.
     *
     * Requirements:
     *
     * - The contract must not be paused.
     */
    function _pause() internal virtual whenNotPaused {
        _paused = true;
        emit Paused(_msgSender());
    }

    /**
     * @dev Returns to normal state.
     *
     * Requirements:
     *
     * - The contract must be paused.
     */
    function _unpause() internal virtual whenPaused {
        _paused = false;
        emit Unpaused(_msgSender());
    }
}


// File @openzeppelin/contracts/access/Ownable.sol@v4.3.2

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

/**
 * @dev Contract module which provides a basic access control mechanism, where
 * there is an account (an owner) that can be granted exclusive access to
 * specific functions.
 *
 * By default, the owner account will be the one that deploys the contract. This
 * can later be changed with {transferOwnership}.
 *
 * This module is used through inheritance. It will make available the modifier
 * `onlyOwner`, which can be applied to your functions to restrict their use to
 * the owner.
 */
abstract contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the deployer as the initial owner.
     */
    constructor() {
        _setOwner(_msgSender());
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
        _;
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions anymore. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby removing any functionality that is only available to the owner.
     */
    function renounceOwnership() public virtual onlyOwner {
        _setOwner(address(0));
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        _setOwner(newOwner);
    }

    function _setOwner(address newOwner) private {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}


// File contracts/util/Manager.sol

// SPDX-License-Identifier: GPL
pragma solidity ^0.8.0;

// allows a manager separate from owner
contract Manager is Ownable {
    address public mgr;         // address allowed to manager

    event ManagerChanged(address indexed from, address indexed to);

    constructor(address _mgr) {
        mgr = _mgr;
    }

    /**
     * @dev checks that caller is either owner or keeper.
     */
    modifier onlyManager() {
        require(msg.sender == owner() || msg.sender == mgr, "!manager");
        _;
    }

    /**
     * @dev Updates the address of strategy manager.
     * @param _mgr new keeper address.
     */
    function setManager(address _mgr) public onlyManager {
        address current = mgr;
        mgr = _mgr;
        emit ManagerChanged(current, _mgr);
    }
}


// File contracts/interfaces/IGasPrice.sol

// SPDX-License-Identifier: GPL
pragma solidity ^0.8.0;

interface IGasPrice {
    function maxGasPrice() external returns (uint);
}


// File contracts/util/GasThrottler.sol

// SPDX-License-Identifier: GPL
pragma solidity ^0.8.0;



contract GasThrottler is Manager {

    uint256 public maxGas = 10000000000; // 10 gwei

    constructor(uint256 _max) Manager(owner()) {
        maxGas = _max;
    }

    /**
     * @dev Updates the gas fee.
     * @param _max new maximum gas price
     */
    function updateGas(uint256 _max) external onlyManager {
        maxGas = _max;
    }

    modifier gasThrottle() {
        require(tx.gasprice <= maxGas, "gas is too high!");
        _;
    }
}


// File contracts/BaseStrategy.sol

// SPDX-License-Identifier: GPL
pragma solidity ^0.8.0;




// @title   Harmonix Strategy Template
// @dev     All strategies must inherit from this class
abstract contract BaseStrategy is Manager, Pausable, GasThrottler {

    /**
     * @notice Throws if called by smart contract
     */
    modifier onlyEOA() {
        require(tx.origin == msg.sender, "can't call from smart contract");
        _;
    }

    address public want;            // token or LP this strategy wants to operate on
    address public vault;           // address of the managing vault
    address public masterchef;      // masterchef for this strategy
    address public strategist;      // address of the strategy developer
    uint256 public strategistFee;   // the management fee taken by the strategy developer
    uint256 public gasFee;          // fee paid to caller to compensate them for the call

    address public stakingContract; // xHMX contract paying investors fees from all contracts on the system

    constructor(
        address _mgr,
        address _want,
        address _vault,
        address _strategist,
        address _masterchef,
        uint256 _fee,
        uint256 _gasfee
    ) Manager(_mgr) {
        want = _want;
        vault = _vault;
        strategist = _strategist;
        masterchef = _masterchef;
        strategistFee = _fee;
        gasFee = _gasfee;
    }

    /**
     * @dev implement panic logic for terminating the strategy and attempting to save user funds
     */
    function panic() external onlyManager {
        pause();
        emergencyWithdraw();
    }

    function pause() public onlyManager {
        _pause();
        _revokeAccess();
    }

    function unpause() external onlyManager {
        _grantAccess();
        _unpause();
    }

    /**
     * @notice Deposit and deploy deposits tokens to the strategy
     * @dev Must mint receipt tokens to `msg.sender`
     * @param amount deposit tokens
     */
    function deposit(uint256 amount) external virtual;

    /**
     * @dev logic for withdrawing funds back to user
     */
    function withdraw(uint256 amount) external virtual;

    /**
     * @dev emergency withdraw logic
     */
    function emergencyWithdraw() internal virtual;

    /**
     * @dev logic for playing out this strategy, this logic gets called repeatedly by the harvesting
     * script, it also checks for any problems with the current state in case the strategy needs to
     * panic and sets the _panic flag.
     */
    function reinvest() internal virtual;

    /**
     * @dev function exposed to the outside for playing out the strategy. Pausing the strategy doesn't
     * withdraw funds, it simply stops the strategy from doing its own logic on top (i.e. recompounding).
     */
    function harvest() external whenNotPaused gasThrottle {
        reinvest();
    }

    /**
     * @dev logic for approving access
     */
    function _grantAccess() internal {
        IERC20(want).approve(masterchef, type(uint256).max);
    }

    /**
     * @dev logic for revoking approvals
     */
    function _revokeAccess() internal {
        IERC20(want).approve(masterchef, 0);
    }

    /**
     * @dev called during strategy migration, sends all available funds back to vault.
     */
    function retire() external {
        require(msg.sender == vault, "!vault");

        emergencyWithdraw();

        // move money back to vault
        uint256 balance = IERC20(want).balanceOf(address(this));
        IERC20(want).transfer(vault, balance);
    }
}
