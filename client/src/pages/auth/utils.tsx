import * as Yup from 'yup'

export enum AUTH_FORM_FIELDS {
  NAME = 'name',
  EMAIL = 'email',
  PASSWORD = 'password',
  ADDRESS = 'address',
  ROLE = 'role',
}

export interface IAuthForm {
  [AUTH_FORM_FIELDS.NAME]: string
  [AUTH_FORM_FIELDS.EMAIL]: string
  [AUTH_FORM_FIELDS.PASSWORD]: string
  [AUTH_FORM_FIELDS.ADDRESS]: string
  [AUTH_FORM_FIELDS.ROLE]: string
}

export const defaultAuthFormValues: IAuthForm = {
  [AUTH_FORM_FIELDS.NAME]: '',
  [AUTH_FORM_FIELDS.EMAIL]: '',
  [AUTH_FORM_FIELDS.PASSWORD]: '',
  [AUTH_FORM_FIELDS.ADDRESS]: '',
  [AUTH_FORM_FIELDS.ROLE]: '',
}

export const authValidationSchema = (type: 'login' | 'signup') => {
  return Yup.object().shape({
    [AUTH_FORM_FIELDS.NAME]:
      type === 'signup'
        ? Yup.string()
            .required('Name is required')
            .min(20, 'Name must be at least 20 characters')
            .max(60, 'Name cannot exceed 60 characters')
        : Yup.string().notRequired(),

    [AUTH_FORM_FIELDS.EMAIL]: Yup.string()
      .required('Email is required')
      .matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Invalid email format'),

    [AUTH_FORM_FIELDS.PASSWORD]: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters')
      .max(16, 'Password cannot exceed 16 characters')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(
        /[@$!%*?&]/,
        'Password must contain at least one special character',
      ),

    [AUTH_FORM_FIELDS.ADDRESS]:
      type === 'signup'
        ? Yup.string()
            .required('Address is required')
            .max(400, 'Address cannot exceed 400 characters')
        : Yup.string().notRequired(),

    [AUTH_FORM_FIELDS.ROLE]:
      type === 'signup'
        ? Yup.string().required('Role is required')
        : Yup.string().notRequired(),
  })
}
