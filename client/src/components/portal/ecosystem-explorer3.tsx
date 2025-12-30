import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Search,
  GitBranch,
  Star,
  GitFork,
  Activity,
  Database,
  Code,
  ExternalLink,
} from 'lucide-react';
import type { Brand, Sector } from '@shared/schema';

interface CodeNestRepo {
  repoId: string;
  repoName: string;
  githubRepoId?: string;
  subdomain?: string;
  status: string;
  lastSyncAt?: string;
  metadata?: any;
  commitCount?: number;
  contributorCount?: number;
  starCount?: number;
  forksCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface RepositoryStats {
  total_repositories: number;
  active_repositories: number;
  total_commits: number;
  total_stars: number;
  total_forks: number;
}

/**
 * Ecosystem Explorer 3 - CodeNest Repository Dashboard
 * Focused on 84+ repositories metadata aggregation and real-time sync status
 */
export default function EcosystemExplorer3() {
  const [repositories, setRepositories] = useState<CodeNestRepo[]>([]);
  const [stats, setStats] = useState<RepositoryStats | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Fetch brands and sectors data
  const { data: brands = [] } = useQuery<Brand[]>({
    queryKey: ['/api/brands'],
  });

  const { data: sectors = [] } = useQuery<Sector[]>({
    queryKey: ['/api/sectors'],
  });

  // Core 8 repositories from Signal_To_Chuck
  const coreRepositories = [
    { name: 'seedwave', id: 999727712, subdomain: 'seedwave.faa.zone' },
    { name: 'fruitful', id: 1004545653, subdomain: 'fruitful.faa.zone' },
    { name: 'FruitfulPlanetChange', id: 1062754976, subdomain: 'fruitfulplanetchange.faa.zone' },
    { name: 'codenest', id: 1098332863, subdomain: 'codenest.faa.zone' },
    { name: 'faa.zone', id: 958953084, subdomain: 'faa.zone' },
    { name: 'hotstack', id: 1088770327, subdomain: 'hotstack.faa.zone' },
    { name: 'vaultmesh', id: 992184183, subdomain: 'vaultmesh.faa.zone' },
    { name: 'heyns1000', id: 1115164096, subdomain: 'github.com/heyns1000' },
  ];

  // Fetch repositories
  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        const response = await fetch('/api/banimal/codenest/repositories');
        if (response.ok) {
          const data = await response.json();
          setRepositories(data.repositories || []);
          setStats(data.stats || null);
        }
      } catch (error) {
        console.error('Failed to fetch repositories:', error);
      }
    };

    fetchRepositories();

    // Refresh every 30 seconds
    const interval = setInterval(fetchRepositories, 30000);

    return () => clearInterval(interval);
  }, []);

  const filteredRepos = repositories.filter((repo) => {
    const matchesSearch =
      repo.repoName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repo.subdomain?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || repo.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'archived':
        return 'bg-gray-500';
      case 'private':
        return 'bg-blue-500';
      default:
        return 'bg-yellow-500';
    }
  };

  const formatNumber = (num: number | undefined) => {
    if (!num) return '0';
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">📦 CodeNest Repository Dashboard</h1>
        <p className="text-orange-100">84+ Repositories Metadata Aggregation & Real-Time Sync</p>
        <div className="flex gap-4 mt-4 text-sm">
          <Badge className="bg-white/20 text-white border-white/30">
            <GitBranch className="h-3 w-3 mr-1" />
            {stats?.total_repositories || 0} Repositories
          </Badge>
          <Badge className="bg-white/20 text-white border-white/30">
            <Star className="h-3 w-3 mr-1" />
            {formatNumber(stats?.total_stars)} Stars
          </Badge>
          <Badge className="bg-white/20 text-white border-white/30">
            <GitFork className="h-3 w-3 mr-1" />
            {formatNumber(stats?.total_forks)} Forks
          </Badge>
          <Badge className="bg-white/20 text-white border-white/30">
            <Code className="h-3 w-3 mr-1" />
            {formatNumber(stats?.total_commits)} Commits
          </Badge>
        </div>
      </div>

      {/* Global Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Repos</p>
                <p className="text-2xl font-bold text-blue-600">{stats?.total_repositories || 0}</p>
              </div>
              <Database className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats?.active_repositories || 0}
                </p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Stars</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {formatNumber(stats?.total_stars)}
                </p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Forks</p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatNumber(stats?.total_forks)}
                </p>
              </div>
              <GitFork className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Commits</p>
                <p className="text-2xl font-bold text-orange-600">
                  {formatNumber(stats?.total_commits)}
                </p>
              </div>
              <Code className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Core 8 Repositories Highlight */}
      <Card className="border-2 border-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-blue-600" />
            Core 8 Repositories (Signal_To_Chuck)
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Primary ecosystem repositories from Signal Seedwave™ declaration
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {coreRepositories.map((repo) => (
              <div
                key={repo.id}
                className="border rounded-lg p-3 hover:shadow-lg transition-shadow bg-blue-50 dark:bg-blue-950"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-sm">{repo.name}</p>
                    <p className="text-xs text-gray-500">ID: {repo.id}</p>
                  </div>
                  <Badge className="bg-blue-600 text-white">CORE</Badge>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                  {repo.subdomain}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search repositories by name or subdomain..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Badge
            variant={filterStatus === 'all' ? 'default' : 'outline'}
            className="cursor-pointer px-4 py-2"
            onClick={() => setFilterStatus('all')}
          >
            All
          </Badge>
          <Badge
            variant={filterStatus === 'active' ? 'default' : 'outline'}
            className="cursor-pointer px-4 py-2"
            onClick={() => setFilterStatus('active')}
          >
            Active
          </Badge>
          <Badge
            variant={filterStatus === 'archived' ? 'default' : 'outline'}
            className="cursor-pointer px-4 py-2"
            onClick={() => setFilterStatus('archived')}
          >
            Archived
          </Badge>
        </div>
      </div>

      {/* Repository Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRepos.map((repo) => (
          <Card key={repo.repoId} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GitBranch className="h-4 w-4 text-gray-500" />
                  <CardTitle className="text-sm font-semibold">{repo.repoName}</CardTitle>
                </div>
                <div className={`w-3 h-3 rounded-full ${getStatusColor(repo.status)}`} />
              </div>
              {repo.subdomain && <p className="text-xs text-gray-500 truncate">{repo.subdomain}</p>}
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="flex flex-col items-center">
                    <Star className="h-3 w-3 text-yellow-500 mb-1" />
                    <span className="font-bold">{formatNumber(repo.starCount)}</span>
                    <span className="text-gray-500">stars</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <GitFork className="h-3 w-3 text-purple-500 mb-1" />
                    <span className="font-bold">{formatNumber(repo.forksCount)}</span>
                    <span className="text-gray-500">forks</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Code className="h-3 w-3 text-blue-500 mb-1" />
                    <span className="font-bold">{formatNumber(repo.commitCount)}</span>
                    <span className="text-gray-500">commits</span>
                  </div>
                </div>

                {repo.lastSyncAt && (
                  <div className="text-xs text-gray-500">
                    Last sync: {new Date(repo.lastSyncAt).toLocaleDateString()}
                  </div>
                )}

                {repo.subdomain && (
                  <a
                    href={`https://${repo.subdomain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Visit
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRepos.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center text-gray-500">
            <Database className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No repositories found matching your search.</p>
            {repositories.length === 0 && (
              <p className="text-sm mt-2">
                Repositories will appear here once metadata is aggregated.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
