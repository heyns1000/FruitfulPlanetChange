import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Activity, CheckCircle, XCircle, Loader2, ExternalLink, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DeploymentStep {
  name: string;
  completed: boolean;
}

interface Deployment {
  id: string;
  user_id: string;
  brand_id: number;
  brand_name: string;
  integration_type: string;
  status: string;
  error_message?: string;
  deployment_url?: string;
  created_at: string;
  completed_at?: string;
  steps: DeploymentStep[];
}

interface DeploymentsResponse {
  success: boolean;
  deployments: Deployment[];
}

export default function DeploymentDashboard() {
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'failed'>('active');

  // Fetch deployments with 5-second polling
  const { data, isLoading } = useQuery<DeploymentsResponse>({
    queryKey: ['/api/integration/user-deployments'],
    refetchInterval: 5000, // Poll every 5 seconds
  });

  const deployments = data?.deployments || [];

  // Filter deployments by status
  const activeDeployments = deployments.filter(
    (d) => d.status === 'pending' || d.status === 'building' || d.status === 'deploying'
  );
  const completedDeployments = deployments.filter((d) => d.status === 'success');
  const failedDeployments = deployments.filter((d) => d.status === 'failed');

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'pending':
      case 'building':
      case 'deploying':
        return <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const variants = {
      success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      pending: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      building: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      deploying: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    };

    return (
      <Badge className={variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (seconds < 60) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  // Render deployment card
  const renderDeploymentCard = (deployment: Deployment) => (
    <Card key={deployment.id} className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              {getStatusIcon(deployment.status)}
              {deployment.brand_name}
            </CardTitle>
            <CardDescription className="mt-1">Deployment ID: {deployment.id}</CardDescription>
          </div>
          {getStatusBadge(deployment.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Pipeline Steps */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Deployment Pipeline:</p>
          <div className="space-y-2">
            {deployment.steps.map((step, index) => (
              <div key={index} className="flex items-center gap-2">
                {step.completed ? (
                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                ) : (
                  <div className="h-4 w-4 rounded-full border-2 border-gray-300 flex-shrink-0" />
                )}
                <span className={step.completed ? 'text-sm' : 'text-sm text-muted-foreground'}>
                  {step.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {deployment.error_message && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
            <p className="text-sm text-red-800 dark:text-red-200">
              <strong>Error:</strong> {deployment.error_message}
            </p>
          </div>
        )}

        {/* Metadata */}
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span>Type: {deployment.integration_type}</span>
          <span>•</span>
          <span>Started: {formatDate(deployment.created_at)}</span>
          {deployment.completed_at && (
            <>
              <span>•</span>
              <span>Completed: {formatDate(deployment.completed_at)}</span>
            </>
          )}
        </div>

        {/* View Deployed Integration Button */}
        {deployment.status === 'success' && deployment.deployment_url && (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => window.open(deployment.deployment_url, '_blank')}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            View Deployed Integration
          </Button>
        )}
      </CardContent>
    </Card>
  );

  // Render empty state
  const renderEmptyState = (message: string) => (
    <Card>
      <CardContent className="py-12 text-center">
        <p className="text-muted-foreground">{message}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Activity className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Deployment Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time monitoring of brand integration deployments
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Active Deployments</CardDescription>
            <CardTitle className="text-3xl">{activeDeployments.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
              <span className="text-sm text-muted-foreground">In Progress</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Completed</CardDescription>
            <CardTitle className="text-3xl">{completedDeployments.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm text-muted-foreground">Successfully Deployed</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Failed</CardDescription>
            <CardTitle className="text-3xl">{failedDeployments.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-muted-foreground">Requires Attention</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Deployment Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active ({activeDeployments.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedDeployments.length})</TabsTrigger>
          <TabsTrigger value="failed">Failed ({failedDeployments.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4 mt-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : activeDeployments.length === 0 ? (
            renderEmptyState('No active deployments at the moment.')
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {activeDeployments.map(renderDeploymentCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4 mt-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : completedDeployments.length === 0 ? (
            renderEmptyState('No completed deployments yet.')
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {completedDeployments.map(renderDeploymentCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="failed" className="space-y-4 mt-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : failedDeployments.length === 0 ? (
            renderEmptyState('No failed deployments. Great job!')
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {failedDeployments.map(renderDeploymentCard)}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Auto-refresh indicator */}
      <div className="text-center text-sm text-muted-foreground">
        <Clock className="inline h-4 w-4 mr-1" />
        Auto-refreshing every 5 seconds
      </div>
    </div>
  );
}
