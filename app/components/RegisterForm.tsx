import React, { useRef, useState } from 'react'
import { useTextField } from 'react-aria';
import { useForm, UseFormRegisterReturn } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, FieldError, Form, Input, Label, TextField } from 'react-aria-components';
import { z } from 'zod';
import { FormType } from '../routes/login';
import { redirect, useNavigate } from '@tanstack/react-router';

const registerFormSchema = z.object({
  username: z.string(),
  password: z.string(),
})

type RegisterFormSchema = z.infer<typeof registerFormSchema>

function RegisterForm({handleFormChange}: {handleFormChange: (formType: FormType) => void}) {
  const [isFormValid, setIsFormValid] = useState<boolean | null>(null);

  const { register, handleSubmit, watch } = useForm<RegisterFormSchema>({
    resolver: zodResolver(registerFormSchema),
  })
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterFormSchema) => {
    try {
      const res = await fetch('http://localhost:3000/api/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
      })
      
      if (!res.ok) {
        throw new Error(await res.json());
      } else {
        navigate({
          to: '/',
          search: {}
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Form
      className={`
        flex flex-col
        space-y-4
        bg-white
        px-8 py-6
        rounded-md
        shadow-md
        text-gray-700
      `}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className='mx-auto'>
        <h1 className='text-xl font-extrabold uppercase'>Register</h1>
      </div>
      <RegisterFormField
        label="username"
        name="username"
        type="username"
        inputRegister={register('username')}
      />
      <RegisterFormField
        label="password"
        name="password"
        type="password"
        inputRegister={register('password')}
      />
      <div className='flex justify-between items-center'>

        <Button
          className={`
            bg-white
            rounded-md
            px-4 py-2 mr-auto
            font-bold
            uppercase
            w-fit
            hover:bg-gray-100  
            disabled:text-gray-400
          `}
          type="submit"
          onPress={() => handleFormChange(FormType.LOGIN)}
        >
          <small>Cancel</small>
        </Button>
        <Button
          className={`
            bg-white
            rounded-md
            px-4 py-2 ml-auto
            font-bold
            uppercase
            w-fit
            text-red-600
            hover:bg-gray-100  
            disabled:text-red-200
          `}
          type="submit"
          isDisabled={!watch('username') || !watch('password')}
        >
          <small>Register</small>
        </Button>
      </div>
    </Form>
  )
}

const RegisterFormFieldSchema = z.object({
  label: z.string(),
  name: z.string(),
  type: z.string(),
  inputRegister: z.custom<UseFormRegisterReturn>(),
  isRequired: z.boolean().or(z.undefined()),
})

type RegisterFormFieldProps = z.infer<typeof RegisterFormFieldSchema>

const RegisterFormField = (props: RegisterFormFieldProps) => {
  const { label, inputRegister, type } = props;
  const ref = useRef(null);

  return <div
    className={`
      flex flex-col
    `}
  >
    <label className='uppercase font-bold'>{label}</label>
    <input
      type={type}
      className={`
        bg-white
        border
        border-gray-300
        rounded-sm
        px-1
        w-80
      `}
      {...inputRegister}
    />
    <small>* This is a required field</small>
  </div>
} 
export { RegisterForm }