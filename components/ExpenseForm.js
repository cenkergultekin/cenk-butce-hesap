'use client'

import { useState } from 'react'

export default function ExpenseForm({ onAddExpense }) {
  // Bugünün tarihini YYYY-MM-DD formatında al
  const getTodayDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    date: getTodayDate() // Bugünün tarihi default
  })

  const categories = [
    { value: 'food', label: '🍔 Yiyecek' },
    { value: 'transport', label: '🚗 Ulaşım' },
    { value: 'shopping', label: '🛒 Alışveriş' },
    { value: 'entertainment', label: '🎬 Eğlence' },
    { value: 'utilities', label: '⚡ Faturalar' },
    { value: 'health', label: '🏥 Sağlık' },
    { value: 'other', label: '📋 Diğer' }
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.description.trim() || !formData.amount || !formData.category || !formData.date) {
      alert('Lütfen tüm alanları doldurun!')
      return
    }

    const amount = parseFloat(formData.amount)
    if (amount <= 0) {
      alert('Lütfen geçerli bir tutar girin!')
      return
    }

    onAddExpense({
      description: formData.description.trim(),
      amount: amount,
      category: formData.category,
      date: formData.date
    })

    // Formu temizle (bugünün tarihi kalsın)
    setFormData({
      description: '',
      amount: '',
      category: '',
      date: getTodayDate()
    })
  }

  return (
    <div className="expense-form-card">
      <h3>
        <i className="fas fa-plus"></i> Yeni Gider Ekle
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="description">
            <i className="fas fa-file-text"></i> Açıklama
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Gider açıklaması..."
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="amount">
            <i className="fas fa-lira-sign"></i> Tutar (₺)
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">
            <i className="fas fa-calendar"></i> Tarih
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            max={new Date().toISOString().split('T')[0]} // Gelecek tarih seçilemesin
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="category">
            <i className="fas fa-tags"></i> Kategori
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Kategori seçin...</option>
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
        
        <button type="submit" className="btn-primary">
          <i className="fas fa-plus"></i> Gider Ekle
        </button>
      </form>
    </div>
  )
} 