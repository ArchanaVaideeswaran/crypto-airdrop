// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenDAI is ERC20 {

    constructor() ERC20("Token DAI", "DAI") {
        _mint(msg.sender, 10000 * 10**18);
    }
}