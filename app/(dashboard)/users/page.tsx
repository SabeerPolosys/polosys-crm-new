import UsersList from "@/components/users/UsersList";
import { Suspense } from "react";

export default function UsersPage() {
  return (
    <Suspense fallback={<div>Loading users...</div>}>
      <UsersList />
    </Suspense>
  );
}
