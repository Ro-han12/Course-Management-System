import { z } from "zod";

export const studentschema = z.object({
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters long!" })
      .max(20, { message: "Username must be at most 20 characters long!" }),
    email: z.string().email({ message: "Invalid email address!" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long!" }),
    firstName: z.string().min(1, { message: "First name is required!" }),
    lastName: z.string().min(1, { message: "Last name is required!" }),
    phone: z.string().min(1, { message: "Phone is required!" }),
    address: z.string().min(1, { message: "Address is required!" }),
    grade: z.string().min(1, { message: "Grade you studying in!" }),
    birthday: z.date({ message: "Birthday is required!" }),
    sex: z.enum(["male", "female"], { message: "Sex is required!" }),
    img: z.instanceof(File, { message: "Image is required" }),
  });
  export type StudentSchema = z.infer<typeof studentschema>;


export const batchschema = z.object({
    id: z.coerce.number().optional(),
    BatchName: z.string().min(1, { message: "Batch name is required!" }),
    Capacity: z.coerce.number().min(1, { message: "Max strength of the batch required!" }),
    // Teachers: z.string().min(1, { message: "Select trainers for the batch" }),
    Teachers: z.array(z.string()),
    Students: z.array(z.string()),
    ZoomLink: z.string().min(1, { message: "Enter Zoom Link" }),
    teacherId: z.coerce.string().optional(),
    
  });

  export type BatchSchema = z.infer<typeof batchschema>;


  export const announcementschema = z.object({
    Title: z.string().min(1, { message: "Title is required!" }),
    Description: z.string().min(1, { message: " Enter Description!" }),
    Date: z.date({ message: "Event date" }),
    
    
  });
  export type AnnouncementSchema = z.infer<typeof announcementschema>;

  export const eventschema = z.object({
    title: z.string().min(1, { message: "Event Title is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    startTime: z.string().min(1, { message: "Start Time is required" }),
    endTime: z.string().min(1, { message: "End Time is required" }),
    batchId: z.number().min(1, { message: "Batch is required" }), // Assuming the batchId must be provided
  });
  export type EventSchema = z.infer<typeof eventschema>;

  export const teacherschema = z.object({
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters long!" })
      .max(20, { message: "Username must be at most 20 characters long!" }),
    email: z.string().email({ message: "Invalid email address!" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long!" }),
    firstName: z.string().min(1, { message: "First name is required!" }),
    lastName: z.string().min(1, { message: "Last name is required!" }),
    Address: z.string().min(1, { message: "City/Country you reside in" }),
    phone: z.string().min(1, { message: "Phone is required!" }),
    sex: z.enum(["male", "female"], { message: "Sex is required!" }),
    img: z.instanceof(File, { message: "Image is required" }),
    linkedin: z
      .string()
      .url({ message: "Please enter a valid LinkedIn URL!" })
      .optional(),
  });
  export type TeacherSchema = z.infer<typeof teacherschema>;

  