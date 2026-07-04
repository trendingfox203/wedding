import { useEffect, useRef, useState } from 'react'
import frame1 from './assets/Frame1.png'
import frame1_text from './assets/Frame1_text.png'
import frame1_btn from './assets/Frame1_btn.png'
import frame2 from './assets/Frame2.png'
import frame2_img1 from './assets/Frame2_img1.png'
import frame2_text1 from './assets/Frame2_text1.png'
import frame2_text2 from './assets/Frame2_text2.png'
import frame2_img2 from './assets/Frame2_img2.png'
import frame2_text3 from './assets/Frame2_text3.png'
import frame3 from './assets/Frame3.png'
import frame3_video from './assets/frame3_vid.mp4'
import frame4 from './assets/Frame4.png'
import frame4_img1 from './assets/Frame4_img1.png'
import frame4_img2 from './assets/Frame4_img2.png'
import frame5 from './assets/Frame5.png'
import frame5_text from './assets/Frame5_text.png'
import frame6 from './assets/Frame6.png'
import frame6_text from './assets/Frame6_text.png'
import frame6_img from './assets/Frame6_img.png'
import frame7 from './assets/Frame7.png'
import frame7_text from './assets/Frame7_text.png'
import frame7_img from './assets/Frame7_img.png'
import './App.css'

function App() {
  const [isOpen, setIsOpen] = useState(false)
  const [showNextFrames, setShowNextFrames] = useState(false)
  const [hideFrame3, setHideFrame3] = useState(false)
  const [showFlash, setShowFlash] = useState(false)
  const [showFrame2Extra, setShowFrame2Extra] = useState(false)
  const [attend, setAttend] = useState('')
  const [guests, setGuests] = useState('')
  const [wish, setWish] = useState('')
  const [mealChoice, setMealChoice] = useState('normal')
  const [allergyDetails, setAllergyDetails] = useState('')

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const frame3Ref = useRef<HTMLElement | null>(null)
  const frame4Ref = useRef<HTMLElement | null>(null)

  // Ref để lưu timeout
  const flashTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!videoRef.current) return

    if (isOpen) {
      videoRef.current.currentTime = 0
      videoRef.current.play().catch(() => undefined)

      // ===== FLASH SAU 1.8 GIÂY =====
      flashTimeoutRef.current = setTimeout(() => {
        setShowFlash(true)  // Bật flash

        // Sau 500ms, tắt flash và chuyển scene
        transitionTimeoutRef.current = setTimeout(() => {
          setShowFlash(false)
          setHideFrame3(true)
          setShowNextFrames(true)
        }, 100)
      }, 1300) //

    } else {
      videoRef.current.pause()
      videoRef.current.currentTime = 0

      // Cleanup timeout khi đóng
      if (flashTimeoutRef.current) {
        clearTimeout(flashTimeoutRef.current)
        flashTimeoutRef.current = null
      }
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current)
        transitionTimeoutRef.current = null
      }
      setShowFlash(false)
    }

    // Cleanup khi component unmount
    return () => {
      if (flashTimeoutRef.current) {
        clearTimeout(flashTimeoutRef.current)
        flashTimeoutRef.current = null
      }
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current)
        transitionTimeoutRef.current = null
      }
    }
  }, [isOpen])

  useEffect(() => {
    const revealElements = document.querySelectorAll<HTMLElement>('.reveal')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.3 }
    )

    revealElements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  const toggleCard = () => {
    setIsOpen((prev) => !prev)
  }

  const toggleFrame2Extra = () => {
    setShowFrame2Extra((prev) => !prev)
  }

  const handleAttendChange = (value: string) => {
    setAttend(value)
    if (value === 'no') {
      setGuests('')
      setMealChoice('normal')
      setAllergyDetails('')
    }
  }

  return (
    <>
      {/* SVG mask dùng cho hiệu ứng "tẩy" (eraser reveal) của Frame 2 */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <defs>
          <mask id="eraserMask" maskUnits="objectBoundingBox" maskContentUnits="objectBoundingBox">
            <path
              d="M0,0.06 L1,0.06 L1,0.27 L0,0.27 L0,0.48 L1,0.48 L1,0.69 L0,0.69 L0,0.9 L1,0.9 L1,1.05"
              fill="none"
              stroke="#fff"
              strokeWidth={0.26}
              strokeLinecap="square"
              strokeLinejoin="round"
              pathLength={1}
              className={`eraser-path${showFrame2Extra ? ' eraser-path-active' : ''}`}
            />
          </mask>
        </defs>
      </svg>

      {/* Frame 1 & 2 luôn hiển thị */}
      <section id="frame1">
        <div className="hero-wrapper">
          <div className="frame-canvas">
            <img src={frame1_text} alt="Hero Text" className="hero-text-image reveal" />
            <img src={frame1} alt="Hero" className="hero-image reveal" />
            {/* <button className="RSVP-button">RSVP</button> */}
            <img src={frame1_btn} alt="RSVP Button" className="RSVP-button reveal" onClick={() => {
              const frame7Element = document.getElementById('frame7')
              if (frame7Element) {
                frame7Element.scrollIntoView({ behavior: 'smooth' })
              }
            }} />
          </div>
        </div>
      </section>

      <section id="frame2">
        <div className="hero-wrapper">
          <div className="frame-canvas">
            <img src={frame2} alt="Hero" className="f2_background" />
            <img
              src={frame2_img1}
              alt="Hero"
              className="f2_img1 reveal"
              onClick={toggleFrame2Extra}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  toggleFrame2Extra()
                }
              }}
            />
            <img src={frame2_text1} alt="Hero Text" className="f2_text1 reveal" />
            <img src={frame2_text2} alt="Hero Text" className="f2_text2 reveal" />
            <img
              src={frame2_img2}
              alt="Hero"
              className={`f2_img2 ${showFrame2Extra ? 'f2-extra-visible' : ''}`}
            />
            <img
              src={frame2_text3}
              alt="Hero Text"
              className={`f2_text3 ${showFrame2Extra ? 'f2-extra-visible' : ''}`}
            />
          </div>
        </div>
      </section>

      {/* Frame 3 chồng lên Frame 4: flash che lúc crossfade, không lệch layout */}
      <div className="frame3-frame4-stack">
        <div className="frame-canvas">
          <section
            id="frame3"
            ref={frame3Ref}
            className={`frame3-section ${hideFrame3 ? 'hidden' : ''}`}
          >
            <div className="hero-wrapper">
              <div
                className={`f3_background${isOpen ? 'open' : ''}`}
                onClick={toggleCard}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    toggleCard()
                  }
                }}
              >
                <video
                  ref={videoRef}
                  src={frame3_video}
                  className="card-face"
                  muted
                  playsInline
                  preload="auto"
                />
                {showFlash && <div className="frame3-flash" />}
              </div>
            </div>
          </section>

          <section
            id="frame4"
            ref={frame4Ref}
            className={`frame4-section ${showNextFrames ? 'visible' : ''}`}
          >
            <div className="hero-wrapper">
              <img src={frame4} alt="Hero" className="f4_background" />
              <img src={frame4_img2} alt="Hero" className="f4_img2" />
            </div>
          </section>
        </div>
      </div>

      {/* Các frame tiếp theo */}
      <div className={`next-frames ${showNextFrames ? 'visible' : 'hidden'}`}>
        <section id="frame5" className="frame5-section">
          <div className="hero-wrapper">
            <img src={frame5} alt="Background" className="f5_background" />
            <img src={frame5_text} alt="Hero Text" className="f5_text reveal" />
          </div>
        </section>

        <section id="frame6" className="frame6-section">
          <div className="hero-wrapper">
            <img src={frame6} alt="Hero" className="f6_background" />
            <img src={frame6_text} alt="Hero Text" className="f6_text reveal" />
            <img src={frame6_img} alt="Hero Image" className="f6_img reveal" />
          </div>
        </section>

        <section id="frame7" className="frame7-section">
          <div className="hero-wrapper">
            <img src={frame7} alt="Hero" className="f7_background" />
            <img src={frame7_text} alt="Hero Text" className="f7_text reveal" />
            <div className="frame7-form reveal">
              <label>
                Họ và Tên
                <input type="text" name="name" placeholder="Nhập họ và tên" />
              </label>

              <label>
                Bạn có tham dự đám cưới không?
                <div className="radio-group">
                  <button
                    type="button"
                    className={attend === 'yes' ? 'radio-button selected' : 'radio-button'}
                    onClick={() => handleAttendChange('yes')}
                  >
                    Có
                  </button>
                  <button
                    type="button"
                    className={attend === 'no' ? 'radio-button selected' : 'radio-button'}
                    onClick={() => handleAttendChange('no')}
                  >
                    Không
                  </button>
                </div>
              </label>

              {attend === 'yes' && (
                <label>
                  Bạn đi bao nhiêu người?
                  <input
                    type="number"
                    name="guests"
                    placeholder="Nhập số lượng"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    min="0"
                  />
                </label>
              )}

              {attend === 'no' && (
                <label>
                  Gửi lời chúc của bạn
                  <textarea
                    name="wish"
                    placeholder="Viết lời chúc tại đây"
                    value={wish}
                    onChange={(e) => setWish(e.target.value)}
                  />
                </label>
              )}

              {attend === 'yes' && (
                <fieldset className="meal-fieldset">
                  <legend>Bạn có yêu cầu đặc biệt cho menu không?</legend>
                  <div className="meal-options">
                    <button
                      type="button"
                      className={mealChoice === 'normal' ? 'meal-button selected' : 'meal-button'}
                      onClick={() => setMealChoice('normal')}
                    >
                      Bình thường
                    </button>
                    <button
                      type="button"
                      className={mealChoice === 'vegetarian' ? 'meal-button selected' : 'meal-button'}
                      onClick={() => setMealChoice('vegetarian')}
                    >
                      Ăn chay
                    </button>
                    <button
                      type="button"
                      className={mealChoice === 'allergy' ? 'meal-button selected' : 'meal-button'}
                      onClick={() => setMealChoice('allergy')}
                    >
                      Dị ứng với...
                    </button>
                  </div>

                  {mealChoice === 'allergy' && (
                    <label className="allergy-label">
                      Nhập chi tiết dị ứng
                      <textarea
                        name="allergyDetails"
                        placeholder="Nhập chi tiết..."
                        value={allergyDetails}
                        onChange={(e) => setAllergyDetails(e.target.value)}
                      />
                    </label>
                  )}
                </fieldset>
              )}

              <button type="button" className="frame7-submit">Xác nhận</button>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default App