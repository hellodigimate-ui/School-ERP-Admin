import SuperAdminLayout from "@/components/superAdmin/superAdminLayout";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SuperAdminLayout>{children}</SuperAdminLayout>;
}
