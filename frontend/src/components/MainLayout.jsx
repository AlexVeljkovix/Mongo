import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

function MainLayout() {
    return (
        <div className="app-layout">
            <Header />
            <main>
                <Outlet />
            </main>

            <Footer />
        </div>
    )
}

export default MainLayout
