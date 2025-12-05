// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./RealFiAssetToken.sol";

/**
 * @title OfferingRegistry
 * @notice Central registry mapping off-chain assets to their on-chain token contracts
 * @dev Provides factory functionality and maintains a registry of all asset tokens
 */
contract OfferingRegistry is AccessControl {
    bytes32 public constant DEPLOYER_ROLE = keccak256("DEPLOYER_ROLE");

    /// @notice Mapping from off-chain asset ID to token contract address
    mapping(string => address) public assetTokens;

    /// @notice Array of all deployed asset IDs for enumeration
    string[] public allAssetIds;

    /// @notice Struct containing asset token information
    struct AssetInfo {
        string assetId;
        address tokenAddress;
        string name;
        string symbol;
        uint256 maxSupply;
        uint256 deployedAt;
    }

    /// @notice Mapping from asset ID to full info
    mapping(string => AssetInfo) public assetInfo;

    /// @notice Emitted when a new asset token is deployed
    event AssetTokenDeployed(
        string indexed assetId,
        address indexed tokenAddress,
        string name,
        string symbol,
        uint256 maxSupply
    );

    /// @notice Error when asset already has a token
    error AssetAlreadyRegistered(string assetId);

    /// @notice Error when asset is not found
    error AssetNotFound(string assetId);

    /**
     * @notice Constructor
     * @param admin Address to receive admin role
     */
    constructor(address admin) {
        require(admin != address(0), "Admin cannot be zero address");
        
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(DEPLOYER_ROLE, admin);
    }

    /**
     * @notice Deploy a new asset token and register it
     * @param assetId Off-chain asset identifier (UUID)
     * @param name Token name
     * @param symbol Token symbol
     * @param metadataUri URI to asset metadata
     * @param maxSupply Maximum token supply
     * @param tokenAdmin Address to administer the new token
     * @return tokenAddress Address of the deployed token contract
     */
    function deployAssetToken(
        string calldata assetId,
        string calldata name,
        string calldata symbol,
        string calldata metadataUri,
        uint256 maxSupply,
        address tokenAdmin
    ) external onlyRole(DEPLOYER_ROLE) returns (address tokenAddress) {
        if (assetTokens[assetId] != address(0)) {
            revert AssetAlreadyRegistered(assetId);
        }

        // Deploy new token contract
        RealFiAssetToken token = new RealFiAssetToken(
            name,
            symbol,
            assetId,
            metadataUri,
            maxSupply,
            tokenAdmin
        );

        tokenAddress = address(token);

        // Register the token
        assetTokens[assetId] = tokenAddress;
        allAssetIds.push(assetId);
        
        assetInfo[assetId] = AssetInfo({
            assetId: assetId,
            tokenAddress: tokenAddress,
            name: name,
            symbol: symbol,
            maxSupply: maxSupply,
            deployedAt: block.timestamp
        });

        emit AssetTokenDeployed(assetId, tokenAddress, name, symbol, maxSupply);
    }

    /**
     * @notice Get token address for an asset
     * @param assetId Off-chain asset identifier
     * @return Token contract address (zero if not registered)
     */
    function getTokenAddress(string calldata assetId) external view returns (address) {
        return assetTokens[assetId];
    }

    /**
     * @notice Get full info for an asset
     * @param assetId Off-chain asset identifier
     * @return info AssetInfo struct
     */
    function getAssetInfo(string calldata assetId) external view returns (AssetInfo memory info) {
        if (assetTokens[assetId] == address(0)) {
            revert AssetNotFound(assetId);
        }
        return assetInfo[assetId];
    }

    /**
     * @notice Get total number of registered assets
     * @return count Number of assets
     */
    function getAssetCount() external view returns (uint256) {
        return allAssetIds.length;
    }

    /**
     * @notice Get a page of asset IDs
     * @param offset Starting index
     * @param limit Number of items to return
     * @return ids Array of asset IDs
     */
    function getAssetIds(uint256 offset, uint256 limit) 
        external 
        view 
        returns (string[] memory ids) 
    {
        uint256 total = allAssetIds.length;
        if (offset >= total) {
            return new string[](0);
        }

        uint256 end = offset + limit;
        if (end > total) {
            end = total;
        }

        ids = new string[](end - offset);
        for (uint256 i = offset; i < end; i++) {
            ids[i - offset] = allAssetIds[i];
        }
    }

    /**
     * @notice Check if an asset is registered
     * @param assetId Off-chain asset identifier
     * @return registered True if asset has a token deployed
     */
    function isAssetRegistered(string calldata assetId) external view returns (bool) {
        return assetTokens[assetId] != address(0);
    }
}


















