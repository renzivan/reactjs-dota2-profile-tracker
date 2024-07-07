import { BrowserRouter } from 'react-router-dom'
import './App.css'
import BaseRouter from './routes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchInterval: 0,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchIntervalInBackground: false
      }
    }
  })

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <BaseRouter />
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
