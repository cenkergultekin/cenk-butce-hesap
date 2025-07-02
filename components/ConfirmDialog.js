'use client'

import { useEffect, useState } from 'react'

export default function ConfirmDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Emin misiniz?",
  message = "Bu işlem geri alınamaz.",
  confirmText = "Evet",
  cancelText = "İptal",
  type = "danger" // danger, warning, info
}) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 50)
    } else {
      setIsVisible(false)
    }
  }, [isOpen])

  const handleConfirm = () => {
    setIsVisible(false)
    setTimeout(() => {
      onConfirm()
      onClose()
    }, 200)
  }

  const handleCancel = () => {
    setIsVisible(false)
    setTimeout(() => {
      onClose()
    }, 200)
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCancel()
    }
  }

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return '⚠️'
      case 'warning':
        return '🚨'
      case 'info':
        return 'ℹ️'
      default:
        return '❓'
    }
  }

  if (!isOpen) return null

  return (
    <div 
      className={`confirm-dialog-overlay ${isVisible ? 'visible' : ''}`}
      onClick={handleBackdropClick}
    >
      <div className={`confirm-dialog ${isVisible ? 'visible' : ''}`}>
        <div className="dialog-icon">
          {getIcon()}
        </div>
        
        <div className="dialog-content">
          <h3 className="dialog-title">{title}</h3>
          <p className="dialog-message">{message}</p>
        </div>
        
        <div className="dialog-actions">
          <button 
            className="btn-cancel"
            onClick={handleCancel}
          >
            {cancelText}
          </button>
          <button 
            className={`btn-confirm btn-${type}`}
            onClick={handleConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
} 