import prisma from "@/lib/prisma";
import FormModal from "./FormModal";
export type FormContainerProps = {
    table:
        | "teacher"
        | "student"
        | "batch"
        | "event"
        | "Announcement";
    type: "create" | "update" | "delete";
    data?: any;
    id?: number | string;
}

const FormContainer = async({
    table,
    type,
    data,
    id,
}: FormContainerProps) => {

    let relatedData = {}

    if (type !=="delete") {
        switch(table) {
            case "batch":
                const batchTeachers = await prisma.teacher.findMany({
                    select: {id: true, name: true},
                });
                
                relatedData = {teachers: batchTeachers}
                break;
            case "teacher":
                const teacherbatchs = await prisma.batch.findMany({
                    select: {id: true, batchname: true},
                });
                relatedData = {batches: teacherbatchs}
            
            default:
                break;
        }
    }
    return (
        <div className=''><FormModal table={table} type={type} data={data} id={id} relatedData={relatedData}></FormModal></div>
    )
}
export default FormContainer