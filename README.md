# CampusEats MEC

A premium, campus-exclusive food ordering and payment web platform with Swiggy/UberEats-level experience.

## 🚀 Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **Authentication**: Supabase Auth (Role-based: Student, Vendor, Admin)
- **Database**: Firebase Firestore
- **Styling**: TailwindCSS (to be configured)

## 📦 Installation

1. Install dependencies:
```bash
npm install
```

2. Install Firebase CLI globally:
```bash
npm install -g firebase-tools
```

3. Set up environment variables:
   - Copy `.env.local` and ensure all variables are set
   - Supabase and Firebase credentials are already configured

4. Run the development server:
```bash
npm run dev
```

## 🗄️ Database Structure

### Collections:

- **users**: User profiles with wallet balance and RFID
- **vendors**: Vendor information and menu items
- **menu_items**: Food items with pricing and availability
- **orders**: Order tracking with status and payment info
- **transactions**: Payment history and wallet transactions
- **group_orders**: Linked orders for group dining

## 🔐 Security

- Role-based access control via Supabase Auth
- Firestore security rules enforce wallet mutation restrictions
- Order state locked after pickup confirmation
- Server-side validation for all critical operations

## 📱 Features

- **RFID Payment**: Students use RFID cards linked to digital wallets
- **Pickup Confirmation**: Payment deducted only after pickup
- **Group Ordering**: Multiple students can link orders
- **Real-time Updates**: Live order status and availability
- **Role-based Portals**: Separate interfaces for Students, Vendors, and Admins

## 🎨 Design Philosophy

Premium, calm, modern aesthetic with:
- Soft pastel color palette
- Card-based UI with glassmorphism
- Smooth animations and micro-interactions
- Mobile-first responsive design

## 🔄 Order Flow

1. Student places order
2. Vendor accepts order
3. Vendor marks order ready
4. Student confirms pickup (RFID/QR)
5. Payment deducted from wallet

## 📝 Next Steps

1. Configure TailwindCSS
2. Build UI components
3. Implement authentication flows
4. Create role-based portals
5. Add animations and interactions
