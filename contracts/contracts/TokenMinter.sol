// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenMinter is Ownable {
    uint256 public creationFee = 0.01 ether; // Fee in MATIC

    event ERC20Created(address indexed creator, address tokenAddress, string name, string symbol, uint256 supply);
    event ERC721Created(address indexed creator, address tokenAddress, string name, string symbol);

    constructor() {}

    // Update creation fee
    function setCreationFee(uint256 newFee) external onlyOwner {
        creationFee = newFee;
    }

    // Create ERC20 token
    function createERC20(
        string memory name,
        string memory symbol,
        uint256 supply
    ) external payable {
        require(msg.value >= creationFee, "Insufficient fee");

        // Deploy new ERC20 token
        ERC20Token newToken = new ERC20Token(name, symbol, msg.sender, supply);
        emit ERC20Created(msg.sender, address(newToken), name, symbol, supply);
    }

    // Create ERC721 token
    function createERC721(
        string memory name,
        string memory symbol
    ) external payable {
        require(msg.value >= creationFee, "Insufficient fee");

        // Deploy new ERC721 token
        ERC721Token newToken = new ERC721Token(name, symbol, msg.sender);
        emit ERC721Created(msg.sender, address(newToken), name, symbol);
    }

    // Withdraw collected fees
    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}

contract ERC20Token is ERC20 {
    constructor(
        string memory name,
        string memory symbol,
        address owner,
        uint256 supply
    ) ERC20(name, symbol) {
        _mint(owner, supply * 10**decimals());
    }
}

contract ERC721Token is ERC721 {
    uint256 public nextTokenId;
    address public admin;

    constructor(
        string memory name,
        string memory symbol,
        address owner
    ) ERC721(name, symbol) {
        admin = owner;
    }

    function mint(address to) external {
        require(msg.sender == admin, "Only admin can mint");
        _safeMint(to, nextTokenId);
        nextTokenId++;
    }
}
