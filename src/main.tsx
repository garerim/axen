import { RouterProvider, createRouter } from '@tanstack/react-router';
import ReactDOM from 'react-dom/client';

// Import the generated route tree
import { routeTree } from './routeTree.gen';

import "./index.css";
import { WebSocketProvider } from './components/provider/WebSocketProvider';
import { ThemeProvider } from './components/provider/ThemeProvider';

// Create a new router instance
const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Render the app
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <WebSocketProvider>
        <div className='w-full h-screen'>
          <RouterProvider router={router} />
        </div>
      </WebSocketProvider>
    </ThemeProvider>
  )
}