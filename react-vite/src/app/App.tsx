import { Route, Routes } from 'react-router';
import AllProducts from '../features/products/AllProducts'
import ChatHomeScreen from '../pages/chat/ChatHomeScreen'
import '../styles/App.css'
// function App() {
//   return (
//     // <AllProducts />
//     //    <SpecificProduct /> 
//     //    <AddNewProduct /> 
//     //  <UpdateProduct productId={4} /> 
//     <ChatHomeScreen />
//   )
// }

function App() {
  return (
    <Routes>
      <Route path="/" element={<ChatHomeScreen />}>
        {/* <Route index element={<HomePage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="chat" element={<ChatPage />} />
        <Route path="about" element={<AboutPage />} /> */}
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

// Simple 404 component
const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Page not found</p>
      <a
        href="/"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Go Home
      </a>
    </div>
  </div>
);

export default App
