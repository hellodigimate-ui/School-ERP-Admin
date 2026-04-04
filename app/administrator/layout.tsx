
import SuperAdminLayout from "@/components/administrator/superAdminLayout";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SuperAdminLayout>{children}</SuperAdminLayout>;
}
