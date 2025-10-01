import {  Routes, Route} from "react-router-dom"
import MainPage from "./pages/MainPage"
import DetailPage from "./pages/DetailPage"

const App = () => {
  return (
      <Routes>
        <Route path='/' element={<MainPage/>}/>
        <Route path='/:id' element={<DetailPage/>}/>
      </Routes>
  )
}

export default App