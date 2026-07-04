// src/NavbarVertical.tsx
import React, { useState, useEffect, useRef } from 'react'
import './NavbarVertical.css'

const NavbarVertical = () => {
    const [activeIndex, setActiveIndex] = useState(2)
    const [isSpinning, setIsSpinning] = useState(false)
    const [scrollOffset, setScrollOffset] = useState(0)
    const scrollTimeoutRef = useRef<number | null>(null)

    const menuItems = [
        { id: 'about', label: 'VỀ CẶP ĐÔI', section: 'frame1' },
        { id: 'location', label: 'ĐỊA ĐIỂM', section: 'frame4' },
        { id: 'schedule', label: 'THỜI GIAN CHI TIẾT', section: 'frame5' },
        { id: 'dresscode', label: 'TRANG PHỤC', section: 'frame6' },
        { id: 'rsvp', label: 'RSVP', section: 'frame7' },
    ]

    const totalItems = menuItems.length
    const itemHeight = 42

    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (isSpinning) return

        const direction = e.deltaY > 0 ? 1 : -1
        const newIndex = activeIndex + direction

        // ✅ Kiểm tra giới hạn: không cho vượt quá 0 hoặc totalItems-1
        if (newIndex < 0 || newIndex >= totalItems) return

        setIsSpinning(true)
        setActiveIndex(newIndex)
        setScrollOffset(prev => prev + direction * itemHeight)

        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
        scrollTimeoutRef.current = setTimeout(() => setIsSpinning(false), 400)
    }

    const handleClick = (index: number) => {
        if (index === activeIndex) {
            const section = document.getElementById(menuItems[index].section)
            if (section) section.scrollIntoView({ behavior: 'smooth' })
        }
    }

    useEffect(() => {
        const handleScroll = () => {
            if (isSpinning) return
            const scrollPosition = window.scrollY + 100
            let foundIndex = 2

            for (let i = menuItems.length - 1; i >= 0; i--) {
                const section = document.getElementById(menuItems[i].section)
                if (section && section.offsetTop <= scrollPosition) {
                    foundIndex = i
                    break
                }
            }

            if (foundIndex !== activeIndex) setActiveIndex(foundIndex)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [activeIndex, isSpinning])

    useEffect(() => {
        return () => {
            if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
        }
    }, [])

    return (
        <nav className="navbar-vertical" onWheel={handleWheel}>
            <ul
                className="navbar-vertical-menu"
                style={{
                    transform: `translateY(${-scrollOffset}px)`,
                    transition: isSpinning
                        ? 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                        : 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
                }}
            >
                {menuItems.map((item, index) => {
                    const isActive = index === activeIndex
                    const distance = Math.abs(index - activeIndex)

                    let opacity = 0
                    let pointerEvents: 'auto' | 'none' = 'none'

                    if (isActive) {
                        opacity = 1
                        pointerEvents = 'auto'
                    } else if (distance === 1) {
                        opacity = 0.4
                        pointerEvents = 'none'
                    } else if (distance === 2) {
                        opacity = 0.15
                        pointerEvents = 'none'
                    } else {
                        opacity = 0.05
                        pointerEvents = 'none'
                    }

                    return (
                        <li key={item.id}>
                            <button
                                className={`nav-vertical-link ${isActive ? 'active' : ''}`}
                                onClick={() => handleClick(index)}
                                style={{
                                    opacity,
                                    transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                                    pointerEvents,
                                    cursor: isActive ? 'pointer' : 'default',
                                }}
                            >
                                <span className="nav-vertical-label">{item.label}</span>
                                {isActive && <span className="nav-vertical-indicator" />}
                            </button>
                        </li>
                    )
                })}
            </ul>
        </nav>
    )
}

export default NavbarVertical