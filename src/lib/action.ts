"use server";

import prisma from "./prisma";
import { clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import {
  BatchSchema,
  TeacherSchema,
} from "./formValidationSchemas";




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

export const createTeacher = async (
  currentState: CurrentState,
  data: TeacherSchema
) => {
  try {
    // Create user in Clerk
    const user = await clerkClient.users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.firstName,
      publicMetadata: { role: "teacher" },
    });

    // Create teacher in Prisma
    await prisma.teacher.create({
      data: {
        id: user.id, // Clerk user ID
        name: data.firstName,
        email: data.email ,
        phone: data.phone,
        address: data.Address,
        photo: data.img, // Handle optional img
        sex: data.sex,
        linkedin: data.linkedin, // Handle optional LinkedIn
        batches: {
          connect: data.batches?.map((batchId: string) => ({
            id: parseInt(batchId),
          })),
        },
      },
    });

    // Revalidate the teacher list page for ISR
    // revalidatePath("/list/teachers");

    return { success: true, error: false };
  } catch (err) {
    console.error("Error creating teacher:", err);
    return { success: false, error: true };
  }
};

export const updateTeacher = async (
  currentState: CurrentState,
  data: TeacherSchema
) => {
  if (!data.id) {
    return { success: false, error: true };
  }
  try {
    const user = await clerkClient.users.updateUser(data.id, {
      username: data.username,
      ...(data.password !== "" && { password: data.password }),
      firstName: data.name,
      lastName: data.surname,
    });

    await prisma.teacher.update({
      where: {
        id: data.id,
      },
      data: {
        ...(data.password !== "" && { password: data.password }),
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        subjects: {
          set: data.subjects?.map((subjectId: string) => ({
            id: parseInt(subjectId),
          })),
        },
      },
    });
    // revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteTeacher = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await clerkClient.users.deleteUser(id);

    await prisma.teacher.delete({
      where: {
        id: id,
      },
    });

    // revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};