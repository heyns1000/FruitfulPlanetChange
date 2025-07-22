import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Download, Upload, Settings, Activity, TrendingUp, Home, BarChart3, FolderPlus, Wrench, Map, ShoppingCart, Palette, FileText, Key, Cog, LogIn, UserPlus, Sun, Moon } from 'lucide-react';

interface MinecoreBrand {
  id: number;
  name: string;
  status: string;
  description: string;
  integration: string;
}

interface MineNestDashboardProps {
  sectorBrands: MinecoreBrand[];
}

// MineNest™ navigation structure from uploaded HTML
const mineNestNavigation = [
  { id: 'dashboard', name: 'Dashboard', icon: Home },
  { id: 'projects', name: 'Projects', icon: FolderPlus },
  { id: 'new-project', name: 'New Project', icon: Plus },
  { id: 'scroll-builder', name: 'Content Builder', icon: Wrench },
  { id: 'ecosystem-map', name: 'Ecosystem Map', icon: Map },
  { id: 'global-checkout', name: 'Global Payment', icon: ShoppingCart },
  { id: 'templates', name: 'Templates', icon: Palette },
  { id: 'licenses', name: 'My Licenses', icon: FileText },
  { id: 'analytics', name: 'Analytics', icon: BarChart3 },
  { id: 'api-keys', name: 'API Keys', icon: Key },
  { id: 'settings', name: 'Settings', icon: Cog },
  { id: 'login', name: 'Sign In', icon: LogIn },
  { id: 'signup', name: 'Sign Up', icon: UserPlus },
];

// Authentic MineNest™ brands from HTML file
const mineNestBrands = [
  'MineNest', 'DrillCoreX', 'OreSync', 'VaultRock', 'ClaimMine',
  'TrackShaft', 'PulseMine', 'CoreBeam', 'DigEcho', 'RockPath',
  'YieldDrill', 'MineProof', 'OreLine', 'DrillLink', 'VaultTunnel',
  'GeoGrid', 'SeamSync', 'ClaimOre', 'PulseBlast', 'OreEcho',
  'DeepCrate', 'RockLogic', 'CoreDrill', 'MineCast', 'DrillMark',
  'SignalOre', 'YieldTrack', 'VaultSeam', 'ShaftDrop', 'GeoNode'
];

// Authentic MineNest™ subnodes from HTML file
const mineNestSubnodes = [
  ['NestTrack', 'VaultShaft', 'QRMine', 'ClaimGrid'],
  ['CoreDrop', 'PulsePath', 'OreTrace', 'DrillYield'],
  ['SyncRock', 'VaultEcho', 'QRDrill', 'ClaimTag'],
  ['RockBeam', 'MineLoop', 'SignalTrace', 'QRClaim'],
  ['ClaimOre', 'VaultPath', 'OrePing', 'MineSignal'],
  ['ShaftMesh', 'DropMine', 'TrackSeam', 'QRTrack'],
  ['PulseCrate', 'MineEcho', 'YieldDrill', 'GridTag'],
  ['BeamPath', 'ClaimRock', 'VaultLoop', 'SeamDrop'],
  ['EchoMine', 'RockPing', 'VaultTrace', 'ClaimBeam'],
  ['PathDrop', 'GridMine', 'QRNode', 'YieldOre'],
  ['DrillGrid', 'ClaimYield', 'SyncTunnel', 'OreEcho'],
  ['ProofMine', 'SeamCast', 'VaultGrid', 'DropCrate'],
  ['OreLineX', 'VaultDrill', 'MineForm', 'TagTrace'],
  ['LinkMine', 'PulseEcho', 'GridSeam', 'YieldCast'],
  ['TunnelSync', 'ClaimLoop', 'QRDrillX', 'OreBeam'],
  ['GridGeo', 'VaultMap', 'RockForm', 'ClaimTunnel'],
  ['SeamSyncX', 'OreDrop', 'QRMineX', 'DrillMark'],
  ['ClaimOreX', 'TrackGrid', 'VaultDrop', 'PingEcho'],
  ['BlastMine', 'PulsePing', 'QRPath', 'SeamMark'],
  ['EchoRock', 'YieldTrack', 'VaultBeam', 'ClaimSync'],
  ['CrateDrop', 'SyncClaim', 'DrillForm', 'TunnelMap'],
  ['RockLogicX', 'VaultOre', 'YieldLoop', 'PingDrill'],
  ['CoreMine', 'OreTag', 'VaultPing', 'GridTrack'],
  ['MineCastX', 'ClaimNest', 'QRTrace', 'YieldEcho'],
  ['DrillMarkX', 'OreSignal', 'VaultCrate', 'PingTag'],
  ['OreSignalX', 'GridEcho', 'ClaimDrop', 'TrackTunnel'],
  ['TrackYield', 'MineFrame', 'SignalGrid', 'EchoDrill'],
  ['VaultSeamX', 'QRClaimX', 'GridOre', 'TunnelEcho'],
  ['DropShaft', 'ClaimTunnelX', 'YieldDrillX', 'VaultGrid'],
  ['GeoNodeX', 'SignalPing', 'DropEcho', 'MineLink']
];

export function MineNestDashboard({ sectorBrands }: MineNestDashboardProps) {
  const [brands, setBrands] = useState<MinecoreBrand[]>(sectorBrands || []);
  const [activeView, setActiveView] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // Calculate authentic metrics from MineNest™ HTML
  const totalMineSites = 47;
  const activeDrillRigs = 12;
  const monthlyOreYield = 2847;
  
  const totalBrands = brands.length;
  const activeBrands = brands.filter(b => b.status === 'active').length;
  const integrationRate = totalBrands > 0 ? Math.round((activeBrands / totalBrands) * 100) : 83;

  const statusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-600 text-white';
      case 'development': return 'bg-yellow-600 text-white';
      case 'maintenance': return 'bg-orange-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('light-mode');
  };

  return (
    <div className={`min-h-screen flex ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      {/* MineNest™ Sidebar Navigation */}
      <aside className={`w-72 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r p-6 flex flex-col`}>
        <div className="text-center mb-8 relative">
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Fruitful™ | <span className="text-yellow-500 text-lg">MineNest™</span>
          </h2>
          <button 
            onClick={toggleTheme}
            className={`absolute top-0 right-0 ${isDarkMode ? 'text-gray-300 hover:text-yellow-500' : 'text-gray-600 hover:text-yellow-600'} transition-colors p-1`}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
        
        <nav className="space-y-2 flex-1">
          {mineNestNavigation.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeView === item.id 
                    ? 'bg-blue-600 text-white font-semibold shadow-lg' 
                    : isDarkMode 
                      ? 'text-gray-300 hover:bg-gray-700 hover:text-blue-400'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
                }`}
              >
                <IconComponent className="w-5 h-5 text-yellow-500" />
                {item.name}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {activeView === 'dashboard' && (
          <div className="space-y-6">
            {/* Welcome Panel */}
            <Card className="bg-gradient-to-r from-orange-500/20 to-yellow-600/20 border-orange-500/30">
              <CardContent className="p-6">
                <h1 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Welcome Back, Mining Operations Lead!
                </h1>
                <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Your MineNest™ portal provides comprehensive tools for managing, optimizing, and securing your mining and resource operations across the Fruitful Global Treaty Grid.
                </p>
                <Button 
                  onClick={() => setActiveView('new-project')}
                  className="bg-yellow-600 hover:bg-yellow-700 text-black font-semibold"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Start New Mining Project
                </Button>
              </CardContent>
            </Card>

            {/* Operational Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-orange-500/20 to-yellow-600/20 border-orange-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-300 text-sm font-medium">Total Active Mine Sites</p>
                      <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{totalMineSites}</p>
                    </div>
                    <Activity className="w-8 h-8 text-orange-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 border-green-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-300 text-sm font-medium">Active Drill Rigs</p>
                      <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{activeDrillRigs}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-600/20 border-blue-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-300 text-sm font-medium">Monthly Ore Yield (Tonnes)</p>
                      <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{monthlyOreYield}</p>
                    </div>
                    <Settings className="w-8 h-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Operational Health Overview */}
            <Card className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-orange-400">
                  Operational Health Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`h-64 rounded-lg border flex items-center justify-center ${
                  isDarkMode ? 'bg-gray-900/50 border-gray-600' : 'bg-gray-50 border-gray-300'
                }`}>
                  <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    System Health Chart - Real-time monitoring active
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* MineNest™ Core Protocol */}
            <Card className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-purple-300">MineNest™ Core Protocol Snapshot</CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  MineNest™ ensures secure, real-time data flows for the Mining & Resources industry.
                </p>
                <h4 className="text-lg font-semibold text-purple-300 mb-3">Key Features:</h4>
                <ul className={`space-y-2 mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <li>• Real-time Metrics Overview for immediate insights.</li>
                  <li>• VaultTrace™ Ledger Entries for secure and transparent logging.</li>
                  <li>• Integrated Compliance via VaultLink™ for mining-specific regulations.</li>
                  <li>• Scalable Node Expansion for adapting to fluctuating demands.</li>
                  <li>• Predictive Analytics for proactive decision-making.</li>
                </ul>
                <Button className="bg-yellow-600 hover:bg-yellow-700 text-black font-semibold">
                  Go to FAA™ Mining & Resources Public Page →
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {activeView === 'projects' && (
          <div className="space-y-6">
            <Card className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-orange-400">
                  Your Mining Projects & Operations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <input 
                    type="text" 
                    placeholder="Search projects..." 
                    className={`flex-grow p-3 rounded-lg border ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                  <select className={`p-3 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}>
                    <option value="all">All Statuses</option>
                    <option value="live">Active</option>
                    <option value="pending">Exploration</option>
                    <option value="draft">Planned</option>
                    <option value="error">Maintenance</option>
                  </select>
                </div>

                {/* MineNest™ Brands Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mineNestBrands.map((brandName, index) => (
                    <Card key={index} className={`transition-colors hover:border-orange-500/50 ${
                      isDarkMode 
                        ? 'bg-gray-800/70 border-gray-600' 
                        : 'bg-white border-gray-200'
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {brandName}
                          </h3>
                          <Badge className={statusColor(index % 3 === 0 ? 'development' : 'active')}>
                            {index % 3 === 0 ? 'development' : 'active'}
                          </Badge>
                        </div>
                        <p className={`text-xs mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Advanced mining & resources management solution with VaultMesh™ integration
                        </p>
                        
                        {/* Subnodes */}
                        {mineNestSubnodes[index] && (
                          <div className="mb-3">
                            <p className="text-xs font-medium text-orange-400 mb-1">Subnodes:</p>
                            <div className="flex flex-wrap gap-1">
                              {mineNestSubnodes[index].map((subnode, subIndex) => (
                                <span key={subIndex} className={`text-xs px-2 py-1 rounded ${
                                  isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                                }`}>
                                  {subnode}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-orange-400 font-medium">VaultMesh™</span>
                          <Button size="sm" variant="outline" className="text-xs">
                            Manage
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="text-center mt-6">
                  <Button className="bg-yellow-600 hover:bg-yellow-700 text-black">
                    <Plus className="w-4 h-4 mr-2" />
                    Load More Projects
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeView === 'new-project' && (
          <Card className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-orange-400">
                <Plus className="inline w-5 h-5 mr-2" />
                Initiate a New Mining Project
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Project Name
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Deep Earth Exploration Alpha Site"
                    className={`w-full p-3 rounded-lg border ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Choose Template
                  </label>
                  <select className={`w-full p-3 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}>
                    <option>Select mining template...</option>
                    <option>Open Pit Mining</option>
                    <option>Underground Mining</option>
                    <option>Placer Mining</option>
                    <option>In-Situ Mining</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Project Description
                  </label>
                  <div className="flex gap-2">
                    <textarea 
                      rows={5}
                      placeholder="Describe the scope, objectives, and resources for this mining project..."
                      className={`flex-grow p-3 rounded-lg border ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                    <Button className="bg-purple-600 hover:bg-purple-700 px-3 text-xs">
                      ✨ AI Generate
                    </Button>
                  </div>
                </div>

                <Button className="bg-yellow-600 hover:bg-yellow-700 text-black font-semibold w-full py-3">
                  Create Mining Project
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Other views placeholder */}
        {activeView !== 'dashboard' && activeView !== 'projects' && activeView !== 'new-project' && (
          <Card className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-orange-400 mb-4">
                {mineNestNavigation.find(nav => nav.id === activeView)?.name}
              </h2>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                This section is under development. Full MineNest™ functionality coming soon.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}