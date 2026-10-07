import { useEffect, useState } from 'react'
import './App.css'

const weddingDate = new Date('2026-10-25T06:00:00+05:30')
const weddingDateLabel = 'Sunday, 25 October 2026'
const weddingVenue = 'Vijay Palace, Arakkonam, Tamil Nadu'
const rsvpEmail = 'sriramramesh8904@gmail.com'

function getCountdown() {
  const remaining = Math.max(0, weddingDate.getTime() - Date.now())
  const days = Math.floor(remaining / 86_400_000)
  const hours = Math.floor((remaining / 3_600_000) % 24)
  const minutes = Math.floor((remaining / 60_000) % 60)
  const seconds = Math.floor((remaining / 1_000) % 60)

  return { days, hours, minutes, seconds }
}

function calendarStamp(date) {
  return date
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '')
}

function App() {
  const [countdown, setCountdown] = useState(getCountdown)
  const [attendance, setAttendance] = useState('')
  const [rsvpMessage, setRsvpMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const timer = window.setInterval(() => setCountdown(getCountdown()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  function saveDate() {
    const endDate = new Date(weddingDate.getTime() + 4 * 60 * 60 * 1000)
    const calendar = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Dharanishree and Karthikeyan//Wedding Invitation//EN',
      'BEGIN:VEVENT',
      `DTSTAMP:${calendarStamp(new Date())}`,
      `DTSTART:${calendarStamp(weddingDate)}`,
      `DTEND:${calendarStamp(endDate)}`,
      'SUMMARY:Dharanishree & Karthikeyan - Wedding',
      `LOCATION:${weddingVenue.replaceAll(',', '\\,')}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n')
    const file = new Blob([calendar], { type: 'text/calendar;charset=utf-8' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(file)
    link.download = 'dharanishree-and-karthikeyan.ics'
    document.body.append(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(link.href), 1000)
  }

  async function submitRsvp(event) {
    event.preventDefault()
    const formElement = event.currentTarget
    const form = new FormData(formElement)
    const guestName = String(form.get('name') ?? '').trim()
    const response = {
      name: guestName,
      attendance: attendance === 'yes' ? 'Joyfully accepts' : 'Regretfully declines',
      guests: attendance === 'yes' ? form.get('guests') : '0',
      _subject: `Wedding RSVP: ${guestName}`,
      _template: 'table',
    }
    setIsSubmitting(true)
    setRsvpMessage('')

    try {
      const result = await fetch(`https://formsubmit.co/ajax/${rsvpEmail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(response),
      })
      const data = await result.json()

      if (!result.ok || (data.success !== true && data.success !== 'true')) {
        throw new Error(data.message || 'The RSVP could not be sent.')
      }

      setRsvpMessage('Your RSVP was submitted. Thank you!')
      formElement.reset()
      setAttendance('')
    } catch {
      setRsvpMessage(`We couldn't send your reply. Please try again or email ${rsvpEmail}.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__wash" />
        <header className="topbar">
          <a className="monogram" href="#home" aria-label="Dharanishree and Karthikeyan, home">
            <span>D</span><i>&amp;</i><span>K</span>
          </a>
        </header>
        <div className="hero__content" id="home">
          <p className="eyebrow hero__eyebrow">A celebration of love &amp; tradition</p>
          <h1 id="hero-title"><span>Dharanishree</span><i>&amp;</i><span>Karthikeyan</span></h1>
          <p className="hero__date">{weddingDateLabel}<span>{weddingVenue}</span></p>
          <a className="scroll-cue" href="#invitation" aria-label="Scroll to the invitation">
            <span />
          </a>
        </div>
      </section>

      <section className="invitation" id="invitation" aria-labelledby="invitation-title">
        <div className="invitation__frame">
          <div className="ornament ornament--top" aria-hidden="true"><span>✦</span></div>
          <p className="eyebrow">With the blessings of our families</p>
          <h2 id="invitation-title">Together with our loved ones</h2>
          <p className="invitation__copy">
            The stars aligned, our hearts agreed, and now a beautiful forever begins. Join us
          </p>
          <div className="couple-names" aria-label="Dharanishree and Karthikeyan">
            <span>Dharanishree</span><i>&amp;</i><span>Karthikeyan</span>
          </div>
          <p className="invitation__note">Two families. One joyful beginning.</p>
          <div className="ornament ornament--bottom" aria-hidden="true"><span>✦</span></div>
        </div>
      </section>

      <section className="temple-break" aria-label="A South Indian temple gopuram">
        <div className="temple-break__image" />
        <p>Rooted in tradition, united in love</p>
      </section>

      <section className="celebration" id="celebration" aria-labelledby="celebration-title">
        <div className="section-heading">
          <p className="eyebrow">The wedding celebrations</p>
          <h2 id="celebration-title">A day to remember</h2>
          <p>Join us for the rituals, the music, and all the moments in between.</p>
        </div>
        <div className="event-list">
          <article className="event-card event-card--mehendi">
            <div className="event-card__art" aria-hidden="true"><span>01</span></div>
            <div className="event-card__details">
              <p className="eyebrow">Friday · 23 October</p>
              <h3>Mehendi &amp; Sangeet</h3>
              <p>An evening of colour, music, and dancing with the people we love.</p>
              <span className="event-card__time">06:00 in the evening</span>
            </div>
          </article>
          <article className="event-card event-card--wedding">
            <div className="event-card__art" aria-hidden="true"><span>02</span></div>
            <div className="event-card__details">
              <p className="eyebrow">Sunday · 25 October</p>
              <h3>The Muhurtham</h3>
              <p>Be with us as we exchange our vows and make our promises.</p>
              <span className="event-card__time">06:00 in the morning</span>
            </div>
          </article>
          <article className="event-card event-card--reception">
            <div className="event-card__art" aria-hidden="true"><span>03</span></div>
            <div className="event-card__details">
              <p className="eyebrow">Saturday · 24 October</p>
              <h3>Wedding Reception</h3>
              <p>One more toast, one more dance, and a lifetime of memories.</p>
              <div className="event-card__entertainment">
                <p className="event-card__entertainment-title">ENTERTAINMENT BY CUTE DJ</p>
                <p className="event-card__entertainment-style">Music • Beats • Dance • Celebration</p>
              </div>
              <span className="event-card__time">06:30 in the evening</span>
            </div>
          </article>
        </div>
      </section>

      <section className="save-date" aria-labelledby="save-date-title">
        <div className="save-date__inner">
          <p className="eyebrow">Mark your calendar</p>
          <h2 id="save-date-title">The countdown<br />to forever</h2>
          <p className="save-date__date">{weddingDateLabel}</p>
          <div className="countdown" aria-label="Countdown to the wedding">
            {Object.entries(countdown).map(([unit, value]) => (
              <div className="countdown__unit" key={unit}>
                <span>{String(value).padStart(2, '0')}</span>
                <small>{unit}</small>
              </div>
            ))}
          </div>
          <button className="button button--gold" type="button" onClick={saveDate}>
            Add to calendar <span aria-hidden="true">↗</span>
          </button>
        </div>
      </section>

      <section className="rsvp" id="rsvp" aria-labelledby="rsvp-title">
        <div className="rsvp__intro">
          <p className="eyebrow">We saved you a seat</p>
          <h2 id="rsvp-title">Will you be<br />there?</h2>
          <p>Having you with us would mean the world. Kindly let us know if you can join us.</p>
          <div className="venue-note">
            <span className="venue-note__rule" />
            <p>
              <strong>Vijay Palace</strong>{' '}
              <a
                className="venue-map-link"
                href="https://www.bing.com/search?q=vijay+palace+arakonam+location+map&qs=HS&pq=vijay+palace+arakonam+lo&sc=11-24&cvid=48B8F7C8DDB64AFC8353658B034B0894&FORM=QBRE&sp=1&ghc=1&lq=0#&shtp=GetUrl&shid=9b1f0c4b-9963-4045-a673-62a66e77a9d6"
                target="_blank"
                rel="noreferrer"
                aria-label="Open the Vijay Palace map in Bing"
                title="Open map"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <defs>
                    <clipPath id="venue-map-pin-clip">
                      <path d="M12 23s8-8.1 8-14A8 8 0 1 0 4 9c0 5.9 8 14 8 14Z" />
                    </clipPath>
                  </defs>
                  <g clipPath="url(#venue-map-pin-clip)" stroke="none">
                    <rect width="24" height="24" fill="#4285f4" />
                    <path d="M0 0h6l11 12H0Z" fill="#ea4335" />
                    <path d="m0 11 9-3 10 10-7 8H0Z" fill="#fbbc04" />
                    <path d="m9 17 15-13v22H11Z" fill="#34a853" />
                  </g>
                  <circle cx="12" cy="9" r="3.5" fill="#fff" stroke="none" />
                </svg>
              </a>
              <br />
              Arakkonam, Tamil Nadu
            </p>
          </div>
        </div>
        <form className="rsvp-form" onSubmit={submitRsvp}>
          <label htmlFor="guest-name">Your name</label>
          <input id="guest-name" name="name" type="text" placeholder="How shall we address you?" pattern=".*\S.*" title="Enter at least one non-space character." required />
          <fieldset>
            <legend>Can you celebrate with us?</legend>
            <div className="attendance-options">
              <label className={attendance === 'yes' ? 'is-selected' : ''}>
                <input type="radio" name="attendance" value="yes" checked={attendance === 'yes'} onChange={() => setAttendance('yes')} required />
                Joyfully accepts
              </label>
              <label className={attendance === 'no' ? 'is-selected' : ''}>
                <input type="radio" name="attendance" value="no" checked={attendance === 'no'} onChange={() => setAttendance('no')} required />
                Regretfully declines
              </label>
            </div>
          </fieldset>
          {attendance === 'yes' && (
            <label htmlFor="guest-count" className="guest-count">
              Number of guests
              <select id="guest-count" name="guests" defaultValue="1">
                <option value="1">Just me</option>
                <option value="2">2 guests</option>
                <option value="3">3 guests</option>
                <option value="4">4 guests</option>
              </select>
            </label>
          )}
          <button className="button button--wine" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send your reply'} <span aria-hidden="true">↗</span>
          </button>
          <p className="rsvp-form__message" role="status">{rsvpMessage}</p>
        </form>
      </section>

      <footer className="footer">
        <span>With love,</span>
        <p><span>Dharanishree</span><i>&amp;</i><span>Karthikeyan</span></p>
        <small>25.10.2026 · Vijay Palace, Arakkonam</small>
        <a href="#home">Back to the beginning ↑</a>
      </footer>
    </main>
  )
}

export default App
