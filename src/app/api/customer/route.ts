import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prismaClient from '@/lib/prisma'

export async function DELETE(request: Request){
  const session = await getServerSession(authOptions);
  const {searchParams} = new URL(request.url);
  const userId = searchParams.get("id")

  if(!session || !session.user){
    return NextResponse.json({error: "Not Authoriezed"}, { status: 401})
  }

  if (!userId){
    return NextResponse.json({error: "Failed delete customer"},{status: 400})
  }
  const findTickets = await prismaClient.ticket.findFirst({
    where:{
      customerId: userId
    }
  })

  if(findTickets){
    return NextResponse.json({error: "Failed delete customer"},{status: 400})
  }

 try {
  await prismaClient.customer.delete({
    where:{
      id: userId as string
    }
  })
  return NextResponse.json({message: "cliente deletado com sucesso"})
 } catch (error) {
   console.log(error)
   return NextResponse.json({error: "Failed delete customer"},{status: 400})
 }
}
export async function POST(request:Request) {
  const session = await getServerSession(authOptions);

  if(!session || !session.user){
    return NextResponse.json({error: "Not Authoriezed"}, { status: 401})
  }

  const {name, email, phone, address, userId} = await request.json();
  try {
    await prismaClient.customer.create({
      data:{
        name, 
        phone,
        email,
        address: address? address: "",
        userId: userId
      }
    })
    return NextResponse.json({message: 'Cliente Cadastro com Suecesso'}, {status: 201})
  } catch (error) {
    return NextResponse.json({error: "Failed."}, { status: 400})
  }  
}