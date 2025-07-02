'use client'

import { useState, useEffect } from 'react'

export default function CategoryChart({ expenses }) {
  const [hoveredCategory, setHoveredCategory] = useState(null)
  const [isExpanded, setIsExpanded] = useState(false)

  const getCategoryData = () => {
    const categoryTotals = {}
    
    expenses.forEach(expense => {
      const category = expense.category
      if (categoryTotals[category]) {
        categoryTotals[category] += expense.amount
      } else {
        categoryTotals[category] = expense.amount
      }
    })

    const total = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0)
    
    return Object.entries(categoryTotals).map(([category, amount]) => ({
      category,
      amount,
      percentage: total > 0 ? (amount / total) * 100 : 0
    })).sort((a, b) => b.amount - a.amount)
  }

  const getCategoryExpenses = (category) => {
    return expenses
      .filter(expense => expense.category === category)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5) // En son 5 gider
  }

  const getCategoryInfo = (category) => {
    const categoryData = {
      food: { name: 'Yiyecek', icon: '🍔', color: '#ff3b30' },
      transport: { name: 'Ulaşım', icon: '🚗', color: '#007aff' },
      shopping: { name: 'Alışveriş', icon: '🛒', color: '#ff2d92' },
      entertainment: { name: 'Eğlence', icon: '🎬', color: '#ff9500' },
      utilities: { name: 'Faturalar', icon: '⚡', color: '#30d158' },
      health: { name: 'Sağlık', icon: '🏥', color: '#00c7be' },
      other: { name: 'Diğer', icon: '📋', color: '#8e8e93' }
    }
    return categoryData[category] || { name: 'Diğer', icon: '📋', color: '#8e8e93' }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'short'
    })
  }

  const categoryData = getCategoryData()

  const toggleExpansion = (e) => {
    e.stopPropagation()
    setIsExpanded(!isExpanded)
  }

  if (expenses.length === 0) {
    return (
      <div className="chart-container">
        <h4>📊 Kategoriler</h4>
        <div className="empty-chart">
          <i className="fas fa-chart-pie" style={{ fontSize: '48px', color: '#d1d1d6', marginBottom: '16px' }}></i>
          <p style={{ color: '#86868b', fontSize: '15px' }}>Henüz veri bulunmuyor</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`chart-container ${isExpanded ? 'expanded' : ''}`} onClick={toggleExpansion}>
      <h4>📊 Kategoriler {isExpanded ? '🔽' : '▶️'}</h4>
      <div className="category-chart">
        {categoryData.map((item, index) => {
          const categoryInfo = getCategoryInfo(item.category)
          const isHovered = hoveredCategory === item.category
          
          return (
            <div
              key={item.category}
              className={`category-item ${isHovered ? 'hovered' : ''}`}
              onMouseEnter={() => setHoveredCategory(item.category)}
              onMouseLeave={() => setHoveredCategory(null)}
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              <div className="category-info">
                <span className="category-icon">{categoryInfo.icon}</span>
                <div className="category-details">
                  <span className="category-name">{categoryInfo.name}</span>
                  <span className="category-amount">₺{item.amount.toFixed(2)}</span>
                </div>
              </div>
              <div className="progress-container">
                <div 
                  className="progress-bar"
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: categoryInfo.color,
                    transform: isHovered ? 'scaleY(1.2)' : 'scaleY(1)'
                  }}
                ></div>
              </div>
              <span 
                className="percentage"
                style={{ color: categoryInfo.color }}
              >
                %{item.percentage.toFixed(1)}
              </span>
            </div>
          )
        })}
      </div>

      <div className={`chart-expansion ${isExpanded ? 'expanded' : ''}`}>
        <div className="expansion-header">
          <h5 className="expansion-title">
            🔍 Kategori Detayları
          </h5>
          <button 
            className="expansion-close"
            onClick={(e) => {
              e.stopPropagation()
              setIsExpanded(false)
            }}
          >
            ✕
          </button>
        </div>
        
        <div className="expansion-content">
          {categoryData.slice(0, 3).map((item, index) => {
            const categoryInfo = getCategoryInfo(item.category)
            const categoryExpenses = getCategoryExpenses(item.category)
            
            return (
              <div key={item.category} style={{ marginBottom: '20px' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  marginBottom: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: categoryInfo.color
                }}>
                  {categoryInfo.icon} {categoryInfo.name} - Son Giderler
                </div>
                
                {categoryExpenses.map((expense, expIndex) => (
                  <div 
                    key={expense.id} 
                    className="detail-item"
                    style={{ animationDelay: `${(index * 200) + (expIndex * 50)}ms` }}
                  >
                    <div className="detail-left">
                      <span className="detail-icon">{categoryInfo.icon}</span>
                      <div className="detail-info">
                        <span className="detail-description">{expense.description}</span>
                        <span className="detail-category">{formatDate(expense.date)}</span>
                      </div>
                    </div>
                    <span className="detail-amount">₺{expense.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
} 