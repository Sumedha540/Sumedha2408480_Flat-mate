// src/components/AdminHistorySection.tsx
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CalendarIcon, DollarSignIcon, BuildingIcon, UsersIcon, ActivityIcon,
  CheckCircleIcon, XIcon, AlertTriangleIcon, ClockIcon, SearchIcon,
  FilterIcon, DownloadIcon, ShieldAlertIcon, StarIcon, FlagIcon,
  EyeIcon, RefreshCcwIcon, UserCheckIcon, TrashIcon, LockIcon,
  ChevronDownIcon, MailIcon, PhoneIcon, CheckIcon, FileTextIcon,
  TrendingUpIcon, TrendingDownIcon, MinusIcon, MapPinIcon,
} from 'lucide-react'
import { toast } from '../utils/toast'

import { BACKEND_URL } from '../config/api'

interface Props {
  users: any[]
  bookings: any[]
  properties: any[]
  totalIncome: number
  profit: number
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

const formatDateTime = (date: string | Date) => {
  return new Date(date).toLocaleString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getTimeAgo = (date: string | Date) => {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000)
  
  if (seconds < 60) return `${seconds}s ago`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  return formatDate(date)
}

// Status Badge Component
function StatusBadge({ status }: { status: string }) {
  const statusMap: Record<string, string> = {
    confirmed: 'bg-green-100 text-green-700',
    approved: 'bg-green-100 text-green-700',
    success: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    failed: 'bg-red-100 text-red-700',
    refunded: 'bg-purple-100 text-purple-700',
    pending: 'bg-amber-100 text-amber-700',
    cancelled: 'bg-gray-100 text-gray-700',
  }
  
  return (
    <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${statusMap[status.toLowerCase()] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  )
}

// Export to CSV function
const exportToCSV = (data: any[], filename: string) => {
  if (!data.length) {
    toast.error('No data to export')
    return
  }
  
  const keys = Object.keys(data[0])
  const csv = [
    keys.join(','),
    ...data.map(row => keys.map(k => {
      const val = row[k]
      if (val === null || val === undefined) return ''
      return `"${String(val).replace(/"/g, '""')}"`
    }).join(','))
  ].join('\n')
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  toast.success('Complete history exported to CSV successfully!')
}

// Export to PDF function - Comprehensive report with all sections
const exportComprehensivePDF = (
  bookings: any[],
  payments: any[],
  userActivity: any[],
  ownerActivity: any[],
  propertyHistory: any[],
  reviews: any[],
  suspiciousAlerts: any[]
) => {
  const hasData = bookings.length || payments.length || userActivity.length || 
                  ownerActivity.length || propertyHistory.length || reviews.length || 
                  suspiciousAlerts.length

  if (!hasData) {
    toast.error('No data to export')
    return
  }

  // Helper function to create table HTML
  const createTableHTML = (data: any[], title: string, colorClass: string) => {
    if (!data.length) return ''
    
    const keys = Object.keys(data[0])
    return `
      <div class="section">
        <h2 class="${colorClass}">${title}</h2>
        <div class="record-count">${data.length} records</div>
        <table>
          <thead>
            <tr>
              ${keys.map(k => `<th>${k.replace(/([A-Z])/g, ' $1').trim().replace(/^./, str => str.toUpperCase())}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${data.map(row => `
              <tr>
                ${keys.map(k => `<td>${row[k] !== null && row[k] !== undefined ? String(row[k]).substring(0, 100) : '—'}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `
  }

  const currentDate = new Date()
  const formattedDate = currentDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  })
  const formattedTime = currentDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })

  const tableHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Admin History Report - Flat-Mate</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body { 
          font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif; 
          background: #ffffff;
          color: #1f2937;
          line-height: 1.6;
        }
        
        .page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px;
        }
        
        /* Header with Logo */
        .report-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding-bottom: 30px;
          border-bottom: 3px solid #4f46e5;
          margin-bottom: 40px;
        }
        
        .logo-section {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        
        .logo {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          font-weight: 700;
          color: white;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
        
        .brand {
          display: flex;
          flex-direction: column;
        }
        
        .brand-name {
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
          letter-spacing: -0.5px;
        }
        
        .brand-tagline {
          font-size: 12px;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          font-weight: 500;
        }
        
        .report-info {
          text-align: right;
        }
        
        .report-title {
          font-size: 24px;
          font-weight: 700;
          color: #4f46e5;
          margin-bottom: 8px;
        }
        
        .report-meta {
          font-size: 13px;
          color: #6b7280;
          line-height: 1.8;
        }
        
        .report-meta strong {
          color: #374151;
          font-weight: 600;
        }
        
        /* Sections */
        .section {
          background: #ffffff;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          padding: 30px;
          margin-bottom: 30px;
          page-break-inside: avoid;
        }
        
        .section h2 {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 5px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .section h2.blue { color: #2563eb; }
        .section h2.green { color: #059669; }
        .section h2.purple { color: #7c3aed; }
        .section h2.indigo { color: #4f46e5; }
        .section h2.amber { color: #d97706; }
        .section h2.pink { color: #db2777; }
        .section h2.orange { color: #ea580c; }
        
        .record-count {
          font-size: 13px;
          color: #6b7280;
          margin-bottom: 20px;
          font-weight: 500;
        }
        
        /* Tables */
        table { 
          width: 100%; 
          border-collapse: collapse; 
          font-size: 11px;
          margin-top: 15px;
        }
        
        th, td { 
          border: 1px solid #e5e7eb; 
          padding: 12px 10px; 
          text-align: left;
          word-wrap: break-word;
        }
        
        th { 
          background: #f9fafb;
          color: #374151;
          font-weight: 700;
          text-transform: uppercase;
          font-size: 10px;
          letter-spacing: 0.5px;
        }
        
        tbody tr:nth-child(even) { 
          background-color: #f9fafb; 
        }
        
        tbody tr:hover { 
          background-color: #f3f4f6; 
        }
        
        /* Footer */
        .report-footer {
          margin-top: 50px;
          padding-top: 30px;
          border-top: 2px solid #e5e7eb;
          text-align: center;
        }
        
        .footer-brand {
          font-size: 16px;
          font-weight: 700;
          color: #4f46e5;
          margin-bottom: 8px;
        }
        
        .footer-text {
          font-size: 12px;
          color: #6b7280;
          line-height: 1.8;
        }
        
        .confidential {
          display: inline-block;
          background: #fef3c7;
          color: #92400e;
          padding: 4px 12px;
          border-radius: 6px;
          font-weight: 600;
          font-size: 11px;
          margin-top: 10px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        /* Print Styles */
        @media print {
          body { background: white; }
          .page { padding: 20px; }
          .section { 
            page-break-inside: avoid;
            border: 1px solid #e5e7eb;
          }
          .report-header { page-break-after: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="page">
        <!-- Header with Logo -->
        <div class="report-header">
          <div class="logo-section">
            <div class="logo">F</div>
            <div class="brand">
              <div class="brand-name">Flat-Mate</div>
              <div class="brand-tagline">Find Your Home</div>
            </div>
          </div>
          <div class="report-info">
            <div class="report-title">Admin History Report</div>
            <div class="report-meta">
              <div><strong>Date:</strong> ${formattedDate}</div>
              <div><strong>Time:</strong> ${formattedTime}</div>
              <div><strong>Generated by:</strong> Admin Dashboard</div>
            </div>
          </div>
        </div>

        <!-- Data Sections -->
        ${createTableHTML(bookings, 'Booking History', 'blue')}
        ${createTableHTML(payments, 'Payment History', 'green')}
        ${createTableHTML(userActivity, 'User Activity History', 'purple')}
        ${createTableHTML(ownerActivity, 'Owner Activity History', 'indigo')}
        ${createTableHTML(propertyHistory, 'Property History', 'amber')}
        ${createTableHTML(reviews, 'Reviews & Complaints', 'pink')}
        ${createTableHTML(suspiciousAlerts, 'Suspicious Activity Alerts', 'orange')}

        <!-- Footer -->
        <div class="report-footer">
          <div class="footer-brand">Flat-Mate Admin Dashboard</div>
          <div class="footer-text">
            This report contains sensitive business information and user data.
            <br>
            Handle with appropriate care and maintain confidentiality.
          </div>
          <div class="confidential">⚠ Confidential Document</div>
        </div>
      </div>
    </body>
    </html>
  `

  // Open in new window and print
  const printWindow = window.open('', '_blank')
  if (printWindow) {
    printWindow.document.write(tableHTML)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
      toast.success('Report ready - use Print dialog to save as PDF')
    }, 250)
  } else {
    toast.error('Please allow popups to export report')
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export function AdminHistorySection({ users, bookings, properties, totalIncome, profit }: Props) {
  const [activeTab, setActiveTab] = useState('bookings')
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterDate, setFilterDate] = useState('all')
  const [loading, setLoading] = useState(false)
  
  // Add error state
  const [error, setError] = useState<string | null>(null)
  
  // Safely handle props
  const safeUsers = users || []
  const safeBookings = bookings || []
  const safeProperties = properties || []
  const safeTotalIncome = totalIncome || 0
  const safeProfit = profit || 0
  
  // Data states
  const [bookingHistory, setBookingHistory] = useState<any[]>(safeBookings)
  const [paymentHistory, setPaymentHistory] = useState<any[]>([])
  const [userActivity, setUserActivity] = useState<any[]>([])
  const [ownerActivity, setOwnerActivity] = useState<any[]>([])
  const [propertyHistory, setPropertyHistory] = useState<any[]>([])
  const [reviewHistory, setReviewHistory] = useState<any[]>([])
  const [adminLogs, setAdminLogs] = useState<any[]>([])
  const [timeline, setTimeline] = useState<any[]>([])
  const [suspiciousAlerts, setSuspiciousAlerts] = useState<any[]>([])
  
  // Initialize user activity immediately when users or bookings change
  useEffect(() => {
    if (users && users.length > 0) {
      console.log('Populating user activity, users:', users.length, 'bookings:', bookings.length)
      
      const realUserActivities: any[] = []
      
      // 1. Add registration activities for all users
      users.forEach((user: any) => {
        const userName = user.name || `${user.firstName} ${user.lastName}`
        const timestamp = user.createdAt || (user.joined ? user.joined + 'T00:00:00.000Z' : new Date().toISOString())
        
        realUserActivities.push({
          id: `reg-${user.id || user._id}`,
          userName: userName,
          userEmail: user.email,
          action: 'Registered',
          targetName: '',
          timestamp: timestamp,
          details: `Registered on the platform`
        })
        
        // 2. Add "Logged in" activity for Google users
        if (user.isGoogleUser) {
          const loginTimestamp = user.updatedAt || user.createdAt || (user.joined ? user.joined + 'T00:00:00.000Z' : new Date().toISOString())
          realUserActivities.push({
            id: `login-${user.id || user._id}`,
            userName: userName,
            userEmail: user.email,
            action: 'Logged in',
            targetName: '',
            timestamp: loginTimestamp,
            details: `Logged in via Google`
          })
        }
      })
      
      // 3. Add booking activities
      if (bookings && bookings.length > 0) {
        bookings.forEach((booking: any) => {
          if (booking.tenantName || booking.customerName) {
            realUserActivities.push({
              id: `book-${booking._id || booking.receiptId}`,
              userName: booking.tenantName || booking.customerName,
              userEmail: booking.tenantEmail || booking.customerEmail || '',
              action: 'Booked property',
              targetName: booking.propertyTitle || '',
              timestamp: booking.createdAt || booking.bookingDate || new Date().toISOString(),
              details: `Booked ${booking.propertyTitle || 'property'}`
            })
            
            if (booking.status === 'cancelled') {
              const cancelDate = booking.updatedAt || booking.createdAt || booking.bookingDate
              realUserActivities.push({
                id: `cancel-${booking._id || booking.receiptId}`,
                userName: booking.tenantName || booking.customerName,
                userEmail: booking.tenantEmail || booking.customerEmail || '',
                action: 'Cancelled booking',
                targetName: booking.propertyTitle || '',
                timestamp: cancelDate,
                details: `Cancelled booking for ${booking.propertyTitle || 'property'}`
              })
            }
          }
        })
      }
      
      // Sort by timestamp
      realUserActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      
      console.log('Setting user activities:', realUserActivities.length)
      setUserActivity(realUserActivities)
    }
  }, [users, bookings])
  
  // Stats
  const [stats, setStats] = useState({
    totalBookings: safeBookings.length,
    totalRevenue: safeTotalIncome,
    confirmedBookings: safeBookings.filter((b: any) => b.status === 'confirmed').length,
    pendingBookings: safeBookings.filter((b: any) => b.status === 'pending').length,
    totalPayments: 0,
    successfulPayments: 0,
    failedPayments: 0,
  })
  
  // Detail modals
  const [detailBooking, setDetailBooking] = useState<any>(null)
  const [detailPayment, setDetailPayment] = useState<any>(null)

  // ═══════════════════════════════════════════════════════════════════════════
  // FETCH DATA FROM BACKEND
  // ═══════════════════════════════════════════════════════════════════════════

  useEffect(() => {
    fetchHistoryData()
  }, [activeTab])

  const fetchHistoryData = async () => {
    setLoading(true)
    setError(null)
    try {
      const baseURL = `${BACKEND_URL}/api/history`
      
      if (activeTab === 'bookings') {
        try {
          const res = await fetch(`${baseURL}/bookings?limit=100`)
          const data = await res.json()
          if (data.success && data.bookings) {
            setBookingHistory(data.bookings)
            setStats(prev => ({ ...prev, ...data.stats }))
          } else {
            // Use passed bookings as fallback
            setBookingHistory(bookings || [])
          }
        } catch (err) {
          console.log('Using local bookings data')
          setBookingHistory(bookings || [])
        }
      } else if (activeTab === 'payments') {
        try {
          // Try to fetch from API first
          let apiPayments: any[] = []
          try {
            const resPayments = await fetch(`${baseURL}/payments?limit=100`)
            const dataPayments = await resPayments.json()
            if (dataPayments.success && dataPayments.payments) {
              apiPayments = dataPayments.payments
            }
          } catch (err) {
            console.log('No API payment data, using bookings')
          }
          
          // Generate payment records from bookings if no API data
          let bookingPayments: any[] = []
          if (apiPayments.length === 0) {
            // Try to get bookings from localStorage directly as fallback
            const localBookings = safeBookings.length > 0 ? safeBookings : (() => {
              try {
                const stored = localStorage.getItem('fm_bookings')
                return stored ? JSON.parse(stored) : []
              } catch {
                return []
              }
            })()
            
            console.log('Local bookings found:', localBookings.length)
            
            if (localBookings.length > 0) {
              bookingPayments = localBookings
                .filter((b: any) => b.status === 'confirmed' || b.transactionId || b.amount)
                .map((booking: any) => ({
                  _id: booking._id || booking.receiptId,
                  transactionId: booking.transactionId || booking.receiptId || `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                  tenantName: booking.tenantName || booking.customerName || 'Unknown Tenant',
                  tenantEmail: booking.tenantEmail || booking.customerEmail || '',
                  propertyTitle: booking.propertyTitle || 'Property',
                  propertyId: booking.propertyId,
                  ownerName: booking.ownerName || 'Unknown Owner',
                  amount: booking.amount || booking.rent || 0,
                  paymentType: booking.paymentType || 'full',
                  paymentMethod: booking.paymentMethod || 'Cash',
                  status: booking.status === 'confirmed' ? 'success' : booking.status === 'pending' ? 'pending' : 'success',
                  paymentDate: booking.createdAt || booking.bookingDate || new Date().toISOString(),
                  receiptId: booking.receiptId,
                  isSubscription: false
                }))
              console.log('Booking payments generated:', bookingPayments.length)
            } else {
              // Generate mock payment data if no bookings exist
              console.log('No bookings found, generating mock payment data')
              const mockPayments = Array.from({ length: 15 }, (_, i) => {
                const daysAgo = Math.floor(Math.random() * 60)
                const paymentDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)
                const methods = ['Khalti', 'eSewa', 'Cash', 'Bank Transfer']
                const types = ['full', 'advance', 'half']
                const statuses = ['success', 'success', 'success', 'success', 'pending', 'failed']
                const properties = [
                  'Modern 2BHK Apartment', 'Cozy Studio in Thamel', 'Spacious 3BHK Villa',
                  'Luxury Penthouse', 'Budget-Friendly Room', 'Family House in Patan',
                  'Student Accommodation', 'Executive Suite', 'Garden View Flat'
                ]
                const tenants = [
                  'Anita Thapa', 'Rajesh Sharma', 'Sita Gurung', 'Krishna Adhikari',
                  'Maya Rai', 'Bikash Thapa', 'Priya Maharjan', 'Suresh Karki',
                  'Deepa Shrestha', 'Ramesh Tamang'
                ]
                
                return {
                  _id: `mock-payment-${i}`,
                  transactionId: `TXN-${Date.now()}-${i.toString().padStart(4, '0')}`,
                  tenantName: tenants[i % tenants.length],
                  tenantEmail: `tenant${i}@example.com`,
                  propertyTitle: properties[i % properties.length],
                  propertyId: `prop-${i}`,
                  ownerName: 'Property Owner',
                  amount: Math.floor(Math.random() * 30000) + 10000,
                  paymentType: types[i % types.length],
                  paymentMethod: methods[i % methods.length],
                  status: statuses[i % statuses.length],
                  paymentDate: paymentDate.toISOString(),
                  receiptId: `RCP-${i.toString().padStart(6, '0')}`,
                  isSubscription: false
                }
              })
              bookingPayments = mockPayments
            }
          }
          
          // Fetch subscription payments
          let subscriptionPayments: any[] = []
          try {
            const resSubscriptions = await fetch(`${BACKEND_URL}/api/subscription/payments`)
            const dataSubscriptions = await resSubscriptions.json()
            if (dataSubscriptions.success && dataSubscriptions.payments) {
              subscriptionPayments = dataSubscriptions.payments.map((sub: any) => ({
                ...sub,
                _id: sub._id,
                transactionId: sub.transactionId || `SUB-${sub._id}`,
                tenantName: sub.userName || sub.ownerName,
                propertyTitle: `Video Subscription - ${sub.plan}`,
                amount: sub.amount,
                paymentType: 'subscription',
                paymentMethod: sub.paymentMethod || 'Khalti',
                status: sub.status || 'success',
                paymentDate: sub.createdAt || sub.paymentDate,
                isSubscription: true
              }))
            }
          } catch (err) {
            console.log('No subscription payment data from API')
            // Check localStorage for subscription data
            try {
              const storedSubs = localStorage.getItem('fm_subscriptions')
              if (storedSubs) {
                const subs = JSON.parse(storedSubs)
                subscriptionPayments = subs
                  .filter((s: any) => s.status === 'Active' || s.paid)
                  .map((sub: any) => ({
                    _id: sub.id || `sub-${Date.now()}`,
                    transactionId: `SUB-${sub.id || Date.now()}`,
                    tenantName: sub.ownerName || 'Property Owner',
                    propertyTitle: `Video Subscription - ${sub.plan || 'Premium'}`,
                    amount: sub.amount || 499,
                    paymentType: 'subscription',
                    paymentMethod: 'Khalti',
                    status: 'success',
                    paymentDate: sub.startDate || new Date().toISOString(),
                    isSubscription: true
                  }))
              }
            } catch (e) {
              console.log('No subscription data in localStorage')
            }
            
            // Generate mock subscription payments if none exist
            if (subscriptionPayments.length === 0) {
              console.log('Generating mock subscription payments')
              const mockSubs = Array.from({ length: 5 }, (_, i) => {
                const daysAgo = Math.floor(Math.random() * 30)
                const paymentDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)
                const plans = ['Basic', 'Premium', 'Pro']
                const owners = ['Rajesh Sharma', 'Priya Maharjan', 'Suresh Karki', 'Deepa Shrestha']
                
                return {
                  _id: `mock-sub-${i}`,
                  transactionId: `SUB-${Date.now()}-${i.toString().padStart(4, '0')}`,
                  tenantName: owners[i % owners.length],
                  propertyTitle: `Video Subscription - ${plans[i % plans.length]}`,
                  amount: plans[i % plans.length] === 'Basic' ? 299 : plans[i % plans.length] === 'Premium' ? 499 : 799,
                  paymentType: 'subscription',
                  paymentMethod: 'Khalti',
                  status: 'success',
                  paymentDate: paymentDate.toISOString(),
                  isSubscription: true
                }
              })
              subscriptionPayments = mockSubs
            }
          }
          
          // Merge all payment types
          const allPayments = [
            ...apiPayments,
            ...bookingPayments,
            ...subscriptionPayments
          ].sort((a, b) => new Date(b.paymentDate || b.createdAt).getTime() - new Date(a.paymentDate || a.createdAt).getTime())
          
          console.log('Total payments to display:', allPayments.length)
          setPaymentHistory(allPayments)
          
          // Calculate stats
          const successPayments = allPayments.filter((p: any) => p.status === 'success')
          const totalRevenue = successPayments.reduce((sum: number, p: any) => sum + (p.amount || 0), 0)
          setStats(prev => ({
            ...prev,
            totalPayments: allPayments.length,
            successfulPayments: successPayments.length,
            failedPayments: allPayments.filter((p: any) => p.status === 'failed').length,
            totalRevenue: totalRevenue
          }))
          
        } catch (err) {
          console.log('Error loading payments:', err)
          setPaymentHistory([])
        }
      } else if (activeTab === 'user-activity') {
        try {
          const res = await fetch(`${baseURL}/user-activity?limit=100`)
          const data = await res.json()
          if (data.success && data.activities) {
            setUserActivity(data.activities)
          } else {
            // Extract REAL user activities from actual data
            const currentUsers = users || []
            const currentBookings = bookings || []
            
            console.log('Extracting user activities from real data')
            console.log('Users available:', currentUsers.length)
            console.log('Bookings available:', currentBookings.length)
            
            const realUserActivities: any[] = []
            
            // 1. Add REAL registration activities from users
            currentUsers.forEach((user: any) => {
              const userName = user.name || `${user.firstName} ${user.lastName}`
              const timestamp = user.createdAt || (user.joined ? user.joined + 'T00:00:00.000Z' : new Date().toISOString())
              
              console.log('Adding registration for user:', userName, 'timestamp:', timestamp)
              
              realUserActivities.push({
                id: `reg-${user.id || user._id}`,
                userName: userName,
                userEmail: user.email,
                action: 'Registered',
                targetName: '',
                timestamp: timestamp,
                ipAddress: '',
                details: `Registered on the platform`
              })
            })
            
            // 2. Add REAL booking activities from bookings
            currentBookings.forEach((booking: any) => {
              if (booking.tenantName || booking.customerName) {
                realUserActivities.push({
                  id: `book-${booking._id || booking.receiptId}`,
                  userName: booking.tenantName || booking.customerName,
                  userEmail: booking.tenantEmail || booking.customerEmail || '',
                  action: 'Booked property',
                  targetName: booking.propertyTitle || '',
                  timestamp: booking.createdAt || booking.bookingDate || new Date().toISOString(),
                  ipAddress: '',
                  details: `Booked ${booking.propertyTitle || 'property'}`
                })
                
                // Add cancelled booking activity if status is cancelled
                if (booking.status === 'cancelled') {
                  const cancelDate = booking.updatedAt || booking.createdAt || booking.bookingDate
                  realUserActivities.push({
                    id: `cancel-${booking._id || booking.receiptId}`,
                    userName: booking.tenantName || booking.customerName,
                    userEmail: booking.tenantEmail || booking.customerEmail || '',
                    action: 'Cancelled booking',
                    targetName: booking.propertyTitle || '',
                    timestamp: cancelDate,
                    ipAddress: '',
                    details: `Cancelled booking for ${booking.propertyTitle || 'property'}`
                  })
                }
              }
            })
            
            console.log('Total activities created:', realUserActivities.length)
            
            // Sort by timestamp (most recent first)
            realUserActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            
            setUserActivity(realUserActivities)
          }
        } catch (err) {
          console.log('No user activity data from API, extracting from real data')
          
          const currentUsers = users || []
          const currentBookings = bookings || []
          
          console.log('Users available:', currentUsers.length)
          console.log('Bookings available:', currentBookings.length)
          
          // Extract REAL user activities from actual data
          const realUserActivities: any[] = []
          
          // 1. Add REAL registration activities from users
          currentUsers.forEach((user: any) => {
            const userName = user.name || `${user.firstName} ${user.lastName}`
            const timestamp = user.createdAt || (user.joined ? user.joined + 'T00:00:00.000Z' : new Date().toISOString())
            
            console.log('Adding registration for user:', userName, 'timestamp:', timestamp)
            
            realUserActivities.push({
              id: `reg-${user.id || user._id}`,
              userName: userName,
              userEmail: user.email,
              action: 'Registered',
              targetName: '',
              timestamp: timestamp,
              ipAddress: '',
              details: `Registered on the platform`
            })
          })
          
          // 2. Add REAL booking activities from bookings
          currentBookings.forEach((booking: any) => {
            if (booking.tenantName || booking.customerName) {
              realUserActivities.push({
                id: `book-${booking._id || booking.receiptId}`,
                userName: booking.tenantName || booking.customerName,
                userEmail: booking.tenantEmail || booking.customerEmail || '',
                action: 'Booked property',
                targetName: booking.propertyTitle || '',
                timestamp: booking.createdAt || booking.bookingDate || new Date().toISOString(),
                ipAddress: '',
                details: `Booked ${booking.propertyTitle || 'property'}`
              })
              
              // Add cancelled booking activity if status is cancelled
              if (booking.status === 'cancelled') {
                const cancelDate = booking.updatedAt || booking.createdAt || booking.bookingDate
                realUserActivities.push({
                  id: `cancel-${booking._id || booking.receiptId}`,
                  userName: booking.tenantName || booking.customerName,
                  userEmail: booking.tenantEmail || booking.customerEmail || '',
                  action: 'Cancelled booking',
                  targetName: booking.propertyTitle || '',
                  timestamp: cancelDate,
                  ipAddress: '',
                  details: `Cancelled booking for ${booking.propertyTitle || 'property'}`
                })
              }
            }
          })
          
          console.log('Total activities created:', realUserActivities.length)
          
          // Sort by timestamp (most recent first)
          realUserActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          
          setUserActivity(realUserActivities)
        }
      } else if (activeTab === 'owner-activity') {
        try {
          const res = await fetch(`${baseURL}/owner-activity?limit=100`)
          const data = await res.json()
          if (data.success && data.activities) {
            setOwnerActivity(data.activities)
          } else {
            // Generate mock owner activity data
            const mockOwnerActivity = safeProperties.slice(0, 20).map((prop: any, idx: number) => ({
              id: `owner-${idx}`,
              ownerName: prop.ownerName || 'Property Owner',
              action: ['Added property', 'Edited property', 'Approved booking', 'Rejected booking'][idx % 4],
              propertyName: prop.title,
              propertyId: prop.id || prop._id,
              timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
              details: `Owner ${prop.ownerName || 'Unknown'} performed action on ${prop.title}`
            }))
            setOwnerActivity(mockOwnerActivity)
          }
        } catch (err) {
          console.log('No owner activity data, using mock data')
          // Generate mock owner activity data
          const mockOwnerActivity = safeProperties.slice(0, 20).map((prop: any, idx: number) => ({
            id: `owner-${idx}`,
            ownerName: prop.ownerName || 'Property Owner',
            action: ['Added property', 'Edited property', 'Approved booking', 'Rejected booking'][idx % 4],
            propertyName: prop.title,
            propertyId: prop.id || prop._id,
            timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
            details: `Owner ${prop.ownerName || 'Unknown'} performed action on ${prop.title}`
          }))
          setOwnerActivity(mockOwnerActivity)
        }
      } else if (activeTab === 'property-history') {
        try {
          const res = await fetch(`${baseURL}/property-history?limit=100`)
          const data = await res.json()
          if (data.success && data.history) {
            setPropertyHistory(data.history)
          } else {
            // Generate mock property history data
            const mockPropertyHistory = safeProperties.slice(0, 25).map((prop: any, idx: number) => ({
              id: `prop-hist-${idx}`,
              propertyName: prop.title,
              propertyId: prop.id || prop._id,
              ownerName: prop.ownerName || 'Property Owner',
              action: ['Added', 'Updated', 'Price changed', 'Availability changed'][idx % 4],
              oldPrice: idx % 4 === 2 ? prop.rent - 5000 : null,
              newPrice: idx % 4 === 2 ? prop.rent : null,
              availability: idx % 4 === 3 ? 'Available' : prop.availability || 'Available',
              timestamp: new Date(Date.now() - Math.random() * 45 * 24 * 60 * 60 * 1000).toISOString(),
              createdAt: new Date(Date.now() - Math.random() * 45 * 24 * 60 * 60 * 1000).toISOString(),
              details: `Property ${prop.title} was ${['added to the system', 'updated', 'price changed', 'availability changed'][idx % 4]}`
            }))
            setPropertyHistory(mockPropertyHistory)
          }
        } catch (err) {
          console.log('No property history data, using mock data')
          // Generate mock property history data
          const mockPropertyHistory = safeProperties.slice(0, 25).map((prop: any, idx: number) => ({
            id: `prop-hist-${idx}`,
            propertyName: prop.title,
            propertyId: prop.id || prop._id,
            ownerName: prop.ownerName || 'Property Owner',
            action: ['Added', 'Updated', 'Price changed', 'Availability changed'][idx % 4],
            oldPrice: idx % 4 === 2 ? prop.rent - 5000 : null,
            newPrice: idx % 4 === 2 ? prop.rent : null,
            availability: idx % 4 === 3 ? 'Available' : prop.availability || 'Available',
            timestamp: new Date(Date.now() - Math.random() * 45 * 24 * 60 * 60 * 1000).toISOString(),
            createdAt: new Date(Date.now() - Math.random() * 45 * 24 * 60 * 60 * 1000).toISOString(),
            details: `Property ${prop.title} was ${['added to the system', 'updated', 'price changed', 'availability changed'][idx % 4]}`
          }))
          setPropertyHistory(mockPropertyHistory)
        }
      } else if (activeTab === 'admin-logs') {
        try {
          const res = await fetch(`${baseURL}/admin-logs?limit=100`)
          const data = await res.json()
          if (data.success && data.logs) {
            setAdminLogs(data.logs)
          } else {
            setAdminLogs([])
          }
        } catch (err) {
          console.log('No admin logs')
          setAdminLogs([])
        }
      } else if (activeTab === 'timeline') {
        try {
          const res = await fetch(`${baseURL}/timeline?limit=50`)
          const data = await res.json()
          if (data.success && data.timeline) {
            setTimeline(data.timeline)
          } else {
            setTimeline([])
          }
        } catch (err) {
          console.log('No timeline data')
          setTimeline([])
        }
      } else if (activeTab === 'suspicious') {
        try {
          const res = await fetch(`${baseURL}/suspicious?limit=20`)
          const data = await res.json()
          if (data.success && data.alerts) {
            setSuspiciousAlerts(data.alerts)
          } else {
            setSuspiciousAlerts([])
          }
        } catch (err) {
          console.log('No suspicious alerts')
          setSuspiciousAlerts([])
        }
      }
    } catch (error) {
      console.error('Error fetching history:', error)
      // Don't show error toast, just use local data
    } finally {
      setLoading(false)
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // FILTER FUNCTIONS
  // ═══════════════════════════════════════════════════════════════════════════

  const filterByDate = (date: string | Date) => {
    if (filterDate === 'all') return true
    const d = new Date(date)
    const now = new Date()
    
    if (filterDate === 'today') {
      return d.toDateString() === now.toDateString()
    } else if (filterDate === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      return d >= weekAgo
    } else if (filterDate === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      return d >= monthAgo
    }
    return true
  }

  const filterByStatus = (status: string) => {
    if (filterStatus === 'all') return true
    return status.toLowerCase() === filterStatus.toLowerCase()
  }

  const filterBySearch = (item: any, fields: string[]) => {
    if (!search) return true
    const searchLower = search.toLowerCase()
    return fields.some(field => {
      const value = item[field]
      return value && String(value).toLowerCase().includes(searchLower)
    })
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // TAB CONFIGURATION
  // ═══════════════════════════════════════════════════════════════════════════

  const tabs = [
    { id: 'bookings', label: 'Booking History', icon: CalendarIcon, color: 'blue' },
    { id: 'payments', label: 'Payment History', icon: DollarSignIcon, color: 'green' },
    { id: 'user-activity', label: 'User Activity', icon: UsersIcon, color: 'purple' },
    { id: 'owner-activity', label: 'Owner Activity', icon: UserCheckIcon, color: 'indigo' },
    { id: 'property-history', label: 'Property History', icon: BuildingIcon, color: 'amber' },
    { id: 'reviews', label: 'Review & Complaints', icon: StarIcon, color: 'pink' },
    { id: 'suspicious', label: 'Suspicious Activity', icon: FlagIcon, color: 'orange' },
  ]

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Error State */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 text-center">
          <AlertTriangleIcon className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-red-900 mb-2">Error Loading History</h3>
          <p className="text-sm text-red-700 mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null)
              fetchHistoryData()
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
      
      {!error && (
        <>
      {/* Header with Stats */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-5">
        <h2 className="text-lg font-bold mb-3 text-gray-900">History & Analytics Dashboard</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-3">
            <p className="text-[10px] text-gray-600 mb-1">Total Bookings</p>
            <p className="text-lg font-black text-gray-900">{stats.totalBookings || safeBookings.length}</p>
          </div>
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-3">
            <p className="text-[10px] text-gray-600 mb-1">Total Revenue</p>
            <p className="text-lg font-black text-gray-900">NPR {(stats.totalRevenue || safeTotalIncome).toLocaleString()}</p>
          </div>
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-3">
            <p className="text-[10px] text-gray-600 mb-1">Confirmed</p>
            <p className="text-lg font-black text-gray-900">{stats.confirmedBookings || 0}</p>
          </div>
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-3">
            <p className="text-[10px] text-gray-600 mb-1">Success Rate</p>
            <p className="text-lg font-black text-gray-900">
              {stats.totalPayments > 0 
                ? Math.round((stats.successfulPayments / stats.totalPayments) * 100) 
                : 0}%
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] bg-white border-2 border-gray-200 rounded-xl px-4 py-2.5">
          <SearchIcon className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search history..."
            className="flex-1 text-sm outline-none bg-transparent"
          />
        </div>
        
        <select
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="bg-white border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold outline-none cursor-pointer"
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
        
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-white border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold outline-none cursor-pointer"
        >
          <option value="all">All Status</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
          <option value="success">Success</option>
          <option value="failed">Failed</option>
        </select>
        
        <button
          onClick={() => {
            const dataMap: Record<string, any> = {
              'bookings': bookingHistory,
              'payments': paymentHistory,
              'user-activity': userActivity,
              'owner-activity': ownerActivity,
              'property-history': propertyHistory,
              'reviews': reviewHistory,
            }
            const titleMap: Record<string, string> = {
              'bookings': 'Booking History',
              'payments': 'Payment History',
              'user-activity': 'User Activity History',
              'owner-activity': 'Owner Activity History',
              'property-history': 'Property History',
              'reviews': 'Review & Complaints History',
            }
            const data = dataMap[activeTab] || []
            const title = titleMap[activeTab] || 'History'
            exportToCSV(data, activeTab)
          }}
          className="flex items-center gap-2 bg-button-primary text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-button-primary/90 transition-colors"
        >
          <DownloadIcon className="w-4 h-4" />
          Export CSV
        </button>
        
        <button
          onClick={() => {
            exportComprehensivePDF(
              bookingHistory,
              paymentHistory,
              userActivity,
              ownerActivity,
              propertyHistory,
              reviewHistory,
              suspiciousAlerts
            )
          }}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-red-700 transition-colors"
        >
          <FileTextIcon className="w-4 h-4" />
          Export Report
        </button>
        
        <button
          onClick={fetchHistoryData}
          className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors"
        >
          <RefreshCcwIcon className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {tabs.map(tab => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-button-primary text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border-2 border-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-button-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Tab Content */}
      {!loading && (
        <AnimatePresence mode="wait">
          {activeTab === 'bookings' && (
            <BookingHistoryTab
              bookings={bookingHistory}
              search={search}
              filterStatus={filterStatus}
              filterDate={filterDate}
              filterByDate={filterByDate}
              filterByStatus={filterByStatus}
              filterBySearch={filterBySearch}
              onViewDetails={setDetailBooking}
            />
          )}
          
          {activeTab === 'payments' && (
            <PaymentHistoryTab
              payments={paymentHistory}
              search={search}
              filterStatus={filterStatus}
              filterDate={filterDate}
              filterByDate={filterByDate}
              filterByStatus={filterByStatus}
              filterBySearch={filterBySearch}
              stats={stats}
              onViewDetails={setDetailPayment}
            />
          )}
          
          {activeTab === 'user-activity' && (
            <UserActivityTab
              activities={userActivity}
              search={search}
              filterBySearch={filterBySearch}
            />
          )}
          
          {activeTab === 'owner-activity' && (
            <OwnerActivityTab
              activities={ownerActivity}
              search={search}
              filterBySearch={filterBySearch}
            />
          )}
          
          {activeTab === 'property-history' && (
            <PropertyHistoryTab
              history={propertyHistory}
              search={search}
              filterBySearch={filterBySearch}
            />
          )}
          
          {activeTab === 'reviews' && (
            <ReviewsTab
              reviews={reviewHistory}
              search={search}
              filterBySearch={filterBySearch}
            />
          )}
          
          {activeTab === 'timeline' && (
            <TimelineTab
              timeline={timeline}
            />
          )}
          
          {activeTab === 'suspicious' && (
            <SuspiciousActivityTab
              alerts={suspiciousAlerts}
            />
          )}
        </AnimatePresence>
      )}

      {/* Detail Modals */}
      <AnimatePresence>
        {detailBooking && (
          <BookingDetailModal
            booking={detailBooking}
            onClose={() => setDetailBooking(null)}
          />
        )}
        
        {detailPayment && (
          <PaymentDetailModal
            payment={detailPayment}
            onClose={() => setDetailPayment(null)}
          />
        )}
      </AnimatePresence>
        </>
      )}
    </motion.div>
  )
}


// ═══════════════════════════════════════════════════════════════════════════
// BOOKING HISTORY TAB
// ═══════════════════════════════════════════════════════════════════════════

function BookingHistoryTab({ bookings, search, filterStatus, filterDate, filterByDate, filterByStatus, filterBySearch, onViewDetails }: any) {
  const filtered = bookings.filter((b: any) => 
    filterByDate(b.bookingDate || b.createdAt) &&
    filterByStatus(b.status) &&
    filterBySearch(b, ['tenantName', 'ownerName', 'propertyTitle', 'receiptId'])
  )

  return (
    <motion.div
      key="bookings"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-black text-gray-900">
          Booking History ({filtered.length} records)
        </h3>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
          <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-semibold">No bookings found</p>
          <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b-2 border-gray-100">
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Receipt ID</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Property</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Tenant</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Owner</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Booking Date</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Check-in</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Check-out</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Payment</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((booking: any, i: number) => (
                  <motion.tr
                    key={booking._id || booking.id || i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-button-primary font-bold">
                      {booking.receiptId}
                    </td>
                    <td className="px-4 py-3 text-gray-900 font-medium max-w-[200px] truncate">
                      {booking.propertyTitle}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {booking.tenantName || booking.customerName}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {booking.ownerName || '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {formatDate(booking.bookingDate || booking.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {booking.checkInDate ? formatDate(booking.checkInDate) : '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {booking.checkOutDate ? formatDate(booking.checkOutDate) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-gray-700">
                          {booking.paymentMethod}
                        </span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full w-fit ${
                          booking.paymentType === 'full' ? 'bg-green-100 text-green-700' :
                          booking.paymentType === 'advance' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {booking.paymentType}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-bold text-gray-900">
                      NPR {(booking.amount || booking.rent || 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={booking.status} />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => onViewDetails(booking)}
                        className="flex items-center gap-1 text-xs font-bold text-button-primary hover:underline"
                      >
                        <EyeIcon className="w-3.5 h-3.5" />
                        View
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total', value: filtered.length, color: 'bg-blue-100', textColor: 'text-gray-800' },
          { label: 'Confirmed', value: filtered.filter((b: any) => b.status === 'confirmed').length, color: 'bg-green-100', textColor: 'text-gray-800' },
          { label: 'Pending', value: filtered.filter((b: any) => b.status === 'pending').length, color: 'bg-yellow-100', textColor: 'text-gray-800' },
          { label: 'Rejected', value: filtered.filter((b: any) => b.status === 'rejected').length, color: 'bg-pink-100', textColor: 'text-gray-800' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className={`${stat.color} rounded-xl p-3 text-center`}
          >
            <p className={`text-lg font-black ${stat.textColor}`}>{stat.value}</p>
            <p className={`text-[10px] font-semibold text-gray-600 mt-0.5`}>{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// PAYMENT HISTORY TAB
// ═══════════════════════════════════════════════════════════════════════════

function PaymentHistoryTab({ payments, search, filterStatus, filterDate, filterByDate, filterByStatus, filterBySearch, stats, onViewDetails }: any) {
  const filtered = payments.filter((p: any) => 
    filterByDate(p.paymentDate || p.createdAt) &&
    filterByStatus(p.status) &&
    filterBySearch(p, ['tenantName', 'propertyTitle', 'transactionId', 'receiptId'])
  )

  const totalRevenue = filtered
    .filter((p: any) => p.status === 'success')
    .reduce((sum: number, p: any) => sum + (p.amount || 0), 0)

  return (
    <motion.div
      key="payments"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      {/* Revenue Summary */}
      <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 text-center">
        <p className="text-sm font-semibold text-gray-600 mb-2">Total Revenue</p>
        <p className="text-4xl font-black text-gray-900">NPR {totalRevenue.toLocaleString()}</p>
        <p className="text-xs text-gray-500 mt-2">
          {filtered.filter((p: any) => p.status === 'success').length} successful transactions
        </p>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-black text-gray-900">
          Payment History ({filtered.length} records)
        </h3>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
          <DollarSignIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-semibold">No payments found</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b-2 border-gray-100">
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Transaction ID</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Tenant</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Property</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Method</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((payment: any, i: number) => (
                  <motion.tr
                    key={payment._id || payment.transactionId || i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-button-primary font-bold">
                      {payment.transactionId}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {payment.tenantName}
                    </td>
                    <td className="px-4 py-3 text-gray-900 font-medium max-w-[200px]">
                      <div className="flex items-center gap-2">
                        <span className="truncate">{payment.propertyTitle}</span>
                        {payment.isSubscription && (
                          <span className="flex-shrink-0 text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 flex items-center gap-1">
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                            </svg>
                            Video
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-bold text-gray-900">
                      NPR {(payment.amount || 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        payment.paymentType === 'subscription' ? 'bg-amber-100 text-amber-700' :
                        payment.paymentType === 'full' ? 'bg-green-100 text-green-700' :
                        payment.paymentType === 'advance' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {payment.paymentType === 'subscription' ? 'Subscription' : payment.paymentType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700 text-xs font-semibold">
                      {payment.paymentMethod}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={payment.status} />
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {formatDateTime(payment.paymentDate || payment.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => onViewDetails(payment)}
                        className="flex items-center gap-1 text-xs font-bold text-button-primary hover:underline"
                      >
                        <EyeIcon className="w-3.5 h-3.5" />
                        View
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total', value: filtered.length, color: 'bg-blue-100', textColor: 'text-gray-800' },
          { label: 'Success', value: filtered.filter((p: any) => p.status === 'success').length, color: 'bg-green-100', textColor: 'text-gray-800' },
          { label: 'Failed', value: filtered.filter((p: any) => p.status === 'failed').length, color: 'bg-pink-100', textColor: 'text-gray-800' },
          { label: 'Refunded', value: filtered.filter((p: any) => p.status === 'refunded').length, color: 'bg-purple-100', textColor: 'text-gray-800' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className={`${stat.color} rounded-xl p-3 text-center`}
          >
            <p className={`text-lg font-black ${stat.textColor}`}>{stat.value}</p>
            <p className={`text-[10px] font-semibold text-gray-600 mt-0.5`}>{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// USER ACTIVITY TAB
// ═══════════════════════════════════════════════════════════════════════════

function UserActivityTab({ activities, search, filterBySearch }: any) {
  const filtered = activities.filter((a: any) => 
    filterBySearch(a, ['userName', 'userEmail', 'action', 'details'])
  )

  const getActionColor = (action: string) => {
    const actionLower = action.toLowerCase()
    if (actionLower.includes('login')) return 'bg-blue-100 text-blue-700'
    if (actionLower.includes('register')) return 'bg-purple-100 text-purple-700'
    if (actionLower.includes('book') && !actionLower.includes('cancel')) return 'bg-emerald-100 text-emerald-700'
    if (actionLower.includes('cancel')) return 'bg-red-100 text-red-700'
    if (actionLower.includes('update') || actionLower.includes('profile')) return 'bg-amber-100 text-amber-700'
    return 'bg-gray-100 text-gray-700'
  }

  return (
    <motion.div
      key="user-activity"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-black text-gray-900">
          User Activity History ({filtered.length} records)
        </h3>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
          <UsersIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-semibold">No user activities found</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b-2 border-gray-100">
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">User Name</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Action</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Details</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((activity: any, i: number) => (
                  <motion.tr
                    key={activity.id || i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">{activity.userName}</span>
                        <span className="text-xs text-gray-500">{activity.userEmail}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${getActionColor(activity.action)}`}>
                        {activity.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700 max-w-xs">
                      <div className="truncate">
                        {activity.targetName ? (
                          <span className="font-medium">{activity.targetName}</span>
                        ) : (
                          <span className="text-gray-500 text-xs">{activity.details || '—'}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs whitespace-nowrap">
                      {formatDateTime(activity.timestamp || activity.createdAt)}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Activity Summary */}
      <div className="grid grid-cols-5 gap-4">
        {[
          { label: 'Registered', count: filtered.filter((a: any) => a.action.toLowerCase().includes('register')).length, color: 'bg-gradient-to-br from-purple-50 to-purple-100', textColor: 'text-purple-700' },
          { label: 'Logged In', count: filtered.filter((a: any) => a.action.toLowerCase().includes('login')).length, color: 'bg-gradient-to-br from-blue-50 to-blue-100', textColor: 'text-blue-700' },
          { label: 'Booked', count: filtered.filter((a: any) => a.action.toLowerCase().includes('book') && !a.action.toLowerCase().includes('cancel')).length, color: 'bg-gradient-to-br from-emerald-50 to-emerald-100', textColor: 'text-emerald-700' },
          { label: 'Cancelled', count: filtered.filter((a: any) => a.action.toLowerCase().includes('cancel')).length, color: 'bg-gradient-to-br from-red-50 to-red-100', textColor: 'text-red-700' },
          { label: 'Updated', count: filtered.filter((a: any) => a.action.toLowerCase().includes('update') || a.action.toLowerCase().includes('profile')).length, color: 'bg-gradient-to-br from-amber-50 to-amber-100', textColor: 'text-amber-700' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className={`${stat.color} rounded-xl p-4 text-center`}
          >
            <p className={`text-2xl font-black ${stat.textColor}`}>{stat.count}</p>
            <p className={`text-xs font-semibold ${stat.textColor} mt-1`}>{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// ADMIN LOGS TAB
// ═══════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════
// OWNER ACTIVITY TAB
// ═══════════════════════════════════════════════════════════════════════════

function OwnerActivityTab({ activities, search, filterBySearch }: any) {
  const filtered = activities.filter((a: any) => 
    filterBySearch(a, ['ownerName', 'action', 'propertyName'])
  )

  return (
    <motion.div
      key="owner-activity"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      <h3 className="text-lg font-black text-gray-900">
        Owner Activity History ({filtered.length} activities)
      </h3>

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
          <UserCheckIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-semibold">No owner activities found</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b-2 border-gray-100">
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Owner Name</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Action</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Property Name</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((activity: any, i: number) => (
                  <motion.tr
                    key={activity._id || i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">{activity.ownerName || activity.userName}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        activity.action.toLowerCase().includes('add') ? 'bg-green-100 text-green-700' :
                        activity.action.toLowerCase().includes('reject') ? 'bg-red-100 text-red-700' :
                        activity.action.toLowerCase().includes('edit') || activity.action.toLowerCase().includes('update') ? 'bg-yellow-100 text-yellow-700' :
                        activity.action.toLowerCase().includes('approve') ? 'bg-emerald-100 text-emerald-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {activity.action.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{activity.propertyName || activity.targetName || '—'}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{formatDateTime(activity.createdAt)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// PROPERTY HISTORY TAB
// ═══════════════════════════════════════════════════════════════════════════

function PropertyHistoryTab({ history, search, filterBySearch }: any) {
  const filtered = history.filter((h: any) => 
    filterBySearch(h, ['propertyName', 'ownerName', 'action'])
  )

  return (
    <motion.div
      key="property-history"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      <h3 className="text-lg font-black text-gray-900">
        Property History ({filtered.length} records)
      </h3>

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
          <BuildingIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-semibold">No property history found</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b-2 border-gray-100">
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Property Name</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Owner Name</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Action</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Price Changes</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Availability</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item: any, i: number) => (
                  <motion.tr
                    key={item._id || i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">{item.propertyName || item.title}</td>
                    <td className="px-4 py-3 text-gray-700">{item.ownerName}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        item.action === 'Added' ? 'bg-green-100 text-green-700' :
                        item.action === 'Updated' || item.action === 'Edited' ? 'bg-yellow-100 text-yellow-700' :
                        item.action === 'Price changed' ? 'bg-orange-100 text-orange-700' :
                        item.action === 'Availability changed' ? 'bg-orange-100 text-orange-700' :
                        item.action === 'Rejected' ? 'bg-red-100 text-red-700' :
                        item.action === 'Removed' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {item.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700 text-xs">
                      {item.oldPrice && item.newPrice ? (
                        <span className="font-semibold text-orange-600">NPR {item.oldPrice.toLocaleString()} → NPR {item.newPrice.toLocaleString()}</span>
                      ) : '—'}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {item.availability ? (
                        <span className={`font-semibold ${item.availability === 'Available' ? 'text-green-600' : 'text-orange-600'}`}>
                          {item.availability}
                        </span>
                      ) : '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(item.date || item.createdAt)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// REVIEWS & COMPLAINTS TAB
// ═══════════════════════════════════════════════════════════════════════════

function ReviewsTab({ reviews, search, filterBySearch }: any) {
  const filtered = reviews.filter((r: any) => 
    filterBySearch(r, ['userName', 'propertyName', 'reviewText', 'complaintType'])
  )

  return (
    <motion.div
      key="reviews"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      <h3 className="text-lg font-black text-gray-900">
        Review & Complaints History ({filtered.length} records)
      </h3>

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
          <StarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-semibold">No reviews found</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b-2 border-gray-100">
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">User Name</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Property</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Rating</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Review Text</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Flagged</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Complaint Type</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Admin Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((review: any, i: number) => (
                  <motion.tr
                    key={review._id || i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">{review.userName || review.name}</td>
                    <td className="px-4 py-3 text-gray-700">{review.propertyName || review.propertyTitle}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, idx) => (
                          <StarIcon
                            key={idx}
                            className={`w-4 h-4 ${idx < (review.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                        <span className="ml-1 text-xs font-bold text-gray-700">{review.rating}/5</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-700 max-w-xs truncate">{review.reviewText || review.comment}</td>
                    <td className="px-4 py-3">
                      {review.flagged || review.isFlagged ? (
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">Yes</span>
                      ) : (
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">No</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-700 text-xs">{review.complaintType || '—'}</td>
                    <td className="px-4 py-3 text-gray-700 text-xs">{review.adminAction || 'None'}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  )
}


// ═══════════════════════════════════════════════════════════════════════════
// TIMELINE TAB
// ═══════════════════════════════════════════════════════════════════════════

function TimelineTab({ timeline }: any) {
  const getTimelineIcon = (type: string) => {
    switch (type) {
      case 'booking': return <CalendarIcon className="w-5 h-5" />
      case 'payment': return <DollarSignIcon className="w-5 h-5" />
      case 'activity': return <UsersIcon className="w-5 h-5" />
      case 'admin': return <ShieldAlertIcon className="w-5 h-5" />
      default: return <ActivityIcon className="w-5 h-5" />
    }
  }

  const getTimelineColor = (color: string) => {
    const colors: Record<string, string> = {
      green: 'bg-green-500',
      red: 'bg-red-500',
      blue: 'bg-blue-500',
      amber: 'bg-amber-500',
      purple: 'bg-purple-500',
      gray: 'bg-gray-500',
    }
    return colors[color] || 'bg-gray-500'
  }

  return (
    <motion.div
      key="timeline"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-black text-gray-900">
          Activity Timeline ({filtered.length} activities)
        </h3>
      </div>

      {timeline.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
          <ActivityIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-semibold">No timeline events found</p>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-purple-200 to-pink-200" />

          {/* Timeline Events */}
          <div className="space-y-6">
            {timeline.map((event: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="relative pl-20"
              >
                {/* Timeline Dot */}
                <div className={`absolute left-5 top-2 w-6 h-6 ${getTimelineColor(event.color)} rounded-full flex items-center justify-center text-white shadow-lg`}>
                  {getTimelineIcon(event.type)}
                </div>

                {/* Event Card */}
                <div className="bg-white rounded-xl p-4 border-2 border-gray-100 hover:border-gray-200 transition-all hover:shadow-md">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 mb-1">{event.message}</p>
                      <p className="text-sm text-gray-600">{event.subtitle}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 font-semibold">{getTimeAgo(event.timestamp)}</p>
                      <p className="text-xs text-gray-400 mt-1">{formatDateTime(event.timestamp)}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// SUSPICIOUS ACTIVITY TAB
// ═══════════════════════════════════════════════════════════════════════════

function SuspiciousActivityTab({ alerts }: any) {
  const getSeverityColor = (severity: string) => {
    if (severity === 'high') return 'bg-red-50 border-red-200 text-red-900'
    if (severity === 'medium') return 'bg-amber-50 border-amber-200 text-amber-900'
    return 'bg-blue-50 border-blue-200 text-blue-900'
  }

  const getSeverityBadge = (severity: string) => {
    if (severity === 'high') return 'bg-red-100 text-red-700'
    if (severity === 'medium') return 'bg-amber-100 text-amber-700'
    return 'bg-blue-100 text-blue-700'
  }

  return (
    <motion.div
      key="suspicious"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-black text-gray-900">
          Suspicious Activity Alerts ({filtered.length} alerts)
        </h3>
      </div>

      {alerts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
          <CheckCircleIcon className="w-16 h-16 text-green-300 mx-auto mb-4" />
          <p className="text-gray-500 font-semibold">No suspicious activity detected</p>
          <p className="text-sm text-gray-400 mt-1">All systems operating normally</p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`${getSeverityColor(alert.severity)} rounded-xl p-5 border-2`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {alert.severity === 'high' ? (
                    <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white text-2xl">
                      ⚠️
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-white text-2xl">
                      ⚡
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${getSeverityBadge(alert.severity)}`}>
                      {alert.severity} Priority
                    </span>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/50">
                      {alert.type.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="font-bold text-lg mb-2">{alert.message}</p>
                  <p className="text-sm opacity-80">{getTimeAgo(alert.timestamp)}</p>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4">
                    <button className="px-4 py-2 bg-white text-gray-900 rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors">
                      Investigate
                    </button>
                    <button className="px-4 py-2 bg-white/20 text-current rounded-lg text-xs font-bold hover:bg-white/30 transition-colors">
                      Mark as Resolved
                    </button>
                    <button className="px-4 py-2 bg-white/20 text-current rounded-lg text-xs font-bold hover:bg-white/30 transition-colors">
                      False Positive
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Detection Categories */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        {[
          { label: 'Failed Payments', count: alerts.filter((a: any) => a.type === 'failed_payments').length, color: 'from-red-500 to-red-600' },
          { label: 'Spam Bookings', count: alerts.filter((a: any) => a.type === 'spam_bookings').length, color: 'from-orange-500 to-orange-600' },
          { label: 'Suspicious Users', count: alerts.filter((a: any) => a.type === 'suspicious_activity').length, color: 'from-amber-500 to-amber-600' },
        ].map((cat, i) => (
          <motion.div
            key={cat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`bg-gradient-to-br ${cat.color} rounded-xl p-4 text-white text-center`}
          >
            <p className="text-2xl font-black">{cat.count}</p>
            <p className="text-xs font-semibold text-white/80 mt-1">{cat.label}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// BOOKING DETAIL MODAL
// ═══════════════════════════════════════════════════════════════════════════

function BookingDetailModal({ booking, onClose }: any) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b-2 border-gray-100 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h3 className="text-xl font-black text-gray-900">Booking Details</h3>
            <p className="text-sm text-gray-500 font-mono">{booking.receiptId}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XIcon className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Badge */}
          <div className="flex items-center justify-center">
            <StatusBadge status={booking.status} />
          </div>

          {/* Property Info */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-5">
            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <BuildingIcon className="w-5 h-5 text-blue-600" />
              Property Information
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Property:</span>
                <span className="font-bold text-gray-900">{booking.propertyTitle}</span>
              </div>
              {booking.propertyLocation && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-semibold text-gray-900">{booking.propertyLocation}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Rent:</span>
                <span className="font-bold text-gray-900">NPR {(booking.rent || 0).toLocaleString()}/month</span>
              </div>
            </div>
          </div>

          {/* Tenant & Owner Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-xl p-4">
              <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <UsersIcon className="w-4 h-4 text-green-600" />
                Tenant
              </h4>
              <div className="space-y-2 text-sm">
                <p className="font-bold text-gray-900">{booking.tenantName || booking.customerName}</p>
                <p className="text-gray-600 flex items-center gap-1">
                  <MailIcon className="w-3 h-3" />
                  {booking.tenantEmail || booking.customerEmail}
                </p>
                <p className="text-gray-600 flex items-center gap-1">
                  <PhoneIcon className="w-3 h-3" />
                  {booking.tenantPhone || booking.customerPhone}
                </p>
              </div>
            </div>

            <div className="bg-purple-50 rounded-xl p-4">
              <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <UserCheckIcon className="w-4 h-4 text-purple-600" />
                Owner
              </h4>
              <div className="space-y-2 text-sm">
                <p className="font-bold text-gray-900">{booking.ownerName || '—'}</p>
                {booking.ownerEmail && (
                  <p className="text-gray-600 flex items-center gap-1">
                    <MailIcon className="w-3 h-3" />
                    {booking.ownerEmail}
                  </p>
                )}
                {booking.ownerPhone && (
                  <p className="text-gray-600 flex items-center gap-1">
                    <PhoneIcon className="w-3 h-3" />
                    {booking.ownerPhone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Booking Dates */}
          <div className="bg-amber-50 rounded-xl p-5">
            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-amber-600" />
              Booking Timeline
            </h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-600 mb-1">Booking Date</p>
                <p className="font-bold text-gray-900">{formatDate(booking.bookingDate || booking.createdAt)}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Check-in</p>
                <p className="font-bold text-gray-900">
                  {booking.checkInDate ? formatDate(booking.checkInDate) : '—'}
                </p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Check-out</p>
                <p className="font-bold text-gray-900">
                  {booking.checkOutDate ? formatDate(booking.checkOutDate) : '—'}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-green-50 rounded-xl p-5">
            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <DollarSignIcon className="w-5 h-5 text-green-600" />
              Payment Details
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Amount Paid:</span>
                <span className="text-2xl font-black text-green-600">
                  NPR {(booking.amount || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-bold text-gray-900">{booking.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Type:</span>
                <span className={`font-bold px-2 py-0.5 rounded-full text-xs ${
                  booking.paymentType === 'full' ? 'bg-green-100 text-green-700' :
                  booking.paymentType === 'advance' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {booking.paymentType}
                </span>
              </div>
              {booking.transactionId && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-mono text-xs text-gray-900">{booking.transactionId}</span>
                </div>
              )}
            </div>
          </div>

          {/* Rejection/Cancellation Reason */}
          {(booking.rejectionReason || booking.cancellationReason) && (
            <div className="bg-red-50 rounded-xl p-5 border-2 border-red-200">
              <h4 className="font-bold text-red-900 mb-2 flex items-center gap-2">
                <AlertTriangleIcon className="w-5 h-5" />
                {booking.status === 'rejected' ? 'Rejection Reason' : 'Cancellation Reason'}
              </h4>
              <p className="text-sm text-red-800">
                {booking.rejectionReason || booking.cancellationReason}
              </p>
            </div>
          )}

          {/* Special Requests */}
          {booking.specialRequests && (
            <div className="bg-blue-50 rounded-xl p-5">
              <h4 className="font-bold text-gray-900 mb-2">Special Requests</h4>
              <p className="text-sm text-gray-700">{booking.specialRequests}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t-2 border-gray-100 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full py-3 bg-button-primary text-white font-bold rounded-xl hover:bg-button-primary/90 transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// PAYMENT DETAIL MODAL
// ═══════════════════════════════════════════════════════════════════════════

function PaymentDetailModal({ payment, onClose }: any) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b-2 border-gray-100 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h3 className="text-xl font-black text-gray-900">Payment Details</h3>
            <p className="text-sm text-gray-500 font-mono">{payment.transactionId}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XIcon className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status & Amount */}
          <div className="text-center bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6">
            <StatusBadge status={payment.status} />
            <p className="text-4xl font-black mt-4 text-gray-900">NPR {(payment.amount || 0).toLocaleString()}</p>
            <p className="text-sm text-white/80 mt-2">{formatDateTime(payment.paymentDate || payment.createdAt)}</p>
          </div>

          {/* Payment Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-xs text-gray-600 mb-1">Payment Method</p>
              <p className="font-bold text-gray-900">{payment.paymentMethod}</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4">
              <p className="text-xs text-gray-600 mb-1">Payment Type</p>
              <p className="font-bold text-gray-900 capitalize">{payment.paymentType}</p>
            </div>
          </div>

          {/* Tenant Info */}
          <div className="bg-gray-50 rounded-xl p-5">
            <h4 className="font-bold text-gray-900 mb-3">Tenant Information</h4>
            <div className="space-y-2 text-sm">
              <p className="font-bold text-gray-900">{payment.tenantName}</p>
              <p className="text-gray-600">{payment.tenantEmail}</p>
            </div>
          </div>

          {/* Property Info */}
          <div className="bg-gray-50 rounded-xl p-5">
            <h4 className="font-bold text-gray-900 mb-3">Property Information</h4>
            <div className="space-y-2 text-sm">
              <p className="font-bold text-gray-900">{payment.propertyTitle}</p>
              {payment.ownerName && (
                <p className="text-gray-600">Owner: {payment.ownerName}</p>
              )}
            </div>
          </div>

          {/* Transaction Details */}
          <div className="bg-gray-50 rounded-xl p-5">
            <h4 className="font-bold text-gray-900 mb-3">Transaction Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Transaction ID:</span>
                <span className="font-mono text-xs text-gray-900">{payment.transactionId}</span>
              </div>
              {payment.receiptId && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Receipt ID:</span>
                  <span className="font-mono text-xs text-gray-900">{payment.receiptId}</span>
                </div>
              )}
              {payment.bookingId && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Booking ID:</span>
                  <span className="font-mono text-xs text-gray-900">{payment.bookingId}</span>
                </div>
              )}
            </div>
          </div>

          {/* Failure/Refund Reason */}
          {(payment.failureReason || payment.refundReason) && (
            <div className="bg-red-50 rounded-xl p-5 border-2 border-red-200">
              <h4 className="font-bold text-red-900 mb-2">
                {payment.status === 'failed' ? 'Failure Reason' : 'Refund Reason'}
              </h4>
              <p className="text-sm text-red-800">
                {payment.failureReason || payment.refundReason}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t-2 border-gray-100 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full py-3 bg-button-primary text-white font-bold rounded-xl hover:bg-button-primary/90 transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  )
}
