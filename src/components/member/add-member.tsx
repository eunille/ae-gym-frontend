import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/context/auth-context";
import { Button } from "../ui/button";
import dataFetch from "@/service/data-service";

interface AddMemberProps {
  onClose: () => void;
  isOpen: boolean;
  onSubmit: (data: any) => void;
  callback(): void;   
}

const AddMember = ({ onClose, isOpen, onSubmit, callback }: AddMemberProps) => {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [birth_date, setBirthday] = useState("");
  const [gender, setGender] = useState("");
  const [contact, setContactNumber] = useState("");
  const [emergency_contact, setEmergencyNumber] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const { token } = useAuth();

  const validateField = (fieldName: string, value: string) => {
    let error = "";
    if (!value.trim()) {
      error = `${fieldName.replace(/_/g, " ").replace(/([A-Z])/g, " $1")} is required.`;
    }
    return error;
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    errors.first_name = validateField("first_name", first_name);
    errors.last_name = validateField("last_name", last_name);
    errors.birth_date = validateField("birth_date", birth_date);
    errors.gender = validateField("gender", gender);
    errors.contact = validateField("contact", contact);
    errors.emergency_contact = validateField("emergency_contact", emergency_contact);

    setValidationErrors(errors);
    return Object.values(errors).every((error) => error === "");
  };

  const createMember = async () => {
    if (!validateForm()) return;

    if (!token) {
      console.error("Token not available.");
      return;
    }

    try {
      const url = "api/members/";
      const method = "POST";
      const params = {
        first_name,
        last_name,
        birth_date,
        gender,
        contact,
        emergency_contact,
      };

      const response = await dataFetch(url, method, params, token);
      onSubmit(response); // Pass the new member data to the parent
      onClose(); // Close the dialog
      callback(); 
    } catch (error) {
      console.error("Error creating member:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-h-[75%] max-w-xl mx-auto p-6">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-semibold text-gray-800">
            Add Member
          </DialogTitle>
        </DialogHeader>

        <form className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              placeholder="First Name"
              value={first_name}
              onChange={(e) => setFirstName(e.target.value)}
              className="mt-2 w-full p-3 border-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {validationErrors.first_name && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.first_name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              placeholder="Last Name"
              value={last_name}
              onChange={(e) => setLastName(e.target.value)}
              className="mt-2 w-full p-3 border-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {validationErrors.last_name && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.last_name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Number</label>
            <input
              type="text"
              placeholder="Contact Number"
              value={contact}
              onChange={(e) => setContactNumber(e.target.value)}
              className="mt-2 w-full p-3 border-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {validationErrors.contact && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.contact}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Emergency Contact</label>
            <input
              type="text"
              placeholder="Emergency Contact"
              value={emergency_contact}
              onChange={(e) => setEmergencyNumber(e.target.value)}
              className="mt-2 w-full p-3 border-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {validationErrors.emergency_contact && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.emergency_contact}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="mt-2 w-full p-3 border-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Select Gender
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            {validationErrors.gender && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.gender}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Birth Date</label>
            <input
              type="date"
              value={birth_date}
              onChange={(e) => setBirthday(e.target.value)}
              className="mt-2 w-full p-3 border-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {validationErrors.birth_date && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.birth_date}</p>
            )}
          </div>
        </form>

        <DialogFooter className="flex justify-center gap-6 mt-6">
          <Button
            type="button"
            onClick={createMember}
            className="px-6 py-3 w-32 bg-[#FCD301] text-black text-md rounded-br-lg rounded-tl-lg font-semibold border-2 border-black"
          >
            Confirm
          </Button>
          <Button
            type="button"
            onClick={onClose}
            className="px-6 py-3 w-32 text-white bg-red-500 rounded-md shadow-md hover:bg-red-600 focus:ring-2 focus:ring-red-400 border-2 border-black"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddMember;

