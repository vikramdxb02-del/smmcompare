# 🚀 PanelHub - SMM Panel Database

The ultimate platform to search, compare, and manage SMM services across 2,500+ panels.

![PanelHub Preview](./preview.png)

## ✨ Features

- **⚡ Lightning Fast Search** - Search 3M+ services in <50ms using Meilisearch
- **📊 Price Comparison** - Compare prices across all panels instantly
- **📋 Service Lists** - Create and organize lists of your favorite services
- **🔔 Balance Alerts** - Get notified when your balance is low
- **📈 Analytics** - Track orders and spending with beautiful reports
- **🔗 Link Management** - Organize links for easy order creation
- **🌐 Multi-Panel Support** - Connect and manage multiple SMM panels

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Database**: PostgreSQL with Prisma ORM
- **Search**: Meilisearch (instant search)
- **Authentication**: NextAuth.js
- **Payments**: Stripe
- **Deployment**: Vercel + Railway

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Meilisearch instance

### Installation

1. **Clone and install dependencies**
```bash
git clone https://github.com/yourusername/panelhub.git
cd panelhub
npm install
```

2. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your credentials
```

3. **Set up the database**
```bash
npx prisma db push
npx prisma generate
```

4. **Start development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
panelhub/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Auth pages (login, register)
│   │   ├── (dashboard)/       # Dashboard pages
│   │   ├── api/               # API routes
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Landing page
│   ├── components/            # Reusable components
│   ├── lib/                   # Utility functions
│   │   ├── db.ts             # Database client
│   │   ├── auth.ts           # Auth configuration
│   │   └── search.ts         # Meilisearch client
│   └── styles/               # Global styles
├── prisma/
│   └── schema.prisma         # Database schema
├── public/                   # Static assets
└── package.json
```

## 🔧 Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."

# Meilisearch
MEILISEARCH_HOST="http://localhost:7700"
MEILISEARCH_API_KEY="your-key"

# Auth
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"

# Stripe
STRIPE_SECRET_KEY="sk_..."
STRIPE_PUBLISHABLE_KEY="pk_..."
```

## 📦 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables
5. Deploy!

### Set up Database (Railway)

1. Create a new project on [railway.app](https://railway.app)
2. Add PostgreSQL service
3. Copy the connection string
4. Add to Vercel environment variables

### Set up Search (Meilisearch)

```bash
# Using Docker
docker run -d -p 7700:7700 \
  -e MEILI_MASTER_KEY='your-key' \
  getmeili/meilisearch:latest
```

Or use [Meilisearch Cloud](https://cloud.meilisearch.com)

## 🎨 Design System

### Colors
- **Primary**: Violet/Purple (#7c3aed)
- **Secondary**: Various gradients
- **Background**: Gray-50 (#f9fafb)
- **Surface**: White

### Typography
- **Display**: Cal Sans (headings)
- **Body**: Inter (paragraphs)

## 📄 API Reference

### Search Services
```typescript
GET /api/search?q=instagram+followers&limit=50

Response:
{
  hits: [...],
  totalHits: 120571,
  processingTimeMs: 23
}
```

### Get Providers
```typescript
GET /api/providers

Response:
{
  providers: [
    { id, name, website, trustScore, ... }
  ]
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

MIT License - see [LICENSE](LICENSE) for details.

## 🆘 Support

- 📧 Email: support@panelhub.com
- 💬 Discord: [Join our server](https://discord.gg/panelhub)
- 📚 Docs: [docs.panelhub.com](https://docs.panelhub.com)

---

Built with ❤️ by [Your Name]




