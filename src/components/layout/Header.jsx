import { Bell, Search, User, Menu } from 'lucide-react';

const Header = () => {
    return (
        <header className="h-20 bg-white/50 backdrop-blur-xl border-b border-brand-primary/5 flex items-center justify-between px-8 sticky top-0 z-30">
            {/* Search Bar */}
            <div className="hidden md:flex items-center bg-brand-primary/[0.03] border border-brand-primary/5 rounded-2xl px-4 py-2.5 w-96 group focus-within:border-brand-primary/20 transition-all">
                <Search className="w-4 h-4 text-brand-primary/30 group-focus-within:text-brand-primary/60" />
                <input
                    type="text"
                    placeholder="Search everything..."
                    className="bg-transparent border-none focus:ring-0 text-sm ml-3 w-full text-brand-primary placeholder:text-brand-primary/30"
                />
            </div>

            <div className="flex items-center gap-2 md:hidden">
                <button className="p-2 text-brand-primary/60 hover:bg-brand-primary/5 rounded-xl">
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
                {/* Notifications */}
                {/* <button className="p-2.5 text-brand-primary/60 hover:bg-brand-primary/5 rounded-xl relative group transition-all">
                    <Bell className="w-[20px] h-[20px]" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-brand-accent rounded-full border-2 border-white" />
                </button> */}

                {/* User Profile */}
                <div className="flex items-center gap-3 pl-4 border-l border-brand-primary/5">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-bold text-brand-primary">Admin User</p>
                        <p className="text-[10px] text-brand-primary/40 font-bold uppercase tracking-wider">Super Admin</p>
                    </div>
                    <button className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white ring-4 ring-brand-primary/5 shadow-premium">
                        <User className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
