"use server";

import { revalidatePath } from "next/cache";
import { BatchSchema } from "./formValidationSchemas";
import prisma from "./prisma";

type CurrentState = { success: boolean; error: boolean };

export const createBatch = async (CurrentState: CurrentState, data: BatchSchema) => {
  try {
    await prisma.batch.create({
      data: {
        batchname: data.BatchName,
        teacher: {
          connect: data.Teachers.map((teacherId) => ({ id: teacherId })),
        },
        students: {
          connect: data.Students.map((studentId) => ({ id: studentId })),
        },
        zoomLink: data.ZoomLink,
        capacity: data.Capacity,
      },
    });
    // revalidatePath("/list/batches");
    return { success: true, error: false };
  } catch (err) {
    console.error(err);
    return { success: false, error: true };
  }
};

export const updateBatch = async (CurrentState: CurrentState, data: BatchSchema) => {
  try {
    await prisma.batch.update({
      where: {
        id: data.id,
      },
      data: {
        batchname: data.BatchName,
        teachers: {
          set: data.Teachers.map((teacherId) => ({ id: teacherId })),
        },
        students: {
          set: data.Students.map((studentId) => ({ id: studentId })),
        },
        zoomLink: data.ZoomLink,
      },
    });
    // revalidatePath("/list/batches");
    return { success: true, error: false };
  } catch (err) {
    console.error(err);
    return { success: false, error: true };
  }
};

export const deleteBatch = async (CurrentState: CurrentState, data: FormData) => {
  const id = parseInt(data.get("id") as string, 10);
  if (isNaN(id)) {
    console.error("Invalid batch ID");
    return { success: false, error: true };
  }
  try {
    await prisma.batch.delete({
      where: {
        id,
      },
    });
    // revalidatePath("/list/batches");
    return { success: true, error: false };
  } catch (err) {
    console.error(err);
    return { success: false, error: true };
  }
};
