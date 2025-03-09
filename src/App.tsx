import { BrowserRouter } from 'react-router-dom'
import './App.css'
import BaseRouter from './routes'
import { Provider } from 'react-redux'
import store from './store'
import { ApolloProvider } from '@apollo/client'
import { client } from './services/config.service'


function App() {
  return (
    <ApolloProvider client={client}>
        <BrowserRouter>
          <Provider store={store}>
            <BaseRouter />
          </Provider>
        </BrowserRouter>
    </ApolloProvider>
  )
}

export default App
