# API Monitor - Frontend

Beautiful real-time API monitoring dashboard inspired by Treblle's design system.

## 🚀 Live Demo

**Production:** [https://api-monitor-frontend-1o6awezr0-matej-brodaracs-projects.vercel.app](https://api-monitor-frontend-1o6awezr0-matej-brodaracs-projects.vercel.app)

The application is deployed on **Vercel** and connected to the live backend API.

---

## 🎨 Design

This project implements **Treblle's official design system** from the "Ship Happens" Hackathon 2025:

**Figma Prototype:**
- [Interactive Prototype](https://www.figma.com/proto/9RokOq6XAby6le7ePwNTj0/Treblle-"Ship-Happens"-Hackathon-2025---additional-task)

**Design Specifications:**
- **Typography:** Michroma (display/headings), DM Sans (body text)
- **Color Palette:** 
  - Primary Gradient: `#E1207A` → `#9103EB` (Pink to Purple)
  - Background: Dark purple (`#1A1726`)
- **UI Style:** Glass morphism with backdrop blur effects
- **Components:** Modern card-based layout with smooth animations

---

## 🛠 Tech Stack

### **Core Technologies:**
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server

### **Styling:**
- **Panda CSS** - CSS-in-JS styling framework ✅ BONUS
- Custom design system matching Treblle's Figma specifications

### **UI Components:**
- **Lucide React** - Icon library
- **@ark-ui/react** - Headless component architecture ⚠️ BONUS
- Custom glass morphism components

### **API Integration:**
- **Axios** - HTTP client
- Connected to Go backend API

---

## ✨ Features

### **Core Functionality:**
- ✅ Single-page application with smooth scrolling hero section
- ✅ **Dual view modes:** List view & Table view with instant toggle
- ✅ **Real-time filtering:** Method (GET, POST, DELETE), Response codes (2xx, 4xx, 5xx)
- ✅ **Sorting:** By creation time or response time
- ✅ **Search functionality** across all requests
- ✅ **Pagination** with customizable page size
- ✅ **Problem detection dashboard** with dedicated view
- ✅ **Responsive design** optimized for all screen sizes

### **Visual Features:**
- ✅ Beautiful gradient backgrounds matching Treblle's brand
- ✅ Glass morphism UI with backdrop blur effects
- ✅ Animated sparkline graphs for visual appeal
- ✅ Color-coded HTTP methods (GET=blue, POST=green, DELETE=red)
- ✅ Status code badges with semantic colors
- ✅ Smooth hover effects and transitions
- ✅ Mock location data with deterministic city assignments

---

## 🚀 Local Development

### **Prerequisites:**
- Node.js 18+ and npm installed
- Backend API running (see backend README)

### **Installation:**
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/api-monitor-frontend.git
cd api-monitor-frontend

# Install dependencies
npm install

# Generate Panda CSS styled-system
npx panda codegen
```

### **Environment Setup:**

The app connects to the backend API. By default, it uses the production backend, but you can override this for local development.

**Option 1: Use production backend (default)**
```bash
# No .env needed - uses deployed backend
npm run dev
```

**Option 2: Use local backend**

Create `.env` file:
```env
VITE_API_URL=http://localhost:8080/api
```

Then run:
```bash
npm run dev
```

### **Run Development Server:**
```bash
npm run dev
```

The app will be available at **http://localhost:5173**

### **Build for Production:**
```bash
npm run build
```

Built files will be in the `dist/` directory.

### **Preview Production Build:**
```bash
npm run preview
```

---

## 🐳 Docker

The application is fully dockerized as part of the complete stack.

### **Run with Docker Compose:**

From the **root directory** (parent of frontend and backend):
```bash
docker-compose up --build
```

The frontend will be available at **http://localhost:3000**

### **Docker Setup Details:**
- **Base image:** Node.js 20 Alpine (build stage)
- **Web server:** Nginx Alpine (runtime)
- **Build process:** Multi-stage build for optimized image size
- **Nginx configuration:** Custom config for SPA routing

---

## 📁 Project Structure
```
api-monitor-frontend/
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/             
│   │   ├── Dashboard.tsx  # Main SPA with hero + requests
│   │   └── Problems.tsx   # Problem detection view
│   ├── services/
│   │   └── api.ts         # API client configuration
│   ├── App.tsx            # Root component
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles & design tokens
├── styled-system/         # Generated Panda CSS files
├── panda.config.ts        # Panda CSS configuration
├── public/                # Static assets
├── Dockerfile             # Production container config
├── nginx.conf             # Nginx server configuration
└── package.json           # Dependencies & scripts
```

---

## 🎯 Key Components

### **Dashboard (`src/pages/Dashboard.tsx`)**
Main application view featuring:
- Hero section with gradient background
- Sticky glass navigation bar
- List/Table toggle
- Filtering and sorting controls
- Pagination
- Beautiful sparkline visualizations

### **Problems (`src/pages/Problems.tsx`)**
Dedicated problem detection view showing:
- Categorized API issues (5xx, 4xx, slow responses, timeouts)
- Full filtering and sorting capabilities
- Same dual-view layout (list/table)

### **API Service (`src/services/api.ts`)**
Centralized API client handling:
- Request logging endpoints
- Problem detection endpoints
- Error handling
- TypeScript type definitions

---

## 🎨 Styling Approach

### **Panda CSS Integration:**
The project uses **Panda CSS** for styling, providing:
- Type-safe CSS-in-JS
- Design tokens
- Atomic CSS output
- Zero runtime overhead

Example usage:
```tsx
import { css } from '../../styled-system/css';

const styles = css({
  background: 'linear-gradient(135deg, #E1207A 0%, #9103EB 100%)',
  borderRadius: '16px',
  padding: '2rem',
});
```

### **Design Tokens:**
Following Treblle's design system:
- Typography scale
- Color palette
- Spacing system
- Border radius values
- Shadow definitions

---
## 🔗 Related

**Backend Repository:** [api-monitor-backend](https://github.com/YOUR_USERNAME/api-monitor-backend)

---

## 📝 License

This project was created for the **Treblle "Ship Happens" Hackathon 2025**.

---

## 👨‍💻 Author

Built with ❤️ for the Treblle Hackathon

---

## 🏆 Hackathon Requirements Met

### **Base Requirements:** ✅ 100%
- List view with all required fields
- Table view with all required fields
- Sorting by created_at and response_time
- Filtering by method, response code, and time
- Search functionality
- Problem object definition with full CRUD

### **Bonus Requirements:** ✅ 7/9
- ✅ Custom gradient design matching Figma
- ⚠️ ArkUI/ParkUI component architecture
- ✅ Panda CSS styling framework
- ✅ Dockerized with docker-compose
- ✅ Deployed to production (Vercel)

---

**🚀 Ready to monitor your APIs in style!**
