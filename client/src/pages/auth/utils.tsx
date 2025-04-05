import * as Yup from 'yup'
import { User } from '../../contexts/types'

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
export const getInitialAuthFormValueFromResponse = (auth: User): IAuthForm => ({
  [AUTH_FORM_FIELDS.NAME]: auth?.name ?? '',
  [AUTH_FORM_FIELDS.EMAIL]: auth?.email ?? '',
  [AUTH_FORM_FIELDS.PASSWORD]: auth?.password ?? '',
  [AUTH_FORM_FIELDS.ADDRESS]: auth?.address ?? '',
  [AUTH_FORM_FIELDS.ROLE]: auth?.role ?? '',
})

export const defaultAuthFormValues: IAuthForm = {
  [AUTH_FORM_FIELDS.NAME]: '',
  [AUTH_FORM_FIELDS.EMAIL]: '',
  [AUTH_FORM_FIELDS.PASSWORD]: '',
  [AUTH_FORM_FIELDS.ADDRESS]: '',
  [AUTH_FORM_FIELDS.ROLE]: '',
}

export const authValidationSchema = (type: 'login' | 'signup' | 'edit') => {
  return Yup.object().shape({
    [AUTH_FORM_FIELDS.NAME]:
      type === 'signup' || type === 'edit'
        ? Yup.string()
            .required('Name is required')
            .min(20, 'Name must be at least 20 characters')
            .max(60, 'Name cannot exceed 60 characters')
        : Yup.string().notRequired(),

    [AUTH_FORM_FIELDS.EMAIL]: Yup.string()
      .required('Email is required')
      .matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Invalid email format'),

    [AUTH_FORM_FIELDS.PASSWORD]:
      type === 'login' || type === 'signup'
        ? Yup.string()
            .required('Password is required')
            .min(8, 'Password must be at least 8 characters')
            .max(16, 'Password cannot exceed 16 characters')
            .matches(
              /[A-Z]/,
              'Password must contain at least one uppercase letter',
            )
            .matches(
              /[@$!%*?&]/,
              'Password must contain at least one special character',
            )
        : Yup.string().notRequired(),

    [AUTH_FORM_FIELDS.ADDRESS]:
      type === 'signup' || type === 'edit'
        ? Yup.string()
            .required('Address is required')
            .max(400, 'Address cannot exceed 400 characters')
        : Yup.string().notRequired(),

    [AUTH_FORM_FIELDS.ROLE]:
      type === 'signup' || type === 'edit'
        ? Yup.string().required('Role is required')
        : Yup.string().notRequired(),
  })
}

export enum CHANGE_PASSWORD_FIELDS {
  OLD_PASSWORD = 'oldPassword',
  NEW_PASSWORD = 'newPassword',
  CONFIRM_PASSWORD = 'confirmPassword',
}

export interface IChangePasswordForm {
  [CHANGE_PASSWORD_FIELDS.OLD_PASSWORD]: string
  [CHANGE_PASSWORD_FIELDS.NEW_PASSWORD]: string
  [CHANGE_PASSWORD_FIELDS.CONFIRM_PASSWORD]: string
}
export const defaultChangePasswordValues: IChangePasswordForm = {
  [CHANGE_PASSWORD_FIELDS.OLD_PASSWORD]: '',
  [CHANGE_PASSWORD_FIELDS.NEW_PASSWORD]: '',
  [CHANGE_PASSWORD_FIELDS.CONFIRM_PASSWORD]: '',
}

export const changePasswordValidationSchema = () => {
  return Yup.object().shape({
    [CHANGE_PASSWORD_FIELDS.OLD_PASSWORD]: Yup.string().required(
      'Old password is required',
    ),

    [CHANGE_PASSWORD_FIELDS.NEW_PASSWORD]: Yup.string()
      .required('New password is required')
      .min(8, 'Password must be at least 8 characters')
      .max(16, 'Password cannot exceed 16 characters')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(
        /[@$!%*?&]/,
        'Password must contain at least one special character',
      )
      .test(
        'not-same-as-old',
        'New password must be different from old password',
        function (value) {
          const oldPassword = this.parent[CHANGE_PASSWORD_FIELDS.OLD_PASSWORD]
          return value !== oldPassword
        },
      ),

    [CHANGE_PASSWORD_FIELDS.CONFIRM_PASSWORD]: Yup.string()
      .required('Confirm password is required')
      .oneOf(
        [Yup.ref(CHANGE_PASSWORD_FIELDS.NEW_PASSWORD)],
        'Passwords must match',
      ),
  })
}
