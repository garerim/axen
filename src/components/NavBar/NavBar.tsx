import { Link } from '@tanstack/react-router'
import type { NavItems } from "./type"
import UserButton from './UserButton'

export const NavBar = () => {

    const navItems: NavItems[] = [
        { name: 'Home', link: '/', isSelected: false },
        { name: 'About', link: '/about', isSelected: false },
        { name: 'Contact', link: '/contact', isSelected: false },
    ]

    return (
        <nav className="flex gap-2 justify-content-space-between w-full p-2 bg-violet-500 h-12 items-center">
            {
                navItems.map((item, index) => {
                    return (
                        <div key={index.toString()} className='w-full flex justify-center'>
                            <Link to={item.link} className={`text-white hover:bg-violet-400 p-2 ${item.isSelected ? 'bg-violet-700 underline' : ''}`}>
                                {item.name}
                            </Link>
                        </div>
                    )
                })
            }
            <UserButton />
        </nav>
    )
}