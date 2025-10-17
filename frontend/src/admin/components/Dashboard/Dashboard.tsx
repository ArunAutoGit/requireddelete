
import {
  CheckCircle,
  Clock,
  Package,
  AlertCircle,
  RefreshCw,
  UserPlus,
  Settings,
  Wrench,
  FileText
} from 'lucide-react';
import { StatsCard } from './StatsCard';
import { useNavigate } from 'react-router-dom';
import { useAdminKPI } from '../../hooks/useAdminKPI';
import { DashboardProps } from '../../types/components';

// interface DashboardProps {
//   language: 'en' | 'hi';
// }

function Dashboard({ language }: DashboardProps) {
  const navigate = useNavigate();
  const { data: kpiData, loading, error, refetch } = useAdminKPI();

  const texts = {
    en: {
      welcome: 'Welcome back, Admin!',
      pendingMessage: "Here's what's happening with your platform today.",
      quickActions: 'Quick Actions',
      quickActionsDesc: 'Common administrative tasks and operations',
      errorLoading: 'Error Loading Dashboard',
      retry: 'Retry',
      refresh: 'Refresh Data',
      platformOverview: 'Platform Overview',
      keyMetrics: 'Key metrics and statistics',
    },
    hi: {
      welcome: 'वापसी पर स्वागत है, व्यवस्थापक!',
      pendingMessage: 'आज आपके प्लेटफ़ॉर्म पर क्या हो रहा है।',
      quickActions: 'त्वरित कार्य',
      quickActionsDesc: 'सामान्य प्रशासनिक कार्य और संचालन',
      errorLoading: 'डैशबोर्ड लोड करने में त्रुटि',
      retry: 'पुनः प्रयास',
      refresh: 'डेटा रीफ्रेश करें',
      platformOverview: 'प्लेटफ़ॉर्म अवलोकन',
      keyMetrics: 'मुख्य मेट्रिक्स और आंकड़े',
    }
  };

  const currentTexts = texts[language];

  const quickActions = [
    {
      name: { en: 'Add User', hi: 'उपयोगकर्ता जोड़ें' },
      href: '/admin/users',
      icon: UserPlus,
    },
    {
      name: { en: 'Approve MSR', hi: 'एमएसआर अनुमोदन' },
      href: '/admin/msr-approval',
      icon: CheckCircle,
    },
    {
      name: { en: 'Product Management', hi: 'उत्पाद प्रबंधन' },
      href: '/admin/products',
      icon: Package,
    },
    {
      name: { en: 'Asset Allocation', hi: 'संपत्ति आवंटन' },
      href: '/admin/assets',
      icon: Settings,
    },
    {
      name: { en: 'MSR-Mechanic Visit', hi: 'एमएसआर-मैकेनिक विजिट' },
      href: '/admin/visits',
      icon: Wrench,
    },
    {
      name: { en: 'Reports', hi: 'रिपोर्ट' },
      href: '/admin/reports',
      icon: FileText,
    }
  ];

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-red-800">
                  {currentTexts.errorLoading}
                </h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
            <button
              onClick={refetch}
              className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded text-sm flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              {currentTexts.retry}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Blue Background */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-[#0066cc]/100 to-[#0066cc]/100 border border-[#0066cc]/20">
        <h1 className="text-2xl font-bold mb-1 text-white">
          {currentTexts.welcome}
        </h1>
        <p className="text-base text-white">
          {currentTexts.pendingMessage}
        </p>
      </div>

      {/* Stats Section with Header and Refresh Button */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {currentTexts.platformOverview}
            </h2>
            <p className="text-sm text-gray-500">
              {currentTexts.keyMetrics}
            </p>
          </div>
          <button
            onClick={refetch}
            disabled={loading}
            className="flex items-center px-3 py-2 text-sm font-medium border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066cc] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {currentTexts.refresh}
          </button>
        </div>

        {/* Stats Cards - Reduced spacing */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <StatsCard
            title={{ en: 'Pending MSR Approvals', hi: 'लंबित एमएसआर अनुमोदन' }}
            value={loading ? '-' : kpiData?.pending_msr_approvals?.toString() || '0'}
            changeType="neutral"
            icon={Clock}
            color="yellow"
            language={language}
            loading={loading}
          />
          <StatsCard
            title={{ en: 'Total Products', hi: 'कुल उत्पाद' }}
            value={loading ? '-' : kpiData?.total_products?.toString() || '0'}
            changeType="neutral"
            icon={Package}
            color="blue"
            language={language}
            loading={loading}
          />
          <StatsCard
            title={{ en: 'Total Approved MSR', hi: 'कुल अनुमोदित एमएसआर' }}
            value={loading ? '-' : kpiData?.total_approved_msr?.toString() || '0'}
            changeType="positive"
            icon={CheckCircle}
            color="green"
            language={language}
            loading={loading}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="text-lg font-semibold mb-1 text-gray-900">
            {currentTexts.quickActions}
          </h3>
          <p className="text-sm text-gray-600">
            {currentTexts.quickActionsDesc}
          </p>
        </div>

        {/* Grid of Quick Actions */}
        <div className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={() => navigate(action.href)}
                  className="group p-6 rounded-xl text-center transition-all duration-300 border focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 hover:scale-105 hover:shadow-lg bg-gray-50 border-gray-100 hover:bg-gradient-to-br hover:from-yellow-50 hover:to-yellow-100 hover:border-yellow-200"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg transition-colors duration-300 mb-4 shadow-sm bg-white group-hover:bg-yellow-100">
                    <Icon className="w-6 h-6 transition-colors duration-300 text-gray-600 group-hover:text-yellow-700" />
                  </div>
                  <h4 className="text-sm font-medium leading-tight transition-colors duration-300 text-gray-900 group-hover:text-gray-800">
                    {action.name[language]}
                  </h4>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
