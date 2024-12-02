import { Member } from "@/models/member";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";

interface MemberInformationProps {
  onClose: () => void;
  isOpen: boolean;
  selectedMemberData: Member;
  callback: () => void;
}

const EditMember = ({
  onClose,
  isOpen,
  selectedMemberData,
  callback,
}: MemberInformationProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const [member, setMember] = useState({
    first_name: "",
    last_name: "",
    contact: "",
    emergency_contact: "",
    birth_date: "",
    gender: "",
    membership: "",
    status: "",
    id: "",
    purchased_at: "",
    registered_at: "",
  });

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [responseMessage, setResponseMessage] = useState("");
  const [error, setError] = useState("");

  const {token} = useAuth();
  const fetchMemberData = async (id: number) => {
    const url = `http://127.0.0.1:8000/api/members/${id}/`;
    if (!token) {
      alert("Authentication token is missing!");
      return;
    }

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const fetchedMember = await response.json();
        setMember(fetchedMember);
        console.log("Member data fetched:", fetchedMember);
      } else {
        const errorResponse = await response.json();
        console.error("Failed to fetch member data:", errorResponse);
        setError(
          errorResponse.detail ||
            "Failed to fetch member details. Please try again."
        );
      }
    } catch (error) {
      console.error("An error occurred while fetching member data:", error);
      setError("An unexpected error occurred.");
    }
  };

  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMember({ ...member, [name]: value });

    // Validate field on change
    if (isEditing) {
      const error = validateField(name, value);
      setValidationErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const validateField = (fieldName: string, value: string) => {
    let error = "";
    if (!value.trim()) {
      error = `${fieldName.replace(/_/g, " ")} is required.`;
    } else if (["contact", "emergency_contact"].includes(fieldName)) {
      const normalizedValue = value.replace(/\D/g, "");
      if (
        !/^\+63[9][0-9]{9}$/.test(`+63${normalizedValue.substring(1)}`) &&
        !/^[09][0-9]{9}$/.test(value)
      ) {
        error = `${fieldName.replace(
          /_/g,
          " "
        )} must be a valid phone number (09XXXXXXXXX).`;
      }
    }
    return error;
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    ["first_name", "last_name", "contact", "emergency_contact"].forEach(
      (key) => {
        const error = validateField(
          key,
          member[key as keyof typeof member] || ""
        );
        if (error) errors[key] = error;
      }
    );

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const checkEligibility = (membershipType: number, purchased_at: string) => {
    const currDate = new Date();
    const purchaseDate = new Date(purchased_at);
    const timeDiff = currDate.getTime() - purchaseDate.getTime();
    const expirationDuration =
      membershipType === 1 ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;

    return timeDiff <= expirationDuration ? "Active" : "Expired";
  };

  
  const handleEdit = async (id: string, memberData: any) => {
    const url = `http://127.0.0.1:8000/api/members/${id}/`;

    if (!token) {
      alert("Authentication token is missing!");
      return;
    }

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(memberData),
      });

      if (response.ok) {
        const updatedMember = await response.json();
        console.log("Member updated successfully:", updatedMember);
        setResponseMessage("Member updated successfully!");
        setIsEditing(false); // Exit edit mode
      } else {
        const errorResponse = await response.json();
        console.error("Update failed:", errorResponse);
        setError(
          errorResponse.detail || "Failed to update member. Please try again."
        );
      }
      callback();
    } catch (error) {
      console.error("An error occurred:", error);
      setError("An unexpected error occurred.");
    }
  };

 
  const handleSave = () => {
    if (!validateForm()) return;
    handleEdit(member.id.toString(), member);
  };

  useEffect(() => {
    if (selectedMemberData.id) {
      fetchMemberData(selectedMemberData.id);
    }
  }, [selectedMemberData]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-lg shadow-lg relative">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Member Information
        </h2>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        {responseMessage && (
          <div className="text-green-500 text-center mb-4">
            {responseMessage}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "First Name", field: "first_name" },
            { label: "Last Name", field: "last_name" },
            { label: "Contact Number", field: "contact" },
            { label: "Emergency Number", field: "emergency_contact" },
          ].map(({ label, field }) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700">
                {label}
              </label>
              {isEditing ? (
                <input
                  name={field}
                  value={member[field as keyof typeof member] || ""}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300 shadow-sm"
                />
              ) : (
                <span className="block p-2 border rounded-md">
                  {member[field as keyof typeof member]}
                </span>
              )}
              {validationErrors[field] && (
                <p className="text-red-500 text-sm mt-1">
                  {validationErrors[field]}
                </p>
              )}
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Birthday
            </label>
            <span className="block p-2 border rounded-md">
              {selectedMemberData.birth_date}
            </span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Gender
            </label>
            <span className="block p-2 border rounded-md">
              {selectedMemberData.gender}
            </span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              User ID
            </label>
            <span className="block p-2 border rounded-md">{member.id}</span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Membership
            </label>
            <span className="block p-2 border rounded-md">
              {selectedMemberData.membership === 1 ? "Daily" : selectedMemberData.membership === 2 ? "Monthly" : "N/A"}
            </span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <span
              className={`block p-2 border rounded-md ${
                checkEligibility(
                  selectedMemberData.membership,
                  selectedMemberData.registered_at
                ) === "Active"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {checkEligibility(
                selectedMemberData.membership,
                selectedMemberData.registered_at
              )}
            </span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date Registered
            </label>
            <span className="block p-2 border rounded-md">
              {new Date(selectedMemberData.registered_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="flex justify-center mt-6 space-x-32">
          <button
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            className="px-6 py-2 w-32 text-black bg-[#FCD301] rounded-md shadow-md border-2 border-black"
          >
            {isEditing ? "Save" : "Edit"}
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2 w-32 text-white bg-red-400 rounded-md shadow-md hover:bg-red-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditMember;
