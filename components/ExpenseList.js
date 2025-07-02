'use client'

export default function ExpenseList({ expenses, onDeleteExpense, onClearAll }) {
  const getCategoryIcon = (category) => {
    const icons = {
      food: '🍔',
      transport: '🚗',
      shopping: '🛒',
      entertainment: '🎬',
      utilities: '⚡',
      health: '🏥',
      other: '📋'
    }
    return icons[category] || '📋'
  }

  const getCategoryName = (category) => {
    const names = {
      food: 'Yiyecek',
      transport: 'Ulaşım',
      shopping: 'Alışveriş',
      entertainment: 'Eğlence',
      utilities: 'Faturalar',
      health: 'Sağlık',
      other: 'Diğer'
    }
    return names[category] || 'Diğer'
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  return (
    <div className="expenses-section">
      <div className="section-header">
        <h3>
          <i className="fas fa-list"></i> Gider Listesi
        </h3>
        {expenses.length > 0 && (
          <button onClick={onClearAll} className="btn-danger">
            <i className="fas fa-trash"></i> Tümünü Temizle
          </button>
        )}
      </div>
      
      <div className="expenses-list">
        {expenses.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-receipt"></i>
            <p>Henüz gider eklenmemiş</p>
            <small>Yukarıdaki formu kullanarak ilk giderinizi ekleyin</small>
          </div>
        ) : (
          expenses.map(expense => (
            <div key={expense.id} className="expense-item" data-category={expense.category}>
              <div className="expense-info">
                <div className="expense-description">{expense.description}</div>
                <div className="expense-meta">
                  <span className={`category-badge category-${expense.category}`}>
                    {getCategoryIcon(expense.category)} {getCategoryName(expense.category)}
                  </span>
                  <span className="expense-date">
                    <i className="fas fa-calendar-alt"></i> {formatDate(expense.date)}
                  </span>
                </div>
              </div>
              <div className="expense-amount">₺{parseFloat(expense.amount).toFixed(2)}</div>
              <button 
                className="btn-delete" 
                onClick={() => onDeleteExpense(expense.id)}
                title="Gideri Sil"
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
} 