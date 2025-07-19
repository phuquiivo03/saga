# CrawlRegistry Contract Deployment

This project contains the CrawlRegistry smart contract and scripts to deploy and interact with it on the Saga network. It also includes integration with Irys for permanent storage of crawled content.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with your private key:
```
PRIVATE_KEY=your_wallet_private_key_here
INFURA_RPC=your_infura_rpc_url_here
```

## Deployment

1. Compile the contract:
```bash
npm run compile
```

2. Deploy the contract to the Saga network:
```bash
npm run deploy
```

## Interaction Scripts

The project includes scripts to interact with the CrawlRegistry contract and upload files to Irys.

### Contract Interaction (`scripts/interact.ts`)

This script demonstrates all the functions of the CrawlRegistry contract:

```bash
npm run interact
```

#### Key Functions:

1. **mintMetadataNFT()**
   - Purpose: Creates a new NFT representing crawled content with metadata
   - Parameters: source URL, content hash, content link, embedding vector ID, timestamp, tags, token URI
   - Returns: Token ID of the minted NFT

2. **getMetadata()**
   - Purpose: Retrieves metadata for a specific token
   - Parameters: Token ID
   - Returns: CrawlMetadata struct with all content information

3. **getMetadataByCreator()**
   - Purpose: Gets all token IDs created by a specific address
   - Parameters: Creator address
   - Returns: Array of token IDs

4. **createBounty()**
   - Purpose: Creates a bounty for contributors with staked ETH
   - Parameters: None (ETH amount is sent with transaction)
   - Returns: Bounty ID

5. **addContributor()**
   - Purpose: Adds a contributor to a bounty (admin only)
   - Parameters: Bounty ID, contributor address
   - Returns: None

6. **distributeBounty()**
   - Purpose: Distributes a bounty to all contributors (admin only)
   - Parameters: Bounty ID
   - Returns: None

7. **donateToCreator()**
   - Purpose: Sends ETH directly to the creator of a specific token
   - Parameters: Token ID (ETH amount is sent with transaction)
   - Returns: None

### Donation Script (`scripts/donate.ts`)

A focused script for donating to content creators:

```bash
npm run donate <tokenId> <amount>
```

### Get All Metadata (`scripts/get-all-metadata.ts`)

This script retrieves and displays all metadata from the CrawlRegistry contract:

```bash
# Get metadata for the current wallet address
npm run get:metadata

# Get metadata for a specific address
npm run get:metadata <address>
```

#### Key Functions:

1. **getAllMetadata()**
   - Purpose: Retrieves all metadata created by the current wallet address
   - Parameters: None
   - Returns: Array of formatted metadata objects
   - Implementation:
     - Gets all token IDs created by the current address
     - Retrieves metadata for each token
     - Formats and returns the metadata

2. **getMetadataByAddress()**
   - Purpose: Retrieves all metadata created by a specific address
   - Parameters: Creator address
   - Returns: Array of formatted metadata objects
   - Implementation:
     - Gets all token IDs created by the specified address
     - Retrieves metadata for each token
     - Formats and returns the metadata

The results are displayed in the console and saved to a JSON file (`metadata-output.json`).

### Get All Bounties (`scripts/get-all-bounties.ts`)

This script retrieves and displays all bounties from the CrawlRegistry contract:

```bash
# Get all bounties
npm run get:bounties

# Get bounties created by a specific address
npm run get:bounties creator <address>

# Get bounties where an address is a contributor
npm run get:bounties contributor <address>
```

#### Key Functions:

1. **getAllBounties()**
   - Purpose: Retrieves all bounties from the contract
   - Parameters: None
   - Returns: Array of formatted bounty objects
   - Implementation:
     - Gets the total number of bounties from nextBountyId
     - Retrieves details for each bounty
     - Formats and returns the bounties

2. **getBountiesByCreator()**
   - Purpose: Retrieves all bounties created by a specific address
   - Parameters: Creator address
   - Returns: Array of formatted bounty objects
   - Implementation:
     - Gets all bounties and filters by creator
     - Formats and returns the filtered bounties

3. **getBountiesForContributor()**
   - Purpose: Retrieves all bounties where a specific address is a contributor
   - Parameters: Contributor address
   - Returns: Array of formatted bounty objects
   - Implementation:
     - Gets all bounties and checks if the address is in the contributors list
     - Formats and returns the filtered bounties

4. **getBountyDetails()**
   - Purpose: Retrieves detailed information about a specific bounty
   - Parameters: Contract instance, bounty ID
   - Returns: Formatted bounty object with amount, creator, contributors, and distribution status
   - Implementation:
     - Gets the bounty struct from the contract
     - Retrieves the list of contributors
     - Formats and returns the bounty details

The results are displayed in the console and saved to a JSON file (`bounties-output.json`).

## Irys Upload (`scripts/upload-irys.ts`)

This script provides functionality to upload files and metadata to Irys permanent storage.

```bash
npm run upload:file <filePath> [tag1Name:tag1Value] [tag2Name:tag2Value] ...
npm run upload:metadata <jsonFilePath> [tag1Name:tag1Value] [tag2Name:tag2Value] ...
```

#### Key Functions:

1. **getIrys()**
   - Purpose: Creates and initializes an Irys uploader instance
   - Parameters: None
   - Returns: Configured Irys uploader
   - Implementation: Uses the @irys/upload and @irys/upload-ethereum packages to create an uploader with your private key and RPC URL

2. **uploadFile()**
   - Purpose: Uploads a file to Irys with appropriate tags
   - Parameters: 
     - filePath: Path to the file to upload
     - tags: Array of name-value tag pairs
   - Returns: Object with transaction ID and URL
   - Implementation:
     - Reads the file from disk
     - Determines the MIME type based on file extension
     - Adds default tags (Content-Type, App-Name, File-Name, Timestamp)
     - Calculates the cost to upload
     - Funds the upload if necessary
     - Uploads the file to Irys
     - Returns the transaction ID and URL

3. **uploadMetadata()**
   - Purpose: Uploads JSON metadata to Irys
   - Parameters:
     - metadata: JSON object to upload
     - tags: Array of name-value tag pairs
   - Returns: Object with transaction ID and URL
   - Implementation:
     - Converts metadata to JSON string
     - Adds default tags (Content-Type, App-Name, Type, Timestamp)
     - Calculates the cost to upload
     - Funds the upload if necessary
     - Uploads the metadata to Irys
     - Returns the transaction ID and URL

4. **getMimeType()**
   - Purpose: Determines the MIME type based on file extension
   - Parameters: File extension string
   - Returns: MIME type string
   - Implementation: Maps common file extensions to their MIME types

## Complete Workflow (`scripts/mint-with-irys.ts`)

This script demonstrates the complete workflow of uploading content to Irys and minting an NFT in the CrawlRegistry contract:

```bash
npm run mint [contentFilePath] [sourceUrl] [tag1] [tag2] ...
```

Example:
```bash
npm run mint ./sample-content.txt https://example.com blockchain storage
```

### Workflow Steps:

1. **Content Preparation**
   - Reads content from the specified file
   - Calculates a SHA-256 hash of the content
   - Prepares tags for the content

2. **Content Upload**
   - Uploads the content to Irys with appropriate tags
   - Gets a permanent URL for the content

3. **Metadata Creation and Upload**
   - Creates metadata for the content including name, description, source, hash, and tags
   - Uploads the metadata to Irys
   - Gets a permanent URL for the metadata

4. **NFT Minting**
   - Connects to the CrawlRegistry contract
   - Mints an NFT with links to the Irys content and metadata
   - Returns the token ID of the minted NFT

This workflow creates a permanent record of the content on Irys and registers it in the CrawlRegistry contract, allowing for creator support through donations and bounties.

## Sample Files

The project includes sample files for testing:

1. **sample-content.txt**: A sample article about blockchain and permanent storage
2. **sample-metadata.json**: Sample metadata in JSON format

## Contract

The CrawlRegistry contract is an ERC721 token that allows for registering and tracking crawled content with metadata. Key features include:

1. **Metadata NFTs**: Mint NFTs representing crawled content with metadata
2. **Creator Support**: Donate directly to content creators
3. **Bounty System**: Create and distribute bounties for contributors
