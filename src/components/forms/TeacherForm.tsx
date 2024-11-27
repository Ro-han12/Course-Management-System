"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import Image from "next/image";
import {toast} from "react-toastify";
import { useRouter } from "next/navigation";
import { TeacherSchema , teacherschema} from "@/lib/formValidationSchemas";
import {useFormState} from "react-dom";
import {createBatch, createTeacher, updateBatch, updateTeacher} from "@/lib/action";
import { Dispatch,SetStateAction, useEffect, useState  } from "react";
import { CldUploadWidget } from "next-cloudinary";


const TeacherForm = ({
  type,
  data,
  setOpen,
  relatedData
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TeacherSchema>({
    resolver: zodResolver(teacherschema),
  });

  const [img, setImg] = useState<any>();

  const [state, formAction] = useFormState(type == "create" ? createTeacher : updateTeacher, 
    {success: false,error:false});
  
    const onSubmit = handleSubmit((data) => {
      console.log(data);
      formAction(data)
    });
  
    const router = useRouter()
  
    useEffect(()=>{
      if(state.success){
        toast(`Teacher has been ${type === "create" ? "created" : "updated"}!`);
        setOpen(false)
        router.refresh();
        }
      },[state])
  
    const { batches } = relatedData;

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">{type === "create" ? "Create a new teacher" : "update the teacher" }</h1>
      <span className="text-xs text-gray-400 font-medium">
        Authentication Information
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Username"
          name="username"
          defaultValue={data?.username}
          register={register}
          error={errors?.username}
        />
        <InputField
          label="Email"
          name="email"
          defaultValue={data?.email}
          register={register}
          error={errors?.email}
        />
        <InputField
          label="Password"
          name="password"
          type="password"
          defaultValue={data?.password}
          register={register}
          error={errors?.password}
        />
      </div>
      <span className="text-xs text-gray-400 font-medium">
        Personal Information
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="First Name"
          name="firstName"
          defaultValue={data?.firstName}
          register={register}
          error={errors.firstName}
        />
        <InputField
          label="Last Name"
          name="lastName"
          defaultValue={data?.lastName}
          register={register}
          
        />
        <InputField
          label="Phone"
          name="phone"
          defaultValue={data?.phone}
          register={register}
          error={errors.phone}
        />
        <InputField
          label="Address"
          name="Address"
          defaultValue={data?.Address}
          register={register}
          error={errors.Address}
        />
        <InputField
          label="LinkedIn URL"
          name="linkedin"
          defaultValue={data?.linkedin}
          register={register}
          error={errors.linkedin}
        />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Sex</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("sex")}
            defaultValue={data?.sex}
          >
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
          {errors.sex?.message && (
            <p className="text-xs text-red-400">
              {errors.sex.message.toString()}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Batches</label>
          <select
            multiple
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("batches")}
            defaultValue={data?.batches}
          >
            {batches.map((batches: { id: number; name: string }) => (
              <option value={batches.name} key={batches.name}>
                {batches.name}
              </option>
            ))}
          </select>
          {errors.batches?.message && (
            <p className="text-xs text-red-400">
              {errors.batches.message.toString()}
            </p>
          )}
        </div>
        <CldUploadWidget
          uploadPreset="igebra"
          onSuccess={(result, { widget }) => {
            setImg(result.info);
            widget.close();
          }}
        >
          {({ open }) => {
            return (
              <div
                className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
                onClick={() => open()}
              >
                <Image src="/upload.png" alt="" width={28} height={28} />
                <span>Upload a photo</span>
              </div>
            );
          }}
        </CldUploadWidget>
      </div>
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default TeacherForm;
