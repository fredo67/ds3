import { useState, useEffect, useRef } from 'react'

export default function StatCounter({ value, label, duration = 2000 }) {
  const [displayValue, setDisplayValue] = useState('0')
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          animateValue()
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [hasAnimated, value])

  const animateValue = () => {
    // Parse the value to extract number and prefix/suffix
    const match = value.match(/^([^0-9]*)([0-9,.]+)([^0-9]*)$/)
    if (!match) {
      setDisplayValue(value)
      return
    }

    const [, prefix, numStr, suffix] = match
    const targetNum = parseFloat(numStr.replace(/,/g, ''))
    const hasDecimal = numStr.includes('.')
    const decimalPlaces = hasDecimal ? (numStr.split('.')[1]?.length || 0) : 0

    const startTime = Date.now()
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3)

      const currentNum = targetNum * easeOut
      const formatted = hasDecimal
        ? currentNum.toFixed(decimalPlaces)
        : Math.floor(currentNum).toLocaleString()

      setDisplayValue(`${prefix}${formatted}${suffix}`)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setDisplayValue(value)
      }
    }

    requestAnimationFrame(animate)
  }

  return (
    <div ref={ref} className="text-center">
      <div className="font-display font-bold text-3xl md:text-4xl text-white mb-1">
        {displayValue}
      </div>
      <div className="text-gray-400 text-sm">{label}</div>
    </div>
  )
}
