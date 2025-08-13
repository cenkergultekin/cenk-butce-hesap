# Cenker Bütçe Hesaplama

Apple-inspired premium gider takip uygulaması. Modern glassmorphism tasarım, interaktif grafikler ve gerçek zamanlı Firebase veritabanı entegrasyonu. 

Projeyi geliştirme amacım: firebase entegrasyonunu öğrenmek, vibe coding ile yayına ilk projemi almak ve süreç takibidir. Proje sonucunda veri tabanı konfigrasyonlarının nasıl yapıldığı, env dosyası ve gitignore dosyaları hakkında bilgiler edindim.

## Özellikler

- 🎨 **Apple Tasarım Dili**: SF Pro fontları ve glassmorphism efektleri
- 📊 **İnteraktif Grafikler**: Kategori dağılımı ve aylık trend analizi
- 🔥 **Firebase Entegrasyonu**: Gerçek zamanlı Firestore veritabanı
- 📱 **Responsive Tasarım**: Mobil ve desktop uyumlu
- ⚡ **Modern UX**: Smooth animasyonlar ve micro-interactions
- 🌟 **Premium UI**: Glassmorphism kartlar ve depth efektleri

## Kurulum

1. **Projeyi klonlayın:**
   ```bash
   git clone <repository-url>
   cd butce-web
   ```

2. **Dependencies'leri kurun:**
   ```bash
   npm install
   ```

3. **Firebase Konfigürasyonu:**
   
   a. Firebase Console'a gidin: https://console.firebase.google.com
   
   b. Yeni proje oluşturun veya mevcut projeyi seçin
   
   c. Firestore Database'i etkinleştirin:
      - Build > Firestore Database
      - "Create database" butonuna tıklayın
      - Test modunda başlatın (production'da güvenlik kurallarını düzenleyin)
   
   d. Web uygulaması ekleyin:
      - Project Overview > Add app > Web
      - App nickname verin
      - Konfigürasyon bilgilerini kopyalayın

4. **Firebase Config Güncelleme:**
   
   `lib/firebase.js` dosyasındaki `firebaseConfig` objesini kendi Firebase proje bilgilerinizle güncelleyin:
   
   ```javascript
   const firebaseConfig = {
     apiKey: "your_api_key_here",
     authDomain: "your_project_id.firebaseapp.com",
     projectId: "your_project_id",
     storageBucket: "your_project_id.appspot.com",
     messagingSenderId: "your_sender_id",
     appId: "your_app_id"
   }
   ```

5. **Uygulamayı çalıştırın:**
   ```bash
   npm run dev
   ```

6. **Tarayıcıda açın:**
   http://localhost:3000

## Firebase Firestore Yapısı

Uygulama `expenses` collection'ı kullanır:

```javascript
// Document yapısı
{
  id: "auto-generated-id",
  description: "string",
  amount: number,
  category: "string",
  date: "YYYY-MM-DD",
  createdAt: "ISO timestamp"
}
```

### Kategoriler:
- 🍔 Yemek
- 🚗 Ulaşım  
- 🎮 Eğlence
- 🛒 Alışveriş
- 🏥 Sağlık
- 🏠 Ev
- 📚 Eğitim

## Teknik Detaylar

### Architecture:
- **Frontend**: Next.js 14, React 18
- **Database**: Firebase Firestore
- **Styling**: CSS Modules, Glassmorphism
- **Charts**: Custom SVG components
- **Animations**: CSS transitions with Apple cubic-bezier

### Performance:
- SSR/SSG support
- Optimistic UI updates
- Efficient Firebase queries
- Lazy loaded components

### Security:
- Firebase konfigürasyonu kod içinde (development için)
- Firebase security rules (production'da yapılandırılmalı)
- Input validation

## Firebase Security Rules

Production için Firestore security rules örneği:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Herkese read/write izni (geliştirme için)
    // Production'da authentication ekleyin
    match /expenses/{document} {
      allow read, write: if true;
    }
  }
}
```

## Geliştirme

- **Componenets**: `components/` klasöründe modüler bileşenler
- **Database**: `lib/expenses.js` - Firestore operasyonları
- **Config**: `lib/firebase.js` - Firebase konfigürasyonu
- **Styling**: Apple design system, SF Pro fonts
- **State Management**: React useState/useEffect

## Build ve Deploy

```bash
# Production build
npm run build

# Start production server
npm start
```

### Deploy Options:
- **Vercel**: Automatic deployment with git integration
- **Firebase Hosting**: `firebase deploy`
- **Netlify**: Continuous deployment

## Lisans

MIT License - Kişisel ve ticari kullanım için ücretsiz.
