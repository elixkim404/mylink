import React from "react";
import { UserProfileView } from "../../components/UserProfileView";

export function generateStaticParams() {
  return [{ userId: "me" }];
}

interface UserProfilePageProps {
  params: Promise<{
    userId: string;
  }>;
}

export default async function UserProfilePage({ params }: UserProfilePageProps) {
  const { userId } = await params;
  return <UserProfileView userId={userId} />;
}
