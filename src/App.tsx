import { useEffect, useRef, useState } from 'react'
import frame1 from './assets/Frame1.png'
import frame1_text from './assets/Frame1_text.png'
import frame1_btn from './assets/Frame1_btn.png'
import frame2 from './assets/frame2.png'
import frame2_img1 from './assets/frame2_img1.png'
import frame2_text1 from './assets/frame2_text1.png'
import frame2_text2 from './assets/frame2_text2.png'
import frame2_img2 from './assets/frame2_img2.png'
import frame2_text3 from './assets/frame2_text3.png'
import frame3_poster from './assets/frame3.png'
import frame3_video from './assets/frame3_vid.mp4'
import frame4 from './assets/frame4.png'
// import frame4_img1 from './assets/Frame4_img1.png'
import frame4_img2 from './assets/frame4_img2.png'
import frame5 from './assets/frame5.png'
import frame5_text from './assets/frame5_text.png'
import frame6 from './assets/frame6.png'
import frame6_text from './assets/frame6_text.png'
import frame6_img from './assets/frame6_img.png'
import frame7 from './assets/frame7.png'
import frame7_text from './assets/frame7_text.png'
import NavbarVertical from './NavbarVertical'// import frame7_img from './assets/Frame7_img.png'
import './App.css'

function App() {
  const [isOpen, setIsOpen] = useState(false)
  const [showNextFrames, setShowNextFrames] = useState(false)
  const [hideFrame3, setHideFrame3] = useState(false)
  const [showFlash, setShowFlash] = useState(false)
  const [showFrame2Extra, setShowFrame2Extra] = useState(false)
  const [name, setName] = useState('')
  const [attend, setAttend] = useState('')
  const [guests, setGuests] = useState('')
  const [wish, setWish] = useState('')
  const [mealChoice, setMealChoice] = useState('normal')
  const [allergyDetails, setAllergyDetails] = useState('')
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [submitMessage, setSubmitMessage] = useState('')

  const GOOGLE_SCRIPT_URL =
    'https://script.google.com/macros/s/AKfycbzzQz5A3X72vMK7_bxkrn0G58tOSKxE5h2DXPSu7hL9n74K9Yugw_3fubnMaRbysEqo/exec'

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const frame3Ref = useRef<HTMLElement | null>(null)
  const frame4Ref = useRef<HTMLElement | null>(null)

  // Ref để lưu timeout
  const flashTimeoutRef = useRef<number | null>(null)
  const transitionTimeoutRef = useRef<number | null>(null)
  const videoFallbackTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const startFlashSequence = () => {
      flashTimeoutRef.current = setTimeout(() => {
        setShowFlash(true)

        transitionTimeoutRef.current = setTimeout(() => {
          setShowFlash(false)
          setHideFrame3(true)
          setShowNextFrames(true)
        }, 100)
      }, 1300)
    }

    // Chỉ bắt đầu đếm giờ flash khi video THỰC SỰ đã bắt đầu phát (sự kiện 'playing'),
    // thay vì đếm mù ngay từ lúc bấm - tránh trường hợp mạng chậm, video chưa kịp
    // phát mà Frame 3 đã tự động biến mất.
    const handlePlaying = () => {
      if (videoFallbackTimeoutRef.current) {
        clearTimeout(videoFallbackTimeoutRef.current)
        videoFallbackTimeoutRef.current = null
      }
      startFlashSequence()
    }

    if (isOpen) {
      video.currentTime = 0
      video.addEventListener('playing', handlePlaying)
      video.play().catch(() => undefined)

      // Mạng quá chậm, video không phát được trong 4s - vẫn tiếp tục để không bị kẹt mãi
      videoFallbackTimeoutRef.current = setTimeout(() => {
        video.removeEventListener('playing', handlePlaying)
        startFlashSequence()
      }, 4000)

    } else {
      video.pause()
      video.currentTime = 0
      video.removeEventListener('playing', handlePlaying)

      if (flashTimeoutRef.current) {
        clearTimeout(flashTimeoutRef.current)
        flashTimeoutRef.current = null
      }
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current)
        transitionTimeoutRef.current = null
      }
      if (videoFallbackTimeoutRef.current) {
        clearTimeout(videoFallbackTimeoutRef.current)
        videoFallbackTimeoutRef.current = null
      }

      // ✅ Fix lỗi ESLint: bọc trong setTimeout
      setTimeout(() => {
        setShowFlash(false)
      }, 0)
    }

    return () => {
      video.removeEventListener('playing', handlePlaying)
      if (flashTimeoutRef.current) {
        clearTimeout(flashTimeoutRef.current)
        flashTimeoutRef.current = null
      }
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current)
        transitionTimeoutRef.current = null
      }
      if (videoFallbackTimeoutRef.current) {
        clearTimeout(videoFallbackTimeoutRef.current)
        videoFallbackTimeoutRef.current = null
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
      { threshold: 0.2 }
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

  const handleSubmit = async () => {
    if (!name.trim() || !attend) {
      setSubmitStatus('error')
      setSubmitMessage('Vui lòng nhập họ tên và chọn có tham dự hay không.')
      return
    }

    setSubmitStatus('submitting')
    setSubmitMessage('')

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ name, attend, guests, wish, mealChoice, allergyDetails }),
      })
      setSubmitStatus('success')
      setSubmitMessage('Đã gửi xác nhận thành công! Cảm ơn bạn.')
    } catch {
      setSubmitStatus('error')
      setSubmitMessage('Gửi thất bại, vui lòng kiểm tra kết nối và thử lại.')
    }
  }

  return (
    <>
      {/* Frame 1 & 2 luôn hiển thị */}
      <section id="frame1">
        <div className="hero-wrapper">
          <div className="frame-canvas">
            <img src={frame1_text} alt="Hero Text" className="hero-text-image " />
            <img src={frame1} alt="Hero" className="hero-image reveal" />
            {/* <button className="RSVP-button">RSVP</button> */}
            <img
              src={frame1_btn}
              alt="RSVP Button"
              className="RSVP-button reveal"
              onClick={() => {
                window.scrollTo({
                  top: document.documentElement.scrollHeight,
                  behavior: 'smooth'
                })
              }}
            />
          </div>
          <NavbarVertical />

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
              loading="lazy"
            />
            <img
              src={frame2_text3}
              alt="Hero Text"
              className={`f2_text3 ${showFrame2Extra ? 'f2-extra-visible' : ''}`}
              loading="lazy"
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
                  poster={frame3_poster}
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
              <img src={frame4} alt="Hero" className="f4_background" loading="lazy" />
              <img src={frame4_img2} alt="Hero" className="f4_img2" loading="lazy" />
            </div>
          </section>
        </div>
      </div>

      {/* Các frame tiếp theo */}
      <div className={`next-frames ${showNextFrames ? 'visible' : 'hidden'}`}>
        <section id="frame5" className="frame5-section">
          <div className="hero-wrapper">
            <img src={frame5} alt="Background" className="f5_background" loading="lazy" />
            <img src={frame5_text} alt="Hero Text" className="f5_text reveal" loading="lazy" />
          </div>
        </section>

        <section id="frame6" className="frame6-section">
          <div className="hero-wrapper">
            <img src={frame6} alt="Hero" className="f6_background" loading="lazy" />
            <img src={frame6_text} alt="Hero Text" className="f6_text reveal" loading="lazy" />
            <img src={frame6_img} alt="Hero Image" className="f6_img reveal" loading="lazy" />
          </div>
        </section>

        <section id="frame7" className="frame7-section">
          <div className="hero-wrapper">
            <img src={frame7} alt="Hero" className="f7_background" loading="lazy" />
            <img src={frame7_text} alt="Hero Text" className="f7_text reveal" loading="lazy" />
            <div className="frame7-form reveal">
              <label>
                Họ và Tên
                <input
                  type="text"
                  name="name"
                  placeholder="Nhập họ và tên"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
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

              <button
                type="button"
                className="frame7-submit"
                onClick={handleSubmit}
                disabled={submitStatus === 'submitting'}
              >
                {submitStatus === 'submitting' ? 'Đang gửi...' : 'Xác nhận'}
              </button>

              {submitMessage && (
                <p className={`frame7-submit-message ${submitStatus}`}>{submitMessage}</p>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default App