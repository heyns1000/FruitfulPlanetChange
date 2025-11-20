/**
 * Metrics Dashboard
 * 
 * Real-time metrics visualization and system health monitoring
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, TrendingUp, Users, AlertCircle, Database, Cpu, Clock, CheckCircle } from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface MetricsData {
  timestamp: string;
  requests: number;
  errors: number;
  responseTime: number;
  activeConnections: number;
  cpuUsage: number;
  memoryUsage: number;
}

interface HealthStatus {
  status: 'ok' | 'degraded' | 'error';
  timestamp: string;
  uptime: number;
  checks: {
    database?: {
      status: string;
      message: string;
    };
    memory?: {
      status: string;
      message: string;
    };
  };
}

export default function MetricsDashboard() {
  const [metrics, setMetrics] = useState<MetricsData[]>([]);
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch health status
  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await fetch('/api/health/detailed');
        const data = await response.json();
        setHealth(data);
      } catch (error) {
        console.error('Failed to fetch health status:', error);
      }
    };

    fetchHealth();
    const interval = setInterval(fetchHealth, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  // Generate mock metrics data (in production, this would fetch from /metrics endpoint)
  useEffect(() => {
    const generateMetrics = () => {
      const now = Date.now();
      const data: MetricsData[] = [];

      for (let i = 29; i >= 0; i--) {
        const timestamp = new Date(now - i * 60000); // Last 30 minutes
        data.push({
          timestamp: timestamp.toLocaleTimeString(),
          requests: Math.floor(Math.random() * 100) + 50,
          errors: Math.floor(Math.random() * 5),
          responseTime: Math.floor(Math.random() * 200) + 50,
          activeConnections: Math.floor(Math.random() * 50) + 10,
          cpuUsage: Math.floor(Math.random() * 60) + 20,
          memoryUsage: Math.floor(Math.random() * 40) + 40,
        });
      }

      setMetrics(data);
      setIsLoading(false);
    };

    generateMetrics();
    const interval = setInterval(generateMetrics, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Activity className="w-12 h-12 mx-auto mb-4 animate-pulse" />
          <p className="text-lg">Loading metrics...</p>
        </div>
      </div>
    );
  }

  const currentMetrics = metrics[metrics.length - 1] || {};
  const avgResponseTime = metrics.reduce((sum, m) => sum + m.responseTime, 0) / metrics.length;
  const totalErrors = metrics.reduce((sum, m) => sum + m.errors, 0);
  const totalRequests = metrics.reduce((sum, m) => sum + m.requests, 0);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">System Metrics Dashboard</h1>
          <p className="text-muted-foreground">Real-time monitoring and performance analytics</p>
        </div>
        {health && (
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            health.status === 'ok' ? 'bg-green-100 text-green-800' :
            health.status === 'degraded' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {health.status === 'ok' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="font-medium capitalize">System {health.status}</span>
          </div>
        )}
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRequests.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Last 30 minutes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgResponseTime.toFixed(0)}ms</div>
            <p className="text-xs text-muted-foreground">
              {avgResponseTime < 100 ? 'Excellent' : avgResponseTime < 300 ? 'Good' : 'Needs attention'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalErrors}</div>
            <p className="text-xs text-muted-foreground">
              {((totalErrors / totalRequests) * 100).toFixed(2)}% error rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Connections</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMetrics.activeConnections || 0}</div>
            <p className="text-xs text-muted-foreground">Current connections</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request Rate */}
        <Card>
          <CardHeader>
            <CardTitle>Request Rate</CardTitle>
            <CardDescription>Requests per minute over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="requests"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Response Time */}
        <Card>
          <CardHeader>
            <CardTitle>Response Time</CardTitle>
            <CardDescription>Average response time in milliseconds</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="responseTime"
                  stroke="#82ca9d"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* System Resources */}
        <Card>
          <CardHeader>
            <CardTitle>System Resources</CardTitle>
            <CardDescription>CPU and memory usage</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="cpuUsage"
                  stroke="#ff7300"
                  strokeWidth={2}
                  name="CPU %"
                />
                <Line
                  type="monotone"
                  dataKey="memoryUsage"
                  stroke="#387908"
                  strokeWidth={2}
                  name="Memory %"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Error Rate */}
        <Card>
          <CardHeader>
            <CardTitle>Error Tracking</CardTitle>
            <CardDescription>Errors over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="errors" fill="#ff4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Health Status Details */}
      {health && (
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Component health status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 border rounded-lg">
                <Database className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="font-medium">Database</p>
                  <p className="text-sm text-muted-foreground">
                    {health.checks.database?.message || 'Healthy'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 border rounded-lg">
                <Cpu className="w-8 h-8 text-green-600" />
                <div>
                  <p className="font-medium">Memory</p>
                  <p className="text-sm text-muted-foreground">
                    {health.checks.memory?.message || 'Healthy'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 border rounded-lg">
                <Activity className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="font-medium">Uptime</p>
                  <p className="text-sm text-muted-foreground">
                    {Math.floor(health.uptime / 3600)}h {Math.floor((health.uptime % 3600) / 60)}m
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
