"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

type SignupFields = {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
};

export type SignupState = {
  error: string | null;
  fields: SignupFields;
  formKey: number;
};

function getText(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function getSignupFields(formData: FormData): SignupFields {
  return {
    name: getText(formData, "name"),
    email: getText(formData, "email"),
    password: getText(formData, "password"),
    passwordConfirm: getText(formData, "passwordConfirm"),
  };
}

function createPasswordHash(password: string) {
  // TODO: 실제 배포 전에는 bcrypt/argon2 같은 해시 방식으로 교체한다.
  return password;
}

function getErrorState(error: string, fields: SignupFields): SignupState {
  return {
    error,
    fields,
    formKey: Date.now(),
  };
}

export async function signup(
  _previousState: SignupState,
  formData: FormData,
): Promise<SignupState> {
  const fields = getSignupFields(formData);

  if (!fields.name || !fields.email || !fields.password || !fields.passwordConfirm) {
    return getErrorState("모든 항목을 입력해주세요.", fields);
  }

  if (fields.password.length < 4) {
    return getErrorState("비밀번호는 4자 이상 입력해주세요.", fields);
  }

  if (fields.password !== fields.passwordConfirm) {
    return getErrorState("비밀번호와 비밀번호 확인이 일치하지 않습니다.", fields);
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email: fields.email,
    },
    select: {
      id: true,
    },
  });

  if (existingUser) {
    return getErrorState("이미 가입된 이메일입니다.", fields);
  }

  await prisma.user.create({
    data: {
      name: fields.name,
      email: fields.email,
      passwordHash: createPasswordHash(fields.password),
    },
  });

  redirect(`/login?signup=success&email=${encodeURIComponent(fields.email)}`);
}
