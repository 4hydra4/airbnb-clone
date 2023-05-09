import { Outlet } from "react-router-dom";
import Header from "./Header";

function Layout() {
    return (
        <div className="pb-8 flex flex-col min-h-screen">
            <Header />
            <Outlet />
        </div>
    );
}

export default Layout;
// mx-4 lg:mx-12