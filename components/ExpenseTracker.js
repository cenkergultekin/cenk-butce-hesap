'use client'

import { useState, useEffect } from 'react'
import ExpenseForm from './ExpenseForm'
import ExpenseList from './ExpenseList'
import CategoryChart from './CategoryChart'
import MonthlyChart from './MonthlyChart'
import Notification from './Notification'
import ConfirmDialog from './ConfirmDialog'
import { fetchExpenses, addExpense, deleteExpense, clearAllExpenses } from '../lib/expenses'

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState([])
  const [notification, setNotification] = useState(null)
  const [loading, setLoading] = useState(true)
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    type: 'danger'
  })

  // Supabase'den verileri yükle
  useEffect(() => {
    loadExpenses()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset
      const windowHeight = window.innerHeight
      
      // Add scrolled class to body for blur gradient
      if (scrollTop > 100) {
        document.body.classList.add('scrolled')
      } else {
        document.body.classList.remove('scrolled')
      }

      // Scroll reveal animations
      const revealElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale')
      
      revealElements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top
        const elementVisible = 150
        
        if (elementTop < windowHeight - elementVisible) {
          element.classList.add('revealed')
        }
      })
    }

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll)
    
    // Initial check
    handleScroll()

    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const loadExpenses = async () => {
    try {
      setLoading(true)
      const data = await fetchExpenses()
      setExpenses(data)
    } catch (error) {
      console.error('Load expenses error:', error)
      showNotification('Veriler yüklenirken hata oluştu!', 'error')
    } finally {
      setLoading(false)
    }
  }

  // Gider ekleme
  const handleAddExpense = async (expenseData) => {
    try {
      const newExpense = await addExpense(expenseData)
      setExpenses(prevExpenses => [newExpense, ...prevExpenses])
      showNotification('Gider başarıyla eklendi! 🎉', 'success')
    } catch (error) {
      console.error('Add expense error:', error)
      showNotification('Gider eklenirken hata oluştu!', 'error')
    }
  }

  // Gider silme
  const handleDeleteExpense = (id) => {
    const expense = expenses.find(exp => exp.id === id)
    setConfirmDialog({
      isOpen: true,
      title: 'Gideri Sil',
      message: `"${expense?.description}" giderini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`,
      onConfirm: () => confirmDeleteExpense(id),
      type: 'danger'
    })
  }

  const confirmDeleteExpense = async (id) => {
    try {
      await deleteExpense(id)
      setExpenses(prevExpenses => prevExpenses.filter(expense => expense.id !== id))
      showNotification('Gider başarıyla silindi!', 'delete')
    } catch (error) {
      console.error('Delete expense error:', error)
      showNotification('Gider silinirken hata oluştu!', 'error')
    }
  }

  // Tüm giderleri temizle
  const handleClearAllExpenses = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Tüm Giderleri Temizle',
      message: `${expenses.length} adet gideri silmek istediğinizden emin misiniz? Bu işlem geri alınamaz ve tüm verileriniz silinecektir.`,
      onConfirm: () => confirmClearAllExpenses(),
      type: 'warning'
    })
  }

  const confirmClearAllExpenses = async () => {
    try {
      await clearAllExpenses()
      setExpenses([])
      showNotification('Tüm giderler temizlendi!', 'warning')
    } catch (error) {
      console.error('Clear expenses error:', error)
      showNotification('Giderler temizlenirken hata oluştu!', 'error')
    }
  }

  // Toplam tutarı hesapla
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  // Bildirim göster
  const showNotification = (message, type) => {
    setNotification({ message, type })
  }

  // Dialog'u kapat
  const closeConfirmDialog = () => {
    setConfirmDialog({
      isOpen: false,
      title: '',
      message: '',
      onConfirm: null,
      type: 'danger'
    })
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading-state">
          <div className="loading"></div>
          <p>Giderler yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="expense-tracker-container">
      {notification && (
        <Notification 
          notification={notification} 
          onClose={() => setNotification(null)} 
        />
      )}

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={closeConfirmDialog}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type={confirmDialog.type}
        confirmText={confirmDialog.type === 'warning' ? 'Temizle' : 'Sil'}
        cancelText="İptal"
      />
      
      <div className="main-grid">
        <aside className="left-sidebar scroll-reveal-left">
          <CategoryChart expenses={expenses} />
        </aside>
        
        <main className="main-content">
          <div className="header-section scroll-reveal-scale">
            <div className="premium-badge">
              <span className="crown">👑</span>
              Premium
            </div>
            
            <h1>Cenker Bütçe Hesaplama</h1>
            <p className="subtitle">Akıllı finans yönetimi ile geleceğinizi planlayın</p>
            
            {totalAmount > 0 && (
              <div className="total-summary scroll-reveal">
                <div className="total-amount">
                  <span className="currency">₺</span>
                  <span className="amount">{totalAmount.toFixed(2)}</span>
                </div>
                <p className="total-label">Toplam Gider</p>
              </div>
            )}
          </div>

          <div className="form-section scroll-reveal">
            <ExpenseForm onAddExpense={handleAddExpense} />
          </div>

          <div className="list-section scroll-reveal">
            <ExpenseList 
              expenses={expenses} 
              onDeleteExpense={handleDeleteExpense}
              onClearAll={handleClearAllExpenses}
            />
          </div>
        </main>
        
        <aside className="right-sidebar scroll-reveal-right">
          <MonthlyChart expenses={expenses} />
        </aside>
      </div>
    </div>
  )
} 