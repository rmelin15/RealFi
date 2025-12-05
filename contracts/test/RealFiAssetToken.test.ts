import { expect } from 'chai';
import { ethers } from 'hardhat';
import { RealFiAssetToken, OfferingRegistry } from '../typechain-types';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';

describe('RealFi Contracts', function () {
  let registry: OfferingRegistry;
  let token: RealFiAssetToken;
  let owner: SignerWithAddress;
  let investor1: SignerWithAddress;
  let investor2: SignerWithAddress;

  const ASSET_ID = 'test-asset-001';
  const TOKEN_NAME = 'RealFi - Test Asset';
  const TOKEN_SYMBOL = 'RF-TEST';
  const METADATA_URI = 'ipfs://QmTestMetadata';
  const MAX_SUPPLY = ethers.parseEther('10000');

  beforeEach(async function () {
    [owner, investor1, investor2] = await ethers.getSigners();

    // Deploy Registry
    const OfferingRegistry = await ethers.getContractFactory('OfferingRegistry');
    registry = await OfferingRegistry.deploy(owner.address);
    await registry.waitForDeployment();

    // Deploy Token through Registry
    await registry.deployAssetToken(
      ASSET_ID,
      TOKEN_NAME,
      TOKEN_SYMBOL,
      METADATA_URI,
      MAX_SUPPLY,
      owner.address
    );

    const tokenAddress = await registry.getTokenAddress(ASSET_ID);
    token = await ethers.getContractAt('RealFiAssetToken', tokenAddress);
  });

  describe('OfferingRegistry', function () {
    it('Should deploy and register asset token', async function () {
      expect(await registry.isAssetRegistered(ASSET_ID)).to.be.true;
    });

    it('Should store correct asset info', async function () {
      const info = await registry.getAssetInfo(ASSET_ID);
      expect(info.name).to.equal(TOKEN_NAME);
      expect(info.symbol).to.equal(TOKEN_SYMBOL);
      expect(info.maxSupply).to.equal(MAX_SUPPLY);
    });

    it('Should not allow duplicate asset registration', async function () {
      await expect(
        registry.deployAssetToken(
          ASSET_ID,
          'Another Token',
          'AT',
          'ipfs://another',
          MAX_SUPPLY,
          owner.address
        )
      ).to.be.revertedWithCustomError(registry, 'AssetAlreadyRegistered');
    });

    it('Should track asset count', async function () {
      expect(await registry.getAssetCount()).to.equal(1);

      await registry.deployAssetToken(
        'asset-002',
        'Token 2',
        'T2',
        'ipfs://t2',
        MAX_SUPPLY,
        owner.address
      );

      expect(await registry.getAssetCount()).to.equal(2);
    });
  });

  describe('RealFiAssetToken', function () {
    it('Should have correct initial state', async function () {
      expect(await token.name()).to.equal(TOKEN_NAME);
      expect(await token.symbol()).to.equal(TOKEN_SYMBOL);
      expect(await token.assetId()).to.equal(ASSET_ID);
      expect(await token.metadataUri()).to.equal(METADATA_URI);
      expect(await token.maxSupply()).to.equal(MAX_SUPPLY);
      expect(await token.mintingFinalized()).to.be.false;
    });

    it('Should allow minting by owner', async function () {
      const amount = ethers.parseEther('100');
      await token.mint(investor1.address, amount);
      
      expect(await token.balanceOf(investor1.address)).to.equal(amount);
    });

    it('Should allow batch minting', async function () {
      const amounts = [ethers.parseEther('100'), ethers.parseEther('200')];
      await token.batchMint(
        [investor1.address, investor2.address],
        amounts
      );

      expect(await token.balanceOf(investor1.address)).to.equal(amounts[0]);
      expect(await token.balanceOf(investor2.address)).to.equal(amounts[1]);
    });

    it('Should not exceed max supply', async function () {
      const exceedAmount = MAX_SUPPLY + ethers.parseEther('1');
      
      await expect(
        token.mint(investor1.address, exceedAmount)
      ).to.be.revertedWithCustomError(token, 'ExceedsMaxSupply');
    });

    it('Should finalize minting', async function () {
      await token.mint(investor1.address, ethers.parseEther('100'));
      await token.finalizeMinting();

      expect(await token.mintingFinalized()).to.be.true;
      expect(await token.remainingMintableSupply()).to.equal(0);
    });

    it('Should not allow minting after finalization', async function () {
      await token.finalizeMinting();

      await expect(
        token.mint(investor1.address, ethers.parseEther('100'))
      ).to.be.revertedWithCustomError(token, 'MintingAlreadyFinalized');
    });

    it('Should allow token transfers', async function () {
      await token.mint(investor1.address, ethers.parseEther('100'));
      
      await token.connect(investor1).transfer(
        investor2.address,
        ethers.parseEther('50')
      );

      expect(await token.balanceOf(investor1.address)).to.equal(
        ethers.parseEther('50')
      );
      expect(await token.balanceOf(investor2.address)).to.equal(
        ethers.parseEther('50')
      );
    });

    it('Should pause and unpause transfers', async function () {
      await token.mint(investor1.address, ethers.parseEther('100'));
      
      await token.pause();

      await expect(
        token.connect(investor1).transfer(investor2.address, ethers.parseEther('10'))
      ).to.be.revertedWithCustomError(token, 'EnforcedPause');

      await token.unpause();

      await token.connect(investor1).transfer(
        investor2.address,
        ethers.parseEther('10')
      );

      expect(await token.balanceOf(investor2.address)).to.equal(
        ethers.parseEther('10')
      );
    });

    it('Should update metadata URI', async function () {
      const newUri = 'ipfs://QmNewMetadata';
      await token.setMetadataUri(newUri);
      
      expect(await token.metadataUri()).to.equal(newUri);
    });
  });
});


















