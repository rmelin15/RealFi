import { ethers } from 'hardhat';

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log('Deploying contracts with the account:', deployer.address);
  console.log('Account balance:', (await ethers.provider.getBalance(deployer.address)).toString());

  // Deploy OfferingRegistry
  console.log('\n📦 Deploying OfferingRegistry...');
  const OfferingRegistry = await ethers.getContractFactory('OfferingRegistry');
  const registry = await OfferingRegistry.deploy(deployer.address);
  await registry.waitForDeployment();
  
  const registryAddress = await registry.getAddress();
  console.log('✅ OfferingRegistry deployed to:', registryAddress);

  // Deploy a sample asset token through the registry
  console.log('\n📦 Deploying sample RealFiAssetToken...');
  
  const sampleAssetId = 'sample-asset-001';
  const tx = await registry.deployAssetToken(
    sampleAssetId,
    'RealFi - Sample Coffee Shop',
    'RF-COFFEE',
    'ipfs://QmSampleMetadataHash',
    ethers.parseEther('10000'), // 10,000 tokens max supply
    deployer.address
  );
  
  await tx.wait();
  
  const tokenAddress = await registry.getTokenAddress(sampleAssetId);
  console.log('✅ Sample RealFiAssetToken deployed to:', tokenAddress);

  // Verify deployment
  const assetInfo = await registry.getAssetInfo(sampleAssetId);
  console.log('\n📋 Asset Info:');
  console.log('  - Asset ID:', assetInfo.assetId);
  console.log('  - Token Address:', assetInfo.tokenAddress);
  console.log('  - Name:', assetInfo.name);
  console.log('  - Symbol:', assetInfo.symbol);
  console.log('  - Max Supply:', ethers.formatEther(assetInfo.maxSupply));

  console.log('\n🎉 Deployment complete!');
  console.log('\n📝 Contract Addresses:');
  console.log('  OfferingRegistry:', registryAddress);
  console.log('  Sample Token:', tokenAddress);
  
  console.log('\n💡 Next steps:');
  console.log('  1. Update backend environment with contract addresses');
  console.log('  2. Run database migrations');
  console.log('  3. Seed sample data');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


















