import { NavbarRoutes } from "./navbar-routes"
import { MobileSidebar } from "./mobile-sidebar";
import { Logo } from "./logo";

const Navbar = () => {
    return (
        <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
            <MobileSidebar />
            <div>
                <Logo />
            </div>
            <NavbarRoutes />
        </div>
    );
}

export default Navbar;