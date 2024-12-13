# Crypto Talks

![Thumbnail](./assets/thumbnail.png)

The site is live! Check it out at [https://crypto-talks-eta.vercel.app/](https://crypto-talks-eta.vercel.app/)

## Project Overview

Crypto Talks is a comprehensive cryptocurrency platform designed to provide users with real-time insights, interactive tools, and intelligent analytics for the crypto ecosystem.

## Features

### Cryptocurrency Market Overview
- Real-time cryptocurrency prices
- Detailed price charts
- Market cap and technical coin details

### Intelligent AI Assistance
- Crypto-focused chatbot
- Coin-specific AI interactions
- Automated news summarization

### Portfolio Management
- Track cryptocurrency holdings
- Real-time portfolio valuation
- Performance analytics

## Tech Stack

- [![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
- [![CopilotKit](https://img.shields.io/badge/CopilotKit-007ACC?style=for-the-badge&logo=github&logoColor=white)](https://github.com/features/copilot)
- [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
- [![ShadCN](https://img.shields.io/badge/ShadCN-000000?style=for-the-badge&logo=shadcn&logoColor=white)](https://ui.shadcn.com/)
- [![Appwrite](https://img.shields.io/badge/Appwrite-F02E65?style=for-the-badge&logo=appwrite&logoColor=white)](https://appwrite.io/)
- [![Groq](https://img.shields.io/badge/Groq-FF6600?style=for-the-badge&logo=groq&logoColor=black)](https://groq.netlify.app/)
- [![Langgraph](https://img.shields.io/badge/Langgraph-000000?style=for-the-badge&logo=langgraph&logoColor=white)](https://langgraph.dev/)

## Langraph Integration

![Langgraph](./assets/langgraph.png)

The graph consists of 4 nodes:

1. **Chat Node**: This node is responsible for the chatbot. It uses the Groq API to generate responses.
2. **Prices Node**: This node is responsible for fetching the prices of the cryptocurrencies. It uses the CoinGecko API to fetch the prices.
3. **Insights Node**: This node is responsible for fetching the insights of the cryptocurrencies.
4. **Cryptos Node**: This special node holds the state of cryptocurrency for the user, being able to add, delete and update the cryptocurrencies in the user's portfolio.

## Getting Started

### Prerequisites
- Node.js (v18 or later)
- npm or yarn or pnpm
- Appwrite account
- Groq API Key
- Langsmith API Key (For testing only)

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/crypto-talks.git
cd crypto-talks/ui
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env.local` file with the following:
```
NEXT_PUBLIC_APPWRITE_ENDPOINT=your_appwrite_endpoint
NEXT_PUBLIC_APPWRITE_PROJECT=your_project_id
GROQ_API_KEY=your_groq_api_key
```

4. Run the development server
```bash
npm run dev
```

## License

Distributed under the MIT License. See `LICENSE` for more information.

---

**Disclaimer**: Cryptocurrency investments carry risk. Always do your own research and consult financial advisors.