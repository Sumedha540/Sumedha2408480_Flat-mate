import re

path = r'c:\Users\sumed\Downloads\Flat-Mate Rental Management System\Frontend\src\pages\OwnerDashboard.tsx'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Import chatStorage
content = content.replace(
    "import { toast } from 'sonner'",
    "import { toast } from 'sonner'\nimport { getChats, getOrCreateChat, sendMessage, markChatAsSeen, Chat } from '../utils/chatStorage'"
)

# 2. Add SettingsIcon to imports (already there but ensure we have everything)
# We already have SettingsIcon imported at line 6.

# 3. Replace MessengerPanel
messenger_regex = re.compile(r'// ─── Messenger Component ───────────────────────────────────────────────────────\nfunction MessengerPanel\(\) \{.*?\n\}\n', re.DOTALL)
new_messenger = """// ─── Messenger Component ───────────────────────────────────────────────────────
function MessengerPanel({ activeConvId }: { activeConvId?: string }) {
  const { user } = useAuth()
  const [convs, setConvs] = useState<Chat[]>([])
  const [active, setActive] = useState<Chat | null>(null)
  const [input, setInput] = useState('')
  const [search, setSearch] = useState('')
  const [showInfo, setShowInfo] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [active?.messages])

  useEffect(() => {
    const fetchChats = () => {
      if (!user) return
      const allChats = getChats()
      const myChats = allChats.filter(c => c.ownerName === user.name)
      myChats.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
      setConvs(myChats)
      setActive(prev => {
        if (!prev) return null;
        return myChats.find(c => c.id === prev.id) || prev
      })
    }
    fetchChats()
    const int = setInterval(fetchChats, 2000)
    return () => clearInterval(int)
  }, [user])

  useEffect(() => {
    if (activeConvId && convs.length > 0) {
      const found = convs.find(c => c.id === activeConvId)
      if (found) setActive(found)
    }
  }, [activeConvId, convs.length])

  useEffect(() => {
    if (active && user) {
      if (markChatAsSeen(active.id, user.role)) {
        const allChats = getChats()
        const myChats = allChats.filter(c => c.ownerName === user.name)
        setConvs(myChats)
        setActive(myChats.find(c => c.id === active.id) || active)
      }
    }
  }, [active?.id, active?.messages?.length, user])

  const send = () => {
    if (!input.trim() || !active || !user) return
    const txt = input
    setInput('')
    sendMessage(active.id, { text: txt, senderName: user.name, senderRole: 'owner' })
    const all = getChats()
    const updated = all.find(c => c.id === active.id)
    if (updated) setActive(updated)
  }

  const uploadFile = (type: 'image' | 'video' | 'audio') => {
    if (!active || !user) return
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = type === 'image' ? 'image/*' : type === 'video' ? 'video/*' : 'audio/*'
    input.onchange = (e: any) => {
      const file = e.target.files?.[0]
      if (!file) return
      const url = URL.createObjectURL(file)
      sendMessage(active.id, { [type]: url, senderName: user.name, senderRole: 'owner' })
      toast.success(`${type} sent!`)
      const updated = getChats().find(c => c.id === active.id)
      if (updated) setActive(updated)
    }
    input.click()
  }

  const filtered = convs.filter(c => c.tenantName.toLowerCase().includes(search.toLowerCase()) || (c.propertyTitle && c.propertyTitle.toLowerCase().includes(search.toLowerCase())))
  const fmtTime = (d: string) => new Date(d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="flex h-[600px] bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className={`w-full md:w-80 border-r border-gray-100 flex flex-col flex-shrink-0 ${active ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tenants..." className="w-full pl-10 pr-3 py-2 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-button-primary/20 transition-all" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? <p className="p-8 text-center text-gray-400 text-sm">No chats found</p> : filtered.map(c => {
            const unread = c.messages.filter(m => m.senderRole !== 'owner' && !m.seen).length
            const lastMsg = c.messages[c.messages.length - 1]
            return (
              <motion.button key={c.id} onClick={() => setActive(c)} whileHover={{ backgroundColor: '#f9fafb' }}
                className={`w-full p-4 flex gap-3 text-left border-b border-gray-50 transition-all ${active?.id === c.id ? 'bg-button-primary/5 border-l-4 border-l-button-primary' : 'border-l-4 border-l-transparent'}`}>
                <div className="w-10 h-10 bg-gradient-to-br from-button-primary to-blue-400 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {c.tenantName.substring(0,2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="font-bold text-gray-900 text-sm truncate">{c.tenantName}</p>
                    <span className="text-[10px] text-gray-400 flex-shrink-0">{new Date(c.lastUpdated).toLocaleDateString()}</span>
                  </div>
                  {c.propertyTitle && <p className="text-[11px] text-button-primary font-medium truncate mb-1">{c.propertyTitle}</p>}
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500 truncate flex-1">{lastMsg?.text || (lastMsg ? 'Media' : 'Start messaging')}</p>
                    {unread > 0 && <span className="ml-2 w-5 h-5 bg-button-primary text-white text-[10px] rounded-full flex items-center justify-center font-bold flex-shrink-0">{unread}</span>}
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>

      <div className={`flex-1 flex flex-col min-w-0 ${!active ? 'hidden md:flex' : 'flex'}`}>
        {!active ? (
          <div className="flex-1 flex items-center justify-center text-center p-8">
            <div>
              <MessageCircleIcon className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400 text-sm">Select a conversation</p>
            </div>
          </div>
        ) : (
          <>
            <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between bg-white shadow-sm z-10">
               <div className="flex items-center gap-3">
                 <button onClick={() => setActive(null)} className="md:hidden p-1 text-gray-400 hover:text-gray-600">
                   <ArrowLeftIcon className="w-5 h-5" />
                 </button>
                 <div className="w-10 h-10 bg-gradient-to-br from-button-primary to-blue-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                   {active.tenantName.substring(0,2).toUpperCase()}
                 </div>
                 <div>
                   <p className="font-bold text-gray-900 text-sm">{active.tenantName}</p>
                   {active.propertyTitle && <p className="text-xs text-button-primary font-medium">{active.propertyTitle}</p>}
                 </div>
               </div>
               <div className="flex items-center gap-1">
                 <button onClick={() => toast.info('Calling...')} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full"><PhoneIcon className="w-5 h-5" /></button>
                 <button onClick={() => setShowInfo(!showInfo)} className={`p-2 rounded-full ${showInfo ? 'text-button-primary bg-blue-50' : 'text-gray-400 hover:bg-gray-100'}`}><InfoIcon className="w-5 h-5" /></button>
               </div>
            </div>

            <AnimatePresence>
              {showInfo && (
                <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }} className="bg-blue-50/50 border-b border-blue-100 px-5 py-3 text-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-gray-900">{active.tenantName}</p>
                      {active.propertyTitle && <p className="text-button-primary font-medium mt-0.5">{active.propertyTitle}</p>}
                    </div>
                    <button onClick={() => setShowInfo(false)} className="text-gray-400"><XIcon className="w-4 h-4" /></button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex-1 overflow-y-auto p-5 bg-gray-50 space-y-3">
              <AnimatePresence initial={false}>
                {active.messages.map(m => {
                  const isOwn = m.senderRole === 'owner'
                  return (
                    <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                      {!isOwn && <div className="mr-2 self-end w-8 h-8 rounded-full bg-gradient-to-br from-button-primary to-blue-400 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">{active.tenantName.substring(0,2).toUpperCase()}</div>}
                      <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl shadow-sm ${isOwn ? 'bg-button-primary text-white rounded-br-sm' : 'bg-white text-gray-900 rounded-bl-sm border border-gray-100'}`}>
                        {m.text && <p className="text-sm leading-relaxed">{m.text}</p>}
                        {m.image && <img src={m.image} className="rounded-xl max-w-full h-auto mt-2" />}
                        {m.video && <video src={m.video} controls className="rounded-xl max-w-full mt-2" />}
                        {m.audio && <audio src={m.audio} controls className="w-full mt-2" />}
                        <div className={`flex items-center justify-end gap-1 mt-1 ${isOwn ? 'text-white/60' : 'text-gray-400'}`}>
                          <span className="text-[10px]">{fmtTime(m.timestamp)}</span>
                          {isOwn && (m.seen ? <CheckCheckIcon className="w-3.5 h-3.5 text-blue-300" /> : <CheckIcon className="w-3 h-3 text-white/50" />)}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
              <div ref={endRef} />
            </div>

            <div className="p-4 bg-white border-t border-gray-100">
              <div className="flex gap-2 mb-3">
                 <button onClick={() => uploadFile('image')} className="p-2 text-gray-400 hover:text-button-primary hover:bg-button-primary/10 rounded-full"><ImageIcon className="w-5 h-5"/></button>
                 <button onClick={() => uploadFile('video')} className="p-2 text-gray-400 hover:text-button-primary hover:bg-button-primary/10 rounded-full"><VideoIcon className="w-5 h-5"/></button>
                 <button onClick={() => uploadFile('audio')} className="p-2 text-gray-400 hover:text-button-primary hover:bg-button-primary/10 rounded-full"><MicIcon className="w-5 h-5"/></button>
              </div>
              <div className="flex items-center gap-3">
                <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()} placeholder="Type your message..." className="flex-1 px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-button-primary transition-all" />
                <button onClick={send} disabled={!input.trim()} className="p-3 bg-button-primary text-white rounded-xl disabled:opacity-50 hover:bg-button-primary/90 transition-all shadow-md"><SendIcon className="w-5 h-5" /></button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
"""
content = messenger_regex.sub(new_messenger, content)

# 4. In MAIN Component: Insert activeChatId state, handle Confirm/Chat.
# We will inject these right after `const [selectedApp, setSelectedApp] = useState<any>(null)`
injection_point = "  const [selectedApp, setSelectedApp] = useState<any>(null)"
injection_payload = """  const [selectedApp, setSelectedApp] = useState<any>(null)
  
  const [activeChatId, setActiveChatId] = useState<string | undefined>()
  
  const handleChat = (b: any) => {
    if (!user) return
    const chat = getOrCreateChat(b.customerName, user.name, b.propertyTitle)
    setActiveChatId(chat.id)
    setActiveTab('messages')
  }

  const handleConfirmBooking = (b: any) => {
    if (!window.confirm(`Confirm booking for ${b.customerName}?`)) return
    const allB = ls('fm_bookings')
    const match = allB.find((x: any) => x.receiptId === b.receiptId)
    if (match) {
      match.status = 'confirmed'
      if (match.paymentType === 'cash' || match.amount === 0) {
        // Find property rent to assign
        const props = ls('fm_all_properties')
        const prop = props.find((p: any) => p.title === match.propertyTitle)
        if (prop) match.amount = prop.rent
      }
      setLS('fm_bookings', allB)
      setBookings(allB)
      
      const adminN = ls('fm_admin_notifs')
      adminN.unshift({ id: Date.now().toString(), type: 'booking', title: 'Booking Confirmed', msg: `Owner confirmed booking for ${match.propertyTitle}`, time: 'Just now', read: false })
      setLS('fm_admin_notifs', adminN)
      
      const notifsList = ls('fm_owner_notifs')
      notifsList.unshift({ id: Date.now().toString(), type: 'success', title: 'Booking Confirmed', msg: `You confirmed the booking for ${b.customerName}.`, time: 'Just now', read: false })
      setLS('fm_owner_notifs', notifsList)
      
      toast.success('Booking confirmed!')
    }
  }
"""
content = content.replace(injection_point, injection_payload)

# 5. Fix the case 'messages' to pass activeChatId
content = content.replace(
    "<MessengerPanel />",
    "<MessengerPanel activeConvId={activeChatId} />"
)

# 6. Replace bookings table Actions
bookings_th = "{['Receipt', 'Property', 'Customer', 'Amount', 'Type', 'Status', 'Move-in'].map(h => <th key={h} className=\"p-3 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap\">{h}</th>)}"
bookings_th_new = "{['Receipt', 'Property', 'Customer', 'Amount', 'Type', 'Status', 'Move-in', 'Actions'].map(h => <th key={h} className=\"p-3 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap\">{h}</th>)}"
content = content.replace(bookings_th, bookings_th_new)

bookings_tds = """<td className="p-3 text-gray-400">{b.moveInDate}</td>
                </motion.tr>"""
bookings_tds_new = """<td className="p-3 text-gray-400">{b.moveInDate}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                       <button onClick={() => handleChat(b)} className="px-3 py-1 bg-blue-50 text-button-primary text-[11px] font-bold rounded-full hover:bg-blue-100 transition-colors">Chat</button>
                       {b.status !== 'confirmed' && (
                         <button onClick={() => handleConfirmBooking(b)} className="px-3 py-1 bg-green-50 text-green-700 text-[11px] font-bold rounded-full hover:bg-green-100 transition-colors">Confirm</button>
                       )}
                    </div>
                  </td>
                </motion.tr>"""
content = content.replace(bookings_tds, bookings_tds_new)

# 7. Inject Settings case replacing previous "Add Settings panel (case 'settings')"
# Wait, OwnerDashboard.tsx does not even have case 'settings'. Let me check its sidebar links.
# Let's add case 'settings' into the switch statement before `default:`
settings_payload = """
  // ── SETTINGS ─────────────────────────────────────────────────────────────────
  case 'settings': return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl border border-gray-200">
          <SettingsIcon className="w-5 h-5 text-gray-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Profile Settings</h2>
          <p className="text-xs text-gray-500 mt-0.5">Manage your owner account</p>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center gap-5 mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-button-primary to-blue-400 rounded-full flex items-center justify-center text-white font-black text-2xl shadow-inner border-4 border-white">
            {user?.name.substring(0,2).toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">{user?.name}</h3>
            <p className="text-sm text-gray-500 mb-2">{user?.email}</p>
            <button className="px-4 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-full text-xs font-semibold text-gray-700 transition-colors">Change Avatar</button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">First Name</label>
              <input defaultValue={user?.name.split(' ')[0]} className="w-full px-4 py-2.5 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-button-primary focus:bg-white transition-colors font-medium text-gray-800" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Last Name</label>
              <input defaultValue={user?.name.split(' ')[1] || ''} className="w-full px-4 py-2.5 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-button-primary focus:bg-white transition-colors font-medium text-gray-800" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Email Address</label>
            <input defaultValue={user?.email} className="w-full px-4 py-2.5 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm focus:outline-none disabled:bg-gray-100 font-medium text-gray-600" disabled />
          </div>
          <div className="pt-4 flex justify-end">
            <button onClick={() => toast.success('Profile updated successfully!')} className="px-6 py-2.5 bg-button-primary text-white text-sm font-bold rounded-xl hover:bg-button-primary/90 transition-all shadow-md">Save Changes</button>
          </div>
        </div>
      </div>
    </motion.div>
  )
"""

content = content.replace("default: return null\n  }", settings_payload + "\n  default: return null\n  }")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
