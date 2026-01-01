import { useEffect, useRef } from 'react';
import { TemplateLoader } from './TemplateLoader';

interface Metric {
  label: string;
  value: number | string;
  trend?: 'up' | 'down' | 'neutral';
  change?: number;
  icon?: string;
  color?: string;
}

interface DashboardFrameProps {
  template: string;
  metrics?: Metric[];
  refreshInterval?: number;
  onRefresh?: () => void;
  className?: string;
}

/**
 * DashboardFrame - Renderer for dashboard templates with real-time data
 * 
 * Loads dashboard templates from public/samfox-templates/dashboards/
 * and injects metrics dynamically with optional auto-refresh.
 * 
 * @param template - Dashboard template filename
 * @param metrics - Array of metrics to display
 * @param refreshInterval - Auto-refresh interval in milliseconds (0 = disabled)
 * @param onRefresh - Callback when refresh is triggered
 * @param className - Optional CSS class for container
 */
export function DashboardFrame({ 
  template, 
  metrics = [],
  refreshInterval = 0,
  onRefresh,
  className = ''
}: DashboardFrameProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const lastUpdateRef = useRef<Date>(new Date());

  useEffect(() => {
    // Inject metrics into template
    if (frameRef.current && metrics.length > 0) {
      const metricsContainer = frameRef.current.querySelector('[data-metrics]');
      
      if (metricsContainer) {
        metricsContainer.innerHTML = metrics.map(metric => {
          const trendIcon = metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→';
          const trendColor = metric.trend === 'up' ? 'text-green-600' : metric.trend === 'down' ? 'text-red-600' : 'text-gray-600';
          const bgColor = metric.color || 'bg-white';
          
          return `
            <div class="metric-card ${bgColor} border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <div class="flex items-start justify-between mb-2">
                <span class="metric-label text-sm text-gray-600 font-medium">
                  ${metric.label}
                </span>
                ${metric.icon ? `
                  <span class="metric-icon text-gray-400">
                    ${metric.icon}
                  </span>
                ` : ''}
              </div>
              
              <div class="metric-value text-3xl font-bold mb-1">
                ${metric.value}
              </div>
              
              ${metric.trend && metric.change !== undefined ? `
                <div class="metric-trend flex items-center gap-1 ${trendColor} text-sm">
                  <span class="font-bold">${trendIcon} ${Math.abs(metric.change)}%</span>
                  <span class="text-xs text-gray-500">vs last period</span>
                </div>
              ` : ''}
            </div>
          `;
        }).join('');
      } else {
        // Fallback: create metrics grid if no data-metrics container
        const dashboardContent = frameRef.current.querySelector('.dashboard-content, .metrics-grid');
        
        if (dashboardContent) {
          const metricsGrid = document.createElement('div');
          metricsGrid.className = 'metrics-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6';
          
          metrics.forEach(metric => {
            const card = document.createElement('div');
            card.className = 'metric-card bg-white border rounded-lg p-4 shadow-sm';
            
            const trendIcon = metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '';
            const trendColor = metric.trend === 'up' ? 'text-green-600' : 'text-red-600';
            
            card.innerHTML = `
              <div class="text-sm text-gray-600 mb-2">${metric.label}</div>
              <div class="text-2xl font-bold mb-1">${metric.value}</div>
              ${metric.trend && metric.change !== undefined ? `
                <div class="${trendColor} text-sm">
                  ${trendIcon} ${Math.abs(metric.change)}%
                </div>
              ` : ''}
            `;
            
            metricsGrid.appendChild(card);
          });
          
          dashboardContent.insertBefore(metricsGrid, dashboardContent.firstChild);
        }
      }
      
      // Update last update time
      lastUpdateRef.current = new Date();
      updateLastRefreshTime();
    }
  }, [metrics]);

  useEffect(() => {
    // Set up auto-refresh
    if (refreshInterval > 0 && onRefresh) {
      const interval = setInterval(() => {
        console.log('Auto-refreshing dashboard...');
        onRefresh();
      }, refreshInterval);
      
      return () => clearInterval(interval);
    }
  }, [refreshInterval, onRefresh]);

  const updateLastRefreshTime = () => {
    if (frameRef.current) {
      const timeDisplay = frameRef.current.querySelector('[data-last-update]');
      if (timeDisplay) {
        timeDisplay.textContent = lastUpdateRef.current.toLocaleTimeString();
      }
    }
  };

  const handleTemplateLoad = (html: string) => {
    console.log('Dashboard template loaded');
    updateLastRefreshTime();
  };

  const handleTemplateError = (error: Error) => {
    console.error('Failed to load dashboard template:', error);
  };

  const handleManualRefresh = () => {
    if (onRefresh) {
      console.log('Manual refresh triggered');
      onRefresh();
    }
  };

  return (
    <div className={className}>
      {/* Refresh Controls */}
      <div className="dashboard-controls flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">
            Last updated: <span data-last-update className="font-medium">{lastUpdateRef.current.toLocaleTimeString()}</span>
          </span>
          {refreshInterval > 0 && (
            <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
              Auto-refresh: {refreshInterval / 1000}s
            </span>
          )}
        </div>
        
        <button
          onClick={handleManualRefresh}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary/90 transition-colors"
          disabled={!onRefresh}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Dashboard Template */}
      <div ref={frameRef}>
        <TemplateLoader
          category="dashboards"
          template={template}
          onLoad={handleTemplateLoad}
          onError={handleTemplateError}
        />
      </div>

      {/* Fallback Metrics Display */}
      {metrics.length > 0 && (
        <div className="dashboard-metrics-fallback mt-6 hidden">
          <h2 className="text-xl font-semibold mb-4">Dashboard Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric, index) => (
              <div key={index} className="metric-card bg-white border rounded-lg p-4 shadow-sm">
                <div className="text-sm text-gray-600 mb-2">{metric.label}</div>
                <div className="text-3xl font-bold mb-1">{metric.value}</div>
                {metric.trend && metric.change !== undefined && (
                  <div className={`text-sm ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {metric.trend === 'up' ? '↑' : '↓'} {Math.abs(metric.change)}%
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
