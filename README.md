# Bot RSS Twitter

A Twitter bot that posts RSS feed updates every 30 minutes using Bun runtime and SQLite database.

## Features

- Lightweight SQLite database
- Built with Bun for better performance
- Automatic tweet scheduling
- RSS feed parsing and monitoring
- Duplicate tweet prevention
- 7-day auto-cleanup of old tweets
- Automated dependency updates with Renovate
- Security monitoring with Snyk

## Prerequisites

- [Bun](https://bun.sh) installed on your system
- Twitter Developer Account with API credentials

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/botx-rss.git
```

2. Install dependencies:

```bash
bun install
```

3. Create a `.env` file with the following variables:

```bash

# Application
PORT=3000

# Twitter API
TWITTER_API_KEY=
TWITTER_API_SECRET=
TWITTER_ACCESS_TOKEN=
TWITTER_ACCESS_TOKEN_SECRET=

```

## Usage

Developpement mode:

```bash
bun dev
```

Production mode:

```bash
bun start
```

## API Endpoints

- `GET /feeds` - List all RSS feeds
- `POST /feed` - Add new RSS feed
- `GET /` - Health check

## Testing

Run the test suite:

```bash
bun test
```

Watch mode:

```bash
bun test --watch
```

## Contributing

Contributions are welcome! Please feel free to submit a PR.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a PR

## License

This project is open-sourced under the MIT License - see the [LICENSE](LICENSE) file for details.
