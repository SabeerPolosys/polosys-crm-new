export default function RolePermissions({ role }: { role: string | null }) {
  const permissions = ["Full Access", "View", "Create", "Edit", "Delete"];
  const entities = ["Customers", "Vendors"];
  const itemEntities = ["Inventory Adjustments", "Item"];
  const bankingEntities = ["Payments"];
  return (
    <div>
      <h2 className="text-xl font-semibold">
        {role
          ?.replaceAll("_", " ")
          ?.replace(/\b\w/g, (char) => char.toUpperCase())}
      </h2>
      <p className="text-gray-500 my-6">
        {role === "super_admin"
          ? "Super Admin can configure system settings, manage users, and monitor activities without restrictions."
          : `Please select settings for ${role
              ?.replaceAll("_", " ")
              ?.replace(/\b\w/g, (char) => char.toUpperCase())} role`}
      </p>
      <div className="flex flex-col gap-10">
        <div className="rounded-md overflow-hidden">
          <table className="min-w-full table-fixed border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th
                  className="w-1/6 text-left p-4 border-b-[1px] border-r-[1px] border-l-[1px] border-gray-300"
                  colSpan={7}
                >
                  Contacts
                </th>
              </tr>
              <tr>
                <th className="w-1/6 text-left p-4 border-[1px] border-gray-300"></th>
                {permissions.map((perm) => (
                  <th
                    key={perm}
                    className="text-center p-4 border-[1px] border-gray-300"
                  >
                    {perm}
                  </th>
                ))}
                <th className="w-1/6 text-left p-4 border-[1px] border-gray-300"></th>
              </tr>
            </thead>
            <tbody>
              {entities.map((entity) => (
                <tr key={entity} className="text-center">
                  <td className="text-left p-4 border-[1px] border-gray-300">
                    {entity}
                  </td>
                  {permissions.map((perm) => (
                    <td key={perm} className="p-4 border-[1px] border-gray-300">
                      <input type="checkbox" className="w-4 h-4" />
                    </td>
                  ))}
                  <td className="text-left p-2 border-[1px] border-gray-300 text-sm text-gray-300 underline cursor-pointer">
                    More Permissions
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="rounded-md overflow-hidden">
          <table className="min-w-full table-fixed border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th
                  className="w-1/6 text-left p-4 border-b-[1px] border-r-[1px] border-l-[1px] border-gray-300"
                  colSpan={7}
                >
                  Items
                </th>
              </tr>
              <tr>
                <th className="w-1/6 text-left p-4 border-[1px] border-gray-300"></th>
                {permissions.map((perm) => (
                  <th
                    key={perm}
                    className="text-center p-4 border-[1px] border-gray-300"
                  >
                    {perm}
                  </th>
                ))}
                <th className="w-1/6 text-left p-4 border-[1px] border-gray-300"></th>
              </tr>
            </thead>
            <tbody>
              {itemEntities.map((entity) => (
                <tr key={entity} className="text-center">
                  <td className="text-left p-4 border-[1px] border-gray-300">
                    {entity}
                  </td>
                  {permissions.map((perm) => (
                    <td key={perm} className="p-4 border-[1px] border-gray-300">
                      <input type="checkbox" className="w-4 h-4" />
                    </td>
                  ))}
                  <td className="text-left p-2 border-[1px] border-gray-300 text-sm text-gray-300 underline cursor-pointer">
                    More Permissions
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="rounded-md overflow-hidden">
          <table className="min-w-full table-fixed border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th
                  className="w-1/6 text-left p-4 border-b-[1px] border-r-[1px] border-l-[1px] border-gray-300"
                  colSpan={7}
                >
                  Banking
                </th>
              </tr>
              <tr>
                <th className="w-1/6 text-left p-4 border-[1px] border-gray-300"></th>
                {permissions.map((perm) => (
                  <th
                    key={perm}
                    className="text-center p-4 border-[1px] border-gray-300"
                  >
                    {perm}
                  </th>
                ))}
                <th className="w-1/6 text-left p-4 border-[1px] border-gray-300"></th>
              </tr>
            </thead>
            <tbody>
              {bankingEntities.map((entity) => (
                <tr key={entity} className="text-center">
                  <td className="text-left p-4 border-[1px] border-gray-300">
                    {entity}
                  </td>
                  {permissions.map((perm) => (
                    <td key={perm} className="p-4 border-[1px] border-gray-300">
                      <input type="checkbox" className="w-4 h-4" />
                    </td>
                  ))}
                  <td className="text-left p-2 border-[1px] border-gray-300 text-sm text-gray-300 underline cursor-pointer">
                    More Permissions
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
