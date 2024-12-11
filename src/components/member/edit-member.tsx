import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Member } from "@/models/member";

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
  const [member, setMember] = useState<Member | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [responseMessage, setResponseMessage] = useState("");
  const [error, setError] = useState("");

  const { token } = useAuth();

  useEffect(() => {
    if (isOpen && selectedMemberData) {
      setMember(selectedMemberData); 
    }
  }, [isOpen, selectedMemberData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!member) return;
    const { name, value } = e.target;

    setMember({ ...member, [name]: value });

    if (isEditing) {
      const error = validateField(name, value);
      setValidationErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const validateField = (fieldName: string, value: string): string => {
    let error = "";
    if (!value.trim()) {
      error = `${fieldName.replace(/_/g, " ")} is required.`;
    } else if (["contact", "emergency_contact"].includes(fieldName)) {
      if (!/^09\d{9}$/.test(value)) {
        error = `${fieldName.replace(
          /_/g,
          " "
        )} must be a valid 11-digit phone number starting with 09.`;
      }
    }
    return error;
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    ["first_name", "last_name", "contact", "emergency_contact"].forEach((key) => {
      const error = validateField(key, member ? String(member[key as keyof Member]) || "" : "");
      if (error) errors[key] = error;
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEdit = async (id: number, memberData: Member) => {
    const url = `http://127.0.0.1:8000/api/members/${id}/`;

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
        setResponseMessage("Member updated successfully!");
        callback(); 
        setIsEditing(false); 
      } else {
        const errorResponse = await response.json();
        setError(
          errorResponse.detail || "Failed to update member. Please try again."
        );
      }
    } catch (err) {
      console.error("An error occurred:", err);
      setError("An unexpected error occurred.");
    }
  };

  const handleSave = () => {
    if (!member) return;
    if (!validateForm()) return;

    handleEdit(member.id, member);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Member Information</h2>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        {responseMessage && (
          <div className="text-green-500 text-center mb-4">{responseMessage}</div>
        )}

        {member && (
          <form className="grid grid-cols-2 gap-4">
            {[{ label: "First Name", field: "first_name" },
              { label: "Last Name", field: "last_name" },
              { label: "Contact Number", field: "contact" },
              { label: "Emergency Number", field: "emergency_contact" }].map(({ label, field }) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700">{label}</label>
                {isEditing ? (
                  <input
                    name={field}
                    value={member[field as keyof Member] || ""}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                ) : (
                  <span className="block p-2 border rounded-md">{member[field as keyof Member]}</span>
                )}
                {validationErrors[field] && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors[field]}</p>
                )}
              </div>
            ))}
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Birthday</label>
              <span className="block p-2 border rounded-md">{member.birth_date}</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <span className="block p-2 border rounded-md">{member.gender}</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">User ID</label>
              <span className="block p-2 border rounded-md">{member.id}</span>
            </div>
          </form>
        )}

        <div className="flex justify-center mt-6 space-x-4">
          <button
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            className="px-6 py-2 text-black bg-[#FCD301] rounded-md shadow-md border-2 border-black"
          >
            {isEditing ? "Save" : "Edit"}
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 text-white bg-red-400 rounded-md shadow-md hover:bg-red-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditMember;
