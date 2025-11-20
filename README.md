# BUSINESS MESENGER - FRONTEND ONLY

## Screenshots

<img width="966" height="767" alt="AppScreen" src="https://github.com/user-attachments/assets/18ca1c75-7cd1-429e-820d-0639eb50bbfb" />
<img width="1748" height="848" alt="screen1" src="https://github.com/user-attachments/assets/59bb348e-c89a-4738-b2aa-3e5bcddd1dad" />
<img width="1748" height="848" alt="screen2" src="https://github.com/user-attachments/assets/51141d19-b72a-4028-95ba-7fb055f65d1f" />
<img width="1748" height="848" alt="screen3" src="https://github.com/user-attachments/assets/cc79e21f-e02e-4bd9-aa72-be3ec2b9a902" />
<img width="1748" height="848" alt="screen4" src="https://github.com/user-attachments/assets/0576ddbc-4b42-48a7-9cf8-00fc330879cf" />
<img width="1748" height="848" alt="screen5" src="https://github.com/user-attachments/assets/d2c0b959-8ad2-4743-9b46-746884d94385" />
<img width="1748" height="848" alt="scren6" src="https://github.com/user-attachments/assets/b54f3321-6d9f-473f-89dc-f293478841b1" />
<img width="1748" height="848" alt="screen7" src="https://github.com/user-attachments/assets/14ef8aba-c8c9-41cc-bd24-e12fa38f42ac" />
<img width="1748" height="119" alt="screen 8" src="https://github.com/user-attachments/assets/a916cd71-2773-40df-9cbf-c4b2213f31ec" />
<img width="1748" height="846" alt="screen9" src="https://github.com/user-attachments/assets/967a6ee9-f478-487d-9251-23fbbe2cf578" />
<img width="1748" height="846" alt="screen10" src="https://github.com/user-attachments/assets/b955241a-e5ba-45ef-8df9-9579a7a0604e" />


A modern, feature-rich messaging interface built with React and TypeScript, showcasing dynamic message composition with inline variable insertion, multimedia support, and campaign management.

## ✨ Features

### Core Messaging
- **Rich Text Messaging**: Send and receive text messages with real-time updates
- **Variable Insertion**: Insert dynamic variables inline within messages for personalization
- **Message Scheduling**: Schedule messages to be sent at specific times
- **Message Types**: Support for text, carousel, and media messages
- **Suggestion Buttons**: Add interactive quick-reply buttons to messages

### Advanced Features
- **Thread Management**: Organize conversations into threads for better management
- **Campaign Builder**: Create and launch messaging campaigns to multiple recipients
- **Recipient Management**: Add, search, and manage recipients with detailed contact information
- **Carousel Messages**: Create rich carousel cards with images, titles, descriptions, and action buttons
- **Media Messages**: Send images, videos, and files with captions and suggestions
- **View Modes**: Switch between Chat, Scheduled, Sent, Threads, and Campaigns views

### UI/UX
- **Mobile-First Design**: Responsive interface with dedicated mobile frame
- **Dark/Light Mode Support**: Built-in theme support via shadcn-ui
- **Typing Indicators**: Real-time typing feedback
- **Empty States**: Thoughtful empty state designs for all views
- **Search & Filter**: Search recipients and filter messages by status

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn-ui (Radix UI primitives)
- **Routing**: React Router v6
- **State Management**: React Query (TanStack Query)
- **Date Handling**: date-fns
- **Icons**: Lucide React
- **Form Handling**: React Hook Form with Zod validation

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. Clone the repository:
```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn-ui components
│   ├── MessageBubble.tsx
│   ├── CarouselMessage.tsx
│   ├── MediaMessage.tsx
│   ├── ThreadBuilder.tsx
│   ├── CampaignItem.tsx
│   └── ...
├── pages/              # Route pages
│   └── Index.tsx       # Main application page
├── lib/                # Utility libraries
│   ├── utils.ts
│   ├── chipHelpers.ts
│   └── dropdownHelpers.ts
├── utils/              # Utility functions
│   ├── messageCreator.ts
│   └── time.ts
├── hooks/              # Custom React hooks
├── index.css           # Global styles & design system
└── main.tsx            # Application entry point
```

## 🎨 Design System

The project uses a comprehensive design system defined in `src/index.css` and `tailwind.config.ts`:

- **Semantic Color Tokens**: HSL-based color system for consistent theming
- **Gradients**: Pre-defined gradient utilities (`bg-gradient-tech`, etc.)
- **Message Styles**: Custom message bubble colors and states
- **Responsive Typography**: Mobile and desktop font scaling
- **Dark Mode**: Automatic theme switching support

## 📱 Usage

### Sending Messages
1. Type your message in the input field at the bottom
2. Use `{` to insert variables (name, email, mobile)
3. Click send or press Enter

### Creating Threads
1. Navigate to the Threads view
2. Click "Create Thread"
3. Add multiple messages with different types
4. Save the thread for reuse

### Launching Campaigns
1. Navigate to Campaigns view
2. Click "Create Campaign"
3. Select a thread and recipients
4. Launch to send to all selected contacts

### Scheduling Messages
1. Compose your message
2. Click the clock icon
3. Select date and time
4. Confirm to schedule

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment.

## 🚀 Deployment

You can deploy to any static hosting service (Vercel, Netlify, etc.) by building the project and uploading the `dist/` folder.
