# SeedFlow

SeedFlow is a Solana-based mobile dApp that enables underserved farmers and small entrepreneurs to receive instant small loans bundled with parametric insurance triggered by oracles.

## Features

- Instant small loans without collateral
- Parametric insurance integration
- Oracle-triggered insurance payouts
- Mobile-first design
- Solana blockchain integration

## Prerequisites

- Node.js (v16 or higher)
- Solana CLI tools
- Anchor Framework
- A Solana wallet (e.g., Phantom)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/seedflow.git
cd seedflow
```

2. Install dependencies:
```bash
npm install
```

3. Set up Solana development environment:
```bash
solana config set --url localhost
```

4. Start the development server:
```bash
npm start
```

## Project Structure

```
seedflow/
├── src/                    # Source files
│   ├── components/        # React components
│   ├── contracts/        # Solana smart contracts
│   ├── utils/            # Utility functions
│   └── App.tsx           # Main application component
├── public/               # Static files
└── tests/               # Test files
```

## Smart Contracts

The project includes the following Solana programs:
- Loan Program: Handles loan creation and management
- Insurance Program: Manages parametric insurance policies
- Oracle Integration: Connects with external data providers

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 