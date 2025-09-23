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
    submitUrl: "/api/v1/user-type",
  },

  "/users": {
    Category: "User & Role",
    title: "User",
    formLabel: "Define access levels for user",
    // icon: <FaUserCog className="text-blue-600 text-xl" />,
    fields: [
      {
        label: "User Name",
        key: "userName",
        type: "input",
        required: true,
        placeholder: "Username",
      },
      {
        label: "Email",
        key: "userEmail",
        type: "input",
        required: true,
        placeholder: "Email",
      },
      {
        label: "Password",
        key: "passwordHash",
        type: "password",
        required: true,
        placeholder: "Password",
      },
      {
        label: "Role",
        key: "userTypeId",
        type: "select",
        required: true,
        placeholder: "Role",
        getListUrl: "/api/v1/user-type",
        valueKey:"userTypeId",
        optionKey:"typeName"
      },
      {
        label: "Status",
        key: "isActive",
        type: "select",
        required: true,
        placeholder: "Status",
        defaultList: [
          { value: true, option: "Active" },
          { value: false, option: "Invative" },
        ],
        valueKey:"value",
        optionKey:"option"
      },
      {
        label: "Country",
        key: "countryID",
        type: "select",
        required: true,
        placeholder: "Country",
        valueKey:"countryId",
        optionKey:"countryName",
        getListUrl: "/api/v1/common/countries"
      },
    ],
    hasSubmitButton: true,
    submitButtonLabel: "User",
    hasClearButton: true,
    submitUrl: "/api/v1/user",
  },

  "/users/update": {
    Category: "User & Role",
    title: "User",
    formLabel: "Define access levels for user",
    // icon: <FaUserCog className="text-blue-600 text-xl" />,
    fields: [
      {
        label: "User Name",
        key: "userName",
        type: "input",
        required: true,
        placeholder: "Username",
      },
      {
        label: "Email",
        key: "userEmail",
        type: "input",
        required: true,
        placeholder: "Email",
      },
      {
        label: "Role",
        key: "userTypeId",
        type: "select",
        required: true,
        placeholder: "Role",
        getListUrl: "/api/v1/user-type",
        valueKey:"userTypeId",
        optionKey:"typeName"
      },
      {
        label: "Status",
        key: "isActive",
        type: "select",
        required: true,
        placeholder: "Status",
        defaultList: [
          { value: true, option: "Active" },
          { value: false, option: "Invative" },
        ],
        valueKey:"value",
        optionKey:"option"
      },
      {
        label: "Country",
        key: "countryID",
        type: "select",
        required: true,
        placeholder: "Country",
        valueKey:"countryId",
        optionKey:"countryName",
        getListUrl: "/api/v1/common/countries"
      },
    ],
    hasSubmitButton: true,
    submitButtonLabel: "User",
    hasClearButton: true,
    submitUrl: "/api/v1/user",
  },
};
