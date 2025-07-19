import { ethers } from "ethers";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config();

// Contract address - replace with your deployed contract address
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "";

async function getAllMetadata() {
  try {
    // Get private key from environment
    const privateKey = process.env.PRIVATE_KEY || "";
    if (!privateKey) {
      console.error("Please set your PRIVATE_KEY in the .env file");
      process.exit(1);
    }
  
    // Connect to the Saga network
    const provider = new ethers.JsonRpcProvider("https://asga-2752562277992000-1.jsonrpc.sagarpc.io");
    const wallet = new ethers.Wallet(privateKey, provider);
    
    console.log(`Connected with address: ${wallet.address}`);
  
    // Get the contract artifacts for ABI
    const artifactsPath = path.join(__dirname, "../artifacts/contracts/Contract.sol/CrawlRegistry.json");
    const contractArtifact = JSON.parse(fs.readFileSync(artifactsPath, "utf8"));
    
    // Create contract instance
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractArtifact.abi, wallet);
    
    // First, get all metadata created by the current address
    console.log(`Getting all metadata created by ${wallet.address}...`);
    const tokenIds = await contract.getMetadataByCreator(wallet.address);
    
    if (tokenIds.length === 0) {
      console.log("No metadata found for this address.");
      return [];
    }
    
    console.log(`Found ${tokenIds.length} tokens.`);
    
    // Get metadata for each token
    const allMetadata = [];
    for (let i = 0; i < tokenIds.length; i++) {
      const tokenId = tokenIds[i];
      console.log(`Getting metadata for token ${tokenId}...`);
      
      try {
        const metadata = await contract.getMetadata(tokenId);
        
        const formattedMetadata = {
          tokenId: Number(tokenId),
          sourceUrl: metadata.source_url,
          contentHash: ethers.hexlify(metadata.content_hash),
          contentLink: metadata.content_link,
          embedVectorId: metadata.embed_vector_id,
          createdAt: new Date(Number(metadata.created_at) * 1000).toISOString(),
          tags: metadata.tags,
          owner: metadata.owner
        };
        
        allMetadata.push(formattedMetadata);
        console.log(`Token ${tokenId}: ${formattedMetadata.sourceUrl}`);
      } catch (error) {
        console.error(`Error getting metadata for token ${tokenId}:`, error);
      }
    }
    
    return allMetadata;
  } catch (error) {
    console.error("Error getting all metadata:", error);
    throw error;
  }
}

// Function to get metadata by address
async function getMetadataByAddress(address: string) {
  try {
    // Get private key from environment
    const privateKey = process.env.PRIVATE_KEY || "";
    if (!privateKey) {
      console.error("Please set your PRIVATE_KEY in the .env file");
      process.exit(1);
    }
  
    // Connect to the Saga network
    const provider = new ethers.JsonRpcProvider("https://asga-2752562277992000-1.jsonrpc.sagarpc.io");
    const wallet = new ethers.Wallet(privateKey, provider);
    
    // Get the contract artifacts for ABI
    const artifactsPath = path.join(__dirname, "../artifacts/contracts/Contract.sol/CrawlRegistry.json");
    const contractArtifact = JSON.parse(fs.readFileSync(artifactsPath, "utf8"));
    
    // Create contract instance
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractArtifact.abi, wallet);
    
    // Get all metadata created by the specified address
    console.log(`Getting all metadata created by ${address}...`);
    const tokenIds = await contract.getMetadataByCreator(address);
    
    if (tokenIds.length === 0) {
      console.log("No metadata found for this address.");
      return [];
    }
    
    console.log(`Found ${tokenIds.length} tokens.`);
    
    // Get metadata for each token
    const allMetadata = [];
    for (let i = 0; i < tokenIds.length; i++) {
      const tokenId = tokenIds[i];
      console.log(`Getting metadata for token ${tokenId}...`);
      
      try {
        const metadata = await contract.getMetadata(tokenId);
        
        const formattedMetadata = {
          tokenId: Number(tokenId),
          sourceUrl: metadata.source_url,
          contentHash: ethers.hexlify(metadata.content_hash),
          contentLink: metadata.content_link,
          embedVectorId: metadata.embed_vector_id,
          createdAt: new Date(Number(metadata.created_at) * 1000).toISOString(),
          tags: metadata.tags,
          owner: metadata.owner
        };
        
        allMetadata.push(formattedMetadata);
        console.log(`Token ${tokenId}: ${formattedMetadata.sourceUrl}`);
      } catch (error) {
        console.error(`Error getting metadata for token ${tokenId}:`, error);
      }
    }
    
    return allMetadata;
  } catch (error) {
    console.error(`Error getting metadata for address ${address}:`, error);
    throw error;
  }
}

// Main function to handle command line arguments
async function main() {
  const args = process.argv.slice(2);
  const address = args[0];
  
  let metadata;
  if (address) {
    console.log(`Getting metadata for address: ${address}`);
    metadata = await getMetadataByAddress(address);
  } else {
    console.log("Getting metadata for the current wallet address");
    metadata = await getAllMetadata();
  }
  
  // Output the results
  if (metadata.length > 0) {
    console.log("\n=== Metadata Summary ===");
    metadata.forEach((item, index) => {
      console.log(`\n--- Token ${item.tokenId} ---`);
      console.log(`Source URL: ${item.sourceUrl}`);
      console.log(`Content Link: ${item.contentLink}`);
      console.log(`Created At: ${item.createdAt}`);
      console.log(`Tags: ${item.tags.join(", ")}`);
      console.log(`Owner: ${item.owner}`);
    });
    
    // Save to file
    const outputPath = path.join(__dirname, "../metadata-output.json");
    fs.writeFileSync(outputPath, JSON.stringify(metadata, null, 2));
    console.log(`\nMetadata saved to ${outputPath}`);
  } else {
    console.log("\nNo metadata found.");
  }
}

// Run the script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 