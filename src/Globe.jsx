import { useEffect, useMemo, useRef, useState } from 'react'
import { geoOrthographic, geoPath, geoGraticule10 } from 'd3-geo'
import { feature } from 'topojson-client'
import world from './assets/land-110m.json'
import { ERAS, PHILOSOPHERS, byId } from './data.js'
import {
  YEAR_MIN, YEAR_MAX, eraFor, fmtYear, isFrontside, displayCoords, yearForSelection,
} from './geo.js'

const W = 900
const H = 620
const R = 280
const LAND = feature(world, world.objects.land)
const GRATICULE = geoGraticule10()
const COORDS = displayCoords(PHILOSOPHERS)
// alternate label side per thinker so dense clusters halve their collisions
const LABEL_BELOW = Object.fromEntries(PHILOSOPHERS.map((p, i) => [p.id, i % 2 === 1]))
const clampZoom = z => Math.max(1, Math.min(8, z))

export default function Globe({ selectedId, onSelect }) {
  const [rotation, setRotation] = useState([-22, -40])
  const [zoom, setZoom] = useState(1)
  const [year, setYear] = useState(YEAR_MIN)
  const [lensOn, setLensOn] = useState(false)
  const [playing, setPlaying] = useState(false)
  const spinRef = useRef(true)
  const dragRef = useRef(null)
  const movedRef = useRef(false)
  const targetRef = useRef(null)
  const playRef = useRef(false)
  const svgRef = useRef(null)
  playRef.current = playing

  // Selection (click or influence-chip jump): tween the globe to the target.
  // Only when the time lens is active does selection need to move the year.
  useEffect(() => {
    if (!selectedId) return
    const p = byId[selectedId]
    spinRef.current = false
    const [lon, lat] = COORDS[selectedId]
    targetRef.current = [-lon, Math.max(-75, Math.min(75, -lat))]
    if (lensOn) setYear(y => yearForSelection(p, y))
  }, [selectedId]) // eslint-disable-line react-hooks/exhaustive-deps

  // One animation loop: play sweep, rotation tween, idle spin.
  useEffect(() => {
    let raf
    let last = performance.now()
    const tick = now => {
      const dt = Math.min(50, now - last)
      last = now
      if (playRef.current) {
        setYear(y => {
          const ny = y + dt * 0.11
          if (ny >= YEAR_MAX) {
            setPlaying(false)
            return YEAR_MAX
          }
          return ny
        })
      }
      if (targetRef.current) {
        setRotation(([a, b]) => {
          const [ta, tb] = targetRef.current
          const da = ((ta - a + 540) % 360) - 180
          const db = tb - b
          if (Math.abs(da) < 0.4 && Math.abs(db) < 0.4) {
            targetRef.current = null
            return [ta, tb]
          }
          return [a + da * 0.12, b + db * 0.12]
        })
      } else if (spinRef.current && !playRef.current) {
        setRotation(([a, b]) => [a + dt * 0.0035, b])
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  // Wheel zoom needs a non-passive native listener (React's synthetic wheel is passive).
  useEffect(() => {
    const el = svgRef.current
    if (!el) return
    const onWheel = e => {
      e.preventDefault()
      spinRef.current = false
      setZoom(z => clampZoom(z * Math.exp(-e.deltaY * 0.0016)))
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  const projection = useMemo(
    () =>
      geoOrthographic()
        .translate([W / 2, H / 2])
        .scale(R * zoom)
        .rotate(rotation)
        .clipAngle(90),
    [rotation, zoom],
  )
  const path = useMemo(() => geoPath(projection), [projection])

  const points = PHILOSOPHERS.filter(p => isFrontside(COORDS[p.id], rotation)).map(p => {
    const [x, y] = projection(COORDS[p.id])
    return { p, x, y, lit: lensOn && year >= p.born && year <= p.died }
  })
  const sel = selectedId ? points.find(d => d.p.id === selectedId) : null
  const era = eraFor(year, ERAS)
  const medallions = zoom >= 3

  // No pointer capture: capturing on pointerdown retargets pointerup to the
  // svg and swallows point clicks. Instead, rotation starts only after a small
  // movement threshold, and a real drag suppresses the following click.
  function onPointerDown(e) {
    spinRef.current = false
    targetRef.current = null
    dragRef.current = { x: e.clientX, y: e.clientY, moved: false }
  }
  function onPointerMove(e) {
    const d = dragRef.current
    if (!d) return
    const dx = e.clientX - d.x
    const dy = e.clientY - d.y
    if (!d.moved && Math.abs(dx) + Math.abs(dy) < 3) return
    d.moved = true
    d.x = e.clientX
    d.y = e.clientY
    setRotation(([a, b]) => [
      a + (dx * 0.28) / zoom,
      Math.max(-75, Math.min(75, b - (dy * 0.28) / zoom)),
    ])
  }
  function onPointerUp() {
    if (dragRef.current) movedRef.current = dragRef.current.moved
    dragRef.current = null
  }
  function pointClick(id) {
    if (movedRef.current) {
      movedRef.current = false
      return
    }
    onSelect(id)
  }

  function togglePlay() {
    spinRef.current = false
    if (!playing) {
      setLensOn(true)
      if (!lensOn || year >= YEAR_MAX) setYear(YEAR_MIN)
    }
    setPlaying(!playing)
  }
  function onScrub(e) {
    spinRef.current = false
    setPlaying(false)
    setLensOn(true)
    setYear(+e.target.value)
  }
  function allTime() {
    setLensOn(false)
    setPlaying(false)
  }

  return (
    <div className="globe-wrap">
      <div className="globe-box">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="globe"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          onDoubleClick={() => setZoom(z => clampZoom(z * 1.6))}
        >
          <defs>
            <pattern id="ocean" width="4" height="4" patternUnits="userSpaceOnUse">
              <rect width="4" height="4" fill="#efe6d1" />
              <line x2="4" y1="2" y2="2" stroke="#8a7c62" strokeWidth=".45" opacity=".5" />
            </pattern>
            <pattern id="landfill" width="5" height="5" patternUnits="userSpaceOnUse">
              <rect width="5" height="5" fill="#e7dcc2" />
              <circle cx="1.2" cy="1.4" r=".5" fill="#7a6b50" opacity=".55" />
              <circle cx="3.6" cy="3.8" r=".5" fill="#7a6b50" opacity=".4" />
            </pattern>
            <clipPath id="medclip">
              <circle r="26" />
            </clipPath>
            <clipPath id="miniclip">
              <circle r="11" />
            </clipPath>
          </defs>
          <path className="sphere" d={path({ type: 'Sphere' })} />
          <path className="grat" d={path(GRATICULE)} />
          <path className="landp" d={path(LAND)} />
          {points.map(d => {
            const onScreen = d.x > -60 && d.x < W + 60 && d.y > -60 && d.y < H + 60
            if (!onScreen) return null
            const cls = lensOn ? (d.lit ? ' lit' : ' faded') : ' all'
            return (
              <g
                key={d.p.id}
                className={`pt${cls}`}
                transform={`translate(${d.x},${d.y})`}
                onClick={() => pointClick(d.p.id)}
              >
                <title>{`${d.p.name} · ${d.p.place.name} · ${fmtYear(d.p.born)}–${fmtYear(d.p.died)}`}</title>
                {medallions ? (
                  <>
                    <circle className="mini-bg" r="13" />
                    <image
                      clipPath="url(#miniclip)"
                      href={d.p.portrait}
                      x="-11.5"
                      y="-14.5"
                      width="23"
                    />
                    <circle className="mini-ring" r="11" />
                    {zoom >= 4 && (
                      <text className="mini-name" dy="24" textAnchor="middle">
                        {d.p.name}
                      </text>
                    )}
                  </>
                ) : (
                  <>
                    <circle r={lensOn ? (d.lit ? 5 : 2.8) : 4} />
                    {lensOn && d.lit && (
                      <text dy={LABEL_BELOW[d.p.id] ? 20 : -11} textAnchor="middle">
                        {d.p.name}
                      </text>
                    )}
                  </>
                )}
              </g>
            )
          })}
          {sel && (
            <g className="med" transform={`translate(${sel.x},${sel.y})`}>
              <circle className="med-bg" r="30" />
              <image clipPath="url(#medclip)" href={sel.p.portrait} x="-27" y="-34" width="54" />
              <circle className="med-ring" r="26" />
              <text dy="47" textAnchor="middle">
                {sel.p.name} · {sel.p.place.name}
              </text>
            </g>
          )}
        </svg>
        <div className="zoomctl">
          <button onClick={() => setZoom(z => clampZoom(z * 1.5))} aria-label="Zoom in">+</button>
          <button onClick={() => setZoom(z => clampZoom(z / 1.5))} aria-label="Zoom out">−</button>
          <button onClick={() => setZoom(1)} aria-label="Reset zoom">◦</button>
        </div>
      </div>
      <div className="scrub">
        <button className="playbtn" onClick={togglePlay} aria-label={playing ? 'Pause' : 'Play'}>
          {playing ? '❚❚' : '▶'}
        </button>
        <input
          type="range"
          min={YEAR_MIN}
          max={YEAR_MAX}
          value={lensOn ? Math.round(year) : YEAR_MAX}
          onChange={onScrub}
          aria-label="Year"
        />
        <div className="yearread">
          <div className="yr">{lensOn ? fmtYear(year) : 'All time'}</div>
          <div className="eraname">{lensOn ? era.name : 'every era at once'}</div>
        </div>
        {lensOn && (
          <button className="lenschip" onClick={allTime}>
            all time ✕
          </button>
        )}
      </div>
      <div className="globehint">
        drag to turn · scroll to zoom · scrub to light an era · click a thinker to open their entry
      </div>
    </div>
  )
}
