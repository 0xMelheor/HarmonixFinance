// Sources flattened with hardhat v2.6.4 https://hardhat.org

// File @openzeppelin/contracts/utils/math/SafeMath.sol@v4.3.2

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

// CAUTION
// This version of SafeMath should only be used with Solidity 0.8 or later,
// because it relies on the compiler's built in overflow checks.

/**
 * @dev Wrappers over Solidity's arithmetic operations.
 *
 * NOTE: `SafeMath` is no longer needed starting with Solidity 0.8. The compiler
 * now has built in overflow checking.
 */
library SafeMath {
    /**
     * @dev Returns the addition of two unsigned integers, with an overflow flag.
     *
     * _Available since v3.4._
     */
    function tryAdd(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            uint256 c = a + b;
            if (c < a) return (false, 0);
            return (true, c);
        }
    }

    /**
     * @dev Returns the substraction of two unsigned integers, with an overflow flag.
     *
     * _Available since v3.4._
     */
    function trySub(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            if (b > a) return (false, 0);
            return (true, a - b);
        }
    }

    /**
     * @dev Returns the multiplication of two unsigned integers, with an overflow flag.
     *
     * _Available since v3.4._
     */
    function tryMul(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
            // benefit is lost if 'b' is also tested.
            // See: https://github.com/OpenZeppelin/openzeppelin-contracts/pull/522
            if (a == 0) return (true, 0);
            uint256 c = a * b;
            if (c / a != b) return (false, 0);
            return (true, c);
        }
    }

    /**
     * @dev Returns the division of two unsigned integers, with a division by zero flag.
     *
     * _Available since v3.4._
     */
    function tryDiv(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            if (b == 0) return (false, 0);
            return (true, a / b);
        }
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers, with a division by zero flag.
     *
     * _Available since v3.4._
     */
    function tryMod(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            if (b == 0) return (false, 0);
            return (true, a % b);
        }
    }

    /**
     * @dev Returns the addition of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `+` operator.
     *
     * Requirements:
     *
     * - Addition cannot overflow.
     */
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        return a + b;
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting on
     * overflow (when the result is negative).
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     *
     * - Subtraction cannot overflow.
     */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        return a - b;
    }

    /**
     * @dev Returns the multiplication of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `*` operator.
     *
     * Requirements:
     *
     * - Multiplication cannot overflow.
     */
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        return a * b;
    }

    /**
     * @dev Returns the integer division of two unsigned integers, reverting on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's `/` operator.
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        return a / b;
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * reverting when dividing by zero.
     *
     * Counterpart to Solidity's `%` operator. This function uses a `revert`
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        return a % b;
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting with custom message on
     * overflow (when the result is negative).
     *
     * CAUTION: This function is deprecated because it requires allocating memory for the error
     * message unnecessarily. For custom revert reasons use {trySub}.
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     *
     * - Subtraction cannot overflow.
     */
    function sub(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
        unchecked {
            require(b <= a, errorMessage);
            return a - b;
        }
    }

    /**
     * @dev Returns the integer division of two unsigned integers, reverting with custom message on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's `/` operator. Note: this function uses a
     * `revert` opcode (which leaves remaining gas untouched) while Solidity
     * uses an invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function div(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
        unchecked {
            require(b > 0, errorMessage);
            return a / b;
        }
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * reverting with custom message when dividing by zero.
     *
     * CAUTION: This function is deprecated because it requires allocating memory for the error
     * message unnecessarily. For custom revert reasons use {tryMod}.
     *
     * Counterpart to Solidity's `%` operator. This function uses a `revert`
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function mod(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
        unchecked {
            require(b > 0, errorMessage);
            return a % b;
        }
    }
}


// File contracts/util/Dictionary.sol

// SPDX-License-Identifier: GPL
pragma solidity ^0.8.0;

contract Dictionary {
    using SafeMath for uint256;

    string[] private pprefix = [
      "Satoshi Nakamoto",
      "Vitalik Buterin",
      "Charles Hoskinson",
      "Stephen Tse",
      "Melheor",
      "Bogdanoff",
      "Michael Saylor",
      "Elon Musk",
      "Mark Cuban",
      "SBF",
      "Winklevoss",
      "PlanB",
      "Benjamin Cowen",
      "CoinBureau",
      "BitBoy",
      "Binance",
      "Wyckoff"
    ];
    
    string[] private prefix = [
      "magic",
      "master",
      "golden",
      "bronze",
      "silver",
      "paper",
      "platinum",
      "glass",
      "large",
      "small",
      "tiny",
      "bloody",
      "fake",
      "wooden",
      "elegant",
      "dull",
      "sharp",
      "broken",
      "fragile",
      "indestructible",
      "private",
      "crappy",
      "dirty",
      "shiny",
      "pointy",
      "electronic",
      "mechanical",
      "solar",
      "radioactive",
      "nuclear",
      "sacred",
      "heavy",
      "light",
      "redundant",
      "long",
      "short",
      "crazy",
      "gothic",
      "plastic",
      "holy",
      "rusty",
      "illegal",
      "cheap",
      "diamond",
      "barbaric",
      "savage",
      "sexy",
      "lunar",
      "mediocre",
      "plain",
      "vanilla",
      "delicious",
      "deactivated",
      "useless",
      "galactic",
      "ballistic",
      "unique",
      "legitimate",
      "ludicrous",
      "degen",
      "fantastic",
      "exotic",
      "absurd",
      "extravagant",
      "magnificent",
      "monumental",
      "intergalactic",
      "bearish",
      "bullish"
    ];

    string[] private main = [
      "key",
      "keycard",
      "lockpick",
      "password",
      "doorstop",
      "ticket",
      "cipher",
      "code",
      "combination",
      "fingerprint",
      "secret phrase",
      "mnemonic",
      "voucher",
      "certificate",
      "webtoken"
    ];

    string[] private suffix = [
      "opening",
      "elegance",
      "nothing",
      "everything",
      "ignorance",
      "knowledge",
      "ingenuity",
      "financial freedom",
      "despair",
      "boredom",
      "blockchain",
      "inspiration",
      "greed",
      "hunger",
      "gravity",
      "magnetism",
      "biohazard",
      "doom",
      "fear",
      "privacy",
      "mediocrity",
      "redundance",
      "cold storage",
      "solitude",
      "disaster",
      "brevity",
      "masochism",
      "insomnia",
      "destruction",
      "creation",
      "blasphemy",
      "lies",
      "resistance",
      "capitalism",
      "banking",
      "cryptography",
      "hopium",
      "market dominance",
      "abundance",
      "broken dreams",
      "anarchy",
      "big lies",
      "disappointment",
      "entitlement",
      "mass destruction",
      "flux capacitance",
      "guilt",
      "baggage",
      "money",
      "loot",
      "timing the market",
      "revenge",
      "stagnation",
      "inflation",
      "minimalism",
      "impermanent loss",
      "no gains",
      "luxury",
      "shitcoins",
      "wisdom",
      "importance",
      "DeFi",
      "intimidation",
      "fortune",
      "paper hands",
      "diamond hands",
      "eternity",
      "infinity",
      "harmony",
      "rage",
      "fury",
      "incompetence",
      "brilliance",
      "shock",
      "assault",
      "solidity",
      "duplication",
      "price discovery",
      "elongation",
      "world peace",
      "witchcraft",
      "insanity",
      "good vibes",
      "global warming",
      "climate change",
      "aping in",
      "abstraction",
      "ancient aliens",
      "taking profit",
      "maximalism",
      "emission schedule",
      "consensus",
      "2s finality",
      "confusion",
      "liquidity mining",
      "life savings",
      "price dump",
      "no lambo",
      "depression",
      "net neutrality",
      "censorship",
      "rugpulling",
      "wrong wallet",
      "quantitative easing",
      "FOMOing in",
      "ponzinomics",
      "gas fees",
      "broken dreams",
      "shilling",
      "panic-selling",
      "random words",
      "cryptocurrency",
      "losing your keys",
      "smart contracts",
      "hardfork",
      "yield farming",
      "collateral",
      "tokenomics",
      "arbitrage",
      "auto-compounding",
      "fair launch",
      "financial advice",
      "margin calls",
      "staking",
      "volatility",
      "decentralization",
      "4-year cycle",
      "supercycle",
      "flash-crashing",
      "whale activity",
      "liquidity pools",
      "token burning",
      "token minting",
      "bear market",
      "bull run",
      "transaction fees",
      "mooning",
      "short-selling",
      "FUD"
    ];

    string[] private fancySuffixes1 = ['sharding', 'slashing', 'liquidation', 'ICO', 'liquidity', 'governance', 'KYC', 'airdrop', 'storage'];
    string[] private fancySuffixes2 = ['analysis', 'arbitrage', 'exploit'];
    string[] private fancySuffixes3 = ['gains', 'leverage', 'price pump'];
    string[] private fancySuffixes4 = ['withdrawal fees', 'deposit fees', 'transaction fees', 'volatility', 'slippage'];
    string[] private fancySuffixes5 = ['NFTs', 'shitcoins', 'hidden gems', 'stablecoins'];
    string[] private fancySuffixes6 = ['TVL', 'price', 'APY', 'liquidity'];
    string[] private fancySuffixes7 = ['the dip', 'the peak', 'ATH', 'the bottom'];

    string[] private fancyModifiers1 = ['', 'on-chain ', 'cross-chain ', 'off-chain '];
    string[] private fancyModifiers2 = ['on-chain ', 'technical ', 'fundamental '];
    string[] private fancyModifiers3 = ['', 'no ', '5x ', '10x ', '20x ', '50x ', '100x ', '500x ', '1000x '];
    string[] private fancyModifiers4 = ['', '50% ', '100% ', '200% '];
    string[] private fancyModifiers5 = ['', 'unique ', 'useless ', 'generic ', 'stolen ', 'pirated ', 'low-effort ', 'priceless ', 'amazing ', 'minting ', 'rare '];
    string[] private fancyModifiers6 = ['high ', 'low ', 'huge ', 'ridiculous ', 'astronomic '];
    string[] private fancyModifiers7 = ['buying ', 'selling ', 'HODLing to '];

    uint256 _randNonce = 0;
    function randMod(uint256 modulus) internal returns (uint256) {
        _randNonce = _randNonce.add(1);
        return uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, _randNonce))) % modulus;
    }

    function _generateName() internal returns (string memory) {
        string memory _prefix = prefix[randMod(prefix.length)];
        string memory _main = main[randMod(main.length)];

        string memory _suffix;
        uint256 suffixNum = randMod(suffix.length.mul(2));
        if (suffixNum < suffix.length) {
            // simple suffix
            _suffix = suffix[suffixNum];
        } else {
            // fancy suffix
            uint256 category = randMod(7);
            string memory partOne;
            string memory partTwo;
            if (category == 0) {
                partOne = fancyModifiers1[randMod(fancyModifiers1.length)];
                partTwo = fancySuffixes1[randMod(fancySuffixes1.length)];
            } else if (category == 1) {
                partOne = fancyModifiers2[randMod(fancyModifiers2.length)];
                partTwo = fancySuffixes2[randMod(fancySuffixes2.length)];
            } else if (category == 2) {
                partOne = fancyModifiers3[randMod(fancyModifiers3.length)];
                partTwo = fancySuffixes3[randMod(fancySuffixes3.length)];
            } else if (category == 3) {
                partOne = fancyModifiers4[randMod(fancyModifiers4.length)];
                partTwo = fancySuffixes4[randMod(fancySuffixes4.length)];
            } else if (category == 4) {
                partOne = fancyModifiers5[randMod(fancyModifiers5.length)];
                partTwo = fancySuffixes5[randMod(fancySuffixes5.length)];
            } else if (category == 5) {
                partOne = fancyModifiers6[randMod(fancyModifiers6.length)];
                partTwo = fancySuffixes6[randMod(fancySuffixes6.length)];
            } else if (category == 6) {
                partOne = fancyModifiers7[randMod(fancyModifiers7.length)];
                partTwo = fancySuffixes7[randMod(fancySuffixes7.length)];
            }
            _suffix = string(abi.encodePacked(partOne, partTwo));
        }

        string memory _pprefix = "";
        uint256 optionalPrefixNum = randMod(pprefix.length.mul(5));
        if (optionalPrefixNum < pprefix.length) {
          _pprefix = string(abi.encodePacked(pprefix[optionalPrefixNum], "'s "));
        }
        return string(abi.encodePacked(_pprefix, _prefix, ' ', _main, ' of ', _suffix));
    }
}
