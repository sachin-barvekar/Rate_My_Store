import React, { useState } from 'react'
import { Button, ButtonToolbar, Col, InputGroup } from 'rsuite'
import { Formik, Form, FormikHelpers, FormikProps } from 'formik'
import {
  Modal,
  Panel,
  Row,
  Section,
  TextInput,
  FormikErrorMessage,
} from '../../../shared'
import EyeCloseIcon from '@rsuite/icons/EyeClose'
import EyeRoundIcon from '@rsuite/icons/EyeRound'
import { notifySuccess } from '../../../utils'
import {
  changePasswordValidationSchema,
  defaultChangePasswordValues,
  IChangePasswordForm,
  CHANGE_PASSWORD_FIELDS,
} from '../utils'
import { useChangePasswordMutation } from '../authApiSlice'

type Props = {
  isOpen: boolean
  onClose: () => void
}

const ChangePasswordModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [visibleOld, setVisibleOld] = useState<boolean>(false)
  const [visibleNew, setVisibleNew] = useState<boolean>(false)
  const [visibleConfirm, setVisibleConfirm] = useState<boolean>(false)

  const { OLD_PASSWORD, NEW_PASSWORD, CONFIRM_PASSWORD } =
    CHANGE_PASSWORD_FIELDS
  const handleOldPasswordVisibilityToggle = () => setVisibleOld(prev => !prev)
  const handleNewPasswordVisibilityToggle = () => setVisibleNew(prev => !prev)
  const handleConfirmPasswordVisibilityToggle = () =>
    setVisibleConfirm(prev => !prev)
  const [changePassword] = useChangePasswordMutation()

  const onSubmit = async (
    values: IChangePasswordForm,
    { setSubmitting, resetForm }: FormikHelpers<IChangePasswordForm>,
  ) => {
    try {
      const res = await changePassword(values)
      if (res.data) {
        notifySuccess('Password changed successfully!')
      }
      resetForm()
      setVisibleNew(false)
      setVisibleOld(false)
      setVisibleConfirm(false)
      onClose()
    } catch (error) {
      console.error('Password change failed', error)
    } finally {
      setSubmitting(false)
    }
  }
  const renderFormButtons = (formikProps: FormikProps<IChangePasswordForm>) => (
    <ButtonToolbar>
      <Button appearance='ghost' onClick={() => formikProps.resetForm()}>
        Reset
      </Button>
      <Button
        type='submit'
        appearance='primary'
        disabled={formikProps.isValidating || formikProps.isSubmitting}>
        Submit
      </Button>
    </ButtonToolbar>
  )

  return (
    <Modal
      secondary
      open={isOpen}
      onClose={onClose}
      title='Change Password'
      size='xs'
      body={
        <Formik
          initialValues={defaultChangePasswordValues}
          validationSchema={changePasswordValidationSchema()}
          onSubmit={onSubmit}>
          {(formikProps: FormikProps<IChangePasswordForm>) => (
            <Form className='create-edit-form'>
              <Panel bordered={false}>
                <Section title='Change Password'>
                  <Row>
                    <Col xs={24}>
                      <InputGroup inside>
                        <TextInput
                          formik={formikProps}
                          name={OLD_PASSWORD}
                          placeholder='Enter old password'
                          dataType={visibleOld ? 'string' : 'password'}
                        />
                        <InputGroup.Button
                          onClick={handleOldPasswordVisibilityToggle}>
                          {visibleOld ? <EyeRoundIcon /> : <EyeCloseIcon />}
                        </InputGroup.Button>
                      </InputGroup>
                      <FormikErrorMessage name={OLD_PASSWORD} />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={24}>
                      <InputGroup inside>
                        <TextInput
                          formik={formikProps}
                          name={NEW_PASSWORD}
                          placeholder='Enter new password'
                          dataType={visibleNew ? 'string' : 'password'}
                        />
                        <InputGroup.Button
                          onClick={handleNewPasswordVisibilityToggle}>
                          {visibleNew ? <EyeRoundIcon /> : <EyeCloseIcon />}
                        </InputGroup.Button>
                      </InputGroup>
                      <FormikErrorMessage name={NEW_PASSWORD} />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={24}>
                      <InputGroup inside>
                        <TextInput
                          formik={formikProps}
                          name={CONFIRM_PASSWORD}
                          placeholder='Enter confirm password'
                          dataType={visibleConfirm ? 'string' : 'password'}
                        />
                        <InputGroup.Button
                          onClick={handleConfirmPasswordVisibilityToggle}>
                          {visibleConfirm ? <EyeRoundIcon /> : <EyeCloseIcon />}
                        </InputGroup.Button>
                      </InputGroup>
                      <FormikErrorMessage name={CONFIRM_PASSWORD} />
                    </Col>
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

export default ChangePasswordModal
