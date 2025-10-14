import { FormEvent } from "react";
import SbFormInputbox from "./SbFormInputbox";
import { FaSave, FaTimes } from "react-icons/fa";
import SbFormPassword from "./SbFormPassword";
import SbFormSelectbox from "./SbFormSelectbox";
import SbFormPermissionOptions from "./SbFormPermissionOptions";
import SbFormTextArea from "./SbFormTextArea";
import SbFormNumber from "./SbFormNumber";
import SbFormDatepicker from "./SbFormDatepicker";
import ProductDragableAdons from "../product/ProductDragableAdons";
import PlanFeatures from "../product/PlanFeatures";
import VersionPlanSelector from "../product/VersionPlanSelector";
import { ProductTypes } from "@/types/auth";

export default function SbForm({
  formField,
  handleSubmit,
  handleClear,
  formData,
  handleFormDataChange,
  submitType,
  productDetails,
  isCodeExist
}: {
  formField: any;
  handleSubmit: (e: React.FormEvent<Element>) => Promise<void>;
  handleClear(): void;
  formData: any;
  handleFormDataChange(key: string, value: string): void;
  submitType?: "Create" | "Update" | "Convert";
  productDetails?: ProductTypes|null,
  isCodeExist?: boolean
}) {
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {formField?.fields?.map((field: any, index: number) => {
            switch (field?.type) {
              case "input":
                return (
                  <SbFormInputbox
                    field={field}
                    key={index}
                    value={formData[field?.key] ?? ""}
                    handleFormDataChange={handleFormDataChange}
                    isCodeExist={isCodeExist}
                  />
                );
              case "password":
                return (
                  <SbFormPassword
                    field={field}
                    key={index}
                    value={formData[field?.key] ?? ""}
                    handleFormDataChange={handleFormDataChange}
                  />
                );
              case "select":
                return (
                  <SbFormSelectbox
                    field={field}
                    key={index}
                    value={formData[field?.key] ?? ""}
                    handleFormDataChange={handleFormDataChange}
                  />
                );
              case "permissionOptions":
                return (
                  <SbFormPermissionOptions
                    key={index}
                    field={field}
                    value={formData}
                    handleFormDataChange={handleFormDataChange}
                  />
                );
              case "textArea":
                return (
                  <SbFormTextArea
                    field={field}
                    key={index}
                    value={formData[field?.key] ?? ""}
                    handleFormDataChange={handleFormDataChange}
                  />
                );
              case "number":
                return (
                  <SbFormNumber
                    field={field}
                    key={index}
                    value={formData[field?.key] ?? ""}
                    handleFormDataChange={handleFormDataChange}
                  />
                );
              case "dateTime":
                return (
                  <SbFormDatepicker
                    field={field}
                    key={index}
                    value={formData[field?.key] ?? ""}
                    handleFormDataChange={handleFormDataChange}
                  />
                );
              case "plan-selector":
                return(
                  <VersionPlanSelector key={index} productDetails={productDetails}/>
                )
              case "dragable-adons":
                return(
                  <ProductDragableAdons key={index} handleFormDataChange={handleFormDataChange}/>
                )
              case "features":
                return(<PlanFeatures key={index} value={formData[field?.key] ?? ""}
                    handleFormDataChange={handleFormDataChange} field={field}/>)
              default:
                break;
            }
          })}
        </div>
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          {formField?.hasClearButton && (
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2 border border-gray-300 rounded-md md:text-sm text-[10px] font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <FaTimes className="inline mr-2" />
              Clear
            </button>
          )}
          {formField?.hasSubmitButton && (
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 border border-transparent rounded-md md:text-sm text-[10px] font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <FaSave className="inline mr-2" />
              {formField?.submitButtonLabel
                ? submitType
                  ? submitType + " " + formField?.submitButtonLabel
                  : formField?.submitButtonLabel
                : "Save"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
