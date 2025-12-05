// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

/**
 * @title RealFiAssetToken
 * @notice ERC20 token representing fractional ownership in a RealFi Network asset
 * @dev Each asset gets its own token contract deployed when the offering closes
 */
contract RealFiAssetToken is ERC20, ERC20Burnable, ERC20Pausable, AccessControl, ERC20Permit {
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    /// @notice The off-chain asset ID this token represents
    string public assetId;

    /// @notice URL to asset metadata (IPFS or similar)
    string public metadataUri;

    /// @notice Maximum supply that can ever be minted
    uint256 public maxSupply;

    /// @notice Track if initial minting has been completed
    bool public mintingFinalized;

    /// @notice Emitted when asset metadata is updated
    event MetadataUpdated(string newUri);

    /// @notice Emitted when minting is finalized
    event MintingFinalized(uint256 totalSupply);

    /// @notice Error thrown when trying to mint after finalization
    error MintingAlreadyFinalized();

    /// @notice Error thrown when trying to exceed max supply
    error ExceedsMaxSupply();

    /**
     * @notice Constructor to create a new asset token
     * @param name_ Token name (e.g., "RealFi - Manhattan Coffee Co.")
     * @param symbol_ Token symbol (e.g., "RF-MCC")
     * @param assetId_ Off-chain asset identifier (UUID)
     * @param metadataUri_ URI pointing to asset metadata
     * @param maxSupply_ Maximum number of tokens that can be minted
     * @param admin Address that will receive admin role
     */
    constructor(
        string memory name_,
        string memory symbol_,
        string memory assetId_,
        string memory metadataUri_,
        uint256 maxSupply_,
        address admin
    ) ERC20(name_, symbol_) ERC20Permit(name_) {
        require(maxSupply_ > 0, "Max supply must be > 0");
        require(admin != address(0), "Admin cannot be zero address");

        assetId = assetId_;
        metadataUri = metadataUri_;
        maxSupply = maxSupply_;

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(PAUSER_ROLE, admin);
        _grantRole(MINTER_ROLE, admin);
    }

    /**
     * @notice Pause all token transfers
     * @dev Can only be called by addresses with PAUSER_ROLE
     */
    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    /**
     * @notice Unpause token transfers
     * @dev Can only be called by addresses with PAUSER_ROLE
     */
    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    /**
     * @notice Mint new tokens to an investor
     * @param to Address to receive the tokens
     * @param amount Number of tokens to mint
     * @dev Can only be called by addresses with MINTER_ROLE
     */
    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        if (mintingFinalized) revert MintingAlreadyFinalized();
        if (totalSupply() + amount > maxSupply) revert ExceedsMaxSupply();
        
        _mint(to, amount);
    }

    /**
     * @notice Batch mint tokens to multiple investors
     * @param recipients Array of addresses to receive tokens
     * @param amounts Array of token amounts corresponding to each recipient
     * @dev Useful for minting to all investors when offering closes
     */
    function batchMint(
        address[] calldata recipients,
        uint256[] calldata amounts
    ) external onlyRole(MINTER_ROLE) {
        require(recipients.length == amounts.length, "Arrays length mismatch");
        
        for (uint256 i = 0; i < recipients.length; i++) {
            mint(recipients[i], amounts[i]);
        }
    }

    /**
     * @notice Finalize minting - no more tokens can be minted after this
     * @dev Should be called after all investor allocations are minted
     */
    function finalizeMinting() external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (mintingFinalized) revert MintingAlreadyFinalized();
        
        mintingFinalized = true;
        emit MintingFinalized(totalSupply());
    }

    /**
     * @notice Update the metadata URI
     * @param newUri New metadata URI
     */
    function setMetadataUri(string memory newUri) external onlyRole(DEFAULT_ADMIN_ROLE) {
        metadataUri = newUri;
        emit MetadataUpdated(newUri);
    }

    /**
     * @notice Get the number of decimals for the token
     * @return Number of decimals (18)
     */
    function decimals() public pure override returns (uint8) {
        return 18;
    }

    /**
     * @notice Check remaining mintable supply
     * @return Number of tokens that can still be minted
     */
    function remainingMintableSupply() external view returns (uint256) {
        if (mintingFinalized) return 0;
        return maxSupply - totalSupply();
    }

    // Required overrides for multiple inheritance

    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Pausable)
    {
        super._update(from, to, value);
    }
}


















