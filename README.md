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

## Interaction

### General Interaction

To run a script that demonstrates all contract functions:
```bash
npm run interact
```

This will:
- Mint a new metadata NFT
- Get metadata for the token
- Get all metadata created by your wallet
- Donate to the creator
- Create a bounty
- Add a contributor to the bounty
- Distribute the bounty

### Donate to Creator

To donate to a content creator:
```bash
npm run donate <tokenId> <amount>
```

Example:
```bash
npm run donate 1 0.01
```
This donates 0.01 ETH to the creator of token ID 1.

## Irys Integration

### Upload a File to Irys

To upload a file to Irys:
```bash
npm run upload:file <filePath> [tag1Name:tag1Value] [tag2Name:tag2Value] ...
```

Example:
```bash
npm run upload:file ./image.png source:website title:"My Image"
```

### Upload Metadata to Irys

To upload a JSON metadata file to Irys:
```bash
npm run upload:metadata <jsonFilePath> [tag1Name:tag1Value] [tag2Name:tag2Value] ...
```

Example:
```bash
npm run upload:metadata ./metadata.json type:article
```

## Crawl and Mint

To crawl content, upload it to Irys, and mint an NFT in the CrawlRegistry contract:
```bash
npm run crawl <url> <contentFilePath> [tag1] [tag2] ...
```

Example:
```bash
npm run crawl https://example.com ./content.txt news blockchain
```

This process:
1. Takes content from the specified file
2. Calculates a SHA-256 hash of the content
3. Uploads the content to Irys
4. Creates and uploads metadata to Irys
5. Mints an NFT in the CrawlRegistry contract with links to the Irys content

## Contract

The CrawlRegistry contract is an ERC721 token that allows for registering and tracking crawled content with metadata. Key features include:

1. **Metadata NFTs**: Mint NFTs representing crawled content with metadata
2. **Creator Support**: Donate directly to content creators
3. **Bounty System**: Create and distribute bounties for contributors
