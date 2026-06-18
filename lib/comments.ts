import { prisma } from "@/lib/prisma";

export type ProductComment = {
  id: number;
  author: string;
  content: string;
  createdAt: string;
};

export async function getProductCommentsByPcode(pcode: string) {
  const comments = await prisma.comment.findMany({
    where: {
      product: {
        pcode,
      },
    },
    include: {
      author: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return comments.map<ProductComment>((comment) => ({
    id: comment.id,
    author: comment.author?.name ?? "임시 사용자",
    content: comment.content,
    createdAt: comment.createdAt.toISOString().slice(0, 10),
  }));
}
