import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Membership } from "@/models/member";
import { Button } from "../ui/button";

interface AddMemberProps {
  onClose: () => void;
  isOpen: boolean;
  onSubmit: (data: any) => void;
}

const AddMember = ({
  onClose,
  isOpen,
  onSubmit,
}: AddMemberProps) => {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [birth_date, setBirthday] = useState("");
  const [gender, setGender] = useState("");
  const [contact, setContactNumber] = useState("");
  const [emergency_contact, setEmergencyNumber] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const params = {
    first_name,
    last_name,
    birth_date,
    gender,
    contact,
    emergency_contact,
  };

  const validateField = (fieldName: string, value: string) => {
    let error = "";

    if (!value.trim()) {
      error = `${fieldName
        .replace(/_/g, " ")
        .replace(/([A-Z])/g, " $1")} is required.`;
    } else if (fieldName === "contact" || fieldName === "emergency_contact") {
      let normalizedValue = value.replace(/\D/g, "");
      if (normalizedValue.startsWith("09") && normalizedValue.length === 11) {
        normalizedValue = `+63${normalizedValue.substring(1)}`;
      }
      if (
        !/^\+63[9][0-9]{9}$/.test(normalizedValue) &&
        !/^[09][9][0-9]{9}$/.test(value)
      ) {
        error = `${fieldName
          .replace(/_/g, " ")
          .replace(
            /([A-Z])/g,
            " $1"
          )} must be a valid phone number (09XXXXXXXXX).`;
      }
    }

    return error;
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    // Validate each field
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

    onSubmit(params);

    console.log("Creating member with params:", params);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-h-[75%]">
        <DialogHeader>
          <DialogTitle className="text-center">Add Member</DialogTitle>
        </DialogHeader>
        <form className="grid grid-cols-2 gap-4">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              placeholder="First Name"
              value={first_name}
              onChange={(e) => setFirstName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
            {validationErrors.first_name && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors.first_name}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              placeholder="Last Name"
              value={last_name}
              onChange={(e) => setLastName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
            {validationErrors.last_name && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors.last_name}
              </p>
            )}
          </div>

          {/* Contact Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contact Number
            </label>
            <input
              type="text"
              placeholder="Contact Number"
              value={contact}
              onChange={(e) => setContactNumber(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
            {validationErrors.contact && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors.contact}
              </p>
            )}
          </div>

          {/* Emergency Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Emergency Number
            </label>
            <input
              type="text"
              placeholder="Emergency Number"
              value={emergency_contact}
              onChange={(e) => setEmergencyNumber(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
            {validationErrors.emergency_contact && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors.emergency_contact}
              </p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Gender
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="" disabled>
                Select Gender
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            {validationErrors.gender && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors.gender}
              </p>
            )}
          </div>

          {/* Birthday */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Birthday
            </label>
            <input
              type="date"
              value={birth_date}
              onChange={(e) => setBirthday(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
            {validationErrors.birth_date && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors.birth_date}
              </p>
            )}
          </div>
        </form>
        <DialogFooter className="flex justify-center gap-x-4 mr-28">
          <Button
            type="button"
            onClick={createMember}
            className="px-6 py-2 w-32 text-black bg-[#FCD301] rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 border-2 border-black"
          >
            Confirm
          </Button>
          <Button
            type="button"
            onClick={onClose}
            className="px-6 py-2 w-32 text-white bg-red-400 rounded-md shadow-md hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddMember;
