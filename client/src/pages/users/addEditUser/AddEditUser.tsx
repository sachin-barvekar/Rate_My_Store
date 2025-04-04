import React, { useMemo, useState } from 'react'
import { Button, ButtonToolbar, Col, InputGroup } from 'rsuite'
import { Formik, Form, FormikHelpers, FormikProps } from 'formik'
import {
  Modal,
  Panel,
  Row,
  Section,
  TextInput,
  SelectDropdown,
  FormikErrorMessage,
} from '../../../shared'
import {
  defaultAuthFormValues,
  authValidationSchema,
  IAuthForm,
  AUTH_FORM_FIELDS,
  getInitialAuthFormValueFromResponse,
} from '../../auth/utils'
import EyeCloseIcon from '@rsuite/icons/EyeClose'
import EyeRoundIcon from '@rsuite/icons/EyeRound'
import { notifySuccess } from '../../../utils'
import { useSignupMutation, useUpdateUserMutation } from '../userListApiSlice'
import '../../../scss/common/forms/Form.scss'
import { User } from '../../../contexts/types'

type Props = {
  isOpen: boolean
  onClose: () => void
  userData?: User
  isEditMode: boolean
}

const AddEditUser: React.FC<Props> = ({
  isOpen,
  onClose,
  userData,
  isEditMode,
}) => {
  const [visible, setVisible] = useState(false)
  const { NAME, EMAIL, PASSWORD, ROLE, ADDRESS } = AUTH_FORM_FIELDS

  const initialValues = useMemo(() => {
    return userData
      ? getInitialAuthFormValueFromResponse(userData)
      : defaultAuthFormValues
  }, [userData])

  const [createUser] = useSignupMutation()
  const [updateUser] = useUpdateUserMutation()

  const handleChange = () => setVisible(!visible)

  const onSubmit = async (
    formValues: IAuthForm,
    { setSubmitting }: FormikHelpers<IAuthForm>,
  ) => {
    try {
      if (isEditMode && userData?._id) {
        const response = await updateUser({
          id: userData._id,
          user: formValues,
        })
        if (response.data) {
          notifySuccess('User updated successfully!')
        }
      } else {
        const response = await createUser(formValues)
        if (response.data) {
          notifySuccess('User created successfully!')
        }
      }
      onClose()
    } catch (error) {
      console.error('Failed to process user request.', error)
    } finally {
      setSubmitting(false)
    }
  }

  const renderFormButtons = (formikProps: FormikProps<IAuthForm>) => (
    <ButtonToolbar>
      <Button appearance='ghost' onClick={() => formikProps.resetForm()}>
        Reset
      </Button>
      <Button
        type='submit'
        appearance='primary'
        disabled={formikProps.isValidating || formikProps.isSubmitting}>
        {isEditMode ? 'Save Changes' : 'Save'}
      </Button>
    </ButtonToolbar>
  )

  return (
    <Modal
      secondary
      open={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit User' : 'Add User'}
      size='md'
      body={
        <Formik
          initialValues={initialValues}
          validationSchema={authValidationSchema(
            isEditMode ? 'edit' : 'signup',
          )}
          onSubmit={onSubmit}
          enableReinitialize>
          {(formikProps: FormikProps<IAuthForm>) => (
            <Form className='create-edit-form'>
              <Panel bordered={false}>
                <Section title='User Details'>
                  <Row>
                    <Col xs={12}>
                      <TextInput
                        formik={formikProps}
                        name={NAME}
                        placeholder='Enter name'
                      />
                      <FormikErrorMessage name={NAME} />
                    </Col>
                    <Col xs={12}>
                      <TextInput
                        formik={formikProps}
                        name={EMAIL}
                        placeholder='Enter email'
                      />
                      <FormikErrorMessage name={EMAIL} />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12}>
                      <SelectDropdown
                        name={ROLE}
                        searchable={false}
                        data={[
                          { label: 'Admin', value: 'admin' },
                          { label: 'Store Owner', value: 'store_owner' },
                          { label: 'User', value: 'user' },
                        ]}
                        placeholder='Select Role'
                        value={formikProps.values[ROLE]}
                        onChange={value =>
                          formikProps.setFieldValue(ROLE, value)
                        }
                      />
                      <FormikErrorMessage name={ROLE} />
                    </Col>
                    <Col xs={12}>
                      <TextInput
                        formik={formikProps}
                        name={ADDRESS}
                        placeholder='Enter address'
                      />
                      <FormikErrorMessage name={ADDRESS} />
                    </Col>
                  </Row>
                  <Row>
                    {!isEditMode && (
                      <Col xs={12}>
                        <InputGroup inside>
                          <TextInput
                            formik={formikProps}
                            name={PASSWORD}
                            placeholder='Enter password'
                            dataType={visible ? 'string' : 'password'}
                          />
                          <InputGroup.Button onClick={handleChange}>
                            {visible ? <EyeRoundIcon /> : <EyeCloseIcon />}
                          </InputGroup.Button>
                        </InputGroup>
                        <FormikErrorMessage name={PASSWORD} />
                      </Col>
                    )}
                  </Row>
                </Section>
                <div className='form-button'>
                  {renderFormButtons(formikProps)}
                </div>
              </Panel>
            </Form>
          )}
        </Formik>
      }
    />
  )
}

export default AddEditUser
