import { Button } from "@/components/ui/button"
import { useState, useEffect, useRef } from "react"

const Bell = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 22c1.1046 0 2-.8954 2-2H10c0 1.1046.8954 2 2 2zm6-6v-5a6 6 0 10-12 0v5l-2 2H20l-2-2z" />
  </svg>
)

type ActivityLog = {
  id: number;
  log_name: string;
  description: string;
  event: string | null;
  subject_id: number | null;
  subject_type: string | null;
  causer_id: number | null;
  causer_type: string | null;
  properties: any;
  created_at: string;
  updated_at: string;
};

export function AdminHeader() {
  const [showNotifications, setShowNotifications] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)



  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }

    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showNotifications])


    const [notif,setNotif] = useState<ActivityLog[]>([]);
  
    useEffect(() => {
      const fetchHeaderData = async ()=>{
        try {
          const response = await fetch(route('admin.notifications'))
          const data = await response.json()
          setNotif(data.notif);
          console.log(data.notif)
        } catch (error) {
          console.error('Failed to fetch sidebar data:', error)
        }
      }
  
      fetchHeaderData()
      const interval1 = setInterval(fetchHeaderData, 30000)
      return () => clearInterval(interval1)
    }, [])

  return (
    <header className="h-20 border-b border-slate-700 bg-slate-800/30 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-40">
      <div>
        <h2 className="text-xl font-semibold text-white">Admin Dashboard</h2>
        <p className="text-sm text-gray-400">Manage your store</p>
      </div>

      <div className="flex items-center gap-3" ref={dropdownRef}>
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative text-gray-400 hover:text-white hover:bg-slate-700/50"
          >
            <Bell />
            <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full animate-pulse"></span>
          </Button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-lg shadow-xl animate-fade-in overflow-hidden">
              <div className="p-3 border-b border-slate-700">
                <h3 className="text-white font-semibold">Notifications</h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notif.map((n) => (
                  <div
                    key={n.id}
                    className="p-3 border-b border-slate-700 hover:bg-slate-700/30 transition-colors cursor-pointer"
                  >
                    <p className="text-white text-sm">
                      {
                        n.log_name === 'Product' && n.event === 'created' ? `New ${n.log_name} added` : 
                          n.log_name === 'Product' && n.event === 'updated' ? `${n.log_name} - ${n.properties.name} updated` :
                            n.log_name === 'Product' && n.event === 'deleted' ? `Product - ${n.properties.name} deleted` : 
                        n.log_name === 'Order' && n.event === 'created' ? `New ${n.log_name} added` :
                          n.log_name === 'Order' && n.event === 'updated' ? `${n.log_name} - ${n.properties.order_id} updated` :
                            n.log_name === 'Order' && n.event === 'deleted' ? `Order - ${n.properties.order_id} deleted` :
                        n.log_name === 'Customer' && n.event === 'updated' ? `${n.log_name} - ${n.properties.name} updated` :
                          n.log_name === 'Customer' && n.event === 'mail_sent' && n.description === 'Customer email sent successfully' ? `${n.log_name} - ${n.properties.name} sent an email` :
                          n.log_name +'-'+ n.description
                      }
                    </p>
                    <p className="text-gray-400 text-xs mt-1">{
                      new Date().getMonth() === new Date(n.created_at).getMonth() ?
                        new Date().getDay() === new Date(n.created_at).getDay() ? 
                          new Date().getHours() === new Date(n.created_at).getHours() ? 
                            new Date().getMinutes() === new Date(n.created_at).getMinutes() ?
                              "just now" : `${new Date().getMinutes() - new Date(n.created_at).getMinutes()} min ago`
                            : `${new Date().getHours() - new Date(n.created_at).getHours()} hours ago`
                          : `${new Date().getDay() - new Date(n.created_at).getDay()} days ago`
                        : `${new Date(n.created_at).toDateString()}`

                      }</p>
                  </div> 
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
