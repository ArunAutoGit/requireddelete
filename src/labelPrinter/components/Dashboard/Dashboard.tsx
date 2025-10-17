import { QrCode, Clock, CheckCircle, AlertCircle, Tags, Package, FileText, RefreshCw } from 'lucide-react';
import { usePrinterKPI } from '../../hooks/usePrinterKPI';

interface DashboardProps {
  isDark: boolean;
  onTabChange: (tab: string) => void;
  language: 'en' | 'hi';
}

export default function Dashboard({ isDark, onTabChange, language }: DashboardProps) {
  const { data: kpiData, loading, error, refetch } = usePrinterKPI();

  const texts = {
    en: {
      welcome: 'Welcome back, Printer User!',
      pendingMessage: "Here's what's happening with your platform today.",
      totalGenerated: 'Total QR Generated',
      pending: 'Pending Printing',
      printed: 'Printed Batches',
      failed: 'Failed',
      quickActions: 'Quick Actions',
      quickActionsDesc: 'Common tasks and operations',
      recentActivity: 'Recent Activity',
      errorLoading: 'Error Loading Dashboard',
      retry: 'Retry',
      refresh: 'Refresh Data',
      platformOverview: 'Platform Overview',
      keyMetrics: 'Key metrics and statistics',
      activities: [
        { action: 'Printed batch #1247', time: '2 minutes ago', status: 'success' },
        { action: 'Generated 50 labels', time: '15 minutes ago', status: 'info' },
        { action: 'Print job failed', time: '1 hour ago', status: 'error' },
      ]
    },
    hi: {
      welcome: 'वापसी पर स्वागत है, प्रिंटर उपयोगकर्ता!',
      pendingMessage: 'आज आपके प्लेटफ़ॉर्म पर क्या हो रहा है।',
      totalGenerated: 'कुल QR जेनरेट किए गए',
      pending: 'प्रिंटिंग लंबित',
      printed: 'प्रिंट किए गए बैच',
      failed: 'असफल',
      quickActions: 'त्वरित कार्य',
      quickActionsDesc: 'सामान्य कार्य और संचालन',
      recentActivity: 'हाल की गतिविधि',
      errorLoading: 'डैशबोर्ड लोड करने में त्रुटि',
      retry: 'पुनः प्रयास',
      refresh: 'डेटा रीफ्रेश करें',
      platformOverview: 'प्लेटफ़ॉर्म अवलोकन',
      keyMetrics: 'मुख्य मेट्रिक्स और आंकड़े',
      activities: [
        { action: 'बैच #1247 प्रिंट किया गया', time: '2 मिनट पहले', status: 'success' },
        { action: '50 लेबल जेनरेट किए गए', time: '15 मिनट पहले', status: 'info' },
        { action: 'प्रिंट जॉब असफल', time: '1 घंटा पहले', status: 'error' },
      ]
    }
  };

  const currentTexts = texts[language];

  const stats = [
    {
      title: currentTexts.totalGenerated,
      value: loading ? '-' : kpiData?.total_qr_generated?.toString() || '0',
      icon: QrCode,
      color: 'blue',
    },
    {
      title: currentTexts.pending,
      value: loading ? '-' : kpiData?.pending_printing?.toString() || '0',
      icon: Clock,
      color: 'yellow',
    },
    {
      title: currentTexts.printed,
      value: loading ? '-' : kpiData?.printed_batches?.toString() || '0',
      icon: CheckCircle,
      color: 'green',
    }
  ];

  const quickActions = [
    { id: 'generation', icon: Tags, label: { en: 'Label Generation', hi: 'लेबल जेनरेशन' } },
    { id: 'batches', icon: Package, label: { en: 'Batches', hi: 'बैचेस' } },
    { id: 'reports', icon: FileText, label: { en: 'Reports', hi: 'रिपोर्ट' } },
  ];

  // Error state
  if (error) {
    return (
      <div className={`p-6 space-y-6 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
        <div className={`
          ${isDark ? 'bg-red-900/20 border-red-700' : 'bg-red-50 border-red-200'}
          border rounded-lg p-4
        `}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className={`h-5 w-5 mr-2 ${isDark ? 'text-red-400' : 'text-red-400'}`} />
              <div>
                <h3 className={`text-sm font-medium ${isDark ? 'text-red-400' : 'text-red-800'}`}>
                  {currentTexts.errorLoading}
                </h3>
                <p className={`text-sm mt-1 ${isDark ? 'text-red-300' : 'text-red-700'}`}>{error}</p>
              </div>
            </div>
            <button
              onClick={refetch}
              className={`
                px-3 py-1 rounded text-sm flex items-center transition-colors
                ${isDark
                  ? 'bg-red-800/30 hover:bg-red-700/40 text-red-300'
                  : 'bg-red-100 hover:bg-red-200 text-red-800'
                }
              `}
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
    <div className={`p-6 space-y-6 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Header with Blue Background */}
      <div className={`
        p-5 rounded-xl
        ${isDark 
          ? 'bg-gradient-to-r from-[#0066cc]/100 to-[#0066cc]/100 border border-[#0066cc]/30' 
          : 'bg-gradient-to-r from-[#0066cc]/100 to-[#0066cc]/100 border border-[#0066cc]/20'
        }
      `}>
        <h1 className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-white'}`}>
          {currentTexts.welcome}
        </h1>
        <p className={`text-base ${isDark ? 'text-white' : 'text-white'}`}>
          {currentTexts.pendingMessage}
        </p>
      </div>

      {/* Stats Section with Header and Refresh Button */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {currentTexts.platformOverview}
            </h2>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {currentTexts.keyMetrics}
            </p>
          </div>
          <button
            onClick={refetch}
            disabled={loading}
            className={`
              flex items-center px-3 py-2 text-sm font-medium border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066cc] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm
              ${isDark
                ? 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }
            `}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {currentTexts.refresh}
          </button>
        </div>

        {/* Stats Cards - Reduced spacing */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className={`
                  ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
                  rounded-xl border p-5 shadow-sm hover:shadow-md transition-all duration-200
                `}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {stat.title}
                    </p>
                    {loading ? (
                      <div className="animate-pulse">
                        <div className={`h-8 rounded w-16 mb-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                      </div>
                    ) : (
                      <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {stat.value}
                      </p>
                    )}
                  </div>
                  <div className={`
                    p-2.5 rounded-lg
                    ${stat.color === 'blue' ? (isDark ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-50 text-blue-600') : ''}
                    ${stat.color === 'yellow' ? (isDark ? 'bg-yellow-900/20 text-yellow-400' : 'bg-yellow-50 text-yellow-600') : ''}
                    ${stat.color === 'green' ? (isDark ? 'bg-green-900/20 text-green-400' : 'bg-green-50 text-green-600') : ''}
                    ${stat.color === 'red' ? (isDark ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-600') : ''}
                    ${loading ? 'animate-pulse' : ''}
                  `}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className={`
        ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
        border rounded-xl shadow-sm overflow-hidden
      `}>
        <div className={`
          p-5 border-b
          ${isDark ? 'border-gray-700' : 'border-gray-100'}
        `}>
          <h3 className={`text-lg font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {currentTexts.quickActions}
          </h3>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {currentTexts.quickActionsDesc}
          </p>
        </div>

        {/* Grid of Quick Actions */}
        <div className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label[language]}
                  onClick={() => onTabChange(action.id)}
                  className={`
                    group p-6 rounded-xl text-center transition-all duration-300 border focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 hover:scale-105 hover:shadow-lg
                    ${isDark
                      ? 'bg-gray-700 border-gray-600 hover:bg-gradient-to-br hover:from-yellow-900/20 hover:to-yellow-800/30 hover:border-yellow-600'
                      : 'bg-gray-50 border-gray-100 hover:bg-gradient-to-br hover:from-yellow-50 hover:to-yellow-100 hover:border-yellow-200'
                    }
                  `}
                >
                  <div className={`
                    inline-flex items-center justify-center w-12 h-12 rounded-lg transition-colors duration-300 mb-4 shadow-sm
                    ${isDark
                      ? 'bg-gray-600 group-hover:bg-yellow-800/40'
                      : 'bg-white group-hover:bg-yellow-100'
                    }
                  `}>
                    <Icon className={`
                      w-6 h-6 transition-colors duration-300
                      ${isDark
                        ? 'text-gray-300 group-hover:text-yellow-400'
                        : 'text-gray-600 group-hover:text-yellow-700'
                      }
                    `} />
                  </div>
                  <h4 className={`
                    text-sm font-medium leading-tight transition-colors duration-300
                    ${isDark
                      ? 'text-gray-200 group-hover:text-gray-100'
                      : 'text-gray-900 group-hover:text-gray-800'
                    }
                  `}>
                    {action.label[language]}
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
