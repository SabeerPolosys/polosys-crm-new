// import { FaUserCog } from 'react-icons/fa';

export const rightsFormConfig = {
  "/settings/permission-module": {
    Category: "User & Rights",
    title: "Permission Module",
    formLabel: "",
    // icon: <FaUserCog className="text-blue-600 text-xl" />,
    fields: [
      {
        label: "Permission Module",
        key: "moduleName",
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
    submitButtonLabel: "Permission Module",
    hasClearButton: true,
    submitUrl: "/api/v1/module",
  },

  "/settings/permission-options": {
    Category: "User & Rights",
    title: "Permission Options",
    formLabel: "",
    // icon: <FaUserCog className="text-blue-600 text-xl" />,
    fields: [
      {
        label: "Permission Option",
        key: "rightName",
        type: "input",
        required: true,
        placeholder: "e.g., Ledger, Sales Order, etc..",
      },
      {
        label: "Permission Menu",
        key: "moduleId",
        type: "select",
        required: true,
        getListUrl: "/api/v1/module",
        valueKey:"moduleId",
        optionKey:"moduleName"
      },
      {
        label: "Endpoint Url",
        key: "endpoint",
        type: "input",
        required: true,
        placeholder: "Endpoint Url",
      },
      {
        label: "Have Options For",
        key: "permissionOptions",
        type: "permissionOptions",
        required: true,
        placeholder: "Description",
      },
      {
        label: "Description",
        key: "description",
        type: "textArea",
        required: true,
        placeholder: "Description",
      },
    ],
    hasSubmitButton: true,
    submitButtonLabel: "Permission Options",
    hasClearButton: true,
    submitUrl: "/api/v1/user-rights-master",
  },
};
