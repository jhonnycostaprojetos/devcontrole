"use client"
import {useForm} from "react-hook-form"
import {z} from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/input"
import { useState } from "react"
import { api } from "@/lib/api"
import { useRouter } from "next/navigation"

const schema = z.object({
  name: z.string().min(1, "O campo nome é obrigatorio" ),
  email: z.string().email("Digite um email valido").min(1, "O email é obrigatório"),
  phone: z.string().refine((value)=>{
   return /^(?:\(\d{2}\)\s?)?\d{9}$/.test(value) || /^\d{2}\s\d{9}$/.test(value) || /^\d{11}$/.test(value) || /(?:(^\+\d{2})?)(?:([1-9]{2})|([0-9]{3})?)(\d{4,5})(\d{4})/.test(value);
  },{
    message: "o numero de telefone deve estar (DD) 999999999"
  }), 
  address: z.string()
})
type FormData = z.infer<typeof schema>

export function NewCustomerForm({userId}:{userId: string}){
  const [telefone, setTelefone] = useState("")
  const {register, handleSubmit, formState:{errors}}= useForm<FormData>({
    resolver: zodResolver(schema)
  })
const router = useRouter();

  async function handleRegisterCustomer(data: FormData){
    await api.post("/api/customer",{
      name: data.name,
      phone: data.phone,
      email: data.email,
      address: data.address,
      userId: userId
    })
    router.refresh();
    router.replace("/dashboard/customer")
  }

  function handleTelefone(event) {
    const regex = /^([0-9]{2})([0-9]{4,5})([0-9]{4})$/;
    var str = event.target.value.replace(/[^0-9]/g, "").slice(0, 11);
  
    const result = str.replace(regex, "($1)$2-$3");
  
    setTelefone(result);
  }
  return(
    <form className="flex flex-col mt-6" onSubmit={handleSubmit(handleRegisterCustomer)}>
      <label className="mb-1 text-lg font-medium">Nome Completo</label>
     <Input 
        type="text"
        name="name"
        placeholder="Digite o nome completo"
        error={errors.name?.message}
        register={register}
     />
     <section className="flex gap-2 mt-2 my-2 flex-col sm:flex-row">
      <div className="flex-1">
        <label className="mb-1 text-lg font-medium">Telefone</label>
        
        <Input 
            type="number"
            name="phone"
            placeholder="Exemplo (DD) 9999999999"
            error={errors.phone?.message}
            register={register}
        />
        
      </div>

      <div className="flex-1">
        <label className="mb-1 text-lg font-medium">Email</label>
        <Input 
            type="email"
            name="email"
            placeholder="Digite o email..."
            error={errors.email?.message}
            register={register}
        />
      </div>
     </section>

      <label className="mb-1 text-lg font-medium">Endreço completo</label>
        <Input 
            type="text"
            name="address"
            placeholder="Digite o endereço do cliente..."
            error={errors.address?.message}
            register={register}
        />
        <button type="submit" className="bg-blue-500 my-4 px-2 h-11 rounded text-white font-bold">Cadastrar</button>
    </form>
  )
}