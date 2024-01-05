import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prismaClient from '@/lib/prisma'


export async function PATCH(request:Request){
  const session = await getServerSession(authOptions);
  
  if(!session || !session.user){
    return NextResponse.json({error: "Not Authoriezed"}, { status: 401})
  }

  const {id} = await request.json()

  const findTicket = await prismaClient.ticket.findFirst({
    where:{
      id: id as string
    }
  })
  if(!findTicket){
    return NextResponse.json({error: "Failed update ticket"},{status: 400})
  }

  console.log(findTicket)
  try {
    await prismaClient.ticket.update({
      where:{
        id: id as string
      },
      data:{
        status: "FECHADO"
      }
    })
    return NextResponse.json({message: "Chamado Atualizado com sucesso!!"})
  } catch (error) {
    return NextResponse.json({error: "Failed update ticket"},{status: 400})
  }

}