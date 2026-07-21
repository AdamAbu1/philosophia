import { useEffect, useRef, useState } from 'react'
import { geoOrthographic, geoPath } from 'd3-geo'
import { geoGraticule10 } from 'd3-geo'
import { feature } from 'topojson-client'
import world from './assets/land-110m.json'
import { ERAS, PHILOSOPHERS, byId } from './data.js'
import {
  YEAR_MIN, YEAR_MAX, eraFor, fmtYear, isFrontside, displayCoords, yearForSelection,
} from './geo.js'

const W = 900
const H = 620
const R = 280
const CX = W / 2
const CY = H / 2
const LAND = feature(world, world.objects.land)
const GRATICULE = geoGraticule10()
const COORDS = displayCoords(PHILOSOPHERS)
const LABEL_BELOW = Object.fromEntries(PHILOSOPHERS.map((p, i) => [p.id, i % 2 === 1]))
const clampZoom = z => Math.max(1, Math.min(8, z))

const INK = '#2b2620'
const INK_LAND = '#3a332a'
const PAPER = '#f3ecdb'
const FADE = 'rgba(43,38,32,.38)'

// Engraved fill tiles, built once: hatched ocean, stippled land.
let oceanPattern = null
let landPattern = null
function buildPatterns(ctx) {
  const tile = (w, h, drawFn) => {
    const c = document.createElement('canvas')
    c.width = w * 2
    c.height = h * 2
    const t = c.getContext('2d')
    t.scale(2, 2)
    drawFn(t)
    const p = ctx.createPattern(c, 'repeat')
    p.setTransform(new DOMMatrix().scale(0.5))
    return p
  }
  oceanPattern = tile(4, 4, t => {
    t.fillStyle = '#efe6d1'
    t.fillRect(0, 0, 4, 4)
    t.strokeStyle = 'rgba(138,124,98,.5)'
    t.lineWidth = 0.45
    t.beginPath()
    t.moveTo(0, 2)
    t.lineTo(4, 2)
    t.stroke()
  })
  landPattern = tile(5, 5, t => {
    t.fillStyle = '#e7dcc2'
    t.fillRect(0, 0, 5, 5)
    t.fillStyle = 'rgba(122,107,80,.55)'
    t.beginPath()
    t.arc(1.2, 1.4, 0.5, 0, 7)
    t.fill()
    t.fillStyle = 'rgba(122,107,80,.4)'
    t.beginPath()
    t.arc(3.6, 3.8, 0.5, 0, 7)
    t.fill()
  })
}

// Thumbnail images load lazily; a redraw fires as each arrives.
const thumbCache = new Map()
function thumbFor(p, onReady) {
  let img = thumbCache.get(p.id)
  if (!img) {
    img = new Image()
    img.src = p.thumb
    img.onload = onReady
    thumbCache.set(p.id, img)
  }
  return img.complete && img.naturalWidth > 0 ? img : null
}

export default function Globe({ selectedId, onSelect, itinerary }) {
  // Scrubber UI state (small React tree); the map itself renders imperatively.
  const [year, setYear] = useState(YEAR_MIN)
  const [lensOn, setLensOn] = useState(false)
  const [playing, setPlaying] = useState(false)

  const canvasRef = useRef(null)
  const rotationRef = useRef([-22, -40])
  const zoomRef = useRef(1)
  const yearRef = useRef(YEAR_MIN)
  const lensRef = useRef(false)
  const selectedRef = useRef(null)
  const spinRef = useRef(true)
  const dragRef = useRef(null)
  const movedRef = useRef(false)
  const targetRef = useRef(null)
  const wheelRef = useRef(0)
  const playRef = useRef(false)
  const hoverRef = useRef(null)
  const hitsRef = useRef([])
  const projectionRef = useRef(geoOrthographic().translate([CX, CY]).clipAngle(90))

  yearRef.current = year
  lensRef.current = lensOn
  playRef.current = playing
  selectedRef.current = selectedId
  const itineraryRef = useRef(null)
  itineraryRef.current = itinerary

  function draw() {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!oceanPattern) buildPatterns(ctx)
    const dpr = window.devicePixelRatio || 1
    if (canvas.width !== W * dpr) {
      canvas.width = W * dpr
      canvas.height = H * dpr
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, W, H)

    const zoom = zoomRef.current
    const rotation = rotationRef.current
    const projection = projectionRef.current.rotate(rotation).scale(R * zoom)
    const path = geoPath(projection, ctx)

    // sphere: hatched ocean + double rim
    ctx.beginPath()
    path({ type: 'Sphere' })
    ctx.fillStyle = oceanPattern
    ctx.fill()
    ctx.strokeStyle = INK
    ctx.lineWidth = 1.6
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(CX, CY, R * zoom * 1.018, 0, 7)
    ctx.lineWidth = 0.5
    ctx.stroke()

    // graticule
    ctx.beginPath()
    path(GRATICULE)
    ctx.setLineDash([1, 2.5])
    ctx.strokeStyle = 'rgba(138,124,98,.7)'
    ctx.lineWidth = 0.35
    ctx.stroke()
    ctx.setLineDash([])

    // land: stippled fill + ink coast
    ctx.beginPath()
    path(LAND)
    ctx.fillStyle = landPattern
    ctx.fill()
    ctx.strokeStyle = INK_LAND
    ctx.lineWidth = 0.7
    ctx.stroke()

    // itinerary route: a dotted expedition line through the stops in order —
    // visited stops filled, upcoming stops open rings.
    const trip = itineraryRef.current
    if (trip) {
      ctx.beginPath()
      for (let i = 0; i < trip.ids.length - 1; i++) {
        path({ type: 'LineString', coordinates: [COORDS[trip.ids[i]], COORDS[trip.ids[i + 1]]] })
      }
      ctx.setLineDash([7, 5])
      ctx.strokeStyle = 'rgba(43,38,32,.55)'
      ctx.lineWidth = 1.4
      ctx.stroke()
      ctx.setLineDash([])
      trip.ids.forEach((id, i) => {
        if (!isFrontside(COORDS[id], rotation)) return
        const [px, py] = projection(COORDS[id])
        ctx.beginPath()
        ctx.arc(px, py, 6, 0, 7)
        if (i <= trip.upTo) {
          ctx.fillStyle = 'rgba(43,38,32,.8)'
          ctx.fill()
        } else {
          ctx.strokeStyle = 'rgba(43,38,32,.7)'
          ctx.lineWidth = 1.2
          ctx.stroke()
        }
      })
    }

    // influence arcs for the selected thinker: great circles, horizon-clipped.
    // Dashed = drew from; solid = went on to influence.
    const selPhil = selectedRef.current ? byId[selectedRef.current] : null
    const connected = new Set()
    if (selPhil) {
      const from = COORDS[selPhil.id]
      const arc = (otherId, dashed) => {
        connected.add(otherId)
        ctx.beginPath()
        path({ type: 'LineString', coordinates: [from, COORDS[otherId]] })
        ctx.setLineDash(dashed ? [4, 3] : [])
        ctx.strokeStyle = dashed ? 'rgba(43,38,32,.5)' : 'rgba(43,38,32,.68)'
        ctx.lineWidth = dashed ? 1 : 1.2
        ctx.stroke()
      }
      for (const id of selPhil.influences) arc(id, true)
      for (const id of selPhil.influenced) arc(id, false)
      ctx.setLineDash([])
    }

    // points
    const lens = lensRef.current
    const yr = yearRef.current
    const medallions = zoom >= 3
    const hits = []
    ctx.textAlign = 'center'
    for (const p of PHILOSOPHERS) {
      if (!isFrontside(COORDS[p.id], rotation)) continue
      const [px, py] = projection(COORDS[p.id])
      if (px < -60 || px > W + 60 || py < -60 || py > H + 60) continue
      const lit = lens && yr >= p.born && yr <= (p.died ?? YEAR_MAX)
      hits.push({ id: p.id, x: px, y: py })
      if (connected.has(p.id)) {
        ctx.beginPath()
        ctx.arc(px, py, medallions ? 17 : 8.5, 0, 7)
        ctx.setLineDash([2, 2.5])
        ctx.strokeStyle = 'rgba(43,38,32,.55)'
        ctx.lineWidth = 1
        ctx.stroke()
        ctx.setLineDash([])
      }
      if (medallions) {
        const dim = lens && !lit
        ctx.globalAlpha = dim ? 0.35 : 1
        ctx.beginPath()
        ctx.arc(px, py, 13, 0, 7)
        ctx.fillStyle = PAPER
        ctx.fill()
        ctx.strokeStyle = INK
        ctx.lineWidth = 1
        ctx.stroke()
        const img = thumbFor(p, draw)
        if (img) {
          ctx.save()
          ctx.beginPath()
          ctx.arc(px, py, 11, 0, 7)
          ctx.clip()
          ctx.drawImage(img, px - 11.5, py - 14.5, 23, 30.7)
          ctx.restore()
        }
        ctx.beginPath()
        ctx.arc(px, py, 11, 0, 7)
        ctx.lineWidth = 0.6
        ctx.stroke()
        if (zoom >= 4) label(ctx, p.name, px, py + 24, '9px Georgia, serif')
        ctx.globalAlpha = 1
      } else if (lens) {
        ctx.beginPath()
        ctx.arc(px, py, lit ? 5 : 2.8, 0, 7)
        if (lit) {
          ctx.fillStyle = INK
          ctx.fill()
          ctx.strokeStyle = INK
          ctx.lineWidth = 1.4
          ctx.stroke()
          label(ctx, p.name, px, py + (LABEL_BELOW[p.id] ? 20 : -11), '10px Georgia, serif')
        } else {
          ctx.strokeStyle = FADE
          ctx.lineWidth = 1
          ctx.stroke()
        }
      } else {
        ctx.beginPath()
        ctx.arc(px, py, 4, 0, 7)
        ctx.fillStyle = 'rgba(43,38,32,.82)'
        ctx.fill()
        ctx.strokeStyle = INK
        ctx.lineWidth = 1.2
        ctx.stroke()
      }
    }
    hitsRef.current = hits

    // hover name (any zoom level)
    const hov = hoverRef.current
    if (hov && hov !== selectedRef.current) {
      const h = hits.find(d => d.id === hov)
      if (h) label(ctx, byId[hov].name, h.x, h.y - (medallions ? 18 : 11), '10.5px Georgia, serif')
    }

    // selected medallion
    const selId = selectedRef.current
    if (selId) {
      const h = hits.find(d => d.id === selId)
      if (h) {
        const p = byId[selId]
        ctx.beginPath()
        ctx.arc(h.x, h.y, 30, 0, 7)
        ctx.fillStyle = PAPER
        ctx.fill()
        ctx.strokeStyle = INK
        ctx.lineWidth = 1.6
        ctx.stroke()
        const img = thumbFor(p, draw)
        if (img) {
          ctx.save()
          ctx.beginPath()
          ctx.arc(h.x, h.y, 26, 0, 7)
          ctx.clip()
          ctx.drawImage(img, h.x - 27, h.y - 34, 54, 72)
          ctx.restore()
        }
        ctx.beginPath()
        ctx.arc(h.x, h.y, 26, 0, 7)
        ctx.lineWidth = 0.8
        ctx.stroke()
        label(ctx, `${p.name} · ${p.place.name}`, h.x, h.y + 47, '11.5px Georgia, serif')
      }
    }
  }

  function label(ctx, text, x, y, font) {
    ctx.font = font
    ctx.lineJoin = 'round'
    ctx.strokeStyle = PAPER
    ctx.lineWidth = 3
    ctx.strokeText(text, x, y)
    ctx.fillStyle = INK
    ctx.fillText(text, x, y)
  }

  // Animation loop drives ONLY motion (spin, play sweep, tween, batched wheel).
  // Everything event-driven calls draw() directly, so the globe stays live
  // even where requestAnimationFrame is throttled.
  useEffect(() => {
    let raf
    let last = performance.now()
    const tick = now => {
      const dt = Math.min(50, now - last)
      last = now
      let dirty = false
      if (wheelRef.current !== 0) {
        const dz = wheelRef.current
        wheelRef.current = 0
        zoomRef.current = clampZoom(zoomRef.current * Math.exp(-dz * 0.003))
        dirty = true
      }
      if (playRef.current) {
        const ny = yearRef.current + dt * 0.11
        if (ny >= YEAR_MAX) {
          setPlaying(false)
          setYear(YEAR_MAX)
        } else {
          setYear(ny)
        }
        yearRef.current = Math.min(ny, YEAR_MAX)
        dirty = true
      }
      if (targetRef.current) {
        const [a, b] = rotationRef.current
        const [ta, tb] = targetRef.current
        const da = ((ta - a + 540) % 360) - 180
        const db = tb - b
        if (Math.abs(da) < 0.4 && Math.abs(db) < 0.4) {
          rotationRef.current = [ta, tb]
          targetRef.current = null
        } else {
          rotationRef.current = [a + da * 0.12, b + db * 0.12]
        }
        dirty = true
      } else if (spinRef.current && !playRef.current) {
        rotationRef.current = [rotationRef.current[0] + dt * 0.0035, rotationRef.current[1]]
        dirty = true
      }
      if (dirty) draw()
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Non-passive wheel listener; deltas batch, but draw immediately so zoom
  // feels instant even without the frame loop.
  useEffect(() => {
    const el = canvasRef.current
    if (!el) return
    const onWheel = e => {
      e.preventDefault()
      spinRef.current = false
      // Trackpad pinch arrives as ctrlKey wheel events with ~10x smaller
      // deltas than mouse notches — scale accordingly (d3-zoom's heuristic).
      const k = e.ctrlKey ? 0.0434 : 0.00434
      zoomRef.current = clampZoom(zoomRef.current * Math.pow(2, -e.deltaY * k))
      draw()
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Selection: tween the globe toward the target; move time only if the lens is on.
  useEffect(() => {
    if (!selectedId) {
      draw()
      return
    }
    const p = byId[selectedId]
    spinRef.current = false
    const [lon, lat] = COORDS[selectedId]
    targetRef.current = [-lon, Math.max(-75, Math.min(75, -lat))]
    if (lensRef.current) {
      const ny = yearForSelection(p, yearRef.current)
      yearRef.current = ny
      setYear(ny)
    }
    draw()
  }, [selectedId]) // eslint-disable-line react-hooks/exhaustive-deps

  // Redraw when scrubber-driven state changes; also covers first mount.
  useEffect(() => {
    draw()
  }) // eslint-disable-line react-hooks/exhaustive-deps

  function canvasPoint(e) {
    const rect = canvasRef.current.getBoundingClientRect()
    return [((e.clientX - rect.left) * W) / rect.width, ((e.clientY - rect.top) * H) / rect.height]
  }
  function hitTest(e) {
    const [mx, my] = canvasPoint(e)
    const r = zoomRef.current >= 3 ? 15 : 9
    let best = null
    let bestD = r * r
    for (const h of hitsRef.current) {
      const d = (h.x - mx) ** 2 + (h.y - my) ** 2
      if (d < bestD) {
        bestD = d
        best = h.id
      }
    }
    return best
  }

  function onPointerDown(e) {
    spinRef.current = false
    targetRef.current = null
    dragRef.current = { x: e.clientX, y: e.clientY, moved: false }
  }
  function onPointerMove(e) {
    const d = dragRef.current
    if (d) {
      const dx = e.clientX - d.x
      const dy = e.clientY - d.y
      if (!d.moved && Math.abs(dx) + Math.abs(dy) < 3) return
      d.moved = true
      d.x = e.clientX
      d.y = e.clientY
      const [a, b] = rotationRef.current
      rotationRef.current = [
        a + (dx * 0.28) / zoomRef.current,
        Math.max(-75, Math.min(75, b - (dy * 0.28) / zoomRef.current)),
      ]
      draw()
      return
    }
    const hov = hitTest(e)
    if (hov !== hoverRef.current) {
      hoverRef.current = hov
      canvasRef.current.style.cursor = hov ? 'pointer' : 'grab'
      draw()
    }
  }
  function onPointerUp() {
    if (dragRef.current) movedRef.current = dragRef.current.moved
    dragRef.current = null
  }
  function onClick(e) {
    if (movedRef.current) {
      movedRef.current = false
      return
    }
    const hit = hitTest(e)
    if (hit) onSelect(hit)
  }

  function togglePlay() {
    spinRef.current = false
    if (!playing) {
      setLensOn(true)
      lensRef.current = true
      if (!lensOn || year >= YEAR_MAX) {
        setYear(YEAR_MIN)
        yearRef.current = YEAR_MIN
      }
    }
    setPlaying(!playing)
  }
  function onScrub(e) {
    spinRef.current = false
    setPlaying(false)
    setLensOn(true)
    lensRef.current = true
    const v = +e.target.value
    setYear(v)
    yearRef.current = v
    draw()
  }
  function allTime() {
    setLensOn(false)
    lensRef.current = false
    setPlaying(false)
    draw()
  }
  function zoomBy(f) {
    spinRef.current = false
    zoomRef.current = clampZoom(zoomRef.current * f)
    draw()
  }

  const era = eraFor(year, ERAS)

  return (
    <div className="globe-wrap">
      <div className="globe-box">
        <canvas
          ref={canvasRef}
          className="globe"
          style={{ width: '100%', aspectRatio: `${W} / ${H}` }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          onClick={onClick}
          onDoubleClick={() => zoomBy(2)}
        />
        <div className="zoomctl">
          <button onClick={() => zoomBy(1.5)} aria-label="Zoom in">+</button>
          <button onClick={() => zoomBy(1 / 1.5)} aria-label="Zoom out">−</button>
          <button
            onClick={() => {
              spinRef.current = false
              zoomRef.current = 1
              draw()
            }}
            aria-label="Reset zoom"
          >
            ◦
          </button>
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
        {lensOn && <img className="era-emblem" src={`emblems/${era.id}.jpg`} alt="" />}
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
        {selectedId
          ? 'dashed arcs — who shaped them · solid arcs — whom they went on to shape · esc to clear'
          : 'drag to turn · scroll to zoom · scrub to light an era · click a thinker to open their entry'}
      </div>
    </div>
  )
}
