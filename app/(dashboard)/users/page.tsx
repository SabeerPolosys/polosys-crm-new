import ValidatePermissions from "@/components/permissions/ValidatePermissions";
import UsersList from "@/components/users/UsersList";
import { Suspense } from "react";

export default function UsersPage() {
  return (
    <ValidatePermissions>
      <Suspense fallback={<div>Loading users...</div>}>
        <UsersList />
      </Suspense>
    </ValidatePermissions>
  );
}
