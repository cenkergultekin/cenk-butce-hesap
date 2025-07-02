'use client'

import { useEffect, useState } from 'react'

export default function Notification({ notification, onClose }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (notification) {
      // Kısa gecikme ile görünür yap
      const showTimer = setTimeout(() => {
        setIsVisible(true)
      }, 100)

      // 4 saniye sonra otomatik kapat
      const hideTimer = setTimeout(() => {
        handleClose()
      }, 4000)

      return () => {
        clearTimeout(showTimer)
        clearTimeout(hideTimer)
      }
    }
  }, [notification])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      onClose()
    }, 300) // Animation tamamlandıktan sonra
  }

  if (!notification) return null

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return '✅'
      case 'error':
        return '❌'
      case 'warning':
        return '⚠️'
      case 'delete':
        return '🗑️'
      default:
        return 'ℹ️'
    }
  }

  const getColor = () => {
    switch (notification.type) {
      case 'success':
        return '#30d158'
      case 'error':
        return '#ff3b30'
      case 'warning':
        return '#ff9500'
      case 'delete':
        return '#ff6b6b'
      default:
        return '#007aff'
    }
  }

  return (
    <div className={`modern-notification ${isVisible ? 'visible' : ''}`}>
      <div 
        className="notification-content"
        style={{ 
          borderLeft: `4px solid ${getColor()}`,
          background: `linear-gradient(135deg, ${getColor()}10 0%, ${getColor()}05 100%)`
        }}
      >
        <div className="notification-icon">
          {getIcon()}
        </div>
        <div className="notification-text">
          <div className="notification-message">{notification.message}</div>
          <div className="notification-time">
            {new Date().toLocaleTimeString('tr-TR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
        <button 
          className="notification-close"
          onClick={handleClose}
        >
          ✕
        </button>
      </div>
    </div>
  )
} 