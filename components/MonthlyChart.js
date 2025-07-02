'use client'

import { useState, useEffect } from 'react'

export default function MonthlyChart({ expenses }) {
  const [selectedMonth, setSelectedMonth] = useState(null)
  const [isExpanded, setIsExpanded] = useState(false)

  const getMonthlyData = () => {
    const monthlyTotals = {}
    const monthlyCount = {}
    
    expenses.forEach(expense => {
      const date = new Date(expense.date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      
      if (monthlyTotals[monthKey]) {
        monthlyTotals[monthKey] += expense.amount
        monthlyCount[monthKey] += 1
      } else {
        monthlyTotals[monthKey] = expense.amount
        monthlyCount[monthKey] = 1
      }
    })

    const months = Object.keys(monthlyTotals).sort().slice(-6) // Son 6 ay
    return months.map(month => ({
      month,
      amount: monthlyTotals[month],
      count: monthlyCount[month],
      monthName: new Date(month + '-01').toLocaleDateString('tr-TR', { 
        month: 'short', 
        year: 'numeric' 
      })
    }))
  }

  const getMonthExpenses = (monthKey) => {
    return expenses
      .filter(expense => {
        const date = new Date(expense.date)
        const expenseMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        return expenseMonth === monthKey
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 8) // Son 8 gider
  }

  const getTopCategories = (monthKey) => {
    const categoryTotals = {}
    
    expenses
      .filter(expense => {
        const date = new Date(expense.date)
        const expenseMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        return expenseMonth === monthKey
      })
      .forEach(expense => {
        if (categoryTotals[expense.category]) {
          categoryTotals[expense.category] += expense.amount
        } else {
          categoryTotals[expense.category] = expense.amount
        }
      })

    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 3)
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
      month: 'short',
      year: 'numeric'
    })
  }

  const monthlyData = getMonthlyData()
  const maxAmount = Math.max(...monthlyData.map(item => item.amount))
  const recentExpenses = expenses
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3)

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded)
  }

  if (expenses.length === 0) {
    return (
      <div className="chart-container">
        <h4>📈 Aylık Trend</h4>
        <div className="empty-chart">
          <i className="fas fa-chart-line" style={{ fontSize: '48px', color: '#d1d1d6', marginBottom: '16px' }}></i>
          <p style={{ color: '#86868b', fontSize: '15px' }}>Henüz veri bulunmuyor</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`chart-container ${isExpanded ? 'expanded' : ''}`} onClick={toggleExpansion}>
      <h4>📈 Aylık Trend {isExpanded ? '🔽' : '▶️'}</h4>
      
      <div className="monthly-chart">
        {monthlyData.map((item, index) => {
          const height = maxAmount > 0 ? (item.amount / maxAmount) * 100 : 0
          const isSelected = selectedMonth === item.month
          
          return (
            <div
              key={item.month}
              className={`month-item ${isSelected ? 'selected' : ''}`}
              onMouseEnter={() => setSelectedMonth(item.month)}
              onMouseLeave={() => setSelectedMonth(null)}
              style={{
                animationDelay: `${index * 150}ms`
              }}
            >
              <div 
                className="month-bar"
                style={{
                  height: `${Math.max(height, 5)}%`,
                  backgroundColor: '#007aff',
                  opacity: isSelected ? 1 : 0.7,
                  transform: isSelected ? 'scaleX(1.1)' : 'scaleX(1)'
                }}
              ></div>
              <span className="month-label">{item.monthName}</span>
              <span className="month-amount">₺{item.amount.toFixed(0)}</span>
              <span className="month-count">{item.count} gider</span>
            </div>
          )
        })}
      </div>

      <div style={{ marginTop: '24px' }}>
        <h5 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', color: '#1d1d1f' }}>
          🕐 Son Giderler
        </h5>
        {recentExpenses.map((expense, index) => {
          const categoryInfo = getCategoryInfo(expense.category)
          return (
            <div 
              key={expense.id}
              className="recent-expense"
              style={{
                animationDelay: `${400 + (index * 100)}ms`
              }}
            >
              <span className="recent-icon">{categoryInfo.icon}</span>
              <div className="recent-info">
                <span className="recent-description">{expense.description}</span>
                <span className="recent-date">{formatDate(expense.date)}</span>
              </div>
              <span className="recent-amount">₺{expense.amount.toFixed(2)}</span>
            </div>
          )
        })}
      </div>

      <div className={`chart-expansion ${isExpanded ? 'expanded' : ''}`}>
        <div className="expansion-header">
          <h5 className="expansion-title">
            📊 Aylık Detaylar
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
          {monthlyData.slice(-3).reverse().map((item, index) => {
            const monthExpenses = getMonthExpenses(item.month)
            const topCategories = getTopCategories(item.month)
            
            return (
              <div key={item.month} style={{ marginBottom: '24px' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  marginBottom: '12px',
                  padding: '12px 16px',
                  background: 'rgba(0, 122, 255, 0.1)',
                  borderRadius: '12px'
                }}>
                  <div style={{ 
                    fontSize: '15px',
                    fontWeight: '600',
                    color: '#007aff'
                  }}>
                    📅 {item.monthName}
                  </div>
                  <div style={{ 
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#1d1d1f'
                  }}>
                    ₺{item.amount.toFixed(2)} ({item.count} gider)
                  </div>
                </div>

                <div style={{ 
                  display: 'flex', 
                  gap: '8px', 
                  marginBottom: '16px',
                  fontSize: '11px',
                  fontWeight: '500'
                }}>
                  {topCategories.map((cat, catIndex) => {
                    const categoryInfo = getCategoryInfo(cat.category)
                    return (
                      <div 
                        key={cat.category}
                        style={{ 
                          background: categoryInfo.color + '20',
                          color: categoryInfo.color,
                          padding: '4px 8px',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        {categoryInfo.icon} {categoryInfo.name}
                      </div>
                    )
                  })}
                </div>
                
                {monthExpenses.slice(0, 4).map((expense, expIndex) => {
                  const categoryInfo = getCategoryInfo(expense.category)
                  return (
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
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
} 