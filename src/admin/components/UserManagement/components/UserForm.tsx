// components/UserForm.tsx
import { useState, useRef, useEffect } from "react";
import { X, Eye, EyeOff, ChevronDown } from "lucide-react";
import {
  FormUserRole,
  UserFormProps,
  ValidationErrors,
} from "../../../types/user";
import { validateEmail } from "../../../utils/validation";

export function UserForm({
  isOpen,
  isUpdate = false,
  userData,
  t,
  isLoading,
  onClose,
  onSubmit,
  onUserDataChange,
}: UserFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
  const [stateSearchTerm, setStateSearchTerm] = useState("");
  const stateDropdownRef = useRef<HTMLDivElement>(null);

  // Plant location options for printer users (just numbers)
  const plantLocationOptions = ["01", "02", "03", "04", "05"];

  // All Indian states and Union Territories
  const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry",
  ];

  const filteredStates = indianStates.filter((state) =>
    state.toLowerCase().includes(stateSearchTerm.toLowerCase())
  );

  // Validation helpers
  const validateMobileNumber = (mobile: string): boolean => {
    const mobileRegex = /^[6-9]\d{9}$/;
    return mobileRegex.test(mobile);
  };

  const validatePincode = (pincode: string): boolean => {
    const pincodeRegex = /^\d{6}$/;
    return pincodeRegex.test(pincode);
  };

  const validatePassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const validateBankAccount = (accountNumber: string): boolean => {
    const bankAccountRegex = /^\d{9,18}$/;
    return bankAccountRegex.test(accountNumber);
  };

  const validateIFSC = (ifsc: string): boolean => {
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    return ifscRegex.test(ifsc.toUpperCase());
  };

  const validateName = (name: string): boolean => {
    const nameRegex = /^[A-Za-z\s]{2,50}$/;
    return nameRegex.test(name);
  };

  // New: VPA/UPI validation (simple conservative regex)
  const validateVPA = (vpa: string): boolean => {
    // allow letters/numbers/._- before @; provider part letters/numbers/dot/dash
    const vpaRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z0-9.-]{2,64}$/;
    return vpaRegex.test(vpa);
  };

  // Real-time validation
  const validateField = (
    fieldName: keyof ValidationErrors,
    value: string
  ): string => {
    switch (fieldName) {
      case "name":
        if (!value.trim()) return "Name is required";
        if (!validateName(value))
          return "Name should contain only letters and spaces (2-50 characters)";
        return "";

      case "email":
        if (!value.trim()) return "Email is required";
        if (!validateEmail(value)) return "Please enter a valid email address";
        return "";

      case "mobile":
        if (!value.trim()) return "";
        if (!validateMobileNumber(value))
          return "Mobile number must be 10 digits starting with 6-9";
        return "";

      case "pincode":
        if (!value.trim()) return "";
        if (!validatePincode(value)) return "Pincode must be exactly 6 digits";
        return "";

      case "password":
        if (!isUpdate && !value.trim()) return "Password is required";
        if (value && !validatePassword(value))
          return "Password must be at least 8 characters with letters and numbers";
        return "";

      case "bankAccount":
        if (!value.trim()) return "";
        if (!validateBankAccount(value))
          return "Bank account number must be 9-18 digits";
        return "";

      case "ifsc":
        if (!value.trim()) return "";
        if (!validateIFSC(value))
          return "IFSC code format: ABCD0123456 (4 letters + 0 + 6 characters)";
        return "";

      case "vpa":
        if (!value.trim()) return "";
        if (!validateVPA(value))
          return "VPA should look like: example@bank (letters/numbers ._- before @)";
        return "";

      default:
        return "";
    }
  };

  // Blur handlers
  const handleFieldBlur = (
    fieldName: keyof ValidationErrors,
    value: string
  ) => {
    const error = validateField(fieldName, value);
    setValidationErrors((prev) => ({
      ...prev,
      [fieldName]: error,
    }));
  };

  const handleFieldChange = (
    fieldName: keyof ValidationErrors,
    value: string
  ) => {
    onUserDataChange({ ...userData, [fieldName]: value });

    if (validationErrors[fieldName]) {
      const error = validateField(fieldName, value);
      if (!error) {
        setValidationErrors((prev) => ({
          ...prev,
          [fieldName]: "",
        }));
      }
    }
  };

  // Validate everything before submit
  const validateAllFields = (): boolean => {
    const errors: ValidationErrors = {};
    let isValid = true;

    // Basic fields
    const nameError = validateField("name", userData.name || "");
    if (nameError) {
      errors.name = nameError;
      isValid = false;
    }

    const emailError = validateField("email", userData.email || "");
    if (emailError) {
      errors.email = emailError;
      isValid = false;
    }

    if (!isUpdate) {
      const passwordError = validateField("password", userData.password || "");
      if (passwordError) {
        errors.password = passwordError;
        isValid = false;
      }
    }

    if (userData.mobile) {
      const mobileError = validateField("mobile", userData.mobile);
      if (mobileError) {
        errors.mobile = mobileError;
        isValid = false;
      }
    }

    if (userData.pincode) {
      const pincodeError = validateField("pincode", userData.pincode);
      if (pincodeError) {
        errors.pincode = pincodeError;
        isValid = false;
      }
    }

    // Zonal/State Head: require either full bank details OR a vpa
    if (userData.role === "Zonal Head" || userData.role === "State Head") {
      const bankAccountProvided = !!userData.bankAccount?.trim();
      const ifscProvided = !!userData.ifsc?.trim();
      const vpaProvided = !!userData.vpa?.trim();

      // 🔥 Require either full bank details OR VPA
      if ((bankAccountProvided && ifscProvided) || vpaProvided) {
        // Validate bank details if provided
        if (bankAccountProvided || ifscProvided) {
          const bankAccountError = validateField(
            "bankAccount",
            userData.bankAccount || ""
          );
          const ifscError = validateField("ifsc", userData.ifsc || "");

          if (bankAccountError) {
            errors.bankAccount = bankAccountError;
            isValid = false;
          }
          if (ifscError) {
            errors.ifsc = ifscError;
            isValid = false;
          }
        }

        // Validate VPA if provided
        if (vpaProvided) {
          const vpaError = validateField("vpa", userData.vpa || "");
          if (vpaError) {
            errors.vpa = vpaError;
            isValid = false;
          }
        }
      } else {
        errors.bankOrVpa =
          "Please provide either Bank Account + IFSC or a VPA ID";
        isValid = false;
      }
    }


    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = () => {
    if (validateAllFields()) {
      onSubmit();
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        stateDropdownRef.current &&
        !stateDropdownRef.current.contains(event.target as Node)
      ) {
        setStateDropdownOpen(false);
        setStateSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen) setValidationErrors({});
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRoleChange = (role: string) => {
    onUserDataChange({ ...userData, role: role as FormUserRole });
  };

  const handleStateSelect = (state: string) => {
    onUserDataChange({ ...userData, state });
    setStateDropdownOpen(false);
    setStateSearchTerm("");
  };

  const handleStateInputChange = (value: string) => {
    setStateSearchTerm(value);
    if (!stateDropdownOpen) setStateDropdownOpen(true);
  };

  const isPrinterUser = userData.role === "PrinterUser";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-[#0066cc] rounded-t-xl sticky top-0 z-50">
          <h2 className="text-lg font-semibold text-white">
            {isUpdate ? t.updateUser : t.addNewUser}
          </h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* ... existing fields (unchanged) ... */}
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t.name} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={userData.name}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              onBlur={(e) => handleFieldBlur("name", e.target.value)}
              className={`mt-1 w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white ${
                validationErrors.name
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              placeholder="Enter full name"
            />
            {validationErrors.name && (
              <p className="mt-1 text-sm text-red-500">
                {validationErrors.name}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t.email} <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={userData.email}
              onChange={(e) => handleFieldChange("email", e.target.value)}
              onBlur={(e) => handleFieldBlur("email", e.target.value)}
              className={`mt-1 w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white ${
                validationErrors.email
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              placeholder="Enter email address"
            />
            {validationErrors.email && (
              <p className="mt-1 text-sm text-red-500">
                {validationErrors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          {!isUpdate && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t.password} <span className="text-red-500">*</span>
              </label>
              <div className="relative mt-1 overflow-hidden">
                
                {/* stacking context */}
                <input
                  type={showPassword ? "text" : "password"}
                  value={userData.password}
                  onChange={(e) =>
                    handleFieldChange("password", e.target.value)
                  }
                  onBlur={(e) => handleFieldBlur("password", e.target.value)}
                  className={`w-full p-2 pr-10 border rounded-lg dark:bg-gray-700 dark:text-white relative z-10 ${
                    validationErrors.password
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder="Minimum 8 characters with letters and numbers"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 dark:text-gray-400 z-10"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {validationErrors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {validationErrors.password}
                </p>
              )}
            </div>
          )}

          {/* Mobile Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t.mobile}
            </label>
            <input
              type="text"
              maxLength={10}
              value={userData.mobile}
              onChange={(e) => {
                // Allow only numbers
                const value = e.target.value.replace(/[^0-9]/g, "");
                handleFieldChange("mobile", value);
              }}
              onBlur={(e) => handleFieldBlur("mobile", e.target.value)}
              className={`mt-1 w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white ${
                validationErrors.mobile
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              placeholder="10-digit mobile number"
            />
            {validationErrors.mobile && (
              <p className="mt-1 text-sm text-red-500">
                {validationErrors.mobile}
              </p>
            )}
          </div>

          {/* Role Field */}
          {!isUpdate && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t.role}
              </label>
              <select
                value={userData.role}
                onChange={(e) => handleRoleChange(e.target.value)}
                className="mt-1 w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600"
              >
                <option value="Admin">{t.roles.Admin}</option>
                <option value="Finance">{t.roles.Finance}</option>
                <option value="Zonal Head">{t.roles["Zonal Head"]}</option>
                <option value="State Head">{t.roles["State Head"]}</option>
                <option value="PrinterUser">{t.roles.PrinterUser}</option>
              </select>
            </div>
          )}

          {/* Address fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Address Line 1
            </label>
            <input
              type="text"
              value={userData.addressLine1 || ""}
              onChange={(e) =>
                onUserDataChange({ ...userData, addressLine1: e.target.value })
              }
              className="mt-1 w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600"
              placeholder="Enter address line 1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Address Line 2
            </label>
            <input
              type="text"
              value={userData.addressLine2 || ""}
              onChange={(e) =>
                onUserDataChange({ ...userData, addressLine2: e.target.value })
              }
              className="mt-1 w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600"
              placeholder="Enter address line 2"
            />
          </div>

          {/* Searchable State Dropdown */}
          <div className="relative" ref={stateDropdownRef}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              State
            </label>
            <div className="relative mt-1">
              <input
                type="text"
                value={
                  stateDropdownOpen ? stateSearchTerm : userData.state || ""
                }
                onChange={(e) => handleStateInputChange(e.target.value)}
                onFocus={() => setStateDropdownOpen(true)}
                placeholder="Search and select state..."
                className="w-full p-2 pr-10 border rounded-lg dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600"
              />
              <button
                type="button"
                onClick={() => setStateDropdownOpen(!stateDropdownOpen)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 dark:text-gray-400"
              >
                <ChevronDown
                  className={`h-5 w-5 transform transition-transform ${
                    stateDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {stateDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredStates.length > 0 ? (
                    filteredStates.map((state) => (
                      <button
                        key={state}
                        type="button"
                        onClick={() => handleStateSelect(state)}
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white focus:bg-gray-100 dark:focus:bg-gray-600 outline-none"
                      >
                        {state}
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-gray-500 dark:text-gray-400">
                      No states found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              District
            </label>
            <input
              type="text"
              value={userData.district || ""}
              onChange={(e) =>
                onUserDataChange({ ...userData, district: e.target.value })
              }
              className="mt-1 w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600"
              placeholder="Enter district"
            />
          </div>

          {/* Pincode Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Pincode
            </label>
            <input
              type="text"
              maxLength={6}
              value={userData.pincode || ""}
              onChange={(e) => {
                // Allow only numbers
                const value = e.target.value.replace(/[^0-9]/g, "");
                handleFieldChange("pincode", value);
              }}
              onBlur={(e) => handleFieldBlur("pincode", e.target.value)}
              className={`mt-1 w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white ${
                validationErrors.pincode
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              placeholder="6-digit pincode"
            />
            {validationErrors.pincode && (
              <p className="mt-1 text-sm text-red-500">
                {validationErrors.pincode}
              </p>
            )}
          </div>

          {/* Plant Location field for Printer Users only */}
          {isPrinterUser && (
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Plant Location
              </label>
              <select
                value={userData.plantLocation || ""}
                onChange={(e) =>
                  onUserDataChange({
                    ...userData,
                    plantLocation: e.target.value,
                  })
                }
                className="mt-1 w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600"
              >
                <option value="">Select Plant Location</option>
                {plantLocationOptions.map((location) => (
                  <option key={location} value={location}>
                    Plant {location} {/* Display "Plant 01" in dropdown */}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Bank Details Section - Only show for Zonal Head and State Head */}
          {(userData.role === "Zonal Head" ||
            userData.role === "State Head") && (
            <div className="col-span-2 border border-gray-400 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                {t.bankDetails}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t.bankName}
                  </label>
                  <input
                    type="text"
                    value={userData.bankName || ""}
                    onChange={(e) =>
                      onUserDataChange({
                        ...userData,
                        bankName: e.target.value,
                      })
                    }
                    className="mt-1 w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600"
                    placeholder="Enter bank name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t.accountHolderName}
                  </label>
                  <input
                    type="text"
                    value={userData.accountHolderName || ""}
                    onChange={(e) =>
                      onUserDataChange({
                        ...userData,
                        accountHolderName: e.target.value,
                      })
                    }
                    className="mt-1 w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600"
                    placeholder="Enter account holder name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t.bankAccountNumber}
                  </label>
                  <input
                    type="text"
                    maxLength={18}
                    value={userData.bankAccount || ""}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, "");
                      handleFieldChange("bankAccount", value);
                    }}
                    onBlur={(e) =>
                      handleFieldBlur("bankAccount", e.target.value)
                    }
                    className={`mt-1 w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white ${
                      validationErrors.bankAccount
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                    placeholder="9-18 digit account number"
                  />
                  {validationErrors.bankAccount && (
                    <p className="mt-1 text-sm text-red-500">
                      {validationErrors.bankAccount}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t.ifscCode}
                  </label>
                  <input
                    type="text"
                    maxLength={11}
                    value={userData.ifsc || ""}
                    onChange={(e) => {
                      const value = e.target.value
                        .toUpperCase()
                        .replace(/[^A-Z0-9]/g, "");
                      handleFieldChange("ifsc", value);
                    }}
                    onBlur={(e) => handleFieldBlur("ifsc", e.target.value)}
                    className={`mt-1 w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white ${
                      validationErrors.ifsc
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                    placeholder="ABCD0123456"
                  />
                  {validationErrors.ifsc && (
                    <p className="mt-1 text-sm text-red-500">
                      {validationErrors.ifsc}
                    </p>
                  )}
                </div>
              </div>

              {/* Separator with "OR" */}
              <div className="flex items-center my-4">
                <div className="flex-grow h-px bg-gray-300 dark:bg-gray-600" />
                <div className="px-3 text-sm text-gray-500 dark:text-gray-400">
                  OR
                </div>
                <div className="flex-grow h-px bg-gray-300 dark:bg-gray-600" />
              </div>

              {/* VPA input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  VPA ID
                </label>
                <input
                  type="text"
                  value={userData.vpa || ""}
                  onChange={(e) => {
                    const value = e.target.value.trim();
                    handleFieldChange("vpa", value.toLowerCase());
                    onUserDataChange({ ...userData, vpa: value.toLowerCase() });
                  }}
                  onBlur={(e) => handleFieldBlur("vpa", e.target.value)}
                  className={`mt-1 w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white ${
                    validationErrors.vpa
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder="example@bank or example@upi"
                />
                {validationErrors.vpa && (
                  <p className="mt-1 text-sm text-red-500">
                    {validationErrors.vpa}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ... rest of the form fields left unchanged ... */}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-800">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            {t.cancel}
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`px-4 py-2 ${
              isLoading ? "bg-gray-400" : "bg-[#0066cc] hover:bg-blue-700"
            } text-white rounded-lg`}
          >
            {isLoading
              ? isUpdate
                ? "Updating..."
                : "Saving..."
              : isUpdate
              ? t.updateUserBtn
              : t.saveUser}
          </button>
        </div>
      </div>
    </div>
  );
}
