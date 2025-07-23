import { useQuery } from "@tanstack/react-query"
import type { SystemStatus as SystemStatusType } from "@shared/schema"

export function SystemStatus() {
  const { data: statuses = [] } = useQuery<SystemStatusType[]>({
    queryKey: ["/api/system-status"],
    refetchInterval: 30000, // Refresh every 30 seconds
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "maintenance":
        return "bg-yellow-500"
      case "offline":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "online":
        return "Online"
      case "maintenance":
        return "Maintenance"
      case "offline":
        return "Offline"
      default:
        return "Unknown"
    }
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6" data-tour="system-status">
      <h3 className="font-semibold mb-3 text-sm">System Status</h3>
      <div className="space-y-2">
        {statuses.map((status) => (
          <div key={status.service} className="flex items-center justify-between">
            <span className="text-sm">{status.service}</span>
            <div className="flex items-center gap-2">
              <div className={`
                w-2 h-2 rounded-full animate-pulse
                ${getStatusColor(status.status)}
              `} />
              <span className={`
                text-xs
                ${status.status === 'online' ? 'text-green-600' : 
                  status.status === 'maintenance' ? 'text-yellow-600' : 'text-red-600'}
              `}>
                {getStatusText(status.status)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
