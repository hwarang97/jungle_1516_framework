"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

type LoginFields = {
  email: string;
  password: string;
};

export type LoginState = {
  error: string | null;
  fields: LoginFields;
  formKey: number;
};

function getText(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function getLoginFields(formData: FormData): LoginFields {
  return {
    email: getText(formData, "email"),
    password: getText(formData, "password"),
  };
}

function getSafeNextPath(nextPath: string) {
  if (!nextPath.startsWith("/") || nextPath.startsWith("//")) {
    return "/products";
  }

  return nextPath;
}

function verifyPassword(password: string, passwordHash: string) {
  // TODO: 회원가입 구현 시 해시 검증 방식으로 교체한다.
  return password === passwordHash;
}

function getErrorState(error: string, fields: LoginFields): LoginState {
  return {
    error,
    fields,
    formKey: Date.now(),
  };
}

export async function login(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const fields = getLoginFields(formData);
  const nextPath = getSafeNextPath(getText(formData, "next") || "/products");

  if (!fields.email || !fields.password) {
    return getErrorState("이메일과 비밀번호를 입력해주세요.", fields);
  }

  const user = await prisma.user.findUnique({
    where: {
      email: fields.email,
    },
    select: {
      id: true,
      passwordHash: true,
    },
  });

  if (!user || !verifyPassword(fields.password, user.passwordHash)) {
    return getErrorState("이메일 또는 비밀번호가 올바르지 않습니다.", fields);
  }

  const cookieStore = await cookies();
  cookieStore.set("userId", String(user.id), {
    httpOnly: true,
    maxAge: 60 * 60 * 24,
    path: "/",
    sameSite: "lax",
  });

  redirect(nextPath);
}
