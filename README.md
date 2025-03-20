# 세종 말하기 (Sejong Malhagi)

An interactive Korean pronunciation practice app helping learners master Korean pronunciation rules like nasalization (비음화) and liquidization (유음화).

## Features

- Interactive practice with Korean pronunciation rules
- Real-time feedback on pronunciation attempts
- AI-generated examples using Perplexity AI
- Fallback to static examples when API is unavailable

## Setup

### Prerequisites

- Node.js 18+ and npm/yarn
- Perplexity AI API key (for dynamic examples)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/sejong-malhalgi.git
   cd sejong-malhalgi
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn
   ```

3. Set up environment variables:

   - Create `.env.local` in the project root
   - Add your Perplexity AI API key:
     ```
     PERPLEXITY_API_KEY=your_api_key_here
     ```
   - You can obtain a Perplexity API key from: https://www.perplexity.ai/settings/api

4. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Dynamic AI Examples

The app uses Perplexity AI to generate dynamic, authentic Korean pronunciation examples. If the API is unavailable or the key is not configured, it will fall back to static examples.

To use only static examples, simply don't set the `PERPLEXITY_API_KEY` environment variable.

## License

MIT
