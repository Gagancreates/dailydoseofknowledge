"use client"

import { useEffect, useState } from 'react'

export default function StreakCounter() {
  const [streak, setStreak] = useState(0)
  const [isPulsing, setIsPulsing] = useState(false)
  const [isNew, setIsNew] = useState(false)

  useEffect(() => {
    // Load streak data from localStorage
    const loadStreak = () => {
      try {
        const streakData = localStorage.getItem('dailyDoseStreak')
        
        if (streakData) {
          const { count, lastVisit } = JSON.parse(streakData)
          const today = new Date().toDateString()
          const yesterday = new Date()
          yesterday.setDate(yesterday.getDate() - 1)
          const yesterdayString = yesterday.toDateString()
          
          if (lastVisit === today) {
            // Already visited today - keep streak
            setStreak(count)
          } else if (lastVisit === yesterdayString) {
            // Visited yesterday - increment streak
            const newStreak = count + 1
            setStreak(newStreak)
            saveStreak(newStreak, today)
            
            // Trigger the pulse animation
            setIsPulsing(true)
            setTimeout(() => setIsPulsing(false), 2000)
          } else {
            // Missed a day - reset streak
            setStreak(1)
            setIsNew(true)
            setTimeout(() => setIsNew(false), 2000)
            saveStreak(1, today)
          }
        } else {
          // First time visit
          setStreak(1)
          setIsNew(true)
          setTimeout(() => setIsNew(false), 2000)
          saveStreak(1, new Date().toDateString())
        }
      } catch (error) {
        console.error("Error loading streak data:", error)
        setStreak(1)
        saveStreak(1, new Date().toDateString())
      }
    }
    
    loadStreak()
  }, [])
  
  const saveStreak = (count: number, lastVisit: string) => {
    localStorage.setItem(
      'dailyDoseStreak',
      JSON.stringify({ count, lastVisit })
    )
  }

  return (
    <div className={`flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg transition-all duration-300 ${isPulsing ? 'scale-110' : ''} ${isNew ? 'bg-white/30' : ''}`}>
      <span className={`text-lg ${isPulsing ? 'animate-pulse' : ''}`} role="img" aria-label="fire">🔥</span>
      <span className="text-sm font-medium">{streak} day{streak !== 1 ? 's' : ''}</span>
    </div>
  )
} 