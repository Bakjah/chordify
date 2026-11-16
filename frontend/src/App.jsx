import { NotificationProvider } from './context/NotificationContext.jsx'
import AppRoutes from './routes/AppRoutes.jsx'

export default function App() {
  return (
    <NotificationProvider>
      <AppRoutes />
    </NotificationProvider>
  )
}
