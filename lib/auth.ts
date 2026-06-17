import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const currentUserCookieName = "userId";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const userIdValue = cookieStore.get(currentUserCookieName)?.value;
  const userId = Number(userIdValue);

  if (!Number.isInteger(userId) || userId <= 0) {
    return null;
  }

  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
}
