import { useState } from 'react'
import { Button, ButtonToolbar, Col, InputGroup, Row } from 'rsuite'
import { loginImage } from '../../assets/images'
import { Formik, Form, FormikHelpers, FormikProps } from 'formik'
import './AuthPage.scss'
import {
  authValidationSchema,
  defaultAuthFormValues,
  AUTH_FORM_FIELDS,
} from './utils'
import { FormikErrorMessage, SelectDropdown, TextInput } from '../../shared'
import EyeCloseIcon from '@rsuite/icons/EyeClose'
import EyeRoundIcon from '@rsuite/icons/EyeRound'
import useAuth from '../../hooks/Auth'
import { useNavigate } from 'react-router-dom'

const AuthPage = () => {
  const [isSignUpMode, setIsSignUpMode] = useState(false)
  const navigate = useNavigate()
  const { NAME, EMAIL, PASSWORD, ADDRESS, ROLE } = AUTH_FORM_FIELDS
  const [visible, setVisible] = useState(false)
  const { login, signup } = useAuth()
  const handleChange = () => {
    setVisible(!visible)
  }

  const onSubmit = async (
    formValues: typeof defaultAuthFormValues,
    { setSubmitting }: FormikHelpers<typeof defaultAuthFormValues>,
  ) => {
    try {
      if (isSignUpMode) {
        await signup(
          formValues.name,
          formValues.email,
          formValues.password,
          formValues.address,
          formValues.role,
        )
        setIsSignUpMode(false)
      } else {
        await login(formValues.email, formValues.password)
        navigate('/')
      }
    } catch (error) {
      console.error('Authentication failed', error)
    } finally {
      setSubmitting(false)
    }
  }

  const renderFormButtons = (
    formikProps: FormikProps<typeof defaultAuthFormValues>,
  ) => (
    <ButtonToolbar className='auth-buttons'>
      <Button
        appearance='ghost'
        onClick={() => formikProps.resetForm()}
        size='sm'>
        Reset
      </Button>
      <Button
        appearance='primary'
        type='submit'
        size='sm'
        disabled={formikProps.isSubmitting}>
        {isSignUpMode ? 'Sign Up' : 'Login'}
      </Button>
    </ButtonToolbar>
  )

  return (
    <div className='login_page'>
      <div className='login_page_container'>
        <div className='left_side'>
          <h2 className='auth-title'>
            {isSignUpMode ? (
              'Create Account'
            ) : (
              <>
                Welcome Back to <span className='header_logo'>RateMY</span>Store
              </>
            )}
          </h2>
          <p className='auth-subtitle'>
            {isSignUpMode ? 'Sign up to continue' : 'Login to your account'}
          </p>
          <div className='form'>
            <Formik
              initialValues={defaultAuthFormValues}
              validationSchema={authValidationSchema(
                isSignUpMode ? 'signup' : 'login',
              )}
              onSubmit={onSubmit}>
              {(formikProps: FormikProps<typeof defaultAuthFormValues>) => (
                <Form className='auth-form'>
                  {isSignUpMode && (
                    <Row>
                      <Col xs={24}>
                        <TextInput
                          formik={formikProps}
                          name={NAME}
                          placeholder='Enter your name'
                        />
                        <FormikErrorMessage name={NAME} />
                      </Col>
                    </Row>
                  )}
                  <Row>
                    <Col xs={24}>
                      <TextInput
                        formik={formikProps}
                        name={EMAIL}
                        placeholder='Enter your email'
                      />
                      <FormikErrorMessage name={EMAIL} />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={24}>
                      <InputGroup inside>
                        <TextInput
                          formik={formikProps}
                          name={PASSWORD}
                          placeholder='Enter your password'
                          dataType={visible ? 'string' : 'password'}
                        />
                        <InputGroup.Button onClick={handleChange}>
                          {visible ? <EyeRoundIcon /> : <EyeCloseIcon />}
                        </InputGroup.Button>
                      </InputGroup>
                      <FormikErrorMessage name={PASSWORD} />
                    </Col>
                  </Row>
                  {isSignUpMode && (
                    <>
                      <Row>
                        <Col xs={24}>
                          <TextInput
                            formik={formikProps}
                            name={ADDRESS}
                            placeholder='Enter your address'
                          />
                          <FormikErrorMessage name={ADDRESS} />
                        </Col>
                      </Row>
                      <Row>
                        <Col xs={24}>
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
                      </Row>
                    </>
                  )}
                  {renderFormButtons(formikProps)}
                </Form>
              )}
            </Formik>

            <p className='register_btn'>
              {isSignUpMode ? (
                <>
                  Already have an account?{' '}
                  <Button
                    appearance='link'
                    onClick={() => setIsSignUpMode(false)}>
                    Login
                  </Button>
                </>
              ) : (
                <>
                  Don't have an account?{' '}
                  <Button
                    appearance='link'
                    onClick={() => setIsSignUpMode(true)}>
                    Sign up
                  </Button>
                </>
              )}
            </p>
          </div>
        </div>
        <div className='right_side'>
          <img src={loginImage} alt='Store Rating' />
        </div>
      </div>
    </div>
  )
}

export default AuthPage
