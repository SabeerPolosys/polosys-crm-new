// import { FaUserCog } from 'react-icons/fa';

export const rightsFormConfig = {
  "/settings/permission-menu": {
    Category: "User & Rights",
    title: "Permission Menu",
    formLabel: "",
    // icon: <FaUserCog className="text-blue-600 text-xl" />,
    fields: [
      {
        label: "Permission Menu",
        key: "rightMenu",
        type: "input",
        required: true,
        placeholder: "e.g., Accounts, Inventory etc...",
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
    submitButtonLabel: "Permission",
    hasClearButton: true,
    submitUrl: "/api/v1/user-type",
  },

  "/settings/permission-options": {
    Category: "User & Rights",
    title: "Permission Options",
    formLabel: "",
    // icon: <FaUserCog className="text-blue-600 text-xl" />,
    fields: [
      {
        label: "Permission Option",
        key: "rightOption",
        type: "input",
        required: true,
        placeholder: "e.g., Ledger, Sales Order, etc..",
      },
      {
        label: "Permission Menu",
        key: "rightMenu",
        type: "select",
        required: true,
        placeholder: "e.g., Accounts, Inventory etc...",
      },
      {
        label: "Url",
        key: "url",
        type: "input",
        required: true,
        placeholder: "Description",
      },
      {
        label: "Have Options For",
        key: "permissionOptions",
        type: "permissionOptions",
        required: true,
        placeholder: "Description",
      },
    ],
    hasSubmitButton: true,
    submitButtonLabel: "Permission Options",
    hasClearButton: true,
    submitUrl: "/api/v1/user-type",
  },
};
