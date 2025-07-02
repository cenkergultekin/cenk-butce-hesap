import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  writeBatch 
} from 'firebase/firestore'
import { db } from './firebase'

// Expenses collection referansı
const expensesCollection = collection(db, 'expenses')

// Tüm giderleri getir
export async function fetchExpenses() {
  try {
    const q = query(expensesCollection, orderBy('date', 'desc'))
    const querySnapshot = await getDocs(q)
    
    const expenses = []
    querySnapshot.forEach((doc) => {
      expenses.push({
        id: doc.id,
        ...doc.data()
      })
    })
    
    return expenses
  } catch (error) {
    console.error('Error fetching expenses:', error)
    throw error
  }
}

// Yeni gider ekle
export async function addExpense(expense) {
  try {
    const docRef = await addDoc(expensesCollection, {
      description: expense.description,
      amount: parseFloat(expense.amount),
      category: expense.category,
      date: expense.date,
      createdAt: new Date().toISOString()
    })
    
    return {
      id: docRef.id,
      description: expense.description,
      amount: parseFloat(expense.amount),
      category: expense.category,
      date: expense.date,
      createdAt: new Date().toISOString()
    }
  } catch (error) {
    console.error('Error adding expense:', error)
    throw error
  }
}

// Gider sil
export async function deleteExpense(id) {
  try {
    await deleteDoc(doc(db, 'expenses', id))
  } catch (error) {
    console.error('Error deleting expense:', error)
    throw error
  }
}

// Tüm giderleri sil
export async function clearAllExpenses() {
  try {
    const querySnapshot = await getDocs(expensesCollection)
    const batch = writeBatch(db)
    
    querySnapshot.forEach((document) => {
      batch.delete(document.ref)
    })
    
    await batch.commit()
  } catch (error) {
    console.error('Error clearing expenses:', error)
    throw error
  }
} 