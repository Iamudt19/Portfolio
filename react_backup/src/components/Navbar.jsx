import { Link, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'Home',     to: '/'         },
  { label: 'Projects', to: '/projects' },
  { label: 'About',    to: '/about'    },
  { label: 'Contact',  to: '/contact'  },
];

export default function Navbar() {
  const { pathname } = useLocation();
  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-8 py-6 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-black/5 md:bg-transparent md:backdrop-blur-none md:border-none">
      <Link to="/" className="font-sans font-bold text-xl tracking-tight text-black select-none hover:opacity-75 transition-opacity">
        UDIT
      </Link>
      <ul className="flex gap-6 md:gap-8">
        {NAV_LINKS.map(({ label, to }) => (
          <li key={to}>
            <Link
              to={to}
              className={`font-sans text-xs md:text-sm tracking-widest uppercase transition-all duration-300 relative py-1 ${
                pathname === to 
                  ? 'opacity-100 font-bold' 
                  : 'opacity-40 hover:opacity-100'
              }`}
            >
              {label}
              {pathname === to && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-black rounded-full" />
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
