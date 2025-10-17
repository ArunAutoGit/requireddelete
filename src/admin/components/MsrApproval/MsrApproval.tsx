import  { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import { 
  Search, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  FileText,
  CreditCard
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Pagination } from '../ProductMaster/components/Pagination';
import { MSRApiResponse, MSRApprovalProps } from '../../types/msr';

// Enhanced MSR type with computed fields
interface EnhancedMSR extends MSRApiResponse {
  address: string; // Computed from address fields
}

// Language content with both English and Hindi translations
const translations = {
  en: {
    msrApproval: {
      title: "MSR Approval Management",
      subtitle: "Review and manage MSR onboarding requests efficiently",
      searchPlaceholder: "Search by name, email, or mobile...",
      filterAll: "All Status",
      filterPending: "Pending",
      filterApproved: "Approved", 
      filterRejected: "Rejected",
      itemsPerPage: "Show:",
      showingText: "Showing {start}-{end} of {total} entries",
      previousPage: "Previous",
      nextPage: "Next",
      viewDetails: "View",
      approve: "Approve",
      reject: "Reject",
      approving: "Processing...",
      rejecting: "Processing...",
      exportData: "Export Data",
      totalApplications: "Total Applications",
      pendingReview: "Pending Review",
      approved: "Approved",
      rejected: "Rejected",
      status: {
        pending: "Pending Review",
        approved: "Approved",
        rejected: "Rejected"
      },
      detailsModal: {
        title: "MSR Details",
        personalInfo: "MSR Information",
        contactInfo: "Contact Information", 
        locationInfo: "Location Information",
        onboardedByInfo: "Onboarded By",
        bankingInfo: "Banking Details",
        close: "Close",
        fullName: "Full Name",
        email: "Email Address",
        mobile: "Mobile Number",
        address: "Address",
        onboardedBy: "Onboarded By",
        onboarderContact: "Contact",
        onboarderLocation: "Location",
        bankAccountHolder: "Account Holder Name",
        bankName: "Bank Name",
        bankAccountNumber: "Account Number",
        bankIfscCode: "IFSC Code",
        submittedDate: "Application Date",
        lastUpdated: "Last Modified"
      },
      approvalModal: {
        approveTitle: "Approve MSR",
        rejectTitle: "Reject MSR",
        approveMessage: "Are you sure you want to approve this MSR application?",
        rejectMessage: "Please provide a reason for rejecting this application:",
        reasonPlaceholder: "Enter rejection reason...",
        cancel: "Cancel",
        confirmApprove: "Approve Application",
        confirmReject: "Reject Application"
      }
    }
  },
  hi: {
    msrApproval: {
      title: "एमएसआर अनुमोदन प्रबंधन",
      subtitle: "एमएसआर ऑनबोर्डिंग अनुरोधों की समीक्षा और प्रबंधन करें",
      searchPlaceholder: "नाम, ईमेल या मोबाइल से खोजें...",
      filterAll: "सभी स्थिति",
      filterPending: "लंबित",
      filterApproved: "अनुमोदित",
      filterRejected: "अस्वीकृत",
      itemsPerPage: "दिखाएं:",
      showingText: "{total} में से {start}-{end} प्रविष्टियां दिखा रहे हैं",
      previousPage: "पिछला",
      nextPage: "अगला",
      viewDetails: "देखें",
      approve: "अनुमोदित करें",
      reject: "अस्वीकार करें",
      approving: "प्रसंस्करण...",
      rejecting: "प्रसंस्करण...",
      exportData: "डेटा निर्यात करें",
      totalApplications: "कुल आवेदन",
      pendingReview: "समीक्षा लंबित",
      approved: "अनुमोदित",
      rejected: "अस्वीकृत",
      status: {
        pending: "समीक्षा लंबित",
        approved: "अनुमोदित",
        rejected: "अस्वीकृत"
      },
      detailsModal: {
        title: "एमएसआर विवरण",
        personalInfo: "एमएसआर जानकारी",
        contactInfo: "संपर्क जानकारी",
        locationInfo: "स्थान जानकारी",
        onboardedByInfo: "द्वारा ऑनबोर्ड किया गया",
        bankingInfo: "बैंकिंग विवरण",
        close: "बंद करें",
        fullName: "पूरा नाम",
        email: "ईमेल पता",
        mobile: "मोबाइल नंबर",
        address: "पता",
        onboardedBy: "द्वारा ऑनबोर्ड किया गया",
        onboarderContact: "संपर्क",
        onboarderLocation: "स्थान",
        bankAccountHolder: "खाताधारक का नाम",
        bankName: "बैंक का नाम",
        bankAccountNumber: "खाता संख्या",
        bankIfscCode: "आईएफएससी कोड",
        submittedDate: "आवेदन तिथि",
        lastUpdated: "अंतिम संशोधन"
      },
      approvalModal: {
        approveTitle: "एमएसआर अनुमोदित करें",
        rejectTitle: "एमएसआर अस्वीकार करें",
        approveMessage: "क्या आप वाकई इस एमएसआर आवेदन को अनुमोदित करना चाहते हैं?",
        rejectMessage: "कृपया इस आवेदन को अस्वीकार करने का कारण बताएं:",
        reasonPlaceholder: "अस्वीकृति का कारण दर्ज करें...",
        cancel: "रद्द करें",
        confirmApprove: "आवेदन अनुमोदित करें",
        confirmReject: "आवेदन अस्वीकार करें"
      }
    }
  }
};


export default function MSRApproval({ language = 'en' }: MSRApprovalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedMsr, setSelectedMsr] = useState<EnhancedMSR | null>(null);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject'>('approve');
  const [rejectionReason, setRejectionReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [msrData, setMsrData] = useState<EnhancedMSR[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const t = translations[language].msrApproval;

  // Helper function to build address from components
  const buildAddress = (msr: MSRApiResponse): string => {
    const addressParts = [
      msr.address_line1,
      msr.address_line2,
      msr.district,
      msr.state,
      msr.pincode
    ].filter(Boolean);
    
    return addressParts.length > 0 ? addressParts.join(', ') : 'No address provided';
  };

  // Convert status boolean to string for filtering
  const getStatusString = (status: boolean) => {
    return status ? 'approved' : 'pending';
  };

  // Filter MSR data
  const filteredMsrData = msrData.filter((msr) => {
    const matchesSearch = 
      msr.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (msr.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (msr.mobile || '').includes(searchTerm);
    
    const statusString = getStatusString(msr.status);
    const matchesStatus = statusFilter === "all" || statusString === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate pagination
  const totalItems = filteredMsrData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredMsrData.slice(startIndex, endIndex);

  // Reset to first page when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, itemsPerPage]);

  // Fetch MSR data
  useEffect(() => {
    const fetchMSRData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await userService.getMSRsByRole();
        
        // Enhance data with computed address field
        const enhancedData: EnhancedMSR[] = data.map(msr => ({
          ...msr,
          address: buildAddress(msr)
        }));
        
        setMsrData(enhancedData);
      } catch (error) {
        console.error('Error fetching MSR data:', error);
        setError('Failed to load MSR data');
      } finally {
        setLoading(false);
      }
    };

    fetchMSRData();
  }, []);

  // Calculate statistics
  const stats = {
    total: msrData.length,
    pending: msrData.filter(msr => !msr.status).length,
    approved: msrData.filter(msr => msr.status).length,
    rejected: 0 // You can add rejected status if needed
  };

  const handleViewDetails = (msr: EnhancedMSR) => {
    setSelectedMsr(msr);
    setShowDetailsModal(true);
  };

  const handleApproveReject = (msr: EnhancedMSR, action: 'approve' | 'reject') => {
    setSelectedMsr(msr);
    setApprovalAction(action);
    setRejectionReason("");
    setShowApprovalModal(true);
  };

  const confirmApproval = async () => {
    if (!selectedMsr) return;
    
    setIsProcessing(true);
    
    try {
      if (approvalAction === 'approve') {
        await userService.approveMSR(selectedMsr.user_id);
        toast.success('MSR approved successfully!');
      } else {
        await userService.rejectMSR(selectedMsr.user_id, rejectionReason);
        toast.success('MSR rejected successfully!');
      }
      
      // Update local state
      setMsrData(prev => prev.map(msr => 
        msr.user_id === selectedMsr.user_id 
          ? { ...msr, status: approvalAction === 'approve', updated_at: new Date().toISOString() }
          : msr
      ));
      
      setShowApprovalModal(false);
      setSelectedMsr(null);
      setRejectionReason("");
    } catch (error) {
      console.error('Error updating MSR status:', error);
      toast.error('Failed to update MSR status');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const getStatusBadge = (onboarding_status: string) => {
    if (onboarding_status === 'approved') {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
          {t.status.approved}
        </span>
      );
    } else if (onboarding_status === 'pending') {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
          {t.status.pending}
        </span>
      );
    }
    else {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
          {t.status.rejected}
        </span>
      );
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading MSR data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-red-200 p-6">
          <div className="flex items-center text-red-600">
            <XCircle className="w-5 h-5 mr-2" />
            <span>{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
          <p className="text-gray-600">{t.subtitle}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                {t.totalApplications}
              </p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="p-3 rounded-lg bg-[#ffff4d]/10">
              <FileText className="h-6 w-6 text-[#0066cc]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                {t.pendingReview}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.pending}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-50">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t.approved}</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.approved}
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
              <p className="text-sm font-medium text-gray-600">{t.rejected}</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.rejected}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-red-50">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066cc] focus:border-transparent"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066cc] focus:border-transparent"
          >
            <option value="all">{t.filterAll}</option>
            <option value="pending">{t.filterPending}</option>
            <option value="approved">{t.filterApproved}</option>
          </select>

          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066cc] focus:border-transparent"
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
          </select>

          <div className="text-sm text-gray-600 flex items-center">
            {t.showingText
              .replace("{start}", (startIndex + 1).toString())
              .replace("{end}", Math.min(endIndex, totalItems).toString())
              .replace("{total}", totalItems.toString())}
          </div>
        </div>
      </div>

      {/* MSR Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0066cc]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">
                  MSR Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">
                  Contact Information
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">
                  Onboarded By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[...currentItems]
                .sort(
                  (a, b) =>
                    new Date(b.updated_at).getTime() -
                    new Date(a.updated_at).getTime()
                )
                .map((msr) => (
                  <tr
                    key={msr.user_id}
                    className="cursor-pointer transition-all duration-200 hover:bg-[#fff9c4] text-gray-900"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-gray-100">
                          <User className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {msr.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {msr.user_id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 flex items-center">
                          <Mail className="w-4 h-4 text-gray-400 mr-2" />
                          {msr.email || "No email"}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <Phone className="w-4 h-4 text-gray-400 mr-2" />
                          {msr.mobile || "No mobile"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-900">
                        <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                        <div className="truncate max-w-48">{msr.address}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {msr.onboarder.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {msr.onboarder.mobile}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(msr.onboarding_status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleViewDetails(msr)}
                          className="text-[#0066cc] hover:text-blue-700 p-1 rounded"
                          title={t.viewDetails}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {msr.onboarding_status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                handleApproveReject(msr, "approve")
                              }
                              className="text-green-600 hover:text-green-700 p-1 rounded"
                              title={t.approve}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleApproveReject(msr, "reject")}
                              className="text-red-600 hover:text-red-700 p-1 rounded"
                              title={t.reject}
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          language={language}
        />
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedMsr && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t.detailsModal.title}: {selectedMsr.name}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  {t.detailsModal.personalInfo}
                </h4>
                <div className="space-y-2 pl-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t.detailsModal.fullName}
                    </label>
                    <p className="text-gray-900">{selectedMsr.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      User ID
                    </label>
                    <p className="text-gray-900">{selectedMsr.user_id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Role
                    </label>
                    <p className="text-gray-900 capitalize">
                      {selectedMsr.role}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  {t.detailsModal.contactInfo}
                </h4>
                <div className="space-y-2 pl-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t.detailsModal.email}
                    </label>
                    <p className="text-gray-900">
                      {selectedMsr.email || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t.detailsModal.mobile}
                    </label>
                    <p className="text-gray-900">
                      {selectedMsr.mobile || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  {t.detailsModal.locationInfo}
                </h4>
                <div className="space-y-2 pl-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t.detailsModal.address}
                    </label>
                    <p className="text-gray-900">{selectedMsr.address}</p>
                  </div>
                </div>
              </div>

              {/* Onboarded By Information */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  {t.detailsModal.onboardedByInfo}
                </h4>
                <div className="space-y-2 pl-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t.detailsModal.onboardedBy}
                    </label>
                    <p className="text-gray-900">
                      {selectedMsr.onboarder.name}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t.detailsModal.onboarderContact}
                    </label>
                    <p className="text-gray-900">
                      {selectedMsr.onboarder.email}
                    </p>
                    <p className="text-gray-900">
                      {selectedMsr.onboarder.mobile}
                    </p>
                  </div>
                </div>
              </div>

              {/* Banking Information */}
              <div className="md:col-span-2 space-y-4">
                <h4 className="font-medium text-gray-900 flex items-center">
                  <CreditCard className="w-4 h-4 mr-2" />
                  {t.detailsModal.bankingInfo}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t.detailsModal.bankAccountHolder}
                    </label>
                    <p className="text-gray-900">
                      {selectedMsr.bank_account_holder || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t.detailsModal.bankName}
                    </label>
                    <p className="text-gray-900">
                      {selectedMsr.bank_name || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t.detailsModal.bankAccountNumber}
                    </label>
                    <p className="text-gray-900 font-mono">
                      {selectedMsr.bank_account_number || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t.detailsModal.bankIfscCode}
                    </label>
                    <p className="text-gray-900 font-mono">
                      {selectedMsr.bank_ifsc_code || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Timeline Information */}
              <div className="md:col-span-2 space-y-4">
                <h4 className="font-medium text-gray-900 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Timeline
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t.detailsModal.submittedDate}
                    </label>
                    <p className="text-gray-900">
                      {new Date(selectedMsr.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t.detailsModal.lastUpdated}
                    </label>
                    <p className="text-gray-900">
                      {new Date(selectedMsr.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <div>{getStatusBadge(selectedMsr.onboarding_status)}</div>
                  </div>
                </div>
                {selectedMsr.onboarding_status === "rejected" && (
                  <div className="pl-6 mt-4">
                    <label className="block text-sm font-medium text-red-600">
                      Rejection Reason
                    </label>
                    <p className="text-gray-900">
                      {selectedMsr.rejection_reason || "Not provided"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300"
              >
                {t.detailsModal.close}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approval/Rejection Modal */}
      {showApprovalModal && selectedMsr && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {approvalAction === "approve"
                ? t.approvalModal.approveTitle
                : t.approvalModal.rejectTitle}
            </h3>
            <p className="text-gray-600 mb-6">
              {approvalAction === "approve"
                ? t.approvalModal.approveMessage
                : t.approvalModal.rejectMessage}
            </p>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {selectedMsr.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </span>
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900">
                    {selectedMsr.name}
                  </p>
                  <p className="text-sm text-gray-600">{selectedMsr.email}</p>
                  <p className="text-sm text-gray-600">{selectedMsr.mobile}</p>
                </div>
              </div>
            </div>

            {approvalAction === "reject" && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder={t.approvalModal.reasonPlaceholder}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066cc] focus:border-transparent resize-none"
                />
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowApprovalModal(false);
                  setSelectedMsr(null);
                  setRejectionReason("");
                }}
                className="px-4 py-2 bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300"
                disabled={isProcessing}
              >
                {t.approvalModal.cancel}
              </button>
              <button
                onClick={confirmApproval}
                disabled={isProcessing}
                className={`px-4 py-2 rounded-lg text-white transition-colors disabled:opacity-50 ${
                  approvalAction === "approve"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {isProcessing
                  ? approvalAction === "approve"
                    ? t.approving
                    : t.rejecting
                  : approvalAction === "approve"
                  ? t.approvalModal.confirmApprove
                  : t.approvalModal.confirmReject}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
