type FormData = {
  description: string;
};

type SbInputProps = {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function SbFormInputbox({
  formData,
  handleInputChange,
}: SbInputProps) {
  return (
    <div>
      <label
        htmlFor="description"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Description
      </label>
      <input
        type="text"
        id="description"
        name="description"
        value={formData.description}
        onChange={handleInputChange}
        className="w-full px-4 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        placeholder="Brief description of this role"
      />
    </div>
  );
}
