import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role, teachersData } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { Prisma, Batch, Teacher  } from "@prisma/client"
import { ITEM_PER_PAGE } from "@/lib/settings";

// type Teacher = {
//   id: number;
//   teacherId: string;
//   name: string;
//   email?: string;
//   photo: string;
//   batches: string[];
//   phone: string;
//   address: string;
//   linkedin?: string;
// };

type TeacherList = Teacher & {batches:Batch[]}


const columns = [
  {
    header: "Info",
    accessor: "info",
  },
  {
    header: "Teacher ID",
    accessor: "teacherId",
    className: "hidden md:table-cell",
  },
  {
    header: "Batches",
    accessor: "batches",
    className: "hidden md:table-cell",
  },
  {
    header: "Phone",
    accessor: "phone",
    className: "hidden lg:table-cell",
  },
  {
    header: "Address",
    accessor: "address",
    className: "hidden lg:table-cell",
  },
  
  {
    header: "LinkedIn",  
    accessor: "linkedin",
    className: "hidden lg:table-cell",
  },
  ...(role === "admin"
    ? [
        {
          header: "Actions",
          accessor: "action",
        },
      ]
    : []),
];

const renderRow = (item: TeacherList) => (
  <tr
    key={item.id}
    className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
  >
    <td className="flex items-center gap-4 p-4">
      <Image
        src={"/noAvatar.png"}
        alt=""
        width={40}
        height={40}
        className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
      />
      <div className="flex flex-col">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-xs text-gray-500">{item?.email}</p>
      </div>
    </td>
    <td className="hidden md:table-cell">{item.teacherId}</td>
    <td className="hidden md:table-cell">{item.batches.map(batch=>batch.batchname).join(",")}</td>
    <td className="hidden md:table-cell">{item.phone}</td>
    <td className="hidden md:table-cell">{item.address}</td>
    
    <td className="hidden lg:table-cell">
      {item.linkedin ? (
        <Link href={item.linkedin} target="_blank">
          <button className="text-blue-600 hover:underline">LinkedIn</button>
        </Link>
      ) : (
        "-"
      )}
    </td>
    <td>
      <div className="flex items-center gap-2">
        <Link href={`/list/teachers/${item.id}`}>
          <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
            <Image src="/view.png" alt="" width={16} height={16} />
          </button>
        </Link>
        {role === "admin" && (
          <FormModal table="teacher" type="delete" id={item.id} />
        )}
      </div>
    </td>
  </tr>
);
const TeacherListPage = async ({
  searchParams, }: {
  searchParams:{ [key:string]:string | undefined};
}) => {
  const { page, ...queryParams } = searchParams;


  const p = page ? parseInt(page) : 1;
   // URL PARAMS CONDITION

   const query: Prisma.TeacherWhereInput = {};

   if (queryParams) {
     for (const [key, value] of Object.entries(queryParams)) {
       if (value !== undefined) {
         switch (key) {
           case "batchId":
             query.batches = {
               some: {
                id: parseInt(value),
               },
               
             }; 
            
             break;
           case "search":
             query.name = { contains: value, mode: "insensitive" };
             break;
           default:
             break;
         }
       }
     }
   }
  const [data, count] = await prisma.$transaction([
    prisma.teacher.findMany({
      where: query,
      include: {
        batches: true,
      },
      
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.teacher.count({where: query}),
  ]);


  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Teachers</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && (
              <FormModal table="teacher" type="create" />
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default TeacherListPage;