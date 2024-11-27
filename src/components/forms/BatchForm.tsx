"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import InputField from "../InputField";
import Image from "next/image";
import { BatchSchema , batchschema} from "@/lib/formValidationSchemas";
import {useFormState} from "react-dom";
import {createBatch, updateBatch} from "@/lib/action";
import { Dispatch,SetStateAction, useEffect } from "react";
import {toast} from "react-toastify";
import { useRouter } from "next/navigation";


const BatchForm = ({
  type,
  data,
  setOpen,
  relatedData
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BatchSchema>({
    resolver: zodResolver(batchschema),
  });

const [state, formAction] = useFormState(type == "create" ? createBatch : updateBatch, 
  {success: false,error:false});

  const onSubmit = handleSubmit((data) => {
    console.log(data);
    formAction(data)
  });

  const router = useRouter()

  useEffect(()=>{
    if(state.success){
      toast(`Batch has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false)
      router.refresh();
      }
    },[state])

  const { teachers } = relatedData;

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">Create a new Batch</h1>
      
      
    
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Batch Name"
          name="BatchName"
          defaultValue={data?.BatchName}
          register={register}
          error={errors.BatchName}
        />
        {data && (
          <  InputField
          label="Id"
          name="id"
          defaultValue={data?.id}
          register={register}
          error={errors.id}
          hidden
        />
        )}
        
        <InputField
          label="Capacity"
          name="capacity"
          defaultValue={data?.Capacity}
          register={register}
          error={errors.Capacity}
        /> 
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Teachers</label>
          <select
            multiple
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("Teachers")}
            defaultValue={data?.teachers}
          >
            {teachers.map(
              (teacher: { id: string; name: string; }) => (
                <option value={teacher.id} key={teacher.id}>
                  {teacher.name}
                </option>
              )
            )}
          </select>
          {errors.Teachers?.message && (
            <p className="text-xs text-red-400">
              {errors.Teachers.message.toString()}
            </p>
          )}
        </div>
        <InputField
          label="Zoom Link"
          name="ZoomLink"
          defaultValue={data?.ZoomLink}
          register={register}
          error={errors.ZoomLink}
        />
        
        
      </div>
      {state.error && <span className="text-red-500">Something went wrong!</span>}
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default BatchForm;
