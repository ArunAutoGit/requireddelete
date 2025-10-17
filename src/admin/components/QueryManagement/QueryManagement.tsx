import React, { useState } from 'react';
import { Search, Filter, MessageSquare, Clock, CheckCircle, AlertTriangle, ArrowUp, Eye, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { Query, QueryResponse } from '../../types/query';

// interface Query {
//   id: string;
//   referenceId: string;
//   msrName: string;
//   msrId: string;
//   queryType: 'Technical' | 'Payment' | 'Product' | 'General';
//   subject: string;
//   description: string;
//   status: 'Open' | 'In Progress' | 'Resolved' | 'Escalated';
//   priority: 'Low' | 'Medium' | 'High' | 'Critical';
//   createdDate: string;
//   lastUpdated: string;
//   assignedTo?: string;
//   responses: QueryResponse[];
//   attachments?: string[];
// }

// interface QueryResponse {
//   id: string;
//   respondedBy: string;
//   response: string;
//   timestamp: string;
//   isAdmin: boolean;
// }

// Translation interface
interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  en: {
    // Header
    queryManagement: "Query Management",
    reviewQueries: "Review and respond to user queries",
    
    // Stats Cards
    openQueries: "Open Queries",
    inProgress: "In Progress",
    resolved: "Resolved",
    escalated: "Escalated",
    
    // Filters
    searchQueries: "Search queries...",
    allStatus: "All Status",
    allPriority: "All Priority",
    
    // Table Headers
    queryDetails: "Query Details",
    msrInfo: "MSR Info",
    typePriority: "Type & Priority",
    status: "Status",
    lastUpdated: "Last Updated",
    actions: "Actions",
    responses: "responses",
    
    // Query Types
    Technical: "Technical",
    Payment: "Payment",
    Product: "Product",
    General: "General",
    
    // Modal
    originalQuery: "Original Query",
    created: "Created",
    addResponse: "Add Response",
    typeResponse: "Type your response here...",
    markResolved: "Mark as Resolved",
    escalate: "Escalate",
    sendResponse: "Send Response",
    by: "By",
  },
  hi: {
    // Header
    queryManagement: "क्वेरी प्रबंधन",
    reviewQueries: "उपयोगकर्ता प्रश्नों की समीक्षा करें और उत्तर दें",
    
    // Stats Cards
    openQueries: "खुले प्रश्न",
    inProgress: "प्रगति में",
    resolved: "हल हो गए",
    escalated: "एस्केलेटेड",
    
    // Filters
    searchQueries: "क्वेरी खोजें...",
    allStatus: "सभी स्थिति",
    allPriority: "सभी प्राथमिकता",
    
    // Table Headers
    queryDetails: "क्वेरी विवरण",
    msrInfo: "एमएसआर जानकारी",
    typePriority: "प्रकार और प्राथमिकता",
    status: "स्थिति",
    lastUpdated: "अंतिम अद्यतन",
    actions: "कार्रवाई",
    responses: "जवाब",
    
    // Query Types
    Technical: "तकनीकी",
    Payment: "भुगतान",
    Product: "उत्पाद",
    General: "सामान्य",
    
    // Modal
    originalQuery: "मूल प्रश्न",
    created: "बनाया गया",
    addResponse: "उत्तर जोड़ें",
    typeResponse: "अपना उत्तर यहाँ टाइप करें...",
    markResolved: "हल के रूप में चिह्नित करें",
    escalate: "एस्केलेट",
    sendResponse: "उत्तर भेजें",
    by: "द्वारा",
  }
};

const mockQueries: Query[] = [
  {
    id: '1',
    referenceId: 'REF001',
    msrName: 'John Doe',
    msrId: 'MSR001',
    queryType: 'Payment',
    subject: 'Payment not received for approved coupons',
    description: 'I have submitted coupons worth ₹4,600 which were approved on 2024-12-05, but payment has not been received yet. Please check the status.',
    status: 'Open',
    priority: 'High',
    createdDate: '2024-12-08',
    lastUpdated: '2024-12-08',
    responses: []
  },
  {
    id: '2',
    referenceId: 'REF002',
    msrName: 'Jane Smith',
    msrId: 'MSR002',
    queryType: 'Technical',
    subject: 'QR code scanning issues',
    description: 'Unable to scan QR codes properly. The app shows error "Invalid QR format" for valid coupons.',
    status: 'In Progress',
    priority: 'Medium',
    createdDate: '2024-12-07',
    lastUpdated: '2024-12-09',
    assignedTo: 'Tech Support',
    responses: [
      {
        id: '1',
        respondedBy: 'Tech Support',
        response: 'We are investigating this issue. Please try updating the app to the latest version.',
        timestamp: '2024-12-08T10:30:00Z',
        isAdmin: true
      },
      {
        id: '2',
        respondedBy: 'Jane Smith',
        response: 'I have updated the app but the issue persists. Please help.',
        timestamp: '2024-12-09T09:15:00Z',
        isAdmin: false
      }
    ]
  },
  {
    id: '3',
    referenceId: 'REF003',
    msrName: 'Mike Johnson',
    msrId: 'MSR003',
    queryType: 'Product',
    subject: 'Product not found in system',
    description: 'Trying to scan coupons for Castrol GTX 20W-50 but product is not found in the system.',
    status: 'Resolved',
    priority: 'Low',
    createdDate: '2024-12-05',
    lastUpdated: '2024-12-06',
    assignedTo: 'Product Team',
    responses: [
      {
        id: '1',
        respondedBy: 'Product Team',
        response: 'The product has been added to the system. You can now scan coupons for this product.',
        timestamp: '2024-12-06T14:20:00Z',
        isAdmin: true
      }
    ]
  }
];

interface QueryManagementProps {
  language: 'en' | 'hi';
}

export function QueryManagement({ language }: QueryManagementProps) {
  const [queries, setQueries] = useState<Query[]>(mockQueries);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [responseText, setResponseText] = useState('');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const filteredQueries = queries.filter(query => {
    const matchesSearch = query.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         query.msrName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         query.referenceId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || query.status === selectedStatus;
    const matchesPriority = selectedPriority === 'all' || query.priority === selectedPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleStatusChange = (queryId: string, newStatus: Query['status']) => {
    setQueries(prev => prev.map(query =>
      query.id === queryId ? {
        ...query,
        status: newStatus,
        lastUpdated: new Date().toISOString().split('T')[0]
      } : query
    ));
    toast.success(`Query status updated to ${newStatus}`);
  };

  const handleEscalate = (queryId: string) => {
    handleStatusChange(queryId, 'Escalated');
    toast.success('Query escalated to higher authority');
  };

  const handleAddResponse = () => {
    if (!selectedQuery || !responseText.trim()) return;

    const newResponse: QueryResponse = {
      id: Date.now().toString(),
      respondedBy: 'Admin',
      response: responseText,
      timestamp: new Date().toISOString(),
      isAdmin: true
    };

    setQueries(prev => prev.map(query =>
      query.id === selectedQuery.id ? {
        ...query,
        responses: [...query.responses, newResponse],
        status: 'In Progress' as const,
        lastUpdated: new Date().toISOString().split('T')[0]
      } : query
    ));

    setResponseText('');
    toast.success('Response added successfully');
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      Open: 'bg-red-100 text-red-800',
      'In Progress': 'bg-yellow-100 text-yellow-800',
      Resolved: 'bg-green-100 text-green-800',
      Escalated: 'bg-purple-100 text-purple-800'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status as keyof typeof statusClasses]}`}>
        {t(status)}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityClasses = {
      Low: 'bg-gray-100 text-gray-800',
      Medium: 'bg-blue-100 text-blue-800',
      High: 'bg-orange-100 text-orange-800',
      Critical: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityClasses[priority as keyof typeof priorityClasses]}`}>
        {t(priority)}
      </span>
    );
  };

  const getQueryTypeIcon = (type: string) => {
    const icons = {
      Technical: AlertTriangle,
      Payment: CheckCircle,
      Product: MessageSquare,
      General: MessageCircle
    };
    const Icon = icons[type as keyof typeof icons] || MessageSquare;
    return <Icon className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('queryManagement')}</h1>
          <p className="text-gray-600">{t('reviewQueries')}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('openQueries')}</p>
              <p className="text-2xl font-bold text-gray-900">
                {queries.filter(q => q.status === 'Open').length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-red-50">
              <Clock className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('inProgress')}</p>
              <p className="text-2xl font-bold text-gray-900">
                {queries.filter(q => q.status === 'In Progress').length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-[#ffff4d]/10">
              <MessageSquare className="h-6 w-6 text-[#0066cc]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('resolved')}</p>
              <p className="text-2xl font-bold text-gray-900">
                {queries.filter(q => q.status === 'Resolved').length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-50">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('escalated')}</p>
              <p className="text-2xl font-bold text-gray-900">
                {queries.filter(q => q.status === 'Escalated').length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-purple-50">
              <ArrowUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={t('searchQueries')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066cc] focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066cc] focus:border-transparent"
          >
            <option value="all">{t('allStatus')}</option>
            <option value="Open">{t('Open')}</option>
            <option value="In Progress">{t('In Progress')}</option>
            <option value="Resolved">{t('Resolved')}</option>
            <option value="Escalated">{t('Escalated')}</option>
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066cc] focus:border-transparent"
          >
            <option value="all">{t('allPriority')}</option>
            <option value="Low">{t('Low')}</option>
            <option value="Medium">{t('Medium')}</option>
            <option value="High">{t('High')}</option>
            <option value="Critical">{t('Critical')}</option>
          </select>
        </div>
      </div>

      {/* Queries Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0066cc]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">
                  {t('queryDetails')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">
                  {t('msrInfo')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">
                  {t('typePriority')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">
                  {t('status')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">
                  {t('lastUpdated')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">
                  {t('actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredQueries.map((query) => (
                <tr key={query.id} className="cursor-pointer transition-all duration-200 hover:bg-[#fff9c4] text-gray-900">
                  <td className="px-6 py-4">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 rounded-lg bg-gray-100">
                        {getQueryTypeIcon(query.queryType)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {query.subject}
                        </div>
                        <div className="text-sm text-gray-500">
                          Ref: {query.referenceId}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {query.responses.length} {t('responses')}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {query.msrName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {query.msrId}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-[#0066cc]/10 text-[#0066cc]">
                        {t(query.queryType)}
                      </span>
                      <div>
                        {getPriorityBadge(query.priority)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(query.status)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(query.lastUpdated).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => {
                          setSelectedQuery(query);
                          setShowDetailModal(true);
                        }}
                        className="text-[#0066cc] hover:text-blue-700 p-1 rounded"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {query.status !== 'Resolved' && query.status !== 'Escalated' && (
                        <button
                          onClick={() => handleEscalate(query.id)}
                          className="text-purple-600 hover:text-purple-700 p-1 rounded"
                          title="Escalate"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Query Detail Modal */}
      {showDetailModal && selectedQuery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedQuery.subject}
                  </h3>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm text-gray-500">
                      Ref: {selectedQuery.referenceId}
                    </span>
                    <span className="text-sm text-gray-500">
                      {t('by')}: {selectedQuery.msrName} ({selectedQuery.msrId})
                    </span>
                    {getStatusBadge(selectedQuery.status)}
                    {getPriorityBadge(selectedQuery.priority)}
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 max-h-96 overflow-y-auto">
              {/* Original Query */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-2">{t('originalQuery')}</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700">{selectedQuery.description}</p>
                  <div className="text-xs text-gray-500 mt-2">
                    {t('created')}: {new Date(selectedQuery.createdDate).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Responses */}
              {selectedQuery.responses.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-4">{t('responses')}</h4>
                  <div className="space-y-4">
                    {selectedQuery.responses.map((response) => (
                      <div
                        key={response.id}
                        className={`p-4 rounded-lg ${
                          response.isAdmin
                            ? 'bg-[#0066cc]/5 border-l-4 border-[#0066cc]'
                            : 'bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900">
                            {response.respondedBy}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(response.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{response.response}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add Response */}
              {selectedQuery.status !== 'Resolved' && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">{t('addResponse')}</h4>
                  <div className="space-y-4">
                    <textarea
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      placeholder={t('typeResponse')}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066cc] focus:border-transparent resize-none"
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleStatusChange(selectedQuery.id, 'Resolved')}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                        >
                          {t('markResolved')}
                        </button>
                        <button
                          onClick={() => handleEscalate(selectedQuery.id)}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                        >
                          {t('escalate')}
                        </button>
                      </div>
                      <button
                        onClick={handleAddResponse}
                        disabled={!responseText.trim()}
                        className="bg-[#0066cc] hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                      >
                        {t('sendResponse')}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}