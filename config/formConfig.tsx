// import { FaUserCog } from 'react-icons/fa';

export const formFieldconfig = {
  "/users/role": {
    Category: "User & Role",
    title: "Role",
    formLabel: "Define access levels for user roles",
    // icon: <FaUserCog className="text-blue-600 text-xl" />,
    fields: [
      {
        label: "Role Name",
        key: "typeName",
        type: "input",
        required: true,
        placeholder: "e.g., Admin, Super Admin",
      },
      {
        label: "Description",
        key: "description",
        type: "input",
        required: true,
        placeholder: "Description",
      },
    ],
    hasSubmitButton: true,
    submitButtonLabel: "Role",
    hasClearButton: true,
    submitUrl: "/api/v1/user-type"
  },
};
