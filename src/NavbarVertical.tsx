// src/NavbarVertical.tsx
import { useState, useEffect, useRef } from 'react'
import './NavbarVertical.css'

// Mục ở giữa danh sách khi mới tải trang (khớp với vị trí offset=0 ban đầu)
const CENTER_INDEX = 2

const NavbarVertical = () => {
    const [activeIndex, setActiveIndex] = useState(CENTER_INDEX)
    const [isSpinning, setIsSpinning] = useState(false)
    const [scrollOffset, setScrollOffset] = useState(0)
    const scrollTimeoutRef = useRef<number | null>(null)
    const navRef = useRef<HTMLElement | null>(null)
    // Trackpad Mac bắn ra hàng loạt sự kiện wheel nhỏ liên tục (kèm hiệu ứng "trớn"
    // momentum kéo dài cả sau khi nhấc tay), khác hẳn chuột Windows (mỗi nấc 1 sự
    // kiện lớn, rời rạc). Cộng dồn deltaY và chỉ chuyển mục khi vượt ngưỡng để 2 nền
    // tảng cư xử giống nhau, tránh nhảy lung tung/lọt cuộn ở gần biên trên Mac.
    const wheelAccumulatorRef = useRef(0)
    const WHEEL_THRESHOLD = 50

    // Đọc được giá trị mới nhất trong listener native mà không cần gắn/gỡ lại listener
    // mỗi lần state đổi (tránh churn, và tránh closure bị "đứng hình" giá trị cũ)
    const activeIndexRef = useRef(activeIndex)
    const isSpinningRef = useRef(isSpinning)
    useEffect(() => {
        activeIndexRef.current = activeIndex
    }, [activeIndex])
    useEffect(() => {
        isSpinningRef.current = isSpinning
    }, [isSpinning])

    const menuItems = [
        { id: 'about', label: 'VỀ CẶP ĐÔI', section: 'frame1' },
        { id: 'location', label: 'ĐỊA ĐIỂM', section: 'frame4' },
        { id: 'schedule', label: 'THỜI GIAN CHI TIẾT', section: 'frame5' },
        { id: 'dresscode', label: 'TRANG PHỤC', section: 'frame6' },
        { id: 'rsvp', label: 'RSVP', section: 'frame7' },
    ]

    const totalItems = menuItems.length
    const itemHeight = 42

    // Gắn wheel listener bằng addEventListener native với { passive: false } thay vì
    // prop onWheel của React - trên Safari/macOS, preventDefault() qua sự kiện tổng
    // hợp của React đôi khi không chặn được cuộn/nảy trang gốc một cách đáng tin cậy
    // khi thao tác bằng trackpad, khiến cuộn "lọt" xuống trang chính ở gần biên.
    useEffect(() => {
        const nav = navRef.current
        if (!nav) return

        const handleWheelNative = (e: WheelEvent) => {
            e.preventDefault()
            e.stopPropagation()
            if (isSpinningRef.current) return

            wheelAccumulatorRef.current += e.deltaY
            if (Math.abs(wheelAccumulatorRef.current) < WHEEL_THRESHOLD) return

            const direction = wheelAccumulatorRef.current > 0 ? 1 : -1
            wheelAccumulatorRef.current = 0

            const newIndex = activeIndexRef.current + direction

            // ✅ Kiểm tra giới hạn: không cho vượt quá 0 hoặc totalItems-1
            if (newIndex < 0 || newIndex >= totalItems) return

            setIsSpinning(true)
            setActiveIndex(newIndex)
            setScrollOffset(prev => prev + direction * itemHeight)

            if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
            scrollTimeoutRef.current = setTimeout(() => setIsSpinning(false), 400)
        }

        nav.addEventListener('wheel', handleWheelNative, { passive: false })
        return () => nav.removeEventListener('wheel', handleWheelNative)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleClick = (index: number) => {
        if (index !== activeIndex) {
            setActiveIndex(index)
            setScrollOffset((index - CENTER_INDEX) * itemHeight)
        }
        const section = document.getElementById(menuItems[index].section)
        if (section) section.scrollIntoView({ behavior: 'smooth' })
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
        <nav className="navbar-vertical" ref={navRef}>
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

                    if (isActive) {
                        opacity = 1
                    } else if (distance === 1) {
                        opacity = 0.4
                    } else if (distance === 2) {
                        opacity = 0.15
                    } else {
                        opacity = 0.05
                    }

                    return (
                        <li key={item.id}>
                            <button
                                className={`nav-vertical-link ${isActive ? 'active' : ''}`}
                                onClick={() => handleClick(index)}
                                style={{
                                    opacity,
                                    transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                                    pointerEvents: 'auto',
                                    cursor: 'pointer',
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