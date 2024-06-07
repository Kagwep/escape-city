
# Escape City

Escape City is a decentralized game built on the MultiversX blockchain, inspired by CryptoKitties but with a unique twist. Players grow and evolve their runaways through engaging and immersive escape gameplay.

![Dashboad](https://res.cloudinary.com/dydj8hnhz/image/upload/v1717746227/bpgdwslzrs9cgs46idlb.png)

## Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Architecture](#architecture)
4. [Smart Contract Overview](#smart-contract-overview)
5. [Frontend Integration](#frontend-integration)
6. [Usage](#usage)
7. [Future Improvements](#future-improvements)
8. [Contributing](#contributing)
9. [License](#license)

## Introduction

Escape City offers a dynamic and interactive experience where players manage and evolve their runaways. By completing challenges, players increase the weight of their runaways, allowing them to multiply. Additionally, players can list their runaways for auction and buy runaways from others.

[Live Link to Play Escape City](https://escape-city.vercel.app/)

## Features

- **Multiplication Mechanism**: Runaways can multiply once they reach a weight of 200. Players collaborate by requesting and approving multiplication.
- **Auction System**: Players list their runaways for auction and buy runaways from others.
- **Gameplay Mechanics**: Players earn points by participating in escape games, which contribute to their runaway's growth.

## Architecture

Escape City consists of smart contracts deployed on the MultiversX blockchain and a React-based frontend application. The architecture ensures secure and decentralized gameplay, with smart contracts handling the core game logic and the frontend providing an interactive user interface.

## Smart Contract Overview

### Multiplication Mechanism

- **Request Multiplication**: A player can request the multiplication of their runaway with another player's runaway if both meet the weight requirement.
- **Approve Multiplication**: The owner of the target runaway approves the request, leading to the creation of a new runaway.

### Auction System

- **List Runaway for Auction**: Players can list their runaways for auction, setting a price for others to buy.
- **Buy Runaway**: Players can purchase listed runaways, facilitating a dynamic marketplace.

`contract adress: erd1qqqqqqqqqqqqqpgq0xcq4gw05kw86ttw267gwc0asvefkg5r6dzs8mh6fa`

## Frontend Integration

The frontend application is built using React and integrates seamlessly with the MultiversX blockchain. Key components include:

- **Runaway Management**: Interfaces for viewing, managing, and evolving runaways.
- **Multiplication Requests**: UI for requesting and approving runaway multiplication.
- **Auction Listings**: Pages for listing runaways for auction and buying them.
- **Gameplay Interface**: Interactive escape game where players earn points to grow their runaways.

## Usage

### Prerequisites

- Node.js
- MultiversX wallet
- Rust

### Installation

1. Clone the repository: `git clone https://github.com/Kagwep/escape-city.git`
2. Navigate to the project directory: `cd escape-city`
3. Install dependencies: `yarn install`

### Running the Application

1. Start the local development server: `yarn start:devnet`
2. Open your browser and navigate to `https://localhost:3000`

### Deploying Smart Contracts

1. Compile the smart contracts using the MultiversX SDK.
2. Deploy the contracts to the MultiversX blockchain.
3. Update the contract addresses in the frontend configuration.

## Future Improvements

- **User Communication**: Enhance tools for players to coordinate multiplication requests.
- **Expanded Auction System**: Introduce more robust features for auctions.
- **Additional Gameplay Features**: Add new challenges and mechanics to keep the game engaging.


## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.